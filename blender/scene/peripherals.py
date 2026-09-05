"""Keyboard, mouse, branded mousepad and the cabling that ties the desk
together. Every keycap lands in a single mesh so the board stays cheap.
"""

import math

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import util as U

KU = 0.0187                      # one key unit
CAP_GAP = 0.0022
TRAY_FRONT_H = 0.0175
TRAY_BACK_H = 0.0325


# --------------------------------------------------------------------------
# cables
# --------------------------------------------------------------------------

def cable(name, points, col, mat, radius=0.0028, resolution=8, tilt=0.0):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.resolution_u = 6
    cu.bevel_depth = radius
    cu.bevel_resolution = resolution
    spline = cu.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for bp, co in zip(spline.bezier_points, points):
        bp.co = co
        bp.handle_left_type = "AUTO"
        bp.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, cu)
    U.link(obj, col)
    obj.data.materials.append(mat)
    return obj


# --------------------------------------------------------------------------
# keyboard
# --------------------------------------------------------------------------

def _layout():
    """(col_units, row_index, width_units, height_units) for a 104-key board."""
    keys = []

    def row(y, start, spec):
        x = start
        for item in spec:
            if isinstance(item, float) and item < 0:
                x += -item
                continue
            w = item if isinstance(item, (int, float)) else item[0]
            keys.append((x, y, float(w), 1.0))
            x += w

    # function row
    row(0.0, 0.0, [1, -1.0, 1, 1, 1, 1, -0.5, 1, 1, 1, 1, -0.5, 1, 1, 1, 1])
    row(0.0, 15.5, [1, 1, 1])
    # main block
    row(1.35, 0.0, [1] * 13 + [2])
    row(2.35, 0.0, [1.5] + [1] * 12 + [1.5])
    row(3.35, 0.0, [1.75] + [1] * 11 + [2.25])
    row(4.35, 0.0, [2.25] + [1] * 10 + [2.75])
    row(5.35, 0.0, [1.25, 1.25, 1.25, 6.25, 1.25, 1.25, 1.25, 1.25])
    # navigation cluster
    row(1.35, 15.5, [1, 1, 1])
    row(2.35, 15.5, [1, 1, 1])
    keys.append((16.5, 4.35, 1.0, 1.0))
    row(5.35, 15.5, [1, 1, 1])
    # numeric keypad
    row(1.35, 19.0, [1, 1, 1, 1])
    row(2.35, 19.0, [1, 1, 1])
    keys.append((22.0, 2.35, 1.0, 2.0))          # +
    row(3.35, 19.0, [1, 1, 1])
    row(4.35, 19.0, [1, 1, 1])
    keys.append((22.0, 4.35, 1.0, 2.0))          # numpad enter
    keys.append((19.0, 5.35, 2.0, 1.0))          # 0
    keys.append((21.0, 5.35, 1.0, 1.0))          # .
    return keys


def _keycap(bm, cx, cy, w, h, top_z, base_z):
    """A dished, slightly tapered cap."""
    hw, hh = w * 0.5, h * 0.5
    rings = []
    profile = [(base_z, 1.000, 5.0), (base_z + (top_z - base_z) * 0.55, 0.955, 5.5),
               (top_z - 0.0012, 0.885, 6.0), (top_z, 0.860, 6.5)]
    for z, s, e in profile:
        pts = U.superellipse_points(hw * s, hh * s, e, 24)
        rings.append([(cx + x, cy + y, z) for x, y in pts])
    vrings, _ = U.loft(bm, rings, cap_start=True, cap_end=False, smooth=True)
    # concave top: inner ring dropped slightly
    inner = U.superellipse_points(hw * 0.60, hh * 0.60, 6.5, 24)
    iv = [bm.verts.new((cx + x, cy + y, top_z - 0.00055)) for x, y in inner]
    U.bridge_rings(bm, vrings[-1], iv, smooth=True)
    centre = bm.verts.new((cx, cy, top_z - 0.00075))
    for i in range(len(iv)):
        try:
            f = bm.faces.new((iv[i], iv[(i + 1) % len(iv)], centre))
            f.smooth = True
        except ValueError:
            pass


