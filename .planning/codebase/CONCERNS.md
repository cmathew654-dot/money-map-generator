# Codebase Concerns

**Analysis Date:** 2026-08-08

## Tech Debt

**Multi-Writer Selection State (Fixed, but historical risk):**
- Issue: Selection state was previously written by three unrelated authorities in the same DOM event — MapSvg click handler, App command dispatches, and panel focus echoes — making every fix a fix to *ordering* between writers rather than to root causes.
- Files: `src/render/selection.ts` (now single writer via reducer pattern), `src/App.tsx` (19 call-sites previously writing), `src/render/MapSvg.tsx` (click handler)
- Impact: Pre-s54, fixes to one writer path would clobber another; modifier-clicks broke, sidebar Shift selection failed, F9 focus stole selection context.
- Status: FIXED s54 via `selectionReducer` in `src/render/selection.ts` (125-162). Pattern established: single writer, two event classes (PRIMARY user intent, SUBORDINATE focus echoes).
- Takeaway: State mutations at trust boundaries need explicit ownership, not distributed writer discovery.

**File Size / Complexity Hotspots:**
- `src/render/MapSvg.tsx` (3513 lines): DOM-generation component with 40+ helper functions (hexagonPath, placedRotation, interactiveGroupProps, editableTextProps, etc.). Well-decomposed internally but remains the rendering spine — touch with care.
- `src/layout/layout.ts` (3209 lines): Geometry calculations for hex grid, rotations, zoom, panning, and text-box placement. Single-responsibility but data-dense — hard to reason about in isolation.
- `src/App.tsx` (2506 lines): Root component; holds book state, selection reducer, file/browser storage, undo/redo, and form/wizard coordination. Prop-drilling to children; useCallback chains for event handlers. No obvious refactor without introducing context/provider boilerplate.
- `src/form/Form.tsx` (1631 lines): Form schema + rendering; handles 13+ input types, validation, and focus management. Income-row array handling is dense.

---

## Known Bugs

**Selection Visibility Nearly Invisible (Pre-existing):**
- Symptoms: Multi-select appears to work (state changes, Flow button enables) but user sees almost no visual feedback on selected cylinders. Screenshot-only bug — "state changed but nothing visual happened."
- Files: `src/render/MapSvg.tsx` (render logic), `src/styles/` (styling)
- Trigger: Shift-click to multi-select; no obvious highlight on selected items.
- Workaround: Developer can inspect state via React dev tools; user must trust the Flow button enablement.
- Session s50 investigation: Shift-click reproduction test (repro19.mjs) showed state changes correctly but selection feedback nearly invisible.

**Specification Markup Drift Risk:**
- Symptoms: `tests/e2e/reflow.spec.ts:55` hardcodes stale demo-banner markup that changed in commit 62c9a09.
- Files: `tests/e2e/reflow.spec.ts:55`
- Trigger: Any future banner copy change will break this spec silently.
- Fix approach: De-hardcode banner markup; use a CSS selector or role-based locator instead of literal HTML string.

**Unresolved Money Format Behavior:**
- Symptoms: Money format Form focus path has conflicting requirements: spec expects formatted ($2,400), but live behavior is raw string on focus (`String(value)` at `Form.tsx:351`).
- Files: `src/form/Form.tsx:351` (raw on focus), spec at `tests/`
- Impact: Users see raw then formatted; inconsistent UX depending on entry mode.
- Status: OPEN — Cyril ruling pending (s55 handoff §2; options: formatted mid-edit, stay raw, or context-dependent).

**Pre-Push Hook Disarmed:**
- Symptoms: Pre-push hook is manually disabled in `.git/hooks/pre-push.disabled` (s55 handoff line 3).
- Files: `.git/hooks/pre-push.disabled` (should be `pre-push`)
- Impact: Push commits may not run configured pre-push checks; accidental pushes of incomplete work risk.
- Workaround: Manual re-arm before pushing: `Rename-Item .git/hooks/pre-push.disabled pre-push`.

