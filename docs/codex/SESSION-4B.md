# SESSION-4B — One regression from SESSION-4: as-needed chip/line vs income panel

Read `AGENTS.md` first. Single surgical item; orchestrator screenshots show
it on ALL THREE samples.

## The defect

Since short-term moved to the top of the center column, the `asNeeded`
arrow starts higher and its label chip (anchored ~40% along the line) now
sits ON the income panel's bottom-right corner (Whitfield, Calloway,
Venkat). In Venkat the dashed line itself also clips that corner. The
SESSION-3B clearance rule only treated ACCOUNTS as obstacles.

## The fix (`src/layout/layout.ts`)

Define the obstacle set for the asNeeded arrow as: the income panel box,
the need card box, and every placed account/note box.

1. **Line:** if the asNeeded segment intersects any obstacle box, lower its
   start anchor down the short-term drum's left edge — step the start-y
   fraction from 0.72h toward 0.95h in 0.05 increments until the segment
   clears all obstacles (keep the existing end anchor on the need card's
   right edge). Deterministic, no randomness.
2. **Chip:** anchor search along the line — start at t=0.40, then try
   t ± 0.05 steps within [0.15, 0.80]; pick the first t where the chip box
   (260×34 + 10px clearance) clears ALL obstacles. If no t clears, offset
   the chip perpendicular to the line (upward normal) in 8px steps until
   clear.

## Tests (`tests/layout.test.ts`)

Extend the SESSION-3B clearance test into a loop over SAMPLE_WHITFIELD,
SAMPLE_CALLOWAY, SAMPLE_VENKAT and blankClient():
- chip box (260×34 + 10px) intersects no account box, not the income box,
  not the need box;
- the asNeeded segment intersects neither the income panel nor any account
  box (segment–rect intersection helper is fine to add in the test file or
  layout.ts).

## Gates & report

`npm run build` + `npm test` green (quote). Screenshot-verify all three
samples at default zoom; confirm chip and line clear the income panel.
Commit; write `docs/codex/SESSION-4B-REPORT.md`. Budget ≈ 60–140 lines.
