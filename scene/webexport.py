"""Turn the Cycles scene into assets a browser can run at 60fps.

The strategy is the classic baked-archviz one: Cycles works out the lighting
once, offline, and bakes it into the assets. The web runtime then draws
unlit surfaces that already carry that lighting, so there are no realtime
lights, no shadow maps, and no GI to solve per frame -- and the result looks
like the render rather than like a game.

Two bake targets, chosen by how much screen area a surface covers:

* Large, flat, static surfaces (floor, walls, ceiling, desk) get texture
  lightmaps on a second UV channel. They need the resolution.
* Everything else bakes into vertex colours. No UVs, no texture memory, and
  at prop density the interpolation is invisible.

Procedural materials are baked to albedo textures separately, because glTF
cannot carry a shader network.
"""

import math
import os

import bpy

from . import util as U

# surfaces worth spending texture memory on
LIGHTMAP_PREFIXES = (
    "Floor", "Ceiling", "BackWall", "Left_", "RightWall", "Back_",
    "Desk_Top", "Desk_Batten", "Wall_", "Win_Reveal",
)

# materials whose look lives in a node graph rather than a flat colour
PROCEDURAL_MATERIALS = (
    "Desk Wood", "Floor Wood", "Brick", "Wall Paint", "Wall Paint Warm",
    "Ceiling Paint", "CRT Case", "Keycap", "Pad Base", "Back_Rug Pile",
)


def _mesh_objects():
    return [o for o in bpy.data.objects if o.type == "MESH" and o.data.polygons]


def _select_only(objs):
    for obj in bpy.data.objects:
        obj.select_set(False)
    for obj in objs:
        obj.select_set(True)
    if objs:
        bpy.context.view_layer.objects.active = objs[0]


def wants_lightmap(obj):
    return any(obj.name.startswith(p) for p in LIGHTMAP_PREFIXES)


# --------------------------------------------------------------------------
# geometry prep
# --------------------------------------------------------------------------

def convert_text_and_curves():
    """glTF carries meshes, so font and curve objects have to be realised."""
    converted = 0
    for obj in list(bpy.data.objects):
        if obj.type not in {"FONT", "CURVE"}:
            continue
        _select_only([obj])
        try:
            bpy.ops.object.convert(target="MESH")
            converted += 1
        except RuntimeError:
            pass
    return converted


def apply_modifiers():
    """Bake modifier stacks down so the exporter and the baker agree."""
    applied = 0
    for obj in _mesh_objects():
        if not obj.modifiers:
            continue
        _select_only([obj])
        for mod in list(obj.modifiers):
            try:
                bpy.ops.object.modifier_apply(modifier=mod.name)
                applied += 1
            except RuntimeError:
                obj.modifiers.remove(mod)
    return applied


def add_lightmap_uvs(angle=math.radians(66.0), margin=0.04):
    """Give every lightmapped surface a second, non-overlapping UV channel."""
    prepared = []
    for obj in _mesh_objects():
        if not wants_lightmap(obj):
            continue
        while len(obj.data.uv_layers) < 1:
            obj.data.uv_layers.new(name="UVMap")
        if "Lightmap" not in obj.data.uv_layers:
            obj.data.uv_layers.new(name="Lightmap")
        obj.data.uv_layers.active = obj.data.uv_layers["Lightmap"]
        _select_only([obj])
        try:
            bpy.ops.object.mode_set(mode="EDIT")
            bpy.ops.mesh.select_all(action="SELECT")
            bpy.ops.uv.smart_project(angle_limit=angle, island_margin=margin)
            bpy.ops.object.mode_set(mode="OBJECT")
            prepared.append(obj)
        except RuntimeError:
            bpy.ops.object.mode_set(mode="OBJECT")
        obj.data.uv_layers.active = obj.data.uv_layers[0]
    return prepared


