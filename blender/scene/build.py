"""Assemble the Clover & Co. studio and render it.

Run headless:
    python -m scene.build --samples 256 --width 1920 --out render.png
or from a Blender binary:
    blender -b -P blender/run.py -- --samples 256
"""

import argparse
import math
import os
import sys

import bpy

from . import camera as CAM
from . import crt as CRT
from . import desk as DESK
from . import furnishings as F
from . import lighting as LIGHT
from . import materials as M
from . import palette as P
from . import peripherals as PERI
from . import plants as PLANT
from . import post as POST
from . import props as PROP
from . import room as ROOM
from . import screen as SCREEN
from . import util as U


# ==========================================================================
# desk dressing
# ==========================================================================

def _dress_desk(col, top_z):
    """Everything sitting on the workbench, laid out to the reference frame."""
    ink = P.INK

    # --- left book stack, spines to camera -----------------------------
    PROP.book_stack(col, "Books_Left", [
        ("Design", P.CREAM, (0.238, 0.170, 0.036), ink),
        ("Identity", P.BONE, (0.246, 0.176, 0.034), ink),
        ("The Internet", P.CREAM, (0.252, 0.182, 0.038), ink),
    ], location=(-0.442, 0.152, top_z), rotation_z=0.045, seed=4)

    # --- smaller stack further back ------------------------------------
    PROP.book_stack(col, "Books_Back", [
        ("A Brighter Internet", P.CREAM, (0.226, 0.160, 0.030), P.RED),
        ("Good Websites", P.MUSTARD, (0.232, 0.166, 0.032), P.NAVY),
        ("Good Websites", P.BONE, (0.228, 0.162, 0.030), ink),
    ], location=(-0.690, 0.436, top_z), rotation_z=-0.10, seed=9)

    # --- right book stack ----------------------------------------------
    PROP.book_stack(col, "Books_Right", [
        ("A Life More Creative", P.CREAM, (0.268, 0.190, 0.040), ink),
        ("Graphic Design", P.RED, (0.262, 0.186, 0.036), P.CREAM),
        ("Bauhaus", P.BONE, (0.256, 0.182, 0.034), P.NAVY),
    ], location=(0.735, 0.062, top_z), rotation_z=-0.075, seed=6)

    # --- ceramics and desk tidy ----------------------------------------
    PROP.pencil_cup(col, "Pencil_Cup", (-0.238, 0.262, top_z), contents=13,
                    seed=3)
    PROP.brass_tray(col, "Clip_Tray", (-0.352, 0.048, top_z), clips=10, seed=11)
    PROP.mug(col, "Mug", (0.398, 0.204, top_z), rotation_z=-0.16)
    PROP.pen_pot(col, "Pen_Pot", (0.532, 0.252, top_z), count=9, seed=7)

    # --- paper goods ----------------------------------------------------
    PROP.sketchbook(col, "Sketchbook", (-0.520, -0.198, top_z), rotation_z=0.115)
    PROP.ruler(col, "Ruler", (0.628, -0.258, top_z + 0.0015), rotation_z=0.38)

    # a couple of loose sheets tucked under the left stack
    PROP.loose_paper(col, "Sheet_A", (-0.792, -0.052, top_z + 0.0008),
                     rotation_z=0.42, lines=5)
    PROP.loose_paper(col, "Sheet_B", (-0.748, -0.082, top_z + 0.0022),
                     rotation_z=0.28, lines=6)

    # --- small brand cards, one leaning at each edge --------------------
    F.artwork(col, "Card_Ideas", 0.230, 0.300, [
        ("text", -0.085, 0.088, "Ideas", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, 0.042, "Build", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, -0.004, "Ship", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, -0.050, "Repeat", 0.038, P.NAVY, "LEFT", "bold"),
        ("rect", -0.062, -0.096, 0.046, 0.007, P.RED),
        ("rect", 0.062, 0.104, 0.052, 0.052, P.MUSTARD),
    ], location=(0.905, 0.322, top_z + 0.150),
        rotation=(math.radians(-13.0), 0.0, math.radians(-16.0)), bg=P.CREAM,
        thickness=0.006)

    # blue tack-board card resting against the left books
    F.artwork(col, "Card_People", 0.245, 0.310, [
        ("text", -0.094, 0.104, "PEOPLE", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.094, 0.060, "SITES", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.094, 0.016, "IDEAS", 0.038, P.NAVY, "LEFT", "bold"),
        ("text", -0.094, -0.028, "ETC.", 0.038, P.NAVY, "LEFT", "bold"),
        ("rect", 0.058, -0.088, 0.098, 0.098, P.RED),
        ("rect", 0.058, -0.088, 0.048, 0.048, P.NAVY),
    ], location=(-0.735, 0.512, top_z + 0.168),
        rotation=(math.radians(-9.0), 0.0, math.radians(11.0)), bg=P.CREAM,
        thickness=0.008)


