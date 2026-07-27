# SESSION-9 Report

## Built

- Narrowed the fixed editor rail from 480px to 420px. The preview now receives
  all remaining workspace width without changing the application structure.
- Added a final pure layout pass that measures panels, accounts, arrow path
  coordinates, and the as-needed chip, then translates that complete
  composition uniformly within the 48-unit page margins and the correct
  footnoted/non-footnoted vertical region. The post-pass content bounds are
  retained for document furniture.
- Shifted the far account column from x=1020 to x=1012. Its former right edge
  was x=1280, so no uniform translation could keep both edges within the
  requested 48-unit margins. It now ends exactly at x=1272.
- Anchored footnotes at their fixed y=930 baseline under the centered content
  bounds. A centered 220-unit HAIRLINE rule sits exactly 18 units above the
  first line, and the complete group is omitted when there are no footnotes.
- Added a bottom-left, single-line SVG flow legend. It derives its entries from
  arrow kinds present in the layout and uses real 24-unit paths, the production
  dash patterns, FLOW_GREEN, small arrowheads, and 11px MUTED Public Sans.
  Because it is inside `MapSvg`, preview, print, and PNG export all include it.
- Made income flow solid 2px while retaining `0.1 9` round-dot waterfall beads
  and `7 6` as-needed dashes.
- Flattened cylinder caps and bodies to one bucket tint while preserving the
  ellipse silhouette and lower interior arc. Inset sub-account drums use the
  parent tint on both surfaces as well.
- Strengthened drum hierarchy with 24px/600 Literata values, 12.5px roman
  Public Sans captions, unchanged 16px titles, and slightly tighter 10.5px
  tags. Position-row coordinates were not changed.
- Replaced the tax-preferred light blue with teal: stroke `#2e8577`, tint
  `#eef7f5`, and tag `#23695e`. The tag/tint contrast is 5.92:1; the automated
  contract covers this exact bucket along with all other flat tints.
- Added deterministic centering tests for `blankClient()` and `SAMPLE_VENKAT`
  while retaining every existing clearance, cap, obstacle, compression, and
  artboard rule.

## Files

Current file LOC (`Measure-Object -Line`) and SESSION-9 changes:

| File | LOC | SESSION-9 change |
| --- | ---: | ---: |
| `src/layout/layout.ts` | 563 | +151 / -9 |
| `src/model/types.ts` | 76 | +2 / -2 |
| `src/render/MapSvg.tsx` | 940 | +127 / -20 |
| `src/render/tokens.ts` | 83 | +47 / -12 |
| `src/styles/app.css` | 708 | +3 / -3 |
| `tests/contrast.test.ts` | 51 | +1 / -4 |
| `tests/layout.test.ts` | 317 | +35 / -6 |
| `docs/codex/SESSION-9-REPORT.md` | 148 | new |

Implementation and test changes total 422 changed lines (+366 / -56), before
this required report, within the approximate 400–650-line budget.
`src/layout/layout.ts`, `src/render/MapSvg.tsx`, and `src/styles/app.css` are
above approximately 400 LOC. They were not split because Session 9 explicitly
places the final pass in `layout.ts`, artifact rendering in `MapSvg.tsx`, and
workspace styling in `app.css`.

## Browser verification

Method: built the production bundle, served `dist` on localhost, and drove a
fresh-profile headless Google Chrome at 1600×1000 with device scale factor 1
through the Chrome DevTools Protocol. DOM/computed-style assertions were paired
with full-viewport screenshots and manual inspection at default zoom.

- Workspace/editor: the form pane measured exactly 420px and the preview
  measured 1180px. The guided account step showed all six Whitfield account
  cards within the rail; the full form also had no horizontal overflow. Both
  modes remained comfortable, with fields and account values readable.
- Jordan & Dana Whitfield: the full three-entry legend was correct; income was
  solid, as-needed was `7 6`, and both refills were `0.1 9`. All six cylinders
  had identical body/cap fills, values visibly led the hierarchy, the teal Roth
  was distinct from the blue IRA, and the RMD footnote/rule was centered below
  the content.
- The Calloway Family: the denser seven-account composition remained clear.
  CVLI rendered in teal, the installment note and need card stayed clear of the
  as-needed chip, all three legend entries were present, and the RMD footnote
  was anchored without colliding with the legend.
- Sam & Priya Venkat: vertical whitespace was visibly balanced between the
  masthead and lower document zone. The map has no footnotes, so neither
  footnote text nor its hairline rendered. Its waterfall, income, and as-needed
  legend entries were all present.
- Built-in blank client: the income panel/need card mass moved from the old
  upper-left pooling to the horizontal and vertical center. Only the solid
  Income legend entry rendered; refill/as-needed entries and the footnote group
  were absent.
- Print media: emulated print CSS hid `.workspace`, displayed `.print-map`, and
  retained the Calloway footnote plus all three legend entries. Manual
  inspection showed the complete framed artifact, centered footnote rule, flat
  drums, and teal CVLI in the print output.
- Grayscale: a Whitfield capture with `grayscale(1)` showed tax-deferred blue
  visibly darker than tax-preferred teal. Their source relative luminances are
  0.1406 and 0.1869 respectively, so the distinction does not depend on hue
  alone.
- DOM verification found no runtime exceptions. Every rendered main drum had
  equal cap/body fills, all map captions computed roman, and the income paths
  had no dash attribute.

The current fresh book contains exactly four entries—three named samples plus
the built-in blank—as asserted by `tests/book.test.ts`. All four were captured.
There is no separate fifth sample to capture; none was invented because the
session forbids structural/out-of-scope additions.

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
dist/assets/index-Bn8fHnYO.css                           11.01 kB │ gzip:  3.00 kB
dist/assets/index-DkcW3TgE.js                           240.31 kB │ gzip: 75.21 kB
✓ built in 1.51s
```

`npm.cmd test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 7ms
 ✓ tests/format.test.ts (21 tests) 41ms
 ✓ tests/export.test.ts (3 tests) 5ms
 ✓ tests/wizard.test.ts (4 tests) 7ms
 ✓ tests/book.test.ts (13 tests) 19ms
 ✓ tests/layout.test.ts (18 tests) 32ms

 Test Files  6 passed (6)
      Tests  69 passed (69)
   Start at  22:48:16
   Duration  1.30s (transform 776ms, setup 0ms, collect 1.76s, tests 110ms,
   environment 2ms, prepare 2.08s)
```

The first bare `npm run build` invocation was blocked by the machine's
PowerShell script policy. The first sandboxed `npm.cmd run build` reached Vite
but could not read its config through the restricted filesystem view. The
final approved `npm.cmd` build and ordinary `npm.cmd` test above are the
required green gates run after all implementation changes.

## Commits

- `a626e5b` — Center the Money Map composition.
- `51cd0d9` — Flatten and clarify the map artifact.
- Final report commit follows this file.

## Deviations and observations

- `App.tsx` required no edit because the existing structure already gives the
  second grid track all remaining width; the requested fixed 420px change is
  entirely owned by `app.css`.
- No dependencies or runtime architecture were added. No position-row
  coordinates changed, no rule assertion was weakened, and no v2 work was
  added.
- Temporary Chrome profiles, browser script, JSON diagnostics, and screenshots
  were kept outside the repository under `C:\tmp` and removed after
  verification.
- Nothing was pushed and no remote was added.
