"""Wall art, lighting fixtures, shelving and the furniture beyond the doorway.

`artwork()` is the workhorse: a flat panel described by a list of rect/text
ops in panel-local metres, used for every poster, banner, book jacket and
pinned note in the studio.
"""

import math
import random

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import util as U


# --------------------------------------------------------------------------
# flat graphic panels
# --------------------------------------------------------------------------

def artwork(col, name, width, height, ops, location=(0, 0, 0),
            rotation=(0, 0, 0), bg=P.CREAM, thickness=0.004, matte=True,
            emissive_bg=False):
    """Panel facing -Y. `ops` entries are:

        ("rect", x, y, w, h, colour)
        ("text", x, y, body, size, colour, align, kind)

    with x/y measured in metres from the panel centre, +y up.
    """
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = rotation

    board = U.box(name + "_Board", (0.0, 0.0, 0.0), (width, thickness, height),
                  col, M.paper(name + " Stock", bg, rough=0.80 if matte else 0.4))
    U.box_project(board, scale=1.0)
    board.parent = root

    depth = thickness * 0.5
    for i, op in enumerate(ops):
        depth += 0.00022
        if op[0] == "rect":
            _, x, y, w, h, colour = op
            r = U.box("%s_R%d" % (name, i), (x, -depth, y), (w, 0.0004, h), col,
                      M.paper(name + " " + colour, colour, rough=0.78))
            r.parent = root
        elif op[0] == "text":
            _, x, y, body, size, colour = op[:6]
            align = op[6] if len(op) > 6 else "CENTER"
            kind = op[7] if len(op) > 7 else "bold"
            spacing = op[8] if len(op) > 8 else 1.0
            t = U.text("%s_T%d" % (name, i), body, col,
                       M.paper(name + " ink " + colour, colour, rough=0.6),
                       size=size, kind=kind, align=align,
                       location=(x, -depth, y),
                       rotation=(math.pi / 2.0, 0.0, 0.0),
                       line_spacing=1.16, char_spacing=spacing)
            t.data.extrude = 0.00015
            t.parent = root
    return root


def framed(col, name, width, height, ops, location, rotation=(0, 0, 0),
           frame_color="#2A2622", frame_w=0.016, bg=P.CREAM, glass=True,
           mat_border=0.030, mat_color="#F6F2E8"):
    """A poster in a slim frame with a mat and glazing."""
    root = U.empty(name + "_Frame_Root", location, col)
    root.rotation_euler = rotation
    fmat = M.plastic(name + " Frame", frame_color, rough=0.36, noise_scale=300.0)

    ow, oh = width + frame_w * 2.0, height + frame_w * 2.0
    for dx, dz, w, h in ((0, (oh - frame_w) * 0.5, ow, frame_w),
                         (0, -(oh - frame_w) * 0.5, ow, frame_w),
                         (-(ow - frame_w) * 0.5, 0, frame_w, oh - frame_w * 2),
                         ((ow - frame_w) * 0.5, 0, frame_w, oh - frame_w * 2)):
        bar = U.box(name + "_Bar", (dx, 0.0, dz), (w, 0.020, h), col, fmat,
                    bevel_width=0.0012, segments=2)
        bar.parent = root

    if mat_border > 0.0:
        board = U.box(name + "_Mat", (0.0, 0.004, 0.0), (width, 0.006, height),
                      col, M.paper(name + " Mat", mat_color, rough=0.85))
        board.parent = root
        inner = artwork(col, name, width - mat_border * 2.0,
                        height - mat_border * 2.0, ops,
                        location=(0.0, 0.0005, 0.0), bg=bg, thickness=0.002)
        inner.parent = root
    else:
        inner = artwork(col, name, width, height, ops,
                        location=(0.0, 0.002, 0.0), bg=bg, thickness=0.004)
        inner.parent = root

    if glass:
        pane = U.box(name + "_Glass", (0.0, -0.008, 0.0),
                     (width + frame_w, 0.0018, height + frame_w), col,
                     M.glass(name + " Glazing", "#EDF3F6", rough=0.02, ior=1.5))
        pane.parent = root
    return root


