# SESSION-27 — Per-text font size + move on shapes

Read `AGENTS.md` first. Dogfood round 3, final item: "it would be nice
to edit font size and be able to move it on the shape." This rides the
existing override + in-place-edit machinery. Scope guard: ACCOUNT texts
only (label, caption, value line) — income panel, need card, masthead,
footnotes, and note blocks keep their fixed typography in v1 (state as
limitation). DO NOT PUSH.

## P1 — Data: text override family

- `layoutOverrides` gains a key family `text:<accountId>:<role>` with
  roles `label` | `caption` | `value`. `LayoutOverride` gains
  `fs?: number` (used only by text keys; validated finite like the
  other fields, applied clamped to 9–28).
- `dx`/`dy` on a text key nudge that text block from its computed
  position, in artboard units, clamped to OVERRIDE_BOUNDS only — an
  EXPLICIT user move may leave the shape (their choice, same doctrine
  as dragged chips/endpoints). Reset arrangement clears text keys with
  everything else (it already deletes the record).
- Sub-account texts are out of scope.

## P2 — Layout: size feeds the fit contract

- `fs` on label/caption re-wraps that text via `fitLines` AT THE
  OVERRIDDEN SIZE and feeds `accountHeight`/baselines — bigger text
  grows the shape; the SESSION-22 containment guarantee holds for any
  UNMOVED text at any permitted size. `fs` on the value line scales
  the value + tag measurement (line still never wraps; shape widens
  its height math as needed).
- Texts WITH a dx/dy move are exempt from the containment invariant
  (document this in the tests); moved-but-unsized texts keep their
  computed line breaks.
- Rotation composes: nudges apply in the shape's local pre-rotation
  space, rotating with it.

## P3 — Interaction

- The in-place text editor chrome (SESSION-11 `MapTextEditor`) gains
  compact `A−` / `A+` steppers beside the input when the target is an
  account label/caption/value. Each press adjusts `fs` by 1 within
  9–28 (hold-to-repeat not required), previews live, and the whole
  edit commits as today (one undo step including any fs change).
- Dragging an account text: pointer-down on the text, crossing the
  drag threshold enters MOVE mode (live preview, Escape cancels, one
  commit on release — S12/S13 pointer discipline); releasing without
  crossing the threshold opens the editor exactly as today. Cursor
  `move` while dragging. Present/print/PNG render the final text
  positions with zero chrome (the noninteractive path needs no new
  work if overrides apply in layout).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — `overrides.test.ts`/`book.test.ts`: text-key validation
  round-trip (fs finite, malformed rejected), reset clears text keys;
  `layout.test.ts`: fs=24 label wraps to more lines and grows the
  shape (height strictly increases), containment invariant holds for
  unmoved oversized text across samples + the long-label stress
  client, moved text exempt but bounds-clamped, value-line fs scales
  the measured width (with a tag present); `mapedit.test.ts`: stepper
  bounds (9/28 clamp), threshold decision (move vs edit) pure helper.
- Screenshot verification: (1) a label at A+ ×4 — text visibly larger,
  drum visibly taller, nothing clipped; (2) a caption dragged outside
  its drum — allowed, rendered where placed; (3) the same map in print
  emulation — identical placement, zero chrome; (4) undo restores both
  size and position in one step each.
- When you launch any browser for verification, redirect ALL of its
  stdout/stderr to files under `C:\tmp` — nothing may print to the
  console (the owner watches this terminal).
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
  `src/render/mapInteraction.ts`, `src/ui/MapTextEditor.tsx`,
  `src/App.tsx` (editor wiring only, minimal), `src/styles/app.css`,
  `tests/overrides.test.ts`, `tests/book.test.ts`,
  `tests/layout.test.ts`, `tests/mapedit.test.ts`. Budget ≈ 350–500
  changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-27-REPORT.md`.
