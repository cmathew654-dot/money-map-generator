"""The studio shell: floor, walls, the loft window, the doorway through to the
meeting room, and the branding painted on the back wall.

Walls with openings are built as separate panels rather than booleaned, which
keeps the topology clean and the reveals easy to texture.
"""

import math

import bmesh
import bpy

from . import furnishings as F
from . import materials as M
from . import palette as P
from . import util as U

# ------------------------------------------------------------------ extents
FLOOR_Z = 0.0
CEIL_Z = 3.05
X_LEFT = -2.62
X_RIGHT = 3.15
Y_BACK = 3.55                     # the wall carrying the wordmark
Y_FRONT = -2.60
BACK_ROOM_Y = 9.20

# doorway through to the meeting room
DOOR_X0, DOOR_X1 = 0.88, 2.15
DOOR_H = 2.36

# loft window in the left wall
WIN_Y0, WIN_Y1 = 1.30, 3.24
WIN_Z0, WIN_Z1 = 0.86, 2.68
WALL_T = 0.28


def _panel(col, name, center, size, mat, uv=3.0):
    obj = U.box(name, center, size, col, mat)
    U.box_project(obj, scale=uv)
    return obj


# --------------------------------------------------------------------------
# wall graphics
# --------------------------------------------------------------------------

def _back_wall_graphic(col, y):
    """The painted Clover & Co. wordmark, red diagonal and navy disc."""
    off = y - 0.004
    red = M.paint("Graphic Red", P.RED, rough=0.55, bump=0.18)
    navy = M.paint("Graphic Navy", P.NAVY, rough=0.55, bump=0.18)
    ink = M.paint("Graphic Ink", P.NAVY_DEEP, rough=0.5, bump=0.12)

    # navy disc behind the wedge
    disc = U.cylinder("Wall_Disc", (0.30, off + 0.002, 1.22), 0.52, 0.003, col,
                      navy, segments=64, rotation=(math.pi / 2.0, 0.0, 0.0))
    U.shade_smooth(disc)

    # red wedge sweeping down to the right
    bm = bmesh.new()
    verts = [bm.verts.new((x, 0.0, z)) for x, z in
             [(-2.62, 1.96), (0.94, 0.40), (-2.62, 0.40)]]
    bm.faces.new(verts)
    wedge = U.mesh_object("Wall_Wedge", bm, col, red)
    wedge.location = (0.0, off - 0.001, 0.0)

    # wordmark
    mark = U.text("Wall_Wordmark", "Clover & Co.", col, ink, size=0.415,
                  kind="bold", align="LEFT",
                  location=(-2.28, off - 0.004, 2.28),
                  rotation=(math.pi / 2.0, 0.0, 0.0), char_spacing=0.95)
    mark.data.extrude = 0.0015
    sub = U.text("Wall_Wordmark_Sub", "W E B   D E S I G N   S T U D I O", col,
                 ink, size=0.098, kind="bold", align="LEFT",
                 location=(-2.24, off - 0.004, 1.96),
                 rotation=(math.pi / 2.0, 0.0, 0.0), char_spacing=1.22)
    sub.data.extrude = 0.001
    return [disc, wedge, mark, sub]


# --------------------------------------------------------------------------
# window
# --------------------------------------------------------------------------

