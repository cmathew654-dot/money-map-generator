# SESSION-10B — Done-panel header padding (review catch)

Read `AGENTS.md` first. One cosmetic defect from the SESSION-10 review.
CSS-only. DO NOT PUSH.

## The defect

The wizard's mid-flow view is `form.client-form.wizard`, so its header gets
`.client-form`'s 20px side padding. The done panel is `div.wizard.wizard-done`
(no `client-form`), so the header SESSION-10 added there — step-count line +
`.wizard-progress` buttons — sits flush against the pane edges: "STEP 5 OF 5"
touches the left edge and the Footnotes step label nearly clips at the right.

## The fix

In `src/styles/app.css` only: give the done panel the same horizontal inset
as the mid-flow wizard so the step-count line, step buttons, and the
header's bottom hairline align exactly between the two views. Do not double
up with `.wizard-done-content`'s existing 20px side padding — the finish
content ("The map is ready.", Print/Export pair, secondary actions) must
keep its current alignment. Match the narrow-viewport rule too: at
`max-width: 900px` `.client-form` drops to 14px side padding; the done
panel must follow.

No markup changes, no behavior changes, no motion changes.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- One screenshot pair: mid-flow wizard vs finish panel at 1600×1000 —
  header left edges aligned, no label touching a pane edge.
- File map: `src/styles/app.css`. Budget ≤ 20 changed lines.
- Commit; end with `docs/codex/SESSION-10B-REPORT.md`.
