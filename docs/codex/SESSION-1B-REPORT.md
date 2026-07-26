# SESSION-1B Report

Date: 2026-07-26

## Punch-list results

- **P1 — Waterfall clearance:** waterfall control height now uses the minimum
  account top across every intervening column minus 80. Right-to-left arrows
  land at the target's 35% x position and `y - 4`. When another account is
  stacked above the target, the path uses a clearance leg outside that drum
  before entering the target cap. The Whitfield regression test pins the
  apex, cash clearance, left-half endpoint, and cap endpoint.
- **P2 — Inset cap/label:** the sub-account label baseline moved to
  `cap center + capRy + 14`; caption and value baselines moved with it.
- **P3 — Drum spacing:** content-light drums compact to 152px in the sample.
  Short-term floor slack is divided evenly among its semantic text/value
  gaps, removing the single hollow middle.
- **P4 — Need-card arrows:** income lands exactly at need-card top-center;
  as-needed lands at the requested right-edge 45% point; its chip center is
  the curve's 40% point.

## File-by-file LOC

| File | LOC | Change |
| --- | ---: | --- |
| `src/layout/layout.ts` | 310 | Account heights and flow geometry |
| `src/render/MapSvg.tsx` | 759 | Inset and short-term text placement |
| `tests/layout.test.ts` | 203 | Waterfall, compact drum, and need-arrow assertions |

`src/render/MapSvg.tsx` remains above the repo's ~400 LOC warning threshold.
It was already 743 LOC at SESSION-1; this no-refactor session kept the
specified file map and did not split it.

## Required gates

### `npm test`

Final run against the code committed as `09986f0`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (7 tests) 14ms
 ✓ tests/layout.test.ts (10 tests) 6ms

 Test Files  2 passed (2)
      Tests  17 passed (17)
   Start at  14:26:22
   Duration  623ms (transform 256ms, setup 0ms, collect 367ms, tests 21ms, environment 0ms, prepare 207ms)
```

Result: green.

### `npm run build`

Final run against the code committed as `09986f0`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 34 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.41 kB │ gzip:  0.27 kB
dist/assets/index-BzcFk3pb.css   0.89 kB │ gzip:  0.33 kB
dist/assets/index-B6ZVvhCu.js  207.07 kB │ gzip: 65.50 kB
✓ built in 663ms
```

Result: green.

## Screenshot check

The production build was loaded through a local static server in headless
Chrome at 1375×1100. The final screenshot confirmed:

- the after-tax waterfall visibly travels left of the cash drum and enters
  the short-term cap from its clear left shoulder;
- the inset IRA label does not cross the dashed cap ellipse;
- cash is compact and short-term content has balanced vertical rhythm; and
- the need-card arrows have separate landings, with the as-needed line
  centered under its chip.

The screenshot was kept in `C:\tmp`, not added to the repository.

## Commits

```text
09986f0 Route waterfall around stacked accounts
46cd5dc Refine cylinder content spacing
f590a13 Fix flow and account layout geometry
```

No remote was added and nothing was pushed.

## Deviations and notes

- No scope deviations and no dependencies added.
- `tsconfig.tsbuildinfo` was already untracked at session start and was left
  untouched.
- The first headless screenshot attempt captured a connection-refused page
  because its temporary server exited early. A verified static server and
  waited Chrome process produced the successful final review above.

## Noticed but not done

Nothing outside the four-item punch list was changed.