def _window(col):
    """Steel-framed loft window with a brick reveal, in the left wall."""
    objs = []
    frame_mat = M.metal("Window Frame", "#3A3A38", rough=0.5)
    brick = M.brick_wall()
    sill_mat = M.simple("Window Sill", "#C9BFA9", rough=0.7)

    x = X_LEFT
    # brick reveal around the opening
    for cy, cz, sy, sz in (
        (WIN_Y0 - 0.06, (WIN_Z0 + WIN_Z1) * 0.5, 0.12, WIN_Z1 - WIN_Z0 + 0.24),
        (WIN_Y1 + 0.06, (WIN_Z0 + WIN_Z1) * 0.5, 0.12, WIN_Z1 - WIN_Z0 + 0.24),
        ((WIN_Y0 + WIN_Y1) * 0.5, WIN_Z1 + 0.06, WIN_Y1 - WIN_Y0, 0.12),
        ((WIN_Y0 + WIN_Y1) * 0.5, WIN_Z0 - 0.06, WIN_Y1 - WIN_Y0, 0.12),
    ):
        r = _panel(col, "Win_Reveal", (x + WALL_T * 0.5, cy, cz),
                   (WALL_T, sy, sz), brick, uv=1.0)
        objs.append(r)

    # frame and mullions
    fy0, fy1 = WIN_Y0, WIN_Y1
    fz0, fz1 = WIN_Z0, WIN_Z1
    for cy, cz, sy, sz in (
        (fy0 + 0.030, (fz0 + fz1) * 0.5, 0.060, fz1 - fz0),
        (fy1 - 0.030, (fz0 + fz1) * 0.5, 0.060, fz1 - fz0),
        ((fy0 + fy1) * 0.5, fz0 + 0.030, fy1 - fy0, 0.060),
        ((fy0 + fy1) * 0.5, fz1 - 0.030, fy1 - fy0, 0.060),
        ((fy0 + fy1) * 0.5, (fz0 + fz1) * 0.5, 0.036, fz1 - fz0),
        ((fy0 + fy1) * 0.5, (fz0 + fz1) * 0.5, fy1 - fy0, 0.036),
        ((fy0 + fy1) * 0.5, fz0 + (fz1 - fz0) * 0.26, fy1 - fy0, 0.028),
        ((fy0 + fy1) * 0.5, fz0 + (fz1 - fz0) * 0.74, fy1 - fy0, 0.028),
    ):
        bar = U.box("Win_Bar", (x + 0.055, cy, cz), (0.055, sy, sz), col,
                    frame_mat, bevel_width=0.003, segments=2)
        objs.append(bar)

    glass = U.box("Win_Glass", (x + 0.055, (fy0 + fy1) * 0.5, (fz0 + fz1) * 0.5),
                  (0.010, fy1 - fy0 - 0.06, fz1 - fz0 - 0.06), col,
                  M.glass("Window Glazing", "#E8F1F6", rough=0.015, ior=1.5))
    objs.append(glass)

    # daylight card outside the glazing -- gives the window a real value
    sky = U.box("Win_Sky", (x - 0.42, (fy0 + fy1) * 0.5, (fz0 + fz1) * 0.5),
                (0.02, fy1 - fy0 + 1.2, fz1 - fz0 + 1.0), col,
                M.emissive("Daylight", "#FFF0DA", 9.0))
    objs.append(sky)

    sill = U.box("Win_Sill", (x + WALL_T * 0.5 + 0.045, (fy0 + fy1) * 0.5,
                              fz0 - 0.035),
                 (WALL_T + 0.09, fy1 - fy0 + 0.16, 0.048), col, sill_mat,
                 bevel_width=0.004, segments=2)
    objs.append(sill)
    return objs


# --------------------------------------------------------------------------
# doorway
# --------------------------------------------------------------------------

def _doorway(col):
    objs = []
    frame_mat = M.paint("Door Frame", P.DOOR_FRAME, rough=0.42, bump=0.2)
    w = 0.075
    for cx, cz, sx, sz in (
        (DOOR_X0 - w * 0.5, DOOR_H * 0.5, w, DOOR_H + w),
        (DOOR_X1 + w * 0.5, DOOR_H * 0.5, w, DOOR_H + w),
        ((DOOR_X0 + DOOR_X1) * 0.5, DOOR_H + w * 0.5, DOOR_X1 - DOOR_X0 + w * 2, w),
    ):
        bar = U.box("Door_Frame", (cx, Y_BACK - WALL_T * 0.5, cz),
                    (sx, WALL_T + 0.02, sz), col, frame_mat, bevel_width=0.004,
                    segments=2)
        objs.append(bar)
    return objs


# --------------------------------------------------------------------------
# build
# --------------------------------------------------------------------------

