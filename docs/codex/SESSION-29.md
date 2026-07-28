# SESSION-29 — Map typography everywhere + present zoom

Read `AGENTS.md` first. Dogfood round 4, wave 1, MAP territory. This
session runs IN PARALLEL with SESSION-31 (form territory) in a
separate worktree — the "must not touch" list below is a hard
contract, not a suggestion. DO NOT PUSH.

Tester asks: "want to edit the font size on the income shape on the
map" · "font size on foot note, the income needed shape, and also the
key down in the left corner" · "need the present tab to have a full
screen money map and able to zoom."

## P1 — Fixed-element text overrides (types.ts, book.ts)

- types.ts gains a registry:
  `MAP_TEXT_ELEMENTS = { income: ['header','row','total'], need: ['label','value'], footnotes: ['line'], legend: ['label'] } as const`
  and `mapTextOverrideKey(element, role)` producing keys like
  `text:income:row` (reuses the S27 `text:` prefix; `income`/`need`
  as reserved element ids follow the endpoint-id precedent in
  mapInteraction.ts:41-44).
- New clamps `MIN_MAP_TEXT_FONT_SIZE = 9`,
  `MAX_MAP_TEXT_FONT_SIZE = 40` for fixed elements (the need value
  defaults to 30 — the account clamp of 28 cannot hold it). The
  account clamp 9–28 is untouched; no S27 test re-pins.
- book.ts `validateLayoutOverrides` (text-key branch, ~:446-458): a
  `text:` key is valid if parts[1] is an account id with an account
  role OR a `MAP_TEXT_ELEMENTS` element with a listed role. Reject
  unknown roles (`text:income:bogus`) with the usual human-readable
  error. `dx`/`dy` on fixed-element keys are accepted-but-ignored
  (only `fs` is read). `withFreshIds` already passes non-account
  `text:` keys through on duplicate — pin it with a test, no change.

## P2 — Rendering (MapSvg.tsx ONLY — layout.ts is not needed; all
fixed text sites render from TYPE constants inside MapSvg)

- One helper `fixedTextFs(data, element, role, fallback)` =
  clamp(override fs ?? fallback, 9, 40).
- IncomePanel: header at `income:header` fs (default 16.5). Rows
  scale proportionally from `income:row` fs (default 14): label
  renders at fs × 13/14, qualifier at fs × 12/14. Row pitch and the
  panel box are unchanged — overlap at extreme sizes is the
  advisor's explicit choice (S27 philosophy), live and undoable.
  Total value at `income:total` fs (default 16).
- NeedCard: label at `need:label` fs (default 14); value at
  `need:value` fs (default 30); the tag tspan keeps inheriting.
- Footnotes: all lines share `footnotes:line` fs (default 14); line
  advance scales `24 × fs/14`. `footnotesAt` untouched.
- Legend: `legend:label` fs (default 11); replace the hardcoded
  legend item widths with `textWidth(label, fs)` (import directly
  from `src/layout/textfit.ts`) + 32 marker allowance + 16 gap so
  entries reflow at any size.

## P3 — Editing (MapTextEditor.tsx + App.tsx)

- New `MapTextEditTarget` kinds: `incomeHeader`, `needLabel`,
  `footnoteText`, `legendText` — all SIZE-ONLY: the editor renders
  the A−/A+ stepper chrome WITHOUT a text input; Enter/Escape/blur
  close; `applyMapTextEdit` returns data unchanged for these;
  `mapTextEditRawValue` returns `''`. Plus a full `afterTaxIncome`
  value-edit target (same shape as `monthlyNeed`, fs role `total`).
- Existing `incomeAmount` and `monthlyNeed` targets gain `fontSize`
  (roles `row` and `value` respectively).
- New pure `mapTextEditFsInfo(data, target): { key, fallback, max } | null`
  unifying account + fixed elements. `adjustAccountTextFontSize`
  generalizes to `adjustMapTextFontSize(fs, change, max)` (floor 9).
  App.tsx previewClient (~:165-181) and the editor commit path
  (~:1074-1098) rewire through `fsInfo`, deleting the
  `'accountId' in target` special-casing.

## P4 — Present zoom (App.tsx + app.css)

- The read-only present ruling stands; zoom is view-only. In present
  mode render the zoom cluster (same markup, wrapper class
  `present-zoom`, fixed bottom-right, translucent) — do NOT render
  + Note / + Shape.
- Make ctrl/cmd+wheel effective while presenting:
  `.app-shell.is-presenting .map-scroller { overflow: auto }` (+
  minimal padding) and let the inline zoom width win over the fit
  rule when zoomed. Entering present resets zoom to Fit so the map
  fills the screen. Esc-to-exit unchanged.
- clearMap confirm dialog string (~App.tsx:1218-1223): "footnotes"
  → "fine print" (coordinated with SESSION-31's form rename).

## MUST NOT TOUCH (parallel-session contract)

`src/form/Form.tsx`, `src/form/Wizard.tsx`, `src/layout/layout.ts`,
`src/render/mapInteraction.ts`, `src/render/tokens.ts`,
`src/model/samples.ts`, `tests/form.test.ts`, `tests/wizard.test.ts`,
and the app.css FORM region (line ~35 root background and
~939-1110) — your app.css edits are confined to the
`.is-presenting` region (~738-770) plus new `.present-zoom` rules
appended immediately after it.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — book.test.ts: accepts `text:legend:label {fs:18}`,
  `text:income:row`, `text:need:value`; rejects `text:income:bogus`
  and `text:footnotes:label`; still rejects fs on non-text keys;
  withFreshIds preserves fixed-element keys. overrides/mapedit:
  `mapTextEditFsInfo` key/fallback/max table (account label→28, need
  value→40, legend→40); `adjustMapTextFontSize` clamps at 9 and
  per-target max; size-only targets no-op through `applyMapTextEdit`;
  `afterTaxIncome` commits via parseMoneyInput.
- Screenshots: (1) income rows stepped to 20 — labels/values/
  qualifiers scale together; (2) need value at 40; (3) two footnote
  lines at 18 — spacing scales; (4) legend at 16 — entries reflow,
  no collision; (5) present — Fit fills screen, ctrl+wheel zooms at
  cursor, cluster bottom-right, Esc exits; (6) print emulation — all
  sizes persist, zero chrome.
- Browser verification MUST redirect all browser stdout/stderr to
  files under C:\tmp. Use preview port 4291 (SESSION-31 runs in
  parallel on another port).
- File map — touch: `src/model/types.ts`, `src/model/book.ts`,
  `src/render/MapSvg.tsx`, `src/ui/MapTextEditor.tsx`,
  `src/App.tsx`, `src/styles/app.css` (regions above),
  `tests/book.test.ts`, `tests/overrides.test.ts`,
  `tests/mapedit.test.ts`. Budget ≈ 420–580 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-29-REPORT.md`.
