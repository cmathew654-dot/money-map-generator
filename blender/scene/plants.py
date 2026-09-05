"""Procedural houseplants: monstera, trailing pothos, and shelf greenery.

Each leaf is a curved, tapered blade built from a mid-rib spline, so the
foliage catches the window light with real variation instead of reading as
flat cards.
"""

import math
import random

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import util as U


def _leaf_mesh(bm, length, width, curl, twist, lobes=0, seed=0):
    """One leaf, built as a lofted blade along a gently arcing mid-rib."""
    rng = random.Random(seed)
    steps = 11
    rings = []
    for i in range(steps):
        t = i / (steps - 1.0)
        # mid-rib: arcs up then droops
        y = length * t
        z = math.sin(t * math.pi * 0.92) * length * curl * 0.42 - \
            (t ** 2.4) * length * curl * 0.55
        # blade half-width -- fat in the middle, pointed at the tip
        w = width * math.sin(min(1.0, t * 1.06) * math.pi) ** 0.62
        if lobes and 0.14 < t < 0.94:
            notch = abs(math.sin(t * math.pi * lobes))
            w *= U.lerp(0.42, 1.0, notch ** 0.55)
        rot = twist * t
        rings.append((y, z, max(w, 0.0006), rot))

    verts = []
    for y, z, w, rot in rings:
        row = []
        for sx in (-1.0, -0.42, 0.0, 0.42, 1.0):
            x = sx * w
            # slight V-fold along the rib
            dz = (abs(sx) ** 1.7) * w * 0.30
            cx = x * math.cos(rot) - dz * math.sin(rot)
            cz = x * math.sin(rot) + dz * math.cos(rot)
            row.append(bm.verts.new((cx, y, z + cz)))
        verts.append(row)
    for a, b in zip(verts, verts[1:]):
        for i in range(len(a) - 1):
            try:
                f = bm.faces.new((a[i], a[i + 1], b[i + 1], b[i]))
                f.smooth = True
            except ValueError:
                pass
    return verts


def _stem(bm, start, end, radius, segments=6, bow=0.0):
    ax = (end[0] - start[0], end[1] - start[1], end[2] - start[2])
    rings = []
    for i in range(segments + 1):
        t = i / segments
        cx = start[0] + ax[0] * t
        cy = start[1] + ax[1] * t
        cz = start[2] + ax[2] * t + math.sin(t * math.pi) * bow
        r = radius * U.lerp(1.0, 0.45, t)
        ring = [(cx + math.cos(U.TAU * j / 8) * r,
                 cy + math.sin(U.TAU * j / 8) * r, cz) for j in range(8)]
        rings.append(ring)
    U.loft(bm, rings, cap_start=True, cap_end=True, smooth=True)


def monstera(parent_collection, name, location, scale=1.0, seed=1,
             leaves=9, pot_radius=0.115, pot_height=0.150,
             pot_color=P.POT_TERRA):
    """Big floor or shelf plant with split leaves."""
    rng = random.Random(seed)
    col = U.collection(name, parent_collection)
    root = U.empty(name + "_Root", location, col)
    root.scale = (scale, scale, scale)

    pot = _pot(col, name, pot_radius, pot_height, pot_color)
    pot.parent = root

    bm = bmesh.new()
    for i in range(leaves):
        a = U.TAU * i / leaves + rng.uniform(-0.35, 0.35)
        lean = rng.uniform(0.55, 1.15)
        height = pot_height + rng.uniform(0.10, 0.34)
        length = rng.uniform(0.20, 0.32)
        width = length * rng.uniform(0.34, 0.46)
        base = (math.cos(a) * rng.uniform(0.0, 0.03),
                math.sin(a) * rng.uniform(0.0, 0.03), pot_height * 0.85)
        tipx = math.cos(a) * math.sin(lean) * height * 0.7
        tipy = math.sin(a) * math.sin(lean) * height * 0.7
        stem_end = (base[0] + tipx, base[1] + tipy, base[2] + height * 0.72)
        _stem(bm, base, stem_end, 0.0055, bow=rng.uniform(0.01, 0.05))

        sub = bmesh.new()
        _leaf_mesh(sub, length, width, rng.uniform(0.35, 0.75),
                   rng.uniform(-0.25, 0.25), lobes=rng.choice((5, 6, 7)),
                   seed=seed * 31 + i)
        me = bpy.data.meshes.new("tmp")
        sub.to_mesh(me)
        sub.free()
        import mathutils
        rot = mathutils.Euler((lean * 0.55 - 0.35, 0.0, a + math.pi * 0.5),
                              "XYZ").to_matrix().to_4x4()
        rot.translation = stem_end
        me.transform(rot)
        bm.from_mesh(me)
        bpy.data.meshes.remove(me)

    foliage = U.mesh_object(name + "_Foliage", bm, col,
                            M.leaf("Monstera Leaf", P.FOLIAGE, rough=0.38))
    U.shade_smooth(foliage)
    U.solidify(foliage, 0.0014, offset=0.0)
    foliage.parent = root
    return root


