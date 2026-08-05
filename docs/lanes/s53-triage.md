# s53 triage — full-matrix baseline adjudication (2026-08-05)

Two independent baselines at d6f741f, reconciled: parallel 8-worker (1536 passed / 267 failed / 613 skipped, 20.4 min, port 4292, this session) and serial 1-worker (1529 / 273 / 596, 1.7 h, prior session — inventory at 21f8985). The runs overlapped 23:46-23:59, which explains the count drift; every verdict below was re-confirmed serially in isolation and/or provenance-tested at the s51-m0 freeze tag, so no verdict rests on a contended run. This table RESOLVES the "UNKNOWN ERA / triage FIRST / probe" flags in the 21f8985 inventory.

## Verdicts

| # | Cluster | Verdict | Disposition |
|-|-|-|-|
| 1 | Known debt ×18 projects: certification :46/:86, reflow :20, app-resilience :6/:82/:114, map-keyboard :77/:110, interaction-regression :232/:245/:273/:642/:848, extended-certification :707 | Pre-existing (s51 handoff §P4-3 list, all present, none worsened) | Ledger, unchanged |
| 2 | Universal trio ×17-18 projects: multitab-history:84 (money input "$2,400" vs "2400"), adversarial-remediation:66 (9 inspector buttons height 28 < 32), app-guidance-s40:84 (read-only banner takeover 45s timeout) | **Pre-existing — byte-identical failures at s51-m0** (provenance run, mm-s53-prov). The 21f8985 "suspect T-PILLS bench" hypothesis for :66 is refuted: T-PILLS doesn't exist at m0 and the failure is identical there | Ledger; entry tickets for the s54 persistence/undo/lease rotation (see s53-audit-program-plan.md) |
| 3 | chromium-text-zoom-200 cluster (~50 fails incl. every s51/s52 spec) | **Project is a mislabeled 640×360 viewport probe — no text scaling of any kind** (config line 46). Sampled 5: 4 = spec fragility (clickAccount fixed 24px inset lands in the label hit-band at 25% map zoom; "More actions" popover left open blankets 344/360px; stale pre-click bbox), 1 = REAL reflow bug: fixed action bench covers the left tool-rail Help button (WCAG 1.4.10/2.4.11) | Ledger + P5: rename project → reflow-640, fix the shared helper, ⚖ bench-overlap fix. True text-resize (WCAG 1.4.4) coverage = zero, net-new P5 workstream item |
| 4 | interaction-regression :362/:742 (strict-mode: 2× "Increase font size") | **s51-caused** (passed at m0; O-ROT added inspector text ± colliding with the older editor chip) | **FIXED s53**: locators scoped to `.map-text-size-controls` (house pattern, gate12.mjs:170). Duplicate accessible name itself → a11y ledger (pairs with F8) |
| 5 | canvas-editor:373 (ellipse cap intercepts `.map-account-body-hit:not(ellipse)` click, chromium+webkit 1920) | Pre-existing — identical error at m0 | Ledger (s56 geometry rotation) |
| 6 | extended-certification:544 (200-client fixture loads 0 options) | Pre-existing — identical at m0; helper failure, test body never reached | Ledger |
| 7 | s51-selection-context:116 ×9 projects (footnote edit-hit rect w=720 at y=912 intercepts note shift-click) | Real, pre-existing — footnoteText edit-hits date to 2026-07-28 (77f731d era), spec is merely the first to trip on it | Ledger (s56); fix = tighten rect or pointer-events gating |
| 8 | s51-selection-context:137 (firefox-1536) | **Flake** — passed serial ×2; parallel-contention artifact | Dropped |
| 9 | s51-dblclick-title:67 webkit ×5 viewports (editor input never appears) | **O-DBL never worked on webkit** — fails identically at 6131540 (pre-47213cd), so NOT the s52 pointerEvents change | Ledger ⚖ Cyril: fix / defer / declare Chrome-Edge-only |
| 10 | visual.spec :44/:62/:73/:136 + s51-selection-visual (chromium projects) | Stale-by-design (redesign) — every actual eyeballed: ring/badge/bench/Ledger-panel render correctly; :136 delta = shipped s51 changes; ring shot had a transient pan-zoom hint toast baked in | Ring spec seeds the dismissal flag (fix), then **all re-blessed s53** |
| 11 | s51-pills-visual missing baselines (chrome/msedge/webkit-1920) | First-run per project | Generated + eyeballed + blessed (11 PNGs total). Note: webkit renders uniformly lighter (headless colorspace) — acceptable as webkit's own baseline; spot-check real Safari once |
| 12 | s51-retype:6 (dead `details[data-account-id]` selector) | Verdict pre-made in handoff | **FIXED s53** (`.account-card[...]`), green |

## s53 fixes shipped (this session)
- `src/styles/form.css` — Data-panel sticky seam: `.form-section-head` top 126→124px (measured `.data-form-tools` = 41px + 83px at all three viewports; hit-test sweep 906/1046/726 offending samples → 0/0/0; found by the gallery lane's visual inspection, not by any test)
- `tests/e2e/s51-retype.spec.ts` — T-FORM selector
- `tests/e2e/s51-selection-visual.spec.ts` — seed `money-map-generator:pan-zoom-hint:v1=dismissed` pre-goto
- `tests/e2e/interaction-regression.spec.ts` — scope both font-size locators to the editor chip

## axe + keyboard audit (s53, demo build)
- **0 critical / 0 serious axe violations** (map, Data panel open, bench; wcag2a/2aa/21aa/22aa)
- axe-incomplete: **52 SVG text nodes contrast-unverifiable** (map text layer = unverified, not passing) + 9 aria-prohibited-attr on roleless `<text>` (+2 panel) → P5 a11y workstream
- Keyboard: 71-stop clean cycle, no traps, all map affordances reachable; arrows/resize/rotate as declared
- **F14 (NEW): keyboard cannot multi-select** → "+ Flow" keyboard-unreachable ⚖ interaction model needed
- **F10 DENIED empirically** (Escape = one level per press, 3 paths) — supersedes the s52 ledger row
- F7 confirmed wider (aria-hidden in read AND edit mode), F8/F9/F11/F13 confirmed as ledgered

## Ops notes
- pnpm-exec incident: a lane started the 4280 server via `pnpm exec` (prompt gap — forbidden-list omitted from 2 of 5 lane prompts); bundle hash-verified correct, node_modules verified uncontaminated (no .modules.yaml/.pnpm). Rule: the forbidden-block goes in EVERY lane prompt (P5 §J)
- lanewatch stale flags: watcher keys on output growth, never learns completion → re-flags finished lanes; guardrails.js patch is Cyril's (classifier blocks agent edits); diagnosis in P5 §J
- Two-session overlap window 23:46-23:59 (prior session's serial baseline tail vs this session's 8-worker run) — source of count drift and the #8 flake
