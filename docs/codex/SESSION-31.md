# SESSION-31 — Form IA: hierarchy, fine print into Need, Notes tab

Read `AGENTS.md` first. Dogfood round 4, wave 1, FORM territory. This
session runs IN PARALLEL with SESSION-29 (map territory) in a
separate worktree — the "must not touch" list below is a hard
contract. DO NOT PUSH.

Tester asks: need/tag inputs misaligned · draw-from-short-term box
too wide · new name for footnote (owner ruling: **"Fine print"**) ·
footnotes fold into another section (owner ruling: **Need step**) ·
notes as their own clean tab (owner ruling: list of the on-map note
blocks) · background / section / input surfaces need distinct colors.

## P1 — Need section geometry

- Alignment root cause: the "MONTHLY INCOME NEED" label wraps to two
  lines while "Tag" is one, so the inputs sit at different heights.
  Fix: `.value-tag-fields .form-field { align-content: end; }` —
  inputs share the bottom edge in BOTH the Need pair and the account
  Value/Tag pairs.
- NeedSection restructures to one two-column grid (`need-fields`):
  row 1 = Monthly Income Need | Tag; row 2 = help text; row 3 =
  Draw from Short-Term Bucket in COLUMN 1 ONLY (remove its
  `.wide-field` wrapper — same width as Monthly Income Need); row 4
  = its help text.

## P2 — "Fine print" (rename + relocation)

- User-facing rename ONLY: section heading "Fine print", add button
  "+ Add fine print line", remove-aria "Remove fine print line N",
  wizard subtitle updated, component exported as `FinePrintSection`.
  **The schema field stays `footnotes`; the `Footnote` type is NOT
  renamed; map-side aria labels are untouched** (map files are
  another session's territory).
- The wizard's separate footnotes step is DELETED. The Need step
  renders NeedSection, then FinePrintSection under an h3 "Fine
  print" with the existing "Skip unless the plan states required
  distributions"-style subtitle. The full form mirrors the same
  nesting inside its Need section.

## P3 — Notes tab

- New `NotesSection`: a clean list of the on-map note blocks. Each
  row = textarea (rows=2) + × delete button. "+ Add note" appends
  `{ id: newId('note'), text: '', x: 540, y: 510 }` — the same
  defaults as App's handleAddNote: x = (ARTBOARD.width − NOTE_WIDTH)/2,
  y = ARTBOARD.height/2; import `NOTE_WIDTH` from layout and
  `ARTBOARD` from tokens as READ-ONLY imports — and focuses the new
  textarea via the income-chip pendingFocus pattern (Form.tsx
  ~:304-311).
- This deliberately BYPASSES `addMapNote` (its trim guard rejects
  the empty-text row this flow needs — disclose in the report). An
  empty-text note renders nothing visible on the map; acceptable.
- Export pure helpers `appendBlankNote(data)` and
  `updateNoteText(data, id, text)` so the no-DOM vitest suite can
  pin them. Deletes filter inline.
- Wizard steps become **Client, Income, Accounts, Need, Notes**
  (still five; the notes step has `mapTargets: []`). ZERO App.tsx
  changes — notes already flow through `data`/`onChange`.

## P4 — Surface hierarchy (app.css)

Four clearly distinct levels; exact hexes are the spec's — do not
improvise:
- App background (root, ~line 35): `#eceeea` → `#e4e8e1`.
- `.form-section` becomes a card: `background: #f4f6f2; border: 1px
  solid #dde1dc; border-radius: 10px; padding: 16px 14px;` with an
  inter-card gap (wizard variant included).
- `.stacked-row` (income / fine print / nested rows) becomes a
  sub-card: `background: #fcfcfa; border: 1px solid #e3e7e0;
  border-radius: 8px; padding: 10px;`.
- Inputs stay `#ffffff` with `#c9cfc9` border (SESSION-23).
Result: bg < card < sub-card < input.

## MUST NOT TOUCH (parallel-session contract)

`src/App.tsx`, `src/render/MapSvg.tsx`, `src/ui/MapTextEditor.tsx`,
`src/layout/layout.ts` (import constants only),
`src/model/types.ts`, `src/model/book.ts`,
`src/render/mapInteraction.ts`, `src/render/tokens.ts` (import
only), `src/model/samples.ts`, `tests/book.test.ts`,
`tests/overrides.test.ts`, `tests/mapedit.test.ts`, and the app.css
`.is-presenting` / map-chrome regions — your app.css edits are
confined to line ~35 plus the form region (~939-1110) and wizard
region (~1425+).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — wizard.test.ts: step ids `[client, income, accounts, need,
  notes]`; map-target→step resolution still works for `need`.
  form.test.ts: `appendBlankNote` defaults (540/510, empty text,
  unique ids), `updateNoteText` no-op on unknown id, delete filter.
  Update any label-text pins ("Footnotes" → "Fine print") honestly.
- Screenshots: (1) Need step — Monthly Income Need and Tag inputs
  bottom-aligned, Draw field one column wide, fine print block below
  in the same step; (2) wizard pills read Client/Income/Accounts/
  Need/Notes; (3) Notes tab — add focuses the new textarea, typed
  text appears on the map live, × removes the block; (4) full-form
  ladder shot — bg vs section card vs row sub-card vs input all
  distinct; (5) no "Footnote" wording anywhere in the form.
- Browser verification MUST redirect all browser stdout/stderr to
  files under C:\tmp. Use preview port 4311 (SESSION-29 runs in
  parallel on another port).
- File map — touch: `src/form/Form.tsx`, `src/form/Wizard.tsx`,
  `src/styles/app.css` (regions above), `tests/form.test.ts`,
  `tests/wizard.test.ts`. Budget ≈ 400–550 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-31-REPORT.md`.
