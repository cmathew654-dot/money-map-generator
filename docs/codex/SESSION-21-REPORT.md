# SESSION-21 Report

## Built

- Replaced the conditional `Reset layout` button with an always-rendered
  `Reset ▾` menu using the existing `Menu` component.
- Added `Reset arrangement`, preserving the existing confirmation, override
  removal, and `Layout reset` toast behavior. The item is disabled when the
  active client has no layout overrides.
- Added a danger-styled `Clear map…` item and a danger confirmation that names
  the active client, enumerates every removed field, says the client remains
  in the book, and promises one-step Undo. Cancel receives the dialog's
  default focus.
- Added pure `clearedClient(data)`. It preserves `id`, all client profile
  fields, and the optional `showMath` setting; empties accounts, income
  sources, and footnotes; nulls monthly need, draw amount, and after-tax
  income; and omits layout overrides.
- Clear commits through the normal snapshot/history path as a discrete,
  non-coalescing Undo step. It closes any map text editor, resets guided mode
  to Step 1/not done, leaves full-form mode selected, and shows
  `Map cleared — Undo brings it back`.
- Existing persistence, connected-file autosave, print, PNG, and book export
  paths consume the cleared client through the normal book state.

Implementation commit:

- `d80967f Add scoped reset menu and clear-map undo`

## Files

| File | Physical LOC | Change |
| --- | ---: | --- |
| `src/App.tsx` | 894 | Added the Reset menu, clear confirmation/commit flow, wizard reset, toast, and discrete Undo checkpoint. |
| `src/model/book.ts` | 320 | Added the pure `clearedClient` transformation. |
| `src/styles/app.css` | 1,295 | Right-aligned the Reset menu popover within the header. Existing menu danger/disabled styles were reused. |
| `tests/book.test.ts` | 282 | Added exact clear semantics, purity, blank-layout, and validator round-trip coverage. |

The implementation diff is 131 touched lines: 124 insertions and 7 deletions,
within the prompt's approximate 120–220 changed-line budget.

`App.tsx` and `app.css` are above approximately 400 physical LOC. They were
not split because the session file map prescribes these files and no new
implementation file was needed.

No repository implementation file outside the session file map was created
or changed. This report is the prompt-specified final documentation file.

## Browser verification

Method: served the final production build and drove a fresh-profile headless
Google Chrome through the Chrome DevTools Protocol at 1600×1000. DOM
assertions, screenshots, and manual visual inspection were used.

1. Opened `Reset ▾` on the clean first sample client. The menu showed exactly
   `Reset arrangement` and `Clear map…`; arrangement was disabled, and clear
   had the danger class and computed red `rgb(192, 58, 45)`.
2. Opened the clear confirmation. Its normalized copy was exactly:
   `Clear the map for Jordan & Dana Whitfield? This removes all accounts,
   income sources, monthly need, draw amount, after-tax income, footnotes, and
   arrangement. The client stays in your book. One Undo brings everything
   back.` The buttons were `Cancel` and `Clear map`, with `Cancel` focused.
3. Confirmed clear. The saved active client had empty accounts, income
   sources, and footnotes; all three dollar totals were `null`; no
   `layoutOverrides` property remained; the client title remained intact.
   The rendered account count changed from six to zero, guided mode showed
   `Step 1 of 5` / `Who is this map for?`, and the specified Undo toast was
   visible.
4. Sent Ctrl+Z. The rendered account count returned from zero to six and the
   complete original map, including the client title, was restored.

### Screenshots

| State | Screenshot | SHA-256 |
| --- | --- | --- |
| Reset menu, disabled clean arrangement, danger clear | `C:\tmp\session21-1-reset-menu.png` | `47a895d476e1662eb6297b0f9533fa71917f05b1e119dcc1074ee9faf11597eb` |
| Exact clear confirmation with Cancel focused | `C:\tmp\session21-2-clear-confirm.png` | `417b0aa14f563a11601c5d6609e08ba4584d14a44c9d1a3d00c5708a1ac6be93` |
| Cleared blank map at guided Step 1 | `C:\tmp\session21-3-cleared-map.png` | `a5c52c136a6c40c6a1604eb7cf3e5d6b15779432b443f1b3e845303403a649ae` |
| Full map restored by Ctrl+Z | `C:\tmp\session21-4-undo-restored.png` | `3cbb2d38102eac95e2f3a6e35e36f2112e6db0e8b331f3fba520584b9834b950` |

The screenshots and isolated Chrome profile remain outside the repository
under `C:\tmp`. The local browser and server processes were stopped.

## Tests added

- `clearedClient` preserves the client ID, title, year, variant,
  `postNoteLabel`, and explicit `showMath`.
- It empties accounts, income sources, and footnotes; nulls monthly need,
  draw amount, and after-tax income; and removes arrangement without mutating
  the source.
- A cleared sample client passes `layoutMap` without throwing.
- A book containing a cleared client round-trips `parseBook`.

## Gates

The final gates were run against the exact implementation tree committed as
`d80967f`. Windows PowerShell blocks the `npm.ps1` shim on this machine, so
the same package scripts were invoked through `npm.cmd`. The restricted
filesystem sandbox prevented esbuild from reading the Vite configuration;
the quoted successful build used the approved unsandboxed command.

`npm run build`:

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 52 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                            0.47 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2  26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2  28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2     52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2     53.73 kB
dist/assets/index-BGsEx9XO.css                            17.74 kB │ gzip:  4.37 kB
dist/assets/index-4TqX85vh.js                            270.23 kB │ gzip: 85.01 kB
✓ built in 1.23s
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/contrast.test.ts (10 tests) 9ms
 ✓ tests/math.test.ts (16 tests) 45ms
 ✓ tests/format.test.ts (21 tests) 56ms
 ✓ tests/filestore.test.ts (3 tests) 9ms
 ✓ tests/undo.test.ts (6 tests) 14ms
 ✓ tests/export.test.ts (3 tests) 6ms
 ✓ tests/book.test.ts (29 tests) 45ms
 ✓ tests/mapedit.test.ts (7 tests) 11ms
 ✓ tests/overrides.test.ts (19 tests) 89ms
 ✓ tests/layout.test.ts (31 tests) 127ms
 ✓ tests/wizard.test.ts (6 tests) 15ms

 Test Files  11 passed (11)
      Tests  151 passed (151)
   Start at  16:52:46
   Duration  1.64s (transform 1.55s, setup 0ms, collect 4.70s, tests 425ms, environment 5ms, prepare 4.31s)
```

## Deviations and not done

- No Session 21 prompt deviations.
- The superseded, untracked `docs/codex/SESSION-20.md` was not read, edited,
  staged, or committed.