def keyboard(parent_collection, location, rotation_z=0.0):
    col = U.collection("Keyboard", parent_collection)
    cap_mat = M.plastic("Keycap", P.KEY_CAP, rough=0.50, noise_scale=420.0,
                        bump=0.10, coat=0.05)
    case_mat = M.plastic("Keyboard Case", P.KEY_CAP_DARK, rough=0.46,
                         noise_scale=200.0, bump=0.14)
    led_mat = M.emissive("KB LED", "#5FE07A", 3.0)

    keys = _layout()
    span_x = 23.0 * KU
    span_y = 6.5 * KU

    root = U.empty("Keyboard_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)

    # wedge tray
    bm = bmesh.new()
    x0, x1 = -span_x * 0.5 - 0.012, span_x * 0.5 + 0.012
    y0, y1 = -span_y * 0.5 - 0.014, span_y * 0.5 + 0.020
    lo = [(x0, y0, 0.0), (x1, y0, 0.0), (x1, y1, 0.0), (x0, y1, 0.0)]
    hi = [(x0, y0, TRAY_FRONT_H), (x1, y0, TRAY_FRONT_H),
          (x1, y1, TRAY_BACK_H), (x0, y1, TRAY_BACK_H)]
    U.loft(bm, [lo, hi], cap_start=True, cap_end=True, smooth=False)
    tray = U.mesh_object("Keyboard_Tray", bm, col, case_mat)
    U.bevel(tray, width=0.0028, segments=3, angle=math.radians(35.0))
    U.box_project(tray, scale=8.0)
    tray.parent = root

    # recessed key well floor
    well = U.box("Keyboard_Well", (0.0, 0.002, TRAY_FRONT_H * 0.62),
                 (span_x + 0.008, span_y + 0.008, 0.006), col,
                 M.simple("Key Well", "#8C8474", rough=0.7))
    well.parent = root

    # every cap in one mesh
    bmk = bmesh.new()
    for cx_u, cy_u, w_u, h_u in keys:
        cx = (cx_u + w_u * 0.5) * KU - span_x * 0.5
        cy = span_y * 0.5 - (cy_u + h_u * 0.5) * KU
        t = (cy_u / 6.5)
        base = U.lerp(TRAY_BACK_H, TRAY_FRONT_H, t) - 0.004
        _keycap(bmk, cx, cy, w_u * KU - CAP_GAP, h_u * KU - CAP_GAP,
                base + 0.0105, base)
    caps = U.mesh_object("Keyboard_Caps", bmk, col, cap_mat)
    U.shade_smooth(caps)
    U.bevel(caps, width=0.0004, segments=2, angle=math.radians(38.0))
    U.box_project(caps, scale=30.0)
    caps.parent = root

    # status LEDs and badge
    for i in range(3):
        led = U.box("KB_LED_%d" % i,
                    (span_x * 0.5 - 0.055 + i * 0.014, span_y * 0.5 + 0.008,
                     TRAY_BACK_H - 0.001),
                    (0.005, 0.0035, 0.001), col, led_mat)
        led.parent = root
    badge = U.text("KB_Badge", "Clover & Co.", col,
                   M.simple("KB Badge Ink", "#6E6455", rough=0.55),
                   size=0.0062, kind="bold", align="LEFT",
                   location=(-span_x * 0.5 + 0.012, span_y * 0.5 + 0.010,
                             TRAY_BACK_H + 0.0005),
                   rotation=(0.0, 0.0, 0.0))
    badge.parent = root

    # feet
    for sx in (-1, 1):
        foot = U.box("KB_Foot_%d" % sx, (sx * span_x * 0.42, y0 + 0.010, -0.002),
                     (0.030, 0.012, 0.004), col,
                     M.rubber("KB Feet", "#2A2A2C", 0.8))
        foot.parent = root
    return root


# --------------------------------------------------------------------------
# mouse
# --------------------------------------------------------------------------

def mouse(parent_collection, location, rotation_z=0.0):
    col = U.collection("Mouse", parent_collection)
    body_mat = M.plastic("Mouse Body", P.KEY_CAP, rough=0.38, noise_scale=500.0,
                         bump=0.08, coat=0.12)
    seam_mat = M.simple("Mouse Seam", "#9A927F", rough=0.6)

    root = U.empty("Mouse_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)

    bm = bmesh.new()
    # (z, half_w, half_len, exponent, y_offset) -- the hump sits toward the rear
    profile = [
        (0.0000, 0.0315, 0.0530, 3.0, 0.0000),
        (0.0050, 0.0325, 0.0545, 3.3, 0.0005),
        (0.0110, 0.0322, 0.0540, 3.6, 0.0015),
        (0.0180, 0.0308, 0.0520, 3.9, 0.0032),
        (0.0245, 0.0278, 0.0480, 4.2, 0.0055),
        (0.0295, 0.0228, 0.0420, 4.4, 0.0080),
        (0.0330, 0.0158, 0.0330, 4.6, 0.0105),
        (0.0348, 0.0072, 0.0195, 4.6, 0.0125),
    ]
    rings = []
    for z, hw, hl, e, dy in profile:
        pts = U.superellipse_points(hw, hl, e, 40)
        rings.append([(x, y + dy, z) for x, y in pts])
    vrings, _ = U.loft(bm, rings, cap_start=True, cap_end=False, smooth=True)
    tip = bm.verts.new((0.0, 0.0140, 0.0352))
    last = vrings[-1]
    for i in range(len(last)):
        try:
            f = bm.faces.new((last[i], last[(i + 1) % len(last)], tip))
            f.smooth = True
        except ValueError:
            pass
    body = U.mesh_object("Mouse_Body", bm, col, body_mat)
    U.shade_smooth(body)
    U.box_project(body, scale=20.0)
    body.parent = root

    # button split lines
    split = U.box("Mouse_Split", (0.0, -0.032, 0.0250), (0.0018, 0.050, 0.012),
                  col, seam_mat)
    split.parent = root
    seam = U.box("Mouse_Seam", (0.0, -0.0060, 0.0125), (0.072, 0.0022, 0.032),
                 col, seam_mat)
    seam.parent = root
    return root


# --------------------------------------------------------------------------
# mousepad
# --------------------------------------------------------------------------

def mousepad(parent_collection, location, rotation_z=0.0,
             width=0.300, depth=0.230):
    """Tufted pad with the studio's chevron and wordmark."""
    col = U.collection("Mousepad", parent_collection)
    base = M.fabric("Pad Base", P.CREAM, rough=0.9, weave=520.0, bump=0.75,
                    sheen=0.7)

    root = U.empty("Mousepad_Root", location, col)
    root.rotation_euler = (0.0, 0.0, rotation_z)

    bm = bmesh.new()
    pts = U.superellipse_points(width * 0.5, depth * 0.5, 8.0, 56)
    rings = [[(x, y, 0.0) for x, y in pts],
             [(x * 1.004, y * 1.004, 0.0055) for x, y in pts],
             [(x * 0.998, y * 0.998, 0.0070) for x, y in pts]]
    U.loft(bm, rings, cap_start=True, cap_end=True, smooth=False)
    pad = U.mesh_object("Mousepad", bm, col, base)
    U.bevel(pad, width=0.0012, segments=3, angle=math.radians(40.0))
    U.box_project(pad, scale=1.0)
    pad.parent = root

    top = 0.0071
    # chevrons in the brand colours
    chev = [(-0.086, P.NAVY), (-0.014, P.RED), (0.058, P.MUSTARD)]
    arm_len, arm_t = 0.086, 0.026
    for cx, colour in chev:
        mat = M.fabric("Pad %s" % colour, colour, rough=0.92, weave=520.0,
                       bump=0.8, sheen=0.6)
        for sign in (-1, 1):
            # two bars meeting at the apex form one V
            ang = sign * math.radians(52.0)
            mx = cx + sign * math.sin(ang) * arm_len * 0.5
            my = 0.040 - math.cos(ang) * arm_len * 0.5
            arm = U.box("Pad_Chev", (mx, my, top), (arm_t, arm_len, 0.0007),
                        col, mat)
            arm.rotation_euler = (0.0, 0.0, ang)
            arm.parent = root
    # wordmark bottom-right
    mark = U.text("Pad_Mark", "Clover & Co.", col,
                  M.fabric("Pad Ink", P.NAVY, rough=0.9, weave=520.0, bump=0.5),
                  size=0.024, kind="bold", align="RIGHT",
                  location=(width * 0.5 - 0.020, -depth * 0.5 + 0.030, top),
                  rotation=(0.0, 0.0, 0.0))
    mark.data.extrude = 0.0003
    mark.parent = root
    return root
