# SESSION-25 Report — View conveniences

## What was built

- Added ephemeral map zoom state in `App.tsx`, with a 50%–200% range,
  10-point steps, a measured percentage readout, and Fit as the default.
  Fixed zoom sizes only the displayed SVG; the 1320 × 1020 viewBox and map
  layout geometry do not change. Oversized maps pan through the map
  scroller.
- Reset zoom to Fit whenever the active client changes. Zoom is not written
  to the book, localStorage, connected files, or layout overrides.
- Added bottom-right screen chrome containing `−`, the percentage readout,
  `+`, `Fit`, and `+ Shape`. It is outside the PNG/print render tree and is
  not mounted during Present.
- Reversed Session 17's edit-while-presenting behavior. Present now passes
  no edit callbacks to `MapSvg`, exactly like the print/PNG render path.
  There are no editable text targets, drag/resize/rotate handlers, connect
  targets, arrow editor nodes, delete chips, highlight halo, or text editor.
  Pointer events and text selection are also disabled on the presented SVG.
  Existing fullscreen and Escape-to-exit behavior remain intact.
- Centralized the seven bucket defaults in `book.ts`. The form presets and
  map quick-add now share the same explicit shape and waterfall values.
- Added a seven-chip `+ Shape` popover using the existing account-preset
  chip styling. Escape, outside click/focus, and successful selection close
  it.
- Added a model helper that appends exactly one blank account with a fresh
  id, empty label, `null` value, no caption, and the shared bucket defaults.
  Quick-add commits one isolated Undo step, leaves the form in place, and
  immediately focuses the new account's in-place label editor.

## File-by-file LOC

| File | Physical LOC | Change |
| --- | ---: | --- |
| `src/App.tsx` | 1,054 | Owns zoom/popover state, client reset, Present routing, quick-add commit/focus, and view chrome. |
| `src/model/book.ts` | 425 | Defines shared bucket defaults, form presets, blank-account creation, and append helper. |
| `src/form/Form.tsx` | 1,020 | Imports the shared account presets instead of maintaining a duplicate table. |
| `src/styles/app.css` | 1,475 | Adds scroll-stage, zoom, quick-add/popover, and Present pointer-inert styling. |
| `tests/book.test.ts` | 409 | Pins all seven defaults and covers blank creation/append identity. |
| `tests/mapedit.test.ts` | 179 | Asserts the noninteractive SVG emits zero editor chrome nodes. |
| `docs/codex/SESSION-25-REPORT.md` | 175 | Records implementation, browser evidence, gates, commits, and deviations. |

`App.tsx`, `book.ts`, `Form.tsx`, `app.css`, and `book.test.ts` are above the
repository's approximate 400-LOC reporting threshold. They were not split
because Session 25 maps the work to these existing files and permits no new
implementation file.

No implementation file outside the Session 25 file map was changed. This
report is the prompt-required documentation file.

## Tests added

- The shared helper returns the pinned bucket, explicit default shape, and
  `inWaterfall` value for Short-Term, After-Tax, Tax-Deferred,
  Tax-Preferred, Charitable, Cash, and Note, and every form preset matches
  those values.
- Blank Cash accounts have fresh `account-…` ids, an empty label, `null`
  value, drum shape, no caption, and do not participate in the waterfall.
- Append adds exactly one blank Note card, preserves the original client and
  account array, and retains every existing account object by reference.
- A callback-free `MapSvg` contains no interactive class, editable text,
  connect targets, resize/rotate/shape/connect handles, arrow editor
  handles, or delete chip. The interactive path retains those nodes.

## Browser verification and screenshots

Method: served the final production build and drove a fresh, isolated
headless Microsoft Edge profile at 1440 × 1000, device scale factor 1.
The server and browser processes were stopped after the run. The temporary
driver, screenshots, and browser profiles remain outside the repository
under `C:\tmp`.

- The bottom-right cluster was visible in normal screen mode. Fit measured
  74% at this viewport (972 px map within a 1,020 px scroller).
- At exactly 150%, the SVG measured 1,980 px. The scroller measured 1,005 px
  wide with a 2,028 px scroll width, and both axes could pan normally. Text
  remained crisp under visual inspection.
