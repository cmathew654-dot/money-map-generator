# SESSION-32 — Rapid entry: MoneyField v2, keyboard flow, autocomplete

Read `AGENTS.md` first. Dogfood round 4, wave 2, FORM territory. Runs
IN PARALLEL with SESSION-30 (map territory) in a separate worktree —
the "must not touch" list is a hard contract. DO NOT PUSH.

Owner directive, verbatim: "the whole point now is less typing and
clicks." This spec is written BEHAVIORALLY (SESSION-31 just reshaped
Form.tsx — do not trust old line numbers; find things by name).

## P1 — MoneyField v2 (every money input in the form)

Current defects to kill: commits `parseMoneyInput` on every keystroke
(a transient invalid string writes null and blanks the map value
mid-typing); no select-all on focus; formatting whiplash
($1,600,000 blurred ↔ 1600000 focused); blur overwrites values
changed externally (undo/map edit) while focused.

- Draft-state model: local `draft: string | null`; displayed value =
  `draft ?? (value === null ? '' : money(value))`.
- Focus: snapshot `String(value)` (empty for null) into draft and
  SELECT ALL. Typing sets draft only — NO commit per keystroke; the
  map holds the last committed value while typing.
- Commit on blur and on Enter, ONLY if the draft differs from the
  focus snapshot (dirty check). Commit runs SYNCHRONOUSLY inside the
  onBlur handler — never deferred via setTimeout/transition (see the
  round-risk test below). Escape reverts the draft and commits
  nothing. k/m shorthand stays (`parseMoneyInput` at commit time).
- Arrow-key increments: pure `stepMoney(current: number|null,
  direction: 1|-1, tier: 100|1000|10000): number` in
  `src/model/format.ts`. ArrowUp/Down = tier 100, Shift+Arrow =
  1,000, Alt+Arrow = 10,000. Base = `parseMoneyInput(draft) ?? value
  ?? 0`; result = `max(0, round((base + direction×tier)/tier)×tier)`
  (increment then snap to the tier grid — 85,432 + plain-up →
  85,500). Each keypress updates the draft AND commits immediately
  (it is a valid number; live map feedback; the existing 800 ms
  history coalescing merges a run of presses). preventDefault on the
  handled keys.
- `enterKeyHint="next"` on money and text inputs. The money
  placeholder imports `BLANK` from format.ts instead of hardcoding.

## P2 — Keyboard flow

- Enter-as-Tab (the form-level key handler): the focusable query
  grows to include enabled `select` elements — Enter now advances
  from text inputs AND selects, so Period / Year / Map Type / As Of /
  Bucket no longer break the chain. In a MoneyField, Enter commits
  and then advances in the same keystroke.
- Focus handoff on EVERY add action: + Add position, + Add
  sub-account, + Add fine print line focus the first input of the
  new row; account preset chips focus the new card's Account name
  input. Generalize the existing income-chip pendingFocus pattern
  into one small internal hook — one mechanism, all callers.

## P3 — Autocomplete + vocabulary

- New `src/ui/Autocomplete.tsx` (~180 LOC target; flag if over
  ~220): a light editable combobox per the W3C APG
  list-autocomplete pattern. `role="combobox"`,
  `aria-autocomplete="list"`, `aria-expanded`,
  `aria-activedescendant`; options `role="option"`. Opens from the
  FIRST typed character when matches exist (and on ArrowDown when
  closed); case-insensitive SUBSTRING match with the matched span
  emphasized (e.g. <strong>); at most 8 items; ArrowUp/Down move the
  active option; Enter selects (and stopPropagation so it does not
  also advance focus while the list is open); Escape closes; free
  text is ALWAYS allowed — never force a selection. Option selection
  happens on mousedown with preventDefault so no blur fires. Reuse
  the keyboard idioms of `src/ui/Menu.tsx`; do NOT reuse the Menu
  component itself (menu semantics ≠ combobox).
