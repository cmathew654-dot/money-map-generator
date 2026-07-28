# SESSION-23 — Form clarity: new-user punch list

Read `AGENTS.md` first. Dogfood round 3 continues — every item below is a
first-session stumble from a new user. All form-side except one masthead
render tweak. Wizard and full form share section components (one source
of truth) — every change lands in both modes automatically. DO NOT PUSH.

## P1 — Words that confused a new user

- Income row field label "Label" → **"Income source"** (Form.tsx ~:301).
- Account field label "Label" → **"Account name"** (~:620) — same
  confusion class, same fix. Footnote/position "Label" fields stay.
- "Qualifier" (~:342) → **"Shown as"**, placeholder `e.g. Gross,
  After-Tax`. It renders after the amount on the map; the name should
  say so. Field stays free text.

## P2 — Income source picker

New user: "make a drop down for the basic income sources and then have
the option to add in if one of the options isn't listed."
- Reuse the account-preset ADD-CHIP pattern (account chips at
  Form.tsx ~:724-744, `account-preset-*` styles): the income section
  gains "Add:" chips — **Social Security · Pension · Salary / Wages ·
  Rental Income · Annuity · Something else**. A chip adds a row with
  the label prefilled and focuses the AMOUNT input; "Something else"
  adds a blank row and focuses the label input.
- The bare "Add income" button may be removed if the chips fully
  replace it (match how account chips replaced the lone Add button in
  SESSION-5).

## P3 — Dates become pickers

"dates should be a click down menu instead of fill in"
- Year (~:849) → `<select>`: range (currentYear − 1) … (currentYear + 1),
  PLUS the stored value if outside that range (legacy books stay
  valid and unchanged unless the advisor picks something new).
- As Of (~:871, mid-year only) → month `<select>` (January … December).
  New books store just the month name in `postNoteLabel`; legacy
  values like "April 2026" remain valid stored data (render fix below).

## P4 — Masthead: no year after the month in mid-year updates

"eliminate year after the month in the mid year update"
- When `variant === 'postNote'`, the masthead label drops a trailing
  4-digit year token at RENDER time: "APRIL 2026 UPDATE" → "APRIL
  UPDATE". Data untouched; month-only values render naturally. Annual
  variant masthead unchanged.

## P5 — Entry fields must read as entry fields

"the spaces where you enter in the information should be a different
color from the background"
- Form inputs/selects/textareas: background `#ffffff` (vs the app's
  `#eceeea` chrome and `#fcfcfa` panels) + a slightly stronger border
  (e.g. `#c9cfc9`), so blanks read as fillable at a glance. Focus
  treatment unchanged. Map/print untouched (the form never prints).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests: masthead year-stripping pure helper (postNote "April 2026" →
  "APRIL UPDATE", "April" → "APRIL UPDATE", annual untouched); year
  select includes out-of-range stored value; income chip adds a
  prefilled row. Update any label-text assertions honestly.
- Screenshots: wizard income step with chips; client step with the two
  selects; full form; a legacy mid-year client's masthead without the
  year; input contrast visible in both form modes.
- File map — touch: `src/form/Form.tsx`, `src/form/Wizard.tsx` (only if
  step copy references renamed fields), `src/render/MapSvg.tsx`
  (masthead only), `src/model/format.ts` (year-strip helper if placed
  there), `src/styles/app.css`, tests alongside. Budget ≈ 200–350
  changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-23-REPORT.md`.
