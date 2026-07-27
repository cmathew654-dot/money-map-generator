# SESSION-17 Report

## Built

### Book file connection

- Added `src/model/filestore.ts` as the browser boundary for the File System
  Access API and IndexedDB. It has no new dependency.
- Feature detection requires both `showSaveFilePicker` and
  `showOpenFilePicker`. When either is absent, all new file controls are
  omitted and the existing localStorage plus manual Save book / Load book
  paths are unchanged.
- Added `Keep in a file…` beside Save book. It creates
  `money-map-book.json` at the owner-selected location and writes the current
  book immediately using the same indented JSON representation as Save book.
- Added `Open existing` beside that action. The selected file is read through
  the existing `parseBook` validator. A valid file replaces the working book
  with existing Load book semantics; invalid or unreadable content shows a
  toast and leaves the working book unchanged.
- A connected file mirrors every committed book change after an 800 ms
  debounce. Writes are queued so an older slow write cannot overwrite a newer
  commit. The muted header status reports the file name and `Saving…` /
  `Saved`.
- A connected-file write failure disconnects the active mirror, retains the
  handle as a Reconnect option, keeps the localStorage copy, and shows a toast.
- The existing 400 ms localStorage mirror remains active whether or not a
  real file is connected. Manual Load book updates the same book state, so it
  is subsequently written to a connected file by the same autosave effect.
- The selected `FileSystemFileHandle` is stored directly in a raw IndexedDB
  object store. Startup only retrieves the handle; it never prompts.
- A returning session displays `Reconnect <name>`. The click requests
  read/write permission, validates and reads the file, then applies the pure
  file-wins rule. Permission denial, a missing file, or invalid content keeps
  the current local copy and reports the fallback with a toast.
- Disconnect stops file writes, removes the remembered handle from
  IndexedDB, and returns to localStorage-only operation.
- Exported pure `supportsFileStore()` and `resolveFileConnection()` decisions
  keep capability, file-wins, and fallback behavior testable without browser
  filesystem mocks.

### Present mode

- Added a `Present` header action. It switches the existing app shell into a
  non-persisted presentation state and requests fullscreen from that user
  gesture when the browser provides it.
- Present mode removes the header, form pane, and toast chrome. The existing
  interactive preview expands to the full viewport on the paper background,
  with the 1320:1020 map fitted by both available width and height and allowed
  to scale above its normal workspace maximum.
- The same interactive `MapSvg`, change callbacks, preview ref, map text
  editor, and history remain mounted. In-place edits, dragging, resizing,
  arrows, shape changes, undo, and redo therefore keep their existing live
  paths.
- `Esc` exits the mode. A `fullscreenchange` listener also restores the
  workspace when native fullscreen ends. Fullscreen rejection leaves the
  CSS presentation mode usable.
- The `Esc to exit` hint fades to transparent over three seconds.
- The separate print MapSvg and all print/PNG code were left untouched.

## Tests

- Added `tests/filestore.test.ts` with three pure tests covering:
  - supported only when both picker functions exist;
  - unsupported when either or both are absent;
  - a successful validated file winning over the local fallback;
  - read/validation failure retaining the exact local book and error.
- Existing suites remained green.

## Files

Physical LOC and changes relative to the owner-provided Session 17 spec commit
`de2e6e5`:

| File | LOC | SESSION-17 change |
| --- | ---: | ---: |
| `src/App.tsx` | 838 | +249 / -1 |
| `src/model/filestore.ts` | 168 | new |
| `src/styles/app.css` | 1,163 | +90 / -0 |
| `tests/filestore.test.ts` | 52 | new |
| `docs/codex/SESSION-17-REPORT.md` | 212 | new |

The implementation and test diff is 559 additions and 1 deletion: 560 touched
lines. This is 80 touched lines above the prompt's approximate 300–480 budget.
The additional lines are the raw IndexedDB transaction/handle types, guarded
write queue and fallback states, and the two complete UI modes; no extra
feature or file was added.

`App.tsx` and `app.css` remain above approximately 400 physical LOC. They were
not split because Session 17 explicitly assigns both integrations to those
existing files and keeps `App.tsx` as the single state owner.

