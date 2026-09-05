"""Late-afternoon light: a low warm sun through the loft window, practical
lamps in the room, and the CRT throwing its own glow across the desk.
"""

import math

import bpy

from . import palette as P
from . import util as U


def _light(name, kind, col, location, energy, color, rotation=(0, 0, 0),
           size=1.0, size_y=None, spot_size=None, blend=0.35, radius=None):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if kind == "AREA":
        data.shape = "RECTANGLE" if size_y else "SQUARE"
        data.size = size
        if size_y:
            data.size_y = size_y
    elif kind == "SUN":
        data.angle = math.radians(size)
    elif kind == "SPOT":
        data.spot_size = spot_size or math.radians(60.0)
        data.spot_blend = blend
        data.shadow_soft_size = radius if radius is not None else 0.05
    elif kind == "POINT":
        data.shadow_soft_size = radius if radius is not None else 0.05
    obj = bpy.data.objects.new(name, data)
    obj.location = location
    obj.rotation_euler = rotation
    U.link(obj, col)
    return obj


def world(strength=0.75, horizon="#C9B79A", zenith="#8FA6C4"):
    """A warm, softly graded environment so nothing goes dead black."""
    w = bpy.data.worlds.new("Studio World")
    bpy.context.scene.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    out.location = (400, 0)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.location = (200, 0)
    bg.inputs["Strength"].default_value = strength
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])

    tex = nt.nodes.new("ShaderNodeTexCoord")
    tex.location = (-600, 0)
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    sep.location = (-420, 0)
    nt.links.new(tex.outputs["Generated"], sep.inputs["Vector"])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.location = (-240, 0)
    e = ramp.color_ramp.elements
    e[0].position = 0.30
    e[0].color = P.srgb(horizon)
    e[1].position = 0.72
    e[1].color = P.srgb(zenith)
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    return w


def build(parent_collection, window_x=-2.62, window_span=(1.30, 3.24),
          window_z=(0.86, 2.68)):
    col = U.collection("Lighting", parent_collection)
    lights = {}

    wy = (window_span[0] + window_span[1]) * 0.5
    wz = (window_z[0] + window_z[1]) * 0.5

    # --- the sun, low and golden, raking in through the window ---------
    lights["sun"] = _light(
        "Sun", "SUN", col, (window_x - 3.0, wy - 1.4, wz + 1.5),
        energy=7.8, color=P.srgb("#FFD393")[:3], size=1.9,
        rotation=(math.radians(66.0), 0.0, math.radians(-74.0)))

    # --- sky bounce filling the window opening --------------------------
    lights["window_fill"] = _light(
        "Window Fill", "AREA", col, (window_x + 0.22, wy, wz),
        energy=230.0, color=P.srgb("#FFE0B4")[:3],
        size=window_z[1] - window_z[0], size_y=window_span[1] - window_span[0],
        rotation=(0.0, math.radians(90.0), 0.0))
    lights["window_fill"].data.spread = math.radians(120.0)

    # --- warm bounce off the floor back up into the room ----------------
    lights["bounce"] = _light(
        "Floor Bounce", "AREA", col, (-0.6, 0.9, 0.30),
        energy=58.0, color=P.srgb("#EFC495")[:3], size=2.6, size_y=2.2,
        rotation=(math.radians(-14.0), 0.0, 0.0))

    # --- soft key shaping the desk from camera-left ---------------------
    lights["desk_key"] = _light(
        "Desk Key", "AREA", col, (-1.75, -0.75, 1.95),
        energy=78.0, color=P.srgb("#FFDCB0")[:3], size=1.3, size_y=1.0,
        rotation=(math.radians(58.0), 0.0, math.radians(-52.0)))

    # --- the meeting room beyond the doorway ----------------------------
    lights["back_room"] = _light(
        "Back Room", "AREA", col, (2.0, 6.4, 2.72),
        energy=180.0, color=P.srgb("#FFE0B4")[:3], size=2.6, size_y=2.2,
        rotation=(0.0, 0.0, 0.0))
    lights["back_window"] = _light(
        "Back Room Window", "AREA", col, (0.45, 6.8, 1.75),
        energy=90.0, color=P.srgb("#FFE9C8")[:3], size=1.8, size_y=1.4,
        rotation=(0.0, math.radians(90.0), 0.0))

    # --- ambient lift so the shadow side keeps detail -------------------
    lights["ambient"] = _light(
        "Ambient", "AREA", col, (0.5, -2.2, 2.5),
        energy=32.0, color=P.srgb("#CFD8E8")[:3], size=3.0, size_y=2.0,
        rotation=(math.radians(28.0), 0.0, 0.0))
    return col, lights


def task_lamp_light(col, shade_empty, energy=52.0, color="#FFD9A2",
                    spot=math.radians(96.0), blend=0.42):
    """Hang a real spot inside a lamp shade built by `furnishings.task_lamp`."""
    light = _light("Task Lamp Spot", "SPOT", col, (0.0, 0.0, -0.085), energy,
                   P.srgb(color)[:3], spot_size=spot, blend=blend, radius=0.045)
    light.parent = shade_empty
    light.rotation_euler = (0.0, 0.0, 0.0)
    return light


def screen_light(col, crt_root, energy=6.5, color="#7FD4D8"):
    """A soft extra bounce sold as CRT spill onto the keyboard and desk."""
    light = _light("Screen Spill", "AREA", col, (0.0, -0.34, 0.26), energy,
                   P.srgb(color)[:3], size=0.34, size_y=0.26,
                   rotation=(math.radians(-90.0), 0.0, 0.0))
    light.data.spread = math.radians(150.0)
    light.parent = crt_root
    return light
