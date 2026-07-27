# SESSION-7 Report

## Built

- Unified blank account identity through one pure display-name helper. Blank
  labels now use the account bucket name plus `· unnamed`; summaries render
  that fallback muted and italic, and map interaction labels use the same
  identity. The `Untitled account` string is gone.
- Made `blankClient()` truly blank: no accounts, no income sources, and all
  money fields remain `null`. Both shared form modes now show the requested
  quiet empty-state lines while preserving the add-income affordance and
  account preset chips.
- Replaced form-facing variant/post-note jargon with `MAP TYPE`,
  `Mid-year update`, and `AS OF`, including the `April 2026` placeholder.
  Update mastheads now render `MONEY MAP — <AS-OF> UPDATE`, or
  `MONEY MAP — UPDATE` when as-of is blank. Annual rendering and the Calloway
  sample data are unchanged.
- Added the exact monthly-need and short-term-draw labels/help text to the
  shared Need section, so full form and wizard carry identical copy.
- Added coverage for all bucket display names, blank account identity,
  truly blank client data, and the zero-account layout contract.

## Files

Current file LOC (blank lines excluded by `Measure-Object -Line`):

| File | LOC | SESSION-7 change |
| --- | ---: | ---: |
| `src/form/Form.tsx` | 851 | +42 / -14 |
| `src/model/format.ts` | 66 | +24 / -0 |
| `src/model/samples.ts` | 254 | +2 / -24 |
| `src/render/MapSvg.tsx` | 837 | +11 / -3 |
| `src/styles/app.css` | 606 | +13 / -0 |
| `tests/book.test.ts` | 126 | +18 / -1 |
| `tests/format.test.ts` | 79 | +25 / -0 |
| `tests/layout.test.ts` | 291 | +15 / -1 |
| `docs/codex/SESSION-7-REPORT.md` | 111 | new |

Implementation and test changes total 193 changed lines (+150 / -43), before
this required report. `Form.tsx`, `MapSvg.tsx`, and `app.css` remain above
approximately 400 LOC; they were not split because SESSION-7 calls for small,
shared edits to those existing files rather than an architecture change.

## Browser verification

Method: built the production bundle, served `dist` on localhost with Python's
static HTTP server, and drove a fresh-profile headless Microsoft Edge at
1600×1000 through the Chrome DevTools Protocol. DOM assertions were paired
with screenshots and manual screenshot inspection.

- Clicking **New** selected **New Client** and produced a stable map with zero
  account elements, exactly one money-flow path (income→need), one income
  panel, one need card, the footnotes group, and blank-money markers. No
  browser runtime exceptions occurred. Screenshot:
  `C:\tmp\session7-blank.png`.
- Guided Income showed **No income sources yet.** above the retained
  **+ Add income source** button. Guided Accounts showed
  **No accounts yet — tap a type above to add one.**, with the preset row
  directly above it.
- Full form showed both empty-state lines, also with the account preset row
  directly above its empty line.
- Adding the **Short-Term** chip created one open account. Typing
  **Bridge Cash** made the summary read **Bridge Cash**. Clearing the label
  made it read **Short-Term Bucket · unnamed**; computed styles confirmed the
  fallback was muted and italic, and the map interaction label matched it.
- Selecting **Mid-year update** and entering **April 2026** in **AS OF**
  produced the exact masthead **MONEY MAP — APRIL 2026 UPDATE**. Screenshot:
  `C:\tmp\session7-update.png`.

## Gates

`npm.cmd run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 44 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.41 kB │ gzip:  0.27 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-C2N_DxiS.css                            9.51 kB │ gzip:  2.69 kB
dist/assets/index-1rU_9aVS.js                           234.94 kB │ gzip: 73.54 kB
✓ built in 1.09s
```

`npm.cmd test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (21 tests) 26ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/wizard.test.ts (4 tests) 5ms
 ✓ tests/book.test.ts (13 tests) 13ms
 ✓ tests/layout.test.ts (16 tests) 17ms

 Test Files  5 passed (5)
      Tests  57 passed (57)
   Start at  22:06:04
   Duration  934ms (transform 426ms, setup 0ms, collect 1.07s, tests 65ms,
   environment 2ms, prepare 1.30s)
```

The first `npm run build` invocation was blocked before npm started by the
machine's PowerShell script policy. A sandboxed `npm.cmd run build` then could
not read Vite's config outside the restricted filesystem view. Running the
same `npm.cmd` gate with the approved build permission produced the green
output above.

## Commits

- `653625f` — Refine blank client money map flow.
- Final report commit follows this file.

## Deviations and observations

- Deviations: none.
- No runtime or development dependencies were added.
- No data-model field names changed; `variant` and `postNoteLabel` remain
  intact.
- The temporary browser driver
  `C:\tmp\money-map-session7-browser-check.mjs` was created outside the
  repository solely for acceptance verification; it is not product code.
- No out-of-scope v2 work was identified or added.
