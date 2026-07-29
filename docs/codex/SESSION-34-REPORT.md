# SESSION-34 Report — Map polish

## What was built

- Removed the flow legend from every render path. `text:legend:label`
  remains accepted and round-trippable for legacy-book compatibility, but
  it is deliberately inert and is no longer part of `MAP_TEXT_ELEMENTS` or
  the map editor target surface.
- Added standard `w`/`h` resizing to the income panel. Its width floors at
  measured row/header/total content, and its height floors at computed
  content height.
- Increased the default income row pitch from 40 to 44 units. Row pitch,
  header-to-first-row reach, row value offset, and panel content height now
  scale with `text:income:row` font size.
- Added per-account `rows` and `sub` font-size roles at 9–40. Position rows
  share one size; sub-account title/caption/value preserve their existing
  ratios from a `TYPE.subValue` base. Layout height grows with both roles.
- Made position rows and sub-account text size-only click targets using the
  existing A−/A+ preview-and-single-commit editor behavior.
- Added full-line invisible hit targets and hover affordances to income
  header/rows/total and map notes.
- Darkened `MUTED` from `#5b6663` to `#47504d`, with 4.5:1 contrast pins on
  paper and every bucket tint.
- Changed mid-year mastheads to `<LABEL> — <MONTH> <YEAR>`. Legacy
  `April 2026` and month-only `April` both render `APRIL 2026`; annual
  mastheads remain unchanged.
- Added empty-artboard drag-to-pan above Fit zoom, including Present mode,
  with pointer capture and grab/grabbing cursors. Element drag/resize/rotate
  behavior remains independent.
- Kept all interactive hit rectangles transparent in noninteractive
  Present/print/PNG renders; this regression was found during screenshot
  review and pinned with a test.

Position and sub-account value/label editing remains form-only in v1, as
specified. The new on-map targets are size-only.

## File-by-file LOC

| File | LOC |
| --- | ---: |
| `src/App.tsx` | 1322 |
| `src/layout/layout.ts` | 2026 |
| `src/model/book.ts` | 652 |
| `src/model/format.ts` | 106 |
| `src/model/types.ts` | 208 |
| `src/render/MapSvg.tsx` | 2428 |
| `src/render/mapInteraction.ts` | 336 |
| `src/render/tokens.ts` | 121 |
| `src/styles/app.css` | 1769 |
| `src/ui/MapTextEditor.tsx` | 536 |
| `tests/book.test.ts` | 800 |
| `tests/contrast.test.ts` | 74 |
| `tests/format.test.ts` | 157 |
| `tests/layout.test.ts` | 1300 |
| `tests/mapedit.test.ts` | 674 |
| `tests/overrides.test.ts` | 503 |
| `docs/codex/SESSION-34-REPORT.md` | 182 |

Existing source files over the ~400 LOC guideline remain
`App.tsx`, `layout.ts`, `book.ts`, `MapSvg.tsx`, `app.css`, and
`MapTextEditor.tsx`. They were not split because Session 34's file map and
scope required changes in place.

## Tests added or updated

- Book/override validation: income `w`/`h` round-trip; account `rows`/`sub`
  acceptance; unknown-role rejection; legacy `text:legend:label`
  acceptance.
- Layout: 44-unit default row pitch and proportional scaling; first-row
  reach scaling; income measured minimum width; content-height floor;
  position/sub-account font metrics and drum growth.
- Map editing/rendering: `rows`/`sub` stepper metadata and 9/40 bounds;
  size-only semantics; proportional sub-account type; legend render target
  absence; income resize chrome; full hit targets; transparent
  noninteractive hit rectangles.
- Masthead: legacy year-bearing label, month-only label, and annual table.
- Contrast: `MUTED` ≥ 4.5:1 on paper and every bucket tint.
- Panning: grab-style scroll-delta math, alongside the existing account
  drag threshold pins.

## Required gates

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 55 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.49 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BIi1w5hh.css                             25.85 kB │ gzip:  5.72 kB
dist/assets/index-C6AhyACG.js                             309.24 kB │ gzip: 96.83 kB
✓ built in 786ms
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/mm-wt-s34

 ✓ tests/textfit.test.ts (5 tests) 6ms
 ✓ tests/contrast.test.ts (24 tests) 5ms
 ✓ tests/format.test.ts (33 tests) 17ms
 ✓ tests/math.test.ts (16 tests) 17ms
 ✓ tests/vocab.test.ts (7 tests) 12ms
 ✓ tests/undo.test.ts (6 tests) 4ms
 ✓ tests/filestore.test.ts (3 tests) 3ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/wizard.test.ts (6 tests) 7ms
 ✓ tests/form.test.ts (12 tests) 29ms
 ✓ tests/overrides.test.ts (22 tests) 78ms
 ✓ tests/book.test.ts (78 tests) 48ms
 ✓ tests/layout.test.ts (63 tests) 167ms
 ✓ tests/mapedit.test.ts (46 tests) 133ms

 Test Files  14 passed (14)
      Tests  324 passed (324)
   Start at  17:14:51
   Duration  1.66s (transform 1.67s, setup 0ms, collect 4.63s, tests 530ms, environment 2ms, prepare 3.16s)
```

## Browser verification

Preview ran on required port `4341`. All preview, Chrome, script, evidence,
and screenshot output was redirected under `C:\tmp`.

- `C:\tmp\s34-01-screen-legend-absent.png`
- `C:\tmp\s34-02-income-resized-leading.png`
- `C:\tmp\s34-03-positions-subaccount-sized.png`
- `C:\tmp\s34-04-midyear-masthead-present.png`
- `C:\tmp\s34-05-pan-at-150-after.png`
- `C:\tmp\s34-05-account-drag-still-works.png`
- `C:\tmp\s34-06-muted-gold.png`
- `C:\tmp\s34-06-muted-blue.png`
- `C:\tmp\s34-07-print-persisted-zero-chrome.png`
- Machine-readable audit: `C:\tmp\s34-browser-evidence.json`

Recorded browser assertions:

- Screen: 0 flow-legend nodes, 0 `data-legend-kind` nodes,
  `MONEY MAP — APRIL 2026`, and 12 uses of the darker muted fill.
- Print: 0 flow-legend nodes, 0 `data-legend-kind` nodes, 0 editor-chrome
  nodes, and `MONEY MAP — APRIL 2026`.
- 150% empty-artboard pan: scroll position changed from `(1224, 815)` to
  `(1314, 885)`.
- Account drag at 150% still committed independently:
  `managed-ira-jordan` stored `{ "dx": 30, "dy": 20 }`.
- Visual review confirmed the resized income panel, increased row leading,
  stepped position/sub-account type with drum growth, darker muted type in
  gold/blue tints, and persisted zero-chrome print output.

## Commits

- `46c8efb` — Add resizable income and nested text sizing
- `7c74184` — Polish map readability and zoom panning
- `039e721` — Keep noninteractive edit hit areas transparent

## Deviations and notes

- No files from the Session 34 MUST NOT TOUCH list were modified. The
  `app.css` changes are limited to the existing Present region and the
  appended `/* S34 */` block.
- No dependencies or files outside the Session 34 file map were added.
- The validation compatibility exception is intentional: legacy
  `text:legend:label` keys remain valid but inert.
- The implementation diff is 650 insertions and 179 deletions. Total diff
  lines are above the approximate 500–700 budget because the removed legend
  render/editor path and the income-row render restructuring count both
  additions and deletions.
- No additional out-of-scope work was performed.