def build(parent_collection):
    col = U.collection("Room", parent_collection)
    wall = M.paint("Wall Paint", P.WALL, rough=0.66, bump=0.38)
    wall_warm = M.paint("Wall Paint Warm", P.WALL_SHADOW, rough=0.68, bump=0.34)
    ceiling = M.paint("Ceiling Paint", P.CEILING, rough=0.78, bump=0.3)
    floor = M.floor_wood()

    objs = []

    # ---- floor: studio and the room beyond ----------------------------
    objs.append(_panel(col, "Floor", (0.4, (Y_FRONT + BACK_ROOM_Y) * 0.5,
                                      FLOOR_Z - 0.05),
                       (X_RIGHT - X_LEFT + 4.0, BACK_ROOM_Y - Y_FRONT, 0.10),
                       floor, uv=1.0))

    # ---- ceiling -------------------------------------------------------
    objs.append(_panel(col, "Ceiling", (0.4, (Y_FRONT + BACK_ROOM_Y) * 0.5,
                                        CEIL_Z + 0.06),
                       (X_RIGHT - X_LEFT + 4.0, BACK_ROOM_Y - Y_FRONT, 0.12),
                       ceiling, uv=1.5))

    # ---- back wall, split around the doorway ---------------------------
    seg = [(X_LEFT, DOOR_X0), (DOOR_X1, X_RIGHT)]
    for i, (a, b) in enumerate(seg):
        objs.append(_panel(col, "BackWall_%d" % i,
                           ((a + b) * 0.5, Y_BACK + WALL_T * 0.5, CEIL_Z * 0.5),
                           (b - a, WALL_T, CEIL_Z), wall))
    objs.append(_panel(col, "BackWall_Header",
                       ((DOOR_X0 + DOOR_X1) * 0.5, Y_BACK + WALL_T * 0.5,
                        (DOOR_H + CEIL_Z) * 0.5),
                       (DOOR_X1 - DOOR_X0, WALL_T, CEIL_Z - DOOR_H), wall))
    objs += _back_wall_graphic(col, Y_BACK)
    objs += _doorway(col)

    # ---- left wall, split around the window ----------------------------
    for name, cy, cz, sy, sz in (
        ("Left_Below", (WIN_Y0 + WIN_Y1) * 0.5, WIN_Z0 * 0.5,
         WIN_Y1 - WIN_Y0, WIN_Z0),
        ("Left_Above", (WIN_Y0 + WIN_Y1) * 0.5, (WIN_Z1 + CEIL_Z) * 0.5,
         WIN_Y1 - WIN_Y0, CEIL_Z - WIN_Z1),
        ("Left_Front", (Y_FRONT + WIN_Y0) * 0.5, CEIL_Z * 0.5,
         WIN_Y0 - Y_FRONT, CEIL_Z),
        ("Left_Back", (WIN_Y1 + Y_BACK) * 0.5, CEIL_Z * 0.5,
         Y_BACK - WIN_Y1, CEIL_Z),
    ):
        objs.append(_panel(col, name, (X_LEFT - WALL_T * 0.5, cy, cz),
                           (WALL_T, sy, sz), wall))
    objs += _window(col)

    # ---- right wall ----------------------------------------------------
    objs.append(_panel(col, "RightWall",
                       (X_RIGHT + WALL_T * 0.5, (Y_FRONT + Y_BACK) * 0.5,
                        CEIL_Z * 0.5),
                       (WALL_T, Y_BACK - Y_FRONT, CEIL_Z), wall_warm))

    # ---- the room beyond the doorway -----------------------------------
    back = U.collection("BackRoom", col)
    objs.append(_panel(back, "Back_LeftWall",
                       (DOOR_X0 - 0.90, (Y_BACK + BACK_ROOM_Y) * 0.5,
                        CEIL_Z * 0.5),
                       (WALL_T, BACK_ROOM_Y - Y_BACK, CEIL_Z), wall_warm))
    objs.append(_panel(back, "Back_RightWall",
                       (X_RIGHT + 1.30, (Y_BACK + BACK_ROOM_Y) * 0.5,
                        CEIL_Z * 0.5),
                       (WALL_T, BACK_ROOM_Y - Y_BACK, CEIL_Z), wall_warm))
    objs.append(_panel(back, "Back_EndWall",
                       (1.8, BACK_ROOM_Y, CEIL_Z * 0.5),
                       (X_RIGHT + 2.6 - DOOR_X0 + 1.8, WALL_T, CEIL_Z), wall))

    # skirting through both rooms
    skirt = M.paint("Skirting", "#E6DDCB", rough=0.5, bump=0.2)
    for name, cx, cy, sx, sy in (
        ("Skirt_Back_L", (X_LEFT + DOOR_X0) * 0.5, Y_BACK - 0.005,
         DOOR_X0 - X_LEFT, 0.030),
        ("Skirt_Back_R", (DOOR_X1 + X_RIGHT) * 0.5, Y_BACK - 0.005,
         X_RIGHT - DOOR_X1, 0.030),
        ("Skirt_Right", X_RIGHT - 0.005, (Y_FRONT + Y_BACK) * 0.5, 0.030,
         Y_BACK - Y_FRONT),
    ):
        s = U.box(name, (cx, cy, 0.058), (sx, sy, 0.116), col, skirt,
                  bevel_width=0.003, segments=2)
        objs.append(s)

    return {
        "collection": col,
        "back_collection": back,
        "objects": objs,
    }
