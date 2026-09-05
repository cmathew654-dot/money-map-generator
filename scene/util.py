"""Low-level mesh construction helpers shared by every part of the build."""

import math

import bmesh
import bpy
from mathutils import Vector

TAU = math.pi * 2.0


# --------------------------------------------------------------------------
# scene / collection plumbing
# --------------------------------------------------------------------------

def wipe_scene():
    """Remove everything, including orphaned datablocks from a prior run."""
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for group in (
        bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.curves,
        bpy.data.lights, bpy.data.cameras, bpy.data.node_groups, bpy.data.textures,
        bpy.data.worlds, bpy.data.collections, bpy.data.fonts,
    ):
        for block in list(group):
            if block.users == 0:
                group.remove(block)


def collection(name, parent=None):
    if name in bpy.data.collections:
        return bpy.data.collections[name]
    col = bpy.data.collections.new(name)
    (parent or bpy.context.scene.collection).children.link(col)
    return col


def link(obj, col):
    for existing in obj.users_collection:
        existing.objects.unlink(obj)
    col.objects.link(obj)
    return obj


def mesh_object(name, bm, col, material=None):
    """Finalise a bmesh into a linked object."""
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    obj = bpy.data.objects.new(name, me)
    link(obj, col)
    if material is not None:
        assign(obj, material)
    return obj


def assign(obj, *materials):
    obj.data.materials.clear()
    for mat in materials:
        obj.data.materials.append(mat)
    return obj


def shade_smooth(obj, only_curved=False, threshold=0.72):
    """Flag polygons smooth. With `only_curved`, leave near-planar shells flat."""
    polys = obj.data.polygons
    if not only_curved:
        polys.foreach_set("use_smooth", [True] * len(polys))
    else:
        flags = []
        for poly in polys:
            ns = [polys[i].normal for i in range(len(polys))] if False else None
            flags.append(True)
        polys.foreach_set("use_smooth", flags)
    obj.data.update()
    return obj


def shade_flat(obj):
    obj.data.polygons.foreach_set("use_smooth", [False] * len(obj.data.polygons))
    obj.data.update()
    return obj


