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

from . import palette as P
from . import util as U

# Surfaces worth spending texture memory on: large, flat and static.
# Match on exact names, not prefixes -- "Back_" once caught all 54 props in
# the meeting room and set the baker grinding 1024px lightmaps for plant soil.
LIGHTMAP_NAMES = frozenset((
    "Floor", "Ceiling", "RightWall",
    "BackWall_0", "BackWall_1", "BackWall_Header",
    "Left_Below", "Left_Above", "Left_Front", "Left_Back",
    "Back_LeftWall", "Back_RightWall", "Back_EndWall",
    "Desk_Top", "Desk_Batten",
))

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
    """Blender appends .001/.002 to duplicate names; compare on the stem."""
    return obj.name.split(".")[0] in LIGHTMAP_NAMES


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

    # Parent without a parent-inverse: the face must inherit the monitor's
    # placement on the desk, not sit at the world origin.
    crt_root = bpy.data.objects.get("CRT_Root")
    if crt_root:
        obj.parent = crt_root
    obj.location = (0.0, CRT.GLASS_EDGE_Y + 0.004, CRT.SCREEN_CZ)
    bpy.context.view_layer.update()
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


def bake_lightmaps(size=1024, samples=128, out_dir="export/lightmaps",
                   time_budget=None, skip_existing=True):
    """Bake full lighting into a texture per large surface.

    Resumable on purpose. A long bake cannot rely on outliving the session
    that started it, so each surface is written as it finishes, existing
    outputs are skipped, and `time_budget` stops the run cleanly part-way
    through for the next invocation to pick up.
    """
    import time as _time
    started = _time.time()
    _bake_settings(samples=samples)
    os.makedirs(out_dir, exist_ok=True)
    written, remaining = [], 0
    for obj in _mesh_objects():
        if not wants_lightmap(obj) or "Lightmap" not in obj.data.uv_layers:
            continue
        dest = os.path.join(out_dir, "LM_%s.png" % obj.name)
        if skip_existing and os.path.exists(dest):
            continue
        if time_budget and _time.time() - started > time_budget:
            remaining += 1
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
            img.filepath_raw = os.path.abspath(dest)
            img.file_format = "PNG"
            img.save()
            written.append(dest)
            print("      baked %s (%.0fs)" % (obj.name, _time.time() - started),
                  flush=True)
        except RuntimeError as err:
            print("      FAILED %s: %s" % (obj.name, err), flush=True)
        for mat, node in nodes_added:
            mat.node_tree.nodes.remove(node)
        obj.data.uv_layers.active = obj.data.uv_layers[0]
        bpy.data.images.remove(img)
    if remaining:
        print("      %d left for the next run" % remaining, flush=True)
    return written


# Representative flat colours for shaders whose Base Color is node-driven.
# glTF cannot carry a node graph, so without these the exporter falls back to
# white -- and these happen to be the largest surfaces in the room.
FALLBACK_COLOR = {
    "Desk Wood": P.DESK_WOOD,
    "Floor Wood": P.FLOOR_WOOD,
    "Brick": P.BRICK,
    "Monstera Leaf": P.FOLIAGE,
    "Pothos Leaf": P.FOLIAGE_LIGHT,
    "Speckle Glaze": P.CERAMIC_SPECKLE,
}


def flatten_procedural_colors(default="#9A9182"):
    """Give every node-driven Base Color a flat value the exporter can carry.

    Run before export whenever the albedo bake has not been applied. Without
    it the desk, floor, brick and foliage all arrive pure white.
    """
    fixed = []
    for mat in bpy.data.materials:
        if not mat.use_nodes:
            continue
        bsdf = next((n for n in mat.node_tree.nodes
                     if n.type == "BSDF_PRINCIPLED"), None)
        if bsdf is None:
            continue
        socket = bsdf.inputs["Base Color"]
        if not socket.is_linked:
            continue
        hex_code = FALLBACK_COLOR.get(mat.name)
        if hex_code is None:
            for key, value in FALLBACK_COLOR.items():
                if key.split()[0] in mat.name:
                    hex_code = value
                    break
        colour = P.srgb(hex_code or default)
        for link in list(socket.links):
            mat.node_tree.links.remove(link)
        socket.default_value = colour
        fixed.append(mat.name)
    return fixed


def tame_emission(cap=2.5):
    """Clamp emission strengths for a realtime runtime.

    Cycles happily takes a bulb at 40; in a renderer with no GI that is just a
    blown white blob, so cap it and let the runtime's own lights do the work.
    """
    tamed = 0
    for mat in bpy.data.materials:
        if not mat.use_nodes:
            continue
        for node in mat.node_tree.nodes:
            if node.type == "EMISSION" and node.inputs["Strength"].default_value > cap:
                node.inputs["Strength"].default_value = cap
                tamed += 1
    return tamed


def apply_lightmaps(in_dir="export/lightmaps", as_jpeg=True, quality=88):
    """Wire the baked lightmaps back in as each surface's colour.

    These are COMBINED bakes, so the texture already carries albedo, direct
    light and bounce together. The material becomes a flat unlit lookup of it,
    sampled through the Lightmap UV channel; the runtime then draws these
    surfaces with no lighting at all and gets the Cycles result for free.
    """
    applied = []
    for obj in _mesh_objects():
        if not wants_lightmap(obj):
            continue
        path = os.path.join(in_dir, "LM_%s.png" % obj.name)
        if not os.path.exists(path):
            continue
        img = bpy.data.images.load(os.path.abspath(path), check_existing=True)
        if as_jpeg:
            # PNG lightmaps dominate the payload; JPEG is fine for smooth
            # lighting gradients and roughly a fifth of the bytes.
            img.file_format = "JPEG"
            try:
                bpy.context.scene.render.image_settings.quality = quality
            except AttributeError:
                pass

        mat = bpy.data.materials.new("Baked_" + obj.name)
        mat.use_nodes = True
        nt = mat.node_tree
        nt.nodes.clear()
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        out.location = (400, 0)
        bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
        bsdf.location = (120, 0)
        bsdf.inputs["Roughness"].default_value = 1.0
        bsdf.inputs["Metallic"].default_value = 0.0
        if "Specular IOR Level" in bsdf.inputs:
            bsdf.inputs["Specular IOR Level"].default_value = 0.0
        tex = nt.nodes.new("ShaderNodeTexImage")
        tex.location = (-200, 0)
        tex.image = img
        uv = nt.nodes.new("ShaderNodeUVMap")
        uv.location = (-420, 0)
        uv.uv_map = "Lightmap"
        nt.links.new(uv.outputs["UV"], tex.inputs["Vector"])
        nt.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
        nt.links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])

        obj.data.materials.clear()
        obj.data.materials.append(mat)
        applied.append(obj.name)
    return applied


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


def export_glb(path, draco=True, draco_level=6, lights=False):
    """Write a GLB.

    Lights default to OFF. Blender's lamps convert to glTF punctual lights in
    physical units -- a sun exports at ~5300 lux and a task lamp at ~6400
    candela -- which drown any hand-tuned realtime lighting and render the
    whole scene white. A runtime that bakes or relights wants none of them.
    """
    os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
    kwargs = dict(
        filepath=os.path.abspath(path), export_format="GLB",
        export_apply=True, export_cameras=True, export_lights=lights,
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
    report["flattened"] = flatten_procedural_colors()
    report["emission_tamed"] = tame_emission()
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