def hanging_banner(col, name, width, height, ops, location, rotation=(0, 0, 0),
                   bg=P.CREAM, rod_color="#8A7A5E"):
    """Cloth banner on a dowel, with a gentle sag across its width."""
    root = U.empty(name + "_Banner_Root", location, col)
    root.rotation_euler = rotation

    rod = U.cylinder(name + "_Rod", (0.0, 0.0, height * 0.5 + 0.012),
                     0.007, width + 0.070, col,
                     M.simple("Banner Rod", rod_color, rough=0.5), segments=16,
                     rotation=(0.0, math.pi / 2.0, 0.0))
    U.shade_smooth(rod)
    rod.parent = root
    for sx in (-1, 1):
        cap = U.uv_sphere(name + "_Cap", (sx * (width * 0.5 + 0.035), 0.0,
                                          height * 0.5 + 0.012), 0.010, col,
                          M.simple("Banner Rod", rod_color, rough=0.5),
                          segments=16, rings=8)
        cap.parent = root
    for sx in (-1, 1):
        cord = U.cylinder(name + "_Cord", (sx * width * 0.42, 0.0,
                                           height * 0.5 + 0.075), 0.0016, 0.13,
                          col, M.simple("Banner Cord", "#C6B79A", rough=0.8),
                          segments=8, rotation=(0.0, sx * 0.22, 0.0))
        cord.parent = root

    cloth = artwork(col, name, width, height, ops, location=(0.0, 0.0, 0.0),
                    bg=bg, thickness=0.0025)
    cloth.parent = root
    # sag: bow the cloth board slightly toward the room
    board = [o for o in cloth.children if o.name.endswith("_Board")]
    for b in board:
        mod = b.modifiers.new("Sag", "SIMPLE_DEFORM")
        mod.deform_method = "BEND"
        mod.deform_axis = "Z"
        mod.angle = math.radians(7.0)
    return root


# --------------------------------------------------------------------------
# lighting fixtures
# --------------------------------------------------------------------------

def task_lamp(col, name, location, rotation_z=0.0, color=P.LAMP_YELLOW,
              arm1=0.34, arm2=0.33, head_pitch=1.02, base_r=0.088):
    """Articulated architect lamp: weighted base, two sprung arms, deep shade.

    Returns (root, shade_empty) so the caller can hang a real light inside.
    """
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    body = M.plastic(name + " Enamel", color, rough=0.26, noise_scale=260.0,
                     coat=0.45)
    hardware = M.metal(name + " Hardware", "#8E8C88", rough=0.32)

    base = U.cylinder(name + "_Base", (0.0, 0.0, 0.012), base_r, 0.024, col,
                      body, segments=48, radius_top=base_r * 0.90)
    U.shade_smooth(base)
    U.bevel(base, 0.003, 3)
    base.parent = root
    collar = U.cylinder(name + "_Collar", (0.0, 0.0, 0.033), 0.030, 0.020, col,
                        hardware, segments=28)
    U.shade_smooth(collar)
    collar.parent = root

    # joints: shoulder rises back, elbow reaches forward over the desk
    shoulder = (0.0, 0.0, 0.046)
    a1 = math.radians(76.0)            # lower arm, steeply up and slightly back
    elbow = (0.0, shoulder[1] - math.cos(a1) * arm1,
             shoulder[2] + math.sin(a1) * arm1)
    a2 = math.radians(-26.0)           # upper arm, forward and gently down
    wrist = (0.0, elbow[1] + math.cos(a2) * arm2,
             elbow[2] + math.sin(a2) * arm2)

    lower = U.strut(name + "_Arm1", shoulder, elbow, 0.011, col, body,
                    segments=20)
    lower.parent = root
    upper = U.strut(name + "_Arm2", elbow, wrist, 0.0098, col, body,
                    segments=20)
    upper.parent = root

    for pt, r in ((shoulder, 0.020), (elbow, 0.019), (wrist, 0.017)):
        joint = U.uv_sphere(name + "_Joint", pt, r, col, hardware, segments=24,
                            rings=12)
        joint.parent = root
    # knurled tension knobs on the outside of each joint
    for pt in (elbow, wrist):
        knob = U.cylinder(name + "_Knob", (pt[0] + 0.022, pt[1], pt[2]), 0.011,
                          0.010, col, hardware, segments=18,
                          rotation=(0.0, math.pi / 2.0, 0.0))
        U.shade_smooth(knob)
        knob.parent = root

    # tension springs running alongside each arm
    for a, b in ((shoulder, elbow), (elbow, wrist)):
        off = 0.015
        spring = U.strut(name + "_Spring", (a[0] - off, a[1], a[2]),
                         (b[0] - off, b[1], b[2]), 0.0052, col, hardware,
                         segments=12, extend=-0.055)
        spring.parent = root

    # shade: deep cone, open toward the desk
    shade_root = U.empty(name + "_Shade", wrist, col)
    shade_root.rotation_euler = (head_pitch, 0.0, 0.0)
    shade_root.parent = root

    bm = bmesh.new()
    segments = 44
    profile = [(0.004, 0.012), (0.014, 0.034), (0.034, 0.060), (0.060, 0.080),
               (0.086, 0.094), (0.100, 0.099), (0.104, 0.099)]
    rings = []
    for z, r in profile:
        rings.append([(math.cos(U.TAU * i / segments) * r,
                       math.sin(U.TAU * i / segments) * r, -z)
                      for i in range(segments)])
    U.loft(bm, rings, cap_start=True, cap_end=False, smooth=True)
    shade = U.mesh_object(name + "_ShadeShell", bm, col, body)
    U.shade_smooth(shade)
    U.solidify(shade, 0.0024, offset=1.0)
    shade.parent = shade_root

    # bright liner so the inside of the shade reads hot
    bml = bmesh.new()
    rings = []
    for z, r in profile[1:]:
        rings.append([(math.cos(U.TAU * i / segments) * r * 0.985,
                       math.sin(U.TAU * i / segments) * r * 0.985, -z)
                      for i in range(segments)])
    U.loft(bml, rings, cap_start=False, cap_end=False, smooth=True)
    liner = U.mesh_object(name + "_Liner", bml, col,
                          M.simple(name + " Liner", "#FFF4DE", rough=0.38))
    U.shade_smooth(liner)
    liner.parent = shade_root

    bulb = U.uv_sphere(name + "_Bulb", (0.0, 0.0, -0.068), 0.027, col,
                       M.emissive(name + " Bulb", "#FFE7BC", 30.0), segments=20,
                       rings=12)
    bulb.parent = shade_root
    return root, shade_root


