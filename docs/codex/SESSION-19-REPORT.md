# SESSION-19 Report

## Built

- Added account-only free rotation through `LayoutOverride.rot`, normalized
  modulo 360 on interaction and book load and finite-validated with the other
  override fields.
- Rotated each complete account SVG group around its box center, including
  text, sub-account insets, highlight, and edit chrome. Income, need, and the
  as-needed chip remain upright.
- Added a circular rotate handle approximately 22 artboard units above the
  account. It uses the existing drag threshold, preview, pointer capture,
  Escape cancellation, single release commit, and undo/redo path.
- Added pure soft snapping to each 15-degree multiple within an inclusive
  three-degree window; angles outside that window remain free.
- Clamped account placement and maximum resized dimensions using the rotated
  axis-aligned bounding box against the page margins and masthead rule.
- Rotated local outline samples before facing-anchor selection. Arrow
  clearance continues through the existing sampled routing, using rotated
  account bounds as obstacles.
- Added `startAt` and `endAt` free endpoint overrides as artboard-axis offsets
  from the connected element's box center. They take precedence over legacy
  `startT` and `endT`, clamp to page margins, follow move/resize through the
  center offset, and compose with `bow` against the current chord.
- Changed endpoint-handle drags from outline projection to free placement.
  Arrow source/target IDs, kind, legend, dash grammar, marker, and chip
  behavior were not changed.
- Kept the existing screen-aligned in-place text editor behavior: it still
  uses the clicked rotated glyph's screen rectangle for a horizontal overlay.
- Reset layout continues to delete the entire override record, clearing
  rotation and free endpoints with all other layout edits.

Implementation commits:

- `4d1ed58 Add rotation and free endpoint geometry`
- `7bd987f Add rotation and free endpoint controls`

## Files

| File | Physical LOC | Change |
| --- | ---: | --- |
| `src/model/types.ts` | 117 | Added rotation and free endpoint override fields. |
| `src/model/book.ts` | 305 | Finite-validates all numeric override fields and endpoint coordinates; normalizes loaded rotation. |
| `src/layout/layout.ts` | 1,227 | Added rotated geometry, bounds-aware clamping, rotated outline anchors/obstacles, and center-relative free endpoint routing. |
| `src/render/MapSvg.tsx` | 1,703 | Renders rotated account groups and implements rotate/free-endpoint pointer interaction. |
| `src/render/mapInteraction.ts` | 150 | Added pure rotation normalization/snapping and modulo storage in override merging. |
| `src/styles/app.css` | 1,290 | Added rotate-handle visibility and grab/grabbing chrome. |
| `tests/overrides.test.ts` | 449 | Added normalization, validation, snap, rotated clamp, endpoint precedence/following, and legacy compatibility coverage. |
| `tests/layout.test.ts` | 681 | Added 45-degree and 90-degree rotated cardinal-outline anchor coverage. |

The implementation diff is 517 touched lines: 494 insertions and 23
deletions, within the prompt's approximate 450–650 changed-line budget.

`layout.ts`, `MapSvg.tsx`, `app.css`, `overrides.test.ts`, and
`layout.test.ts` are above approximately 400 physical LOC. They were not
split because the session file map prescribes these files and no new
implementation file was needed.

No repository implementation file outside the session file map was created
or changed. This report is the prompt-specified final documentation file.

## Browser verification

Method: served the final production build and drove a fresh-profile headless
Google Chrome through the Chrome DevTools Protocol at 1600×1200, device scale
factor 1. A fixture applied a 30-degree rotation and a free as-needed start
point to the first sample client. Real pointer events then dragged the
connected short-term drum. DOM assertions, screen and print-emulation
screenshots, and manual visual inspection were all used.

- The short-term drum rendered with
  `rotate(30 515 309)`. Its outline, label, caption, value, and edit controls
  rotated as one group. Waterfall arrows met the rotated silhouette.
- Hovering the account exposed the circular rotate handle above the shape,
  along with the existing shape/resize chrome.
