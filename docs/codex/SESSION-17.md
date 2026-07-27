# SESSION-17 — The book as a real file + Present mode

Read `AGENTS.md` first. Two owner-approved workstreams. Explicit owner
constraint on P1: this is NOT import-and-generate — the file is the app's
OWN saved book (the exact JSON Save book already produces), auto-saved.
No map is ever synthesized from foreign data. DO NOT PUSH.

## P1 — Auto-save the book to a user-chosen file

- Feature-detect the File System Access API (`showSaveFilePicker` /
  `showOpenFilePicker`). When absent (Safari/Firefox), NOTHING changes —
  today's localStorage + manual Save/Load remain exactly as they are,
  and the new control simply does not render.
- New header action near Save book: **"Keep in a file…"** — lets the
  owner create a new `money-map-book.json` anywhere (Desktop, OneDrive,
  USB — their pick) or open an existing one. New file: current book is
  written to it immediately. Existing file: it is parsed with the SAME
  `parseBook` validation as Load book; on success it REPLACES the
  working book (this is Load book semantics, nothing new), on failure a
  toast and no change.
- While connected: every committed change auto-saves the full book JSON
  to the file, debounced ~800ms. A quiet header indicator shows the
  connected file name and Saved / Saving… state (muted text, no
  spinner). A small "Disconnect" affordance reverts to
  localStorage-only.
- Persist the file HANDLE in IndexedDB so a returning session can
  reconnect: on startup with a stored handle, show a quiet "Reconnect
  <name>" button (permission re-grant needs a user gesture — do not
  auto-prompt); clicking requests permission, reads the file, and file
  wins over localStorage when connected. If permission is denied or the
  file is gone, fall back to the localStorage copy with a toast — the
  user NEVER loses whichever copy exists.
- localStorage keeps mirroring the current state at all times (it is the
  crash/fallback copy). Manual Save book / Load book keep working; a
  manual Load while connected auto-saves the loaded book into the file.
- New file `src/model/filestore.ts`: thin wrapper for feature detection,
  handle storage (IndexedDB, no deps — raw indexedDB API), read/write,
  permission query. Keep every pure decision (when file wins, fallback
  rules) in exported pure functions so they are testable without the
  API; browser verification covers the real file round-trip.

## P2 — Present mode

- Header button **"Present"**: hides ALL chrome (header, form pane) —
  the map alone fills the window on its paper background, scaled up to
  fit. Requests browser fullscreen when available (graceful without).
  Esc exits (and exiting browser fullscreen exits the mode — listen to
  fullscreenchange). A small hint "Esc to exit" fades out after ~3s.
- The map stays FULLY LIVE in present mode: in-place editing, drag,
  resize, arrows, shapes, undo/redo all work — this is the
  turn-the-laptop-around meeting mode where blanks get filled with the
  client watching.
- Print/PNG and the print MapSvg are untouched. Mode is not persisted —
  reload always starts normal.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests: pure filestore decision rules (supported/unsupported, file-wins
  rule, fallback on failure); no DOM/FS mocking beyond what jsdom allows
  naturally.
- Browser verification: (1) create a book file on disk, edit a value —
  file content on disk updates within ~1s and matches the model; (2)
  reload, Reconnect, book restored FROM FILE; (3) unsupported-API path —
  control absent (verify via feature-flag override or user agent
  without the API); (4) Present mode — chrome gone, map fills screen,
  an in-place edit works while presenting, Esc restores the workspace;
  (5) print emulation unaffected in both modes.
- File map: `src/App.tsx`, `src/model/filestore.ts` (new),
  `src/styles/app.css`, `src/ui/Toast.tsx` (only if a variant is
  needed), `tests/filestore.test.ts` (new). Budget ≈ 300–480 changed
  lines.
- Commit in logical steps; end with `docs/codex/SESSION-17-REPORT.md`.
