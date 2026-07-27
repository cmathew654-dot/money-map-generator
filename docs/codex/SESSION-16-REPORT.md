# SESSION-16 Report

## Built

### Undo and redo

- Kept `App.tsx` as the single owner of the current `{ book,
  activeClientId }` snapshot.
- Added pure history operations in `src/model/book.ts`:
  `emptyHistory()`, `pushHistory()`, `undoHistory()`, and `redoHistory()`.
- History steps retain `before` and `after` snapshots by reference. The
  in-memory undo stack is bounded at 50 steps and drops the oldest step.
- Consecutive reference-contiguous commits to the same client coalesce through
  the 800 ms boundary. Book-wide commits do not coalesce.
- A new edit clears redo. Undo and redo restore both the book and the active
  client recorded for the changed step, even if the advisor navigated to a
  different client after the edit.
- Routed every model commit path through the history layer: form edits,
  in-place map edits, drag/resize/arrow/shape commits, add, duplicate, delete,
  Reset layout, and Load book.
- Kept plain client selection outside history because it changes no model
  data. The wizard's existing `Start over` control also changes only wizard
  navigation, not the book, so it creates no model-history step.
- Added quiet `↶` and `↷` header buttons. They use existing button styling,
  disable against empty stacks, expose `Undo` / `Redo` aria labels, and show
  the supported shortcuts in native title tooltips.
- Added Ctrl+Z undo and Ctrl+Shift+Z / Ctrl+Y redo. Meta-key equivalents work
  on platforms that use Command.
- History is never serialized. The existing debounced localStorage effect
  continues to save only the restored or newly committed current book.

### Quiet arithmetic

- Added optional client-level `showMath?: boolean`; absence means on, so
  legacy books retain the new captions without migration.
- Book import accepts booleans, rejects other explicit values, and continues
  to round-trip legacy clients with the field absent.
- Added pure `runwayLine()` and `gapLine()` helpers in the allowed new
  `src/model/math.ts`.
- `runwayLine()`:
  - requires math on, a finite account value greater than zero, and a finite
    monthly draw greater than zero;
  - converts the value ÷ monthly draw result from months to years;
  - suppresses results over 99 years;
  - returns one decimal place in the exact `≈ … yrs at $…/mo` grammar.
- `gapLine()`:
  - requires math on and finite, non-null monthly need, stated After-Tax
    Income, and draw inputs;
  - uses only the stated After-Tax Income field;
  - returns the dollar gap only when positive and the exact covered message
    for zero or negative gaps.
- All SVG rendering decisions call those two helpers. No renderer duplicates
  the eligibility logic.
- Rendered both lines at 11.5px Public Sans in `MUTED`, always prefixed `≈`.
  The runway sits inside each short-term account below its value; the gap sits
  below the need value.
- When runway is present, the account value moves up by exactly the caption
  line height. When runway is absent or math is off, that offset also
  disappears, leaving no math placeholder.
- The same noninteractive `MapSvg` used for print and PNG receives the lines,
  so both artifact exports include or suppress them with the client switch.
- Added the small `Show runway and gap math` checkbox to the shared Client
  section, so it is available in both guided and full-form modes.

## Tests

- `tests/math.test.ts` pins:
  - the `≈ 2.3 yrs at $6,000/mo` example;
  - blank account and draw inputs;
  - zero and negative account values and draws;
  - the inclusive 99-year boundary and suppression above 99;
  - positive, zero, and negative gaps;
  - zero and negative stated draws in the gap formula;
  - each blank gap input;
  - the per-client off switch.
- `tests/undo.test.ts` pins push, the inclusive 800 ms coalescing boundary,
  non-coalescing cases, undo, redo, active-client restoration, redo clearing,
  the 50-step bound, oldest-step removal, and empty-stack behavior.
- `tests/book.test.ts` pins absent legacy `showMath`, explicit false
  round-tripping, and invalid-value rejection.
- Existing suites remained green.

## Files

Physical LOC and changes relative to the owner-provided Session 16 spec commit
`9a77e7d`:

| File | LOC | SESSION-16 change |
| --- | ---: | ---: |
| `src/App.tsx` | 590 | +153 / -23 |
| `src/model/types.ts` | 114 | +2 / -0 |
| `src/model/book.ts` | 278 | +92 / -0 |
| `src/model/math.ts` | 47 | new |
| `src/render/MapSvg.tsx` | 1,631 | +58 / -4 |
| `src/form/Form.tsx` | 967 | +10 / -0 |
| `src/styles/app.css` | 1,073 | +9 / -0 |
| `tests/math.test.ts` | 73 | new |
| `tests/undo.test.ts` | 107 | new |
| `tests/book.test.ts` | 244 | +20 / -0 |
| `docs/codex/SESSION-16-REPORT.md` | 225 | new |

