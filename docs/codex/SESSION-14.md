# SESSION-14 — Wizard step order: accounts before need (dogfood catch)

Read `AGENTS.md` first. Owner finding: the Need step (monthly income need +
"draw from short-term bucket") currently comes BEFORE the Accounts step —
the draw question references a bucket that does not exist yet. Small,
focused session. DO NOT PUSH.

## The change

- `src/form/Wizard.tsx`: reorder `WIZARD_STEPS` to
  client → income → accounts → need → footnotes. Labels, titles, map
  targets, and step-jump behavior all ride the array order — no logic
  changes beyond the reorder. `wizardStepNumberForMapTarget` must keep
  working purely from the array (clicking the need card on the map now
  jumps to step 4, an account drum to step 3).
- `src/form/Form.tsx`: the full form's section order must match the new
  wizard order (accounts section before the need section) so the two
  views tell the same story. No section content changes.
- `tests/wizard.test.ts`: update the step-order and map-target-to-step
  assertions to the new order; keep all behavioral tests (click-to-jump,
  aria-current, done-panel exit) passing.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Screenshot verification: wizard on a fresh profile shows Accounts as
  step 3 and Need as step 4; map-click on the need card lands on step 4;
  full form shows accounts above need.
- File map: `src/form/Wizard.tsx`, `src/form/Form.tsx`,
  `tests/wizard.test.ts`. Budget ≤ 120 changed lines.
- Commit; end with `docs/codex/SESSION-14-REPORT.md`.