def mushroom_lamp(col, name, location, color=P.LAMP_RED, shade_r=0.105,
                  height=0.230):
    root = U.empty(name + "_Root", location, col)
    body = M.plastic(name + " Enamel", color, rough=0.24, noise_scale=280.0,
                     coat=0.5)
    base = U.cylinder(name + "_Base", (0.0, 0.0, 0.010), 0.062, 0.020, col, body,
                      segments=40, radius_top=0.056)
    U.shade_smooth(base)
    U.bevel(base, 0.003, 3)
    base.parent = root
    stem = U.cylinder(name + "_Stem", (0.0, 0.0, height * 0.45), 0.011,
                      height * 0.72, col,
                      M.metal(name + " Stem", "#9A968E", rough=0.3), segments=18)
    U.shade_smooth(stem)
    stem.parent = root

    bm = bmesh.new()
    segments = 44
    profile = [(0.0, 0.010), (0.014, 0.055), (0.030, 0.086), (0.048, shade_r),
               (0.056, shade_r * 1.01)]
    rings = []
    for z, r in profile:
        rings.append([(math.cos(U.TAU * i / segments) * r,
                       math.sin(U.TAU * i / segments) * r, height - z)
                      for i in range(segments)])
    U.loft(bm, rings, cap_start=True, cap_end=False, smooth=True)
    shade = U.mesh_object(name + "_Shade", bm, col, body)
    U.shade_smooth(shade)
    U.solidify(shade, 0.0022, offset=1.0)
    shade.parent = root

    bulb = U.uv_sphere(name + "_Bulb", (0.0, 0.0, height - 0.040), 0.024, col,
                       M.emissive(name + " Bulb", "#FFE2B4", 26.0), segments=20,
                       rings=12)
    bulb.parent = root
    return root


def paper_globe(col, name, location, radius=0.155, cord_top=1.05):
    root = U.empty(name + "_Root", location, col)
    mat = M.simple(name + " Paper", "#F7F1E4", rough=0.86, sss=0.55,
                   sss_radius=(0.05, 0.045, 0.04), transmission=0.0)
    globe = U.uv_sphere(name + "_Globe", (0.0, 0.0, 0.0), radius, col, mat,
                        segments=44, rings=24, scale=(1.0, 1.0, 0.88))
    globe.parent = root
    # concertina ribs
    for i in range(9):
        z = -radius * 0.78 + i * (radius * 1.56 / 8.0)
        rr = radius * math.sqrt(max(0.0, 1.0 - (z / (radius * 0.9)) ** 2))
        if rr < 0.01:
            continue
        rib = U.torus(name + "_Rib%d" % i, (0.0, 0.0, z * 0.88), rr, 0.0018, col,
                      mat, major_seg=40, minor_seg=6)
        U.shade_smooth(rib)
        rib.parent = root
    bulb = U.uv_sphere(name + "_Bulb", (0.0, 0.0, 0.02), 0.035, col,
                       M.emissive(name + " Bulb", "#FFE6C0", 16.0), segments=20,
                       rings=12)
    bulb.parent = root
    cord = U.cylinder(name + "_Cord", (0.0, 0.0, radius * 0.85 + cord_top * 0.5),
                      0.0022, cord_top, col,
                      M.simple("Lamp Cord", "#2A2A2C", rough=0.7), segments=8)
    cord.parent = root
    return root