def bevel(obj, width=0.002, segments=3, angle=math.radians(45.0), clamp=True):
    mod = obj.modifiers.new("Bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = angle
    mod.use_clamp_overlap = clamp
    mod.harden_normals = True
    return obj


def solidify(obj, thickness, offset=-1.0):
    mod = obj.modifiers.new("Solidify", "SOLIDIFY")
    mod.thickness = thickness
    mod.offset = offset
    return obj


def subsurf(obj, levels=2, render=None):
    mod = obj.modifiers.new("Subsurf", "SUBSURF")
    mod.levels = levels
    mod.render_levels = levels if render is None else render
    return obj


# --------------------------------------------------------------------------
# primitive builders (bmesh level -- these return bmesh geometry, not objects)
# --------------------------------------------------------------------------

def bm_box(bm, center, size, uv=True):
    """Axis-aligned box. `size` is the full extent on each axis."""
    cx, cy, cz = center
    sx, sy, sz = (s * 0.5 for s in size)
    verts = [
        bm.verts.new((cx - sx, cy - sy, cz - sz)),
        bm.verts.new((cx + sx, cy - sy, cz - sz)),
        bm.verts.new((cx + sx, cy + sy, cz - sz)),
        bm.verts.new((cx - sx, cy + sy, cz - sz)),
        bm.verts.new((cx - sx, cy - sy, cz + sz)),
        bm.verts.new((cx + sx, cy - sy, cz + sz)),
        bm.verts.new((cx + sx, cy + sy, cz + sz)),
        bm.verts.new((cx - sx, cy + sy, cz + sz)),
    ]
    faces = [
        (0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4),
        (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7),
    ]
    out = [bm.faces.new([verts[i] for i in f]) for f in faces]
    if uv:
        _project_uvs(bm, out)
    return out


def box(name, center, size, col, material=None, bevel_width=0.0, segments=2):
    bm = bmesh.new()
    bm_box(bm, center, size)
    obj = mesh_object(name, bm, col, material)
    if bevel_width > 0.0:
        bevel(obj, bevel_width, segments)
    return obj


def rounded_rect_points(half_w, half_h, radius, corner_segments=8):
    """CCW point ring for a rectangle with rounded corners, in the XY plane."""
    radius = max(0.0, min(radius, half_w, half_h))
    if radius <= 1e-6:
        return [(half_w, half_h), (-half_w, half_h), (-half_w, -half_h), (half_w, -half_h)]
    ix, iy = half_w - radius, half_h - radius
    centers = [(ix, iy, 0.0), (-ix, iy, math.pi * 0.5),
               (-ix, -iy, math.pi), (ix, -iy, math.pi * 1.5)]
    pts = []
    for cx, cy, start in centers:
        for s in range(corner_segments + 1):
            a = start + (math.pi * 0.5) * (s / corner_segments)
            pts.append((cx + math.cos(a) * radius, cy + math.sin(a) * radius))
    # drop duplicated seam points between adjacent arcs
    deduped = [pts[0]]
    for p in pts[1:]:
        if (p[0] - deduped[-1][0]) ** 2 + (p[1] - deduped[-1][1]) ** 2 > 1e-12:
            deduped.append(p)
    if (deduped[0][0] - deduped[-1][0]) ** 2 + (deduped[0][1] - deduped[-1][1]) ** 2 < 1e-12:
        deduped.pop()
    return deduped


def superellipse_points(half_w, half_h, exponent=4.0, segments=48):
    """Squircle ring -- the shape a CRT bezel opening actually is."""
    pts = []
    for i in range(segments):
        a = TAU * i / segments
        ca, sa = math.cos(a), math.sin(a)
        x = math.copysign(abs(ca) ** (2.0 / exponent), ca) * half_w
        y = math.copysign(abs(sa) ** (2.0 / exponent), sa) * half_h
        pts.append((x, y))
    return pts


def loft(bm, rings, close=False, cap_start=True, cap_end=True, smooth=True):
    """Bridge a list of equal-length vertex rings into a tube/solid."""
    vrings = []
    for ring in rings:
        vrings.append([bm.verts.new(p) for p in ring])
    faces = []
    n = len(vrings[0])
    for a, b in zip(vrings, vrings[1:]):
        for i in range(n):
            j = (i + 1) % n
            try:
                f = bm.faces.new((a[i], a[j], b[j], b[i]))
                f.smooth = smooth
                faces.append(f)
            except ValueError:
                pass
    if close:
        for i in range(n):
            j = (i + 1) % n
            try:
                f = bm.faces.new((vrings[-1][i], vrings[-1][j], vrings[0][j], vrings[0][i]))
                f.smooth = smooth
                faces.append(f)
            except ValueError:
                pass
    if cap_start:
        try:
            faces.append(bm.faces.new(list(reversed(vrings[0]))))
        except ValueError:
            pass
    if cap_end:
        try:
            faces.append(bm.faces.new(vrings[-1]))
        except ValueError:
            pass
    return vrings, faces


def bridge_rings(bm, ring_a, ring_b, smooth=True):
    """Bridge two already-created vertex rings (used for annular caps)."""
    faces = []
    n = len(ring_a)
    for i in range(n):
        j = (i + 1) % n
        try:
            f = bm.faces.new((ring_a[i], ring_a[j], ring_b[j], ring_b[i]))
            f.smooth = smooth
            faces.append(f)
        except ValueError:
            pass
    return faces


def plane(name, center, size, col, material=None, subdivisions=0, rotation=(0, 0, 0)):
    bm = bmesh.new()
    w, h = size[0] * 0.5, size[1] * 0.5
    v = [bm.verts.new((-w, -h, 0.0)), bm.verts.new((w, -h, 0.0)),
         bm.verts.new((w, h, 0.0)), bm.verts.new((-w, h, 0.0))]
    f = bm.faces.new(v)
    uv = bm.loops.layers.uv.new()
    for loop, coord in zip(f.loops, [(0, 0), (1, 0), (1, 1), (0, 1)]):
        loop[uv].uv = coord
    if subdivisions:
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=subdivisions, use_grid_fill=True)
    obj = mesh_object(name, bm, col, material)
    obj.location = center
    obj.rotation_euler = rotation
    return obj


def cylinder(name, center, radius, height, col, material=None, segments=32,
             radius_top=None, cap=True, rotation=(0, 0, 0)):
    bm = bmesh.new()
    rt = radius if radius_top is None else radius_top
    ring_lo = [(math.cos(TAU * i / segments) * radius,
                math.sin(TAU * i / segments) * radius, -height * 0.5)
               for i in range(segments)]
    ring_hi = [(math.cos(TAU * i / segments) * rt,
                math.sin(TAU * i / segments) * rt, height * 0.5)
               for i in range(segments)]
    loft(bm, [ring_lo, ring_hi], cap_start=cap, cap_end=cap)
    obj = mesh_object(name, bm, col, material)
    obj.location = center
    obj.rotation_euler = rotation
    return obj


