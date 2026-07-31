# UI Certification Audit

> **Remediation status (2026-07-30):** This audit records the 2026-07-29 pre-remediation state. Its **NOT READY** verdict is historical and has been superseded by the evidence-backed [UI Certification Report](./UI_CERTIFICATION_REPORT.md) at `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\UI_CERTIFICATION_REPORT.md`.

- **Product:** Money Map Generator
- **Audit date:** 2026-07-29
- **Target:** WCAG 2.2 AA and production desktop certification
- **Primary platforms:** Windows 11 Chrome and Edge
- **Secondary platforms:** macOS Safari and Chrome
- **Explicitly tabled:** mobile layouts
**Still required:** 200% browser zoom and desktop viewport/resolution variability

## Method and evidence boundary

This is an independent code-based audit of the current worktree. I inspected application state and output handling, form semantics, menu/dialog/autocomplete/toast behavior, SVG editing semantics, responsive CSS, motion preferences, and build dependencies. No signed-in or already-running local browser session was available for reliable visual/assistive-technology measurement, so browser rendering, screen-reader output, color sampling, and performance timings are listed as unverified where appropriate. No source, test, or configuration files were modified by this audit.

Severity scale:

- **P0:** data loss, security/privacy exposure, or a universally blocking workflow.
- **P1:** release blocker for WCAG AA or a core desktop workflow.
- **P2:** material usability, resilience, compatibility, or quality defect.
- **P3:** polish or maintainability issue with limited user impact.

## Executive decision

**Certification status: NOT READY.**

There are no confirmed P0 defects. Two P1 release blockers remain: the application does not meet the required 200% desktop reflow behavior, and keyboard users cannot perform the map's pointer-only spatial editing operations. The current implementation has strong native form semantics, good menu/dialog foundations, explicit save/recovery states, reduced-motion gating, and a coherent visual language. Those positives do not offset the two core access blockers.

## Confirmed findings

### P1 - Required 200% zoom can force a clipped 1000px application canvas

At viewport widths below 900 CSS pixels, the app deliberately sets a 1000px minimum width while the root shell is height-locked and overflow-hidden. A 1440px desktop at 200% zoom exposes roughly 720 CSS pixels, placing the required test directly in this branch. The editor and header therefore require horizontal traversal and can be clipped instead of reflowing. The map itself may qualify for the two-dimensional-content exception in WCAG 1.4.10, but the client selector, book actions, form, status messages, and ordinary controls do not.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:132` fixes the application shell to `100vh` and hides overflow.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:686` defines a fixed 420px editor plus a minimum 520px preview.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1671` enters the narrow-desktop branch.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1673` forces `.app-shell` to a 1000px minimum width.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1678` separately forces a 900px minimum header width.

Required outcome: At 200% zoom, all non-map controls must remain available without two-dimensional scrolling, clipping, or overlap. A single-column editor/preview switch or collapsible panel is acceptable.

### P1 - Core map arrangement remains pointer-only

The product exposes semantic buttons and keyboard focus for many controls, but spatial operations are initiated through pointer handlers: pan, drag, resize, rotate, reconnect, and text-offset movement. Keyboard users can edit form values and activate map objects, but cannot produce an equivalent custom arrangement. This blocks WCAG 2.1.1 for a core authoring workflow unless the product explicitly removes those operations from the required workflow or supplies keyboard alternatives.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:862` starts map panning from a primary-button pointer event.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\render\MapSvg.tsx:2801` renders draggable notes whose movement is wired through pointer-down behavior.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\MapTextEditor.tsx:813` supports Enter/Escape for the open editor, but this does not provide keyboard movement for the underlying map object.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:594` reveals resize/rotate/connect handles on hover/focus, confirming focus exposure without an equivalent keyboard transformation command.

Required outcome: Focused map objects need documented keyboard movement and resize/rotate controls, or all equivalent operations must be available through standard form controls.

### P2 - Recovery download still uses the unreliable detached-anchor/immediate-revoke pattern

Normal book and map exports now attach the anchor and defer object-URL revocation, but the damaged-copy recovery action still clicks a detached anchor and immediately revokes its URL. This is a meaningful Safari risk in the exact data-recovery path where failure is least acceptable. The action also has no local error reporting.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:740` creates the recovery download.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:743` creates but does not attach the anchor.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:746` clicks it and `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:747` revokes immediately.

### P2 - Save Book reports success without guarding synchronous download failure

