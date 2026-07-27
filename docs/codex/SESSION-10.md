# SESSION-10 — Crit P3: labeled wizard steps, finish panel hierarchy, restrained motion

Read `AGENTS.md` first. Final crit-remediation session. Small and focused —
polish only, no structural changes. DO NOT PUSH.

## P1 — Wizard steps become labeled and clickable

In `src/form/Wizard.tsx`, the five progress dots are anonymous `<span>`s.
Replace them with real `<button type="button">` elements, each with a visible
one-word label: `Client`, `Income`, `Need`, `Accounts`, `Footnotes` (the h1
keeps the full question titles).

- Clicking any step jumps straight to it via `onCurrentStepChange`. EVERY
  step is always reachable in any order — happy path, no validation gating,
  blanks are a feature.
- If the done panel is showing, clicking a step also leaves it
  (`onDoneChange(false)`) — advisors hop back to fix one thing.
- Current step visually distinct (filled or underlined), completed steps
  quietly marked; keep the "Step N of 5" line. `aria-current="step"` on the
  current button; visible focus rings per the existing focus contract.
- Map-click navigation (App.tsx → step jump) must keep working unchanged and
  now agree visually with the clickable steps.

## P2 — Finish panel: Print/Export become the primary pair

In the `done` branch of `Wizard.tsx`: **Print** and **Export PNG** become the
primary pair — side by side, `primary-button` treatment, equal width, first
in the panel. "Fine-tune in full form" joins "Start over" below as quiet
secondary/text actions. No handler changes. When the panel appears after
Finish, move focus to the Print button (small effect in `Wizard.tsx` is
fine; justify if you need to touch `App.tsx`).

## P3 — Restrained motion, entirely behind prefers-reduced-motion

In `src/styles/app.css`, introduce motion ONLY inside
`@media (prefers-reduced-motion: no-preference)`:

- Wizard step content: on step change, a quiet fade + ≤4px rise, ~160ms
  ease-out. CSS animation re-triggered by keying the step container on the
  step id in `Wizard.tsx` (`key={step.id}`).
- Finish panel: the same quiet entrance.
- Toast: fade/slide entrance instead of popping in.
- Move the existing 120ms transform transition (app.css line ~520) inside
  the same guard.

The MAP SVG gets NO motion — the artifact is a still document; print and
PNG output must be pixel-identical to SESSION-9. Under reduced motion,
everything is instant: no transition, no animation, zero movement.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Update `tests/wizard.test.ts`: step buttons render with labels, clicking
  jumps to that step, `aria-current` tracks, done panel exits on step click.
- Screenshot verification at default zoom: (1) wizard mid-flow (step 3+)
  showing labeled steps with current/done states, (2) finish panel with the
  primary pair, (3) confirm with reduced-motion emulation that nothing
  moves and layout is identical.
- File map: `src/form/Wizard.tsx`, `src/styles/app.css`,
  `tests/wizard.test.ts` (+ `src/App.tsx` only with a one-line
  justification).
- Commit in logical steps; end with `docs/codex/SESSION-10-REPORT.md`;
  budget ≈ 120–260 changed lines.
