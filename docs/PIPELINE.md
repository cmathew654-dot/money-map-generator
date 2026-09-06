# The Studio Pipeline

**From one reference photograph to a walkable browser scene with a live web page inside it.**

This is an operating manual, not a description. It is written for a model or engineer who has
never seen the project, opening it in a fresh session, and is expected to produce the same
result — or adapt the method to a new reference — without re-learning anything below the hard
way. Every rule here was paid for. The incident that produced each one is stated so you can
judge whether it applies to your situation rather than obey it blindly.

The Clover & Co. studio is the worked example throughout. The method generalises.

---

## 0 · Completion contract

Read this section twice. It governs everything else.

**You are done when every box in §14 is checked with evidence, not before.** Evidence means a
command you ran and its output, a file that exists at a path, or a screenshot you looked at —
not a belief that it probably works.

**You do not stop because:**
- the session is long
- a step failed once
- you are unsure and could ask (act on the safest assumption, state it, continue)
- a background job is "probably still running" (it probably isn't — see G3)
- you produced a document describing what remains instead of doing it

**You stop only when:**
- §14 is complete — report it as complete with the evidence, or
- you are **blocked**: a step cannot proceed without something only the human can provide
  (credentials, a decision between materially different products, a file that does not exist).
  A blocked report names the exact step, what was tried, and the one thing needed. Everything
  not blocked is finished first.

**Honesty rules.** Distinguish *verified* from *believed* in every status you give. If you
skipped a gate, say so. If a screenshot came from a software renderer or a Chromium-with-a-UA
stand-in rather than the real target, say so. Overstating reproducibility cost the next person a
day on this project; it is the specific failure this document exists to prevent.

**Progress rule.** Each phase ends with a gate. Do not enter the next phase until the current
gate passes. When a gate fails, fix the cause; do not route around it.

---

## 1 · What the pipeline is

```
photo ──► procedural scene ──► Cycles still ──► bake ──► glTF ──► gltfpack ──► three.js ──► one HTML file
          (python · bpy)      (lookdev target)   (light→tex)  (lights off)  (meshopt)   (CSS3D iframe)
```

Two ideas carry the whole thing:

1. **The Cycles render is the lookdev target.** Everything downstream exists to reproduce that
   image in a browser at 60fps. When the browser scene drifts from the still, the still is right.
2. **Light is baked, not simulated.** Cycles computes lighting once, offline, into textures. The
   browser draws unlit surfaces that already carry it. No realtime lights, no shadow maps, no GI
   per frame — which is exactly why it runs on a phone.

The thing that makes it a demo rather than a render: the monitor in the scene shows a **real
`<iframe>`**, positioned in 3D by `CSS3DRenderer`, visible through a depth-only hole punched in
the WebGL canvas. Clickable, scrollable, live DOM.

---

## 2 · Environment

| Need | Fact |
|---|---|
| Blender | **Not required as a binary.** `pip install bpy==5.2.1` is a complete headless Blender. Python **3.13 exactly** — the 5.x wheels are cp313 only. (bpy 4.x needs 3.11.) |
| Network | On a locked-down box `download.blender.org` may be blocked while PyPI is allowed. Check `curl -sS "$HTTPS_PROXY/__agentproxy/status"` before assuming. |
| Node | esbuild 0.28.x, gltfpack 1.2.x, three 0.169.0 — pinned in `web/package.json`. `npm install` in `web/`. |
| Fonts | Liberation Sans on Linux; Arial on Windows/mac (metric-compatible, layout holds). `CLOVER_FONT_DIR` pins exact faces. A fallback to Blender's Bfont *warns* — if you see the warning, text will silently change shape. |
| Headless verification | Playwright + a Chromium binary. Software GL: `--use-gl=angle --use-angle=swiftshader`. Screenshots at DPR 1 — DPR 3 under SwiftShader times out. |
| GPU | None assumed. Blender 5's compositor needs one; post-processing is numpy on the linear EXR instead (§5). |

**Gate 2:** `python -c "import bpy; print(bpy.app.version_string)"` prints 5.2.x, and
`web/node_modules/.bin/gltfpack -h` prints a version.

---

## 3 · Phase A — Read the reference, solve the camera

Do this on paper before any geometry. Composition errors found after modelling cost hours.

1. **Identify the hero.** The object the camera is about. Here: the CRT.
2. **Measure fractions of frame.** Hero width / frame width. A second object at a known
   different depth (here the keyboard) / frame width. A far-plane feature (doorway height) /
   frame height.
3. **Solve.** Frame width at a plane scales linearly with distance from camera. Two known
   objects at two depths give you the horizontal FOV and camera distance; the far feature
   checks it. For a 36mm sensor, `focal = 18 / tan(hfov/2)`.
4. **Sanity-check against the vertical.** A wide lens that shows both the desk surface and the
   top of the back wall must sit near desk height. If your solve says the camera is 1.5m up
   and the desk fills the bottom quarter of frame, the solve is wrong.

Worked result: 24mm, camera 0.86m behind the monitor face, 1.05m up, tilted ~2° down. First
attempt was 32mm at 0.87m and cropped everything; the wordmark sat above the frame entirely.

**Gate A:** a written camera spec (focal, position, target) with the two-object derivation.

---

## 4 · Phase B — Build the scene procedurally

**Why procedural.** A parametric scene is a set generator. Every fix in this project was a code
change; nothing was ever remodelled by hand. It also means zero downloaded assets — the whole
image is reproducible from source.

**Module layout that worked** (`scene/`):

| Module | Owns |
|---|---|
| `util.py` | mesh primitives: box, loft, superellipse rings, strut-between-points, text |
| `palette.py` | every colour as hex + `srgb()` linearisation |
| `materials.py` | procedural shaders, cached by name |
| `crt.py` `peripherals.py` `props.py` `furnishings.py` `plants.py` | objects |
| `room.py` `desk.py` | architecture |
| `screen.py` | the interface as emissive geometry |
| `lighting.py` `camera.py` `post.py` | light, lens, grade |
| `build.py` | assembly + CLI |
| `webexport.py` | everything after the render |

**Techniques worth copying:**

- **Loft superellipse cross-sections** for anything moulded — the CRT, mouse, keycaps. A
  superellipse with exponent 16 is a rounded rectangle; exponent 3 is nearly an ellipse. Vary
  it along the loft and you get a real CRT's boxy face, straight sides and hard taper. A rounded
  cube never reads right. Keep the front face and rim **flat-shaded**; smooth only the swept sides.
- **The screen as geometry.** Draw the UI as emissive plates and text objects on a virtual
  640×480 raster mapped to the screen's metres. It lights the desk in Cycles, and later becomes
  the "baked screen" fallback in the browser.
- **Emission colours must be linearised.** `P.srgb()` not raw hex. A navy pixel at raw sRGB
  emits far too much; the whole screen washes to pale. This was the single biggest screen fix.
- **Per-face shading flags are decisions.** A helper that force-smoothed every face turned the
  monitor into a pillow. `bevel()` must not touch `use_smooth`.
- **Iterate at 800×450, 28 samples.** ~35s a render. Do not tune composition at final quality.

**Gate B:** a preview render whose composition matches the reference on: hero size, wordmark
placement, doorway position, foreground props at frame edges. Check every named element is
*in frame* — the first three attempts each had something just outside it.

---

## 5 · Phase C — The Cycles still

- View transform: **Khronos PBR Neutral** for a saturated reference. AgX desaturates emissive
  highlights and flattened the screen.
- Render to **linear OpenEXR**, then bloom + vignette in numpy (`post.py`), then let Blender's
  colour management write the PNG via `image.save_render()`. This replaces the compositor, which
  needs a GPU in Blender 5. Bloom threshold in linear ~2.6; strength ~0.07 — at 0.18 it hazed
  everything.
- Committed still: 1600×900, 96 samples, ~9.5 min on 4 CPU cores. 1080p/200spp was ~35 min and
  never needed.

**Gate C:** `renders/<name>.png` exists, and you have *looked at it* against the reference.

---

## 6 · Phase D — Bake

**What gets what:**

| Surface class | Bake target | Why |
|---|---|---|
| Large flat statics (floor, ceiling, walls, desk top) | **Texture lightmap** on a second UV channel | needs resolution; ~15 objects |
| Everything else (props) | **Runtime lights** for now; vertex AO-multiply next | see D5 |
| Procedural materials | **Albedo texture** | glTF cannot carry a node graph |

**D1 — Select by exact name, never by prefix.** `LIGHTMAP_NAMES` is a frozenset. A prefix
`"Back_"` meant for three walls matched 54 props and set the baker grinding megapixel
lightmaps for plant soil for an hour before dying.

**D2 — Order:** `convert_text_and_curves → apply_modifiers → bake_material_albedo →
flatten_procedural_colors → tame_emission → split_screen_face → add_lightmap_uvs →
bake_lightmaps → apply_lightmaps → export`. **Albedo before flatten** — flatten severs the Base
Color links the albedo bake reads. `webexport.run()` encodes this order; use it.

**D3 — Every long job is resumable.** Write each output as it lands, skip what exists, stop
cleanly on a `time_budget`. Run it repeatedly in the foreground until nothing remains. Vertex
bakes checkpoint into `export/work.blend` (see G3 for why this is non-negotiable).

**D4 — Settings that worked:** 768px, 48 samples for lightmaps (~50s each on 4 cores, 15 in two
7-minute chunks). Vertex: 20 samples, ~0.7s per object, 954 in ~8 minutes.

**D5 — The vertex bake is switched off, and why.** A COMBINED bake (light × colour) on a prop
with a handful of vertices carries almost no signal; the wall wedge is one triangle and came back
black. Then gltfpack simplification removes vertices and `-vc 8` crushes colours. The correct
form is **AO-only, multiplied** into the lit material: smooth, low-frequency, survives sparse
vertices, and can never destroy the albedo. Not yet done. The data for the COMBINED attempt is
in `work.blend` for reference.

**D6 — Lightmaps are 8-bit PNG with no view transform.** Highlights clip; the browser grade
drifts from the still (back room blows out). Fix: bake to float or apply exposure before saving.
Open.

**Gate D:** `export/lightmaps/` holds one PNG per name in `LIGHTMAP_NAMES`, and
`apply_lightmaps()` reports the same count.

---

## 7 · Phase E — Export to glTF

`export_glb(path, lights=False, vertex_colors=False, image_format="JPEG")`. Every default is a
scar:

- **`lights=False`.** Blender lamps convert to physical units — the sun exported at **5,327
  lux**, the desk lamp at **6,413 candela** — against runtime lights tuned 0.5–5.5. The whole
  room rendered white. This was misdiagnosed as "software rendering" twice before a debug
  handle asked the live scene what lights it had. The runtime also strips strays on load.
- **`vertex_colors=False`.** `GLTFLoader` sets `material.vertexColors = true` whenever `COLOR_0`
  exists, so merely shipping the attribute multiplies it into every albedo.
- **`image_format="JPEG"`.** Setting `Image.file_format` on the datablock does nothing at
  export. This flag is what took the page from 6.85 MB to 3.46 MB (15 lightmaps: 2.9 MB PNG →
  393 KB JPEG).
- **Draco off.** The pip `bpy` build has no encoder; the flag was a silent no-op, and gltfpack
  can't read draco input anyway.
- **`split_screen_face()` parents without `matrix_parent_inverse`.** Setting it cancelled the
  monitor's transform and parked the screen at the world origin; the camera flew under the desk.
- **Blender +Y is three.js −Z.** The first spawn point stood inside the back wall.

**Gate E:** open the GLB's JSON chunk. `images` are all `image/jpeg`; `extensionsUsed` has no
`KHR_lights_punctual`; the node `CRT_ScreenFace` exists; count materials whose
`baseColorFactor` is pure white and be able to name each one.

---

## 8 · Phase F — Web build

`cd web && npm install && python build.py` — export → gltfpack → esbuild → assemble. Each
stage skips if its output exists. `--fragment` for the artifact wrapper (which supplies
doctype/charset/viewport); default is a standalone document.

**gltfpack:** `-cc -vp 16 -vt 14 -vn 10 -si 0.92 -kn -km -ke`. 16-bit positions keep the bezel
and card text crisp (14 gave a 7% error warning); `-si 0.92` keeps book spines legible (0.85 ate
them). meshopt decoder is bundled with three; no CDN.

**The screen (in `web/src/app.js`):**
1. Transparent WebGL canvas (`alpha:true`, clear alpha 0) on top; `CSS3DRenderer` layer behind.
2. A `PlaneGeometry` with `MeshBasicMaterial({colorWrite:false})`, `renderOrder:-1`, on
   `CRT_ScreenFace`'s world transform — writes depth, no colour: the hole.
3. `CSS3DObject(iframe)` on the same transform, scaled `metres / css-pixels`, nudged 4mm back.
4. Hide the emissive screen plates geometrically (small meshes within 0.24m of the anchor) —
   they sit 1.5mm behind the punch, closer than the depth buffer resolves. Name-based hiding
   broke after gltfpack merged nodes.
5. `SITE_URL` constant → `iframe.src`; empty → bundled stub via `srcdoc`. A real URL works
   **self-hosted only** (artifact sandbox blocks it) and only if the target sends no
   `X-Frame-Options`/`frame-ancestors`.

**Input:** derive look-deltas from `clientX/Y`, not `movementX/Y` (empty for touch). Thumbstick
for `(pointer: coarse)`. Hold *horizontal* FOV constant — three.js `fov` is vertical and portrait
otherwise crops to a sliver. Every fixed-position HUD element needs `position:fixed` — the
primary button shipped without it and was invisible to humans while Playwright clicked it fine.

**Lighting:** `Baked_*` materials with a `map` → `MeshBasicMaterial` (unlit). A lit material on
a COMBINED bake lights already-lit pixels twice. Runtime lights stay only for props. Keep any
point light **well away** from surfaces — a "CRT spill" at 30cm behaved like 18× its nominal
and turned every beige object mint.

**Gate F:** `web/dist/<name>.html` exists, under the publishing limit (16 MB artifact / 30 MB
transfer), and §9 passes on it.

---

## 9 · Phase G — Verify (mandatory, every build)

**G1 — Headless harness** (pattern in `docs/REVIEW-2026-09-06.md` history; keep one in
`web/verify.py`): load with `?debug`, wait for the loader to remove itself, then assert:
- telemetry: triangle count in expected range; `baked` reads the lightmap count
- `window.__dbg.lights()` returns only the runtime set at sane intensities
- press `E`, locate the iframe frame, click its button, read back the counter → clicks landed
- `document.compatMode === "CSS1Compat"`, `characterSet === "UTF-8"` (standalone only)
- zero `pageerror`

**G2 — Look at it.** Take the screenshot and view it. Then a second at phone dimensions
(390×844, `has_touch`). The harness passed on a page with an invisible main button and a
camera inside a wall; a human question ("how do I walk on iOS?") caught both.

**G3 — Interrogate before you reason.** When something looks wrong, ask the live scene:
`__dbg.lights()`, `__dbg.emissive()`, `__dbg.matInfo('keycap')`. Two lighting bugs were each
misdiagnosed twice by reasoning from symptoms. Both fell in one probe.

**G4 — Background processes die when the session idles.** In the remote container, both
long bakes were killed within minutes of the conversation going quiet — not OOM, not a crash.
Reporting "still grinding" from a file count while the process was dead cost an hour. Long work
runs in foreground chunks under 10 minutes, resumable (D3). Check `ps` before believing a job
is alive.

**Gate G:** G1 output pasted, G2 screenshots viewed and described, any G3 probe results noted.

---

## 10 · Phase H — Publish and hand off

- **Artifact:** `--fragment` build, ≤16 MB. Inline everything; the sandbox fetches nothing.
- **Self-hosting:** standalone build. Then split assets out — GLB + KTX2 as cached files, not
  base64 — and set `SITE_URL`.
- **Transfer limit 30 MB per file.** Split: source / `work.blend` / `.git`. `git gc --aggressive`
  first. The branch is the real single-file handoff.
- **Commit what cannot be regenerated cheaply**: `work.blend` (hours of CPU), the packed GLB,
  the still. Gitignore what rebuilds in seconds.
- **Docs travel with the code**: `docs/HANDOFF.html`, `docs/ROADMAP.html`,
  `docs/REVIEW-*.md`, this file. A clone must carry the same context the conversation did.
- **Run an adversarial second-model review** before calling a handoff done, calibrated as "a
  working system to harden." It found the web build was unreproducible from a clone — the
  one failure that costs the next person a day.

**Gate H:** a fresh clone reproduces the page with the README commands, verified by running
them, not by reading them.

---

## 11 · Guardrails, consolidated

Each is a rule; the parenthetical is the receipt.

1. No Blender lights in glTF. *(5,327-lux sun; white room; misdiagnosed twice.)*
2. No `COLOR_0` unless the runtime is built for it. *(GLTFLoader auto-enables vertexColors.)*
3. Albedo bake before flatten. *(flatten severs the links.)*
4. Lightmap targets by exact name. *(`Back_` matched 54 props.)*
5. Every job >2 min is resumable and runs in the foreground. *(two bakes killed on idle.)*
6. Linearise emission colours. *(washed screen.)*
7. Flat shading is a per-face decision; helpers don't override it. *(pillow CRT.)*
8. Blender +Y → three −Z; no `matrix_parent_inverse` on the screen face. *(spawn in a wall; screen at origin.)*
9. Look at every render and screenshot; test at phone size. *(invisible button; camera in wall.)*
10. Probe the live scene before diagnosing from symptoms. *(two double-misdiagnoses.)*
11. Point lights stay >0.5 m from surfaces or get their falloff checked. *(mint desk.)*
12. `image_format` at export, not on the datablock. *(no-op; 2× payload.)*
13. Report verified vs believed, separately, every time. *(overstated reproducibility.)*
14. Second-model review before handoff. *(caught the unreproducible build.)*

---

## 12 · Symptom → cause → one test

| Symptom | Likely cause | Test |
|---|---|---|
| Whole scene white/blown | exported lights | `__dbg.lights()` — anything >100? |
| Big surfaces white, props coloured | node-driven Base Color → white | GLB JSON: `baseColorFactor` = [1,1,1] on which materials? |
| Warm objects look mint/cyan | a cool light too close | `__dbg.lights()` positions vs desk; `matInfo` shows correct albedo |
| Screen washed/pale | emission not linearised | check `M.emissive` uses `P.srgb` |
| Screen at world origin / camera under desk | `matrix_parent_inverse` on screen face | print `CRT_ScreenFace` world pos; expect y≈1.0 |
| Camera inside a wall at spawn | Y/Z sign | spawn z should be *positive* (in front of desk) |
| Props dark after vertex bake | COLOR_0 multiplying | GLB JSON: any `COLOR_0` attribute? |
| Text/spines mushy in browser | gltfpack `-si` too low or `-vp` too low | rebuild with `-si 0.92 -vp 16` |
| Bake "still running" for an hour, no output | process dead (idle suspension) | `ps aux \| grep bake` |
| Mojibake in HUD when self-hosted | fragment served without charset | build without `--fragment` |
| Portrait phone shows a white blob | vertical FOV | hold horizontal FOV; see `fitCamera()` |
| Button exists in DOM, invisible on page | missing `position:fixed` | screenshot, don't trust the click |

---

## 13 · Adapting to a new reference

**Changes:** the camera solve (§3); `palette.py`; the object modules (which objects, their
sizes, their placement in `build.py`); `screen.py` content; `LIGHTMAP_NAMES`; `SITE_URL`;
spawn point and clamps in `app.js`.

**Does not change:** the phase order, every gate, `util.py`, `materials.py` recipes,
`webexport.py` sequence, `build.py`, the CSS3D hole-punch, the verify harness, §11.

Budget for a new interior of similar complexity, one model on 4 CPU cores, if nothing below is
relearned: scene ~4–6 h of iteration, still ~10 min, bakes ~20 min in chunks, web ~1 h,
verification ~30 min. The first time through took about a week; that difference is this document.

---

## 14 · Definition of Done

Check with evidence. All of them.

- [ ] **Gate 2** — `bpy` 5.2.x and gltfpack respond
- [ ] **Gate A** — camera spec written with derivation
- [ ] **Gate B** — preview composition matches reference; every named element in frame (viewed)
- [ ] **Gate C** — still rendered and viewed against reference
- [ ] **Gate D** — lightmap count == `LIGHTMAP_NAMES`; applied count matches
- [ ] **Gate E** — GLB: JPEG images, no punctual lights, `CRT_ScreenFace` present, white materials enumerated
- [ ] **Gate F** — page built under size limit
- [ ] **Gate G** — harness output pasted; desktop + phone screenshots viewed; probes noted
- [ ] **Gate H** — fresh-clone rebuild executed and passed
- [ ] Everything not regenerable in seconds is committed and pushed
- [ ] Status report separates *verified* from *believed*, names anything skipped
- [ ] Second-model review run and folded in, or explicitly deferred with reason

If any box is unchecked and you are not blocked (§0), you are not done. Continue.
