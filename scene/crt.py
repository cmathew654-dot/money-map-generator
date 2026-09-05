"""The hero object: a mid-90s 17" beige CRT monitor.

The shell is lofted from superellipse cross-sections, which is what gives a
real CRT its boxy face, softly crowned sides and the deep taper back to the
neck. The tube face is a bulged squircle with a transmissive glass shell in
front of the emissive interface, so the picture is genuinely seen *through*
glass and picks up reflections from the room.
"""

import math

import bmesh
import bpy

from . import materials as M
from . import palette as P
from . import screen as SCREEN
from . import util as U

SEG = 72                      # ring resolution for every lofted section

# ---- overall proportions (metres, local space, body centred on origin) ----
BODY_HW, BODY_HH = 0.2220, 0.1660
FRONT_Y = -0.2150
BACK_Y = 0.2280

SCREEN_HW, SCREEN_HH = 0.1573, 0.1180
SCREEN_CZ = 0.0262            # opening sits above the body centre (chin below)
GLASS_EDGE_Y = -0.2015
GLASS_BULGE = 0.0105


def _ring(hw, hh, exponent, y, cz=0.0, segments=SEG):
    """One superellipse cross-section, returned as 3D points."""
    pts = U.superellipse_points(hw, hh, exponent, segments)
    return [(x, y, z + cz) for x, z in pts]


# --------------------------------------------------------------------------
# shell
# --------------------------------------------------------------------------

def _shell(col, mat):
    """Lofted case with an annular front face framing the tube opening."""
    bm = bmesh.new()

    sections = [
        # (y,      half_w,        half_h,        exponent)
        (FRONT_Y,  BODY_HW,         BODY_HH,         18.0),
        (-0.2115,  BODY_HW,         BODY_HH,         16.0),
        (-0.1100,  BODY_HW * 0.998, BODY_HH * 0.998, 12.0),
        (-0.0250,  BODY_HW * 0.986, BODY_HH * 0.982, 9.0),
        (0.0550,   BODY_HW * 0.948, BODY_HH * 0.936, 7.0),
        (0.1250,   BODY_HW * 0.856, BODY_HH * 0.834, 5.4),
        (0.1830,   BODY_HW * 0.688, BODY_HH * 0.656, 4.4),
        (0.2140,   BODY_HW * 0.488, BODY_HH * 0.462, 3.8),
        (BACK_Y,   BODY_HW * 0.382, BODY_HH * 0.362, 3.4),
    ]
    rings = [_ring(hw, hh, e, y) for y, hw, hh, e in sections]
    vrings, _ = U.loft(bm, rings, cap_start=False, cap_end=True, smooth=True)

    # annular front: bridge the outer face ring to the tube opening
    opening = _ring(SCREEN_HW, SCREEN_HH, 6.2, FRONT_Y, SCREEN_CZ)
    inner = [bm.verts.new(p) for p in opening]
    faces = U.bridge_rings(bm, inner, vrings[0], smooth=False)
    for f in faces:
        f.smooth = False

    # inner rim receding to the glass, so the bezel reads as having depth
    rim = _ring(SCREEN_HW * 0.985, SCREEN_HH * 0.985, 6.2, GLASS_EDGE_Y, SCREEN_CZ)
    rim_v = [bm.verts.new(p) for p in rim]
    U.bridge_rings(bm, rim_v, inner, smooth=True)

    obj = U.mesh_object("CRT_Shell", bm, col, mat)
    # The bezel face, its rim and the rear cap stay flat; only the long swept
    # sides shade smooth. Without this the corners read as a soft pillow
    # instead of a moulded case.
    for poly in obj.data.polygons:
        flat = abs(poly.normal.y) > 0.70 or poly.center.y < FRONT_Y + 0.006
        poly.use_smooth = not flat
    obj.data.update()
    U.bevel(obj, width=0.0055, segments=4, angle=math.radians(22.0))
    U.box_project(obj, scale=6.0)
    return obj


