# Money Map UI Certification Report

- **Certification date:** 2026-07-30
- **Product:** Money Map Generator
- **Primary automated scope:** Windows Chrome and Edge
- **Secondary target scope:** macOS Safari and Chrome (no physical run receipt yet)
## Decision

**RELEASE READY for the primary Windows Chrome/Edge automated scope.**

There are no open automated P0, P1, or P2 findings in the covered scope. The previously reported zoom/reflow, keyboard map editing, download recovery, export-state, menu-keyboard, forced-colors, and resilience findings have automated regression coverage and passed the certification matrix.

This decision is deliberately bounded:

- Playwright WebKit is configured as a macOS CI proxy; it is not a native Safari run. macOS Chrome and native Safari have no run receipt and are **not physically certified** in this Windows session.
- The native Safari CI harness is pending; no native Safari CI pass is claimed.
- Formal WCAG 2.2 AA conformance remains pending human NVDA testing on Windows and VoiceOver testing on macOS.
- Real Safari download, print, and file-flow validation remains pending.

The automated release gate passes; a formal cross-platform WCAG 2.2 AA conformance claim is not yet made.

## Certification evidence

| Area | Result |
| --- | --- |
| Unit | **22 files, 406/406 passed.** |
| Production build | **Passed, exit 0:** `tsc -b` plus Vite, 57 modules. Production defaults to real data unless `VITE_DATA_MODE=demo` is explicitly set. |
| Canonical cross-browser | **130 passed, 5 intentional non-zoom-project skips, no failures** across bundled Chromium, installed Chrome, installed Edge, Firefox, and WebKit at 1440x900. |
| CSS-viewport/reflow proxy | **5/5 passed** across Firefox, the Chromium 640x360 project, installed Chrome, installed Edge, and WebKit. The full map and zoom controls remain separated; header, select, and value content remain visible. This is a CSS-viewport/reflow proxy, not evidence of native browser zoom at 200%. |
| Visual matrix | **18/18 pixel comparisons passed** across 1280x720, 1366x768, 1440x900, 1536x864, 1920x1080, and the 640x360 CSS-viewport equivalent. All three `chromium-text-zoom-200` cases reach `toHaveScreenshot`; baseline update passed 3/3 and independent comparison passed 3/3. Independent review found no P0-P3 findings. |
| Extended certification | Chromium passed all four scenarios: 200-client edit/export race and performance, WCAG text spacing plus forced colors, dynamic axe states, and compound edit -> Present -> Escape. The compound scenario also passed installed Chrome, installed Edge, and WebKit. WebKit text-spacing/forced-colors executed and passed separately. |
| Automated accessibility | Keyboard move, resize, rotate, text-offset, and reconnect pass, as do menus and read-only disabling. Editor, wizard, Present, and dynamic menu/dialog/status/map-focus scans pass. Axe ran with no exclusions. Forced-colors behavior uses explicit system colors and focus treatment. |
| Reliability | Legacy migration, guarded/recoverable downloads, export busy and duplicate guards, multi-tab stale-history handling, pending-save handoff, cooperative release, and output-bounds warnings are covered. |

### Performance evidence

The 200-client Chromium workload produced:

- Input latency: p50 **17.9 ms**, p95 **34.3 ms**.
- Save latency: p50 **429.1 ms**, p95 **431.2 ms**.
- Inputs over 100 ms: **0**.
- Long tasks over 200 ms: **0**.

### Accessibility state coverage

The automated coverage includes:

- Keyboard-equivalent map movement, resize, rotation, text offset, and reconnect operations.
- Menu operation and focus behavior.
- Read-only disabling.
- Editor, wizard, and Present mode.
- Dynamic menu, dialog, status, and map-focus states.
- WCAG text-spacing overrides and Windows forced-colors behavior.
- Dynamic axe scans with no rule or node exclusions.

These results resolve the automated portions of the historical P1/P2 findings. They do not replace the pending NVDA and VoiceOver human checks.

### Reliability behavior and bounded lease limitation

Multi-tab coordination uses a 10-second lease TTL, a 2-second heartbeat, and 250 ms polling, with cooperative release on `pagehide`. Pending-save handoff and stale-history protection prevent a late tab from overwriting newer persisted data.

A live tab frozen for more than 10 seconds is intentionally treated as crashed. Its unsaved in-memory state cannot be preserved once another tab takes the expired lease, but late overwrite by the frozen tab is prevented. This is the bounded, accepted limitation of crash recovery rather than an open automated defect.

## Exact certification commands

Run from:

`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`

1. Unit suite:

   ```powershell
   npm test
   ```

   Result: 22 files, 406/406 passed.

2. Production build:

   ```powershell
   npm run build
   ```

   Result: `tsc -b` plus Vite, 57 modules, exit 0.

3. Canonical five-browser matrix:

   ```powershell
   npx playwright test tests/e2e/accessibility.spec.ts tests/e2e/app-resilience.spec.ts tests/e2e/certification.spec.ts tests/e2e/map-keyboard.spec.ts tests/e2e/menu-keyboard.spec.ts tests/e2e/multitab-history.spec.ts tests/e2e/reflow.spec.ts --project=chromium-1440x900 --project=chrome-1440x900 --project=msedge-1440x900 --project=firefox-1440x900 --project=webkit-1440x900
   ```

   Result: 130 passed, 5 intentional zoom-only skips, no failures.

4. CSS-viewport/reflow proxy matrix:

   ```powershell
   npx playwright test tests/e2e/reflow.spec.ts --project=firefox-1280x720 --project=chromium-text-zoom-200 --project=chrome-1440x900 --project=msedge-1440x900 --project=webkit-1280x720
   ```

   Result: 5/5 proxy cases passed. This does not certify native browser zoom at 200%.

