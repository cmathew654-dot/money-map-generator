# S53 P5 — Systematic Audit Program for Money Map (draft for Cyril's review)

Drafted 2026-08-05 (s53), per the s52 handoff §5 mandate. Research base: web research 2025-2026 (citations inline) + tonight's full-matrix baseline (2,416 tests / 19 projects), adversarial review s52, axe + keyboard audit s53. Status: DRAFT — decision points marked ⚖ are Cyril's.

## 1. Premise — what tonight proved

- **The suite measures "does it work", not "is it sound."** 1,536 passed while 3 universal failures (lease/undo/multitab family) sat pre-existing in every browser project, invisible to lanes that only run targeted specs. Full-matrix runs happen too rarely; each one this sprint found something the green suite hid.
- **The measured AI-code defect profile is duplication + error-masking, not broken logic.** GitClear 2026: block duplication +81% since 2023, in-commit copy/paste 9.4%→15.7%, refactoring collapse 21%→3.8%, error-masking constructs +47% (gitclear.com/the_ai_code_quality_maintainability_gap). Veracode: ~45% of AI code carries an OWASP flaw (veracode.com/blog/spring-2026-genai-code-security). None of our 3,200 tests hunts this class.
- **Tonight's machinery works and is repeatable:** 3 finder lenses → dedup → 2 refuters/finding turned 13 filed findings into a truthful ledger (2 refuted, every severity bounded, zero data-integrity survivors); the interactive gate keeps catching what green tests miss (gate12's state-context class; the A1b clobber).
- **a11y state:** 0 critical/serious axe violations, no focus traps — but 52 SVG text nodes are contrast-UNVERIFIED (axe "incomplete" ≠ pass), keyboard cannot multi-select (F14 → flow creation keyboard-unreachable), and the "text-zoom-200" project turned out to be a mislabeled 640×360 reflow probe: true text-resize behavior (WCAG 1.4.4) has never been tested.

## 2. Program at a glance