- New `src/model/vocab.ts` (pure, tested):
  - `ACCOUNT_TYPE_SEEDS`: Roth IRA, Traditional IRA, Rollover IRA,
    Inherited IRA, SEP IRA, 401(k), 403(b), 457(b), 529 Plan, HSA,
    Joint TOD, Individual, Trust Account, Checking, Savings, Money
    Market, CD, Brokerage, Variable Annuity, Fixed Annuity,
    Fixed-Index Annuity, VUL, IUL, Whole Life, Term Life,
    Donor-Advised Fund, Charitable Trust, Cash at Bank.
  - `CARRIER_SEEDS`: Jackson National, Pacific Life, Minnesota Life,
    Allianz, Athene, Nationwide, Lincoln Financial, Prudential,
    Equitable, Brighthouse, Securian, New York Life, MassMutual,
    Fidelity, Schwab, Vanguard.
  - `buildVocabulary(book)`: harvest account labels/captions,
    position labels, sub-account labels/captions, income labels and
    qualifiers across ALL clients; frequency-ranked;
    case-insensitive dedupe keeping the most frequent casing.
  - `suggest(bookTerms, seeds, query, limit = 8)`: book terms first
    (frequency desc, then alpha), unseen seeds after (list order);
    returns `{ text, matchStart, matchEnd, fromBook }[]`.
- Wiring: account name (both seed lists + book), position label
  (carriers + book), sub-account label (book), income source label
  (income preset names + book), account caption (book), income
  "Shown as" (Gross / After-Tax / Net + book).
- App plumbing (the ONLY sanctioned App.tsx touch, ~8 lines):
  `const vocabulary = useMemo(() => buildVocabulary(book), [book])`
  passed as a new optional prop to `<Form>` and `<Wizard>`; when
  absent the fields fall back to seeds-only (Form stays testable
  standalone). If Wizard needs a one-line prop pass-through, that
  single line is allowed with disclosure.
- PRE-AUTHORIZED TRIM if the session runs long: drop the caption and
  "Shown as" wiring — never the MoneyField core, the dirty-check, or
  the Autocomplete component.

## THE ROUND-RISK TEST (mandatory)

Deferred commit meets same-gesture click: type a value into a money
field, then IMMEDIATELY click "+ Add position" (no blur in between).
Both the committed value AND the new row must survive — the blur
commit runs synchronously before the click handler's state update.
Cover it with a test (pure sequencing of the two updates through the
shared onChange path) and screenshot scenario (9) below. The same
reasoning is why the autocomplete selects on mousedown-preventDefault
(no blur fires at all for option clicks).

## MUST NOT TOUCH (parallel-session contract)

`src/render/MapSvg.tsx`, `src/layout/layout.ts`,
`src/render/mapInteraction.ts`, `src/render/tokens.ts`,
`src/ui/MapTextEditor.tsx`, `src/model/types.ts`,
`src/model/book.ts`, `src/model/samples.ts`, `tests/book.test.ts`,
`tests/layout.test.ts`, `tests/mapedit.test.ts`,
`tests/contrast.test.ts`, `tests/overrides.test.ts`, and the app.css
map-chrome region and end-of-file (SESSION-30's) — your app.css
edits go in ONE delimited block opening with the banner comment
`/* S32 — rapid entry */` inserted INSIDE the form region
(immediately after the existing help-text rules), never at EOF.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — format.test.ts: stepMoney tier table; snap-to-grid from
  off-grid values; null start + plain-up → 100; floor at 0; base
  from a k/m draft. vocab.test.ts (new): frequency ranking; casing
  dedupe; book-before-seeds ordering; substring indices; limit 8;
  empty query → empty. form.test.ts: Enter chain advances through a
  select; the dirty-check helper (extract pure); the pendingFocus
  generalization; the round-risk sequencing test.
- Screenshots: (1) type "85k" in a Value, Tab → $85,000, map updated
  exactly once; (2) mid-typing "16" — the map still shows the prior
  value, no blank flash; (3) focus a filled field — text selected,
  typing replaces; (4) Shift+ArrowUp ×3 on Monthly Income Need —
  map ticks live 1k per press; (5) type "ja" in a Position label —
  "Jackson National" listed with the match emphasized, ArrowDown +
  Enter fills it; (6) a label used on client A ranks first when
  typing on client B; (7) Enter walks Income source → Amount →
  Period select → Shown as; (8) + Add position lands focus in the
  new row; (9) the round-risk scenario — type a value, immediately
  click + Add position, both changes survive.
- Browser verification MUST redirect all browser stdout/stderr to
  files under C:\tmp. Use preview port 4321 (SESSION-30 runs in
  parallel on another port).
- File map — touch: `src/form/Form.tsx`, `src/form/Wizard.tsx`
  (prop pass-through only), `src/ui/Autocomplete.tsx` (new),
  `src/model/vocab.ts` (new), `src/model/format.ts`, `src/App.tsx`
  (the ~8-line plumbing only), `src/styles/app.css` (block above),
  `tests/form.test.ts`, `tests/format.test.ts`, `tests/vocab.test.ts`
  (new). Budget ≈ 600–800 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-32-REPORT.md`.
