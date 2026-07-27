# SESSION-6 Report

## Built

- Added guided mode as the default editor, with five category steps, progress
  dots, always-enabled Back/Next/Finish controls, and the requested completion
  panel actions.
- Kept the full editor one segmented-toggle click away and persisted the
  selected mode in the separate global
  `localStorage['money-map-form-mode:v1']` key.
- Exported and reused the full form's Client, Income, Need, Accounts, and
  Footnotes section components. Full mode retains its prior field structure
  and behavior.
- Routed guided map clicks to the relevant step. Account drums also open,
  scroll to, and focus the matching account card.
- Reset guided progress when selecting, creating, duplicating, deleting, or
  loading into another client.
- Preserved blank money values as `null` and made money fields propagate parsed
  values on every keystroke in both modes. Enter-to-next-field behavior is
  shared by both forms.

## Files

Current file LOC (blank lines excluded by `Measure-Object -Line`):

| File | LOC | SESSION-6 change |
| --- | ---: | ---: |
| `src/form/Wizard.tsx` | 192 | new |
| `src/form/Form.tsx` | 823 | +136 / -91 |
| `src/App.tsx` | 269 | +98 / -15 |
| `src/styles/app.css` | 595 | +174 / -0 |
| `tests/wizard.test.ts` | 24 | new |
| `docs/codex/SESSION-6-REPORT.md` | 107 | new |

Implementation changes total 739 changed lines (+633 / -106), or net +527 LOC,
within the approximately 400–600 net-line budget. `Form.tsx` and `app.css`
exceed approximately 400 LOC; they were not split because the SESSION-6 file
map explicitly assigns the shared sections and wizard chrome to those existing
files.

## Browser verification

Method: built the production bundle, served `dist` on localhost with Python's
static HTTP server, and drove a fresh-profile headless Microsoft Edge at
1600×1000 through the Chrome DevTools Protocol. DOM assertions were paired
with screenshots and manual screenshot inspection.

- A fresh profile booted into `guided` mode at **Step 1 of 5**, titled
  **Who is this map for?**
- Next visited the five requested titles in order; Finish showed
  **The map is ready.** with Print, Export PNG, Fine-tune in full form, and
  Start over.
- Incremental Title values `L`, `Li`, and `Live` each appeared in the map
  before leaving the field, confirming live per-keystroke updates.
- Clicking the **Short-Term Funds** drum jumped from step 1 to step 4, opened
  exactly one matching account card, and focused its label. The browser also
  confirmed **Tap to add:** and the preset row appeared above the first card.
- The toggle rendered the unchanged full form sections (Client, Income,
  Accounts, Footnotes), switched back to Guide me, and persisted `full` through
  a page reload.
- Selecting another client after advancing reset the guide to **Step 1 of 5**.
- Under emulated print media, `.workspace` computed to `display: none`, the
  wizard had no visible boxes, the isolated print map was visible, and it
  contained zero controls and no wizard text. Screenshot:
  `C:\tmp\session6-print.png`.
- PNG export completed without alerts as
  `The Calloway Family — Money Map 2026.png` (600,698 bytes). Its source was the
  isolated print SVG and contained no wizard text.
- Guided screen screenshot inspected:
  `C:\tmp\session6-guided.png`.

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
dist/index.html                                            0.41 kB │ gzip:  0.27 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2  26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2  28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2     52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2     53.73 kB
dist/assets/index-CBCfv01C.css                             9.35 kB │ gzip:  2.65 kB
dist/assets/index-Bs8WRjPC.js                            234.42 kB │ gzip: 73.30 kB
✓ built in 1.07s
```

`npm.cmd test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (13 tests) 27ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/book.test.ts (12 tests) 12ms
 ✓ tests/layout.test.ts (16 tests) 17ms
 ✓ tests/wizard.test.ts (4 tests) 5ms

 Test Files  5 passed (5)
      Tests  48 passed (48)
   Start at  21:39:53
   Duration  915ms (transform 352ms, setup 0ms, collect 976ms, tests 65ms,
   environment 2ms, prepare 1.27s)
```

## Commits

- `30bdea5` — Refactor shared form sections for guided reuse.
- `d998768` — Add guided mode, routing, chrome, and step tests.
- Final report commit follows this file.

## Deviations and observations

- Deviations: none.
- No runtime or development dependencies were added.
- The temporary browser driver
  `C:\tmp\money-map-session6-browser-check.mjs` was created outside the
  repository solely for acceptance verification; it is not product code.
- No out-of-scope v2 work was identified or added.
