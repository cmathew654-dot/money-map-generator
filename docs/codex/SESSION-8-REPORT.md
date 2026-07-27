# SESSION-8 Report

## Built

- Added a palette contrast contract covering every bucket tag against both of
  its surfaces, plus muted text, flow green, and need red against their
  required surfaces. Separate `tagColor` tokens preserve the existing
  after-tax and tax-preferred cylinder strokes while deepening only their tag
  foregrounds. The contract also exposed the existing need red at 4.44:1, so
  it was minimally deepened to `#c03a2d` (4.63:1).
- Replaced all `window.confirm` and `window.alert` usage with a paper-styled
  native dialog. Delete includes the exact irreversible-action copy and a
  red-text confirmation; load/export errors use a single OK action.
- Added an App-owned toast queue with 3.5-second dismissal for `Book saved`,
  `PNG exported`, and `Book loaded`.
- Added the ink drum/green-flow mark as both an inline header glyph and a
  standalone SVG favicon, then linked the favicon from `index.html`.
- Added a verified 2px FLOW_GREEN `:focus-visible` outline with 3px offset to
  interactive map groups.
- Reorganized the header into identity/client, book, and payoff zones. Print
  and Export PNG use the shared primary treatment, and the wizard Next button
  now reuses that same class.

## Files

Current file LOC (blank lines excluded by `Measure-Object -Line`):

| File | LOC | SESSION-8 change |
| --- | ---: | ---: |
| `index.html` | 13 | +1 / -0 |
| `public/favicon.svg` | 6 | new |
| `src/App.tsx` | 371 | +152 / -46 |
| `src/form/Wizard.tsx` | 192 | +1 / -1 |
| `src/render/MapSvg.tsx` | 837 | +2 / -2 |
| `src/render/tokens.ts` | 48 | +9 / -8 |
| `src/styles/app.css` | 708 | +131 / -11 |
| `src/ui/Dialog.tsx` | 56 | new |
| `src/ui/Mark.tsx` | 34 | new |
| `src/ui/Toast.tsx` | 30 | new |
| `tests/contrast.test.ts` | 54 | new |
| `docs/codex/SESSION-8-REPORT.md` | 120 | new |

Implementation and test changes total 559 changed lines (+491 / -68), before
this required report. This is above the approximate 480-line budget; the work
remained limited to the requested contracts and chrome components. Existing
`MapSvg.tsx` and `app.css` remain above approximately 400 LOC. They were not
split because this session explicitly limits map rendering changes and locates
the new chrome styles in `app.css`.

## Browser verification

Method: built the production bundle, served `dist` on localhost with Python's
static HTTP server, and drove a fresh-profile headless Google Chrome at
1440x1000 through the Chrome DevTools Protocol. DOM/computed-style assertions
were paired with a full-page screenshot and manual screenshot inspection.

- The header rendered one wordmark glyph and three clear action clusters:
  client actions, quiet Save/Load actions, and ink-filled Print/Export actions
  after a hairline divider. Computed colors were ink `rgb(28, 36, 34)` on paper
  `rgb(252, 252, 250)` for both primary buttons.
- The favicon link resolved in Chrome with HTTP 200 to the standalone drum SVG;
  its ellipse-capped cylinder and FLOW_GREEN arc were present. The matching
  small mark was crisp in the 1440px browser screenshot.
- Clicking Delete opened a modal native dialog on paper with a Literata title,
  Cancel/Delete actions, and the exact message
  `Delete Jordan & Dana Whitfield? This cannot be undone.` The confirmation
  computed to the requested red foreground.
- Save, Export PNG, and a valid programmatic file load raised `Book saved`,
  `PNG exported`, and `Book loaded` toasts. An invalid JSON file raised
  `Could not load book` with the parser message and one OK button.
- Keyboard Tab reached map targets in this document order: Income sources,
  Monthly income need, Short-Term Funds, Cash at Bank, Managed After-Tax Trust,
  Managed IRA — Jordan, Roth IRA — Dana, Donor-Advised Fund. The active SVG
  group computed to a solid `rgb(30, 122, 74)` outline, 2px wide with 3px
  offset.
- Temporary Chrome profiles, browser script, screenshot, and local server were
  removed after verification.

## Gates

`npm.cmd run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 47 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-ZJF0T6xC.css                           11.01 kB │ gzip:  3.01 kB
dist/assets/index-C91BYfIH.js                           237.93 kB │ gzip: 74.41 kB
✓ built in 1.53s
```

`npm.cmd test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 13ms
 ✓ tests/format.test.ts (21 tests) 36ms
 ✓ tests/export.test.ts (3 tests) 6ms
 ✓ tests/wizard.test.ts (4 tests) 7ms
 ✓ tests/layout.test.ts (16 tests) 30ms
 ✓ tests/book.test.ts (13 tests) 30ms

 Test Files  6 passed (6)
      Tests  67 passed (67)
   Start at  22:24:00
   Duration  1.30s (transform 712ms, setup 0ms, collect 1.71s, tests 121ms,
   environment 3ms, prepare 2.23s)
```

The first bare `npm` test attempt was blocked by the machine's PowerShell
script policy. The first sandboxed `npm.cmd run build` reached Vite but could
not read the config through the restricted filesystem view. Running the same
build gate with the approved build permission produced the green output above.

## Commits

- `f9c2ef7` — Enforce accessible map palette contrast.
- `263cd05` — Strengthen app chrome and feedback.
- Final report commit follows this file.

## Deviations and observations

- The prompt calls the dialog confirmation the only red-text button while also
  requiring the header Delete button to be red-text. Both requested
  destructive actions use red text; no other app buttons do.
- The approximate change budget was exceeded as noted in Files.
- No dependencies were added. `src/layout/layout.ts` was not touched, and the
  only artifact-rendering changes were the two tag foreground references.
- No out-of-scope v2 work was identified or added.
