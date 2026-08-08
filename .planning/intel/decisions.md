# Decisions

No ADR documents were present in this ingest set (classifications: 5 SPEC, 24 DOC, 0 ADR, 0 PRD). No entries to extract.

Two SPEC documents carry explicit approval/status language that functions like a locked decision even though they are not tagged ADR. Recorded here for downstream visibility only — not treated as LOCKED under the ADR precedence rule since their `type` is SPEC:

## Canvas-First Editor Design — Approved direction
- source: docs/superpowers/specs/2026-08-02-canvas-first-editor-design.md
- status: proposed (doc says "Approved direction"; classifier marked `locked: false`)
- decision: Replace the permanent 420px form pane with a canvas-first workspace (72px rail + on-demand 380px Add/Data/Contents/Help panel). This document "supersedes the left-editor and inspector-alignment portions" of `2026-08-02-editor-tidy-design.md`.
- scope: overall editor IA, Data panel, Add panel, Contents panel, contextual inspector, pointer/selection model

## Editor Stabilization Design — Approved direction
- source: docs/superpowers/specs/2026-08-03-editor-stabilization-design.md
- status: proposed (doc says "Approved direction; implementation pending"; classifier marked `locked: false`)
- decision: Stabilization pass over selection/drag/notes/Tidy; left-editor changes are CSS-only polish, explicitly "not a navigation rewrite."
- scope: canvas interaction stabilization, left panel CSS polish

## Guided-Freeform Build Flow — approved direction
- source: docs/superpowers/specs/2026-08-03-guided-freeform-build-flow-design.md
- status: proposed (doc says "approved direction; implementation pending plan"; classifier marked `locked: false`)
- decision: Add panel becomes a readiness checklist (Map setup); no forced ordering or modal wizard.
- scope: Add panel, top-bar hierarchy