# ==========================================================================
# the studio around the desk
# ==========================================================================

def _dress_room(col, back_col, lights_col):
    # --- credenza under the window, left --------------------------------
    cred_mat = M.simple("Credenza", "#3E3A33", rough=0.5)
    cred = U.box("Credenza", (-2.02, 2.36, 0.42), (0.96, 0.46, 0.84), col,
                 cred_mat, bevel_width=0.005, segments=2)
    U.box_project(cred, scale=3.0)
    for i in range(2):
        drawer = U.box("Credenza_Drawer", (-2.02, 2.36 - 0.235, 0.24 + i * 0.34),
                       (0.88, 0.020, 0.28), col,
                       M.simple("Credenza Front", "#4A453C", rough=0.45),
                       bevel_width=0.003)
        pull = U.box("Credenza_Pull", (-2.02, 2.36 - 0.248, 0.24 + i * 0.34),
                     (0.20, 0.020, 0.018), col,
                     M.metal("Pull", "#9A968E", rough=0.3))

    F.mushroom_lamp(col, "Mushroom_Lamp", (-2.26, 2.26, 0.842))
    PROP.book_stack(col, "Books_Credenza", [
        ("Good Websites", P.MUSTARD, (0.230, 0.164, 0.032), P.NAVY),
        ("Good Websites", P.CREAM, (0.226, 0.160, 0.030), P.INK),
        ("A Brighter Internet", P.BONE, (0.234, 0.168, 0.032), P.RED),
    ], location=(-1.82, 2.28, 0.842), rotation_z=0.16, seed=17)

    F.crate(col, "Records", (-2.02, 1.34, 0.0), rotation_z=0.30)
    F.speaker(col, "Speaker_L", (-2.18, 0.55, 0.0), rotation_z=0.42)

    # low shelf of records / books behind the desk, left
    F.shelving(col, "Low_Shelf", (-2.24, 3.10, 0.0), width=1.05, depth=0.34,
               height=1.02, shelves=3)
    PROP.shelf_books(col, "Shelf_Books_A", 13, (-2.62, 3.10, 0.062),
                     height=0.235, seed=23)
    PROP.shelf_books(col, "Shelf_Books_B", 11, (-2.58, 3.10, 0.512),
                     height=0.225, seed=27)

    # --- tall shelving on the right -------------------------------------
    _, levels = F.shelving(col, "Tall_Shelf", (2.90, 1.05, 0.0), width=0.92,
                           depth=0.34, height=2.42, shelves=6,
                           rotation_z=math.radians(-6.0))
    for i, z in enumerate(levels[:5]):
        PROP.shelf_books(col, "Tall_Books_%d" % i, 9 + (i % 3),
                         (2.62, 1.05, z), height=0.225, seed=40 + i)
    PLANT.pothos(col, "Shelf_Pothos", (3.05, 0.92, levels[3]), scale=0.85,
                 seed=8, vines=8, trail=0.62)
    PLANT.bushy(col, "Shelf_Bush", (3.02, 1.18, levels[1]), scale=0.8, seed=12,
                blades=34, height=0.22)

    # --- plants ----------------------------------------------------------
    PLANT.monstera(col, "Monstera_Left", (-2.30, 1.34, 0.86), scale=0.86,
                   seed=1, leaves=9, pot_radius=0.10, pot_height=0.13)
    PLANT.monstera(col, "Monstera_Corner", (-1.68, 2.92, 0.0), scale=1.25,
                   seed=4, leaves=11)
    PLANT.pothos(col, "Window_Pothos", (-2.34, 2.62, 0.94), scale=0.95,
                 seed=6, vines=9, trail=0.85)
    PLANT.bushy(col, "Desk_Plant", (1.16, 0.54, DESK.TOP_Z), scale=0.78,
                seed=15, blades=40, height=0.26, pot_color=P.POT_TERRA)
    PLANT.bushy(col, "Floor_Plant", (2.30, 2.60, 0.0), scale=1.5, seed=19,
                blades=52, height=0.40)

    # --- wall art ---------------------------------------------------------
    F.framed(col, "Print_Brighter", 0.46, 0.60, [
        ("text", -0.10, 0.135, "A", 0.062, P.NAVY, "LEFT", "bold"),
        ("text", -0.10, 0.055, "Brighter", 0.062, P.NAVY, "LEFT", "bold"),
        ("text", -0.10, -0.025, "Internet", 0.062, P.NAVY, "LEFT", "bold"),
        ("rect", -0.075, -0.082, 0.062, 0.009, P.RED),
        ("rect", 0.052, -0.155, 0.150, 0.075, P.NAVY),
    ], location=(2.68, ROOM.Y_BACK - 0.012, 1.86), bg=P.CREAM,
        rotation=(0.0, 0.0, 0.0))

    F.framed(col, "Print_Together", 0.44, 0.34, [
        ("text", 0.0, 0.055, "Design", 0.052, P.NAVY, "CENTER", "bold"),
        ("text", 0.0, -0.005, "Better", 0.052, P.NAVY, "CENTER", "bold"),
        ("text", 0.0, -0.065, "Together", 0.052, P.NAVY, "CENTER", "bold"),
    ], location=(ROOM.X_RIGHT - 0.014, 0.30, 1.42),
        rotation=(0.0, 0.0, math.radians(-90.0)), bg=P.CREAM)

    F.framed(col, "Print_Diamond", 0.30, 0.38, [
        ("rect", -0.055, 0.055, 0.075, 0.075, P.NAVY),
        ("rect", 0.055, 0.055, 0.075, 0.075, P.CREAM),
        ("rect", -0.055, -0.035, 0.075, 0.075, P.MUSTARD),
        ("rect", 0.055, -0.035, 0.075, 0.075, P.NAVY),
    ], location=(-1.62, ROOM.Y_BACK - 0.012, 0.98), bg=P.BONE,
        frame_color="#6B5E4A")

    F.hanging_banner(col, "Banner", 0.42, 0.86, [
        ("text", -0.145, 0.290, "Make", 0.070, P.NAVY, "LEFT", "bold"),
        ("text", -0.145, 0.190, "Build", 0.070, P.NAVY, "LEFT", "bold"),
        ("text", -0.145, 0.090, "Iterate", 0.070, P.NAVY, "LEFT", "bold"),
        ("text", -0.145, -0.010, "Repeat", 0.070, P.NAVY, "LEFT", "bold"),
        ("rect", -0.118, -0.090, 0.070, 0.010, P.RED),
    ], location=(0.34, ROOM.Y_BACK - 0.055, 2.30), bg=P.CREAM)

    # --- the meeting room beyond the doorway ------------------------------
    F.rug(back_col, "Back_Rug", (1.95, 5.85, 0.002), width=2.9, depth=2.1,
          rotation_z=math.radians(4.0))
    F.table(back_col, "Meeting_Table", (1.95, 5.85, 0.0), width=2.45,
            depth=0.98, rotation_z=math.radians(2.0))
    for i, (cx, cy, rz) in enumerate((
            (1.15, 5.20, 0.10), (2.05, 5.14, -0.05), (2.85, 5.22, -0.18),
            (1.30, 6.52, math.pi + 0.12), (2.30, 6.56, math.pi - 0.08))):
        F.chair(back_col, "Chair_%d" % i, (cx, cy, 0.0), rotation_z=rz)
    F.paper_globe(back_col, "Pendant", (1.62, 5.30, 2.10), radius=0.165,
                  cord_top=0.95)
    F.pinboard(back_col, "Back_Pinboard", (0.42, 6.30, 1.55),
               rotation=(0.0, 0.0, math.radians(-90.0)), width=1.15,
               height=0.80, notes=18)
    F.framed(back_col, "Print_GoodWork", 0.40, 0.50, [
        ("text", -0.085, 0.115, "Good", 0.052, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, 0.050, "Work", 0.052, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, -0.015, "Good", 0.052, P.NAVY, "LEFT", "bold"),
        ("text", -0.085, -0.080, "People", 0.052, P.NAVY, "LEFT", "bold"),
    ], location=(0.42, 7.10, 1.62), rotation=(0.0, 0.0, math.radians(-90.0)),
        bg=P.CREAM)
    PLANT.monstera(back_col, "Back_Plant", (3.55, 6.90, 0.0), scale=1.35,
                   seed=21, leaves=10)
    PLANT.bushy(back_col, "Back_Bush", (0.62, 4.90, 0.0), scale=1.25, seed=25,
                blades=46, height=0.38)


