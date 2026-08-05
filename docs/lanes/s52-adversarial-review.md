# s52 adversarial review — adjudicated verdicts (2026-08-05)

3 finder lenses (correctness / regression / a11y-keyboard) → 13 deduped findings → 2 independent refuters each (mechanism + severity/provenance). Verdicts below are refuter-adjudicated, not finder claims.

## Fixed during s52 (before m4)

| F | Finding | Verdict | Fix |
|-|-|-|-|
| F5 | Wizard onSelectAccount hard-replace demoted fresh text promotion (guided setup + Details flow) | CONFIRMED, s52-caused (the 50c2ddd asymmetry) | 6fdf8fa routes it through panelSelectionKeys |
| F6 | Aggregate notice discards staged font-size (A± preview reverts on every notice exit; only onCommit persisted size) | CONFIRMED all links; **s51 T-RETYPE regression** (ad7f6b4/b57b737, one day old); moderate-cosmetic, alternate path exists (inspector ±) | s52 fix lane (in flight at write time) |

## Ledger — confirmed, pre-existing, NOT s52 (severity is post-refutation)

| F | Finding | Post-refutation severity | Provenance | Note |
|-|-|-|-|-|
| F1 | Ghost text selection survives account deletion (mapTargetKeyStillExists passes text: keys) | Cosmetic, self-heals on next click/reload. Finder's "phantom Move write" REFUTED (nudge bails on missing rect, layout.ts:3182); real residue = inert Text-size± override via withOverride (MapInspector.tsx:657-663) | s49 predicate + s51 b1a0303 | Fix = existence-check text: keys in mapTargetKeyStillExists |
| F2 | Ctrl+C/Ctrl+D with text/empty selection wipes clipboard (App.tsx:1509 unconditional assign) | Annoyance; 2s recovery; nothing persisted | pre-s51 (19e6533) | 1-line guard candidate |
| F3 | Need supporting-note onFocus selects without shouldFocusSelect guard (MapSvg.tsx:3174) | Keyboard-Tab collapse of multi-selection confirmed; mouse-path outcome DISPUTED between refuters (batching may restore) | s51 omission (guard exists only for notes, 3374) | Same class as known arrow-editor clobber — fix the class together |
| F4 | connect-id outranks layout-key: income/need text not click-selectable | Cosmetic — unwired feature (rotate was never account-external); only font-size unreachable | pre-s51 (355779c) | text:need:supporting ironically reachable via F3's bug |
| F7 | Account total/title/caption aria-hidden in EDIT mode (value aria-label dead, MapSvg.tsx:1570) | Minor; edit-mode only — present/view/export keep money labels (client-facing surface clean); Data panel is full equivalent; positions/sub-accounts/income/need keep labels | pre-s51 (4155ea7) | a11y workstream |
| F8 | Identical accessible names ("Edit account value" ×N) | REFUTED as filed (account group label disambiguates serial traversal). Residual: position ROWS within one account are identical (unnamed row g, MapSvg.tsx:1492) + generic label masks visible position name | pre-s51 (1b942ce) | a11y workstream, downgraded |
| F9 | Focus steal to Data heading on selection change (App.tsx:950-954 truthiness guard) | Med for keyboard (Tab onto arrow → Ctrl+Arrow retarget unreachable w/ panel open); low for mouse (scroll snap, no preventScroll). Account clicks DON'T steal (same-event batching) — finder's main trigger narrowed | pre-s51 (206aa46 + b40e2a6) | |
| F10 | Escape double-fires: SVG capture preventDefaults w/o stopPropagation; App window ladder has no defaultPrevented check (App.tsx:957) | Low-med; one press clears selection AND closes panel; 2-action recovery | pre-s51 (964e89b) | 1-line candidate: defaultPrevented check in the ladder |
| F11 | No keyboard path to text: selection (no onFocus-select on hit rects; Enter/Space opens editor) | Low — actual exclusive losses: inspector Font size ± and Reset text position only. Rotation [ ] , nudge, Details all keyboard-reachable | pre-s51 gap (s52 only changed which CLICK promotes) | a11y workstream + promotion design |
| F12 | Promotion is silent for AT (badge count-only; account→text keeps count=1 → no live-region mutation) | Low; requires AT-user-by-mouse (keyboard can't promote at all) | Silent-swap aspect s52 (accountTextClickKey); badge s51 | Candidate: badge announces selection KIND — UX copy = Cyril sign-off |
| F13 | aria-keyshortcuts wrong: text nodes omit brackets (which work); account groups say BracketLeft/Right (code names, not key values) | Very low — discovery only | attrs pre-s51; became inaccurate at s51 O-ROT (c338fa0) | Two attribute strings |

## Refuter scorecard
13 filed → 11 confirmed in some form, 2 materially refuted/downgraded (F1's scary write, F8 as filed), every severity reduced or bounded, zero data-integrity findings survived. s52-caused: F5 (fixed) + F12's announcement aspect (low). s51-sprint-caused: F6 (fixed), F3 guard omission, F13 onset. All else pre-s51.

Cross-check note: F3's mouse-path dispute (refuter A: shift-click appends 'need', unrecoverable; refuter B: same-click batching restores) is unresolved from code alone — settle empirically when the clobber class is fixed.

## s54a ledger delta (2026-08-05, 5b3df85)

| item | verdict |
|-|-|
| F2 clipboard wipe | FIXED 5b3df85 |
| F3 note onFocus clobber | FIXED 5b3df85 |
| F15 shift-click order-sensitivity | RECLASSIFIED test-artifact (panel sidebar [data-account-id] dup); real residue fixed below |
| blank-canvas modifier-click wipes selection | FIXED 5b3df85 (new, F15 residue) |
| 28px inspector targets (universal trio b) | FIXED 5b3df85 (32px) |
| bench covers rail 640w (reflow-640 real bug) | FIXED 5b3df85 |
| lease-banner timeout (universal trio c) | WITHDRAWN - premise wrong, app-guidance-s40 already green; 250ms deferral is load-bearing for the takeover affordance |
| multitab money format (universal trio a) | PARTIAL - render path fixed; spec still red on focused-draft snapshot semantics (UX decision: should a focused draft carry $-format?) -> s54 |
| NEW: editor rail overflows 360px-tall viewport (Help off-screen) | LEDGERED -> s54 |
| NEW: onSupportingFocus is dead UI in shipped data (coverage note never fits 257px card) | LEDGERED -> s54 |

## s54 ledger delta (2026-08-05, 62c9a09 + e6b885b + 8c69a1d)

| item | verdict |
|-|-|
| editor rail overflows 360px viewport | FIXED 62c9a09 (flex collapse under 480px height) |
| onSupportingFocus dead at 257px default | KEEP 62c9a09 ruling - need card is user-resizable, path live on widened cards |
| arrow onFocus clobber (s54 fix 1) | WITHDRAWN - premise wrong, arrow g never takes pointer focus; new spec locks survival 62c9a09 |
| footnote edit-hit intercepts shift-click (s54 fix 2) | WITHDRAWN - spec green at HEAD |
| ellipse-cap intercepts canvas clicks (s54 fix 3) | WITHDRAWN - spec green at HEAD |
| RESET ITEM clip (s46) | CLOSED MOOT - Cyril ruling 2026-08-05, inspector redesigned twice since |
| multi-writer selection defect (4 symptoms) | FIXED e6b885b+8c69a1d - selectionReducer single owner, property test, s52 contract green |
| mid-edit money format | OPEN - Cyril ruled formatted, live behavior is raw-on-focus (Form.tsx:351) -> needs behavior call |

## s55 ledger delta (2026-08-05, 950051e + dfff3be)

| item | verdict |
|-|-|
| mid-edit money format (Form focus path) | CLOSED AS-IS - Cyril ruling, raw-on-focus stays; multitab spec expectation aligned to formatted (dfff3be) |
| undo after multi-item align not one step | FIXED 950051e - gesture-start chip-freeze wrote outside history; historyBaselineRef makes pre-freeze the undo target |
| income amount hit-rect swallows label pointers | FIXED 950051e - hit rect now amount-line only (3 specs green) |
| keyboard note spawns off visible centre | FIXED 950051e - spawn at visible centre (deliberate change, s49 unit expectation updated) |
| 5 stale specs (wizard entry, heading copy, ClientCombobox drift, money expectation, banner copy) | REALIGNED dfff3be - tests only |
| full-sweep baseline | 15 failed -> 6 failed / 132 passed (3 a11y-parked, 2 multitab-unclear, interaction-regression:852) |
| extended-certification:850-853 selectOption combobox drift | LEDGERED - inside a11y-parked test, fix when unparked |
| tab-choreography specs (app-resilience:82, certification:87) | RETIRED 833ca83 - beyond product intent per Cyril (one-user tool); lease protection stays |
| undo + open Data dialog | RULED stays-open, spec realigned 833ca83 |
| reflow 200% zoom overflow | PHANTOM 2e65429 - layout was already correct; spec measured pre-canvas-first UI (.form-pane pre-guided, Guide me button, Amount note field, .client-select) - realigned, fully green |
| reflow long-value reachability check | TRIVIAL-PASS - wizard field 609px never scrolls; needs a genuinely narrow field to bite, none exists today |
| final sweep baseline | 134 passed / 2 failed (axe harness broken, WCAG text-spacing) / 5 skipped - every red is knowingly-parked a11y |
