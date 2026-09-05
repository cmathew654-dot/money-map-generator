"""Everything that lives on the desk: books, mug, pens, tray, sketchbook."""

import math
import random

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import util as U


# --------------------------------------------------------------------------
# books
# --------------------------------------------------------------------------

def book(col, name, size, spine_color, title=None, title_color=P.INK,
         location=(0, 0, 0), rotation_z=0.0, title_size=None, rules=True,
         kind="bold"):
    """A hardback lying flat, spine facing -Y (toward the camera).

    `size` is (spine length, depth, thickness).
    """
    w, d, t = size
    cloth = M.book_cloth(spine_color, index=abs(hash(name)) % 97)
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)

    cover = U.box(name + "_Cover", (0.0, 0.0, t * 0.5), (w, d, t), col, cloth,
                  bevel_width=min(0.0022, t * 0.2), segments=3)
    U.box_project(cover, scale=8.0)
    cover.parent = root

    pages = U.box(name + "_Pages", (0.0, 0.004, t * 0.5),
                  (w - 0.007, d - 0.006, t - 0.005), col, M.page_edge(),
                  bevel_width=0.0006, segments=2)
    U.box_project(pages, scale=1.0)
    pages.parent = root

    if title:
        txt = U.text(name + "_Title", title, col,
                     M.simple("Ink " + title_color, title_color, rough=0.55),
                     size=title_size or min(t * 0.56, 0.0205), kind=kind,
                     align="LEFT",
                     location=(-w * 0.5 + 0.026, -d * 0.5 - 0.0014, t * 0.5),
                     rotation=(math.pi / 2.0, 0.0, 0.0), char_spacing=0.97)
        txt.data.extrude = 0.0002
        txt.parent = root
    if rules:
        rule_mat = M.simple("Ink " + title_color, title_color, rough=0.55)
        for sx in (-1, 1):
            for off in (0.0, 0.0035):
                r = U.box(name + "_Rule", (sx * (w * 0.5 - 0.009 - off),
                                           -d * 0.5 - 0.0011, t * 0.5),
                          (0.0011, 0.0004, t * 0.55), col, rule_mat)
                r.parent = root
    return root


