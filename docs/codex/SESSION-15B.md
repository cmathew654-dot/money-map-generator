# SESSION-15B — The rect shape becomes a document (review catch)

Read `AGENTS.md` first. Owner finding: at glyph and map size, `card`
(radius 12) and `rect` (radius 2) read as the same shape. Replace the
rect SILHOUETTE with a genuinely distinct one. DO NOT PUSH.

## The change

- The stored enum value stays `rect` (books already saved with it keep
  working, no migration). Its rendering, glyph, and label change to a
  DOCUMENT: a rectangle with a folded top-right corner (dog-ear) —
  corner clip ≈ 20 units at base account width, scaling with the account
  box; draw the fold's diagonal line inside, same 2.5px stroke and
  bucket tint/dash treatment; tag/title/value/caption hierarchy
  unchanged.
- `src/layout/layout.ts`: the `rect` outline parameterization follows the
  new boundary (the clipped corner is part of the outline) so arrow
  anchors land on the real silhouette.
- `src/form/Form.tsx` + map flip control: glyph becomes a tiny dog-eared
  document; `aria-label` becomes `Document shape`. Cycle order stays
  drum → card → rect(document) → pill.
- Tests: update any rect-outline anchor assertions to the clipped-corner
  boundary; add/adjust nothing else.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Screenshots: (1) one account as document on the map — fold visible,
  clearly distinct from card at default zoom; (2) the four glyphs in the
  segmented control — four distinguishable silhouettes; (3) an arrow
  attached to a document account.
- File map: `src/render/MapSvg.tsx`, `src/layout/layout.ts`,
  `src/form/Form.tsx`, `src/styles/app.css` (if needed),
  `tests/layout.test.ts`. Budget ≤ 160 changed lines.
- Commit; end with `docs/codex/SESSION-15B-REPORT.md`.
