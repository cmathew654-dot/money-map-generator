# Guided-freeform map build flow

Date: 2026-08-03
Status: approved direction; implementation pending plan

## Goal

Make a blank or partially built Money Map feel guided without forcing advisors through a wizard. Advisors may add income, accounts, or monthly need in any order, and every action remains available.

## Design

Replace the Add panel's undifferentiated toolbox framing with a compact Map setup checklist. The checklist reflects readiness, not a required sequence:

- Income sources: add or edit
- Accounts: add or edit
- Monthly need: set
- Flows: automatic first, custom optional
- Notes: optional

The first incomplete essential becomes the recommended action, but no other action is blocked. Adding any item immediately focuses its corresponding Data fields so the advisor can edit it before continuing. Adding an account first is fully supported; adding income first is fully supported; setting monthly need first is fully supported.

Flows and notes remain secondary sections below essentials. Automatic flows are described as the default result of having compatible endpoints. Custom flow creation and annotations remain available but do not compete with setup actions.

## Interaction rules

- Add actions mutate the map and focus the new item's Data fields.
- The recommendation updates from current data after each mutation.
- Existing freeform Add, Contents, Data, and canvas editing remain available.
- No modal wizard, forced ordering, or hidden advanced capability is introduced.
- Empty states explain the next useful action without claiming that it is mandatory.

## Acceptance criteria

- From a blank map, an advisor can add account, income, or need in any order.
- Each first add opens/focuses the matching editable fields.
- The Add panel clearly separates essentials from optional flows/notes.
- The recommended next action changes as essentials are completed.
- Existing custom map editing, undo, persistence, and export behavior remain unchanged.

## Scope

Likely files: `src/ui/EditorPanels.tsx`, `src/App.tsx`, `src/styles/app.css`, and focused panel tests. No new dependencies or state owner changes.

## Top-bar hierarchy

Apply the same principle to the header without turning it into a checklist:

- Left: Money Map wordmark and client identity.
- Center: undo/redo, shown as contextual history actions.
- Primary right: Present, Print, and Export.
- Overflow: New client, Book, Reset, and recovery/settings actions.

All actions remain available, but high-frequency presentation/output actions are visually primary and lifecycle/settings actions stop competing for equal attention.
