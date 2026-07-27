# SESSION-4B Report — As-needed route clearance

## What was built

- The as-needed route now uses one obstacle set containing the income panel,
  need card, and every placed account or note.
- Its start anchor searches deterministic short-term-drum fractions from
  `0.72h` through `0.95h`, keeping the existing need-card endpoint and taking
  the first segment that clears every obstacle.
- Its chip searches the quadratic route from `t=0.40` in alternating `0.05`
  steps within `[0.15, 0.80]`.
- Chip candidates use the requested 260×34 box plus 10 px clearance against
  the same complete obstacle set.
- If no route anchor clears, the chip moves along the route's upward normal
  in deterministic 8 px steps until clear.
- The prior Calloway-only regression is now parameterized across Whitfield,
  Calloway, Venkat, and `blankClient()`. It checks chip clearance from income,
  need, and all accounts/notes, plus segment clearance from income and all
  accounts/notes.
- The obsolete SESSION-3B assertion that a chip could only move up or left
  was removed because SESSION-4B explicitly replaces it with an along-route
  search.

## Files and LOC

| File | Final LOC | Session change |
| --- | ---: | ---: |
| `src/layout/layout.ts` | 458 | +124 / -56 |
| `tests/layout.test.ts` | 296 | +73 / -34 |

Implementation diff: 197 insertions and 90 deletions (net +107 LOC).
The net change is within the approximate 60–140-line budget; the raw diff is
287 changed lines because the old one-off clearance algorithm and its
directional test were replaced rather than retained.

`src/layout/layout.ts` is now 458 LOC, above the repository's approximate
400-LOC reporting threshold. I did not split it because SESSION-4B is a
surgical change and names this existing file directly.

## Screenshot verification

I verified the production build in headless Chrome at default 100% browser
zoom, a 1920×1080 viewport, and device scale factor 1. Using the app's real
client selector, I captured and visually inspected:

- `C:\tmp\session-4b-whitfield.png`
- `C:\tmp\session-4b-calloway.png`
- `C:\tmp\session-4b-venkat.png`

On all three samples, the as-needed chip and dashed route clear the income
panel. The chip also clears the need card and all account/note boxes. Venkat's
route no longer clips the income panel corner, and Calloway's chip clears its
denser center-column stack.

## Gates

### `npm.cmd run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 39 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                 0.41 kB │ gzip:  0.27 kB
dist/assets/index-C8e_Y9sg.css  6.75 kB │ gzip:  2.08 kB
dist/assets/index-DDU6mzEP.js  227.24 kB │ gzip: 70.93 kB
✓ built in 693ms
```

### `npm.cmd test`

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (7 tests) 14ms
 ✓ tests/layout.test.ts (16 tests) 9ms
 ✓ tests/export.test.ts (3 tests) 3ms
 ✓ tests/book.test.ts (12 tests) 11ms

 Test Files  4 passed (4)
      Tests  38 passed (38)
   Start at  17:25:23
   Duration  623ms (transform 210ms, setup 0ms, collect 506ms, tests 38ms, environment 1ms, prepare 467ms)
```

Bare `npm` resolved to the execution-policy-blocked `npm.ps1` wrapper on this
Windows machine, so the equivalent `npm.cmd` launcher was used. The first
in-sandbox build was denied parent-directory reads by the managed sandbox;
the approved rerun produced the green output above.

The first post-implementation test run had 37 of 38 tests green. Its only
failure was the old SESSION-3B directional chip assertion. After replacing
that assertion with the SESSION-4B clearance contract, the final run above
was fully green.

## Commit

- `a66471c` — `Clear as-needed routes from layout obstacles`

## Deviations and observations

- No functional deviations from SESSION-4B.
- No dependencies were added and no unrelated source files were changed.
- The screenshot artifacts remain in `C:\tmp`; they are not part of the
  repository.
