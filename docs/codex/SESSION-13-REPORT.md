# SESSION-13 Report

## Built

- Replaced the three fixed arrow builders with one relative-geometry quadratic
  router. Cards and panels expose their four edges; drums expose the top cap
  arc, sides, and bottom arc through a normalized clockwise outline parameter.
- Default anchors are the outline points facing the counterpart element's
  actual center. Generated waterfall arrows retain an explicit cap-zone
  preference until a participating account is moved or resized.
- Every path uses a quadratic control at the chord midpoint plus a signed
  perpendicular bow. The default bow is 15% of chord length and is capped at
  50%, keeping the final tangent within 45 degrees of the chord.
- Reused sampled quadratic/box intersection checks for all arrow kinds. The
  router tries the preferred side, the opposite side, then larger magnitudes;
  if no candidate clears, it keeps the lowest-penalty candidate. The masthead
  clamp remains part of candidate scoring.
- Added `bow`, `startT`, and `endT` to `LayoutOverride`. Arrow keys are
  `arrow:income`, `arrow:asNeeded`, and
  `arrow:waterfall:<sourceAccountId>`. Outline parameters clamp to `[0, 1]`;
  bow clamps to half the current chord length.
- Arrow geometry now carries its resolved start, control, end, bow, and
  outline parameters. Chip t-search, collision displacement, and the existing
  `asNeededChip` delta continue to run after the new curve is resolved.
- Added interactive arrow hit strokes and three circular handles. The wide
  transparent path and midpoint handle adjust bow; start/end handles project
  pointer position to the nearest point on the current element outline.
- Extended the SESSION-12 pointer lifecycle rather than adding another state
  owner: the four-pixel threshold, live preview, pointer capture,
  Escape-cancel, click suppression, and one `onChange` commit on release all
  remain shared.
- Kept arrow edits relative to current geometry, so moved/resized elements
  reroute live while stored t/bow values remain meaningful. Existing Reset
  layout behavior already deletes the complete override record.
- Added tests for cardinal-facing anchors, generated Whitfield cap-to-cap
  waterfalls and above-cap apexes, final-tangent direction, signed
  perpendicular drag math, silhouette reattachment, t/bow application and
  clamping, and sampled clearance for every overridden sample arrow.

## Files

Current physical LOC and SESSION-13 changes:

| File | LOC | SESSION-13 change |
| --- | ---: | ---: |
| `src/layout/layout.ts` | 1,024 | +408 / -203 |
| `src/model/types.ts` | 96 | +3 / -0 |
| `src/render/MapSvg.tsx` | 1,454 | +165 / -22 |
| `src/render/mapInteraction.ts` | 126 | +15 / -0 |
| `src/styles/app.css` | 1,004 | +32 / -0 |
| `tests/layout.test.ts` | 508 | +154 / -63 |
| `tests/overrides.test.ts` | 270 | +60 / -4 |
| `docs/codex/SESSION-13-REPORT.md` | 182 | new |

Implementation and test changes total 1,129 changed lines (+837 / -292), or a
net +545 lines. The changed-line count is 479 above the prompt's approximate
650-line upper estimate, while the net change is within its 450–650 estimate.
The additional churn is the direct replacement of 203 legacy routing lines and
63 obsolete fixed-path test lines rather than retaining parallel builders.

`layout.ts`, `MapSvg.tsx`, `app.css`, and `layout.test.ts` are above
approximately 400 physical LOC. They were not split because Session 13 assigns
the work to those existing files and names no additional implementation or
test files.

## Browser verification

Method: served the app locally with Vite and drove an isolated-profile headless
Microsoft Edge 150.0.4078.83 through the Chrome DevTools Protocol at
1440×1000, device scale factor 1, and default browser zoom. Full-viewport
screenshots were manually inspected.

- Generated Whitfield, Calloway, and Venkat retained the expected composition
  character. Their waterfall chains remained dotted, cap-zone to cap-zone,
  with an apex above both connected caps.