- Fit restored the map to 972 px and removed horizontal overflow.
- Present mounted no cluster, had no `map-interactive` class, emitted zero
  editor chrome nodes, zero `data-connect-id` nodes, and zero text editors.
  A pointer drag over a drum left its transform unchanged and produced no
  text selection or edit overlay. Escape exited Present.
- The `+ Shape` popover displayed exactly seven chips: Short-Term, Trust,
  IRA, Roth, Cash, Charitable, and Note.
- Choosing Cash changed the live account count from six to seven, rendered
  a blank Cash drum with `~$ ______`, and focused the in-place account-label
  editor. `Meeting Cash` was typed but not committed for the screenshot.
- Print emulation hid the workspace, cluster, and popover; displayed one
  callback-free print SVG; and preserved the map composition independently
  of screen zoom.

| State | Screenshot | SHA-256 |
| --- | --- | --- |
| 150% zoom with scrollbars | `C:\tmp\session25-screens-2\01-zoom-150.png` | `fb09da92d46d4dc1701b272ac9f320588ab592ff4241023fb03623ff2683b321` |
| Fit restored | `C:\tmp\session25-screens-2\02-fit.png` | `032289f08a4bc91d805eaa5b3d4e0fc64f89786d377e6c06360b33de1a1c66f0` |
| Read-only Present | `C:\tmp\session25-screens-2\03-present-readonly.png` | `3b42ab02c88ab1f6ca06ca54b5ca17d89833d44a91acfd3ff1d21c15e7520123` |
| Seven-chip shape popover | `C:\tmp\session25-screens-2\04-shape-popover.png` | `157a99a0a66f697b890a1c503d774ac653a818c01b1bf8c13bb20b41a2ecd277` |
| Blank Cash in-place edit | `C:\tmp\session25-screens-2\05-cash-inline-edit.png` | `03ec3edb72fb492a89e6498ddab62bfa1f35d8b6ea7b43d7061dcfb0e93c0a22` |
| Print emulation | `C:\tmp\session25-screens-2\06-print.png` | `e2390fbc451041051d345570f30a003066511f59f62dda2af5f96a0652a3824b` |

## Gate outputs

The final gates were run against implementation commit `d3d21d7`.
The first sandboxed build attempt during implementation could not read the
parent path needed by Vite; all successful build runs, including the final
gate below, used the approved build permission.

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
dist/assets/index-B5xN0KuM.css                             20.61 kB │ gzip:  4.88 kB
dist/assets/index-Ck8ZMKTd.js                             281.14 kB │ gzip: 88.32 kB
✓ built in 1.63s
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/money-map-generator

 ✓ tests/textfit.test.ts (5 tests) 18ms
 ✓ tests/format.test.ts (24 tests) 43ms
 ✓ tests/contrast.test.ts (10 tests) 9ms
 ✓ tests/filestore.test.ts (3 tests) 7ms
 ✓ tests/undo.test.ts (6 tests) 11ms
 ✓ tests/math.test.ts (16 tests) 40ms
 ✓ tests/export.test.ts (3 tests) 7ms
 ✓ tests/book.test.ts (44 tests) 51ms
 ✓ tests/wizard.test.ts (6 tests) 12ms
 ✓ tests/form.test.ts (4 tests) 39ms
 ✓ tests/overrides.test.ts (19 tests) 116ms
 ✓ tests/layout.test.ts (47 tests) 294ms
 ✓ tests/mapedit.test.ts (12 tests) 157ms

 Test Files  13 passed (13)
      Tests  199 passed (199)
   Start at  21:09:39
   Duration  1.92s (transform 1.99s, setup 0ms, collect 6.26s, tests 805ms, environment 5ms, prepare 4.60s)
```

## Commits

- `0a569a0` — `Centralize account bucket defaults`
- `d3d21d7` — `Add map view controls and read-only present mode`

## Deviations and not done

- The implementation diff is 591 touched lines: 493 insertions and 98
  deletions. This is 241 lines above the prompt's approximate 200–350
  changed-line budget.
- `App.tsx` accounts for 214 touched lines (187 insertions and 27 deletions),
  above the prompt's approximate 60-line target. The additional lines keep
  the controls outside the scroll layer, measure the current Fit percentage,
  make Present structurally noninteractive, close the popover correctly, and
  focus the newly laid-out SVG label without opening or scrolling the form.
- No dependencies were added, no layout/text content was changed, no extra
  repository files were created, and no v2 candidates were identified.
- No push or remote change was performed.
