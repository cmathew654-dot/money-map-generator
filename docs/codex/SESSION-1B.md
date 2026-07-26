# SESSION-1B — Visual punch list on the SESSION-1 render

Read `AGENTS.md` first. This is a small, surgical session on the existing
code (HEAD after SESSION-1). Fix exactly the four defects below — no
refactors, no new files except the report. An orchestrator screenshot review
of the rendered sample found these; tests were green, which means the current
tests cannot see them, so where a fix changes geometry, extend
`tests/layout.test.ts` to pin the corrected behavior.

## P1 — Waterfall arc collides with the cash drum (worst defect)

The `afterTax → shortTerm` waterfall arc currently passes through/behind the
`Cash at Bank` cylinder (the center column's top slot), and its arrowhead
lands cramped in the 28px gap between the cash drum's bottom and the
short-term drum's cap. It visually reads as "cash flows into the IRA".

Fix in `src/layout/layout.ts`:
- A waterfall arc must clear EVERY account whose column lies horizontally
  between (and including) the source and target columns: set the bezier
  control-point height to `min(top y of all such accounts) − 80`.
- Land waterfall arrows at the target's top at `x + w·0.35` (not 0.65) when
  approaching from the right, so the arrowhead hits the cap's clear left
  shoulder instead of the slot gap below another drum.
- The arrowhead must terminate ON the target cap (`y − 4`), never inside a
  column gap.
- Pin with a test: for the Whitfield sample, the `afterTax → shortTerm`
  arrow's path apex y is above (numerically less than) the cash account's
  top y, and its endpoint x is within the short-term drum's left half.

## P2 — Sub-account label strikes through the inset cap ellipse

In the IRA's inset sub-account drum, the label text sits on the dashed cap
ellipse line. In `src/render/MapSvg.tsx`, start the sub-account's text block
below its cap: first baseline ≥ inset cap center + capRy + 14. Same rule as
the parent drum. Verify no glyph crosses the dashed ellipse at default size.

## P3 — Hollow drums / dead vertical space

- Cylinders whose content is only tag + title (+ blank value) — e.g.
  `Cash at Bank` — currently get generous heights with empty middles.
  Content-light drums should compact: reduce the computed height so padding
  between content blocks is the same visual rhythm as content-rich drums
  (target: cash drum height ≈ 150–170 in the sample).
- For drums with a large height floor (short-term, min 250): distribute the
  slack evenly BETWEEN content blocks (tag/title/caption ‖ value) so the
  cluster reads centered, instead of pinning caption at top and value at
  bottom with a void between.

## P4 — Arrowhead crowding at the need card

- `asNeeded` arrow: terminate at the need card's right edge midpoint
  (`x + w + 6, y + h·0.45`) — currently it lands high, near the income
  arrow's landing.
- `income` arrow: keep start at income panel bottom-center and land at need
  card top-center exactly.
- Seat the `Monthly Income as Needed` chip ON the asNeeded line (line passes
  under the chip's vertical center), roughly 40% along it, not floating
  above.

## Gates & report

`npm run build` + `npm test` green (quote outputs). Take your own screenshot
check if your environment allows; otherwise state you could not. Commit in
small steps. Write `docs/codex/SESSION-1B-REPORT.md` (brief: per-item what
changed, gate output, any deviation).
