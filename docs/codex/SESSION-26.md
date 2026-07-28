# SESSION-26 — Notes on the map + text tags beside numbers

Read `AGENTS.md` first. Dogfood round 3, final stretch. Owner rulings:
"add notes" = free TEXT BLOCKS placed on the map (they print); "should
be able to add words to number areas" = a short text tag rendered
BESIDE the number — values stay numeric so the quiet-math layer keeps
working. DO NOT PUSH.

## P1 — Note blocks

- `MoneyMapData` gains `notes?: MapNote[]`;
  `MapNote = { id: string; text: string; x: number; y: number }` in
  artboard coordinates. Absent in legacy books — valid unchanged.
  `book.ts` validation + `withFreshIds` remapping (fresh note ids on
  duplicate), reset-arrangement does NOT delete notes (they are data;
  clear-map does, since it clears the client).
- "+ Note" joins the SESSION-25 floating cluster (screen chrome only).
  Click → a note block appears near map center with placeholder text
  and its in-place editor (SESSION-11 machinery) open; typing sets
  `text`, Escape/blur commits once (empty text on first commit →
  note not created).
- Render: muted ink serif at TYPE.caption-plus size (new TYPE.note
  token), wrapped by `fitLines` at a fixed 240-unit width, transparent
  background, no border — reads as a margin annotation, prints and
  PNG-exports exactly as shown.
- Notes are draggable anywhere within OVERRIDE_BOUNDS (position
  updates the record, one commit per drag, undoable). Hover shows a
  small × chip (delete, undoable) — the same affordance grammar as
  custom arrows. Clicking the text opens in-place editing.
- Notes are NOT obstacles: arrows do not route around them (the
  advisor placed them; they can move them).

## P2 — Text tags beside numbers

- `Account` gains `valueTag?: string` and `MoneyMapData` gains
  `needTag?: string` (the two number surfaces without an existing
  qualifier mechanism; income already has "Shown as", footnotes have
  gross/net labels).
- Render: the tag in muted italic after the money string —
  "$165,000 est." / "~$ ______ TBD" — on the account value line and
  the need card value line. Tags never affect `runwayLine`/`gapLine`
  math (values stay `number | null`); a tag on a blank value renders
  after the blank.
- Form: a narrow "Tag" input beside Value on the account card and
  beside Monthly Income Need (placeholder `e.g. est., + RMD`).
  Wizard inherits via shared sections. Value line-length math must
  include the tag (S22 fit contract — the tag is part of the value
  line's measured width; shape grows if needed, value line still
  never wraps).
- In-place map editing: editing a value edits the NUMBER only; tags
  are edited in the form (state this as a v1 limitation in the
  report).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — book: notes/valueTag/needTag validation (absent ok,
  malformed rejected human-readably), duplicate remaps note ids;
  layout: note block wrapped at 240 via fitLines and clamped to
  bounds; account value line width includes the tag (fit invariant
  holds with a long tag — shape grows, no clip); mapedit: add/delete
  note helpers (empty-text no-op, delete only the target).
- Screenshot verification: (1) "+ Note" → type → note on the map;
  drag it; × deletes; undo restores; (2) a long note wraps at its
  fixed width; (3) account with tag "est." and need with tag "goal" —
  tags muted beside the numbers, math captions unchanged; (4) print —
  notes and tags present, zero chrome.
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/tokens.ts` (TYPE.note), `src/render/mapInteraction.ts`,
  `src/form/Form.tsx`, `src/styles/app.css`, `tests/book.test.ts`,
  `tests/layout.test.ts`, `tests/mapedit.test.ts`. Budget ≈ 350–500
  changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-26-REPORT.md`.
