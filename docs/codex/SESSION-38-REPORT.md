# SESSION-38 REPORT — Proportional leading and role gaps

## What was built

- Replaced fixed account-role spacing with one tokenized rule:
  `max(8, larger neighboring line height / 1.5)`.
- Set caption, position-row, sub-account-title, and sub-account-caption leading
  to exactly `1.45 ×` effective font size. Account-title leading remains
  `1.3 ×`.
- Applied the proportional rule to tag/title, title/caption, caption/rows,
  rows/value, value/sub-account inset, cap/content, content/bottom, runway, and
  sub-account-inset transitions.
- Kept all height calculations inside the Session 22 grow-to-fit loop, including
  proportional bottom clearances and layout-owned sub-account inset positions.
- Added layout-owned position-row records with measured label lines, intact
  formatted values, row baselines, hit-area geometry, and shape-aware horizontal
  coordinates.
- Measured every position row as label + 16-unit gap + value at the effective
  row font size. Labels wrap through `fitLines`; values remain single-line.
- Enforced at least 20 units of visible side clearance. A 21-unit layout inset
  absorbs Literata's approximately 0.88-unit rendered numeral overhang; browser
  measurement showed 20.12 units of actual right clearance at defaults.
- Made `MapSvg` render the exact row lines and coordinates supplied by layout,
  with no renderer-side wrapping or sub-account stacking arithmetic.
- Updated prior spacing, resizing, and static-render pins honestly for the new
  grow-to-fit and wrapped-row contracts.

## Logical commits

1. `ec01410 Implement proportional account spacing`
2. `60ca0d9 Pin proportional layout contracts`

The required report is committed separately after the implementation and test
commits.

## File-by-file LOC

| File | LOC | Session 38 work |
| --- | ---: | --- |
| `src/render/tokens.ts` | 137 | Added proportional leading tokens plus the shared role-gap token and helper. |
| `src/layout/layout.ts` | 2,225 | Added layout-owned wrapped position rows and applied proportional gaps throughout account and sub-account sizing. |
| `src/render/MapSvg.tsx` | 2,651 | Rendered layout-owned row lines/coordinates and layout-owned sub-account positions. |
| `tests/layout.test.ts` | 1,575 | Pinned leading/gap tables, default/enlarged role transitions, row wrapping/value integrity, every permitted row font size, sub-account gaps, sample fit, and updated prior spacing coordinates. |
| `tests/mapedit.test.ts` | 819 | Updated the existing 24-point static-render pin to expect layout-owned wrapped tspans and an intact value. |
| `tests/overrides.test.ts` | 503 | Updated two prior pins for proportional floating-point placement and grow-to-fit override height. |
| `docs/codex/SESSION-38-REPORT.md` | 178 | This report. |

`layout.ts`, `MapSvg.tsx`, and the three touched test files were already above
roughly 400 LOC before this session. They were not split because Session 38
permits no new source or test files.

## Required gates

### `npm run build`

Exit code: 0

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 56 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BHngfIqB.css                             26.66 kB │ gzip:  5.83 kB
dist/assets/index-Ap7R7yW_.js                             318.17 kB │ gzip: 99.38 kB
✓ built in 792ms
```

### `npm test`

Exit code: 0

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (33 tests) 18ms
 ✓ tests/textfit.test.ts (5 tests) 8ms
 ✓ tests/pdf.test.ts (2 tests) 3ms
 ✓ tests/math.test.ts (16 tests) 23ms
 ✓ tests/filestore.test.ts (3 tests) 4ms
 ✓ tests/contrast.test.ts (24 tests) 8ms
 ✓ tests/undo.test.ts (6 tests) 9ms
 ✓ tests/vocab.test.ts (7 tests) 12ms
 ✓ tests/export.test.ts (5 tests) 7ms
 ✓ tests/book.test.ts (78 tests) 43ms
 ✓ tests/overrides.test.ts (22 tests) 111ms
 ✓ tests/wizard.test.ts (6 tests) 8ms
 ✓ tests/form.test.ts (12 tests) 32ms
 ✓ tests/layout.test.ts (71 tests) 260ms
 ✓ tests/mapedit.test.ts (65 tests) 165ms

 Test Files  15 passed (15)
      Tests  355 passed (355)
   Start at  20:52:35
   Duration  1.44s (transform 2.66s, setup 0ms, collect 5.89s, tests 712ms, environment 3ms, prepare 2.14s)
```