# ==========================================================================
# scene assembly
# ==========================================================================

def build_scene(glow=SCREEN.GLOW):
    U.wipe_scene()
    M.reset_cache()
    root = bpy.context.scene.collection

    LIGHT.world(strength=0.62)
    room = ROOM.build(root)
    lights_col, lights = LIGHT.build(root)

    desk_root, top_z = DESK.build(root)

    crt_root, raster = CRT.build(
        root, location=(0.020, 0.298, top_z + CRT.stand_offset()),
        rotation_z=math.radians(-2.5), glow=glow)
    LIGHT.screen_light(lights_col, crt_root)

    kb = PERI.keyboard(root, (-0.022, -0.142, top_z), rotation_z=math.radians(1.5))
    PERI.mousepad(root, (0.418, -0.168, top_z), rotation_z=math.radians(-4.0))
    PERI.mouse(root, (0.428, -0.146, top_z + 0.0072),
               rotation_z=math.radians(-6.0))

    # cabling: monitor to the wall, keyboard and mouse back behind the CRT
    cable_mat = M.plastic("Cable", P.CABLE, rough=0.46, noise_scale=900.0)
    dark_cable = M.plastic("Cable Dark", "#B8AF9B", rough=0.5, noise_scale=900.0)
    cables = U.collection("Cables", root)
    PERI.cable("Cable_Monitor", [
        (0.020, 0.530, top_z + 0.34), (0.140, 0.665, top_z + 0.10),
        (0.430, 0.700, top_z + 0.012), (0.920, 0.650, top_z + 0.010),
        (1.440, 0.710, top_z + 0.008),
    ], cables, cable_mat, radius=0.0042)
    PERI.cable("Cable_Keyboard", [
        (-0.018, 0.005, top_z + 0.014), (0.020, 0.140, top_z + 0.010),
        (-0.060, 0.300, top_z + 0.010), (0.010, 0.430, top_z + 0.012),
    ], cables, dark_cable, radius=0.0030)
    PERI.cable("Cable_Mouse", [
        (0.428, -0.062, top_z + 0.014), (0.400, 0.110, top_z + 0.010),
        (0.330, 0.270, top_z + 0.010), (0.220, 0.400, top_z + 0.012),
    ], cables, dark_cable, radius=0.0026)

    _dress_desk(U.collection("Desk_Props", root), top_z)

    lamp_root, shade = F.task_lamp(
        U.collection("Task_Lamp", root), "Task_Lamp",
        (0.838, 0.505, top_z), rotation_z=math.radians(133.0))
    LIGHT.task_lamp_light(lights_col, shade, energy=118.0)

    _dress_room(room["collection"], room["back_collection"], lights_col)

    cam = CAM.build(root, location=(0.030, -0.860, 1.052),
                    target=(0.035, 0.900, 1.012), focal=24.0, fstop=3.4,
                    focus_target=(0.020, 0.150, 1.020))
    return cam


