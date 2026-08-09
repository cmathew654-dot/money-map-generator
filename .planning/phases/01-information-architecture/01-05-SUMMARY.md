---
phase: 01-information-architecture
plan: 05
subsystem: testing

requires:
  - phase: 01-01
    provides: valueTag/needTag/qualifier controls
  - phase: 01-02
    provides: shipped-taxonomy ground truth
  - phase: 01-03
    provides: fine print in Income, nested-group help text, empty states
  - phase: 01-04
    provides: after-tax naming ruling, as-needed label alignment
provides:
  - "Full unit suite (813/813) and canonical e2e project (chromium-1280x720) run with every failure dispositioned; zero new breakage"
  - "IA-01 through IA-06 marked complete in REQUIREMENTS.md (fixed a stale traceability row for IA-04) and ROADMAP.md Phase 1 progress row updated"
affects: [04-verify]

actuals:
  tokens: 3000
  tasks: 1
  commits: 1

tech-stack:
  added: []
  patterns: []

key-files:
  created:
    - .planning/phases/01-information-architecture/01-05-SUMMARY.md
  modified:
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md

key-decisions:
  - "Task 1 only, per orchestrator scoping — Task 2 (blocking human-verify checkpoint) intentionally not attempted; it goes to Cyril directly."
  - "ROADMAP.md Phase 1 row left at 4/5 plans (not bumped to 5/5): Plan 01-05 itself isn't finished until Task 2's checkpoint resolves. Status text updated instead to record that verification passed and only Cyril's sign-off remains."
  - "The 3rd of the '3 accessibility' pre-existing parked-red category did not manifest under the canonical single-project scope this task runs (only 2 did). The category count was established across a broader baseline; the missing 3rd is presumed project-specific and stays Phase 4's full-sweep territory (VERIFY-01/02), not chased here."

requirements-completed: [IA-01, IA-02, IA-03, IA-04, IA-05, IA-06]

coverage:
  - id: D1
    description: "Full unit suite passes with zero failures"
    verification:
      - kind: unit
        ref: "npm run test — 61 files, 813 tests"
        status: pass
    human_judgment: false
  - id: D2
    description: "Canonical e2e project (chromium-1280x720) run; every failure dispositioned, new-breakage bucket empty"
    verification:
      - kind: e2e
        ref: "npx playwright test --project=chromium-1280x720 — 132 passed, 4 failed (all dispositioned pre-existing/stale-baseline), 5 skipped"
        status: pass
    human_judgment: false
  - id: D3
    description: "IA-01..IA-06 marked complete against evidence in REQUIREMENTS.md and ROADMAP.md"
    verification:
      - kind: other
        ref: "gsd-tools query requirements.mark-complete IA-01..IA-06 (fixed stale IA-04 traceability row); manual ROADMAP.md Progress row edit"
        status: pass
    human_judgment: false

duration: 25min
completed: 2026-08-09
status: complete
---

# Phase 1 Plan 05, Task 1: Suite Gate with Explicit Dispositions Summary

**Full unit suite (813/813) and canonical e2e project (chromium-1280x720, 132/141 passed) run with every failure classified into a named bucket — 2 pre-existing accessibility failures, 2 stale visual baselines (confirmed diff-clean of the expected Phase 1 copy changes) — zero new breakage, so IA-01..IA-06 were marked complete.**

## Performance

- **Duration:** ~25 min (most of it the ~3-minute Playwright run, plus diff inspection)
- **Tasks:** 1 (Task 1 of 2 — Task 2 is a blocking human-verify checkpoint, intentionally not run here)
- **Files modified:** 2 (`.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`)

## Verification Output

**Unit suite — `npm run test`:**
```
Test Files  61 passed (61)
     Tests  813 passed (813)
```
Zero failures.

**Canonical e2e project — `npx playwright test --project=chromium-1280x720`:**
```
4 failed
5 skipped
132 passed (3.0m)
```

## Disposition Table

| # | Test | Bucket | Reason |
|-|-|-|-|
| 1 | `app-resilience.spec.ts:6` "file input is named and account summaries contain no nested controls" | 1 — Pre-existing parked red (accessibility) | Fails with an axe-core harness error ("No elements found for include in page Context"), not a content violation. Matches the pre-existing "Axe Automation Harness (Broken)" issue documented in `.planning/codebase/CONCERNS.md` (harness not executing, predates this phase). Scope (`.form-pane`, shape-group `nested-interactive`/`label` rules) touches account-card shape controls, not any field this phase edited. |
| 2 | `extended-certification.spec.ts:716` "WCAG text spacing and forced colors preserve content and boundaries" | 1 — Pre-existing parked red (accessibility) | `paragraphSpacing` assertion fails (expects `true`, gets `false`) under a synthetic global CSS override (forced letter/line/word spacing + 2em paragraph margin) — a generic CSS-mechanism check unrelated to any IA-01..06 copy or field this phase touched. |
| 3 | `visual.spec.ts:44` "editor" | 4 — Stale visual baseline | Diff inspected directly (`editor-diff.png`): confined to the Data panel — taller Income section (Qualifier column, "Printed beside the amount..." help lines from IA-04), fine print relocated into Income (IA-02), Positions/Sub-accounts help text (IA-03), and the "AFTER-TAX"→"TAXABLE" map tag (IA-05). No moved map geometry, no color changes, no missing map elements. Baseline regeneration is deferred to Phase 4 VERIFY-01 per the plan's ruling (already flagged in 01-04-SUMMARY.md before this phase's remaining copy changes landed). |
| 4 | `visual.spec.ts:62` "editor with map inspector" | 4 — Stale visual baseline | Same root cause and same diff-inspection confirmation as #3 (`editor-inspector-diff.png`) — Data-panel copy/layout only, no map-geometry or color regression. |

