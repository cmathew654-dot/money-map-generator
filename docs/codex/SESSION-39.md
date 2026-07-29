# SESSION-39 — Move any text: universal drag placement

Read `AGENTS.md` first. Owner: "you should be able to adjust font
placement easily if wanted." The rule becomes universal — ANY map
text you can click to edit, you can also DRAG to place. Account
texts already have this (S27); this session extends it to every
other editable text. DO NOT PUSH.

## Scope

- Draggable now (same S27 mechanics everywhere: pointer-down on the
  text, crossing the 4px threshold enters MOVE with live preview and
  pointer capture; releasing below the threshold opens the editor as
  today; Escape cancels; ONE commit per gesture; `move` cursor while
  dragging):
  - income header, each income row (a row moves as one unit: label +
    amount + qualifier), the after-tax total line;
  - need label and need value;
  - fine print lines (each line moves independently);
  - the masthead label;
  - position rows (each row as a unit) and the sub-account inset's
    text block (moves as one block);
  - flow labels (offset stored relative to the arrow midpoint so the
    label keeps riding its arrow).
- Storage: the EXISTING `dx`/`dy` on the same `text:` override keys
  each target already uses for `fs` (S29 stored-but-ignored values
  become honored — a designed-for upgrade). Position rows:
  `text:<accountId>:rows` moves the block of rows; sub inset:
  `text:<accountId>:sub`. Flow labels: `arrow:custom:<id>` gains
  `labelDx`/`labelDy` (validated finite). Masthead:
  `text:masthead:label` (add `masthead: ['label']` to the registry).
- Semantics: explicit moves are the user's choice — exempt from
  containment, clamped to OVERRIDE_BOUNDS only (S27 doctrine).
  Account-local texts move in pre-rotation space and rotate with
  their shape; fixed-element texts move in artboard space. Reset
  arrangement clears all of it (already deletes the record).
  Legacy books with stored-but-never-honored dx/dy on fixed keys
  will now show those offsets — acceptable and stated (they could
  only exist from hand-edited JSON).
- Print/PNG/present render moved positions with zero chrome (the
  noninteractive path applies overrides in layout/render as today).

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — overrides/book: dx/dy round-trip on every newly honored
  key incl. `text:masthead:label` and flow `labelDx/labelDy`
  validation; layout/mapedit: each target's rendered position shifts
  by exactly (dx, dy) from its computed default (table across all
  new targets); bounds clamp; threshold decision unchanged (move vs
  edit); flow label follows its arrow when the ARROW moves (offset
  is midpoint-relative); reset clears.
- Screenshots: (1) an income row dragged out of the panel — renders
  where placed, prints identically; (2) the need value nudged, the
  masthead label nudged; (3) a flow label dragged off its midpoint,
  then the arrow's endpoint dragged — label keeps its relative
  offset; (4) sub-account block moved inside its drum; (5) undo
  restores each move; (6) print emulation — zero chrome.
- Redirect all browser output to files under C:\tmp; any free port.
- File map — touch: `src/model/types.ts` (registry + flow label
  fields), `src/model/book.ts` (validation), `src/layout/layout.ts`,
  `src/render/MapSvg.tsx`, `src/render/mapInteraction.ts`,
  `src/ui/MapTextEditor.tsx` (only if target metadata shifts),
  `tests/book.test.ts`, `tests/overrides.test.ts`,
  `tests/layout.test.ts`, `tests/mapedit.test.ts`. Budget ≈
  350–550 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-39-REPORT.md`.
