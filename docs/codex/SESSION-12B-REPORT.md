# SESSION-12B Report

## Built

- Added the preferred CSS-only pointer-focus rule:
  `.map-page svg [role='button']:focus:not(:focus-visible) { outline: none; }`.
- The rule suppresses Chromium's persistent default SVG focus rectangle after
  pointer drag or resize without changing the existing green
  `:focus-visible` keyboard ring.
- The focusable draggable account, income, and need groups are already the
  `[role='button']` elements, so the selector covers the affected targets.
  The non-role as-needed drag group is not focusable.
- Chromium did not retain the UA rectangle after the CSS fix, so the allowed
  `MapSvg.tsx` blur fallback was neither needed nor added.

## Files

Current physical LOC and SESSION-12B changes:

| File | LOC | SESSION-12B change |
| --- | ---: | ---: |
| `src/styles/app.css` | 972 | +4 / -0 |
| `docs/codex/SESSION-12B-REPORT.md` | 119 | new |

The implementation changed four lines, within the prompt's maximum of 25.
`app.css` remains above approximately 400 physical LOC. It was not split
because the session assigns this narrow fix to the existing stylesheet and
permits no new implementation file.

## Browser verification

Method: served the production build locally and drove a fresh-profile installed
Google Chrome through the Chrome DevTools Protocol at 1440×1000, device scale
factor 1. The post-drag full-viewport screenshot was manually inspected.

- Mouse drag: dragged the Managed IRA — Jordan drum 24 CSS pixels right and 12
  down, starting on its cap. After release it remained the active SVG group,
  reported `focusVisible: false` and `outlineStyle: none`, and showed no black
  rectangle in the screenshot.
- Keyboard: continued with Tab until the Roth IRA — Dana drum was focused. It
  reported `focusVisible: true`, `outline: 2px solid rgb(30, 122, 74)`, and
  `outline-offset: 3px`, preserving the green keyboard ring.
- Click-to-navigate: clicked the non-editable edge of the Monthly income need
  card; the guided form moved to the `Need` step.
- Click-to-edit: clicked the monthly need value; the inline input appeared with
  the `Edit monthly income need` accessible label.

The temporary browser driver and screenshot remain outside the repository:

- `C:\tmp\session-12b-browser-check.mjs`
- `C:\tmp\session-12b-post-drag.png`

## Gates

`npm run build` (invoked through the equivalent Windows `npm.cmd` shim):

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 49 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-1AfLr8aP.css                           13.03 kB │ gzip:  3.50 kB
dist/assets/index-DvVCXqDC.js                           249.61 kB │ gzip: 77.99 kB
✓ built in 765ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 3ms
 ✓ tests/format.test.ts (21 tests) 15ms
 ✓ tests/book.test.ts (15 tests) 9ms
 ✓ tests/wizard.test.ts (6 tests) 5ms
 ✓ tests/mapedit.test.ts (7 tests) 4ms
 ✓ tests/overrides.test.ts (10 tests) 11ms
 ✓ tests/export.test.ts (3 tests) 2ms
 ✓ tests/layout.test.ts (18 tests) 18ms

 Test Files  8 passed (8)
      Tests  90 passed (90)
   Start at  10:05:48
   Duration  1.18s (transform 1.51s, setup 0ms, collect 2.50s, tests 66ms,
   environment 1ms, prepare 2.08s)
```

The literal `npm` command first selected the disabled PowerShell `npm.ps1`
shim, so the successful gates used `npm.cmd`, which runs the same package
scripts. The first sandboxed build attempt could not let Vite/esbuild read the
repository configuration; the approved rerun quoted above passed.

## Commits

- `15cb3a3` — Suppress pointer focus outline on map.
- Final report commit follows this file.

## Deviations and observations

- There were no implementation deviations from the prompt. The preferred
  CSS-only route succeeded, and `src/render/MapSvg.tsx` was unchanged.
- No product, test, dependency, or repository file outside the Session 12B file
  map changed. This report is the required session artifact.
- The temporary verification files are outside the repository and are not part
  of the product or commit.
- Nothing else out of scope was noticed or performed.
- Nothing was pushed and no remote was added.
