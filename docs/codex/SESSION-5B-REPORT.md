# SESSION-5B Report

## Built

- Capped every waterfall control point at no more than 24 SVG units above
  the higher connected drum top while retaining the absolute `y >= 128`
  floor and the existing clearance calculations.
- Expanded the sample waterfall test to associate each path with its source
  and target drums and assert both requested minimum-y bounds.
- Moved all four WOFF2 files from `public/fonts/` to `src/fonts/`.
- Changed screen font faces to Vite-resolved relative URLs and PNG export font
  loading to imported asset URLs. Vite now fingerprints both uses correctly
  for a subpath deployment.

## Files

Current text-file LOC (blank lines excluded):

| File | LOC | SESSION-5B change |
| --- | ---: | ---: |
| `src/layout/layout.ts` | 430 | +10 / -4 |
| `tests/layout.test.ts` | 279 | +31 / -14 |
| `src/styles/app.css` | 449 | +4 / -4 |
| `src/export/export.ts` | 173 | +8 / -4 |
| `src/fonts/literata-latin-wght-italic.woff2` | binary | moved |
| `src/fonts/literata-latin-wght-normal.woff2` | binary | moved |
| `src/fonts/public-sans-latin-wght-italic.woff2` | binary | moved |
| `src/fonts/public-sans-latin-wght-normal.woff2` | binary | moved |
| `docs/codex/SESSION-5B-REPORT.md` | 89 | new |

Implementation changes total 79 changed text lines (+53 / -26), within the
approximately 60–140 line budget. `layout.ts` and `app.css` exceed
approximately 400 LOC; they were not split because this session explicitly
scoped its edits to those existing files.

## Deployment and browser verification

After the final production build:

```text
PASS: no /fonts/ occurrences in dist/
PASS: 4 hashed woff2 files in dist/assets/
literata-latin-wght-italic-Bm_GJfSc.woff2 (53728 bytes)
literata-latin-wght-normal-DLxlUchJ.woff2 (52496 bytes)
public-sans-latin-wght-italic-DGZ7iaiu.woff2 (28292 bytes)
public-sans-latin-wght-normal-DdeTHZLK.woff2 (26832 bytes)
```

Method: served the app with the Vite dev server and drove headless Chrome
through the Chrome DevTools Protocol.

- The wordmark's computed family was `Literata, Georgia, serif`.
- `document.fonts.check()` returned true for Literata 600 and Public Sans 400.
- Browser resource timing showed all four WOFF2 assets fetched from
  `src/fonts/`; PNG export fetched all four imported URLs.
- Clicking **Export PNG** completed without an alert and downloaded
  `Jordan & Dana Whitfield — Money Map 2026.png` at 571,372 bytes, above the
  requested 500 KB proxy threshold.

## Gates

`npm.cmd run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 43 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                            0.41 kB │ gzip:  0.27 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2  26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2  28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2     52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2     53.73 kB
dist/assets/index-C9kCzD9f.css                             7.25 kB │ gzip:  2.19 kB
dist/assets/index-DYCec_dc.js                            230.49 kB │ gzip: 72.10 kB
✓ built in 1.04s
```

`npm.cmd test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (13 tests) 25ms
 ✓ tests/book.test.ts (12 tests) 12ms
 ✓ tests/layout.test.ts (16 tests) 16ms
 ✓ tests/export.test.ts (3 tests) 3ms

 Test Files  4 passed (4)
      Tests  44 passed (44)
   Start at  21:12:09
   Duration  878ms (transform 298ms, setup 0ms, collect 743ms, tests 56ms,
   environment 1ms, prepare 943ms)
```

## Commits

- `e7a952f` — Cap waterfall arcs near account drums
- `8809870` — Bundle font assets for subpath deploys

## Deviations and observations

- Deviations: none.
- No `src/vite-env.d.ts` was needed because the existing `vite/client` types
  already declare WOFF2 module imports.
- No out-of-scope work or new dependencies were added.
