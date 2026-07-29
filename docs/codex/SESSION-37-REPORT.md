# SESSION-37 REPORT — Seamless in-place editing + after-tax line

## What was built

- Scaled the `After-Tax Income` label from the active income-total font size
  using the existing `13 / 17` label-to-value ratio. The label and amount now
  grow together, and A+ remains enabled until the true 40-point clamp.
- Routed full-line edit hit areas through the actual edited glyph geometry.
  Income headings, rows, totals, need label/value, account rows/sub-accounts,
  as-needed draw, fine print, masthead, notes, and nested account text no
  longer swallow clicks on words, values, qualifiers, or gaps.
- Replaced the bordered editor overlay with transparent, type-matched controls.
  The editor inherits each target's font family, scaled size, weight, color,
  alignment, letter spacing, and capitalization. Money opens formatted exactly
  as displayed, and wrapped titles use a transparent multiline control.
- Hid only the active SVG text while its input is open, preventing double
  images while preserving all non-edited labels and print/export text.
- Moved A−/A+ into a separate 72×30 paper pill with a hairline border, rounded
  ends, and subtle shadow. The pure placement helper centers it above the edit
  target and flips it below when the target is within 48 screen pixels of the
  map top.
- Preserved Enter, Escape (including note Escape-commit), blur, live font-size
  preview, one-step commit behavior, and pointer-down focus retention.
- Added consistent text cursors plus subtle underline/halo hover feedback.
- Added regression tests for total-label ratio, the 9/40 clamp, every
  editable-line text node's click/click-through contract, pill placement,
  target typography, and formatted money continuity.

## File-by-file LOC

| File | LOC | Session 37 work |
| --- | ---: | --- |
| `src/App.tsx` | 1,353 | Passed the rendered target color into editor state; no other wiring changed. |
| `src/render/MapSvg.tsx` | 2,649 | Added proportional total-label sizing, complete-line hit routing, target geometry/color capture, and hover/hidden-text markers. |
| `src/ui/MapTextEditor.tsx` | 742 | Added pure typography/placement helpers, zoom-scaled transparent controls, formatted money, multiline continuity, hidden-target lifecycle, and detached pill placement. |
| `src/styles/app.css` | 1,817 | Replaced box overlay styling with seamless input/textarea styling and added the floating pill and line-hover treatment. |
| `tests/mapedit.test.ts` | 814 | Added 19 Session 37 regression cases (65 map-edit tests total). |
| `docs/codex/SESSION-37-REPORT.md` | 171 | This report. |

The implementation files above already exceeded roughly 400 LOC before this
session except `MapTextEditor.tsx`; that file is now also above the guideline.
It was not split because the Session 37 file map permits no new source file.

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
dist/assets/index-DIvpQ6V-.js                             316.76 kB │ gzip: 98.90 kB
✓ built in 771ms
```

### `npm test`

Exit code: 0

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/textfit.test.ts (5 tests) 10ms
 ✓ tests/contrast.test.ts (24 tests) 5ms
 ✓ tests/format.test.ts (33 tests) 17ms
 ✓ tests/math.test.ts (16 tests) 16ms
 ✓ tests/vocab.test.ts (7 tests) 17ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/undo.test.ts (6 tests) 8ms
 ✓ tests/pdf.test.ts (2 tests) 6ms
 ✓ tests/export.test.ts (5 tests) 8ms
 ✓ tests/book.test.ts (78 tests) 49ms
 ✓ tests/wizard.test.ts (6 tests) 5ms
 ✓ tests/overrides.test.ts (22 tests) 97ms
 ✓ tests/form.test.ts (12 tests) 21ms
 ✓ tests/layout.test.ts (63 tests) 173ms
 ✓ tests/mapedit.test.ts (65 tests) 157ms

 Test Files  15 passed (15)
      Tests  347 passed (347)
   Start at  19:07:04
   Duration  1.33s (transform 2.40s, setup 0ms, collect 5.56s, tests 593ms, environment 3ms, prepare 2.24s)
```

## Browser and screenshot verification

The final pass used the committed production build, a fresh isolated Chrome
profile, 1600×1000 and 900×1000 viewports, and print emulation. The preview,
Chrome, and driver processes were stopped afterward. Every process stream was
redirected under `C:\tmp`:

