# SESSION-12 Report

## Built

- Added optional per-client `layoutOverrides` keyed by account id or the fixed
  `income`, `need`, and `asNeededChip` keys. Each override independently stores
  `dx`, `dy`, `w`, and/or `h`.
- Kept legacy books valid when the field is absent and added finite-number
  validation when it is present. JSON save/load and localStorage persistence
  continue to use the client object without a separate persistence path.
- Preserved the required layout pipeline: generate the base composition,
  center from base geometry only, apply final-artboard overrides, and then
  regenerate arrows, automatic chip placement, bounds, and footnote alignment
  from final geometry.
- Clamped translated and resized elements inside the 48-unit content margins
  and below the masthead rule. Account dimensions clamp to 180 units wide and
  `MIN_ACCOUNT_HEIGHT` (120 units) tall; cap radii derive from final width.
- Added pure screen/artboard transform, four-pixel drag-threshold, rectangle
  clamp, and immutable override-merge helpers in `mapInteraction.ts`.
- Added pointer drag for top-level account drums, note cards, income, need, and
  the as-needed chip. Movement previews through local `MapSvg` state and one
  `onChange` call commits on pointerup. Escape cancels without committing.
- Preserved plain click behavior for map navigation and in-place text editing.
  A crossed drag suppresses its resulting click; interactive SVG text selection
  is disabled so it cannot steal later pointer frames.
- Added bottom-right resize handles to top-level drums and note cards. Handles
  appear on hover/focus, use `nwse-resize`, and are absent from the separate
  print/PNG `MapSvg`.
- Made account title and caption wrapping width-relative while preserving each
  bucket's existing base-width wrapping.
- Added a quiet header-level Reset layout action. It is disabled without
  overrides, confirms through the existing `Dialog`, deletes the active
  client's override field, and reports completion through the existing Toast.
- Added tests for transform math, threshold behavior, immutable merges,
  translation order, resize and minimum clamps, page clamps, arrow
  reattachment, chip delta, post-override bounds/footnotes, override book
  round-trip, and legacy books.

## Files

Current physical LOC and SESSION-12 changes:

| File | LOC | SESSION-12 change |
| --- | ---: | ---: |
| `src/model/types.ts` | 93 | +8 / -0 |
| `src/model/book.ts` | 174 | +32 / -0 |
| `src/layout/layout.ts` | 819 | +161 / -3 |
| `src/render/MapSvg.tsx` | 1,311 | +245 / -15 |
| `src/render/mapInteraction.ts` | 111 | new |
| `src/App.tsx` | 460 | +32 / -0 |
| `src/styles/app.css` | 968 | +44 / -0 |
| `tests/overrides.test.ts` | 214 | new |
| `tests/book.test.ts` | 168 | +23 / -0 |
| `tests/layout.test.ts` | 417 | +0 / -0 |
| `docs/codex/SESSION-12-REPORT.md` | 177 | new |

Implementation and test changes total 888 changed lines (+870 / -18), or a net
+852 lines. This is 188 changed lines above the prompt's approximate 500–700
estimate. The additional lines are primarily the pure interaction helper and
its rule-level tests, plus the typed pointer lifecycle needed to preserve
click-to-navigate and click-to-edit behavior.

`layout.ts`, `MapSvg.tsx`, `App.tsx`, `app.css`, and `layout.test.ts` are above
approximately 400 physical LOC. They were not split because Session 12 assigns
the work to those existing files and permits only `mapInteraction.ts` and
`overrides.test.ts` as new implementation/test files.

## Browser verification

Method: served the app locally with Vite and drove an isolated-profile headless
Microsoft Edge 150.0.4078.83 through the Chrome DevTools Protocol at
1440×1000, device scale factor 1, default browser zoom, and cleared
localStorage. Full-viewport screenshots were manually inspected.

- Drag: moved Whitfield's Managed IRA approximately 80 artboard units left and
  down. The stored delta was `dx: -80.0013`, `dy: 80.0014`; waterfall paths
  changed and visibly reattached while unrelated placements stayed still.
- Resize: widened the Managed After-Tax Trust from 260 to approximately 440
  artboard units. Its caption rewrapped from two lines to one and the incoming
  and outgoing waterfall arrows reattached to the wider cap.
- Chip: moved the as-needed chip by approximately `dx: 240.0041`,
  `dy: -80.0014`; its final box no longer intersected the income panel.
- Reset: the confirmation dialog opened, Reset removed `layoutOverrides`,
  disabled its toolbar control, restored generated geometry, and showed the
  completion toast.
- Print: print emulation rendered the moved IRA geometry as the artifact.
  `.print-map` computed to `grid`, `.workspace` to `none`, and the print map
  contained zero resize handles (the hidden screen instance contained six).
- Reload: after the localStorage debounce and a page reload, the Managed IRA
  retained the exact same `dx`/`dy` override and rendered in the dragged spot.
- The first browser pass exposed SVG text selection consuming later pointer
  frames and an edge-centered handle being harder to acquire. Both were fixed
  before the final pass by disabling selection on the interactive SVG and
  insetting the handle inside the bottom-right corner.

Screenshots and the temporary browser driver remain outside the repository:

- `C:\tmp\session12-1-drag-ira.png`
- `C:\tmp\session12-2-resize-trust.png`
- `C:\tmp\session12-3-drag-chip.png`
- `C:\tmp\session12-4-reset.png`
- `C:\tmp\session12-5-print.png`
- `C:\tmp\session12-6-reload.png`
- `C:\tmp\session12-verify.mjs`

## Gates

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 49 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-BFdBFJGT.css                           12.96 kB │ gzip:  3.48 kB
dist/assets/index-CKIxtLE0.js                           249.61 kB │ gzip: 77.99 kB
✓ built in 743ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 3ms
 ✓ tests/format.test.ts (21 tests) 17ms
 ✓ tests/book.test.ts (15 tests) 11ms
 ✓ tests/overrides.test.ts (10 tests) 17ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/mapedit.test.ts (7 tests) 4ms
 ✓ tests/layout.test.ts (18 tests) 21ms
 ✓ tests/wizard.test.ts (6 tests) 5ms

 Test Files  8 passed (8)
      Tests  90 passed (90)
   Start at  09:53:53
   Duration  891ms (transform 660ms, setup 0ms, collect 1.62s, tests 83ms,
   environment 1ms, prepare 1.47s)
```

A focused model/layout run first found one test fixture whose moved account did
not change the already full-width sample bounds; the fixture was corrected to
exercise a blank composition. A sandboxed rerun then could not read
`vite.config.ts`; approved reruns and both final full gates quoted above passed.

## Commits

- `19c09b0` — Add per-client layout overrides.
- `b001ed9` — Add direct map drag and resize controls.
- Final report commit follows this file.

## Deviations and observations

- The implementation is 188 changed lines above the approximate upper budget,
  as detailed in the Files section.
- `tests/layout.test.ts` was intentionally left byte-for-byte unchanged; all 18
  existing layout assertions pass against the new pipeline.
- Resizing is limited to top-level account drums and note cards. Income, need,
  and sub-account inset drums have no handles, exactly as scoped.
- No product or test file outside the Session 12 file map changed. This report
  is the required session artifact and the only new file under `docs/codex`.
- No dependencies, context/state libraries, CSS-in-JS, collision avoidance, or
  other v2 behavior were added.
- Nothing else out of scope was noticed or performed.
- Nothing was pushed and no remote was added.
