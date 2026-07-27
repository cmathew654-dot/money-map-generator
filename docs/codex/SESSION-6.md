# SESSION-6 — Guided "help me fill it out" mode (default) + full-form toggle

Read `AGENTS.md` first. Owner direction, verbatim intent: the one-page form
is "too overwhelming" for some users. Default becomes a step-by-step guided
mode — a couple of related fields at a time, one category per step, with a
Next button — while the full form stays one toggle away. The live map on
the right keeps updating on every keystroke in BOTH modes; watching the map
build as you click Next IS the experience. No validation gates anywhere —
blanks stay legal (AGENTS.md rule 6), Next is always enabled.

## Files

```
src/form/Wizard.tsx      NEW — the guided flow (reuses Form.tsx sections)
src/form/Form.tsx        REFACTOR-LIGHT — export section components so the
                         wizard can reuse them; no behavior change in full mode
src/App.tsx              EXTEND — mode state, toggle, map-click routing
src/styles/app.css       EXTEND — wizard chrome
tests/wizard.test.ts     NEW — pure step-config tests
```

## Mode plumbing (`App.tsx`)

- `formMode: 'guided' | 'full'`, default `'guided'`, persisted globally in
  `localStorage['money-map-form-mode:v1']` (survives reload; separate from
  the book key).
- A small segmented toggle at the top of the form pane: `Guide me` /
  `Full form` (quiet styling, existing palette; the active segment uses the
  hairline + ink treatment, no new colors).
- Map-click routing: in full mode, behavior unchanged. In guided mode, a
  map click JUMPS the wizard to the matching step (account → Accounts step
  and expands/focuses that account card; income panel → Income step; need
  card → Need step).

## The wizard (`src/form/Wizard.tsx`)

Header: step title + "Step N of 5" + a row of progress dots (filled = done,
ring = current). Footer: `Back` (ghost, hidden on step 1) and `Next`
(primary, generous hit target). Steps:

1. **Who is this map for?** — client title, year, variant (post-note label
   appears only when post-note is chosen).
2. **What income comes in?** — the income-sources row list (add/remove) +
   the After-Tax Income total field. One category, nothing else.
3. **What does the month need to cover?** — Monthly Income Need +
   "Monthly income as needed" (with its appears-on-the-arrow help text).
4. **What accounts hold the money?** — the preset add chips front and
   center ("Tap to add:"), above the collapsed account-card list from the
   full form (expand to edit, including positions/sub-accounts). This step
   may scroll; it is still ONLY accounts.
5. **Footnotes (optional)** — RMD rows; subtitle "Skip this unless the plan
   states required distributions." `Next` reads `Finish` here.

After Finish: a small done panel — "The map is ready." with three quiet
actions: `Print`, `Export PNG`, `Fine-tune in full form` (switches mode) —
plus `Start over` returning to step 1. Selecting a different client or
creating a new one resets the wizard to step 1 for that client.

Implementation constraints:
- The wizard renders the SAME section components the full form uses —
  refactor `Form.tsx` to export them (props unchanged); do not duplicate
  field markup. One source of truth per section.
- Step definitions live in a small exported pure structure
  (`WIZARD_STEPS`: id, title, mapTargets) so tests can assert them.
- Keyboard: Enter in a field still moves to the next field (SESSION-5
  behavior); the Next button is reached by Tab as usual. No new shortcut
  system.

## Tests (`tests/wizard.test.ts`)

Pure tests on `WIZARD_STEPS`: 5 steps, expected order/ids; the
map-target→step mapping resolves account→4, income→2, need→3.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Browser verification, describe method + results: fresh profile boots into
  guided mode step 1; Next walks all five steps and Finish shows the done
  panel; the map updates live while typing inside a step; clicking a drum
  in guided mode jumps to the Accounts step with that card open; the
  toggle switches to the unchanged full form and BACK; the chosen mode
  survives reload; print/PNG output contain no wizard chrome.
- Commit in logical steps; `docs/codex/SESSION-6-REPORT.md`; budget
  ≈ 400–600 changed lines. Do NOT push — the orchestrator reviews first
  (pushing auto-deploys the live site).
