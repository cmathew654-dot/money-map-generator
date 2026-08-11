# Context

Running notes from 24 DOC-classified sources (handoffs, plans, dogfood routes), grouped by topic. Money Map is described (session-49b handoff) as "Cyril's advisor tool: a one-page visual map of a client's money (income → accounts → monthly need) he can edit live and present." Development ran as sprints/sessions 42–55 (2026-08-02 through 2026-08-05), each ending in a handoff doc; a worktree at `money-map-generator-s40` on branch `repair/session-42` was canonical throughout; the repo was never pushed until deliberate "ceremony" points gated by Cyril.

## Data panel / Form.tsx — evolution directly relevant to the planned redesign

- **s42 (canvas-first shell, 2026-08-02):** `Form.tsx` stopped being a permanent 420px pane and became the content of the on-demand 380px Data panel opened from the rail. Task 3 added optional `filter`, `activeSection`, `onSectionFocus` props to `Form`; a sticky filter/section-nav was added above existing sections (filtering only hides non-matches, never mutates data); canvas selection, Inspector "Details", and Data section focus were wired to stay in sync through `App`. Deferred-minor at handoff: section buttons could activate a section hidden by the current filter (never confirmed fixed in later docs).
  — sources: docs/superpowers/handoffs/2026-08-02-session-42.md, -task-4.md, -task-7.md; docs/superpowers/plans/2026-08-02-canvas-first-editor.md

- **s43 (2026-08-03), explicit deferred ruling on further panel redesign:** `docs/superpowers/plans/2026-08-03-session-43-interaction-repair.md` states under "Explicitly NOT in this plan": *"Wizard/panel redesign, canvas-first IA changes — that's a design decision for Cyril after the repairs land (the 'field form nightmare' call is his)."* This is the standing precedent for the downstream Data-panel/Form.tsx redesign task — it was explicitly parked as Cyril's call, not resolved by any doc in this ingest set.
  — source: docs/superpowers/plans/2026-08-03-session-43-interaction-repair.md

- **s43 (editor-stabilization, same date):** Removed the three "Amount note" inputs from `Form.tsx` (qualifier/valueTag/needTag stay in saved JSON, hidden from UI only). Left-panel changes were CSS-only (uppercase micro-labels reduced, vertical rhythm tightened, Details/Duplicate/shape-selector controls shrunk to 28px height / 11–12px text) — see constraints.md for the "420px panel" vs "380px panel" ambiguity this doc introduces.
  — source: docs/superpowers/plans/2026-08-03-editor-stabilization.md

- **s44 (guided-freeform, 2026-08-03):** Add panel (not Data) got a "Map setup" readiness section in `EditorPanels.tsx`; top-bar reordered (Present/Print/Export primary, New/Book/Reset to overflow). Did not touch Form.tsx/Data panel directly.
  — source: docs/superpowers/plans/2026-08-03-guided-freeform-build-flow.md

- **s48 triage verdict — items explicitly "deferred to designed inspector-redesign pass":** toolbar reorg, colors dropdown, remove START/END nudge groups, arrow thickness, account inline mini-popover, income-name fields in inspector. Status update: most of these subsequently shipped in s49/s50 (toolbar Option A, colors → native-popover dropdown, START/END nudge groups deleted, custom-arrow thickness `sw` 1–6, income row rename on map) — i.e. the "inspector redesign" that was deferred-to has now largely happened; only the account inline mini-popover stayed tabled ("dblclick→Data covers it").
  — sources: docs/superpowers/handoffs/2026-08-04-session-48-handoff.md, -session-49-handoff.md, -session-50-handoff.md

- **s51 (2026-08-04/05) — MAJOR Data panel redesign, not captured in any SPEC doc:** T-FORM lane rebuilt the Data panel as a "Ledger Data panel per mockup A": accordion rows, map-selection auto-expand + scroll-into-view (reusing the s49 `focusRequest` mechanism), sticky headers with counts, 14px filter input (`aria-label="Filter data"`), 32px in-panel close (X). Sign-off deviation: field labels dropped to sentence case (one caps level: section headers only) — mockup showed "Tax treatment/Owner", real model fields are "Account type/Supporting note". Structural note from s52 triage: accounts now render as `div.account-card` / `button.account-summary` in `Form.tsx` (~lines 841–857), replacing an older `details[data-account-id]` structure the tests still expected. A P4 fix (s49b/s50) set `scroll-margin-top: 132px` + `block:'start'` so scrolled-to cards don't land under the sticky panel header at narrower widths.
  — sources: docs/superpowers/handoffs/2026-08-04-s51-sprint-handoff.md, -session-49b-handoff.md, -2026-08-05-s52-handoff.md