def book_stack(col, name, entries, location, rotation_z=0.0, jitter=0.004,
               seed=0):
    """A leaning pile. `entries` is a list of (title, spine, size, ink)."""
    rng = random.Random(seed)
    root = U.empty(name + "_Stack", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    z = 0.0
    for i, (title, spine, size, ink) in enumerate(entries):
        b = book(col, "%s_%d" % (name, i), size, spine, title=title,
                 title_color=ink,
                 location=(rng.uniform(-jitter, jitter),
                           rng.uniform(-jitter, jitter), z),
                 rotation_z=rng.uniform(-0.045, 0.045))
        b.parent = root
        z += size[2] + 0.0006
    return root


def shelf_books(col, name, count, location, height=0.24, depth=0.16,
                seed=0, lean_last=True, scale=1.0):
    """Upright books on a shelf -- background filler with real variety."""
    rng = random.Random(seed)
    root = U.empty(name + "_Row", location, col)
    x = 0.0
    for i in range(count):
        t = rng.uniform(0.018, 0.046) * scale
        h = height * rng.uniform(0.82, 1.05)
        d = depth * rng.uniform(0.86, 1.0)
        spine = P.BOOK_SPINES[rng.randrange(len(P.BOOK_SPINES))]
        b = U.box("%s_%d" % (name, i), (x + t * 0.5, 0.0, h * 0.5), (t, d, h),
                  col, M.book_cloth(spine, index=i), bevel_width=0.0012,
                  segments=2)
        U.box_project(b, scale=8.0)
        if lean_last and i == count - 1:
            b.rotation_euler = (0.0, -0.30, 0.0)
            b.location = (x + t * 0.5 + 0.024, 0.0, h * 0.46)
        b.parent = root
        x += t + 0.0012
    return root


# --------------------------------------------------------------------------
# drinkware & desk tidy
# --------------------------------------------------------------------------

def _hollow_vessel(col, name, mat, radius, height, wall=0.004, segments=48,
                   taper=1.0, fillet=0.004):
    """A cup: outer wall, inner wall, rim and floor as one watertight mesh."""
    bm = bmesh.new()

    def ring(r, z):
        return [(math.cos(U.TAU * i / segments) * r,
                 math.sin(U.TAU * i / segments) * r, z) for i in range(segments)]

    ro_b, ro_t = radius, radius * taper
    ri_b, ri_t = radius - wall, radius * taper - wall
    outer = [ring(ro_b, 0.0), ring(ro_b * 1.002, fillet),
             ring(U.lerp(ro_b, ro_t, 0.55), height * 0.55), ring(ro_t, height)]
    inner = [ring(ri_t, height), ring(U.lerp(ri_b, ri_t, 0.5), height * 0.5),
             ring(ri_b, wall), ring(ri_b * 0.35, wall * 0.6)]
    vo, _ = U.loft(bm, outer, cap_start=True, cap_end=False, smooth=True)
    vi, _ = U.loft(bm, inner, cap_start=False, cap_end=True, smooth=True)
    U.bridge_rings(bm, vo[-1], vi[0], smooth=False)
    obj = U.mesh_object(name, bm, col, mat)
    U.shade_smooth(obj)
    U.bevel(obj, width=0.0008, segments=2, angle=math.radians(45.0))
    U.box_project(obj, scale=6.0)
    return obj


def mug(col, name, location, rotation_z=0.0, lines=("Better Sites",
                                                    "A Brighter",
                                                    "Internet"),
        body_color=P.MUG_WHITE, ink=P.NAVY, radius=0.042, height=0.098):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    mat = M.ceramic("Mug Glaze " + body_color, body_color, rough=0.12)

    body = _hollow_vessel(col, name + "_Body", mat, radius, height, wall=0.0042,
                          taper=1.03, fillet=0.005)
    body.parent = root

    handle = U.torus(name + "_Handle", (radius * 0.94, 0.0, height * 0.56),
                     0.026, 0.0062, col, mat, major_seg=40, minor_seg=12,
                     rotation=(math.pi / 2.0, 0.0, 0.0))
    handle.scale = (1.0, 1.15, 1.0)
    U.shade_smooth(handle)
    handle.parent = root

    coffee = U.cylinder(name + "_Coffee", (0.0, 0.0, height * 0.74),
                        radius - 0.0055, 0.002, col,
                        M.simple("Coffee", "#2A160C", rough=0.16), segments=40)
    U.shade_smooth(coffee)
    coffee.parent = root

    ink_mat = M.simple("Mug Ink " + ink, ink, rough=0.5)
    for i, line in enumerate(lines):
        txt = U.text("%s_Line%d" % (name, i), line, col, ink_mat, size=0.0125,
                     kind="bold", align="CENTER",
                     location=(0.0, -radius - 0.0012,
                               height * 0.60 - i * 0.0165),
                     rotation=(math.pi / 2.0, 0.0, 0.0), char_spacing=0.97)
        txt.data.extrude = 0.0002
        mod = txt.modifiers.new("Wrap", "SIMPLE_DEFORM")
        mod.deform_method = "BEND"
        mod.deform_axis = "Z"
        mod.angle = math.radians(-68.0)
        txt.parent = root
    return root


def pencil_cup(col, name, location, contents=12, seed=3, radius=0.043,
               height=0.105, speckled=True):
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    mat = M.ceramic("Speckle Glaze", P.CERAMIC_SPECKLE, rough=0.26,
                    speckle=0.85 if speckled else 0.0)
    cup = _hollow_vessel(col, name + "_Cup", mat, radius, height, wall=0.005,
                         taper=1.0, fillet=0.006)
    cup.parent = root

    pen_colors = ["#1A1A1E", "#D93B2B", "#1E2F56", "#EFB01F", "#2C6E63",
                  "#E8E2D4", "#8C3A55"]
    for i in range(contents):
        a = U.TAU * i / contents + rng.uniform(-0.2, 0.2)
        rr = rng.uniform(0.006, radius - 0.012)
        lean = rng.uniform(0.04, 0.26)
        length = rng.uniform(0.135, 0.185)
        colour = pen_colors[rng.randrange(len(pen_colors))]
        pen = U.cylinder("%s_Pen%d" % (name, i),
                         (math.cos(a) * rr, math.sin(a) * rr,
                          height * 0.45 + length * 0.5 * math.cos(lean)),
                         rng.uniform(0.0032, 0.0048), length, col,
                         M.plastic("Pen " + colour, colour, rough=0.32,
                                   noise_scale=600.0),
                         segments=14,
                         rotation=(lean * math.sin(a + 1.57),
                                   -lean * math.cos(a + 1.57), 0.0))
        U.shade_smooth(pen)
        pen.parent = root

    # a pair of scissors resting in the cup
    sc_mat = M.metal("Scissor Steel", "#B8BCC2", rough=0.20)
    for sign in (-1, 1):
        blade = U.box("%s_Blade%d" % (name, sign),
                      (0.008 * sign, -0.006, height * 0.52 + 0.070),
                      (0.006, 0.0016, 0.150), col, sc_mat, bevel_width=0.0006)
        blade.rotation_euler = (0.16, sign * 0.055, 0.0)
        blade.parent = root
        ring = U.torus("%s_Ring%d" % (name, sign),
                       (0.016 * sign, -0.020, height * 0.52 - 0.052), 0.017,
                       0.0035, col, M.plastic("Scissor Grip", "#1A1A1E",
                                              rough=0.42),
                       major_seg=28, minor_seg=8, rotation=(1.4, 0.0, 0.0))
        U.shade_smooth(ring)
        ring.parent = root
    return root


def pen_pot(col, name, location, count=8, seed=7, radius=0.036, height=0.085):
    """The little black cup of markers on the right of the desk."""
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    mat = M.plastic("Pen Pot", "#1B1B1F", rough=0.44, noise_scale=380.0)
    cup = _hollow_vessel(col, name + "_Cup", mat, radius, height, wall=0.004)
    cup.parent = root
    for i in range(count):
        a = U.TAU * i / count + rng.uniform(-0.25, 0.25)
        rr = rng.uniform(0.004, radius - 0.010)
        lean = rng.uniform(0.02, 0.18)
        length = rng.uniform(0.115, 0.150)
        pen = U.cylinder("%s_Pen%d" % (name, i),
                         (math.cos(a) * rr, math.sin(a) * rr,
                          height * 0.5 + length * 0.42),
                         rng.uniform(0.0038, 0.0052), length, col,
                         M.plastic("Marker", "#232326", rough=0.38),
                         segments=12,
                         rotation=(lean * math.sin(a), -lean * math.cos(a), 0.0))
        U.shade_smooth(pen)
        pen.parent = root
    return root


def brass_tray(col, name, location, clips=9, seed=11, radius=0.062):
    """Shallow brass dish holding a scatter of binder clips."""
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    brass = M.metal("Brass", P.BRASS, rough=0.24)
    dish = _hollow_vessel(col, name + "_Dish", brass, radius, 0.017, wall=0.0022,
                          taper=1.22, fillet=0.006)
    dish.parent = root
    clip_mat = M.metal("Clip Black", "#25262A", rough=0.34)
    arm_mat = M.metal("Clip Arm", "#C8CCD2", rough=0.18)
    for i in range(clips):
        a = rng.uniform(0.0, U.TAU)
        rr = rng.uniform(0.0, radius - 0.020)
        x, y = math.cos(a) * rr, math.sin(a) * rr
        s = rng.uniform(0.85, 1.15)
        body = U.box("%s_Clip%d" % (name, i), (x, y, 0.0075),
                     (0.020 * s, 0.013 * s, 0.011 * s), col, clip_mat,
                     bevel_width=0.0007, segments=2)
        body.rotation_euler = (rng.uniform(-0.15, 0.15), rng.uniform(-0.1, 0.1),
                               rng.uniform(0.0, U.TAU))
        body.parent = root
        for sx in (-1, 1):
            arm = U.torus("%s_Arm%d_%d" % (name, i, sx), (x, y, 0.012),
                          0.0075 * s, 0.0007, col, arm_mat, major_seg=16,
                          minor_seg=6, rotation=(1.5707963, 0.0, body.rotation_euler.z))
            arm.scale = (1.0, 0.55, 1.0)
            U.shade_smooth(arm)
            arm.parent = root
    return root


# --------------------------------------------------------------------------
# paper goods
# --------------------------------------------------------------------------

def sketchbook(col, name, location, rotation_z=0.0, width=0.360, depth=0.270):
    """Open wire-bound pad with wireframe sketches and a couple of pens."""
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    paper_mat = M.paper("Sketch Paper", P.PAPER, rough=0.82)
    ink = M.simple("Pencil Ink", "#5A5F6B", rough=0.7)
    ink_dark = M.simple("Sketch Ink", "#2C3140", rough=0.65)

    board = U.box(name + "_Board", (0.0, 0.0, 0.0035), (width, depth, 0.007),
                  col, M.simple("Sketch Board", "#D8CFBB", rough=0.85),
                  bevel_width=0.0009, segments=2)
    board.parent = root
    sheet = U.box(name + "_Sheet", (0.0, 0.0, 0.0080), (width - 0.006,
                                                        depth - 0.006, 0.0022),
                  col, paper_mat, bevel_width=0.0004, segments=2)
    U.box_project(sheet, scale=1.0)
    sheet.parent = root

    top = 0.0092
    # wireframe boxes -- three roughed-out page layouts
    layouts = [(-0.108, 0.052), (0.010, 0.052), (0.126, 0.052)]
    for lx, ly in layouts:
        frame_w, frame_h = 0.088, 0.116
        for ox, oy, w, h in (
            (0.0, frame_h * 0.5 - 0.006, frame_w, 0.0012),
            (0.0, -frame_h * 0.5 + 0.006, frame_w, 0.0012),
            (-frame_w * 0.5, 0.0, 0.0012, frame_h),
            (frame_w * 0.5, 0.0, 0.0012, frame_h),
            (0.0, frame_h * 0.28, frame_w * 0.92, 0.0009),
            (-frame_w * 0.20, frame_h * 0.10, frame_w * 0.46, 0.030),
            (frame_w * 0.26, frame_h * 0.10, frame_w * 0.34, 0.030),
        ):
            e = U.box(name + "_Wire", (lx + ox, ly + oy, top), (w, h, 0.0004),
                      col, ink)
            e.parent = root
        for i in range(4):
            line = U.box(name + "_Line", (lx - frame_w * 0.18,
                                          ly - frame_h * 0.18 - i * 0.008,
                                          top), (frame_w * 0.52, 0.0009, 0.0004),
                         col, ink)
            line.parent = root

    caption = U.text(name + "_Caption", "Good Sites\nGood People", col, ink_dark,
                     size=0.0155, kind="bold", align="LEFT",
                     location=(-width * 0.5 + 0.028, -depth * 0.5 + 0.052, top),
                     line_spacing=1.18)
    caption.data.extrude = 0.0002
    caption.parent = root

    # binding rings along the left edge
    ring_mat = M.metal("Wire Binding", "#9AA0A8", rough=0.28)
    for i in range(14):
        ring = U.torus(name + "_Ring%d" % i,
                       (-width * 0.5 + 0.004, depth * 0.5 - 0.014 - i * 0.0175,
                        0.0072), 0.0068, 0.0009, col, ring_mat, major_seg=16,
                       minor_seg=6, rotation=(0.0, 1.5707963, 0.0))
        U.shade_smooth(ring)
        ring.parent = root

    # two pens lying across the pad
    for i, (px, py, rot, colour, ln) in enumerate((
            (-0.030, -0.052, 0.34, "#1A1A1E", 0.150),
            (0.014, -0.086, 0.22, "#2A2A30", 0.142))):
        pen = U.cylinder(name + "_Pen%d" % i, (px, py, top + 0.0048), 0.0046, ln,
                         col, M.plastic("Desk Pen " + colour, colour, rough=0.30),
                         segments=16, rotation=(0.0, 1.5707963, rot))
        U.shade_smooth(pen)
        pen.parent = root
        tip = U.cylinder(name + "_Tip%d" % i,
                         (px + math.cos(rot) * ln * 0.52,
                          py + math.sin(rot) * ln * 0.52, top + 0.0048),
                         0.0030, 0.014, col,
                         M.metal("Pen Nib", "#B9BDC4", rough=0.22), segments=12,
                         radius_top=0.0006,
                         rotation=(0.0, 1.5707963, rot))
        U.shade_smooth(tip)
        tip.parent = root
    return root


def loose_paper(col, name, location, rotation_z=0.0, size=(0.21, 0.297),
                lines=6, heading=None, heading_size=0.017, ink=P.INK):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    sheet = U.box(name + "_Sheet", (0.0, 0.0, 0.0006),
                  (size[0], size[1], 0.0012), col, M.paper("Loose Paper"),
                  bevel_width=0.0003, segments=2)
    U.box_project(sheet, scale=1.0)
    sheet.parent = root
    ink_mat = M.simple("Paper Ink " + ink, ink, rough=0.6)
    y = size[1] * 0.5 - 0.030
    if heading:
        h = U.text(name + "_H", heading, col, ink_mat, size=heading_size,
                   kind="bold", align="CENTER", location=(0.0, y, 0.0014),
                   line_spacing=1.1)
        h.parent = root
        y -= heading_size * 2.4
    for i in range(lines):
        bar = U.box(name + "_L%d" % i, (0.0, y - i * 0.012,
                                        0.0014),
                    (size[0] * (0.72 if i % 3 else 0.55), 0.0011, 0.0003),
                    col, ink_mat)
        bar.parent = root
    return root


def ruler(col, name, location, rotation_z=0.0, length=0.300):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    body = U.box(name + "_Body", (0.0, 0.0, 0.0015), (length, 0.032, 0.003), col,
                 M.plastic("Ruler", P.MUSTARD, rough=0.24, noise_scale=800.0,
                           coat=0.3), bevel_width=0.0006, segments=2)
    body.parent = root
    tick_mat = M.simple("Ruler Ink", P.INK, rough=0.5)
    n = int(length / 0.010)
    for i in range(n + 1):
        h = 0.010 if i % 5 == 0 else 0.006
        t = U.box(name + "_T%d" % i,
                  (-length * 0.5 + i * 0.010, 0.016 - h * 0.5, 0.0031),
                  (0.0006, h, 0.0003), col, tick_mat)
        t.parent = root
    return root
