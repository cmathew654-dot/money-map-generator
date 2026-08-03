# Guided-Freeform Build Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Money Map creation feel guided by readiness while preserving freeform editing, and reduce top-bar competition between primary and secondary actions.

**Architecture:** Keep `App.tsx` as the sole state owner. Derive a pure setup-status object from the active client and pass it into the existing Add panel; keep all mutations and focus transitions in existing App handlers. Reorder/group existing header controls and place low-frequency lifecycle actions behind the existing overflow affordance without changing persistence or map data.

**Tech Stack:** React, TypeScript, existing CSS, Vitest/Testing Library, Playwright visual tests. No new dependencies.

## Global Constraints

- No new runtime dependencies; runtime remains React plus React DOM.
- Preserve null money values and existing blank-value rendering.
- Keep App.tsx as the sole state owner; use props down and pure derived helpers.
- No modal wizard, forced ordering, hidden advanced capability, or new state library.
- Existing map editing, undo, persistence, export, and print behavior must remain unchanged.
- Run `npm test` and `npm run build` before completion.

---

### Task 1: Add-panel readiness guidance

**Files:**
- Modify: `src/ui/EditorPanels.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Test: `tests/map-inspector.test.tsx` or a focused new panel test in the existing test file

**Interfaces:**
- Consumes: existing `MoneyMapData`, `onAddIncome`, `onAddAccount`, `onSetNeed`, `onAddFlow`, `onAddTextNote`, and `onAddFinePrint` props.
- Produces: a pure readiness summary used only for Add-panel labels/status copy; existing callbacks and data shape remain unchanged.

- [ ] **Step 1: Write failing tests for freeform creation and readiness copy.**

  Render the Add panel with a blank client, an account-only client, and a complete essentials client. Assert that all essential actions remain available in each state, that account-only state still offers income and monthly need, and that the panel exposes a setup status/recommendation without requiring a fixed order. Assert that adding the first item still routes focus to its matching Data fields through the existing App callback behavior.

- [ ] **Step 2: Run the focused test and verify the new assertions fail.**

  Run: `npm test -- tests/map-inspector.test.tsx`
  Expected: FAIL because the current Add panel has no readiness summary or separated essentials/optional sections.

- [ ] **Step 3: Implement the smallest derived readiness model.**

  In `EditorPanels.tsx`, derive essential statuses from `data.incomeSources.length`, `data.accounts.length`, and `data.monthlyNeed !== null`. Render a compact “Map setup” section with one recommended next action based on the first incomplete essential, while leaving every existing button available. Keep flows and annotations in secondary sections below essentials. Do not add a wizard state or mutate data from the panel.

  In `App.tsx`, preserve current immediate focus behavior: `handlePanelAddIncome` focuses income when the first income is created, `handlePanelAddAccount` focuses the first account, and `onSetNeed` focuses need. If copy needs a target, pass only the existing callback/target props rather than introducing another state owner.

  In `app.css`, use existing panel section/button patterns to visually distinguish the recommended action and secondary sections without increasing panel width.

- [ ] **Step 4: Run focused tests and confirm they pass.**

  Run: `npm test -- tests/map-inspector.test.tsx`
  Expected: PASS with all existing inspector tests plus the new readiness assertions green.

- [ ] **Step 5: Commit the Add-panel change.**

  ```bash
  git add src/ui/EditorPanels.tsx src/App.tsx src/styles/app.css tests/map-inspector.test.tsx
  git commit -m "feat: guide freeform map setup"
  ```

### Task 2: Calm top-bar hierarchy

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles/app.css`
- Test: `tests/e2e/visual.spec.ts` and the existing header interaction test file if one covers New/Book/Reset

**Interfaces:**
- Consumes: existing header callbacks, `editorPanel` state, undo/redo availability, Present/Print/Export handlers, and existing overflow menu behavior.
- Produces: unchanged actions with a reordered visual hierarchy and accessible labels/menu grouping.

- [ ] **Step 1: Write failing visual/interaction assertions.**

  Assert that the header keeps client identity visible, keeps Present/Print/Export visible as primary actions, exposes undo/redo only in the contextual history group, and moves New/Book/Reset into the overflow menu while preserving accessible names and keyboard activation.

- [ ] **Step 2: Run the focused browser test and verify the hierarchy assertions fail.**

  Run: `npx playwright test tests/e2e/visual.spec.ts --project=chromium-1280x720 --workers=1`
  Expected: FAIL on the current header order/grouping or the updated visual baseline.

- [ ] **Step 3: Reorder existing header markup and apply compact grouping styles.**

  Keep the wordmark/client identity on the left. Keep undo/redo adjacent to the client identity as contextual history controls. Keep Present, Print, and Export visible on the right. Put low-frequency New client, Book, Reset, and recovery/settings actions behind the existing overflow control. Do not remove any action or create new application state. Add only the minimum CSS for spacing, separators, and responsive overflow.

- [ ] **Step 4: Run interaction and visual checks, then update only intended baselines.**

  Run the focused header tests and the configured visual suite. Update only snapshots that reflect the deliberate header hierarchy change; do not update map-content or unrelated viewport baselines.

- [ ] **Step 5: Commit the top-bar change.**

  ```bash
  git add src/App.tsx src/styles/app.css tests/e2e/visual.spec.ts tests/e2e/*snapshot*
  git commit -m "style: simplify editor top bar"
  ```

### Task 3: Cross-feature verification

**Files:**
- No production files unless a test exposes a concrete regression.
- Test/report: existing focused suites and `docs/codex/SESSION-44-REPORT.md`.

- [ ] **Step 1: Run focused unit and browser coverage.**

  Run: `npm test -- tests/map-inspector.test.tsx tests/mapedit.test.ts`
  Run: `npx playwright test tests/e2e/visual.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1`
  Expected: all focused tests pass.

- [ ] **Step 2: Run the required gates.**

  Run: `npm test`
  Run: `npm run build`
  Expected: both commands exit 0.

- [ ] **Step 3: Dogfood the natural routes.**

  On a blank client, add an account first and confirm its Data fields receive focus; add income next and confirm income focus; set monthly need; then inspect automatic flows, add an optional custom flow, add a note, and verify Tidy remains secondary. Repeat with income-first and need-first order. Confirm header primary actions remain visible and overflow actions remain reachable.

- [ ] **Step 4: Commit the report.**

  ```bash
  git add docs/codex/SESSION-44-REPORT.md
  git commit -m "docs: report guided freeform flow"
  ```
