# SESSION-11 Report

## Built

- Re-anchored the as-needed path on the short-term drum's actual lower ellipse
  silhouette, within the requested 25–45% width band.
- Gave the path an initial control direction that travels down and toward the
  need card, leaving a visible dash run between the drum and chip.
- Replaced chord-only obstacle checks with 32-segment sampling of the rendered
  quadratic. The source drum is excluded while the income panel, need card,
  and every other account remain obstacles.
- Preserved the existing chip-box placement logic and enforced a minimum
  60-unit start-to-chip distance in the layout rules.
- Made account values, account labels, income-source amounts, monthly need,
  and as-needed draw amounts directly editable from the preview map.
- Kept clicks on non-editable drum/panel content on the existing form-navigation
  route. Editable text stops propagation and requests an edit with its screen
  rectangle.
- Added a screen-only hover underline and text cursor for editable SVG text.
  The interactive props are absent from the separate print/PNG `MapSvg`.
- Added an absolutely positioned HTML editor outside the SVG. It selects the
  raw value on focus, commits on Enter or blur, and cancels on Escape.
- Routed money commits through `parseMoneyInput`, so shorthand such as `85k`
  works and empty input commits `null`, retaining `~$ ______`.
- Trimmed label commits. Empty labels store `''` and render through the existing
  bucket-specific `· unnamed` fallback.
- Kept `App.tsx` as the single state owner. Wizard, full-form, and map edits all
  use the same `handleClientChange` → `updateClient` path.
- Added pure model-level tests for every map money target, null commits, trimmed
  and unnamed labels, and cancellation without mutation.

## Files

Current file LOC (`Measure-Object -Line`) and SESSION-11 changes:

| File | LOC | SESSION-11 change |
| --- | ---: | ---: |
| `src/layout/layout.ts` | 613 | +74 / -21 |
| `src/render/MapSvg.tsx` | 1,051 | +127 / -14 |
| `src/App.tsx` | 406 | +47 / -11 |
| `src/ui/MapTextEditor.tsx` | 147 | new |
| `src/styles/app.css` | 778 | +28 / -0 |
| `tests/layout.test.ts` | 377 | +70 / -9 |
| `tests/mapedit.test.ts` | 64 | new |
| `docs/codex/SESSION-11-REPORT.md` | 135 | new |

Implementation and test changes total 630 changed lines (+575 / -55), or a net
+520 lines. This is 150 changed lines above the prompt's approximate 300–480
estimate. The additional lines are the typed overlay/edit lifecycle, pure
commit function and its target coverage, and rule-level sampled-curve geometry
tests.

`layout.ts`, `MapSvg.tsx`, `App.tsx`, and `app.css` remain above approximately
400 physical LOC. They were not split because Session 11 explicitly assigns
the work to those files and the file map permits only the new editor and test
files.

## Browser verification

Method: built the production bundle, served `dist` on localhost, and drove a
fresh-profile headless Google Chrome 150.0.7871.181 at 1600×1000, device scale
factor 1, and default visual viewport scale through the Chrome DevTools
Protocol. Full-viewport screenshots were manually inspected.

- Whitfield: the dashed curve begins on the lower-left drum arc, visibly leaves
  the underside before the chip, and travels left of the Cash drum.
- Calloway: the curve clears both Cash at Home and the installment-note card.
- Venkat: the curve visibly leaves the underside and clears Cash Accounts.
- Whitfield IRA edit: clicking `$2,450,000` placed a selected raw `2450000`
  HTML input directly over the SVG value without altering the SVG.
- Live commit: changing that input to `85k` and pressing Enter removed the
  editor and immediately rendered `$85,000` on both the screen map and the
  underlying client model.
- Print emulation: the print map rendered the committed `$85,000` value with no
  input, focus ring, underline, hover styling, or other editor artifact.
  Computed display was `none` for `.workspace` and `grid` for `.print-map`.
  The artifact geometry and content matched the screen map apart from the
  expected print scaling.

Screenshots and the temporary browser driver were kept outside the repository:

- `C:\tmp\session11-visual\01-whitfield.png`
- `C:\tmp\session11-visual\02-calloway.png`
- `C:\tmp\session11-visual\03-venkat.png`
- `C:\tmp\session11-visual\04-ira-editor.png`
- `C:\tmp\session11-visual\05-ira-85k.png`
- `C:\tmp\session11-visual\06-print-active-editor.png`
- `C:\tmp\session11-visual.mjs`

## Gates

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 48 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-lvhGHXpY.css                           12.21 kB │ gzip:  3.31 kB
dist/assets/index-Bmf0ut6N.js                           244.47 kB │ gzip: 76.41 kB
✓ built in 725ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 3ms
 ✓ tests/export.test.ts (3 tests) 2ms
 ✓ tests/book.test.ts (13 tests) 8ms
 ✓ tests/layout.test.ts (18 tests) 18ms
 ✓ tests/mapedit.test.ts (7 tests) 4ms
 ✓ tests/format.test.ts (21 tests) 16ms
 ✓ tests/wizard.test.ts (6 tests) 5ms

 Test Files  7 passed (7)
      Tests  78 passed (78)
   Start at  09:26:53
   Duration  895ms (transform 781ms, setup 0ms, collect 1.55s, tests 56ms,
   environment 1ms, prepare 949ms)
```

Before the final gates, the first full build caught a TypeScript narrowing error
in the new obstacle filter; it was corrected before the geometry commit was
finalized. A sandboxed build then could not read `vite.config.ts`; the approved
rerun and the final post-commit build quoted above passed. Focused layout and
map-edit test runs also passed before the full suite.

## Commits

- `82be9fc` — Fix as-needed arrow anchor and clearance.
- `dbc09d0` — Add in-place map text editing.
- Final report commit follows this file.

## Deviations and observations

- The implementation is 150 changed lines above the approximate upper budget,
  as detailed in the Files section.
- No product or test file outside the Session 11 file map changed. This report
  is the required session artifact.
- The existing print/PNG architecture already renders a separate, noninteractive
  `MapSvg`; the overlay remains entirely outside both SVG instances.
- Empty account labels now visibly use the existing `accountDisplayName`
  unnamed fallback in the map itself, as required for in-place label commits.
- No dependencies, validation, context/state libraries, captions, tags,
  footnote editing, or other v2 behavior were added.
- Nothing else out of scope was noticed or performed.
- Nothing was pushed and no remote was added.
