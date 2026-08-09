# Requirements: Money Map — Left Panel Redesign

**Defined:** 2026-08-08
**Core Value:** Cyril can build a real client's map through the left panel with less hesitation about where a given input belongs, and the panel reads as deliberately designed rather than a stack of form controls.

## v1 Requirements

Requirements for this milestone. Each maps to exactly one roadmap phase.

### Information Architecture (IA)

- [ ] **IA-01**: The Data panel's actual shipped structure (s51 Ledger accordion — sections, accordion rows, nested Positions/Sub-accounts) is documented as ground truth, explicitly superseding the stale canvas-first-editor-design.md description.
- [ ] **IA-02**: Every field has exactly one section it belongs to — no two sections (client / income / accounts / need / notes) compete for the same kind of input.
- [ ] **IA-03**: Nested structures inside Accounts (Positions, Sub-accounts) have a clear, stated relationship to their parent account and to sibling sections, resolving the "unclear what lives where" complaint.

### Flow (FLOW)

- [ ] **FLOW-01**: The Wizard (420px guided-setup column) and the Data panel (380px, behind the rail) have distinct, non-overlapping roles that are stated explicitly, not left to be inferred from code.
- [ ] **FLOW-02**: Wizard's section/step boundaries align with the Data panel's section boundaries from IA-02, so a user moving between guided and freeform entry doesn't hit a different mental model.
- [ ] **FLOW-03**: Adding any item (income source, account, need, flow, note) through any entry point stays unordered and non-blocking — no forced sequence, no modal wizard reintroduced (preserves the guided-freeform-build-flow-design.md readiness-checklist principle).

### Visual Craft (CRAFT)

- [ ] **CRAFT-01**: Field controls (inputs, selects) in the Data panel have a distinct visual treatment built on the existing `--fm-*` token system — replacing the "just a rectangle-like field" default appearance.
- [ ] **CRAFT-02**: The Data panel has deliberate vertical rhythm and typographic hierarchy (section headers, field labels, values) so density and structure are visible at a glance, replacing the "stack of form controls" feel.
- [ ] **CRAFT-03**: Interactive states (focus, hover, accordion expand/collapse) have visible, smooth feedback that respects `prefers-reduced-motion`.
- [ ] **CRAFT-04**: Mid-edit money field formatting behavior (`src/form/Form.tsx:351`) is resolved to one explicit, confirmed behavior and implemented consistently — closing the open formatted-vs-raw contradiction between spec and live code.

### Verification (VERIFY)

- [ ] **VERIFY-01**: Existing Playwright/Vitest suites pass against the phases 1-3 changes, or every intentional deviation from prior expected behavior is a recorded ruling rather than a silent skip or failure.
- [ ] **VERIFY-02**: Each of the 6 currently parked-red e2e specs (3 accessibility, 2 multitab, 1 interaction regression) has an explicit, recorded disposition — stays parked with a stated reason, or is fixed and green.
- [ ] **VERIFY-03**: The RESET ITEM inspector-clipping finding (s46, provisional close pending confirmation) has an explicit, confirmed resolution recorded — not left on its provisional default.

## v2 Requirements

None identified — this milestone is scoped tightly to the left-panel redesign per the user's explicit 4-phase mandate. Canvas/interaction work, new integrations, and a11y unparking are Out of Scope in PROJECT.md, not deferred v2 requirements.

## Out of Scope

| Feature | Reason |
|-|-|
| Canvas rendering/interaction redesign (selection, drag, Tidy, notes, arrows) | Stable since s54; not part of this milestone |
| New runtime dependencies or state-management libraries | Constraint carried from canvas-first-editor-design.md and editor-stabilization-design.md; App.tsx stays sole state owner |
| Blanket accessibility unparking | Parked by Cyril's explicit s54 ruling; Phase 4 surfaces it as a choice (VERIFY-02), doesn't reopen it by default |
| Second full-editing surface in the canvas inspector | canvas-first-editor-design.md constraint: inspector stays quick-actions only, Details is the sole path to exhaustive editing |
| Summed-number ("aggregate") retype behavior redesign | Open architectural question from s50, unrelated to left-panel IA/flow/visual-craft scope; not part of this milestone |

## Traceability

Which phases cover which requirements.

| Requirement | Phase | Status |
|-|-|-|
| IA-01 | Phase 1 | Pending |
| IA-02 | Phase 1 | Pending |
| IA-03 | Phase 1 | Pending |
| FLOW-01 | Phase 2 | Pending |
| FLOW-02 | Phase 2 | Pending |
| FLOW-03 | Phase 2 | Pending |
| CRAFT-01 | Phase 3 | Pending |
| CRAFT-02 | Phase 3 | Pending |
| CRAFT-03 | Phase 3 | Pending |
| CRAFT-04 | Phase 3 | Pending |
| VERIFY-01 | Phase 4 | Pending |
| VERIFY-02 | Phase 4 | Pending |
| VERIFY-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 13 total
- Mapped to phases: 13
- Unmapped: 0

---
*Requirements defined: 2026-08-08*
*Last updated: 2026-08-08 after initial milestone definition*
