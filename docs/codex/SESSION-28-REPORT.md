# SESSION-28 Report — Flows are modular

## What was built

- Removed the refill-chain checkbox and help text from account editing.
- Removed automatic waterfall generation and the `waterfall` layout/render
  kind. Legacy `inWaterfall` flags remain accepted but do not directly affect
  layout.
- Added deterministic `migrateClient(data)` handling after book validation.
  A legacy chain becomes dotted `migrated-flow:<sourceId>` records in the old
  fixed bucket/order sequence, legacy geometry overrides move to the normal
  flow key, and all legacy flags become false. Re-running the migration is a
  no-op.
- Updated all source samples to explicit dotted flow records.
- Added required flow styles (`dotted`, `dashed`, and `solid`) and optional
  free-text labels. New flows default to dotted; style-less Session 24 records
  load as solid.
- Preserved migrated chain geometry with the prior cap-to-cap routing contract
  while keeping ordinary flows fully modular.
- Rendered dotted and dashed flows with the existing map dash grammars and
  solid flows with the shipped custom-arrow look. Flow labels render at the
  curve midpoint in map, print, and PNG paths.
- Added hover controls for flow geometry, deletion, style cycling, and
  in-place label editing. Each style or label change commits once through the
  existing history path.
- Added deletable income and draw-as-needed arrows. Their keys persist in
  `hiddenArrows`, and Reset exposes `Restore generated arrows` only when
  needed.
- Made the legend derive only from visible generated arrows. The Refills
  entry is gone, custom flows add no legend entries, and no visible generated
  arrows means no legend.
- Added Ctrl/Cmd+wheel zoom in the existing 50–200% ten-point steps. Scroll
  compensation is applied after layout at the pointer anchor; zoomed stages
  provide enough pan area to preserve cursor position even when the new page
  width would otherwise still fit.

## Local commits

1. `7a17031 replace refill chains with modular flows`
2. `dd308e7 add frictionless flow controls and cursor zoom`

No push was performed.

## File-by-file LOC

| File | LOC |
| --- | ---: |
| `src/model/types.ts` | 167 |
| `src/model/book.ts` | 628 |
| `src/model/samples.ts` | 281 |
| `src/layout/layout.ts` | 1,839 |
| `src/render/MapSvg.tsx` | 2,126 |
| `src/render/mapInteraction.ts` | 282 |
| `src/ui/MapTextEditor.tsx` | 317 |
| `src/form/Form.tsx` | 1,022 |
| `src/App.tsx` | 1,230 |
| `src/styles/app.css` | 1,598 |
| `tests/book.test.ts` | 629 |
| `tests/layout.test.ts` | 1,171 |
| `tests/mapedit.test.ts` | 330 |
| `tests/overrides.test.ts` | 472 |
| `docs/codex/SESSION-28-REPORT.md` | 195 |

The touched files over the approximately 400 LOC guidance are
`src/model/book.ts`, `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
`src/form/Form.tsx`, `src/App.tsx`, `src/styles/app.css`,
`tests/book.test.ts`, `tests/layout.test.ts`, and
`tests/overrides.test.ts`. They were not split because the session file map
and the repository's explicit architecture rules take precedence.

## Tests added and updated

- `book.test.ts`: migration determinism; three-account chain-to-record order;
  legacy override transfer; legacy absent style normalization; hidden-arrow
  validation; and account defaults without refill flags.
- `layout.test.ts`: no generated flow from `inWaterfall`; migrated dotted
  cap-to-cap pins; no `waterfall` kind; hidden income/as-needed output; and
  truthful generated-arrow legend inputs.
- `mapedit.test.ts`: default dotted creation; pure dot → dash → solid → dot
  cycling; flow-label commit/clear; generated-arrow hide and restore; labeled
  noninteractive/print rendering; and zero editor chrome.
- `overrides.test.ts`: migrated flow override keys and moved/resized/free
  endpoint attachment pins.

## Screenshot verification

Headless Chrome was launched with both browser streams redirected before
launch:

- stdout: `C:\tmp\session28-browser.stdout.log` (0 bytes)
- stderr: `C:\tmp\session28-browser.stderr.log` (244 bytes)

The local server streams were also redirected to files under `C:\tmp`.
Nothing from the browser process printed to the console.

1. `C:\tmp\session28-1-legacy.png`
   - Loaded a localStorage book with three true `inWaterfall` flags and no
     explicit flows.
   - Two dotted arcs appeared in each rendered map instance (interactive and
     hidden print map), retaining the legacy cap-to-cap appearance.
   - Full form was selected and an account card opened; no refill-chain
     checkbox/help was present.
   - No Refills legend entry was present.
2. `C:\tmp\session28-2-labeled-solid.png`
   - Cycled one migrated flow dotted → dashed → solid.
   - Added `$2,000/mo — funds 529` through the in-place `aa` editor.
   - The label rendered at the flow midpoint.
3. `C:\tmp\session28-3-income-hidden.png`
   - Deleted the generated income arrow.
   - Both its path and Income legend entry were absent.
4. Restore verification
   - Reset exposed `Restore generated arrows`.
   - Activating it restored both the income path and Income legend entry.
5. `C:\tmp\session28-4-cursor-zoom.png`
   - Ctrl+wheel changed the zoom readout from 72% fit to 80%.
   - The selected after-tax drum center moved only 0.14 px horizontally and
     0.46 px vertically relative to the pointer.
6. `C:\tmp\session28-5-print.png`
   - Print emulation contained the solid flow and
     `$2,000/mo — funds 529` label.
   - Print editor chrome count was zero.
   - With income hidden, only the truthful Draw as needed legend entry
     remained, and the workspace chrome was hidden.

Machine-readable browser assertions are in
`C:\tmp\session28-browser-results.json`.

## Gates

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 53 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BNIiSXa6.css                             22.95 kB │ gzip:  5.23 kB
dist/assets/index-DsYFqUII.js                             294.29 kB │ gzip: 92.22 kB
✓ built in 759ms
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/textfit.test.ts (5 tests) 11ms
 ✓ tests/contrast.test.ts (10 tests) 4ms
 ✓ tests/math.test.ts (16 tests) 15ms
 ✓ tests/format.test.ts (24 tests) 16ms
 ✓ tests/filestore.test.ts (3 tests) 3ms
 ✓ tests/undo.test.ts (6 tests) 9ms
 ✓ tests/wizard.test.ts (6 tests) 9ms
 ✓ tests/form.test.ts (4 tests) 13ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/book.test.ts (60 tests) 49ms
 ✓ tests/overrides.test.ts (20 tests) 70ms
 ✓ tests/layout.test.ts (58 tests) 166ms
 ✓ tests/mapedit.test.ts (20 tests) 70ms

 Test Files  13 passed (13)
      Tests  235 passed (235)
   Start at  22:36:52
   Duration  1.21s (transform 2.54s, setup 0ms, collect 4.78s, tests 438ms, environment 15ms, prepare 1.95s)
```

## Deviations

- The approximate budget was 550–750 changed lines. The two implementation
  commits total 894 insertions and 230 deletions. The overage is stated
  plainly; deterministic migration and override transfer, dual render modes,
  six interaction paths, cursor anchoring, and the specified regression tests
  required more changes than estimated.
- No dependency was added.
- No repository file outside the Session 28 file map was created or changed,
  except this required report.

## Noticed but not done

- No wants outside Session 28 were implemented or added to `NOTES.md`.
- Legacy `inWaterfall` remains accepted solely for load migration, as
  specified. New account defaults and presets do not write it.