def split_screen_face(name="CRT_ScreenFace"):
    """Isolate the picture area as its own flat, unit-UV mesh.

    This is the anchor the web runtime positions its live `<iframe>` against,
    so it wants clean planar UVs and a predictable name.
    """
    from . import crt as CRT
    import bmesh

    col = U.collection("WebExport", bpy.context.scene.collection)
    bm = bmesh.new()
    hw, hh = CRT.SCREEN_HW * 0.985, CRT.SCREEN_HH * 0.985
    verts = [bm.verts.new(v) for v in
             ((-hw, 0.0, -hh), (hw, 0.0, -hh), (hw, 0.0, hh), (-hw, 0.0, hh))]
    face = bm.faces.new(verts)
    uv = bm.loops.layers.uv.new("UVMap")
    for loop, coord in zip(face.loops, ((0, 0), (1, 0), (1, 1), (0, 1))):
        loop[uv].uv = coord
    obj = U.mesh_object(name, bm, col)

    crt_root = bpy.data.objects.get("CRT_Root")
    if crt_root:
        obj.parent = crt_root
        obj.matrix_parent_inverse = crt_root.matrix_world.inverted()
    obj.location = (0.0, CRT.GLASS_EDGE_Y + 0.004, CRT.SCREEN_CZ)
    return obj


# --------------------------------------------------------------------------
# baking
# --------------------------------------------------------------------------

def _bake_settings(samples=96, margin=6, use_color=True):
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    bake = scene.render.bake
    bake.margin = margin
    bake.use_pass_direct = True
    bake.use_pass_indirect = True
    bake.use_pass_color = use_color
    bake.use_selected_to_active = False
    return scene


def bake_vertex_lighting(samples=64, limit=None):
    """Bake full lighting into a vertex colour layer on the small props."""
    _bake_settings(samples=samples)
    targets = [o for o in _mesh_objects()
               if not wants_lightmap(o) and len(o.data.vertices) > 3]
    if limit:
        targets = targets[:limit]
    done, failed = 0, 0
    for obj in targets:
        if "Baked" not in obj.data.color_attributes:
            try:
                obj.data.color_attributes.new(
                    name="Baked", type="FLOAT_COLOR", domain="CORNER")
            except RuntimeError:
                failed += 1
                continue
        obj.data.color_attributes.active_color = \
            obj.data.color_attributes["Baked"]
        _select_only([obj])
        try:
            bpy.ops.object.bake(type="COMBINED", target="VERTEX_COLORS")
            done += 1
        except RuntimeError:
            failed += 1
    return done, failed


def bake_lightmaps(size=1024, samples=128, out_dir="export/lightmaps"):
    """Bake full lighting into a texture per large surface."""
    _bake_settings(samples=samples)
    os.makedirs(out_dir, exist_ok=True)
    written = []
    for obj in _mesh_objects():
        if not wants_lightmap(obj) or "Lightmap" not in obj.data.uv_layers:
            continue
        img = bpy.data.images.new("LM_" + obj.name, size, size,
                                  float_buffer=False)
        nodes_added = []
        for mat in obj.data.materials:
            if mat is None or not mat.use_nodes:
                continue
            node = mat.node_tree.nodes.new("ShaderNodeTexImage")
            node.image = img
            node.select = True
            mat.node_tree.nodes.active = node
            nodes_added.append((mat, node))
        if not nodes_added:
            bpy.data.images.remove(img)
            continue
        obj.data.uv_layers.active = obj.data.uv_layers["Lightmap"]
        _select_only([obj])
        try:
            bpy.ops.object.bake(type="COMBINED")
            path = os.path.join(out_dir, "LM_%s.png" % obj.name)
            img.filepath_raw = os.path.abspath(path)
            img.file_format = "PNG"
            img.save()
            written.append(path)
        except RuntimeError:
            pass
        for mat, node in nodes_added:
            mat.node_tree.nodes.remove(node)
        obj.data.uv_layers.active = obj.data.uv_layers[0]
        bpy.data.images.remove(img)
    return written