| Layer | Cadence | Tooling | Gate |
|-|-|-|-|
| Full 19-project matrix + triage vs ledger | per milestone seal (m-tag) | 8-worker sweep → serial re-confirm of failures | new-vs-ledger delta = 0 |
| Adversarial subsystem rotation | 1 subsystem / session (s54→s57) | 3 lenses → dedup → 2 refuters, blind RED-first test lanes | adjudicated ledger, sprint-caused fixed in-session |
| Clone / error-masking sweep | monthly | jscpd + grep class (empty catch, swallowed promise, guard-at-callsite) | trend review, not hard gate |
| Mutation testing (logic modules only) | per PR incremental; full at milestone | Stryker vitest-runner + ts-checker, `--since --incremental` | `thresholds.break` on scoped modules |
| Property/model-based | fixed seeds per PR; wide nightly | fast-check `fc.commands` model of selection+undo; `scheduledModelRun` for lease races | failure blocks; failing seed checked in |
| Metamorphic relations | nightly | Playwright, 6-10 MRs | failure blocks |
| Monkey/fuzz | nightly, 20 fixed seeds | gremlins.js seeded + console/pageerror/NaN oracle | crash or console error blocks |
| a11y automated | per PR | @axe-core/playwright multi-state | zero NEW violations + incomplete-count budget |
| a11y manual (keyboard + SR) | per release | scripted checklist + NVDA | P0/P1 block |
| Charter-based exploratory | 3-6 sessions / release | SBTM sheets + PROOF debrief | debrief held, findings triaged |
| Judge calibration | monthly | fixed human-adjudicated sample (s52 ledger is sample #1) | refuter agreement tracked |

## 3. Workstreams

### A. Adversarial subsystem rotation (the s52 template, made recurring)
One subsystem per audit session, full stack each time: finder lenses (correctness / regression / a11y) → dedup → 2 independent refuters per finding (mechanism + severity/provenance split, refuters blind to finder identity) → adjudicated ledger committed to docs/lanes/. Provenance protocol: every non-ledger failure gets a freeze-tag re-run before earning "regression."
Rotation (evidence-ordered):
1. **s54 — persistence / undo / lease.** Tonight's 3 universal pre-existing failures all live here (multitab-history:84 money-input formatting, app-guidance-s40:84 lease takeover timeout, certification:86 rapid tab handoffs). Highest-risk subsystem, financial data.
2. **s55 — Form/Data panel.** Newest large surface (T-FORM), sticky seam found by a screenshot lane not by tests; F8/F9 live here.
3. **s56 — layout/geometry.** Footnote edit-hit blanket (720px rect eating note clicks), ellipse-cap z-order intercept, chip-drag smell (map-keyboard:110) — all pre-existing, all geometry.
4. **s57 — print/export.** The hidden print copy doubles every locator and has NEVER been audited as a surface of its own.

### B. Clone & error-masking sweep (AI-code-specific)
Monthly: jscpd duplication delta on src/ + grep class for `catch {}`/`.catch(() => {})`/guard-at-callsite clones of shared-function guards. Rationale: §1's measured profile — our risk is divergent copies and swallowed errors, which no test catches. Output: trend table in the ledger; consolidation items become lane contracts.

### C. Mutation testing — scoped or it's noise
Stryker `@stryker-mutator/vitest-runner` (works 2026; constraints: coverageAnalysis forced perTest, threads only, no browser mode — stryker-mutator.io/docs/stryker-js/vitest-runner) + typescript-checker to kill type-invalid mutants. **Scope `mutate` to logic modules only:** layout.ts geometry, applyMapTextEdit + text/aggregate rules, selection reducers, money math. Never React view code (mutation score there is noise). Per-PR: `--since main --incremental` (1-5 min); full run at milestone. ⚖ Threshold: propose break=60 to start, ratchet to 75+ on money/state paths.

### D. Property/model-based testing — aimed at the lease/undo cluster
fast-check `fc.commands` model of the selection+undo state machine (commands: select, shift-extend, promote-text, edit, undo, redo, delete; model = simplified sets, not a mirror). `scheduledModelRun` variant targets exactly the two-tab lease races that produced tonight's universal trio and s46's split-brain. Invariants: undo(do(x))=x; selection ⊆ live nodes; totals invariant under move/reorder; no NaN escapes money math; serialize→deserialize identity. Failing seed + replayPath checked in as regression (fast-check.dev/docs/advanced/model-based-testing).

### E. Metamorphic relations — the no-golden-output tool
6-10 MRs, nightly, each with a one-line necessity justification (a wrong MR = permanent false failure): pan/zoom → values unchanged, only transforms; reorder independent edits → identical state; scale all inputs ×k → outputs ×k; rename node → no numeric change; theme switch → same DOM structure, only tokens.

### F. Seeded monkey testing (replaces nothing — adds the chaos layer)
gremlins.js via Playwright addInitScript, `new gremlins.Chance(seed)`, 20 fixed seeds nightly, trace on, species constrained to the app shell (block navigation/downloads). The oracle is the point: console error, pageerror, unhandled rejection, NaN-in-DOM, state still serializes. Unseeded monkey findings are unactionable — seed lives in the test title. Prefer the smart-monkey variant (role-selector random walk with seeded PRNG) for the canvas, where blind pixel clicks mostly hit whitespace.

### G. Accessibility as a compliance workstream (own backlog, own gate)
- **Truth in naming:** rename `chromium-text-zoom-200` → `chromium-reflow-640` (it's a 640×360 viewport probe, nothing more) and rewrite its 4 broken spec-helper assumptions (fixed 24px click insets at 25% map zoom). **Add real text-resize coverage** (WCAG 1.4.4) as a new project.
- **WCAG 2.2 deltas to face explicitly:** 2.5.7 Dragging Movements — ⚖ every drag needs a non-drag alternative (product change; arrows/Alt-arrows already cover nudge+resize — inventory the gaps: chip drag, rotate handle, connector drop). 2.5.8 Target Size 24px (inspector buttons measure 28px < the stricter 32px AAA-ish bar tonight's test asserts — ⚖ pick the bar). 2.4.11 Focus Not Obscured (the fixed bench covering the Help button at 640px is a live instance — fix shipped/pending from s53).
- **SVG text layer:** 52 axe-incomplete contrast nodes = manual verification protocol once per theme (script computes fg/bg pairs from tokens; human spot-checks); 9 aria-prohibited-attr `<text>` nodes → move labels onto role-bearing wrappers (pairs with F7's aria-hidden money values — one lane, one model).
- **F14 (new, s53):** keyboard multi-select — ⚖ interaction model needed (Shift+Enter extends?); until then flow creation is keyboard-unreachable and the status copy says "shift-click adds" to keyboard users.
- **Cadence:** axe multi-state per PR (map, panel open, editor open, present mode, both themes) with an "incomplete" budget; keyboard checklist per release; NVDA pass per release on the advisor-demo flow; full SR sweep quarterly. A green axe run is ~57% of issues by Deque's own 2,000-audit study — never report it as compliance (deque.com/blog/automated-testing-study-identifies-57-percent).

### H. Charter-based dogfooding (SBTM) — replaces free-click
90-minute uninterrupted sessions, charter = "Explore <area> with <resources> to discover <risk>", session sheet (TBS split, on/off-charter %, bugs, obstacles), PROOF debrief within 15 min, second person present. A zero-notes session is a failed session, not a passed build. First charter backlog (risk-ordered): two-tab lease dance with real edits; aggregate/retype flows on a saturated real map; keyboard-only advisor demo; import→edit→export round trip; present-mode walkthrough on the dogfooder's own data. The dogfooder's existing retest list converts into charters #1-#3.

### I. Review-fleet hygiene
Tonight's finder/refuter machinery stays the template, with research-backed tightening: refuters blind to finder identity and to each other (already house pattern); rubric-first verdicts; the s52 adjudicated ledger becomes calibration sample #1 — re-run a future fleet against it monthly and track agreement drift. Constraint acknowledged: all agents currently share one model family (codex benched), which research says inflates approvals 10-25% via self-preference (futureagi.com/blog/evaluating-llm-judge-bias-mitigation-2026) — mitigation until a second family returns: adversarial refuter prompts ("default to refuted if uncertain") + human adjudication of every HIGH.

### J. Ops hygiene (tonight's incidents, made rules)
- **Lane prompt standard block** (every lane, no exceptions): npm-locked / pnpm FORBIDDEN in all forms incl. `pnpm exec` / no npx / node_modules\.bin direct / no servers unless the contract names the port / no --update-snapshots / no commits. (Tonight a lane started the 4280 server via `pnpm exec` because the forbidden-list block was omitted from two of five prompts. Bundle stayed hash-correct; node_modules verified uncontaminated.)
- **Lanewatch stale-flag fix:** the watcher keys on task-output growth and never learns completion → it re-flags finished lanes on every tool call. Patch guardrails.js to consume task completion events (or mtime-of-final-response) — classifier blocks agent edits to guardrails.js, so this is Cyril's one-line-ish patch; diagnosis on file.
- **Provenance receipts:** every lane merge gets the one-line trailer (agent, model, contract file, verification run) — auditors ask for exactly this, and EU AI Act disclosure pressure lands Aug 2026 (codacy.com/what-auditors-will-ask-about-ai-generated-code-in-2026).

## 4. Session entry/exit criteria
**Entry:** suite green at HEAD, gate12 clean, ledger current, subsystem freeze-tag cut.
**Exit:** adjudicated ledger committed; sprint-caused findings fixed + verified; pre-existing findings owner'd (fix-now / next-session / accepted); gate12 extended with ≥1 check born from the session's worst finding (state-context precedent); handoff names the next subsystem.

## 5. Proposed first three sessions
1. **s54:** persistence/undo/lease rotation + fast-check model pilot (D) aimed at the same subsystem + Stryker pilot scoped to applyMapTextEdit/selection reducers (C). The three ledgered universal failures are the entry tickets.
2. **s55:** Form/Data rotation + charters v1 (H) with the dogfooder + a11y lane 1 (SVG label/role model for F7/F8 + aria-prohibited cleanup).
3. **s56:** layout/geometry rotation (footnote rect, ellipse z-order, chip-drag) + monkey pilot (F, smart-monkey variant) + reflow-640 rename and spec-helper repair.

⚖ Decision points for Cyril: mutation threshold (C), 2.5.7 drag-alternative scope (G), target-size bar 24 vs 32px (G), F14 keyboard multi-select model (G), webkit dblclick support level (browser-scoped s51 gap — fix, ledger, or declare Chrome/Edge-only), monkey nightly host (this PC vs elsewhere).