def uv_sphere(name, center, radius, col, material=None, segments=32, rings=16, scale=(1, 1, 1)):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=segments, v_segments=rings,
                              radius=radius, calc_uvs=True)
    obj = mesh_object(name, bm, col, material)
    obj.location = center
    obj.scale = scale
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def torus(name, center, major, minor, col, material=None, major_seg=48, minor_seg=12,
          rotation=(0, 0, 0)):
    bm = bmesh.new()
    rings = []
    for i in range(major_seg):
        a = TAU * i / major_seg
        cx, cy = math.cos(a) * major, math.sin(a) * major
        ring = []
        for j in range(minor_seg):
            b = TAU * j / minor_seg
            r = minor * math.cos(b)
            ring.append((cx + math.cos(a) * r, cy + math.sin(a) * r, math.sin(b) * minor))
        rings.append(ring)
    loft(bm, rings, close=True, cap_start=False, cap_end=False)
    obj = mesh_object(name, bm, col, material)
    obj.location = center
    obj.rotation_euler = rotation
    return obj


# --------------------------------------------------------------------------
# UVs
# --------------------------------------------------------------------------

def _project_uvs(bm, faces, scale=1.0):
    uv = bm.loops.layers.uv.verify()
    for f in faces:
        n = f.normal
        ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
        for loop in f.loops:
            co = loop.vert.co
            if az >= ax and az >= ay:
                loop[uv].uv = (co.x * scale, co.y * scale)
            elif ax >= ay:
                loop[uv].uv = (co.y * scale, co.z * scale)
            else:
                loop[uv].uv = (co.x * scale, co.z * scale)


def box_project(obj, scale=1.0):
    me = obj.data
    if not me.uv_layers:
        me.uv_layers.new(name="UVMap")
    uv = me.uv_layers.active.data
    for poly in me.polygons:
        n = poly.normal
        ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
        for li in poly.loop_indices:
            co = me.vertices[me.loops[li].vertex_index].co
            if az >= ax and az >= ay:
                uv[li].uv = (co.x * scale, co.y * scale)
            elif ax >= ay:
                uv[li].uv = (co.y * scale, co.z * scale)
            else:
                uv[li].uv = (co.x * scale, co.z * scale)
    return obj


# --------------------------------------------------------------------------
# text
# --------------------------------------------------------------------------

_FONT_PATHS = {
    "bold": [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    ],
    "regular": [
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
    ],
    "serif": [
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    ],
    "mono": [
        "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
    ],
}

_font_cache = {}


def font(kind="bold"):
    import os
    if kind in _font_cache:
        return _font_cache[kind]
    for path in _FONT_PATHS.get(kind, []):
        if os.path.exists(path):
            _font_cache[kind] = bpy.data.fonts.load(path)
            return _font_cache[kind]
    _font_cache[kind] = None          # Blender's built-in Bfont
    return None


def text(name, body, col, material=None, size=0.1, kind="bold", align="CENTER",
         location=(0, 0, 0), rotation=(0, 0, 0), extrude=0.0, spacing=1.0,
         char_spacing=1.0, line_spacing=1.0):
    cu = bpy.data.curves.new(name, "FONT")
    cu.body = body
    cu.size = size
    cu.align_x = align
    cu.align_y = "CENTER"
    cu.space_character = char_spacing
    cu.space_word = spacing
    cu.space_line = line_spacing
    cu.extrude = extrude
    cu.resolution_u = 3
    f = font(kind)
    if f:
        cu.font = f
    obj = bpy.data.objects.new(name, cu)
    link(obj, col)
    obj.location = location
    obj.rotation_euler = rotation
    if material is not None:
        obj.data.materials.append(material)
    return obj


# --------------------------------------------------------------------------
# misc
# --------------------------------------------------------------------------

def parent_to(children, parent):
    for c in children:
        c.parent = parent
        c.matrix_parent_inverse = parent.matrix_world.inverted()
    return parent


def empty(name, location, col):
    obj = bpy.data.objects.new(name, None)
    obj.empty_display_type = "PLAIN_AXES"
    obj.empty_display_size = 0.1
    obj.location = location
    link(obj, col)
    return obj


def strut(name, a, b, radius, col, material=None, segments=16,
          radius_top=None, extend=0.0):
    """A cylinder spanning two points -- joints, arms, legs, rails."""
    import mathutils
    va, vb = mathutils.Vector(a), mathutils.Vector(b)
    d = vb - va
    length = d.length + extend
    mid = (va + vb) * 0.5
    obj = cylinder(name, tuple(mid), radius, length, col, material,
                   segments=segments, radius_top=radius_top)
    obj.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    shade_smooth(obj)
    return obj


def lerp(a, b, t):
    return a + (b - a) * t


def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3.0 - 2.0 * t)
