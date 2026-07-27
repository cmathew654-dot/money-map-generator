# SESSION-19 — Free rotation + arrow endpoints unlocked from the outline

Read `AGENTS.md` first. Two owner asks from live dogfooding, both riding
the existing override mechanism. Owner constraint, verbatim intent: do
not break underlying logic or create a mess — connections stay
connections. DO NOT PUSH.

## P1 — Free rotation of account shapes

- `LayoutOverride` gains `rot?: number` (degrees, stored mod 360,
  finite-validated in `book.ts` like the other fields). Applies to
  ACCOUNT elements only — income panel, need card, and the chip stay
  upright.
- Render: the account's group rotates around its box center
  (`rotate(rot cx cy)`); text rotates with the shape (whole-glyph
  rotation is intended). Sub-account insets rotate with the parent.
- Interaction: hover/focus chrome gains a small circular ROTATE handle
  centered ~22 units above the shape's top edge. Dragging orbits the
  pointer around the shape center; free angle with a soft magnetic snap
  to every 15° multiple within ±3°. Same pointer lifecycle as drag /
  resize (threshold, live preview, Escape cancels, one commit on
  release, undo/redo cover it). Cursor: `grab`/`grabbing`.
- Layout: clamping uses the ROTATED bounding box against the page
  margins / masthead rule. Arrows anchor on the ROTATED silhouette:
  compute the shape outline in local space, rotate the parameterized
  points around the center, then run the existing facing-anchor and
  sampled-clearance logic unchanged.
- In-place text editing on a rotated shape: the overlay input remains
  screen-aligned (horizontal) positioned over the clicked text's screen
  rect — acceptable and stated, not a defect.
- Reset layout clears rotation with everything else (it already deletes
  the record).

## P2 — Arrow endpoints unlocked (connection preserved)

- Arrow overrides gain `startAt?: {dx,dy}` and `endAt?: {dx,dy}` —
  FREE endpoint positions stored as offsets from the connected element's
  BOX CENTER in artboard axes (deliberately NOT rotated with the
  element — predictable). When present they take precedence over
  `startT`/`endT`; old books with t-values keep working unchanged.
- Dragging an endpoint handle now places it anywhere (no outline
  projection). The connection itself NEVER changes — sourceId/targetId,
  legend, kind, dash grammar, chip logic all untouched; when the
  element is dragged or resized, the endpoint follows via its stored
  center offset.
- Default behavior with no override remains the smart facing-anchor
  routing — freedom only when a handle is grabbed.
- Bow (`bow`) composes with free endpoints exactly as with anchored
  ones (perpendicular to the current chord).
- Clamp free endpoints inside the page margins; sampled clearance still
  runs (it may fail to clear when the user forces a crossing — that is
  the user's choice; keep the least-bad candidate behavior).

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests (`tests/overrides.test.ts` / `tests/layout.test.ts`): rot
  applied + mod 360 + book validation; snap helper pure (free angle
  kept outside ±3°, snapped inside); anchors land on the rotated
  outline (cardinal cases at 45° and 90°); startAt/endAt precedence
  over t-values; endpoint follows a moved element via center offset;
  legacy t-only overrides unchanged.
- Screenshot verification: (1) a drum rotated ~30° — arrows attach on
  the rotated silhouette, text rotated, print shows it; (2) rotate
  handle visible in hover chrome; (3) an endpoint dragged into open
  space away from its drum — arrow renders from that free point,
  still styled/legended as its kind; then drag the DRUM and show the
  free endpoint following; (4) Reset restores everything; (5) print
  emulation — zero chrome, arrangements preserved.
- File map: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/mapInteraction.ts`, `src/styles/app.css`,
  `tests/overrides.test.ts`, `tests/layout.test.ts`.
  Budget ≈ 450–650 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-19-REPORT.md`.