The focused layout/text-fit preflight also passed: 76 tests across
`layout.test.ts` and `textfit.test.ts`.

## Browser and screenshot verification

The final pass used the production build, a fresh Chrome profile, a 1600×1000
viewport, Fit zoom, and print emulation.

Recorded owner-case assertions:

- Default row size: 14.5.
- Default visible position-label left padding: 21.00 units.
- Default visible position-value right padding: 20.12 units.
- Default Managed After-Tax Trust body height: 311.08 units.
- Enlarged row size: exactly 18.
- Enlarged labels: 2 lines and 3 lines.
- Enlarged values: zero tspans; both remained intact and single-line.
- Enlarged visible right padding: 20.99 units.
- Enlarged body height: 360.03 units.
- Whitfield, Calloway, and Venkat: Fit selected, 1 PDF page each, 0 print
  editor-chrome nodes, and a 1320×1020 viewBox.

All five final screenshots were visually inspected. Titles, captions, rows,
values, and inset text were separated; no text touched a drum edge; the
18-point labels wrapped; and all three sample compositions remained on one
landscape page.

| Scenario | Screenshot | SHA-256 |
| --- | --- | --- |
| Managed After-Tax Trust at defaults | `C:\tmp\s38-evidence-final\01-managed-after-tax-defaults.png` | `8fdadf1757579fb929e7c6ab8bdcd9c88dad3f57baf0f56ae5582733bbe4f462` |
| Same drum with rows at 18 | `C:\tmp\s38-evidence-final\02-managed-after-tax-rows-18.png` | `89b35b0bef72b16f50c23d8aabd994a9683b7a0b602c19e04ac8cc69b0ae7af2` |
| Whitfield at Fit in print emulation | `C:\tmp\s38-evidence-final\03-whitfield-fit-print.png` | `bd3d658cef39455c65a234b6bddb21f1114469f951bf6df616ee7caf0fe750db` |
| Calloway at Fit in print emulation | `C:\tmp\s38-evidence-final\04-calloway-fit-print.png` | `ddfb2709a79c7ae90ed9802a94333652977050bd524602f54f4f90ef785ef2fa` |
| Venkat at Fit in print emulation | `C:\tmp\s38-evidence-final\05-venkat-fit-print.png` | `dcdc2e2f2b5e2b60599f921e2ba2da7b12cb0809207b57d340a404efa2c4aff2` |

Machine-readable measurements and the three one-page PDFs are under
`C:\tmp\s38-evidence-final`. The verification driver is
`C:\tmp\s38-browser-verification.mjs`.

All browser-process streams were redirected under `C:\tmp`:

- `s38-preview.stdout.log` — 40 bytes
- `s38-preview.stderr.log` — 0 bytes
- `s38-chrome.stdout.log` — 0 bytes
- `s38-chrome.stderr.log` — 245 bytes
- `s38-driver.stdout.log` — 0 bytes
- `s38-driver.stderr.log` — 0 bytes

The preview and Chrome processes were stopped after verification.

## Deviations and notes

- The implementation/test diff is 483 insertions and 75 deletions: 558 changed
  lines, 158 above the approximate 250–400 budget. The additional lines are
  principally the layout-owned row record/measurement loop and the mandated
  default/enlarged, every-font-size, sub-account, and sample-fit regression
  table.
- `tests/mapedit.test.ts` and `tests/overrides.test.ts` are two extra touched
  files beyond the Session 38 file map. They contain three pre-existing pins
  made stale by the required wrapped-row and grow-to-fit behavior; changing
  those assertions was necessary for the required honest green gate. No
  production behavior was added through those files.
- `tests/textfit.test.ts` was not touched because the shared position-row
  measurement helper remained in `layout.ts`.
- The required report is the only new repository file.
- No sample overflowed the artboard or print page. No dependencies were added.
  No remote was added or changed, and no push was performed.
- Nothing else was noticed that warranted an out-of-scope code or `NOTES.md`
  change.
