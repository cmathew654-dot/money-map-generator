# SESSION-2 Report

Date: 2026-07-26

## What was built

- `src/model/book.ts` adds immutable book creation, add, duplicate, delete,
  update, and validated JSON parsing. New and duplicated clients receive fresh
  client/account ids, and deletion can never leave an empty book.
- `src/form/Form.tsx` adds the complete controlled editor in map reading order:
  client metadata, income, accounts with nested positions/sub-accounts, and
  footnotes. Money inputs preserve `null` blanks and switch between raw focused
  input and formatted blurred display.
- `src/export/export.ts` adds JSON download and file loading through
  `parseBook`.
- `src/App.tsx` now owns the practice book and active-client state, restores and
  debounces autosave through localStorage, implements all header actions, and
  connects the form to the live SVG preview.
- `src/styles/app.css` adds the quiet header, independently scrolling 400px
  form pane, scaled preview ground, form controls, focus treatment, and
  bucket-colored account edges.
- `tests/book.test.ts` covers every book operation plus valid parsing and the
  requested invalid JSON/file-type/version/clients cases.
- `.gitignore` now ignores `tsconfig.tsbuildinfo`.

No dependency was added. The protected layout, renderer, tokens, and existing
tests were not changed.

## File-by-file LOC

| File | LOC | Change |
| --- | ---: | --- |
| `.gitignore` | 4 | Ignore TypeScript build metadata |
| `src/model/book.ts` | 135 | Pure book operations and parsing |
| `src/form/Form.tsx` | 574 | Complete controlled client form |
| `src/export/export.ts` | 20 | Save/load JSON helpers |
| `src/App.tsx` | 143 | Book state owner and two-pane shell |
| `src/styles/app.css` | 391 | Header, panes, preview, and form styles |
| `tests/book.test.ts` | 122 | Book-operation and parser tests |

`src/form/Form.tsx` is 574 LOC, above the prompt's ~450 LOC reporting
threshold. Session changes total 1,318 added and 8 removed lines, exceeding
the approximate 650–900 new-line budget. The complete nested form and its
explicit styling accounted for the overrun; they were kept in the specified
single files instead of compressing the implementation or creating files
outside the session map.

## Required gates

### `npm run build`

Final run against implementation commit `fd160c1`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 38 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                  0.41 kB │ gzip:  0.27 kB
dist/assets/index-BFIL-lZV.css   4.86 kB │ gzip:  1.68 kB
dist/assets/index-j9eR0q_q.js  219.17 kB │ gzip: 68.52 kB
✓ built in 601ms
```

Result: green.

### `npm test`

Final run against implementation commit `fd160c1`:

```text
> money-map-generator@0.1.0 test
> vitest run

 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (7 tests) 22ms
 ✓ tests/book.test.ts (12 tests) 6ms
 ✓ tests/layout.test.ts (10 tests) 7ms

 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  14:43:57
   Duration  691ms (transform 134ms, setup 0ms, collect 350ms, tests 35ms, environment 0ms, prepare 332ms)
```

Result: green.

## Dev-server browser check

The app was exercised through the Vite dev server in headless Chrome at
1440×1000:

- Editing the first client's title to `Session 2 Live` immediately changed the
  SVG accessible title.
- Clicking `+ Add account` increased rendered map accounts from 6 to 7.
- After the 400ms autosave window, a full browser reload retained both the
  edited title and seventh account.
- `Save book` downloaded `money-map-book.json` with the current state. After a
  temporary title edit, loading that downloaded file restored SVG markup
  identical to the pre-save map.
- The screenshot was visually inspected for header/pane sizing, map scaling,
  form legibility, and scrolling. A slight income-row horizontal overflow was
  found, fixed, and the complete browser check rerun green. The final screenshot
  remains in `C:\tmp\session2-ui.png`, outside the repository.

## Commits

```text
fd160c1 Build live client editor and preview workspace
825025b Add client book operations and JSON transfer
```

No remote was added and nothing was pushed.

## Deviations and notes

- No functional scope deviations and no dependencies added.
- The LOC budget and `Form.tsx` threshold were exceeded as disclosed above.
- The first sandboxed browser attempt could not start Vite, and a later helper
  attempt exposed process-cleanup behavior. The helper was corrected, its exact
  orphaned test server was stopped, and the final browser workflow ran cleanly
  multiple times.

## Noticed but not done

- Print and PNG export remain deferred to the next session as specified.
