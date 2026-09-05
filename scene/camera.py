"""Camera matched to the reference frame, with depth of field on the screen."""

import math

import bpy
from mathutils import Vector

from . import util as U


def build(parent_collection, location=(0.02, -0.86, 1.135),
          target=(0.03, 0.86, 1.045), focal=32.0, fstop=2.2,
          focus_target=None, sensor=36.0, shift=(0.0, 0.0)):
    col = U.collection("Camera", parent_collection)
    data = bpy.data.cameras.new("Camera")
    data.lens = focal
    data.sensor_width = sensor
    data.shift_x, data.shift_y = shift
    data.clip_start = 0.02
    data.clip_end = 80.0
    data.dof.use_dof = True
    data.dof.aperture_fstop = fstop
    data.dof.aperture_blades = 8
    data.dof.aperture_rotation = math.radians(12.0)

    cam = bpy.data.objects.new("Camera", data)
    cam.location = location
    U.link(cam, col)

    focus = focus_target if focus_target is not None else target
    data.dof.focus_distance = (Vector(focus) - Vector(location)).length

    direction = Vector(target) - Vector(location)
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()

    bpy.context.scene.camera = cam
    return cam
