---
phase: 01-information-architecture
plan: 03
subsystem: ui
tags: [react, forms, typescript, information-architecture]

requires: [01-01]
provides:
  - "FinePrintSection rendered inside IncomeSection (was NeedSection); sectionMatches income branch carries footnotes"
  - "Positions/Sub-accounts nested groups each render a distinct help-text line"
  - "NotesSection renders 'No notes yet.' when empty"
  - "Form filter renders 'No fields match that filter.' when the trimmed query matches zero sections"
affects: [02-flow, 03-visual-craft]

actuals:
  tokens: 14500
  tasks: 3
  commits: 3

tech-stack:
  added: []
  patterns:
    - "sectionMatches is now computed once into a visibleSections array and reused for both per-section rendering and the zero-results check, instead of being called once per section plus once more for the check."

key-files:
  created: []
  modified:
    - src/form/Form.tsx
    - tests/form.test.ts
    - tests/data-filter-s48.test.tsx

key-decisions:
  - "tests/form.test.ts 'need fine print' realigned to 'income fine print' (IA-02, deliberate): renders IncomeSection and asserts NeedSection no longer carries the controls, instead of pinning fine print to Need."
  - "Task 1 baseline finding: the UI-SPEC's prediction ('all sections just disappear, panel goes blank') was wrong. The shipped code already rendered a zero-results message before this plan touched it — 'No matching data sections.', shipped in commit c44cae0 (2026-08-02), predating Phase 1. Task 3 built on that baseline rather than inventing a new state: it changed the message text to 'No fields match that filter.' and consolidated the six sectionMatches calls into one computed set, per the plan's explicit instruction to base the implementation on what task 1 observed."
  - "includeNeed prop left in place, unchanged. Confirmed (again, per plan's interface_context) it has no production caller — both call sites (Data panel, Wizard income step) pass includeNeed={false}; the true default (true) is reached only from tests. Not deleted; deferred to Phase 2's Wizard/panel role work as the plan directs."

patterns-established: []

requirements-completed: [IA-02, IA-03]

coverage:
  - id: D1
    description: "Fine print's editor and filter index both live in Income; Need no longer renders or indexes it"
    requirement: "IA-02"
    verification:
      - kind: unit
        ref: "tests/form.test.ts#income fine print > nests the renamed fine print controls in Income, not Need"
        status: pass
    human_judgment: false
  - id: D2
    description: "Positions and Sub-accounts each state their distinct purpose via help text"
    requirement: "IA-03"
    verification:
      - kind: unit
        ref: "tests/form.test.ts#nested-group help text > gives Positions and Sub-accounts distinct help lines"
        status: pass
    human_judgment: false
  - id: D3
    description: "Notes empty state matches Income/Accounts precedent"
    requirement: "IA-03"
    verification:
      - kind: unit
        ref: "tests/form.test.ts#notes empty state > states emptiness with zero notes and hides it with one or more"
        status: pass
    human_judgment: false
  - id: D4
    description: "Filter zero-results state: baseline proven, then final copy asserted"
    requirement: "IA-03"
    verification:
      - kind: unit
        ref: "tests/data-filter-s48.test.tsx#Data panel filter with zero matches > renders no sections and a stated message for a query nothing matches"
        status: pass
      - kind: unit
        ref: "tests/data-filter-s48.test.tsx#Data panel filter with zero matches > renders no zero-results message when the filter is blank"
        status: pass
    human_judgment: false

duration: 20min
completed: 2026-08-09
status: complete
---

# Phase 1 Plan 03: Fine Print Relocation, Nested-Group Help Text, Missing Empty States Summary