- **s51 T-RETYPE decision:** after-tax income and sub-account carve-outs are NOT treated as "aggregate" (size-only, non-retypeable) rows — they are advisor-entered values and stay directly editable; a broader auto-aggregate rule would have broken real editing. Detail in `docs/lanes/s51-retype.md` (not in this ingest set).
  — source: docs/superpowers/handoffs/2026-08-04-s51-sprint-handoff.md

- **Money format in Form.tsx — still an OPEN/unresolved item as of the latest doc in this set:** s49b shipped "live thousands separators in money drafts" (`Form.tsx:294-308`, caret-safe). s54 handoff records an "open ruling" with a stated default pending Cyril's one-word approval: *"Mid-edit money format: default = formatted ($2,400), spec-expectation edit only."* s55 handoff (the most recent doc, 2026-08-05) reopens it: *"Money format OPEN: Cyril ruled formatted mid-edit, but live behavior is RAW on focus (`Form.tsx:351` snapshot `String(value)`). Spec-edit-only scope couldn't cover it; needs a behavior call (also settles the s54a 'multitab money format PARTIAL' row)."* Treat as unresolved going into any Form.tsx work.
  — sources: docs/superpowers/handoffs/2026-08-04-session-49b-handoff.md, -session-48-handoff.md, 2026-08-05-s54-handoff.md, -s55-handoff.md

- **RESET ITEM inspector-row clipping at 1440×900** (found during s46 dogfood, wraps to a second row the panel clips): carried as an open verdict through s47–s53, then s54 handoff sets a default: *"RESET ITEM clip (s46): default = close as moot (inspector redesigned twice since)"* — pending Cyril's one-word confirmation, not yet formally closed in any doc in this set.
  — sources: docs/superpowers/dogfood/2026-08-03-final-pass-route.md, docs/superpowers/handoffs/2026-08-03-session-45-handoff.md, -session-46-handoff.md, -2026-08-05-s53-handoff.md, -s54-handoff.md

- **Universal open decision trio (s53 handoff, still pending):** multitab money-format, 28px inspector-button touch target size, lease-banner timeout — bundled for one Cyril sign-off, not resolved in this doc set.
  — source: docs/superpowers/handoffs/2026-08-05-s53-handoff.md

## Selection model (O-ROT2 "click-again") — Cyril-decided, binding contract

s52: first click on account text selects the ACCOUNT; text promotes to the text target only when the selection is already inside that account (sole account, the text itself, or a sibling text — "drill-in"). Modifier-clicks always resolve to the account. This is called out repeatedly in later handoffs as a locked, Cyril-decided behavior contract (`tests/e2e/s52-click-again.spec.ts`, 7 items) that any future selection/reducer work "must stay green."
— sources: docs/superpowers/handoffs/2026-08-05-s52-handoff.md, -s53-handoff.md, -s54-handoff.md

s54: identified the selection subsystem as multi-writer (MapSvg + 19 App.tsx setter call-sites + 9 onFocus handlers + `panelSelectionKeys`, itself modifier-blind) and scoped a "Batch B" single-owner selection reducer as the real fix — status at the last doc in this set (s54 handoff) was "design lane proposes reducer, Fable gates design, then impl lanes migrate" — not confirmed complete by s55.
— source: docs/superpowers/handoffs/2026-08-05-s54-handoff.md

## Canvas interaction, notes, Tidy, map polish (sessions 42–47)