5. Visual matrix:

   ```powershell
   npm run test:e2e:visual
   ```

   Result: 18/18 pixel comparisons passed. All three `chromium-text-zoom-200` cases reach `toHaveScreenshot`; baseline update passed 3/3 and independent comparison passed 3/3.

6. Extended certification matrix:

   ```powershell
   npx playwright test tests/e2e/extended-certification.spec.ts --project=chromium-1280x720 --project=webkit-1440x900 --project=chrome-1440x900 --project=msedge-1440x900
   ```

   Result: Chromium passed all four extended scenarios; the compound scenario passed Chromium, installed Chrome, installed Edge, and WebKit.

7. Explicit WebKit text-spacing/forced-colors guard:

   ```powershell
   npx playwright test tests/e2e/extended-certification.spec.ts --project=webkit-1440x900 --grep "WCAG text spacing and forced colors"
   ```

   Result: 1 executed, 1 passed.

## Stable evidence and artifact paths

- Final report: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\UI_CERTIFICATION_REPORT.md`
- Design record: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\DESIGN.md`
- Design-system evidence: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\.impeccable\design.json`
- Visual baselines: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\visual.spec.ts-snapshots`
- 640x360 editor capture: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\test-results\visual-review-current\editor-640x360-full.png`
- 640x360 wizard capture: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\test-results\visual-review-current\wizard-640x360-full.png`
- 640x360 Present capture: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\test-results\visual-review-current\present-640x360.png`
- Certification CI workflow: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\.github\workflows\ui-certification.yml`
- End-to-end test sources: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\`

No persistent HTML report is claimed by this certification.

## Remaining physical certification work

Before claiming formal WCAG 2.2 AA conformance or physical macOS certification:

1. Complete human NVDA checks on Windows Chrome and Edge, including editing, menus, dialogs, status announcements, Present mode, persistence, recovery, and export completion.
2. Complete human VoiceOver checks on macOS Safari and Chrome over the same core workflows.
3. Validate current Safari book/recovery downloads, PNG/PDF/SVG export, print, reopen, cancellation, and failure handling on physical macOS hardware.

These are explicit scope boundaries, not open automated P0/P1/P2 findings.
## Human signoff checklist

The 640x360 CSS-viewport/reflow proxy does not satisfy native browser zoom, OS display scaling, assistive-technology, or native Safari signoff. Check a row only after recording its environment and evidence.

| Done | Environment | Execute | Pass evidence |
| --- | --- | --- | --- |
| [ ] | NVDA + Windows Chrome | Record Windows, Chrome, and NVDA versions. Create and edit a client; traverse the selector and editor; operate menus and dialogs; keyboard move, resize, rotate, text-offset, and reconnect; enter Present and press Escape; exercise read-only, save, export, warning, and completion states. | Names, roles, values, state changes, and live status are announced; focus order and restoration are stable; every core action completes without a pointer or keyboard trap. |
| [ ] | NVDA + Windows Edge | Repeat the complete NVDA Chrome script in current Edge and record all three versions. | Same criteria as NVDA Chrome, including Edge download and file-picker behavior. |
| [ ] | VoiceOver + macOS Safari | Record macOS, Safari, and VoiceOver versions. Repeat the complete create/edit, menu/dialog, keyboard map, Present/Escape, read-only, status, save, recovery, and export script using VoiceOver navigation. | Names, roles, values, state changes, and status are spoken; focus remains visible and recoverable; no core workflow requires a pointer. |
| [ ] | VoiceOver + macOS Chrome | Record macOS, Chrome, and VoiceOver versions. Repeat the complete VoiceOver Safari script in current Chrome. | Same criteria as VoiceOver Safari; retain a separate run receipt because no macOS Chrome run receipt currently exists. |
| [ ] | Native browser zoom | In physical Windows Chrome and Edge, use each browser's Zoom control at 100%, 125%, 150%, and 200% across 1280x720, 1366x768, 1440x900, 1536x864, and 1920x1080 windows. Repeat at least 100% and 200% in physical macOS Safari and Chrome. | Non-map controls require no two-dimensional scrolling; header, selector, values, status, menus, and dialogs remain visible; map and zoom controls remain separated; focus and hit targets align. |
| [ ] | OS display scaling | With browser zoom reset to 100%, exercise Windows display scaling at 100%, 125%, 150%, and 200%. On macOS, test Default and a Larger Text scaled-display setting in Safari and Chrome. | Content and focus remain available without clipping or overlap; screenshots and exact display settings are attached to the receipt. |
| [ ] | Native Safari download and reopen | In physical Safari, save book JSON, reopen it, download a damaged-copy recovery file, and export PNG, PDF, and SVG. Open each output and compare client/map content with the source state. | One correct file is produced per action; reopened JSON preserves data; recovery is usable; no premature revoke, duplicate download, stale content, or false success occurs. |
| [ ] | Native Safari print, cancel, and failure | Verify print preview and printed/PDF output. Cancel open/save/print flows. Exercise a controlled denied-permission or unavailable-destination failure and retry. | Print is not clipped or stale; cancellation changes no data and emits no false success; failure is announced, actionable, recoverable, and does not duplicate work. |
| [ ] | Native Safari CI harness | Implement and execute a native Safari CI job distinct from Playwright WebKit, then attach its run URL, commit, OS/Safari versions, and artifacts. | **Pending.** Playwright WebKit proxy coverage is not a native Safari CI pass. |

**Signoff receipt:** Date: __________ | Tester: __________ | Commit: __________ | OS/browser/AT versions: __________ | Evidence and issue links: __________