The Book menu invokes the download and immediately adds a success toast. The export helper can throw when browser URL or DOM download operations fail; this call site has no try/catch and no error dialog. Users can therefore receive no actionable failure state, or a misleading success signal depending on where the failure occurs.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1070` defines the Save Book action.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1072` invokes the download directly.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1073` announces success immediately.
- Map export has the stronger guarded pattern at `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:721` and `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:731`.

### P2 - Status banners can obscure the workspace at zoom and have no reserved layout space

The status stack is fixed over the application at the top right. Multiple simultaneous states are possible (demo/read-only, recovery/save failure, and layout warning). At 200% zoom its width becomes nearly the entire viewport and the stack grows over the editor/preview without reserving space. This compounds the P1 reflow defect and can hide controls or map content.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1212` groups all status banners in one live region.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1213` through `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1217` permit multiple concurrent banners.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1820` fixes the stack at `top:54px`, up to 620px wide, with no corresponding workspace inset.

### P2 - Long-running export work lacks a loading/busy state

PNG/PDF/SVG export performs font fetches, SVG serialization, image decoding, canvas rendering, and PDF assembly asynchronously. The initiating controls remain enabled and expose no `aria-busy`, progress label, or cancellation state. Repeated activation can trigger duplicate work and downloads. This is both a cross-feature UX issue and an accessibility status gap.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:707` starts async export without an exporting state.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:721` awaits the format-specific operation.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1167` exposes the Save Map menu without a busy/disabled export state.

### P2 - Menu keyboard behavior is incomplete against the ARIA menu pattern

The custom menu correctly supplies menu roles, focuses the first item, returns focus on Escape, and supports cyclic Up/Down navigation. It does not support Home, End, or printable-character navigation. These are expected desktop menu behaviors and materially affect long or repeated menus, though the current menus are short.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Menu.tsx:85` implements menu key handling.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Menu.tsx:87` handles Escape.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Menu.tsx:100` exits for every key except ArrowUp/ArrowDown after the Enter branch.

### P3 - Theme consistency is visual rather than tokenized

The interface uses a coherent ink/green/cream palette and distinctive Literata/Public Sans typography, but theme values are repeated as raw hex colors rather than semantic custom properties. There is no forced-colors adaptation. This increases the chance of contrast drift and makes Windows High Contrast behavior difficult to guarantee.

Evidence:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:123` defines a consistent green focus treatment.
- Repeated raw values appear throughout the stylesheet, including `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:621`, `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1000`, and `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1820`.
- No `forced-colors` rule was found in the inspected stylesheet.

## Unverified risks requiring browser or assistive-technology evidence

These are not asserted failures. They must be measured before certification.

1. **Contrast:** Verify all normal text at 4.5:1, large text at 3:1, focus/controls at 3:1, and disabled-state comprehensibility. Pay special attention to 11-12px muted labels and SVG bucket colors.
2. **Windows High Contrast:** Confirm native controls, custom SVG handles, transparent hit regions, selection state, and warning banners remain perceivable in forced-colors mode.
3. **Screen readers:** Run NVDA + Chrome/Edge and VoiceOver + Safari through client selection, autocomplete, menus, native dialogs, map editing, save/recovery banners, and export completion.
4. **Dialog focus restoration:** Native `showModal()` supplies trapping, but verify initial focus and return focus for every dialog origin, including error dialogs opened from menu items.
5. **Safari downloads and file workflows:** Verify book, recovery, PNG, PDF, and SVG downloads in current Safari. File System Access features are appropriately conditional, but fallback clarity needs hands-on validation.
6. **Performance:** Measure rather than infer. `layoutMap(previewClient)` is computed for warnings at `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:247`, while the SVG renderer also lays out the map. Vocabulary rebuilds from the full book at `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:223`, and browser persistence serializes the full book after 400ms at `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:390`. Test with the stated 100-200 client capacity.
7. **Viewport matrix:** Verify 1280x720, 1366x768, 1440x900, 1920x1080, and 2560x1440 at 100%, 125%, 150%, and 200%; also test Windows display scaling independently of browser zoom.
8. **Text spacing:** Apply WCAG 1.4.12 overrides and verify form labels, menus, banners, dialogs, and map text editors do not clip or overlap.
9. **Zoomed map editing:** Confirm hit targets, focus rings, overlay editors, and size-control pills align at Fit, 50%, 100%, 150%, and 200% map zoom.

## Positive findings

- Native labels wrap form inputs and selects; money fields expose decimal input hints and explicit visible labels.
- Autocomplete implements combobox/listbox roles, `aria-expanded`, `aria-controls`, active-descendant state, Arrow navigation, Enter, and Escape (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Autocomplete.tsx:90`).
- Menus expose `aria-haspopup`, `aria-expanded`, menu/menuitem roles, focus entry, cyclic arrow navigation, and Escape focus return (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Menu.tsx:116`).
- Dialogs use the native modal element with an accessible title and Cancel handling (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Dialog.tsx:22`).
- Toasts use a polite live region (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\ui\Toast.tsx:21`).
- Storage mode, read-only ownership, recovery, save failure, and blocked export states are visible and actionable (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1212`).
- Destructive Clear Map text explains scope and Undo recovery (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\App.tsx:1444`).
- Motion is short and gated behind `prefers-reduced-motion: no-preference` (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:1648`).
- Focus-visible styling is present for native controls, menu items, and SVG role-buttons (`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:123`, `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\styles\app.css:342`).
- The product avoids common AI-product anti-patterns: no fake assistant persona, conversational filler, unsolicited recommendations, fabricated confidence scores, decorative purple gradients, or chat-first obstruction. The workflow remains task-focused and advisor-controlled.
- Typography and color direction are distinctive, restrained, and consistent with the financial planning context.