- `C:\tmp\s37-chrome.stdout.log` — 0 bytes
- `C:\tmp\s37-chrome.stderr.log` — 243 bytes
- `C:\tmp\s37-preview.stdout.log` — 293 bytes
- `C:\tmp\s37-preview.stderr.log` — 0 bytes
- `C:\tmp\s37-driver.stdout.log` — 0 bytes
- `C:\tmp\s37-driver.stderr.log` — 0 bytes
- Driver: `C:\tmp\s37-browser-verification.mjs`
- Machine-readable audit: `C:\tmp\s37-evidence\browser-evidence.json`

Final screenshots were visually inspected:

| Scenario | Screenshot | SHA-256 |
| --- | --- | --- |
| Direct click on `After-Tax Income`, then A+ twice | `C:\tmp\s37-evidence\01-after-tax-words-clicked-a-plus-twice.png` | `c19b54270a73c08ab35b27998fa7ff8da8911044cd362c6719e70557efbf6ab9` |
| Account title before editing | `C:\tmp\s37-evidence\02-account-title-before.png` | `1919bc7e3d0133b1ee9d1b74f44918a9087f6ea63da74f7c1999b55409b82223` |
| Same account title during editing, no box, pill above | `C:\tmp\s37-evidence\03-account-title-during-no-box-pill-above.png` | `ad814290d666e3abdfeef420d5223dded72fda7cf29027fdd903a18c217cda2c` |
| Target 46px from map top, pill flipped below | `C:\tmp\s37-evidence\04-top-edge-target-pill-flipped-below.png` | `9cb6b03f3cb5a0fd05d4c12fea6708da8000f2caa6b716bd120e7dfcf0448cbc` |
| Editable-line hover underline and text cursor | `C:\tmp\s37-evidence\05-editable-line-hover-underline-text-cursor.png` | `c08e0832a86c18c34c1917590b61df834a6810259a9c7c1cdcb86f126edcf3a2` |
| Print emulation, zero chrome and no hidden-text artifact | `C:\tmp\s37-evidence\06-print-emulation-zero-chrome-no-hidden-text.png` | `ba1820156e9784eb3a0baaa9d568b819d32d0515fc5f6a3bf781ccb9d4b5ed35` |

Recorded assertions:

- The physical click point on the words `After-Tax Income` resolved to the
  `afterTaxIncome` full-line hit area and opened the correct input.
- Two physical A+ clicks kept the input focused. Total size changed 17→19,
  label size changed 13→14.52941176470588, label width changed
  89.639→99.484px, amount width changed 47.669→53.234px, and A+ remained
  enabled because the size was below 40.
- Account title input matched the SVG at 16.2939 screen pixels, Literata,
  weight 600, `rgb(28, 36, 34)`, and centered alignment. The SVG title was
  hidden while editing; editor/input backgrounds were transparent, top
  borders were 0px, and the only line was the 1px input underline.
- At 900px viewport width, the top note target was 46px from the map top.
  The pill used `is-below`, sat fully below the edit control, and did not
  overlap it.
- Hover resolved to `cursor: text` and `text-decoration-line: underline`.
- The print map had zero editor/hit-area nodes, zero editable classes, zero
  hidden edited text, and 44 visible text nodes.

## Commits

- `715ffc2` — Make map text editing seamless
- `b94d071` — Pin seamless map editor behavior

No push was performed and no remote was added or changed.

## Deviations and notes

- The five implementation/test files match the Session 37 file map. This
  required report is the only additional file.
- The implementation/test diff is 704 insertions and 108 deletions, above the
  approximate 300–450 changed-line budget. The overage is stated plainly:
  the complete text-node click audit required explicit SVG props across every
  composite line, and the mandated target-by-target typography and render-tree
  tests account for 140 insertions. No unrelated feature work was added.
- The first browser pass found that nested account-title tspans did not
  reliably retarget a parent SVG text handler. Those tspans now carry the same
  edit handler.
- Visual inspection then found unformatted money and a clipped one-line editor
  for a wrapped title. Money now opens formatted and wrapped targets use a
  transparent multiline control. The complete browser pass was rerun from a
  fresh profile after both fixes and again after the final committed build.
- No additional observations were implemented outside Session 37 scope.
