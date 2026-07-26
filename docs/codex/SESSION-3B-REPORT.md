# SESSION-3B Report — Print punch list

## What was built

### P1 — Print arrowheads

- `MapSvg` now creates a per-instance marker ID with `useId()`, sanitized
  before use in an SVG URL.
- Every flow path receives and references its own `MapSvg` instance's marker
  ID.
- The screen and print SVGs therefore no longer share a document-level marker
  ID.

### P2 — Calloway as-needed chip clearance

- The as-needed label starts at the existing quadratic-curve anchor.
- If its 260×38 working box violates the 10 px account clearance, the layout
  deterministically raises it above the colliding account, then shifts it left
  only when needed to clear an account exposed by that raise.
- Added a Calloway regression test using the requested approximate 260×34 chip
  extent plus a 10 px clearance margin. The expanded chip box intersects no
  placed account.

## Files and LOC

| File | Final LOC | Session change |
| --- | ---: | ---: |
| `src/render/MapSvg.tsx` | 771 | +16 / -4 |
| `src/layout/layout.ts` | 369 | +61 / -2 |
| `tests/layout.test.ts` | 228 | +26 / -1 |

Implementation diff: 103 insertions and 7 deletions (110 changed lines).

`src/export/export.ts` was not changed.

## Print verification

I verified the production build in headless Chrome in two print paths:

1. Served `dist/` at `http://127.0.0.1:4173/` with
   `python -m http.server`.
2. Ran Chrome headless with `--print-to-pdf` against that built URL. It wrote
   `C:\tmp\money-map-session-3b-print.pdf` (49,864 bytes).
3. Opened the same built URL in a Chrome DevTools Protocol session, applied
   `Emulation.setEmulatedMedia` with `media: "print"`, waited for
   `document.fonts.ready`, and captured the visible print SVG with
   `Page.captureScreenshot` to
   `C:\tmp\money-map-session-3b-print-media.png`.
4. Visually inspected that capture. Arrowheads are present on the income
   arrow, the as-needed arrow, and both waterfall arrows.
5. Audited the print DOM in that same emulated session:
   - marker IDs were `flow-arrowhead-_r_0_` and
     `flow-arrowhead-_r_1_` (2 IDs, 2 unique);
   - the print container was `display: grid` and the screen workspace was
     `display: none`;
   - all four print flow paths referenced only
     `url(#flow-arrowhead-_r_1_)`, the marker inside the visible print SVG.

I also selected `The Calloway Family` in a headless print-media session and
captured `C:\tmp\money-map-session-3b-calloway-print.png`. SVG `getBBox()`
measurements were:

- chip: x 125, y 568, width 250, height 38;
- note: x 390, y 616, width 250, height 190;
- horizontal clearance: 15 px;
- vertical clearance: 10 px.

The capture was visually inspected and the chip no longer grazes the note.

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
dist/index.html                  0.41 kB │ gzip:  0.27 kB
dist/assets/index-CJYgHKEY.css   5.35 kB │ gzip:  1.81 kB
dist/assets/index-CHj0F8ew.js  225.35 kB │ gzip: 70.25 kB
✓ built in 695ms
```

### `npm.cmd test`

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (7 tests) 17ms
 ✓ tests/layout.test.ts (11 tests) 9ms
 ✓ tests/export.test.ts (3 tests) 3ms
 ✓ tests/book.test.ts (12 tests) 12ms

 Test Files  4 passed (4)
      Tests  33 passed (33)
   Start at  15:19:41
   Duration  774ms (transform 172ms, setup 0ms, collect 571ms, tests 41ms, environment 1ms, prepare 487ms)
```

The first PowerShell spelling, `npm run build`, resolved to the blocked
`npm.ps1` wrapper on this machine. The first `npm.cmd run build` attempt was
then denied parent-directory reads by the managed sandbox. Running the same
Windows command with the required sandbox approval produced the green build
quoted above. Neither launcher failure was a TypeScript, Vite, or test
failure.

## Commits

- `b2d2338` — `Fix print arrowhead marker collisions`
- `43c006e` — `Clear as-needed labels from account cards`

## Deviations and observations

- No functional deviations from SESSION-3B.
- No dependencies were added and no unrelated source files were changed.
- `src/render/MapSvg.tsx` is 771 LOC, above the repository's ~400 LOC
  reporting threshold. It was already above that threshold; I did not split
  it because this session explicitly requested surgical fixes only.
- The headless verification artifacts remain in `C:\tmp`; they are not part
  of the repository.