## Impeccable dimension scores

| Dimension | Score | Evidence-based assessment |
| --- | ---: | --- |
| Visual hierarchy and craft | 8/10 | Strong typography, restrained palette, clear map/editor separation, and purposeful density. Fixed overlay banners and small 11-12px utility text reduce resilience. |
| Interaction and feedback | 6/10 | Good menus, dialogs, undo/redo, persistence labels, recovery, and export blocking. Pointer-only map arrangement and missing export busy state are significant. |
| Accessibility and semantics | 5/10 | Strong native form and popup semantics, live regions, focus styling, and reduced motion. Keyboard-equivalent spatial editing and 200% reflow block AA certification. |
| Responsive desktop adaptability | 4/10 | Fit zoom and presentation mode are useful, but the forced 1000px narrow layout directly conflicts with required desktop zoom/reflow coverage. |
| Product coherence and trust | 8/10 | Clear data-mode warnings, single-writer ownership, recovery, connected-file state, and honest export blocking build trust. Save/recovery download error gaps prevent a higher score. |

**Overall:** 6.2/10. This is a coherent, nearly production-grade desktop product whose remaining issues are concentrated in inclusive access, zoom resilience, and failure-proof delivery.

## Release acceptance criteria

Release certification requires all of the following evidence:

1. Zero open P0 or P1 findings; every accepted P2 has a named owner, rationale, and follow-up release.
2. At 200% browser zoom on a 1280x720 desktop viewport, all non-map controls reflow without clipping, overlap, or required two-dimensional scrolling. The form and preview remain independently reachable.
3. Every core map arrangement operation has a keyboard-equivalent workflow. Focus order is logical, visible, and stable after menus, dialogs, editor commits/cancels, undo/redo, deletion, and client changes.
4. Automated axe-core or equivalent scans report zero serious/critical issues on guided form, full form, present mode, open menu, open dialog, recovery, read-only, save-error, blank-client, and layout-warning states.
5. Manual NVDA + Windows Chrome/Edge and VoiceOver + macOS Safari complete: create client, enter income/need, add/edit/reorder map content, undo/redo, save/load book, recover damaged data, print, and export PNG/PDF/SVG.
6. Measured contrast meets WCAG 2.2 AA, including SVG text/controls and focus indicators. Windows forced-colors mode preserves names, states, boundaries, and focus.
7. Text-spacing overrides from WCAG 1.4.12 produce no loss of content or function.
8. Desktop matrix passes at 1280x720, 1366x768, 1440x900, 1920x1080, and 2560x1440 across 100%, 125%, 150%, and 200% browser zoom on the required platform set.
9. With a 200-client stress book, p95 keystroke-to-visible-update is under 100ms, no interaction long task exceeds 200ms, save-state feedback appears within 100ms, and autosave/export never freezes input for more than one animation frame without a busy indication.
10. Every asynchronous action announces start/success/failure where appropriate, prevents duplicate activation, and supplies retry or recovery. Save Book and damaged-copy recovery use the same verified download lifecycle as map exports.
11. Blank, loading/busy, read-only, recovery, save failure, unsupported file API, layout warning, and export failure states have verified keyboard access and screen-reader announcements.
12. Chrome, Edge, Safari, and macOS Chrome successfully download and reopen book JSON; export PNG/PDF/SVG; and print without clipping, stale data, duplicate downloads, or premature object-URL revocation.

## Platform test matrix

| Platform | Browser | Required status |
| --- | --- | --- |
| Windows 11 | Current Chrome | Full WCAG, zoom, keyboard, performance, persistence, export, print |
| Windows 11 | Current Edge | Full WCAG, zoom, keyboard, File System Access, persistence, export, print |
| macOS current | Current Safari | Secondary keyboard/VoiceOver, fallback file flows, all downloads, print |
| macOS current | Current Chrome | Secondary keyboard, persistence, export, print |

No mobile certification is required for this release. Mobile exclusion does not waive desktop browser zoom, OS display scaling, text spacing, or small laptop viewport requirements.