def pothos(parent_collection, name, location, scale=1.0, seed=2, vines=7,
           pot_radius=0.075, pot_height=0.090, pot_color=P.POT_WHITE,
           trail=0.55):
    """Trailing plant for shelves and the window ledge."""
    rng = random.Random(seed)
    col = U.collection(name, parent_collection)
    root = U.empty(name + "_Root", location, col)
    root.scale = (scale, scale, scale)

    pot = _pot(col, name, pot_radius, pot_height, pot_color)
    pot.parent = root

    bm = bmesh.new()
    import mathutils
    for v in range(vines):
        a = U.TAU * v / vines + rng.uniform(-0.3, 0.3)
        drop = trail * rng.uniform(0.55, 1.15)
        segs = max(4, int(drop / 0.06))
        pts = []
        for i in range(segs + 1):
            t = i / segs
            r = pot_radius * U.lerp(0.35, 1.35, t)
            pts.append((math.cos(a) * r + math.sin(t * 5.0) * 0.012,
                        math.sin(a) * r + math.cos(t * 4.0) * 0.012,
                        pot_height * 0.9 - drop * (t ** 1.6)))
        for p0, p1 in zip(pts, pts[1:]):
            _stem(bm, p0, p1, 0.0022)
        for i, p in enumerate(pts[1:], 1):
            for side in (-1, 1):
                if rng.random() < 0.45:
                    continue
                length = rng.uniform(0.045, 0.085)
                sub = bmesh.new()
                _leaf_mesh(sub, length, length * 0.62, rng.uniform(0.3, 0.6),
                           rng.uniform(-0.3, 0.3), seed=seed * 17 + v * 13 + i)
                me = bpy.data.meshes.new("tmp")
                sub.to_mesh(me)
                sub.free()
                rot = mathutils.Euler((rng.uniform(0.6, 1.5),
                                       rng.uniform(-0.4, 0.4),
                                       a + side * 1.2 + rng.uniform(-0.5, 0.5)),
                                      "XYZ").to_matrix().to_4x4()
                rot.translation = p
                me.transform(rot)
                bm.from_mesh(me)
                bpy.data.meshes.remove(me)

    foliage = U.mesh_object(name + "_Foliage", bm, col,
                            M.leaf("Pothos Leaf", P.FOLIAGE_LIGHT, rough=0.36))
    U.shade_smooth(foliage)
    U.solidify(foliage, 0.0010, offset=0.0)
    foliage.parent = root
    return root


def bushy(parent_collection, name, location, scale=1.0, seed=5, blades=48,
          pot_radius=0.080, pot_height=0.095, pot_color=P.POT_WHITE,
          height=0.28, color=P.FOLIAGE):
    """A dense small plant -- fills shelves and the desk edge."""
    rng = random.Random(seed)
    col = U.collection(name, parent_collection)
    root = U.empty(name + "_Root", location, col)
    root.scale = (scale, scale, scale)
    pot = _pot(col, name, pot_radius, pot_height, pot_color)
    pot.parent = root

    import mathutils
    bm = bmesh.new()
    for i in range(blades):
        a = rng.uniform(0.0, U.TAU)
        lean = rng.uniform(0.25, 1.05)
        length = height * rng.uniform(0.55, 1.15)
        sub = bmesh.new()
        _leaf_mesh(sub, length, length * rng.uniform(0.13, 0.24),
                   rng.uniform(0.5, 1.0), rng.uniform(-0.6, 0.6),
                   seed=seed * 7 + i)
        me = bpy.data.meshes.new("tmp")
        sub.to_mesh(me)
        sub.free()
        rot = mathutils.Euler((lean, 0.0, a), "XYZ").to_matrix().to_4x4()
        rot.translation = (math.cos(a) * rng.uniform(0.0, pot_radius * 0.6),
                           math.sin(a) * rng.uniform(0.0, pot_radius * 0.6),
                           pot_height * 0.88)
        me.transform(rot)
        bm.from_mesh(me)
        bpy.data.meshes.remove(me)
    foliage = U.mesh_object(name + "_Foliage", bm, col,
                            M.leaf("Bushy Leaf " + color, color, rough=0.40))
    U.shade_smooth(foliage)
    U.solidify(foliage, 0.0008, offset=0.0)
    foliage.parent = root
    return root


def _pot(col, name, radius, height, color):
    mat = (M.terracotta() if color == P.POT_TERRA
           else M.ceramic("Pot Glaze " + color, color, rough=0.35))
    bm = bmesh.new()
    segments = 40

    def ring(r, z):
        return [(math.cos(U.TAU * i / segments) * r,
                 math.sin(U.TAU * i / segments) * r, z) for i in range(segments)]

    rings = [ring(radius * 0.66, 0.0), ring(radius * 0.70, 0.010),
             ring(radius * 0.88, height * 0.55), ring(radius, height - 0.012),
             ring(radius * 1.06, height), ring(radius * 1.02, height)]
    vo, _ = U.loft(bm, rings, cap_start=True, cap_end=False, smooth=True)
    inner = [ring(radius * 0.96, height), ring(radius * 0.80, height * 0.5),
             ring(radius * 0.62, 0.020), ring(radius * 0.2, 0.018)]
    vi, _ = U.loft(bm, inner, cap_start=False, cap_end=True, smooth=True)
    U.bridge_rings(bm, vo[-1], vi[0], smooth=False)
    obj = U.mesh_object(name + "_Pot", bm, col, mat)
    U.shade_smooth(obj)
    U.box_project(obj, scale=6.0)

    soil = U.cylinder(name + "_Soil", (0.0, 0.0, height * 0.86),
                      radius * 0.90, 0.012, col, M.soil(), segments=segments)
    U.shade_smooth(soil)
    soil.parent = obj
    return obj