def _glass(col, mat):
    """Bulged tube face: concentric squircle rings pushed toward the viewer."""
    bm = bmesh.new()
    steps = [1.000, 0.965, 0.920, 0.860, 0.780, 0.680, 0.560, 0.420, 0.260, 0.090]
    rings = []
    for s in steps:
        y = GLASS_EDGE_Y - GLASS_BULGE * (1.0 - s * s)
        rings.append(_ring(SCREEN_HW * 0.985 * s, SCREEN_HH * 0.985 * s,
                           U.lerp(6.2, 3.0, 1.0 - s), y, SCREEN_CZ))
    vrings, _ = U.loft(bm, rings, cap_start=False, cap_end=False, smooth=True)
    centre = bm.verts.new((0.0, GLASS_EDGE_Y - GLASS_BULGE, SCREEN_CZ))
    last = vrings[-1]
    for i in range(len(last)):
        try:
            f = bm.faces.new((last[i], last[(i + 1) % len(last)], centre))
            f.smooth = True
        except ValueError:
            pass
    obj = U.mesh_object("CRT_Glass", bm, col, mat)
    U.shade_smooth(obj)
    return obj


def _vents(col, mat_dark):
    """Recessed louvres across the top of the case."""
    objs = []
    for i in range(15):
        y = 0.020 + i * 0.0092
        t = (y - 0.020) / 0.130
        hw = U.lerp(0.150, 0.075, U.smoothstep(t))
        z = BODY_HH * U.lerp(0.958, 0.700, U.smoothstep(t))
        objs.append(U.box("CRT_Vent_%02d" % i, (0.0, y, z),
                          (hw * 2.0, 0.0042, 0.010), col, mat_dark,
                          bevel_width=0.0006, segments=2))
    # side breather slots
    for side in (-1, 1):
        for i in range(9):
            y = 0.055 + i * 0.0125
            objs.append(U.box("CRT_SideVent_%d_%02d" % (side, i),
                              (side * BODY_HW * 0.905, y, -0.010),
                              (0.008, 0.0055, 0.088), col, mat_dark,
                              bevel_width=0.0005, segments=2))
    return objs


def _chin(col, mat, mat_dark, mat_led, mat_text):
    """Brand mark, control buttons and the power LED below the tube."""
    objs = []
    chin_z = SCREEN_CZ - SCREEN_HH - 0.038

    brand = U.text("CRT_Brand", "ViewSonic", col, mat_text, size=0.0145,
                   kind="bold", align="LEFT",
                   location=(-0.148, FRONT_Y - 0.0011, chin_z),
                   rotation=(math.pi / 2.0, 0.0, 0.0), char_spacing=0.98)
    brand.data.extrude = 0.0002
    objs.append(brand)

    # three small vertical marks, standing in for the ViewSonic bird logo
    for i, h in enumerate((0.0085, 0.0115, 0.0145)):
        objs.append(U.box("CRT_Mark_%d" % i,
                          (-0.170 + i * 0.0052, FRONT_Y - 0.0009,
                           chin_z - 0.0015 + h * 0.5),
                          (0.0032, 0.0006, h), col,
                          [mat_led, mat_dark, mat_text][i % 3]))

    # button cluster, right of centre
    for i in range(4):
        objs.append(U.box("CRT_Btn_%d" % i,
                          (0.088 + i * 0.0175, FRONT_Y - 0.0022, chin_z),
                          (0.0125, 0.0055, 0.0072), col, mat,
                          bevel_width=0.0012, segments=3))
    power = U.cylinder("CRT_Power", (0.163, FRONT_Y - 0.0026, chin_z), 0.0062,
                       0.0058, col, mat, segments=24,
                       rotation=(math.pi / 2.0, 0.0, 0.0))
    U.shade_smooth(power)
    objs.append(power)
    led = U.box("CRT_LED", (0.1345, FRONT_Y - 0.0016, chin_z),
                (0.0055, 0.0018, 0.0028), col, mat_led)
    objs.append(led)
    return objs


STAND_Z = -0.1800                # top of the pedestal, relative to body centre
FOOT_Z = STAND_Z - 0.0585        # where the monitor actually meets the desk