**Fine print's editor and filter index moved from Need into Income together in one commit; Positions/Sub-accounts and Notes gained the copy that was silently missing; the filter's zero-results state was proven to already exist (contrary to the UI-SPEC's guess) and its copy was updated to match the plan.**

## Performance

- **Duration:** ~20 min
- **Tasks:** 3
- **Files modified:** 3 (`src/form/Form.tsx`, `tests/form.test.ts`, `tests/data-filter-s48.test.tsx`)

## Accomplishments

- `FinePrintSection` now renders inside `IncomeSection` (after the `income-totals` field-grid, inside `<section data-form-section="income">`), removed from `NeedSection`'s standalone branch.
- `sectionMatches`'s `income` branch now carries `{ incomeSources, footnotes }`; the `need` branch dropped `footnotes`, keeping `monthlyNeed`/`needTag`/`asNeededAmount`. Editor and filter index moved in the same commit, per the plan's explicit instruction not to split them.
- `PositionRows` and `SubAccountRows` each render a `<p className="help-text">` under their `<h4>` with the UI-SPEC's verbatim copy, distinguishing "breakdown of this account's total" from "a carved-out pool with its own map shape."
- `NotesSection` renders `<p className="empty-state">No notes yet.</p>` when `notes.length === 0`, matching the Income/Accounts empty-state pattern exactly.
- The Form filter's zero-results state — proven in task 1 to already exist — now reads `No fields match that filter.` and is computed from a single `visibleSections` array instead of six separate `sectionMatches` calls (five per-section + one for the check).

## Task Commits

1. **Task 1: Establish the filter zero-results baseline** — `95badf9` (test) — added a test to `tests/data-filter-s48.test.tsx` proving the current (pre-change) zero-results behavior. No source file touched.
2. **Task 2: Move fine print editor and index into Income** — `4674244` (refactor) — `Form.tsx` render-site and `sectionMatches` move; `tests/form.test.ts` realigned.
3. **Task 3: Four copy strings** — `038fbd1` (feat) — Positions/Sub-accounts help text, Notes empty state, filter zero-results refactor + copy, plus new render assertions.

## Required Ruling 1: `tests/form.test.ts` realignment (deliberate, IA-02)

`tests/form.test.ts:337-354`'s `describe('need fine print', ...)` previously pinned fine print's controls to `NeedSection` — it rendered `NeedSection` and asserted `'Fine print'`, `'+ Add fine print line'`, `'Remove fine print line 1'` were present. That assertion is now **stale by design**, not by accident: Phase 1 (IA-02) deliberately moved fine print's home to Income because its fields (Gross/Net) describe an income figure, not the Need number.

The test was rewritten (not skipped, not deleted) to `describe('income fine print', ...)`: it renders `IncomeSection` and asserts the same three positive strings there, then renders `NeedSection` with the same data and asserts `'Fine print'` and `'+ Add fine print line'` are **absent**. This proves both the new home and the vacated one in a single test, matching the plan's `<behavior>` spec for task 2.

## Required Ruling 2: observed zero-results baseline (task 1)

The UI-SPEC flagged this as unverified and predicted: *"all sections just disappear, panel goes blank."* That prediction was **wrong**. Direct git history (`git log -S"No matching data sections"`) shows the message `<p className="empty-state">No matching data sections.</p>` was already shipped in commit `c44cae0` ("feat: connect map selection to data", 2026-08-02) — three days before this milestone's Phase 1 kickoff, and untouched by plans 01-01 or 01-02. Filtering to zero matches has never produced a blank panel in the shipped app; it has always rendered zero `form-section` elements plus a stated message.

Because a fix written against the UI-SPEC's guess would have been a fix written against nothing, task 3 built on the proven baseline instead: it kept the "state something, don't go blank" behavior, changed the exact copy to the plan's specified string (`No fields match that filter.`), and consolidated the sectionMatches calls into one computed array (a correctness/performance cleanup the plan called for as a side effect, also flagged in the plan's threat model T-01-06). The task 1 baseline test in `tests/data-filter-s48.test.tsx` was then updated in task 3's commit to assert the new final copy, documented inline in the test file with both the baseline finding and the update.

## Line-Number Drift Encountered

Per the plan's `<CRITICAL_line_number_drift>` warning, every cited line number was approximate. Actual locations found by content search (2026-08-09, after plans 01-01/01-02 landed):

| Site | Plan's cited line | Actual line found |
|-|-|-|
| `FinePrintSection` render (was in `NeedSection`) | 523/531 | 531 (removed) |
| `NeedSection` definition | — | 482 |
| `IncomeSection` `field-grid income-totals` close | 647-648 | 669-670 (`</div>` then `<FinePrintSection/>` then `</section>`) |
| `sectionMatches` function | 1467-1487 | 1498-1518 |
| `sectionMatches` need-branch object literal | 1476-1481 | 1506-1512 |
| `<h4>Positions</h4>` | 666 | 688 |
| `<h4>Sub-accounts</h4>` | 741 | 763 |
| `NotesSection` `row-list` close / add button | 1290/1291 | 1321/1322 |
| `sectionLabels` map | plan cited via UI-SPEC as 1459-1465/1490-1496 | 1500-1506 (5 keys, confirmed) |
| Test pinning fine print to Need | 273-291 | 337-354 |

All edits were located by content (element names, class names, JSX structure), not by jumping to cited numbers, per the plan's mandate.

## `includeNeed` Finding for Phase 2

Confirmed unchanged (plan explicitly deferred deletion to Phase 2): `includeNeed` still defaults to `true` on `IncomeSection`, but both production call sites — the Data panel (`Form.tsx` `IncomeSection` render in `Form`) and the Wizard income step — pass `includeNeed={false}` explicitly. The `true` default path (embedded `NeedSection` rendered inside `IncomeSection`) is reached only from tests (e.g. the new `nested-group help text` test uses the default). No change made; this plan only relocated `FinePrintSection`, which is unconditional (not gated by `includeNeed`) and sits at the `IncomeSection`/`section` level, not inside the `includeNeed` branch.

## Wizard Consequence (documented, not implemented)

Per the plan, no `Wizard.tsx` edit was made. Because `NeedSection`'s and `IncomeSection`'s JSX changed, the Wizard's income step (which renders `IncomeSection`) now inherits fine print, and its need step (which renders `NeedSection`) no longer does. This is the intended, consistent outcome — the Wizard and the Data panel now agree on where fine print lives — but it was not independently verified against `Wizard.tsx` render output in this plan; that verification is in scope for whichever future plan next touches the Wizard.

## Verification

```
$ npm run test -- tests/form.test.ts tests/data-filter-s48.test.tsx

 ✓ tests/data-filter-s48.test.tsx (5 tests) 26ms
 ✓ tests/form.test.ts (22 tests) 41ms

 Test Files  2 passed (2)
      Tests  27 passed (27)
```

```
$ npm run build

> tsc -b && vite build
✓ 66 modules transformed.
dist/index.html                                            0.54 kB │ gzip:   0.33 kB
dist/assets/index-C05TgUFx.css                             45.54 kB │ gzip:   9.20 kB
dist/assets/index-BFXwlxeB.js                              415.44 kB │ gzip: 128.49 kB
✓ built in 1.73s
```

`sectionLabels` map confirmed still exactly 5 keys (`client`, `income`, `accounts`, `need`, `notes`) at `Form.tsx:1500-1506`.

## Deviations from Plan

None beyond the two required, explicitly-planned rulings documented above (test realignment and baseline finding, both anticipated by the plan itself as required SUMMARY content, not unplanned deviations). No Rule 1-4 auto-fixes were needed; no auth gates encountered.

## Known Stubs

None. All four copy changes are live, wired to real data conditions (`positions`/`subAccounts` render unconditionally per account so their help text always applies; `notes.length === 0`; `query && visibleSections.length === 0`).

## Threat Flags

None. The one relevant threat register entry (T-01-05, fine print filter-index move) was the direct subject of task 2's `<behavior>` assertions — editor and index were moved together and both directions are test-covered. No new trust-boundary surface introduced.

## User Setup Required

None.

## Next Phase Readiness

- IA-02 satisfied: fine print's editor and filter index both live in Income; Need no longer surfaces gross/net income footnotes.
- IA-03 satisfied: Positions vs. Sub-accounts is now self-explanatory in the UI; Notes and the filter both state emptiness/zero-results instead of rendering nothing.
- Roadmap Phase 1 success criteria 2 and 3 (every field has one nameable section; fine-print overlap resolved) are TRUE.
- Fine-print empty state (footnotes.length === 0) remains deliberately unaddressed — per UI-SPEC Finding 6, folded into Phase 2's gross/net emphasis question, not a Phase 1 gap.
- No blockers for Phase 1's remaining plans (04, 05).

---
*Phase: 01-information-architecture*
*Completed: 2026-08-09*