# --------------------------------------------------------------------------
# storage
# --------------------------------------------------------------------------

def shelving(col, name, location, width=0.92, depth=0.32, height=2.30,
             shelves=6, rotation_z=0.0, frame_color="#3A3428",
             shelf_color="#8A6A44"):
    """Open industrial shelf unit."""
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    upright = M.metal(name + " Upright", frame_color, rough=0.45)
    board = M.simple(name + " Board", shelf_color, rough=0.55)
    levels = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            post = U.box(name + "_Post", (sx * (width * 0.5 - 0.018),
                                          sy * (depth * 0.5 - 0.016),
                                          height * 0.5),
                         (0.030, 0.028, height), col, upright,
                         bevel_width=0.0016, segments=2)
            post.parent = root
    for i in range(shelves):
        z = 0.045 + i * ((height - 0.12) / (shelves - 1.0))
        sh = U.box(name + "_Shelf%d" % i, (0.0, 0.0, z), (width, depth, 0.024),
                   col, board, bevel_width=0.0018, segments=2)
        U.box_project(sh, scale=4.0)
        sh.parent = root
        levels.append(z + 0.012)
    return root, levels


def crate(col, name, location, width=0.60, depth=0.36, height=0.34,
          rotation_z=0.0, records=22, seed=13):
    """Low record crate with sleeves standing in it."""
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    wood = M.simple(name + " Wood", "#5B4128", rough=0.6)
    for dx, dy, w, d in ((0, -depth * 0.5, width, 0.018),
                         (0, depth * 0.5, width, 0.018),
                         (-width * 0.5, 0, 0.018, depth),
                         (width * 0.5, 0, 0.018, depth)):
        panel = U.box(name + "_Panel", (dx, dy, height * 0.5), (w, d, height),
                      col, wood, bevel_width=0.0015, segments=2)
        U.box_project(panel, scale=4.0)
        panel.parent = root
    floor = U.box(name + "_Floor", (0.0, 0.0, 0.010), (width, depth, 0.020), col,
                  wood)
    floor.parent = root
    y = -depth * 0.5 + 0.030
    for i in range(records):
        t = rng.uniform(0.0035, 0.006)
        lean = rng.uniform(-0.10, 0.02)
        sleeve = U.box(name + "_LP%d" % i, (0.0, y, height * 0.5 + 0.055),
                       (0.310, t, 0.310), col,
                       M.book_cloth(P.BOOK_SPINES[rng.randrange(
                           len(P.BOOK_SPINES))], index=i),
                       bevel_width=0.0004, segments=1)
        sleeve.rotation_euler = (lean, 0.0, 0.0)
        sleeve.parent = root
        y += t + 0.0015
        if y > depth * 0.5 - 0.030:
            break
    return root


def pinboard(col, name, location, width=1.00, height=0.72, rotation=(0, 0, 0),
             notes=16, seed=21):
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = rotation
    cork = U.box(name + "_Cork", (0.0, 0.0, 0.0), (width, 0.020, height), col,
                 M.simple(name + " Cork", "#B08A54", rough=0.92))
    U.box_project(cork, scale=6.0)
    cork.parent = root
    palette = [P.CREAM, P.PAPER, "#FFFFFF", P.MUSTARD, P.RED, P.NAVY, "#DCE6F6"]
    for i in range(notes):
        w = rng.uniform(0.075, 0.145)
        h = rng.uniform(0.085, 0.165)
        x = rng.uniform(-width * 0.5 + w * 0.6, width * 0.5 - w * 0.6)
        z = rng.uniform(-height * 0.5 + h * 0.6, height * 0.5 - h * 0.6)
        colour = palette[rng.randrange(len(palette))]
        note = U.box(name + "_Note%d" % i, (x, -0.011 - i * 0.0004, z),
                     (w, 0.0012, h), col, M.paper(name + colour, colour,
                                                  rough=0.85))
        note.rotation_euler = (0.0, rng.uniform(-0.09, 0.09), 0.0)
        note.parent = root
        pin = U.uv_sphere(name + "_Pin%d" % i,
                          (x, -0.014 - i * 0.0004, z + h * 0.42), 0.0045, col,
                          M.plastic("Pin " + colour, P.RED if i % 2 else P.NAVY,
                                    rough=0.25), segments=12, rings=8)
        pin.parent = root
    return root


# --------------------------------------------------------------------------
# furniture beyond the doorway
# --------------------------------------------------------------------------