def _stand(col, mat, mat_dark):
    """Tilt-and-swivel pedestal the case sits in."""
    objs = []
    bm = bmesh.new()
    sections = [
        (STAND_Z - 0.0450, 0.1900, 0.1750, 6.0),
        (STAND_Z - 0.0330, 0.1960, 0.1820, 6.4),
        (STAND_Z - 0.0130, 0.1930, 0.1790, 6.0),
        (STAND_Z + 0.0180, 0.1800, 0.1650, 5.4),
    ]
    rings = []
    for z, hw, hh, e in sections:
        pts = U.superellipse_points(hw, hh, e, SEG)
        rings.append([(x, y, z) for x, y in pts])
    U.loft(bm, rings, cap_start=True, cap_end=True, smooth=True)
    base = U.mesh_object("CRT_Stand", bm, col, mat)
    U.shade_smooth(base)
    U.bevel(base, width=0.0022, segments=3, angle=math.radians(30.0))
    U.box_project(base, scale=6.0)
    objs.append(base)

    hub = U.cylinder("CRT_Swivel", (0.0, 0.0, STAND_Z - 0.0500), 0.088, 0.014, col,
                     mat_dark, segments=48)
    U.shade_smooth(hub)
    objs.append(hub)
    for i in range(4):
        a = math.pi * 0.25 + i * math.pi * 0.5
        foot = U.cylinder("CRT_Foot_%d" % i,
                          (math.cos(a) * 0.150, math.sin(a) * 0.138, STAND_Z - 0.0555),
                          0.0125, 0.006, col, mat_dark, segments=20)
        U.shade_smooth(foot)
        objs.append(foot)
    return objs


def _rear(col, mat, mat_dark):
    """Cable gland and a hint of connector block at the back of the case."""
    objs = []
    objs.append(U.box("CRT_Rear_Panel", (0.0, BACK_Y + 0.004, -0.060),
                      (0.110, 0.010, 0.055), col, mat_dark, bevel_width=0.002))
    gland = U.cylinder("CRT_Gland", (-0.045, BACK_Y + 0.012, -0.085), 0.010,
                       0.020, col, mat_dark, segments=20,
                       rotation=(math.pi / 2.0, 0.0, 0.0))
    U.shade_smooth(gland)
    objs.append(gland)
    return objs


# --------------------------------------------------------------------------
# public
# --------------------------------------------------------------------------

def stand_offset():
    """Height to lift the monitor root so its feet rest on a surface."""
    return -FOOT_Z + 0.003


def build(parent_collection, location=(0.0, 0.0, 0.0), rotation_z=0.0,
          tilt=0.0, glow=SCREEN.GLOW):
    """Assemble the monitor and return (root_empty, screen_raster)."""
    col = U.collection("CRT", parent_collection)

    case = M.plastic("CRT Case", P.CRT_PLASTIC, rough=0.44, noise_scale=160.0,
                     bump=0.16, coat=0.10)
    case_dark = M.plastic("CRT Case Dark", P.CRT_PLASTIC_DARK, rough=0.52,
                          noise_scale=150.0)
    vent_dark = M.simple("CRT Vent", P.CRT_VENT, rough=0.78)
    led_mat = M.emissive("CRT LED", "#4ADE6A", 6.0)
    logo_mat = M.simple("CRT Logo", "#6E6455", rough=0.5)

    root = U.empty("CRT_Root", location, col)
    root.rotation_euler = (tilt, 0.0, rotation_z)

    parts = [_shell(col, case), _glass(col, M.glass("CRT Face Glass",
                                                   "#C4D2D6", rough=0.018,
                                                   ior=1.05))]
    parts += _vents(col, vent_dark)
    parts += _chin(col, case_dark, vent_dark, led_mat, logo_mat)
    parts += _stand(col, case, case_dark)
    parts += _rear(col, case, case_dark)

    # the interface, sitting just behind the tube face
    ui_col = U.collection("CRT_UI", col)
    raster = SCREEN.build(ui_col, SCREEN_HW * 2.0 * 0.988, glow=glow)
    ui_root = U.empty("CRT_UI_Root", (0.0, GLASS_EDGE_Y + 0.0055, SCREEN_CZ), col)
    for obj in raster.objects:
        obj.parent = ui_root
    parts.append(ui_root)

    # a dark inner box so nothing behind the tube shows through the glass
    parts.append(U.box("CRT_Tube_Back",
                       (0.0, GLASS_EDGE_Y + 0.030, SCREEN_CZ),
                       (SCREEN_HW * 2.1, 0.004, SCREEN_HH * 2.1), col,
                       M.simple("Tube Interior", "#07090B", rough=0.9)))

    for obj in parts:
        if obj.parent is None:
            obj.parent = root
    return root, raster
