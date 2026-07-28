# SESSION-34 — Map polish: legend removed, income panel control, deeper text reach

Read `AGENTS.md` first. Dogfood round 6, MAP territory. Runs IN
PARALLEL with SESSION-35 (form CSS) in a separate worktree — the
"must not touch" list is a hard contract. DO NOT PUSH.

## P1 — The legend is removed (owner ruling)

- The bottom-left key renders NOWHERE (screen, present, print, PNG).
  Delete the legend render path and its edit target. Drawn flows
  carry their own labels; generated arrows are self-evident.
- Stored `text:legend:label` override keys in existing books remain
  VALID-but-inert (validation keeps accepting them; nothing reads
  them). The `legend` entry leaves `MAP_TEXT_ELEMENTS`' editable
  surface; note the validation-compat exception in the report.

## P2 — Income panel: resizable + breathing room

- The income panel gains the standard corner RESIZE handle (S12
  machinery): override key `income` accepts `w`/`h` like accounts;
  width clamps to a sane minimum (fits the longest row at current
  sizes); height clamps ≥ content height (content growth wins).
- "Text too close vertically": the income row pitch (currently a
  fixed 40) SCALES with the `income:row` fs and its DEFAULT gains
  +4 units of air; the header→first-row gap scales likewise. The
  panel's computed height follows.

## P3 — Positions and sub-accounts get font sizing

- New fixed roles per account: `text:<accountId>:rows` (all position
  rows of that account share one size; default TYPE.row) and
  `text:<accountId>:sub` (the sub-account inset's label/caption/
  value scale proportionally from one size; default TYPE.subValue
  for the value, others in today's ratios). Clamp 9–40, validated
  like the other text keys.
- Position row text and sub-account text become clickable SIZE-ONLY
  targets (the stepper-chrome-without-input pattern from S29's
  legendText): A−/A+ previews live, one commit. Value/label EDITING
  of positions/sub-accounts stays form-only in v1 — state as
  limitation.

## P4 — Readability + masthead + pan

- Muted in-shape text is too light: `MUTED` `#5b6663` → `#47504d`
  (tokens.ts — flows through captions, tags, qualifiers, month
  label). Add a contrast pin: MUTED ≥ 4.5:1 on PAPER and on every
  bucket tint.
- Mid-year masthead: "<LABEL> — APRIL 2026" — the month followed by
  the YEAR (from `client.year`), and the word "UPDATE" is dropped.
  `mastheadPeriodLabel` reworked: a legacy stored "April 2026"
  renders "APRIL 2026" (no duplicate year); a month-only value gets
  the year appended. Annual masthead unchanged. Update the S23/S31
  pins honestly.
- Drag-to-pan: when the map is zoomed beyond Fit, a pointer drag
  that STARTS on empty artboard background (not on any element,
  text, arrow, or handle) pans the scroller (pointer capture,
  `grab`/`grabbing` cursor). Element drag/resize/rotate behavior is
  untouched. Works in Present mode too (read-only ruling unaffected
  — panning is view-only).
- Discoverability fix (twice-reported): the income panel's editable
  text lines (rows, after-tax total, header) get full-row-width
  invisible hit areas and the standard hover affordance, so clicking
  anywhere on the line opens its editor. Same for note text.

## MUST NOT TOUCH (parallel-session contract)

`src/form/Form.tsx`, `src/form/Wizard.tsx`, `src/model/vocab.ts`,
`src/ui/Autocomplete.tsx`, `tests/form.test.ts`,
`tests/wizard.test.ts`, `tests/vocab.test.ts`, and the app.css FORM
region — your app.css edits are confined to map-chrome/present
regions and one appended `/* S34 */` block at end of file.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — book/overrides: `income` w/h round-trip; `rows`/`sub`
  role validation (accept, reject unknown roles); legacy
  `text:legend:label` still accepted. layout: row pitch scales with
  fs; income panel min-width clamp; content-height floor. mapedit:
  rows/sub stepper metadata (fallbacks, 9/40); legend target gone;
  masthead composition table (legacy "April 2026", month-only,
  annual). contrast: new MUTED pins.
- Screenshots: (1) legend absent on screen AND print; (2) income
  panel resized wider + rows at a larger size with visibly more
  leading; (3) position rows and a sub-account stepped up — text
  grows inside the drum, drum grows; (4) mid-year masthead "APRIL
  2026"; (5) zoomed to 150%, drag empty canvas to pan (before/after
  scroll positions), an account drag still moves the account;
  (6) darker muted text legible inside gold/blue tints; (7) print —
  everything persists, zero chrome.
- Redirect all browser output to files under C:\tmp; preview port
  4341 (SESSION-35 runs in parallel on another port).
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/tokens.ts`, `src/ui/MapTextEditor.tsx`,
  `src/render/mapInteraction.ts`, `src/App.tsx` (pan wiring,
  minimal), `src/styles/app.css` (regions above),
  `src/model/format.ts` (mastheadPeriodLabel), `tests/book.test.ts`,
  `tests/overrides.test.ts`, `tests/layout.test.ts`,
  `tests/mapedit.test.ts`, `tests/format.test.ts`,
  `tests/contrast.test.ts`. Budget ≈ 500–700 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-34-REPORT.md`.
