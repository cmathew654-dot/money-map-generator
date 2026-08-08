# Synthesis Summary

Ingest mode: `new`. Source: 29 classified docs under `docs/superpowers/` (specs, plans, handoffs, dogfood route), covering Money Map sprints/sessions s42–s55 (2026-08-02 → 2026-08-05).

## Doc counts by type
- SPEC: 5 (2 design specs specific to the editor + the canvas-first-editor implementation plan, editor-tidy-design, editor-stabilization-design, guided-freeform-build-flow-design)
- DOC: 24 (implementation plans without formal spec structure, session handoffs, one dogfood acceptance route)
- ADR: 0
- PRD: 0
- UNKNOWN: 0

## Decisions
No ADRs in the ingest set → `decisions.md` has no formal LOCKED/proposed ADR entries. It records 3 SPEC documents whose own "Approved direction" status functions like a decision, for downstream visibility.

## Requirements
No PRDs in the ingest set → `requirements.md` is empty of REQ-* entries by design (not inferred from SPEC acceptance criteria, to avoid fabricating a requirements namespace the sources don't define).

## Constraints
5 entries in `constraints.md`, one per SPEC/plan doc, covering: overall canvas-first editor architecture (rail + on-demand Data/Add/Contents/Help panels, `App.tsx` as sole state owner), the Data panel's original field/behavior contract, Tidy-map behavior (two competing definitions — reset vs. conservative snap — across two SPECs, flagged), note/warning-surface stabilization rules, and the Add-panel readiness-checklist flow.

## Context
`context.md` is organized by topic rather than per-doc, with heavy emphasis (per the calling agent's instruction) on the Data panel / `Form.tsx` history: its s42 introduction as an on-demand panel, an explicit s43 ruling that deeper "Wizard/panel redesign, canvas-first IA changes" is deferred to Cyril's judgment, its s51 rebuild into an accordion "Ledger" panel (undocumented in any SPEC), and two still-open items (mid-edit money format, RESET ITEM clipping). Also covers the selection-model contract (O-ROT2 click-again, Cyril-decided) and standing process/infra constraints (npm-only, push hard-blocked, `App.tsx` sole ownership).

## Conflicts
0 blockers, 1 warning (competing-variants), 4 info (auto-resolved / notable). No cross-reference cycles found. See `C:/Users/Cyril/Projects/money-map-generator/.planning/INGEST-CONFLICTS.md` for full detail — the warning and the second INFO item are both directly relevant to the planned Data-panel/Form.tsx redesign and worth reading before that work starts.

## Files
- `C:/Users/Cyril/Projects/money-map-generator/.planning/intel/decisions.md`
- `C:/Users/Cyril/Projects/money-map-generator/.planning/intel/requirements.md`
- `C:/Users/Cyril/Projects/money-map-generator/.planning/intel/constraints.md`
- `C:/Users/Cyril/Projects/money-map-generator/.planning/intel/context.md`
- `C:/Users/Cyril/Projects/money-map-generator/.planning/INGEST-CONFLICTS.md`
