---
name: studio-pipeline
description: Reproduce or extend the photo-to-walkable-browser-scene pipeline (procedural Blender via bpy → Cycles still → bake → glTF → gltfpack → three.js with a live iframe in the CRT). Invoke at the start of any session touching this project, or when adapting the method to a new reference photograph. Enforces the completion contract in docs/PIPELINE.md §0 and §14.
---

# Studio pipeline

You are operating the pipeline documented in `docs/PIPELINE.md`. That file is the manual; this
skill is the protocol for running it without stopping early or overstating what you did.

## Protocol

1. **Read `docs/PIPELINE.md` in full before any other file.** Then `README.md`, then
   `docs/REVIEW-*.md` (open findings are current). Do not skim §0 and §11.
2. **Run Gate 2 first** (environment), then **Gate H** (`cd web && npm install && python
   build.py`, then load the result). If Gate H fails on an untouched clone, that is the first
   task — nothing else proceeds on a broken base.
3. **Work the phases in order, gate by gate.** A gate passes on evidence: command output, a
   file at a path, a screenshot you viewed. Paste the evidence into your status.
4. **Every job over two minutes is resumable and runs in the foreground** in chunks under ten
   minutes. Background processes in remote containers die on idle. Check `ps` before
   believing a job is alive; never report progress from a file count.
5. **When something looks wrong, probe the live scene before reasoning** — load with
   `?debug` and use `window.__dbg` (`lights()`, `emissive()`, `matInfo(name)`). Then fix the
   cause. Do not route around a failed gate.
6. **Look at every render and every screenshot**, including one at phone dimensions. A
   passing headless assertion is not a usable page.

## Completion contract

You are done when **every box in `docs/PIPELINE.md` §14 is checked with evidence.** Until
then you continue. The only other exit is **blocked**: a step needs something only the human
can provide (a credential, a decision between materially different products, a missing
input). A blocked report names the step, what was tried, and the one thing needed — and
everything not blocked is finished first.

Not reasons to stop: session length; a step that failed once; uncertainty you could resolve
by acting on the safest assumption and stating it; a background job you believe is running; a
document describing remaining work.

## Status format

Every status separates **verified** (you ran it, here is the output) from **believed**.
Name anything skipped. If a screenshot came from a software renderer or a Chromium-with-
iPhone-UA stand-in rather than the real target, say so.

## Guardrails that override anything you'd otherwise do

From `docs/PIPELINE.md` §11 — each was paid for:

- Never export Blender lights to glTF. Never export `COLOR_0` unless the runtime is built for it.
- Albedo bake **before** `flatten_procedural_colors`. Lightmap targets by **exact name**.
- Linearise emission colours. Set `image_format` at export, not on the datablock.
- Blender +Y is three.js −Z. No `matrix_parent_inverse` on the screen face.
- No re-platforming: three.js + CSS3D was reviewed and confirmed for the end goal.
- Commit anything not regenerable in seconds; docs travel with the code.
- Before calling a handoff done, run an adversarial second-model review calibrated as
  "a working system to harden", and fold it in.

## Adapting to a new reference

Follow `docs/PIPELINE.md` §13. The phase order, gates, `util.py`, `materials.py`,
`webexport.py`, `build.py`, the hole-punch technique and the verify harness do not change.
The camera solve, palette, object modules, screen content, `LIGHTMAP_NAMES`, `SITE_URL` and
spawn/clamps do.
