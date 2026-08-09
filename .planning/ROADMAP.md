# Roadmap: Money Map — Left Panel Redesign

## Overview

Four phases resolve the parked "field form nightmare" call from session 43: first establish what actually ships today and where each input belongs (IA), then define distinct roles for the Wizard and the Data panel so guided and freeform entry stop competing (Flow), then redesign the panel's visual craft on top of the existing `--fm-*` token system so it reads as designed rather than a stack of controls (Visual craft), and finally realign the test suites and close the two open rulings (mid-edit money format, RESET ITEM clipping) that this work surfaces (Verification). Each phase builds directly on the one before it — IA decisions constrain Flow, IA+Flow constrain what Visual craft is styling, and all three are what Verification checks.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g. 1.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Information Architecture** - Document what the Data panel actually ships today and give every field exactly one unambiguous section.
- [ ] **Phase 2: Guided vs. Freeform Flow** - Give the Wizard and Data panel distinct, non-competing roles aligned to the Phase 1 section boundaries.
- [ ] **Phase 3: Visual Craft** - Redesign field density, rhythm, hierarchy, states, and motion in the Data panel on the existing token system; resolve the mid-edit money format ruling.
- [ ] **Phase 4: Verification** - Realign Playwright/Vitest suites with what phases 1-3 ship; give the 6 parked-red specs and the RESET ITEM clipping finding explicit dispositions.

## Phase Details

### Phase 1: Information Architecture
**Goal**: Cyril can look at any field and know exactly which Data panel section it lives in, with no conceptual overlap between sections.
**Depends on**: Nothing (first phase)
**Requirements**: IA-01, IA-02, IA-03
**Success Criteria** (what must be TRUE):
  1. The Data panel's documented structure matches what's actually in the code (s51 Ledger accordion), not the stale canvas-first-editor-design.md description.
  2. For any given financial input (income source, account, position, sub-account, need line, note), Cyril can name its section without checking the code.
  3. No two sections (client / income / accounts / need / notes) claim the same kind of input — overlaps identified in the current keyed structure are resolved or explicitly ruled acceptable.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Guided vs. Freeform Flow
**Goal**: Cyril knows without hesitation whether a task belongs in the Wizard or the Data panel, and moving between them doesn't force him to redo work or relearn a different mental model.
**Depends on**: Phase 1
**Requirements**: FLOW-01, FLOW-02, FLOW-03
**Success Criteria** (what must be TRUE):
  1. Cyril can state the Wizard's purpose and the Data panel's purpose in one sentence each, and the two don't overlap.
  2. Starting a task in the Wizard and finishing it in the Data panel (or vice versa) preserves context — same section names, no redone steps.
  3. Adding any item through any entry point remains unordered and non-blocking (no forced sequence, no modal reintroduced).
**Plans**: TBD
**UI hint**: yes

### Phase 3: Visual Craft
**Goal**: The Data panel reads as deliberately designed — distinct field treatment, clear rhythm and hierarchy, smooth interactive feedback — instead of a stack of generic rectangle fields.
**Depends on**: Phase 2
**Requirements**: CRAFT-01, CRAFT-02, CRAFT-03, CRAFT-04
**Success Criteria** (what must be TRUE):
  1. Input and select fields have a distinct visual identity built on `--fm-*` tokens, not the default browser rectangle look.
  2. Section and field hierarchy is visible at a glance through spacing and typography, without reading labels first.
  3. Focus, hover, and accordion expand/collapse states give visible, smooth feedback and respect `prefers-reduced-motion`.
  4. Mid-edit money formatting behaves one confirmed way (formatted or raw) consistently across every money field — the Form.tsx:351 spec-vs-live contradiction is closed.
**Plans**: TBD
**UI hint**: yes

### Phase 4: Verification
**Goal**: The automated suites reflect what phases 1-3 actually shipped, and every open verdict this milestone touches has an explicit, recorded answer.
**Depends on**: Phase 3
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03
**Success Criteria** (what must be TRUE):
  1. Playwright/Vitest suites pass against the redesigned panel, or every failure is a recorded, deliberate ruling rather than a silent skip.
  2. Each of the 6 previously parked-red e2e specs (3 accessibility, 2 multitab, 1 interaction regression) has a stated disposition — reaffirmed-parked-with-reason, or fixed and green.
  3. The RESET ITEM inspector-clipping finding has an explicit confirmed close, replacing its provisional s54 default.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-|-|-|-|
| 1. Information Architecture | 0/TBD | Not started | - |
| 2. Guided vs. Freeform Flow | 0/TBD | Not started | - |
| 3. Visual Craft | 0/TBD | Not started | - |
| 4. Verification | 0/TBD | Not started | - |
