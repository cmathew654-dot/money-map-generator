# SESSION-23B — Review catch: as-needed chip lands on a tall income panel

Read `AGENTS.md` first. One defect found in the SESSION-22/23 review
sweep, reproduced with pure layout (no overrides involved). DO NOT PUSH.

## The defect

A client with FIVE income sources (income panel h = 328, rect
x≈183 y=184 w=280 after centering) and a normal shortTerm/need pair
gets the "Monthly Income as Needed" chip placed at labelAt ≈ (173, 224)
— fully overlapping the income panel. Screen, print, and PNG all show
it. Reproduction: postNote client, incomeSources = 5 rows (amounts
2400/1900/null/null/null), afterTaxIncome 5900, monthlyNeed 15000,
asNeededAmount null, accounts = shortTerm w/ caption + cash + afterTax
+ taxDeferred (values as in the Whitfield sample), no layoutOverrides.

Root cause: `asNeededArrow` (layout.ts) routes the PATH around the
obstacle set `[income, need, ...accounts]` (the SESSION-4B contract),
but `labelAt` — the chip's center — is chosen without obstacle
awareness. `applyAsNeededChipOverride` only clamps the chip to
OVERRIDE_BOUNDS. SESSION-22's grow-to-fit heights made income panels
tall enough to sit under the default label point.

## The fix

- The DEFAULT chip placement must satisfy: the chip rect
  (AS_NEEDED_CHIP_WIDTH × AS_NEEDED_CHIP_HEIGHT centered on `labelAt`)
  intersects NO income panel, need card, or account shape. Prefer
  sliding the label point along the routed path (or nudging
  perpendicular to it) to the nearest clear position so the chip still
  reads as belonging to its arrow. Stay within OVERRIDE_BOUNDS.
- A user-dragged chip override remains free (user's choice wins,
  bounds-clamp only) — do not change override behavior.
- Do not change path routing, arrow anchors, or any SESSION-22 text
  metrics. This is a label-placement fix only.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- `tests/layout.test.ts`: pin the reproduction above — default chip
  rect does not intersect the income panel, need card, or any account,
  for BOTH the 5-income-row stress client and all three samples
  (samples guard against placement drift).
- Screenshot verification: the 5-income-row client on screen — chip
  clear of the panel, still visually attached to its arrow; print
  emulation unchanged elsewhere.
- File map — touch: `src/layout/layout.ts`, `tests/layout.test.ts`.
  Budget ≈ 40–120 changed lines.
- Commit; end with `docs/codex/SESSION-23B-REPORT.md`.
