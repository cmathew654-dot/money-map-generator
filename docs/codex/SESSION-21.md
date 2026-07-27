# SESSION-21 — Reset becomes a two-scope control: arrangement vs clear map

Read `AGENTS.md` first. Owner ask: "Reset does not RESET" — he expected a
route to a cleared canvas. Owner instruction: bundle clearing INTO the
reset control. Design follows destructive-action best practice: scopes
labeled by outcome, the destructive option confirm-guarded + undoable +
danger-styled, copy that names the client and exactly what is lost.
(SESSION-20 exists as a superseded, never-run spec — this session is 21;
do not touch SESSION-20.md.) DO NOT PUSH.

## The control

Replace the lone "Reset layout" header button with a **Reset ▾** menu
(reuse `src/ui/Menu.tsx` exactly as Book ▾ does). Always rendered. Two
items:

1. **"Reset arrangement"** — today's Reset layout behavior verbatim
   (confirm dialog, clears `layoutOverrides`, toast). Disabled when the
   active client has no overrides.
2. **"Clear map…"** — danger-styled menu item. Confirm Dialog copy must
   name the client and the loss precisely, e.g.:
   "Clear the map for <client title>? This removes all accounts, income
   sources, monthly need, draw amount, after-tax income, footnotes, and
   arrangement. The client stays in your book. One Undo brings
   everything back." Confirm button: "Clear map" (danger), cancel
   default-focused.

## Clear semantics

- New pure `clearedClient(data: MoneyMapData): MoneyMapData` in
  `src/model/book.ts`: keeps `id`, `client` (title/variant/year/
  postNoteLabel), and `showMath`; empties `accounts`, `incomeSources`,
  `footnotes`; nulls `monthlyNeed`, `asNeededAmount`, `afterTaxIncome`;
  removes `layoutOverrides`. Result must render the same truly-blank map
  a New client shows.
- On confirm: commit through the normal path as ONE undo step, toast
  "Map cleared — Undo brings it back", and drop the user INTO the
  cleared canvas: guided mode → wizard step 1, not done; full-form mode
  → stay in full form. (Reuse the existing fresh-profile behavior.)
- Print/PNG/book/file-autosave all follow automatically (it is just an
  edit).

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests (`tests/book.test.ts`): clearedClient empties exactly the fields
  above and preserves identity/showMath; result passes layoutMap
  without throwing; a cleared client round-trips the book validator.
- Screenshot verification: (1) Reset ▾ open showing both items with
  Clear map danger-styled and Reset arrangement disabled-when-clean;
  (2) confirm dialog with the exact copy; (3) after Clear — blank map,
  wizard step 1; (4) Ctrl+Z — the full map back.
- File map: `src/App.tsx`, `src/model/book.ts`, `src/styles/app.css`
  (minor), `tests/book.test.ts`. Budget ≈ 120–220 changed lines.
- Commit; end with `docs/codex/SESSION-21-REPORT.md`.
