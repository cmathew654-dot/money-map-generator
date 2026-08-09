# Money Map

## What This Is

Money Map is Cyril's advisor-facing tool for building a one-page visual map of a client's money (income, accounts, monthly need) that he edits live in a meeting and presents on screen — a replacement for a hand-built PowerPoint. It runs fully client-side (React 19 + Vite), works offline, persists to localStorage, and exports to PDF/PNG/SVG with no external integrations.

This milestone is a left-panel redesign: the canvas and map behavior are stable (sessions 42-55 stabilized selection, Tidy, notes, arrows). What's unresolved is the editor chrome around the canvas — specifically the Data panel (`Form.tsx`) and Wizard (`Wizard.tsx`) — which Cyril experiences as unclear ("what lives where") and visually unrefined ("too many forms," "chunky," "just a rectangle-like field").

## Core Value

Cyril can build a real client's map through the left panel with less hesitation about where a given input belongs, and the panel reads as deliberately designed rather than a stack of form controls. If the redesign doesn't hold up in a real client meeting, it hasn't succeeded — regardless of how it looks in isolation.

## Requirements

### Validated

- ✓ Canvas-first editor shell: 72px rail + on-demand Data/Add/Contents/Help panel — s42
- ✓ Selection model (O-ROT2 "click-again"): account-first click, text-drill-in on re-click — s52, locked contract (`tests/e2e/s52-click-again.spec.ts`)
- ✓ Tidy map as conservative 12-unit anchor snap (not full reset); `Reset arrangement` as the separate full-restore command — s43 stabilization
- ✓ Data panel rebuilt as "Ledger" accordion UI: accordion rows, auto-expand + scroll-into-view on map selection, sticky headers with counts, 14px filter, 32px close — s51 (shipped in code; not reflected in any SPEC document — see Context)
- ✓ Add panel as a readiness checklist (no forced ordering, no modal wizard) — s44

### Active

This milestone, in delivery order:

- [ ] Information architecture: clarify what lives in each Data panel section (client / income / accounts / need / notes, including nested Positions/Sub-accounts) and eliminate conceptual overlap between sections.
- [ ] Flow: define distinct, non-competing roles for the Wizard (420px guided-setup column) and the Data panel (380px, behind the rail).
- [ ] Visual craft: redesign field density, vertical rhythm, hierarchy, states, and motion in the Data panel, built on the existing `--fm-*` token system.
- [ ] Verification: realign Playwright/Vitest suites with what phases 1-3 actually ship; give the 6 parked-red e2e specs and the two open rulings below an explicit, recorded disposition.

### Out of Scope

- Canvas rendering/interaction changes (selection, drag, Tidy, notes, arrows) — stable since s54, not part of this milestone's scope.
- New external integrations, backend services, or dependencies — project stays fully client-side and dependency-flat.
- Unparking accessibility work as a blanket decision — a11y stays parked per Cyril's s54 ruling unless Phase 4 surfaces a specific, scoped reason to reopen it.
- Rebuilding canvas-side inspector into a second full form — inspector stays a quick-actions surface; Details is the only path into exhaustive editing (canvas-first-editor-design.md constraint, still in effect).

## Context

**Standing precedent this milestone resolves:** `docs/superpowers/plans/2026-08-03-session-43-interaction-repair.md` explicitly parked "Wizard/panel redesign, canvas-first IA changes" as "a design decision for Cyril after the repairs land (the 'field form nightmare' call is his)." This milestone is that resolution.

**Spec-vs-shipped drift (Phase 1 must resolve this before anything else):** `canvas-first-editor-design.md` (2026-08-02) describes the Data panel as a plain sectioned form with sticky nav + filter. The panel actually shipped in s51 (2026-08-04/05) as a "Ledger" accordion UI — a different interaction model entirely — and that rebuild exists only in handoff prose, never in a SPEC. Phase 1 starts by documenting what's actually in the code, not what the stale spec says.

**Verified geometry (do not re-derive, just confirm against current code before changing):** `.workspace.is-guided-setup` uses a 420px column (Wizard, `src/styles/app.css`); `.workspace.has-editor-panel .editor-panel` is `left: 72px; width: min(380px, calc(100% - 72px))` (Data panel + rail).

**Two open rulings this milestone must make explicit decision points on, not assumptions:**
1. Mid-edit money formatting (`src/form/Form.tsx:351`): s54 proposed "formatted, spec-expectation edit only"; s55 reopened it because live behavior is raw-on-focus and contradicts that default. Unresolved as of the newest doc in the ingest set.
2. RESET ITEM inspector-clipping (found s46, 1440x900): s54 set a default close ("moot — inspector redesigned twice since") pending Cyril's one-word confirmation; no later doc confirms it.

**Test baseline:** 6 e2e specs are currently parked red (3 accessibility, 2 multitab, 1 interaction regression). Accessibility was parked by Cyril's own s54 decision ("Ceremony cut is LAW... Accessibility batch PARKED unless recruiter-visible") — Phase 4 surfaces this as a choice to reaffirm or revisit, not something to silently reopen or silently leave broken.

**Design system to build with, not replace:** `--fm-*` custom properties (`--fm-ink`, `--fm-muted`, `--fm-hairline`, `--fm-surface`, `--fm-flow`, `--fm-need`) scoped to `.client-form` in `src/styles/form.css`; panel inputs scoped under `.editor-panel-field`.

## Constraints

- **Architecture**: `App.tsx` remains the sole owner of book, client, history, persistence, writer, and selection state — no new state owner, context provider, or state library. Established since s42, never contradicted.
- **Dependencies**: No new runtime dependency for this milestone (per canvas-first-editor-design.md and editor-stabilization-design.md, both still in effect for panel work).
- **Package manager**: npm only — repo is npm-locked; `pnpm`/`pnpm exec` has repeatedly caused breakage.
- **Commit policy**: Conventional commits only (`type(scope): description`), enforced by a commit-msg hook. Commit messages must not contain `docs/superpowers`, `docs/codex`, the standalone word for a sprint hand-off document, or `Claude-Session:`/`Codex-Session:` prefixes.
- **Branch**: No direct commits to main/master; all work stays on `feat/left-panel-redesign`.
- **Accessibility baseline**: WCAG 2.2 AA is the stated target for the app overall, but the accessibility test batch is parked by explicit prior decision — Phase 4 must not silently reopen it while also not silently ignoring it.
- **Test infra**: Playwright runs `--workers=1` with a unique `PLAYWRIGHT_PORT`; canonical project is `chromium-1280x720` (not the generic `chromium` alias used in some older docs).

## Key Decisions

| Decision | Rationale | Outcome |
|-|-|-|
| Treat s51's shipped Ledger accordion Data panel as ground truth over canvas-first-editor-design.md's stale description | Handoff prose confirms the rebuild happened in code; no SPEC was ever updated to match | Pending — confirmed at Phase 1 kickoff |
| Milestone scoped to exactly 4 phases (IA, Flow, Visual craft, Verification) | User-specified scope for this milestone | — Pending |
| Money-format and inspector-clipping rulings carried into roadmap as explicit phase decision points, not pre-resolved | Both are open per the ingest conflict report; resolving them silently would contradict the record | — Pending |

---
*Last updated: 2026-08-08 after initial milestone setup*
