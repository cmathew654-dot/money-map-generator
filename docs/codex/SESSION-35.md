# SESSION-35 — Form surfaces: off-white goes white

Read `AGENTS.md` first. Dogfood round 6, FORM territory, small and
surgical. Runs IN PARALLEL with SESSION-34 (map) in a separate
worktree — the "must not touch" list is a hard contract. DO NOT PUSH.

Tester asks: the income-section fill areas should be white, not
off-white; "change all the off white to white"; the Add chips and
tap-to-add preset buttons should have white backgrounds.

## Scope (app.css form/wizard regions ONLY)

- Every `#fcfcfa` (paper off-white) surface WITHIN THE FORM becomes
  `#ffffff`: the `.stacked-row` sub-cards (income rows, fine print
  rows, positions/sub-account rows, notes rows) and any other form
  fill surface still on paper.
- The add/preset chip buttons — the income "Add:" chips, the account
  preset chips, the shape-popover chips if they share the class, and
  the "+ Add …" buttons — get `background: #ffffff` with their
  existing borders (strengthen a border one step if a chip loses
  definition on the white sub-card).
- The surface ladder must still read: app bg `#e4e8e1` → section
  card `#f4f6f2` → white sub-cards/inputs/chips separated by their
  borders. Section cards stay `#f4f6f2`. The MAP-side paper
  (`PAPER` token, print page) is NOT touched — this is form chrome
  only.
- Hover/focus states keep visibly distinct (a white chip needs a
  non-white hover — use the existing hover gray).

## MUST NOT TOUCH (parallel-session contract)

Everything outside `src/styles/app.css` form/wizard regions and (only
if a chip class needs a hook) `src/form/Form.tsx` class additions.
No map files, no model files, no App.tsx, no tokens.ts, no app.css
map/present regions or end-of-file.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Screenshots: (1) income step — white row cards + white chips on
  the section card, ladder still distinct; (2) accounts section —
  white preset chips; (3) hover state on a chip visibly different;
  (4) full-form overview. Redirect all browser output to files
  under C:\tmp; preview port 4351 (SESSION-34 runs in parallel).
- File map — touch: `src/styles/app.css` (form/wizard regions),
  `src/form/Form.tsx` (class hooks only if needed). Budget ≈ 40–120
  changed lines.
- Commit; end with `docs/codex/SESSION-35-REPORT.md`.