- Moved Whitfield's short-term drum 500 artboard units right and 500 down,
  level with the need card. The as-needed path became
  `M 890 803.3 Q 589.7 877.6 298 774.3`; its final tangent points left with a
  slight upward component rather than entering vertically downward.
- Moved the need card above the lowered/right-hand drum. The as-needed path
  became `M 890 747.2 Q 500.8 785.8 298 451.4`; its final tangent approaches
  up-left from below.
- Sent real pointer input to the as-needed midpoint handle. One release
  persisted `bow: -68.79152971722795`.
- Sent real pointer input to the start handle. One release persisted
  `startT: 0.84765625`; the resolved handle remained attached to the drum
  silhouette at artboard point `(890, 829.125)`.
- The first pointer pass exposed endpoint handles below the element paint
  layer. Moving the interactive arrow layer after the elements made all three
  handles reachable; the full pointer and screenshot pass was rerun.
- Print emulation rendered the arranged arrow state, computed `.print-map` as
  `grid` and `.workspace` as `none`, and found zero `.map-arrow-handle` and
  zero `.map-arrow-editor` nodes in the print `MapSvg`.

Screenshots and the temporary browser driver remain outside the repository:

- `C:\tmp\money-map-session13-visual\01-whitfield-default.png`
- `C:\tmp\money-map-session13-visual\02-calloway-default.png`
- `C:\tmp\money-map-session13-visual\03-venkat-default.png`
- `C:\tmp\money-map-session13-visual\04-drum-right-level.png`
- `C:\tmp\money-map-session13-visual\05-drum-below.png`
- `C:\tmp\money-map-session13-visual\06-arrow-overridden-focused.png`
- `C:\tmp\money-map-session13-visual\07-print-emulation.png`
- `C:\tmp\session13-visual.mjs`

## Gates

PowerShell script execution is disabled on this machine, so the required npm
commands were invoked through the Windows executable equivalents
`npm.cmd run build` and `npm.cmd test`.

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 49 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                           0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2 26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2 28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2    52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2    53.73 kB
dist/assets/index-DhKUGyL2.css                           13.60 kB │ gzip:  3.56 kB
dist/assets/index-D0zoT_lr.js                           252.83 kB │ gzip: 79.24 kB
✓ built in 795ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 3ms
 ✓ tests/format.test.ts (21 tests) 22ms
 ✓ tests/book.test.ts (15 tests) 10ms
 ✓ tests/export.test.ts (3 tests) 5ms
 ✓ tests/mapedit.test.ts (7 tests) 4ms
 ✓ tests/wizard.test.ts (6 tests) 7ms
 ✓ tests/overrides.test.ts (12 tests) 34ms
 ✓ tests/layout.test.ts (24 tests) 52ms

 Test Files  8 passed (8)
      Tests  98 passed (98)
   Start at  10:37:09
   Duration  984ms (transform 1.03s, setup 0ms, collect 2.09s, tests 138ms,
   environment 2ms, prepare 1.51s)
```

An initial sandboxed build could not let Vite/esbuild read the repository
configuration; approved reruns succeeded. The first full test run had six
expected failures from Session-12 fixed-anchor assertions. Those assertions
were replaced by Session-13 geometry contracts, and both final gates above
passed.

## Commits

- `2cb3c2a` — Add smart routing and draggable arrows.
- Final report commit follows this file.

## Deviations and observations

- The implementation exceeds the approximate changed-line budget as detailed
  in Files; its net line increase remains within the estimate.
- `src/App.tsx` needed no edit: its existing `MapSvg` `onChange` path already
  commits arbitrary override keys, and Reset layout already deletes the whole
  record. No file-map exception was created.
- Endpoint parameters clamp instead of wrapping. This is explicitly pinned by
  tests.
- No dependencies, additional state owner, context provider, state library,
  CSS-in-JS, or routing maze were added.
- No product or test file outside the Session-13 file map changed. This report
  is the required session artifact and the only new repository file.
- Nothing else out of scope was noticed or performed.
- Nothing was pushed and no remote was added.
