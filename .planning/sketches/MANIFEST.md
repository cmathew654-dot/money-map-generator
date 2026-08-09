# Sketch Manifest

## Design Direction

Money Map's editor is being reconsidered after Phase 1's human-verify checkpoint failed. Phase 1 fixed field taxonomy correctly, but dogfooding still failed, which exposed that the phase's success criterion tested *recognition* (given a field, name its section) rather than *retrieval* (given an intent, find the control).

The direction is **collapse duplication, do not add capability**. The app currently carries three overlapping projections of the same data (the Data panel, the Contents panel, and the map itself) plus two separate filter boxes, and it signals none of them. `contentItems()` in `src/ui/EditorPanels.tsx` already builds the flat grouped index any fix would need.

Held fixed by explicit user ruling: the canvas double-click editing contract. It works, it is proven by e2e tests, and it is not to be changed. Palette and typeface are also held fixed during sketching so comparisons are structural; visual craft is a later phase.

## Reference Points

The app's own existing visual language: `--fm-ink #1c2422`, `--fm-muted #47504d`, `--fm-hairline #dde1dc`, `--fm-section #f4f6f2`, `--fm-flow #1e7a4a`, `--fm-need #c03a2d`; Literata for display, Public Sans for UI.

## Sketches

| # | Name | Design Question | Winner | Tags |
|-|-|-|-|-|
| 001 | panel-retrieval | What replaces Add + Data + Contents, so a control is reachable from an intent rather than a section name? | *pending review* | ia, navigation, retrieval, shell |
