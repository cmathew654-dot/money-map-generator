# SESSION-37B — Review catch: income width floor ignores scaled text

Read `AGENTS.md` first. Hotfix found by the owner on the live site.
DO NOT PUSH.

## The defect

SESSION-37 made the "After-Tax Income" label render at a size scaled
from the `income:total` role, but the income panel's minimum-width
floor (layout.ts ~:304-311) still measures the label at fixed
`TYPE.incomeTotalLabel`. With a raised total size the panel never
widens, and the left-anchored label collides with the right-anchored
amount ("After-Tax Incom$5,900").

## The fix

- The income width floor measures the total line at the EFFECTIVE
  sizes the renderer draws: scaled label width (totalFs × the S37
  label ratio) + a minimum 16-unit gap + the value width at totalFs
  (measure the actual formatted amount, not a constant) + the
  existing padding. One shared pure helper provides these effective
  sizes to BOTH layout and MapSvg — no more drift.
- Audit the header and row floor measurements the same way: every
  income text the renderer scales by a role must be measured at that
  scaled size in the floor. Fix any that use fixed tokens.
- If the floor exceeds a user-set override width, the floor wins
  (content never collides; the S22 doctrine).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests: floor grows when `text:income:total` fs is 30 (pin: scaled
  label width + gap + value width ≤ panel inner width, at defaults
  AND at 30, AND with a long six-digit value); header/row floor
  parity pins; shared-helper parity between layout and render
  (import the same function, pin its outputs).
- Screenshots: the exact owner scenario — total size stepped up on
  Whitfield — label and amount both larger, panel widened, no
  collision; print emulation clean.
- Redirect all browser output to files under C:\tmp; any free port.
- File map — touch: `src/layout/layout.ts`, `src/render/MapSvg.tsx`
  (consume the shared helper), `tests/layout.test.ts`,
  `tests/mapedit.test.ts` (only if pins live there). Budget ≈
  60–160 changed lines.
- Commit; end with `docs/codex/SESSION-37B-REPORT.md`.