# ==========================================================================
# render
# ==========================================================================

def export_gltf(path):
    """Write a .glb of the scene for viewing outside Blender.

    Procedural shader networks cannot travel through glTF, so surfaces arrive
    as their flat Principled values -- geometry, layout and colour survive,
    grain and weave do not.
    """
    os.makedirs(os.path.dirname(os.path.abspath(path)) or ".", exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=os.path.abspath(path), export_format="GLB",
        export_apply=True, export_cameras=True, export_lights=True,
        export_yup=True)
    return os.path.abspath(path)


def configure_render(width=1920, height=1080, samples=192, denoise=True,
                     engine="CYCLES", bounces=8, exposure=0.18,
                     view_transform="Khronos PBR Neutral", look="None"):
    scene = bpy.context.scene
    scene.render.engine = engine
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = False
    scene.render.filter_size = 1.45
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_depth = "8"
    scene.render.image_settings.compression = 15

    if engine == "CYCLES":
        cy = scene.cycles
        cy.device = "CPU"
        cy.samples = samples
        cy.use_adaptive_sampling = True
        cy.adaptive_threshold = 0.012
        cy.adaptive_min_samples = max(16, samples // 12)
        cy.max_bounces = bounces
        cy.diffuse_bounces = min(4, bounces)
        cy.glossy_bounces = min(4, bounces)
        cy.transmission_bounces = min(8, bounces)
        cy.transparent_max_bounces = 8
        cy.volume_bounces = 0
        cy.caustics_reflective = False
        cy.caustics_refractive = False
        cy.blur_glossy = 1.4
        cy.use_denoising = denoise
        cy.sampling_pattern = "BLUE_NOISE"
        cy.use_light_tree = True
        try:
            cy.denoiser = "OPENIMAGEDENOISE"
            cy.denoising_input_passes = "RGB_ALBEDO_NORMAL"
        except (AttributeError, TypeError):
            pass
        scene.render.use_persistent_data = True

    vs = scene.view_settings
    vs.exposure = exposure
    vs.gamma = 1.0
    for candidate in (view_transform, "AgX", "Filmic", "Standard"):
        try:
            vs.view_transform = candidate
            break
        except TypeError:
            continue
    for candidate in (look, "None"):
        try:
            vs.look = candidate
            break
        except TypeError:
            continue
    return scene


def render(path, glare=0.07, vignette=0.26, **kwargs):
    """Render to a linear EXR, then grade it into the final PNG."""
    scene = configure_render(**kwargs)
    path = os.path.abspath(path)
    stem = os.path.splitext(path)[0]

    if glare <= 0.0 and vignette <= 0.0:
        scene.render.filepath = path
        bpy.ops.render.render(write_still=True)
        return scene.render.filepath

    exr = stem + "_linear.exr"
    settings = scene.render.image_settings
    settings.file_format = "OPEN_EXR"
    settings.color_depth = "32"
    settings.exr_codec = "ZIP"
    scene.render.filepath = exr
    bpy.ops.render.render(write_still=True)

    out = POST.finish(exr, path, glare=glare, vignette_amount=vignette)
    try:
        os.remove(exr)
    except OSError:
        pass
    return out


def stats():
    objs = len(bpy.data.objects)
    tris = 0
    dg = bpy.context.evaluated_depsgraph_get()
    for obj in bpy.data.objects:
        if obj.type not in {"MESH", "FONT", "CURVE"}:
            continue
        try:
            ev = obj.evaluated_get(dg)
            me = ev.to_mesh()
            if me:
                me.calc_loop_triangles()
                tris += len(me.loop_triangles)
            ev.to_mesh_clear()
        except (RuntimeError, AttributeError):
            pass
    return objs, tris


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    if "--" in argv:
        argv = argv[argv.index("--") + 1:]
    ap = argparse.ArgumentParser(description="Build and render the studio scene")
    ap.add_argument("--out", default="renders/studio.png")
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--samples", type=int, default=192)
    ap.add_argument("--glow", type=float, default=SCREEN.GLOW)
    ap.add_argument("--exposure", type=float, default=0.18)
    ap.add_argument("--bounces", type=int, default=8)
    ap.add_argument("--view", default="Khronos PBR Neutral")
    ap.add_argument("--look", default="None")
    ap.add_argument("--save-blend", default=None)
    ap.add_argument("--gltf", default=None)
    ap.add_argument("--glare", type=float, default=0.07)
    ap.add_argument("--vignette", type=float, default=0.26)
    ap.add_argument("--no-render", action="store_true")
    ap.add_argument("--stats", action="store_true")
    args = ap.parse_args(argv)

    build_scene(glow=args.glow)
    if args.stats:
        objs, tris = stats()
        print("[scene] %d objects, %s triangles" % (objs, format(tris, ",")))
    if args.gltf:
        print("[export] %s" % export_gltf(args.gltf))
    if args.save_blend:
        os.makedirs(os.path.dirname(os.path.abspath(args.save_blend)) or ".",
                    exist_ok=True)
        bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(args.save_blend))
        print("[scene] saved %s" % args.save_blend)
    if not args.no_render:
        os.makedirs(os.path.dirname(os.path.abspath(args.out)) or ".",
                    exist_ok=True)
        out = render(args.out, width=args.width, height=args.height,
                     samples=args.samples, exposure=args.exposure,
                     bounces=args.bounces, view_transform=args.view,
                     look=args.look, glare=args.glare,
                     vignette=args.vignette)
        print("[render] %s" % out)


if __name__ == "__main__":
    main()