def table(col, name, location, width=2.40, depth=0.95, height=0.74,
          rotation_z=0.0, top_color="#8A6741", leg_color="#2E2A24"):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    top = U.box(name + "_Top", (0.0, 0.0, height), (width, depth, 0.038), col,
                M.simple(name + " Top", top_color, rough=0.42),
                bevel_width=0.0022, segments=3)
    U.box_project(top, scale=2.0)
    top.parent = root
    leg_mat = M.metal(name + " Leg", leg_color, rough=0.48)
    for sx in (-1, 1):
        for sy in (-1, 1):
            leg = U.box(name + "_Leg", (sx * (width * 0.5 - 0.10),
                                        sy * (depth * 0.5 - 0.09),
                                        height * 0.5),
                        (0.045, 0.045, height), col, leg_mat, bevel_width=0.002)
            leg.parent = root
    return root


def chair(col, name, location, rotation_z=0.0, seat_h=0.45,
          seat_color="#3A3F4A", leg_color="#2E2A24"):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    seat_mat = M.fabric(name + " Seat", seat_color, rough=0.88, weave=260.0)
    leg_mat = M.metal(name + " Leg", leg_color, rough=0.46)
    seat = U.box(name + "_Seat", (0.0, 0.0, seat_h), (0.44, 0.42, 0.045), col,
                 seat_mat, bevel_width=0.008, segments=3)
    U.box_project(seat, scale=3.0)
    seat.parent = root
    back = U.box(name + "_Back", (0.0, 0.19, seat_h + 0.22), (0.44, 0.040, 0.40),
                 col, seat_mat, bevel_width=0.008, segments=3)
    back.rotation_euler = (-0.14, 0.0, 0.0)
    U.box_project(back, scale=3.0)
    back.parent = root
    for sx in (-1, 1):
        for sy in (-1, 1):
            leg = U.cylinder(name + "_Leg", (sx * 0.175, sy * 0.165,
                                             seat_h * 0.5), 0.014, seat_h, col,
                             leg_mat, segments=12,
                             rotation=(sy * 0.055, -sx * 0.055, 0.0))
            U.shade_smooth(leg)
            leg.parent = root
    return root


def rug(col, name, location, width=2.60, depth=1.70, rotation_z=0.0, seed=31):
    rng = random.Random(seed)
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    base = U.box(name + "_Base", (0.0, 0.0, 0.006), (width, depth, 0.012), col,
                 M.fabric(name + " Pile", P.RUG_BASE, rough=0.95, weave=180.0,
                          bump=1.0))
    U.box_project(base, scale=2.0)
    base.parent = root
    bands = [P.NAVY, P.CREAM, P.RED, P.MUSTARD, P.NAVY]
    for i, colour in enumerate(bands):
        y = -depth * 0.5 + 0.16 + i * ((depth - 0.32) / (len(bands) - 1.0))
        stripe = U.box(name + "_Band%d" % i, (0.0, y, 0.0126),
                       (width - 0.14, rng.uniform(0.045, 0.085), 0.0008), col,
                       M.fabric(name + colour, colour, rough=0.95, weave=180.0))
        stripe.parent = root
    for sx in (-1, 1):
        edge = U.box(name + "_Edge", (sx * (width * 0.5 - 0.035), 0.0, 0.0126),
                     (0.030, depth - 0.10, 0.0008), col,
                     M.fabric(name + P.CREAM, P.CREAM, rough=0.95, weave=180.0))
        edge.parent = root
    return root


def speaker(col, name, location, width=0.22, depth=0.24, height=0.42,
            rotation_z=0.0):
    root = U.empty(name + "_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)
    body = U.box(name + "_Body", (0.0, 0.0, height * 0.5), (width, depth, height),
                 col, M.simple(name + " Cab", "#26221E", rough=0.55),
                 bevel_width=0.003, segments=2)
    U.box_project(body, scale=4.0)
    body.parent = root
    grille = U.box(name + "_Grille", (0.0, -depth * 0.5 - 0.004, height * 0.5),
                   (width - 0.020, 0.008, height - 0.024), col,
                   M.fabric(name + " Grille", "#3A3630", rough=0.95, weave=600.0))
    grille.parent = root
    for z, r in ((height * 0.30, 0.062), (height * 0.72, 0.030)):
        cone = U.cylinder(name + "_Cone", (0.0, -depth * 0.5 - 0.001, z), r,
                          0.010, col, M.simple(name + " Cone", "#1A1714",
                                               rough=0.7), segments=24,
                          rotation=(math.pi / 2.0, 0.0, 0.0))
        U.shade_smooth(cone)
        cone.parent = root
    return root
