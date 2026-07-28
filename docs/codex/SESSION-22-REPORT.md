# SESSION-22 Report — Map text integrity

## What was built

- Added conservative, DOM-free Literata width estimation and measured greedy
  wrapping. Overlong single words hard-break into fragments that fit.
- Made `layoutMap` the sole owner of account and sub-account title/caption line
  breaks. `MapSvg` renders the exact arrays on `PlacedAccount` and never wraps
  map text.
- Recomputed wrapping and minimum safe height from each account's effective
  width, including width overrides down to `MIN_ACCOUNT_WIDTH`.
- Added shape-aware text widths for drums/cards, hexagon taper, and pill end
  curves; rotation continues to apply after local-space fitting.
- Derived account/sub-account heights and baselines from the shared `TYPE` and
  `LEADING` tokens, with role gaps and bottom-cap clearance. Dense layouts no
  longer shrink shapes below their content.
- Applied the specified larger map type scale and moved every remaining
  `MapSvg` font-size literal into a named `TYPE` token.
- Preserved arrow clearance after the taller layouts by considering the need
  card during as-needed routing and aligning centered geometry to the path's
  tenth-pixel precision.

## Commits

1. `9d6ddfa add measured map text fitting`
2. `a936c01 make map account text grow to fit`
3. `19b53f3 test map text integrity at shape bounds`

No push was performed.

## File-by-file LOC

Current line counts:

| File | LOC | Change |
| --- | ---: | --- |
| `src/layout/textfit.ts` | 84 | Created: conservative width table, `textWidth`, and `fitLines` |
| `tests/textfit.test.ts` | 74 | Created: width and measured-wrap unit tests |
| `src/render/tokens.ts` | 109 | Updated type scale; added named map roles and `LEADING` |
| `src/layout/layout.ts` | 1,497 | Shared measured line layout, shape insets, baselines, grow-to-fit height, override recomputation |
| `src/render/MapSvg.tsx` | 1,629 | Removed map re-wrapping; renders layout-owned lines/baselines and tokenized sizes |
| `tests/layout.test.ts` | 800 | Added sample/stress width, cap-clearance, growth, and artboard invariants; updated honest pins |
| `tests/overrides.test.ts` | 452 | Updated the obsolete fixed-120px override assertion to require content-safe growth |

`layout.ts`, `MapSvg.tsx`, `layout.test.ts`, and `overrides.test.ts` remain over
the repository's approximate 400-LOC reporting threshold. They were not split
because Session 22's file map does not permit new architecture files beyond
`textfit.ts`.

## Gate outputs

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 53 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-BGsEx9XO.css                             17.74 kB │ gzip:  4.37 kB
dist/assets/index-T_lak8g1.js                             272.25 kB │ gzip: 85.70 kB
✓ built in 3.00s
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 9ms
 ✓ tests/format.test.ts (21 tests) 50ms
 ✓ tests/textfit.test.ts (5 tests) 17ms
 ✓ tests/undo.test.ts (6 tests) 13ms
 ✓ tests/filestore.test.ts (3 tests) 8ms
 ✓ tests/math.test.ts (16 tests) 45ms
 ✓ tests/export.test.ts (3 tests) 7ms
 ✓ tests/mapedit.test.ts (7 tests) 14ms
 ✓ tests/book.test.ts (29 tests) 52ms
 ✓ tests/wizard.test.ts (6 tests) 15ms
 ✓ tests/overrides.test.ts (19 tests) 110ms
 ✓ tests/layout.test.ts (40 tests) 262ms

 Test Files  12 passed (12)
      Tests  165 passed (165)
   Start at  20:00:00
   Duration  2.60s (transform 1.80s, setup 0ms, collect 5.18s, tests 602ms, environment 4ms, prepare 12.51s)
```

## Screenshot verification

Headless Chrome captures are in `C:\tmp\session22-visuals` (verification
artifacts only; not repository files).

- Whitfield, Calloway, and Venkat were captured before and after at a
  1440×920 fit-width presentation viewport. The updated maps have visibly
  larger type and leading, with all account text inside its shape.
- The stress baseline reproduced the bug: a 64-character all-caps,
  wide-glyph label escaped across the page. After Session 22 it hard-wraps
  inside a visibly taller drum.
- The same stress client includes a 180px `MIN_ACCOUNT_WIDTH` drum with a long
  label; it wraps and grows without clipping.
- Print emulation produced `after-print.pdf` with `/Count 1` and one page
  object. The print capture shows the full artboard and all stress content
  inside the single landscape page.

## Deviations and justified file-map exception

- The approximate 350–550 changed-line budget was exceeded: the session diff
  is 754 insertions and 259 deletions. The additional volume is the explicit
  shared baseline/shape metadata required to keep layout, rendering,
  sub-account drums, width overrides, and tests on one contract.
- `tests/overrides.test.ts` was touched although it was not named in the
  Session 22 touch list. Justification: its pinned `h === 120` assertion
  directly contradicted the required grow-to-fit behavior at minimum width;
  it now asserts the stronger content-clearance invariant.
- `src/model/format.ts` was not touched. `wrap()` remains for its non-map
  contract tests, while the map path has no `wrap()` callers.
- No dependencies were added and no other source or documentation files were
  changed.

## Noticed but not done

- No unrelated product or v2 work was identified or added.
- The user-provided `docs/codex/SESSION-22.md` remains untracked and untouched.
