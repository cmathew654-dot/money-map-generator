# SESSION-37B REPORT — Income width floor uses scaled text

## What was built

- Added one pure `incomeTextSizes` helper that resolves the effective income
  header, row-label, row-value, row-qualifier, total-label, and total-value
  font sizes from the active role overrides.
- Made both `incomePanelMetrics` and `MapSvg` consume that helper, removing the
  renderer-only total-label size helper and eliminating layout/render drift.
- Changed the total-line width floor to measure the scaled label, a minimum
  16-unit gap, and the actual formatted after-tax amount at the effective total
  size, plus the existing 40 units of panel padding.
- Audited the income header and row floors against the renderer’s effective
  role-scaled sizes, including the fixed header letter spacing and the
  qualifier’s 7-unit gap.
- Preserved the Session 22 rule that the content floor wins over a smaller
  user-set income width.
- Added regression coverage for default and 30-point totals, a six-digit total,
  scaled header/row/qualifier parity, exact shared-helper outputs, renderer
  parity, floor growth, and the too-small width override.

## File-by-file LOC

| File | LOC | Session 37B work |
| --- | ---: | --- |
| `src/layout/layout.ts` | 2,049 | Added the shared effective-size helper and used it in every income width-floor measurement. |
| `src/render/MapSvg.tsx` | 2,644 | Consumed the shared helper for all rendered income font sizes. |
| `tests/layout.test.ts` | 1,367 | Added floor, effective-size, six-digit value, header/row parity, and override-precedence pins. |
| `tests/mapedit.test.ts` | 818 | Pinned rendered total label/value sizes to the shared helper. |
| `docs/codex/SESSION-37B-REPORT.md` | 151 | This report. |

The four implementation/test files were already above roughly 400 LOC before
this session. They were not split because Session 37B permits no new source or
test files.

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
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BHngfIqB.css                             26.66 kB │ gzip:  5.83 kB
dist/assets/index-rnFlYseg.js                             316.90 kB │ gzip: 98.95 kB
✓ built in 870ms
```

### `npm test`

Exit code: 0

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (24 tests) 4ms
 ✓ tests/textfit.test.ts (5 tests) 10ms
 ✓ tests/math.test.ts (16 tests) 21ms
 ✓ tests/format.test.ts (33 tests) 33ms
 ✓ tests/pdf.test.ts (2 tests) 5ms
 ✓ tests/vocab.test.ts (7 tests) 12ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/undo.test.ts (6 tests) 8ms
 ✓ tests/export.test.ts (5 tests) 7ms
 ✓ tests/wizard.test.ts (6 tests) 8ms
 ✓ tests/book.test.ts (78 tests) 40ms
 ✓ tests/form.test.ts (12 tests) 31ms
 ✓ tests/overrides.test.ts (22 tests) 112ms
 ✓ tests/layout.test.ts (64 tests) 170ms
 ✓ tests/mapedit.test.ts (65 tests) 168ms

 Test Files  15 passed (15)
      Tests  348 passed (348)
   Start at  19:42:41
   Duration  1.47s (transform 3.18s, setup 0ms, collect 5.98s, tests 633ms, environment 3ms, prepare 2.55s)
```

The focused preflight also passed: 129 tests across `layout.test.ts` and
`mapedit.test.ts`.

## Browser and screenshot verification

The final pass used the production build, a fresh Chrome profile, a 1600×1000
viewport, and print emulation. The owner scenario used Whitfield and five
physical A+ clicks to step the total role from 17 to 22, the first clean size
that visibly widens the panel in the default composition.

Recorded assertions:

- Total amount size: 17 → 22.
- Total label size: 13 → 16.823529411764703.
- Income panel width: 280 → 301.20320000000004.
- Final screen gap between label and amount: 55.66175842285156 units.
- Final print gap: 55.65509033203125 units.
- Screen and print collision flags: `false`.
- Print editor chrome count: 0.

Final screenshots were visually inspected:

| Scenario | Screenshot | SHA-256 |
| --- | --- | --- |
| Whitfield total stepped up; both texts larger, widened panel, no collision | `C:\tmp\s37b-evidence-final\01-whitfield-total-stepped-to-22.png` | `8b0aa5635bb0f00fce83e3ea45636d2c7c61de7a8f032139411dca6d436a8865` |
| Print emulation, clean map and no editor chrome | `C:\tmp\s37b-evidence-final\02-print-emulation-clean.png` | `4db302e1f4a87b39238f73d60d6ae2652471fdbe0d9127aa55821048b04f36b6` |

Machine-readable evidence:
`C:\tmp\s37b-evidence-final\browser-evidence.json`.

All final browser-process streams were redirected under `C:\tmp`:

- `C:\tmp\s37b-final-preview.stdout.log` — 40 bytes
- `C:\tmp\s37b-final-preview.stderr.log` — 0 bytes
- `C:\tmp\s37b-final-chrome.stdout.log` — 0 bytes
- `C:\tmp\s37b-final-chrome.stderr.log` — 100 bytes
- `C:\tmp\s37b-final-driver.stdout.log` — 0 bytes
- `C:\tmp\s37b-final-driver.stderr.log` — 0 bytes
- Driver: `C:\tmp\s37b-browser-verification.mjs`

The preview and Chrome processes were stopped after verification.

## Deviations and notes

- The implementation/test diff is 132 insertions and 43 deletions: 175 changed
  lines, 15 above the approximate 60–160 budget. The additional lines are the
  mandated default/30-point/six-digit, header/row, helper-parity, and override
  regression pins; no unrelated behavior was added.
- The four touched implementation/test files exactly match the Session 37B
  file map. This required report is the only additional repository file.
- At the mandated 30-point test size, the income floor correctly expands to
  390.368 units and prevents the total texts from colliding. In Whitfield’s
  default composition, that width reaches into the next fixed account column.
  Reflowing columns is outside Session 37B and was noticed but not implemented;
  the final visual proof therefore uses 22 points while automated tests retain
  the required 30-point and six-digit stress cases.
- No dependencies were added. No push was performed and no remote was added or
  changed.