- s42: pointer ownership clarified (text click = edit, card-body drag = move; "Snap to alignment" removed); rail + Data/Add/Contents/Help panels shipped; multi-selection + align/distribute + internal clipboard; `ClientCombobox` (title/year search); connector-handle flow creation.
- s43 interaction-repair (12 slices, Codex 5.3 Spark implementer, audited by Fable): single-click selects / double-click edits; selection no longer moves the map (deleted `.map-scroller { top: 112px }` re-fit-on-select bug); phantom-undo-step fix (`nudgeLayoutOverride` reference-equality no-op); stale text-draft-on-undo fix; quick-add routes focus into the new object's name field; new accounts avoid occupied ground (collision nudge); Tidy resolves overlaps; toast stacking above toolbar; writer-lease re-acquire on tab visibility return; inspector select-width truncation fix; bottom toolbar reachable at 200% zoom; honest pan-hint copy.
- s44: all 12 slices merged; found + fixed two-tab writer-lease "brick" bug (second tab silently stealing lease) and reproduced/exonerated an earlier fix. Wizard `hasWarnings={false}` hardcode identified as known debt (never wired up in this doc set).
- s45/46: full-suite gate reached "0 unexplained failures" baseline; fixed a real Tidy no-op bug (anchors lacked w/h, corner-trapping nudge, 1px overlap rounding) and a tab-id-collision "split-brain" bug (both tabs editable simultaneously). Confirmed-but-unresolved-in-this-set: undo history destroyed on every tab handoff (accept-and-document default); lease state invisible to screen readers; export/print fidelity has zero automated gates.
- s44–47 (map-polish parallel lanes): chip/connector-anchor collision avoidance against other arrows + income/need/account boxes; note color boxes + inspector swatches; account/note/footnote rotation (`LayoutOverride.rot`, 5° steps, magnet at 15°); "chip teleport" bug took 3 rounds to fix (froze the as-needed chip's anchor at drag-gesture-start via `showSnapshot`, not on commit).
— sources: docs/superpowers/handoffs/2026-08-02-session-42*.md, -2026-08-03-session-42-e2e-repair.md, -session-43-handoff.md, -session-44-handoff.md, -session-45-handoff.md, -session-46-handoff.md, -2026-08-03-parallel-lanes-wave1-handoff.md, -2026-08-04-parallel-lanes-wave2-complete.md, -session-47-final-handoff.md; docs/superpowers/plans/2026-08-03-session-43-interaction-repair.md; docs/superpowers/dogfood/2026-08-03-final-pass-route.md

## Sessions 48–50 — dogfood-driven fix waves

Two human testers (Cyril + a "novice dogfooder") drove a repeating cycle: ship → dogfood on a LAN demo (port 4280) → triage findings into parallel implementation lanes → interactive-gate → redeploy. Notable shipped items: undo-keeps-panel-open, Present-mode zoom stash/restore, dblclick account/income/need body → opens Data panel, "+Flow" chrome button, live thousands separators in money input, Contents grouped by type, PDF metadata, income-row rename directly on the map, inspector decluttering (removed START/END nudge groups, colors → native dropdown), generated-arrow thickness control, rotate step changed 15°→5°, a11y lease live-region. Explicitly tabled/deferred within this window: curved (textPath) flow labels ("skip" unless dogfood says labels read poorly), summed-number ("aggregate") retype behavior — 3 options presented to Cyril, no pick recorded in this doc set (Fable's non-binding lean was option (c), "keep size-only + an 'Edit the rows' jump").
— sources: docs/superpowers/handoffs/2026-08-04-session-48-handoff.md, -session-49-handoff.md, -session-49b-handoff.md, -session-50-handoff.md

## Sessions 51–55 — Data panel redesign sprint, adversarial review, ceremony cut

- s51: 9-lane parallel merge (selection modifier-click fix, wrapped-title dblclick, account-text rotation, selection ring/halo, aggregate-retype guard, **Ledger Data panel redesign**, docked action bench, gate12.mjs 45-check driver). See "Data panel" section above for T-FORM detail.
- s52: O-ROT2 click-again selection model DECIDED (see above); adversarial review process (3 finder lenses → dedup → 2-3 refuters/finding) adopted as the template for future QA; zero data-integrity survivors.
- s53: full 19-project Playwright baseline triaged to zero un-verdicted failures (`docs/lanes/s53-triage.md`, not in this ingest set); a P5 "systematic audit-program plan" was drafted per Cyril's mandate.
- s54: **"Ceremony cut is LAW (Cyril, 2026-08-05): half-page handoffs, 2-3 commits per batch, single verify pass, no triage essays. P5 audit program is DEAD. Accessibility batch PARKED unless recruiter-visible."** This is a standing process/scope ruling, not a product decision, but constrains how future sprint work (including any Form.tsx redesign) should be planned and reported.
- s55 (most recent doc in this set, 2026-08-05 ~04:20): "Batch A/B + s55 bug/spec pass" — see Data-panel money-format OPEN item above; this is the latest state captured in the ingest set.
— sources: docs/superpowers/handoffs/2026-08-04-s51-sprint-handoff.md, 2026-08-05-s52-handoff.md, -s53-handoff.md, -s54-handoff.md, -s55-handoff.md

## Standing process/infra facts (non-product, but load-bearing for any future work on this repo)

- `App.tsx` is the sole state/history/persistence/writer owner throughout every sprint in this set — never contradicted.
- Repo is npm-locked; pnpm use (including `pnpm exec`) repeatedly caused breakage — treat as forbidden.
- `git push`/remote changes are hard-blocked by repo hooks + `guardrails.js vc`; the GitHub remote (`github.com/cmathew654-dot/money-map-generator`) already existed with content since ~Aug 1 (discovered s45/46) — any future publish is a push-update, not a first upload, and goes through Cyril explicitly.
- Playwright must run `--workers=1` with unique `PLAYWRIGHT_PORT` per invocation; `chromium-1280x720` is the canonical project (not the generic `chromium` alias used in older plan docs).
- Selection/account DOM addressing trap: `[data-account-id]` resolves 2 nodes (visible + hidden print copy) — always `.first()` / scope further.
- Recurring inherited-debt test failures (money-input locator rot, wizard `hasWarnings` hardcode, rapid-handoff race family, WCAG/reflow items) were repeatedly re-triaged across s44–s53 and are treated as known, not blocking.
