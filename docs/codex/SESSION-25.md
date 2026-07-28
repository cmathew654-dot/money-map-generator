# SESSION-25 — View conveniences: zoom, read-only present, quick-add shape

Read `AGENTS.md` first. Dogfood round 3: "zoom button" · "i wouldn't add
any edit features during the present option" (owner has RULED: present
is fully read-only — this deliberately reverses SESSION-17's
edit-while-presenting) · "add a blank one?" (owner-interpreted:
quick-add an empty account shape from the map to sketch live in a
meeting). Three contained items, all view/chrome — no layout or text
changes. DO NOT PUSH.

## P1 — Zoom control

- A small floating control cluster in the map pane's bottom-right
  corner (screen only): − · percent readout · + · Fit. Zoom range
  50%–200% in comfortable steps (e.g. 10%); Fit returns to the current
  fit-to-pane behavior and is the default state.
- Zoom is EPHEMERAL VIEW STATE owned by `App.tsx` (per the one-state-
  owner rule): never stored in the book, localStorage, or overrides;
  reset to Fit on client switch. Zoomed content pans via normal
  scrolling of the map pane.
- The cluster is screen chrome: absent from print, PNG export, and
  Present mode. Zooming never changes artboard geometry — it is a
  scale on the displayed SVG only.

## P2 — Present mode is read-only

- While presenting: no in-place text editing, no drag/resize/rotate,
  no connect handles, no arrow handles or delete chips, no hover/focus
  editor chrome at all — reuse the existing noninteractive render path
  (the print/PNG one from prior sessions) rather than a second flag
  forest. Esc-to-exit and the existing fullscreen behavior unchanged.
- The zoom cluster is also hidden while presenting (the map already
  fills the screen).
- Undo/redo keyboard shortcuts may remain inert or active while
  presenting — but nothing on screen may change from pointer input.

## P3 — Quick-add a blank shape from the map

- A small "+ Shape" affordance beside the zoom cluster (same floating
  chrome, screen only). Clicking opens a compact popover of the seven
  bucket chips (reuse the account-preset chip styling from the form).
  Choosing one appends a BLANK account of that bucket to the active
  client: empty label (renders "<Bucket> · unnamed"), `value: null`
  (renders `~$ ______`), bucket-default shape and `inWaterfall`
  (matching the form presets), no caption. ONE commit, undoable.
- The map stays the focus (the form does not open or scroll); the new
  drum is immediately editable in place (SESSION-11 editing) and
  draggable. Escape or clicking elsewhere closes the popover without
  adding.
- Pure helper (e.g. `blankAccountFor(bucket)` in `book.ts` or reuse of
  the existing preset defaults) so the shape of the added account is
  unit-tested, not duplicated from Form presets — ONE source for
  bucket defaults shared by form chips and map quick-add.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests: the shared bucket-default helper returns the same defaults the
  form presets use (pin all seven buckets); quick-add appends exactly
  one blank account with fresh id and leaves existing accounts
  untouched; present/noninteractive render emits zero editor chrome
  nodes (extend the existing noninteractive assertions if present).
- Screenshot verification: (1) zoom cluster visible bottom-right;
  zoomed to 150% — text crisp, pan via scroll; (2) Fit restores; (3)
  Present mode — NO cluster, NO hover chrome on a drum, in-place edit
  click does nothing; (4) "+ Shape" popover with seven chips; a blank
  Cash drum added and immediately in-place-edited; (5) print emulation
  — no cluster, no popover, composition unchanged.
- File map — touch: `src/App.tsx` (zoom + popover state, ~60 lines max
  — it is far over the LOC guideline; say so per rule 7),
  `src/render/MapSvg.tsx` (only if the noninteractive path needs the
  present flag threaded), `src/model/book.ts` (shared bucket-default
  helper if placed there), `src/form/Form.tsx` (presets import the
  shared helper), `src/styles/app.css`, `tests/book.test.ts` or
  `tests/mapedit.test.ts`. Budget ≈ 200–350 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-25-REPORT.md`.