`src/ui/Toast.tsx` was not changed because the existing message-only variant
supports every new success and fallback notice.

## Browser verification

Method: served the final production build locally and drove a fresh-profile
headless Google Chrome through the Chrome DevTools Protocol at 1600×1000.
Temporary browser profiles were created under `C:\tmp` and removed after each
run.

1. Supported and unsupported API paths:
   - Native headless Chromium reported both picker functions and rendered
     `Keep in a file…` plus `Open existing`.
   - A before-load override set both picker functions to `undefined`; after
     reload neither control rendered.
2. Present layout:
   - Before presenting, the header computed as `flex`, the form as `block`,
     and `.print-map` as `none`.
   - While presenting, the shell carried `is-presenting`; the header and form
     computed as `none`.
   - The preview measured exactly 1600×1000 against a 1600×1000 viewport, and
     the map's measured width and height both fit within the viewport.
   - The `Esc to exit` hint rendered.
3. Live edit while presenting:
   - Clicking the existing `Cash at Bank` editable label opened the
     `Edit account label` in-place editor.
   - Committing `Session 17 Present Edit` updated the visible map text while
     the shell remained in Present mode.
4. Exit:
   - Dispatching Escape removed `is-presenting`; the header returned to
     `flex` and the form returned to `block`.
5. Print in both modes:
   - Print emulation while presenting computed the header and workspace as
     `none` and `.print-map` as `grid`.
   - The same three values were `none`, `none`, and `grid` after returning to
     the normal workspace.

The native OS file-picker round trip, on-disk one-second autosave observation,
permission re-grant after a browser restart, and actual native fullscreen
transition could not be completed in the headless browser harness because
those surfaces require interactive browser/OS user gestures. They are not
claimed as verified. The browser did verify API-path rendering and all
headless-safe Present/print behavior; unit tests verify the pure file-wins and
fallback decisions.

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
✓ 51 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.47 kB │ gzip:  0.30 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-MyTLKZlZ.css                             15.86 kB │ gzip:  4.02 kB
dist/assets/index-Cru0htGh.js                             264.96 kB │ gzip: 83.17 kB
✓ built in 789ms
```

`npm test`:

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/format.test.ts (21 tests) 16ms
 ✓ tests/math.test.ts (16 tests) 25ms
 ✓ tests/undo.test.ts (6 tests) 8ms
 ✓ tests/contrast.test.ts (10 tests) 5ms
 ✓ tests/book.test.ts (27 tests) 18ms
 ✓ tests/mapedit.test.ts (7 tests) 7ms
 ✓ tests/filestore.test.ts (3 tests) 4ms
 ✓ tests/wizard.test.ts (6 tests) 9ms
 ✓ tests/overrides.test.ts (12 tests) 32ms
 ✓ tests/layout.test.ts (29 tests) 75ms
 ✓ tests/export.test.ts (3 tests) 2ms

 Test Files  11 passed (11)
      Tests  140 passed (140)
   Start at  14:42:56
   Duration  968ms (transform 1.62s, setup 0ms, collect 3.23s, tests 202ms, environment 3ms, prepare 1.27s)
```

## Commits

- `5696944` — Add file-backed book storage primitives
- `edc01db` — Connect book autosave and add present mode

This report is committed separately as the final Session 17 commit.

## Deviations and observations

- No dependencies were added, no remote was changed, and nothing was pushed.
- No file-map deviations.
- The implementation exceeded the approximate changed-line budget by 80
  touched lines, as detailed in Files.
- The interactive native-picker/reconnect and native-fullscreen browser
  checks remain unverified, as detailed in Browser verification.
- `npm.ps1` was blocked by the machine execution policy, and the first
  sandboxed Vite invocation could not read `vite.config.ts`. All required
  final gates were rerun via `npm.cmd` outside that managed restriction and
  passed.
- An initial Present edit probe supplied text to the first editable field,
  which was numeric and correctly did not render that text. The corrected
  probe targeted an editable account label and passed.