---

## Accessibility & Compliance

**A11y Batch Parked:**
- Status: Entire accessibility workstream parked pending recruiter visibility signal (s54 handoff).
- Files: All a11y-related specs and coverage
- Impact: Zero automated a11y test coverage; manual testing only.

**Broken Axe Coverage Harness:**
- Symbols: `tests/e2e/app-resilience.spec.ts:6` (axe harness broken).
- Problem: Axe automation is not running; zero automated a11y coverage exists.
- Impact: WCAG violations, contrast issues, focus management bugs slip through unreported.
- Fix approach: Repair axe harness first when a11y unparks (s55 handoff line 12).

**Known A11y Failures (Parked):**
- `extended-certification:716` (WCAG text spacing rule failure — 52 SVG contrast-unverified elements).
- `app-resilience:6` (axe harness harness broken — 0 coverage).
- `F14` (keyboard multi-select unreachable — new, found s53).

**Chromium-Text-Zoom-200 A11y Geometry Cluster:**
- Symptoms: Multiple suites fail consistently at 200% text zoom: dblclick-title, selection-context, click-again all show edge-case handling breakdowns.
- Files: Tests gated on `project.name !== 'chromium-text-zoom-200'` across e2e specs.
- Trigger: Text zoom to 200% in Chromium.
- Impact: Keyboard-only and magnified-screen users hit geometry regressions.
- Investigation: Treat as one a11y-geometry workstream (s52 handoff), not separate bugs.

---

## Performance Bottlenecks

**Vite Preview Cache Stale Build Problem:**
- Symptoms: Demo server (4280) serves stale index-*.js hash after rebuild if not restarted.
- Files: Deployment procedure (npm run build:demo → restart 4280).
- Cause: Vite preview caches bundle at startup; new build not picked up until server restart.
- Workaround: `taskkill` the 4280 process tree, then restart vite preview with full path (s53 handoff line 20).
- Prevention: Add startup validation that hash-verifies served index-*.js vs demo-dist/ (s52 handoff line 4).

---

## Fragile Areas

**E2E Test Harness Spec Gating:**
- Files: Chromium-1280x720 project configuration (tests/playwright.config.ts)
- Why fragile: 39 test.skip() calls gate specs on specific browser profiles. Changing viewport or browser config silently skips affected tests. Example: `chrome-layout.spec.ts` only runs at 1280x720; 1024x768 silently skips all its checks.
- Safe modification: Audit every `testInfo.project.name` gate before adding new viewports or browser sizes; document which specs require which conditions.
- Test coverage: Multiple specs have project-specific skip gates (s52 handoff lists 13 failure clusters with gating context).

**Multi-Tab History & Lease State (Unclear Rules):**
- Symbols: 18 failures in `multitab-history` spec (s52 handoff line 28); 2 multitab-related test failures marked UNCLEAR (s55 handoff).
- Files: `tests/e2e/certification.spec.ts` (writer ownership handoff), `src/model/browserStore.ts` (WRITER_HEARTBEAT_MS lease renewal).
- Problem: Tab focus handoff, lease timeout, and undo/redo state coordination under rapid tab switching are under-specified and under-tested. One pre-existing test skipped: `test.skip('writer ownership survives rapid tab handoffs with edits', ...)`.
- Impact: Data loss or silent conflicts possible if two tabs edit in parallel (mitigated by browser-storage lock, but not formally verified).
- Safe modification: Before changing lease renewal, tab-focus logic, or history persistence, run full multitab certification suite (s52 baseline run took 1.7h for 19 projects).

**Safari WebKit Double-Click Behavior (Deferred):**
- Symbols: webkit dblclick fix promised s56 (s50/s53/s54/s55 handoffs).
- Files: Likely `src/render/MapSvg.tsx` pointer-event handling.
- Problem: Double-click behavior differs between Chromium and Safari; workaround line added to demo ("Best in Chrome or Edge").
- Impact: Safari users cannot double-click to edit text on the map.
- Status: KNOWN, not a blocker for current release (demo explicitly states Chrome/Edge).
- Timeline: s56 planning needed.

