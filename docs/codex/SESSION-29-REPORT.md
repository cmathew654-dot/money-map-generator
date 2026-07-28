# SESSION-29 Report — Map typography everywhere + present zoom

## What was built

- Added the fixed-element text registry for income, need, fine print, and
  legend roles, with `text:<element>:<role>` keys and a 9–40 fixed-element
  clamp. The existing 9–28 account text clamp remains unchanged.
- Extended book validation to accept registered fixed-element text keys while
  continuing to reject unknown roles and `fs` on non-text keys. Fixed-element
  `dx` and `dy` values round-trip but are ignored by rendering, as specified.
  Client duplication preserves fixed-element keys while still remapping
  account text keys.
- Added fixed-element rendering overrides in `MapSvg.tsx`:
  - income heading, rows, and after-tax total;
  - monthly-need label and value;
  - shared fine-print size with proportional line spacing;
  - measured legend spacing using `textWidth`.
- Income row labels and qualifiers scale at 13/14 and 12/14 of the row value
  size. Row pitch and panel geometry remain fixed.
- Added map edit targets for the income heading, after-tax income, need label,
  fine print, and legend. The four label-only targets show size controls
  without a text field and close on Enter, Escape, or blur.
- Generalized font-size metadata and stepping across account and fixed map
  text. Income amounts, after-tax income, and monthly need combine value
  editing with their applicable size controls.
- Rewired live preview and commit handling through the shared font-size
  metadata path, so fixed-element changes preview immediately and commit once
  through the existing undoable client history.
- Added the existing zoom cluster to read-only Present mode without exposing
  Note or Shape controls. Entering Present resets to Fit, present scrolling is
  enabled for zoomed maps, inline zoom width wins over the fit rule, and
  Ctrl/Cmd+wheel remains cursor anchored.
- Changed the Clear map confirmation copy from “footnotes” to “fine print.”

## Local commits

1. `49f55e1 add fixed map text override registry`
2. `6b28f70 add fixed map typography editing and present zoom`

No push was performed.

## File-by-file LOC

| File | LOC |
| --- | ---: |
| `src/model/types.ts` | 187 |
| `src/model/book.ts` | 636 |
| `src/render/MapSvg.tsx` | 2,204 |
| `src/ui/MapTextEditor.tsx` | 463 |
| `src/App.tsx` | 1,252 |
| `src/styles/app.css` | 1,610 |
| `tests/book.test.ts` | 650 |
| `tests/overrides.test.ts` | 477 |
| `tests/mapedit.test.ts` | 409 |
| `docs/codex/SESSION-29-REPORT.md` | 190 |

The touched files over approximately 400 LOC are `src/model/book.ts`,
`src/render/MapSvg.tsx`, `src/ui/MapTextEditor.tsx`, `src/App.tsx`,
`src/styles/app.css`, `tests/book.test.ts`, `tests/overrides.test.ts`, and
`tests/mapedit.test.ts`. They were not split because the Session 29 file map
and the repository's explicit architecture rules take precedence.

## Tests added and updated

- `book.test.ts`: accepts `text:legend:label`, `text:income:row`, and
  `text:need:value`; rejects `text:income:bogus` and
  `text:footnotes:label`; retains the non-text `fs` rejection; and preserves
  fixed-element text overrides during duplication.
- `overrides.test.ts`: round-trips finite fixed-element `fs`, `dx`, and `dy`
  values alongside account text overrides.
- `mapedit.test.ts`: pins the account/need/legend font-size metadata table;
  the shared 9 floor and per-target maximum; size-only raw/no-op behavior;
  after-tax income parsing; proportional income rendering; the 40-point need
  value; scaled 18-point fine-print spacing; and measured 16-point legend
  placement.

## Screenshot verification

Headless Chrome was launched with both browser streams redirected before
launch:

- stdout: `C:\tmp\s29-chrome.stdout.log` (0 bytes)
- stderr: `C:\tmp\s29-chrome.stderr.log` (244 bytes)

