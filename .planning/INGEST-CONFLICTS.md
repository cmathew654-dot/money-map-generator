## Conflict Detection Report

### BLOCKERS (0)

None. No ADR documents were present (no LOCKED-vs-LOCKED possibility), no cross-reference cycles were detected among the 29 classified docs (cross_refs point overwhelmingly to source/test file paths; the small number of doc-to-doc references form a linear handoff chain: task-4 → task-6 → task-7 → e2e-repair → session-43 → ... → session-55, and wave1 → wave2 → session-47), and no doc was classified UNKNOWN or low-confidence.

### WARNINGS (1)

[WARNING] Left-panel width/model stated inconsistently across two same-precedence SPECs
  Found: docs/superpowers/specs/2026-08-02-canvas-first-editor-design.md replaces the permanent form pane with a 72px rail + on-demand 380px Add/Data/Contents/Help panel ("The old Guide me / Full form toggle is removed from the normal workspace"). One day later, docs/superpowers/specs/2026-08-03-editor-stabilization-design.md's "Left editor polish" section says "Keep the existing 420 px panel, tabs, state ownership, and workflows" without naming which panel (Data panel vs. Wizard guided-setup panel) it means.
  Impact: Both are type SPEC with no explicit precedence override and no textual supersession between them (unlike editor-tidy-design.md, which canvas-first-editor-design.md explicitly supersedes). The companion implementation plan (docs/superpowers/plans/2026-08-03-editor-stabilization.md, Task 5 "Interfaces") disambiguates this as two coexisting panels — "420 px guided panel, 380 px editor panel" — suggesting no real contradiction, but the design-spec prose itself never makes that split explicit. This is directly relevant to the planned Data-panel/Form.tsx redesign: a reader of editor-stabilization-design.md alone could wrongly conclude the canvas-first on-demand Data panel was reverted to a permanent 420px pane.
  → Confirm with the implementation plan (or current Form.tsx) which panel is 420px (Wizard) vs 380px (Data) before using editor-stabilization-design.md's "420 px panel" language as ground truth for the redesign.

### INFO (4)

[INFO] Auto-resolved: explicit textual supersession, canvas-first-editor-design.md > editor-tidy-design.md
  Note: docs/superpowers/specs/2026-08-02-canvas-first-editor-design.md states in its own Status section: "This specification supersedes the left-editor and inspector-alignment portions of `2026-08-02-editor-tidy-design.md`." Both are type SPEC (precedence tie by default ordering), but the newer doc's explicit textual claim resolves the overlap without ambiguity. editor-tidy-design.md's Tidy-map and calculated-text sections remain in effect and are not touched by this supersession. Synthesized into constraints.md with the supersession noted on both entries.

[INFO] Shipped Data panel implementation has diverged from its governing SPEC document
  Note: canvas-first-editor-design.md (2026-08-02) describes the Data panel as a plain sectioned form with a sticky navigator and filter. Handoff prose from sprint s51 (2026-08-04/05, docs/superpowers/handoffs/2026-08-04-s51-sprint-handoff.md and 2026-08-05-s52-handoff.md) describes a subsequent "Ledger Data panel per mockup A" rebuild — accordion rows, auto-expand/scroll on map selection, sticky headers with counts, 14px filter, 32px close — that is not reflected in any SPEC document in this ingest set. No DOC or SPEC formally records this as a design decision; it exists only in handoff prose. Downstream planners should treat canvas-first-editor-design.md's Data-panel section as historically superseded-in-practice by the s51 accordion rebuild, pending an actual spec update.

[INFO] Money-format-in-Form.tsx is an explicitly open item as of the newest document in the set
  Note: docs/superpowers/handoffs/2026-08-05-s54-handoff.md records a default ruling ("formatted, spec-expectation edit only") pending Cyril's one-word approval; docs/superpowers/handoffs/2026-08-05-s55-handoff.md (one day later, the most recent doc ingested) reopens it, reporting live behavior contradicts the ruling and "needs a behavior call." Not a synthesis conflict to resolve — both sources agree it is unresolved — but flagged so downstream planning doesn't treat s54's default as settled.

[INFO] RESET ITEM inspector-clipping finding carried a provisional-only closure
  Note: found in dogfood testing at s46 (docs/superpowers/dogfood/2026-08-03-final-pass-route.md), tracked as an open verdict through s53, and given a default closure in docs/superpowers/handoffs/2026-08-05-s54-handoff.md ("close as moot (inspector redesigned twice since)") pending Cyril's one-word confirmation. No later doc in this set confirms the close.
