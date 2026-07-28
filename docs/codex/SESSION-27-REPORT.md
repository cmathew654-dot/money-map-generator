# SESSION-27 Report — Per-text font size + move on shapes

## What was built

- Added account text override keys in the form
  `text:<accountId>:<role>`, where role is `label`, `caption`, or `value`.
- Added finite `fs` persistence validation. Font sizes render clamped to
  9–28, and malformed text keys, unknown account IDs, unsupported roles,
  non-finite values, and `fs` on non-text overrides are rejected.
- Remapped text override keys to fresh account IDs when duplicating clients.
- Reset arrangement now clears text overrides with the rest of the override
  record through a tested pure helper.
- Made label and caption wrapping use their overridden sizes and proportional
  line spacing. Oversized unmoved text grows its account shape and preserves
  the Session 22 containment contract.
- Made value and value-tag measurement use the overridden value size. The
  value line remains unwrapped and can grow the shape width and height.
- Added local pre-rotation text offsets. Explicitly moved text may leave its
  account shape, remains clamped to the printable override bounds, and rotates
  with the parent account.
- Added caption in-place editing alongside the existing account label and
  value editing.
- Added compact `A−` and `A+` controls to the account text editor. Each press
  changes the size by one, previews live, and commits with the text edit as
  one history step.
- Added threshold-based account text dragging with live preview, Escape
  cancellation, pointer capture after threshold crossing, one release commit,
  and click-to-edit behavior below the threshold.
- Preserved chrome-free noninteractive rendering for present, print, and PNG.

## File-by-file LOC

| File | LOC |
| --- | ---: |
| `src/model/types.ts` | 151 |
| `src/model/book.ts` | 520 |
| `src/layout/layout.ts` | 1,834 |
| `src/render/MapSvg.tsx` | 2,027 |
| `src/render/mapInteraction.ts` | 242 |
| `src/ui/MapTextEditor.tsx` | 286 |
| `src/App.tsx` | 1,137 |
| `src/styles/app.css` | 1,550 |
| `tests/overrides.test.ts` | 472 |
| `tests/book.test.ts` | 540 |
| `tests/layout.test.ts` | 1,121 |
| `tests/mapedit.test.ts` | 254 |
| `docs/codex/SESSION-27-REPORT.md` | 167 |

The files already over the approximately 400 LOC guidance, and still over it
after this session, are `src/model/book.ts`, `src/layout/layout.ts`,
`src/render/MapSvg.tsx`, `src/App.tsx`, `src/styles/app.css`,
`tests/overrides.test.ts`, `tests/book.test.ts`, and
`tests/layout.test.ts`. They were not split because the session file map and
the repository's explicit architecture rules take precedence.

## Tests added

- `overrides.test.ts`: finite text override round-trip and non-finite `fs`
  rejection.
- `book.test.ts`: text override round-trip, malformed keys, reset clearing,
  and duplicate-client key remapping.
- `layout.test.ts`: 24-unit label re-wrap and strict growth; oversized
  unmoved containment across all samples plus the long-label stress client;
  moved-text bounds clamping and explicit containment exemption; tagged value
  measurement at the overridden size.
- `mapedit.test.ts`: 9/28 stepper clamping, pure edit-versus-move threshold
  decision, and caption text editing.

## Screenshot verification

Headless Chrome was launched with stdout and stderr redirected to
`C:\tmp\session27-chrome.stdout.log` and
`C:\tmp\session27-chrome.stderr.log`. Preview server and verification logs
were also kept under `C:\tmp`.

1. `C:\tmp\session27-label-enlarged.png`
   - `A+` pressed four times: 18 → 22.
   - Drum height grew from 125 to 242.333 units.
   - Browser geometry check and visual inspection found no clipping.
2. `C:\tmp\session27-caption-moved.png`
   - Caption anchor moved 255.830 units, more than the 250-unit drum width.
   - The caption visibly renders outside its drum, as explicitly allowed.
3. `C:\tmp\session27-print.png`
   - Print-emulated text placement matched the interactive SVG coordinates.
   - Editor chrome count was zero and the print SVG was noninteractive.
4. Undo verification
   - First Undo restored caption coordinates from `(770.830, 292.5)` to
     `(515, 292.5)` while leaving the 22-unit label size intact.
   - Second Undo restored the label size from 22 to 18.
   - Each committed edit therefore occupied one independent undo step.

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
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-D2aBPqD1.css                             21.78 kB │ gzip:  5.09 kB
dist/assets/index-cqTVadTN.js                             289.52 kB │ gzip: 90.87 kB
✓ built in 1.33s
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 6ms
 ✓ tests/textfit.test.ts (5 tests) 11ms
 ✓ tests/format.test.ts (24 tests) 33ms
 ✓ tests/math.test.ts (16 tests) 25ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/undo.test.ts (6 tests) 10ms
 ✓ tests/wizard.test.ts (6 tests) 10ms
 ✓ tests/export.test.ts (3 tests) 5ms
 ✓ tests/form.test.ts (4 tests) 27ms
 ✓ tests/book.test.ts (57 tests) 55ms
 ✓ tests/overrides.test.ts (20 tests) 113ms
 ✓ tests/layout.test.ts (56 tests) 221ms
 ✓ tests/mapedit.test.ts (17 tests) 92ms

 Test Files  13 passed (13)
      Tests  227 passed (227)
   Start at  22:00:58
   Duration  1.52s (transform 1.53s, setup 0ms, collect 4.52s, tests 612ms, environment 4ms, prepare 4.27s)
```

## Deviations

- The session budget was approximately 350–500 changed lines. The two
  implementation commits total 802 insertions and 80 deletions. The overage is
  stated rather than hidden; the three-role layout contract, editor wrapper,
  drag wiring, persistence edge cases, and specified stress/interaction tests
  required more code than estimated.
- `App.tsx` was intended for editor wiring only. In addition to that wiring,
  its existing three-line inline reset deletion was replaced with one call to
  the tested `resetArrangement` helper in `book.ts`, so the required
  reset-clears-text-keys behavior has direct test coverage.
- No dependencies were added. No repository file outside the session file map
  was created or changed, except this required report.

## Limitations and noticed-but-not-done

- Per-text sizing and movement apply only to top-level account labels,
  captions, and value lines.
- Income panels, the need card, masthead, footnotes, note blocks, and
  sub-account text retain fixed typography in v1.
- Explicitly moved account text is intentionally exempt from account-shape
  containment and can overlap other map content; only printable override
  bounds are enforced.
- No additional wants were implemented or added to `NOTES.md`.