The production preview ran specifically at `http://127.0.0.1:4291/`.
Its stdout and stderr were redirected to
`C:\tmp\s29-preview.stdout.log` (39 bytes) and
`C:\tmp\s29-preview.stderr.log` (0 bytes). The browser assertion process
wrote its machine-readable results to `C:\tmp\s29-check.stdout.log`; its
stderr file was empty.

1. `C:\tmp\s29-session-29-evidence\01-income-rows-20.png`
   - The row value reached 20.
   - Measured label/value/qualifier sizes were
     18.571428571428573 / 20 / 17.142857142857142.
   - All three income rows used the shared override.
2. `C:\tmp\s29-session-29-evidence\02-need-value-40.png`
   - The monthly-need value measured exactly 40.
3. `C:\tmp\s29-session-29-evidence\03-fine-print-two-lines-18.png`
   - Both fine-print lines measured 18.
   - Their baselines were 930 and 960.8571428571429, matching
     `24 × 18 / 14` spacing.
4. `C:\tmp\s29-session-29-evidence\04-legend-16.png`
   - Both legend labels measured 16.
   - The second marker moved to x=164.4288 from the first marker at x=48,
     matching measured label width plus marker allowance and gap; the entries
     did not collide.
5. `C:\tmp\s29-session-29-evidence\05-present-fit-cursor-zoom.png`
   - Present entered at Fit: the map was 1,273.40625 × 983.984375 in a
     1,440 × 1,000 viewport.
   - The zoom cluster ended 16 px from the right and bottom edges.
   - Ctrl+wheel changed the readout from 96% Fit to 110%.
   - The pointer's normalized map anchor changed by about 0.00017
     horizontally and 0.000008 vertically.
   - Escape exited Present and restored the application workspace.
6. `C:\tmp\s29-session-29-evidence\06-print-emulation-zero-chrome.png`
   - Income, need, fine-print, and legend sizes persisted at their edited
     values.
   - Print editor chrome count was zero.

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
dist/index.html                                             0.49 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BRsSBTe6.css                             23.14 kB │ gzip:  5.27 kB
dist/assets/index-djtrJRIi.js                             296.78 kB │ gzip: 92.95 kB
✓ built in 780ms
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/mm-wt-s29

 ✓ tests/textfit.test.ts (5 tests) 6ms
 ✓ tests/contrast.test.ts (10 tests) 5ms
 ✓ tests/format.test.ts (24 tests) 17ms
 ✓ tests/math.test.ts (16 tests) 15ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/undo.test.ts (6 tests) 8ms
 ✓ tests/book.test.ts (63 tests) 31ms
 ✓ tests/wizard.test.ts (6 tests) 9ms
 ✓ tests/export.test.ts (3 tests) 5ms
 ✓ tests/overrides.test.ts (20 tests) 80ms
 ✓ tests/form.test.ts (4 tests) 14ms
 ✓ tests/layout.test.ts (58 tests) 131ms
 ✓ tests/mapedit.test.ts (29 tests) 67ms

 Test Files  13 passed (13)
      Tests  247 passed (247)
   Start at  00:43:55
   Duration  1.25s (transform 1.51s, setup 0ms, collect 3.94s, tests 388ms, environment 2ms, prepare 2.35s)
```

## Deviations

- The approximate budget was 420–580 changed lines. The two implementation
  commits contain 533 insertions and 142 deletions (675 total line changes).
  The overage came from replacing the account-only editor path with the
  unified target metadata/UI path while adding the specified rendering,
  presentation, and regression coverage.
- No dependency was added.
- No repository file outside the Session 29 file map was created or changed,
  except this required report.
- No file or CSS region on the MUST NOT TOUCH list was changed.

## Noticed but not done

- Extreme fixed-element sizes can overlap unchanged panel/card geometry. This
  is the explicit Session 29 behavior, so no automatic re-layout or validation
  was added.
- No wants outside Session 29 were implemented or added to `NOTES.md`.
