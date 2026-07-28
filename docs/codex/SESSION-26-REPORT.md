# SESSION-26 Report — Notes on the map + text tags beside numbers

## What was built

- Added optional `MapNote[]` data with validated ids, text, and artboard
  coordinates. Legacy books remain valid, duplication assigns fresh note ids,
  reset arrangement preserves notes, and clear map removes them with the rest
  of the client data.
- Added the screen-only `+ Note` control. A new note opens the existing
  in-place editor near map center; blur, Enter, or Escape commits once, while
  an empty first edit is a no-op.
- Rendered notes as borderless, transparent, muted Literata annotations.
  Layout owns their `fitLines` wrapping at exactly 240 artboard units and
  clamps the resulting block to `OVERRIDE_BOUNDS`.
- Made notes draggable on the top annotation layer, with preview-only movement
  during the gesture and one independently undoable commit on release. The
  hover × deletes only its note; delete is independently undoable. Notes are
  never included in arrow obstacle routing.
- Added optional account `valueTag` and client `needTag` fields. Both forms
  expose a narrow Tag input beside the related money field, including the
  shared wizard sections.
- Rendered tags in muted italic beside the numeric or blank money string.
  Account and need-card layout measures the combined value/tag line and grows
  the shape when required; the line does not wrap. Runway and gap arithmetic
  still receives only the numeric fields.
- V1 limitation: in-place map value editing edits the number only. Tags are
  edited in the form.

## Commits

1. `0e8b353 add map notes and value tags`
2. `3c6f2b5 test note and tagged value contracts`
3. `28475f7 keep note interactions independently undoable`

No push was performed.

## File-by-file LOC

Current line counts:

| File | LOC | Change |
| --- | ---: | --- |
| `src/model/types.ts` | 138 | Added `MapNote`, `notes`, `valueTag`, and `needTag` |
| `src/model/book.ts` | 457 | Validated notes/tags, remapped duplicate note ids, retained clear-map semantics |
| `src/layout/layout.ts` | 1,633 | Added fixed-width note layout/clamping and tagged value-line sizing |
| `src/render/MapSvg.tsx` | 1,985 | Rendered/editable/draggable/deletable notes and muted italic value tags |
| `src/render/tokens.ts` | 110 | Added `TYPE.note` |
| `src/render/mapInteraction.ts` | 235 | Added pure note add/delete/move helpers |
| `src/form/Form.tsx` | 1,036 | Added shared narrow Tag inputs beside account value and monthly need |
| `src/styles/app.css` | 1,515 | Styled note delete/editor chrome, `+ Note`, and paired value/tag fields |
| `src/App.tsx` | 1,090 | Launched draft-note editing and separated map gestures into undo boundaries |
| `src/ui/MapTextEditor.tsx` | 190 | Added note text targets, placeholder, one-commit creation, and note Escape commit |
| `tests/book.test.ts` | 482 | Covered absent/valid/malformed notes and tags, clearing, and fresh duplicate ids |
| `tests/layout.test.ts` | 1,009 | Covered 240-unit note wrapping/clamping and long-tag no-clip growth |
| `tests/mapedit.test.ts` | 226 | Covered empty add, targeted delete, print content, and zero note chrome |

The implementation changed 635 lines added and 40 removed, above the prompt's
approximate 350–500-line budget. The additional lines are primarily the two
required editor integration files omitted from the touch list, explicit
interaction/accessibility markup, and the specified validation/tests.

`book.ts`, `layout.ts`, `MapSvg.tsx`, `Form.tsx`, `app.css`, `App.tsx`,
`book.test.ts`, and `layout.test.ts` are over the repository's approximate
400-LOC reporting threshold. They were not split because Session 26 permits no
new architecture files.

## Gate outputs

The first sandboxed build attempt was blocked by esbuild config resolution
access outside the workspace. The approved rerun completed successfully.

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 53 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-DhArscVy.css                             21.27 kB │ gzip:  4.99 kB
dist/assets/index-B_Y3WuKj.js                             285.41 kB │ gzip: 89.57 kB
✓ built in 1.21s
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/textfit.test.ts (5 tests) 13ms
 ✓ tests/contrast.test.ts (10 tests) 6ms
 ✓ tests/math.test.ts (16 tests) 26ms
 ✓ tests/format.test.ts (24 tests) 32ms
 ✓ tests/undo.test.ts (6 tests) 9ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/wizard.test.ts (6 tests) 9ms
 ✓ tests/form.test.ts (4 tests) 26ms
 ✓ tests/book.test.ts (52 tests) 50ms
 ✓ tests/overrides.test.ts (19 tests) 117ms
 ✓ tests/layout.test.ts (49 tests) 202ms
 ✓ tests/mapedit.test.ts (14 tests) 101ms

 Test Files  13 passed (13)
      Tests  211 passed (211)
   Start at  21:37:01
   Duration  1.42s (transform 1.61s, setup 0ms, collect 4.41s, tests 601ms, environment 4ms, prepare 4.07s)
```

## Screenshot verification

Temporary verification captures (not repository files):

- `C:\tmp\session26-screen.png`
- `C:\tmp\session26-print.png`

A dedicated Playwright check passed all of the following in installed Chrome:

1. Clicked `+ Note`, confirmed the placeholder, typed and blurred to create
   exactly one note, dragged it, deleted it with ×, and used Undo to restore it.
2. Replaced the text with a long annotation and verified multiple
   layout-owned wrapped lines at the fixed note width.
3. Rendered account tag `est.` and need tag `goal` in muted italic. With a
   non-null draw value, the runway and gap captions remained present and were
   derived from the unchanged numeric fields.
4. Emulated print media and verified the note and both tags were present while
   note-delete, arrow-editor, and resize chrome counts were zero.

Both captures were visually inspected. The screen capture shows the free note
above the map shapes, readable fixed-width wrapping, and the floating `+ Note`
control. The print capture contains the same annotation/tags with no screen
chrome.

## Deviations and observations

- `src/App.tsx` and `src/ui/MapTextEditor.tsx` were touched although they were
  omitted from the Session 26 touch list. This was necessary because Session
  11's in-place editor state and the Session 25 floating control cluster are
  owned by those files. The changes are limited to launching and committing
  note text plus independent undo boundaries for map gestures.
- No dependencies were added. Playwright was used only from npm's temporary
  cache for screenshot verification and did not change `package.json` or
  `package-lock.json`.
- Browser verification found and fixed two interaction issues before the final
  gates: notes initially sat below account hit targets, and rapid drag/delete
  actions could share a history step. Notes now render on the annotation layer
  and each map action commits with a non-coalescing history boundary.
- Nothing outside Session 26 was implemented.
