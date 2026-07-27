# SESSION-12 — Direct canvas manipulation: drag + resize with per-client overrides

Read `AGENTS.md` first. Owner-approved combined session (drag and resize
share one mechanism — build it once). The map becomes directly arrangeable
while staying a deterministic, still document underneath. DO NOT PUSH.

## The mechanism — per-client layout overrides

- `src/model/types.ts`: add to `MoneyMapData` an optional
  `layoutOverrides?: Record<string, LayoutOverride>` where
  `LayoutOverride = { dx?: number; dy?: number; w?: number; h?: number }`.
  Keys: account ids, plus the fixed strings `'income'`, `'need'`,
  `'asNeededChip'`. Absent field = no override. Old book files without the
  field must load unchanged (`src/model/book.ts` keeps backward compat).
- `src/layout/layout.ts` pipeline order (this ordering is the contract):
  1. base placements (unchanged),
  2. centering pass computed from the BASE layout only (so dragging one
     element never re-shifts the whole composition),
  3. apply overrides in final artboard units — `dx/dy` translate an
     element; `w/h` resize an account drum (min w 180, min h
     `MIN_ACCOUNT_HEIGHT`; `capRy` re-derives from the new `w` exactly as
     it does for base widths),
  4. arrows, as-needed chip auto-position, `contentBounds`, and
     `footnotesAt` all derive AFTER overrides, from the final positions —
     arrows re-attach to moved/resized drums automatically. The
     `'asNeededChip'` override is a delta on top of the auto chip spot.
  5. Clamp every override so no element leaves the 48-unit page margins
     or crosses the masthead rule (y=118).
- Stored deltas are exactly what the user dragged, in artboard units —
  stable across re-renders, no feedback loops.

## Drag

- On the interactive `MapSvg` only (the print/PNG instance renders none of
  this): pointerdown on a drum, note card, income panel, need card, or the
  as-needed chip starts a potential drag; a ≥4px movement threshold
  disambiguates from the existing click-to-navigate and click-to-edit,
  which must keep working exactly as they do now (editable text still wins
  on plain clicks).
- During drag: live preview via local component state (pointermove →
  translated element + re-derived arrows each frame is acceptable — the
  layout is cheap). Pointerup commits ONE override update into the model
  through the same `onChange`/`handleClientChange` path everything else
  uses. Escape during a drag cancels it (no commit).
- Screen px → artboard units via the SVG's CTM (`getScreenCTM().inverse()`
  or viewBox ratio) — must stay correct at any pane width.
- New file `src/render/mapInteraction.ts`: PURE helpers — px→unit
  conversion math, clamping, override merge (`withOverride(data, key,
  patch)`), drag-threshold logic. All testable without DOM.

## Resize

- Drums and note cards only (not income/need panels, not sub-account inset
  drums — out of scope, note in report if asked why). On hover/focus of a
  drum, show a small bottom-right corner handle (screen-only chrome,
  rendered in the interactive instance only, never in print/PNG).
- Dragging the handle sets `w`/`h` overrides with the clamps above; text
  layout inside the drum re-wraps as it already does for base sizes;
  position rows and sub-drums keep their existing width-relative math.
- Cursor affordances: `move` while dragging an element, `nwse-resize` on
  the handle.

## Reset

- A quiet "Reset layout" control in the map toolbar area (near
  Print/Export in the header), enabled only when the active client has any
  overrides: confirms via the existing `Dialog`, then clears
  `layoutOverrides` for the active client. Toast on completion (existing
  Toast).

## Persistence

- Overrides live inside the client object, so Save book / Load book and
  localStorage carry them with zero extra plumbing. `tests/book.test.ts`:
  round-trip a client with overrides; load a legacy book without the
  field.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests: `tests/overrides.test.ts` (new) — override application order
  (translate, resize, clamp), arrows attach to moved/resized drums
  (endpoints track the new geometry), chip delta, contentBounds/footnotes
  re-derive post-override, min-size clamps; keep every existing layout
  rule assertion passing unmodified.
- Screenshot verification at default zoom: (1) drag the Whitfield IRA drum
  ~80 units left/down — arrows follow, composition otherwise still;
  (2) resize the After-Tax trust wider — text re-wraps, arrows re-attach;
  (3) chip dragged clear of the income panel; (4) Reset layout restores
  the generated composition; (5) print emulation of the dragged state —
  the moved layout IS the artifact, but no handles/affordances render;
  (6) reload the page — dragged layout persists via localStorage.
- File map: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/mapInteraction.ts` (new), `src/App.tsx`,
  `src/styles/app.css`, `tests/overrides.test.ts` (new),
  `tests/book.test.ts`, `tests/layout.test.ts`.
- Commit in logical steps; end with `docs/codex/SESSION-12-REPORT.md`;
  budget ≈ 500–700 changed lines.