def bake_material_albedo(size=1024, out_dir="export/albedo"):
    """Flatten the procedural shaders to base-colour textures.

    glTF has no way to carry a node graph, so without this the wood grain,
    brick and fabric weave arrive as solid colours.
    """
    _bake_settings(samples=8, use_color=True)
    scene = bpy.context.scene
    scene.render.bake.use_pass_direct = False
    scene.render.bake.use_pass_indirect = False
    os.makedirs(out_dir, exist_ok=True)
    written = []
    for mat_name in PROCEDURAL_MATERIALS:
        mat = bpy.data.materials.get(mat_name)
        if mat is None or not mat.use_nodes:
            continue
        users = [o for o in _mesh_objects()
                 if mat.name in [m.name for m in o.data.materials if m]]
        if not users:
            continue
        obj = max(users, key=lambda o: len(o.data.polygons))
        img = bpy.data.images.new("ALB_" + mat_name, size, size)
        node = mat.node_tree.nodes.new("ShaderNodeTexImage")
        node.image = img
        node.select = True
        mat.node_tree.nodes.active = node
        _select_only([obj])
        try:
            bpy.ops.object.bake(type="DIFFUSE")
            path = os.path.join(out_dir, "ALB_%s.png" % mat_name.replace(" ", "_"))
            img.filepath_raw = os.path.abspath(path)
            img.file_format = "PNG"
            img.save()
            written.append(path)
        except RuntimeError:
            pass
        mat.node_tree.nodes.remove(node)
        bpy.data.images.remove(img)
    return written


# --------------------------------------------------------------------------
# export
# --------------------------------------------------------------------------

def decimate(ratio=0.6, min_polys=400):
    """Thin the heavy props for a mobile-friendly second GLB."""
    reduced = 0
    for obj in _mesh_objects():
        if len(obj.data.polygons) < min_polys or wants_lightmap(obj):
            continue
        mod = obj.modifiers.new("Decimate", "DECIMATE")
        mod.ratio = ratio
        _select_only([obj])
        try:
            bpy.ops.object.modifier_apply(modifier=mod.name)
            reduced += 1
        except RuntimeError:
            obj.modifiers.remove(mod)
    return reduced


def export_glb(path, draco=True, draco_level=6):
    os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
    kwargs = dict(
        filepath=os.path.abspath(path), export_format="GLB",
        export_apply=True, export_cameras=True, export_lights=True,
        export_yup=True, export_texcoords=True, export_normals=True,
        export_materials="EXPORT",
    )
    if draco:
        kwargs.update(export_draco_mesh_compression_enable=True,
                      export_draco_mesh_compression_level=draco_level)
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError:
        kwargs.pop("export_draco_mesh_compression_enable", None)
        kwargs.pop("export_draco_mesh_compression_level", None)
        bpy.ops.export_scene.gltf(**kwargs)
    return os.path.abspath(path)


def run(out_dir="export", lightmap_size=1024, vertex_samples=64,
        lightmap_samples=128, do_vertex=True, do_lightmaps=True,
        do_albedo=True, mobile_ratio=None):
    """Full pipeline: prep, bake, export."""
    report = {}
    report["converted"] = convert_text_and_curves()
    report["modifiers"] = apply_modifiers()
    report["screen_face"] = split_screen_face().name
    if do_lightmaps:
        report["lightmap_uvs"] = len(add_lightmap_uvs())
    if do_albedo:
        report["albedo"] = bake_material_albedo(
            out_dir=os.path.join(out_dir, "albedo"))
    if do_lightmaps:
        report["lightmaps"] = bake_lightmaps(
            size=lightmap_size, samples=lightmap_samples,
            out_dir=os.path.join(out_dir, "lightmaps"))
    if do_vertex:
        report["vertex_baked"] = bake_vertex_lighting(samples=vertex_samples)
    report["glb"] = export_glb(os.path.join(out_dir, "clover-studio.glb"))
    if mobile_ratio:
        report["decimated"] = decimate(ratio=mobile_ratio)
        report["glb_mobile"] = export_glb(
            os.path.join(out_dir, "clover-studio-mobile.glb"))
    return report