**Bucket 3 (new breakage): empty.**

**Not a failure, but notable — `interaction-regression.spec.ts` (the "1 interaction regression" parked-red category) ran green end-to-end** in this canonical project (18/18 tests passed, including the "As needed" locator realigned in plan 01-04 at line 993). Its formal parked-red disposition still belongs to Phase 4 (VERIFY-02) per the plan — this run does not unpark it, just observes it green under this project/scope.

**Skipped (5, not dispositioned as failures):**
- `app-resilience.spec.ts:83` "focused follower enables mutation controls after ownership transfers" — unconditional `test.skip`, multitab category (1 of 2).
- `certification.spec.ts:88` "writer ownership survives rapid tab handoffs with edits" — unconditional `test.skip`, multitab category (2 of 2).
- `certification.spec.ts:179` "200 percent zoom remains operable" — project-gated (`chromium-text-zoom-200` only), not applicable to canonical project.
- `s51-selection-visual.spec.ts:3` "selected account has a visible selection ring" — project-gated (`chromium-1440x900` only).
- `visual.spec.ts:136` "selected account, arrow, note, and calculated text" — project-gated (`chromium-1440x900` only).

The documented "3 accessibility" parked-red count only produced 2 observed failures under this task's canonical single-project scope; a 3rd, if project-specific, is Phase 4's full 15-project sweep to surface, not chased here.

## Requirements and Roadmap Updates

- `.planning/REQUIREMENTS.md`: ran `gsd-tools query requirements.mark-complete IA-01 IA-02 IA-03 IA-04 IA-05 IA-06`. All six checkboxes were already `[x]` from prior plans' commits, but the traceability table had a stale row — `IA-04` still read "Pending" while its checkbox was checked. The tool corrected it to "Complete", matching IA-01/02/03/05/06.
- `.planning/ROADMAP.md`: Phase 1 Progress row's Status column updated from "In Progress" to "Verification recorded (IA-01..IA-06 complete); pending Cyril's checkpoint sign-off". Plans Complete count left at 4/5 — Plan 01-05 itself isn't finished until Task 2's checkpoint is resolved with Cyril directly (out of this task's scope, per the phase list's own convention of marking a plan `[x]` only once its checkpoint has resolved, as seen with 01-04).

## Task Commits

1. **Task 1: Suite gate with explicit dispositions** — committed as `docs(01): record phase 1 verification dispositions` (REQUIREMENTS.md, ROADMAP.md, 01-05-SUMMARY.md)

## Decisions Made

- Task 2 (checkpoint) intentionally not attempted — reserved for Cyril directly, per the orchestrator's explicit instruction.
- ROADMAP.md plan count deliberately not bumped to 5/5 (see key-decisions above) — a truthful record beats a convenient one.

## Deviations from Plan

None — plan executed exactly as written for Task 1's scope. No source or test file touched; no baseline regenerated; no package installed.

## Known Stubs

None.

## Threat Flags

None. This task is read-only against source/tests (runs, does not modify, the suites) and only edits two doc files plus its own SUMMARY.

## Self-Check: PASSED

- FOUND: .planning/REQUIREMENTS.md (IA-04 traceability row now "Complete")
- FOUND: .planning/ROADMAP.md (Phase 1 Progress row updated)
- FOUND: .planning/phases/01-information-architecture/01-05-SUMMARY.md (this file)

## User Setup Required

None.

## Next Phase Readiness

- All six Phase 1 requirements (IA-01..IA-06) are marked complete against evidence; zero new breakage in either suite.
- Task 2's checkpoint (Cyril walking the panel and confirming section-nameability) is the only remaining gate before Phase 1 can be marked fully complete in ROADMAP.md.
- Two stale visual baselines (`editor`, `editor-inspector`) and the accessibility-harness/text-spacing failures are confirmed pre-existing/expected and carried forward to Phase 4 (VERIFY-01/VERIFY-02) exactly as the plan directs — not fixed here.

---
*Phase: 01-information-architecture*
*Completed: 2026-08-09*
