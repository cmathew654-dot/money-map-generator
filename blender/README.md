# Clover & Co. — studio scene

A photographic reference of a 1990s design studio, rebuilt in Blender as a
fully procedural scene. Nothing here is a downloaded asset or an external
texture: every mesh is generated from code and every material is a shader
network, so the whole image is reproducible from this directory alone.

![The rendered scene](renders/clover-studio.png)

## Running it

The scene targets Blender 4.2+ and is written against the `bpy` API, so it runs
either from a Blender binary or from the `bpy` pip module.

```bash
# from a Blender install
blender -b -P blender/run.py -- --samples 256 --out renders/studio.png

# or headless via pip (python 3.11 for bpy 4.x, 3.13 for bpy 5.x)
python -m venv .venv && .venv/bin/pip install bpy
cd blender && ../.venv/bin/python -m scene.build --samples 256
```

Useful flags:

| Flag | Default | Notes |
| --- | --- | --- |
| `--samples` | `192` | Cycles samples. 32 is enough to judge composition. |
| `--width` / `--height` | `1920` / `1080` | |
| `--glow` | `1.95` | Emission multiplier for the CRT interface. |
| `--exposure` | `0.18` | Stops, applied in colour management. |
| `--glare` / `--vignette` | `0.07` / `0.26` | Post-pass strength; `0` disables. |
| `--view` | `Khronos PBR Neutral` | View transform. `AgX` for a flatter grade. |
| `--save-blend` | — | Write a `.blend` you can open and fly through. |
| `--gltf` | — | Write a `.glb` for viewing outside Blender. |
| `--no-render` `--stats` | — | Build only, and print object/triangle counts. |

## How it is put together

```
scene/
  util.py          mesh primitives: lofts, superellipses, struts, text
  palette.py       every colour in the film, as hex + linearisation helpers
  materials.py     procedural shaders -- wood, plastic, cloth, ceramic, leaf
  screen.py        the Windows 95 desktop and the Clover & Co. homepage
  crt.py           the monitor
  peripherals.py   keyboard, mouse, mousepad, cables
  props.py         books, mug, pens, brass tray, sketchbook, ruler
  furnishings.py   wall art, lamps, shelving, meeting-room furniture
  plants.py        procedural monstera, pothos and shelf greenery
  room.py          floor, walls, window, doorway, painted branding
  lighting.py      sun, window, practicals, world
  camera.py        the matched camera
  post.py          linear-space bloom and vignette
  build.py         assembly, render settings, CLI
```

A few things worth calling out:

**The monitor** is lofted from superellipse cross-sections rather than
modelled as a rounded box. That is what gives a CRT its particular
silhouette — a boxy bezel that crowns slightly, sides that run straight for
most of the depth, then a hard taper back to the neck. The tube face is a
bulged squircle sitting behind a transmissive glass shell, so the picture is
genuinely seen *through* glass and picks up room reflections.

**The screen** is not a texture. The Win95 chrome, the browser and the web
page are ~400 emissive plates and text objects laid out on a virtual 640×480
raster (`screen.Raster` maps pixel coordinates to the monitor's local
metres). That means the interface actually lights the keyboard and desk in
front of it, and the bevelled Win95 controls cast their own microscopic
shadows. Emission colours are linearised first — a navy pixel really does
emit a fraction of what a white one does, and skipping that step washes the
whole picture out.

**The lens finish** happens in `post.py` rather than Blender's compositor,
which needs a GPU context that headless machines often lack. The render goes
to a linear EXR, numpy applies multi-scale bloom and a vignette to real
radiometric values, and Blender's colour management writes the final PNG.

## Exploring the scene

`--save-blend` writes a `.blend` with the full procedural setup intact —
open it and fly the viewport freely.

`--gltf` writes a `.glb` for web viewers and other DCC tools. Note the
tradeoff: glTF has no way to carry a procedural shader network, so surfaces
arrive as their flat Principled values. Geometry, layout and colour survive;
wood grain, fabric weave and brick do not. Baking those to image textures
first would fix it, at the cost of a long bake.

## Deliberate departures from the reference

- The window sits in the back-left corner rather than mid-wall, so it reads
  in frame at this focal length while still raking light across the desk the
  way the reference does.
- The monitor is a little wider than a period-correct 17" tube, matching the
  proportions in the photograph rather than a real ViewSonic.
- Book and poster copy is set in Liberation Sans, the closest metric match
  available without shipping font files.
