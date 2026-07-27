# SESSION-13 — Arrows that route intelligently and drag directly

Read `AGENTS.md` first. Owner-declared DEALBREAKER from live dogfooding
(screen recording reviewed): with elements now user-positionable, arrow
routing still assumes the generated composition. Two failures observed:
(1) the as-needed arrowhead ALWAYS enters pointing straight down at the
need card's right edge because the quadratic control is pinned to
`x: end.x` — wherever the drum sits, the final tangent is vertical;
(2) start/end anchors are hard-coded (drum underside → need right edge at
0.45h), so user placements produce hooks, edge-hugging, and corner-stabs.
Two workstreams. DO NOT PUSH.

## P1 — Relative-geometry smart routing (default, all arrow kinds)

In `src/layout/layout.ts`, replace fixed-anchor arrow construction with
routing derived from where source and target ACTUALLY are:

- Anchor selection: attach each end on the boundary point of its element
  facing the other element — parameterize each element's outline (drums:
  cap top arc, sides, bottom arc; cards/panels: the four edges) and pick
  the point nearest the source→target center line. The income arrow, the
  waterfall arcs, and the as-needed arrow all use this.
- Path: quadratic with the control placed PERPENDICULAR to the chord at
  its midpoint (a bow of ~12–18% of chord length; waterfall keeps its
  bead style, asNeeded keeps `7 6` dashes, income stays solid). The final
  tangent therefore approaches along the chord direction — the arrowhead
  enters facing the element from wherever the line actually comes.
  NEVER pin control x/y to an anchor coordinate.
- Obstacle handling: reuse the sampled-quadratic clearance — try bow one
  side, then the other, then increase bow magnitude stepwise; on
  exhaustion take the least-bad candidate (happy path, no routing maze).
- Waterfall arcs between stacked columns in the GENERATED layout must
  still look like today's maps: for unmoved compositions the chosen
  anchors/bows must reproduce cap-top-to-cap-top arcs (add a test pinning
  this on SAMPLE_WHITFIELD with no overrides: arrow endpoints on cap
  zones, apex above both caps). The masthead clamp and all existing rule
  assertions stay.
- Chip placement logic rides the new curve unchanged (t-search + delta
  override still apply).

## P2 — Draggable arrows

- New override keys in the existing `layoutOverrides` record:
  `arrow:asNeeded`, `arrow:income`, `arrow:waterfall:<sourceAccountId>`,
  with `{ bow?: number; startT?: number; endT?: number }`:
  - `bow`: signed perpendicular midpoint offset in artboard units,
    replacing the default bow. Dragging anywhere along the line (not on
    its handles) adjusts it live.
  - `startT` / `endT`: normalized position (0..1) of the attachment point
    along the source/target element's parameterized outline. Dragging an
    endpoint handle slides the anchor AROUND the silhouette — the arrow
    can never detach from its element.
- Handles: on hover/focus of an arrow (fatten its hit area with an
  invisible wide stroke), show three small circular handles — start, mid,
  end — screen-only chrome in the interactive `MapSvg` instance, never in
  print/PNG. Pointer lifecycle, threshold, Escape-cancel, and single
  commit on release reuse the SESSION-12 drag machinery and
  `mapInteraction.ts` helpers.
- Element drags keep re-routing arrows live exactly as now; an arrow
  override composes with moved elements (t and bow are relative to the
  current endpoints/chord, so they survive element drags sensibly).
- Reset layout clears arrow overrides along with the rest (it already
  deletes the whole record — keep it that way).
- `tests/overrides.test.ts` + `tests/layout.test.ts`: anchor selection
  faces the counterpart element for cardinal placements (target above /
  below / left / right); final-tangent direction is within 45° of the
  chord at the arrowhead; bow/startT/endT overrides apply and clamp
  (t wraps or clamps at outline ends — pick one and test it); generated
  Whitfield still pins cap-top waterfall arcs; sampled clearance holds
  for all overridden samples.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Screenshot verification at default zoom: (1) generated Whitfield,
  Calloway, Venkat unchanged in character (waterfall arcs still cap-to-
  cap); (2) drum dragged far right and LEVEL with the need card — the
  as-needed arrow approaches horizontally, arrowhead facing left, no
  downward stab; (3) drum dragged BELOW the need card — arrow approaches
  from below, arrowhead facing up-left; (4) drag the arrow's midpoint —
  bow changes and commits; drag an endpoint around the drum silhouette —
  anchor slides, never detaches; (5) print emulation of an
  arrow-overridden state — arranged arrows render, zero handles.
- File map: `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/mapInteraction.ts`, `src/App.tsx`, `src/styles/app.css`,
  `src/model/types.ts` (only if the override type needs the new fields),
  `tests/layout.test.ts`, `tests/overrides.test.ts`.
- Commit in logical steps; end with `docs/codex/SESSION-13-REPORT.md`;
  budget ≈ 450–650 changed lines.
