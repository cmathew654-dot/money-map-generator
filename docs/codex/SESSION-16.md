# SESSION-16 — Undo/redo + the quiet arithmetic layer

Read `AGENTS.md` first. Two owner-approved workstreams. DO NOT PUSH.

## P1 — Undo/redo (session-scoped, book-wide)

Every committed model change today is irreversible except by hand; Reset
layout destroys all overrides at once. Fix with bounded in-memory history.

- `src/App.tsx` stays the single state owner. Keep a history stack of
  `{ book, activeClientId }` snapshots (the model is immutable data —
  snapshots are references, cheap). Bound: 50 entries, drop oldest.
  History is in-memory only — never persisted.
- Every committed change enters history: form edits, in-place map edits,
  drag/resize/arrow/shape commits, add/duplicate/delete client,
  Reset layout, Load book, Start over. COALESCE rapid consecutive
  changes: successive commits within 800ms that target the same client
  merge into one history step (typing a number must not create one step
  per keystroke).
- Undo: Ctrl+Z. Redo: Ctrl+Shift+Z and Ctrl+Y. A new edit clears the
  redo stack (standard semantics). Undo/redo restores BOTH the book and
  the active client (undoing a change made on another client switches
  back to that client so the user sees what changed).
- Also render two quiet header buttons (undo/redo arrows, existing
  button styling, disabled when their stack is empty, aria-labels,
  tooltips showing the shortcut). No history panel, no persistence —
  happy path only.
- localStorage keeps tracking only the CURRENT state exactly as today.

## P2 — Quiet arithmetic, foolproof by construction

Two computed lines, rendered in the artifact's existing muted caption
grammar (11.5px Public Sans, MUTED, always prefixed "≈"). The rule that
makes them foolproof: A LINE ONLY RENDERS WHEN EVERY INPUT IT NEEDS IS
PRESENT AND THE RESULT IS SANE. Blank anywhere → the line silently does
not exist. Never a warning, never red, never bold, never a guess.

- Runway, inside the short-term bucket account (below the value):
  `≈ 2.3 yrs at $6,000/mo` where runway = account value ÷ asNeededAmount.
  Render ONLY when: the account has a non-null value > 0, AND
  asNeededAmount is non-null and > 0, AND runway ≤ 99. One decimal place.
- Gap, under the monthly-need value in the need card:
  `≈ $7,100/mo gap after income + draw` where
  gap = monthlyNeed − afterTaxIncome − asNeededAmount, using ONLY the
  user's stated After-Tax Income field (never a sum of gross sources —
  gross/net mixing is exactly the wrong-guess this contract forbids).
  Render ONLY when monthlyNeed, afterTaxIncome, and asNeededAmount are
  all non-null and the gap is > 0. When the gap is ≤ 0 render
  `≈ covered by income + draw` instead (same muted styling). If ANY of
  the three inputs is blank, render nothing at all.
- Both lines are part of the artifact (print/PNG include them). Per-client
  off switch: `showMath?: boolean` on the client (default true), exposed
  as one small labeled toggle in the client section of the form —
  advisors who want a silent map for a given client flip it once.
  `src/model/book.ts` accepts the optional field; legacy books default on.
- Pure functions in `src/model/format.ts` (or a small new
  `src/model/math.ts` if cleaner — it is on the file map): `runwayLine()`
  and `gapLine()` returning a string or null. ALL rendering decisions go
  through them so tests pin the entire contract.
- Tests (`tests/math.test.ts`, new): every render/suppress rule above —
  blanks in each position, zero and negative draw, runway > 99, gap
  positive/zero/negative, showMath false. Plus undo tests
  (`tests/undo.test.ts`, new): a pure history helper (push/undo/redo/
  coalesce/bound) extracted so it is testable without DOM.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Screenshot verification: (1) Whitfield with a draw amount set — runway
  and gap lines present in muted grammar, artifact still reads as a
  document; (2) blank the draw → both lines vanish, no gaps or
  placeholders left behind; (3) drag a drum, Ctrl+Z restores it, Ctrl+Y
  re-applies; (4) Reset layout then Ctrl+Z brings the arrangement back;
  (5) print emulation with math lines on — they print; toggle off — they
  don't.
- File map: `src/App.tsx`, `src/model/types.ts`, `src/model/book.ts`,
  `src/model/format.ts` or `src/model/math.ts` (new allowed),
  `src/render/MapSvg.tsx`, `src/form/Form.tsx`, `src/styles/app.css`,
  `tests/math.test.ts` (new), `tests/undo.test.ts` (new),
  `tests/book.test.ts`.
- Commit in logical steps; end with `docs/codex/SESSION-16-REPORT.md`;
  budget ≈ 400–600 changed lines.