---

## Scaling Limits

**Specification Count and Maintenance Burden:**
- Current: 56 test files, 795 passing specs (baseline), 6 known-red specs parked, 2+ unclear specs.
- Bottleneck: E2E test baseline runs take 1.7 hours for 19 projects (s52 handoff); full triage adds another 1-2 hours. Manual baseline blesses (PNG snapshots) require eyeballing.
- Growth ceiling: Beyond 50+ projects, parallel sweep strategy becomes necessary (s53 handoff discusses 8-worker parallel mode).
- Workaround: Use `-g "<title>"` to run single specs by name, not full baseline.

---

## Dependencies at Risk

**Axe Automation Harness (Broken):**
- Risk: `@axe-core/playwright` installed and configured but harness is not executing (s55 handoff line 12).
- Impact: A11y violations go undetected in CI.
- Migration plan: Fix harness when a11y parked; upstream any Axe version mismatches to Playwright version.

**Vite Preview Caching Behavior (Deployment Risk):**
- Risk: `vite preview` binds to IPv6-only without `--host 127.0.0.1` (s50 handoff NEW TRAP); caching at startup silently serves old bundles (s53 handoff line 20).
- Impact: Demo deployments show stale code until manual server restart.
- Mitigation: Deployment procedure includes hash-verify and explicit restart; no dependency upgrade needed yet.

---

## Missing Critical Features

**A11y Keyboard Navigation (Blocked Pending Recruiter Signal):**
- Problem: Keyboard multi-select and focus flow incomplete; F14 found new gap (s53).
- Blocks: Cannot mark the app as WCAG-compliant.
- Timeline: PARKED pending recruiter visibility decision (s54 handoff).

**Selection Highlight Visibility (Design/Styling):**
- Problem: Multi-select state works but feedback is nearly invisible to users.
- Blocks: Users have no confidence selection is working unless they know to look at Flow button.
- Impact: UX friction on multi-item workflows.
- Design decision pending per s50 investigation.

---

## Test Coverage Gaps

**Axe Coverage Harness Broken (Zero A11y Coverage):**
- What's not tested: Contrast, ARIA, focus order, keyboard navigation.
- Files: `tests/e2e/app-resilience.spec.ts` (harness defined but broken).
- Risk: WCAG violations ship undetected.
- Priority: CRITICAL for recruiter visibility; fix harness first (s55 handoff line 12).

**Multitab Tab-Handoff Edge Cases:**
- What's not tested: Rapid tab switching + edits + undo/redo in same gesture.
- Files: `tests/e2e/certification.spec.ts:test.skip('writer ownership survives rapid tab handoffs...')`.
- Risk: Data loss or silent conflicts under high-frequency multi-tab editing.
- Priority: MEDIUM; currently mitigated by browser-storage lease mechanism.

**Specification Markup Hardcoding (Drift Risk):**
- What's not tested: Spec at `tests/e2e/reflow.spec.ts:55` hardcodes stale banner HTML; any copy change breaks it silently.
- Files: `tests/e2e/reflow.spec.ts:55`.
- Risk: Spec false-negatives; maintainer wastes time debugging `reflow` when the problem is banner markup, not layout.
- Priority: LOW but easy (1-line fix).

**Summed-Number Retype Behavior (Architectural Decision Pending):**
- What's not tested: When user edits an aggregate row (e.g., afterTaxIncome), how should component rows update? Three options were proposed (s50 handoff):
  - (a) Retype total → proportionally scale rows
  - (b) Delta into remainder row
  - (c) Keep size-only, offer "Edit the rows" jump
- Files: `src/ui/MapTextEditor.ts` (applyMapTextEdit ~497), related tests.
- Risk: User frustration if behavior is unpredictable or unintuitive.
- Timeline: Cyril ruling needed (OPEN at s50, still pending).

---

*Concerns audit: 2026-08-08*
