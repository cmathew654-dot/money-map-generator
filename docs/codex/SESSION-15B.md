# SESSION-15B — The rect shape becomes a hexagon (review catch)

Read `AGENTS.md` first. Owner finding: at glyph and map size, `card`
(radius 12) and `rect` (radius 2) read as the same shape. Owner picked
the replacement silhouette: a flat-top HEXAGON. DO NOT PUSH.

## The change

- The stored enum value stays `rect` (books already saved with it keep
  working, no migration). Its rendering, glyph, and label change to a
  flat-top hexagon: horizontal top and bottom edges, angled corner cuts
  on the left and right (corner inset ≈ 22% of the box height, capped at
  ~34 units, scaling with the account box so resized accounts keep the
  proportion). Same 2.5px stroke, bucket tint/dash treatment, and
  tag/title/value/caption hierarchy — text stays within the inscribed
  width at the tag/caption rows (verify no overflow at base sizes).
- `src/layout/layout.ts`: the `rect` outline parameterization follows the
  six-sided boundary so arrow anchors land on the real silhouette,
  including the angled corners.
- `src/form/Form.tsx` + map flip control: glyph becomes a tiny flat-top
  hexagon; `aria-label` becomes `Hexagon shape`. Cycle order stays
  drum → card → rect(hexagon) → pill.
- Tests: update any rect-outline anchor assertions to the hexagonal
  boundary; add/adjust nothing else.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Screenshots: (1) one account as hexagon on the map — clearly distinct
  from card at default zoom, text hierarchy intact; (2) the four glyphs
  in the segmented control — four distinguishable silhouettes; (3) an
  arrow attached to a hexagon account, anchored on its boundary.
- File map: `src/render/MapSvg.tsx`, `src/layout/layout.ts`,
  `src/form/Form.tsx`, `src/styles/app.css` (if needed),
  `tests/layout.test.ts`. Budget ≤ 180 changed lines.
- Commit; end with `docs/codex/SESSION-15B-REPORT.md`.