The implementation and test diff is 571 additions and 27 deletions: 598
touched lines, within the prompt's approximate 400–600 changed-line budget.

`App.tsx`, `MapSvg.tsx`, `Form.tsx`, and `app.css` remain above approximately
400 physical LOC. They were not split because Session 16 assigns work to those
existing files, keeps `App.tsx` as the state owner, and permits only the small
new math module.

`src/model/format.ts` was not changed because the allowed `src/model/math.ts`
keeps the rendering contracts together more clearly.

## Screenshot and interaction verification

Method: served the current app locally and drove a fresh-profile headless
Microsoft Edge through the Chrome DevTools Protocol at 1440×1000, device scale
factor 1, and default browser zoom. The six screenshots were manually
inspected and paired with DOM, SVG-style, pointer, keyboard, geometry,
client-toggle, and print-media assertions.

1. `C:\tmp\money-map-session16-visual\01-whitfield-math-on.png`
   - Set Whitfield's draw to $6,000 through the React form.
   - The map rendered exactly `≈ 2.3 yrs at $6,000/mo` and
     `≈ $3,100/mo gap after income + draw`.
   - Both lines reported `font-size="11.5"`, Public Sans, and fill
     `#5b6663`.
   - Manual inspection found the captions quiet and legible; the artifact
     still reads as a document.
2. `C:\tmp\money-map-session16-visual\02-whitfield-draw-blank.png`
   - Blank draw produced zero SVG text nodes beginning with `≈`.
   - The short-term value returned to its original lower position, and the
     need card retained no math placeholder.
3. `C:\tmp\money-map-session16-visual\03-drum-drag-redone.png`
   - A real pointer drag moved the short-term drum 72 px right and 38 px down.
   - Ctrl+Z restored both measured coordinates exactly.
   - Ctrl+Y restored the dragged coordinates exactly.
4. `C:\tmp\money-map-session16-visual\04-reset-layout-undone.png`
   - Reset layout restored the generated short-term position exactly.
   - Ctrl+Z then restored the previously dragged arrangement exactly.
5. `C:\tmp\money-map-session16-visual\05-print-math-on.png`
   - Print emulation computed `.print-map` as `grid` and `.workspace` as
     `none`.
   - The clean generated-layout print artifact contained both math lines with
     the same muted style and no interactive chrome.
6. `C:\tmp\money-map-session16-visual\06-print-math-off.png`
   - The client checkbox changed from checked to unchecked.
   - The print artifact then contained zero `≈` lines, with values returning
     to their no-caption positions.

The temporary browser driver remains outside the repository:
`C:\tmp\session16-visual.mjs`.

## Gates

The required commands were invoked through their Windows executable
equivalents with color disabled for verbatim logging. The final runs below are
from the exact implementation commits.

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 50 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-D7rgVOBr.css                             14.69 kB │ gzip:  3.78 kB
dist/assets/index-kQ4kGxrv.js                             260.08 kB │ gzip: 81.67 kB
✓ built in 712ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 4ms
 ✓ tests/math.test.ts (16 tests) 14ms
 ✓ tests/format.test.ts (21 tests) 15ms
 ✓ tests/export.test.ts (3 tests) 3ms
 ✓ tests/undo.test.ts (6 tests) 5ms
 ✓ tests/book.test.ts (27 tests) 12ms
 ✓ tests/mapedit.test.ts (7 tests) 4ms
 ✓ tests/wizard.test.ts (6 tests) 6ms
 ✓ tests/overrides.test.ts (12 tests) 29ms
 ✓ tests/layout.test.ts (29 tests) 68ms

 Test Files  10 passed (10)
      Tests  137 passed (137)
   Start at  14:02:39
   Duration  1.33s (transform 1.68s, setup 0ms, collect 3.04s, tests 160ms, environment 1ms, prepare 2.50s)
```

## Commits

- `ebcd7d6` — Add quiet map arithmetic
- `355645f` — Add bounded undo and redo history

This report is committed separately as the final Session 16 commit.

## Deviations and observations

- No dependencies were added, no remote was changed, and nothing was pushed.
- No behavioral or file-map deviations.
- The initial focused arithmetic test exposed a months-to-years omission in
  the first `runwayLine()` draft. The helper was corrected to divide by 12,
  producing the owner-specified 2.3-year example; all focused and final gates
  then passed.
- Initial sandboxed Vite invocations could not read `vite.config.ts` because
  of the managed filesystem restriction. The focused checks and all final
  required gates were rerun outside that restriction and passed.
- The delete dialog no longer says deletion cannot be undone; it now tells
  the advisor the action can be undone.