- The free as-needed endpoint initially rendered at `M 305 184`, away from
  the drum. Dragging the drum committed `dx=81.6262` and `dy=46.6436` while
  preserving `startAt={dx:-210,dy:-125}`; the endpoint moved by the same
  delta to `M 386.6 230.6`.
- The free arrow remained an as-needed arrow with the same dashed grammar,
  arrowhead, legend entry, chip, source, and target.
- Print emulation preserved
  `rotate(30 596.6262 355.6436)` after the drag and reported zero visible
  rotate, resize, or arrow handles.
- Reset layout removed `layoutOverrides`, removed the account transform, and
  restored the generated arrangement and smart anchors.

### Screenshots

| State | Screenshot | SHA-256 |
| --- | --- | --- |
| 30-degree drum, rotated text/anchors, and hover handle | `C:\tmp\session19-rotation-and-handle.png` | `7e7e6eb1d424c4c0fdb49b3beb9f7c7ca9ff02c8cab0f98f68ba7aeac39ac4cf` |
| Free endpoint after dragging its connected drum | `C:\tmp\session19-free-endpoint-after-account-move.png` | `5cfcb59abdff5bf5992d11bf949b4a96054c018b328acdbaddb0edf511f2fbaf` |
| Print emulation with arrangement preserved and no chrome | `C:\tmp\session19-print.png` | `81dd963e0b542403ff5f8e96d92a7802789f5cbf3eff832eb6cbf6a7a045cf87` |
| Reset generated arrangement | `C:\tmp\session19-after-reset.png` | `d92776b5156625e88f2156bb336f7a47968f21044bfc8e6eaf0e97169de9bb6c` |

The screenshots, temporary browser driver, and isolated Chrome profile remain
outside the repository under `C:\tmp`. The verification processes were
stopped.

## Tests added

- Rotation is applied and stored modulo 360.
- Book parsing normalizes rotation and rejects non-finite rotation/endpoint
  coordinates.
- The snap helper snaps inside the inclusive ±3-degree window and preserves
  free angles outside it, including wraparound near zero.
- Rotated account bounds clamp at page/masthead limits, including an
  oversized 45-degree resize.
- Cardinal drum outline points and routed anchors rotate correctly at 45 and
  90 degrees.
- `startAt`/`endAt` take precedence over simultaneous legacy t-values.
- A free endpoint follows a moved/resized connected element by the exact
  center delta without changing connection IDs.
- Legacy t-only overrides continue to attach to the same outline parameters.
- Bow remains the requested perpendicular offset for a free-endpoint chord.

## Gates

The final gates were run from implementation commit `7bd987f`. Windows
PowerShell blocks the `npm.ps1` shim on this machine, so the same package
scripts were invoked through `npm.cmd`. The restricted filesystem sandbox
also prevented esbuild from reading the Vite configuration; the quoted final
runs used approved unsandboxed commands.

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 52 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-D9VNhwbk.css                             17.69 kB │ gzip:  4.35 kB
dist/assets/index-C7tuckUe.js                             269.13 kB │ gzip: 84.73 kB
✓ built in 825ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 4ms
 ✓ tests/format.test.ts (21 tests) 16ms
 ✓ tests/undo.test.ts (6 tests) 4ms
 ✓ tests/filestore.test.ts (3 tests) 4ms
 ✓ tests/math.test.ts (16 tests) 16ms
 ✓ tests/book.test.ts (27 tests) 11ms
 ✓ tests/export.test.ts (3 tests) 3ms
 ✓ tests/mapedit.test.ts (7 tests) 5ms
 ✓ tests/wizard.test.ts (6 tests) 7ms
 ✓ tests/overrides.test.ts (19 tests) 54ms
 ✓ tests/layout.test.ts (31 tests) 74ms

 Test Files  11 passed (11)
      Tests  149 passed (149)
   Start at  15:27:19
   Duration  1.02s (transform 774ms, setup 0ms, collect 2.03s, tests 198ms, environment 4ms, prepare 1.93s)
```

## Deviations and not done

- No Session 19 prompt deviations.
- An unrelated untracked `docs/codex/SESSION-20.md` appeared during this
  session. It was not read, edited, staged, or committed.
