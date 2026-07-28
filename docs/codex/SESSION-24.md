# SESSION-24 — Arrows you can draw yourself

Read `AGENTS.md` first. Dogfood round 3: "no where to add your own
arrows" · "how do the arrows generate" · "an arrow isn't created every
time an account is made." The generated arrows are semantic (Income,
Draw as needed, Refills) and stay fully automatic; this session adds
ADVISOR-DRAWN arrows between any two elements, plus one line of form
help so the automatic ones stop being mysterious. Owner constraint from
SESSION-13 stands: connections stay connections — an arrow, once made,
never detaches from its elements. DO NOT PUSH.

## P1 — Data model

- `MoneyMapData` gains `customArrows?: CustomArrow[]`;
  `CustomArrow = { id: string; sourceId: string; targetId: string }`
  where sourceId/targetId ∈ account id | `'income'` | `'need'`
  (top-level elements only; positions/sub-accounts are not endpoints).
  Absent in legacy books — valid unchanged, like `layoutOverrides`.
- `book.ts` `validateClient` accepts absent or a well-formed array
  (string id/sourceId/targetId) with the usual human-readable error on
  malformed data. `withFreshIds` gives duplicated clients fresh custom
  arrow ids AND remaps their endpoint account ids to the copies.
- Geometry overrides reuse the arrow override grammar under keys
  `arrow:custom:<id>` — `bow`, `startT`/`endT`, `startAt`/`endAt` all
  compose exactly as for generated arrows (S13/S19 machinery). Reset
  arrangement clears them like the rest; the CustomArrow records
  themselves are DATA and survive reset.

## P2 — Layout + render

- `Arrow['kind']` gains `'custom'`. For each record, route with the
  existing relative-geometry router between the two elements' outlines
  (facing anchors, sampled clearance, rotated silhouettes — all
  existing behavior). Missing endpoint (deleted account) → the record
  is dropped from layout output, never crashes; `deleteClient`-style
  cleanup is NOT required in data (dangling records are inert).
- Style: neutral ink (`INK`), solid, same stroke weight family as the
  income arrow, standard arrowhead, no label. The LEGEND is unchanged —
  it describes the three semantic kinds only. Custom arrows print and
  PNG-export exactly like other arrows (zero chrome).
- Hovering a custom arrow shows the standard three geometry handles
  (bow + both endpoints) PLUS a small × delete chip beside the
  midpoint. × deletes that record (one commit, undo restores it).
  Generated arrows never show ×.

## P3 — Creation interaction

- Hover/focus chrome on every account drum/card and the income panel
  and need card gains a small circular CONNECT handle at the shape's
  right-edge midpoint, ~22 units outside (sibling of the S19 rotate
  handle; classes like `map-connect-handle`, link/plug glyph, cursor
  `crosshair`).
- Drag from the handle: live preview line from the source outline to
  the pointer. Releasing OVER another eligible element creates the
  record via a pure helper and commits ONCE (undoable). Releasing over
  empty space, the source itself, or pressing Escape cancels with no
  commit. Same pointer lifecycle discipline as drag/resize/rotate
  (threshold, preview via local state only, one commit on release).
- A duplicate (same sourceId AND targetId as an existing record) is a
  no-op cancel. The reverse direction is a different arrow and allowed.
- Pure helpers in `mapInteraction.ts` / `book.ts` (e.g.
  `addCustomArrow(data, sourceId, targetId)` returning unchanged data
  for self/duplicate/unknown ids) so tests cover the rules without DOM.

## P4 — Explain the automatic arrows (form)

- The account checkbox "In refill chain" (Form.tsx ~:726-735) gains a
  muted help line: "Checked accounts link right-to-left with dotted
  Refills arrows. Income and Draw-as-needed arrows draw themselves."
  One sentence pair, `caption`-styled, both form modes (shared section).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — `book.test.ts`: customArrows validation (absent ok, malformed
  rejected with message), duplicate-client id/endpoint remapping;
  `mapedit.test.ts` (or book): addCustomArrow rules (self, duplicate,
  unknown id → unchanged; success appends with fresh id), delete helper;
  `layout.test.ts`: custom arrow anchors land on both elements'
  outlines (incl. one ROTATED endpoint), clearance sampling applies,
  `arrow:custom:<id>` bow/startAt/endAt overrides compose, dangling
  record dropped without throwing, legend-input unchanged.
- Screenshot verification: (1) connect handle visible in hover chrome;
  (2) a custom arrow drawn drum→drum, anchored on both silhouettes;
  (3) its endpoint dragged free (S19 offsets) and bowed; (4) × chip on
  hover, arrow deleted, then restored via undo; (5) print emulation —
  custom arrow present, zero chrome, legend unchanged; (6) the refill
  help line in the account card.
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/mapInteraction.ts`, `src/form/Form.tsx`,
  `src/styles/app.css`, `tests/book.test.ts`, `tests/layout.test.ts`,
  `tests/mapedit.test.ts`. Budget ≈ 450–650 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-24-REPORT.md`.
