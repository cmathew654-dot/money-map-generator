"""The workbench itself -- a heavy, well-used timber slab on a steel frame."""

import math

import bpy

from . import materials as M
from . import palette as P
from . import util as U

TOP_Z = 0.762
WIDTH = 3.05
DEPTH = 1.06
THICK = 0.052


def build(parent_collection, location=(0.10, 0.14, 0.0), width=WIDTH,
          depth=DEPTH, top_z=TOP_Z):
    col = U.collection("Desk", parent_collection)
    root = U.empty("Desk_Root", location, col)
    wood = M.desk_wood()
    steel = M.metal("Desk Frame", "#2B2A28", rough=0.52)

    top = U.box("Desk_Top", (0.0, 0.0, top_z - THICK * 0.5),
                (width, depth, THICK), col, wood, bevel_width=0.004, segments=3)
    U.box_project(top, scale=1.0)
    top.parent = root

    # a thin batten under the front edge, so the slab reads as substantial
    batten = U.box("Desk_Batten", (0.0, -depth * 0.5 + 0.035,
                                   top_z - THICK - 0.028),
                   (width - 0.10, 0.070, 0.056), col, wood, bevel_width=0.003)
    U.box_project(batten, scale=1.0)
    batten.parent = root

    for sx in (-1, 1):
        for cy, sy in ((-depth * 0.5 + 0.14, 0.055), (depth * 0.5 - 0.14, 0.055)):
            leg = U.box("Desk_Leg", (sx * (width * 0.5 - 0.20), cy,
                                     (top_z - THICK) * 0.5),
                        (0.055, sy, top_z - THICK), col, steel,
                        bevel_width=0.003, segments=2)
            leg.parent = root
        rail = U.box("Desk_Rail", (sx * (width * 0.5 - 0.20), 0.0, 0.115),
                     (0.045, depth - 0.30, 0.045), col, steel,
                     bevel_width=0.0025, segments=2)
        rail.parent = root
    stretcher = U.box("Desk_Stretcher", (0.0, 0.0, 0.115),
                      (width - 0.42, 0.040, 0.040), col, steel,
                      bevel_width=0.0025, segments=2)
    stretcher.parent = root
    return root, top_z
