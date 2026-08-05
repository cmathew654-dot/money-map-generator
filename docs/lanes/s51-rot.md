# s51 O-ROT — rotatable account text, 5° rotate steps

## Extended where
Account text (`text:<accountId>:label|caption|value`) now rotates like a note.

- `layout.ts:116,128,132` — `AccountTextLayout` gains `captionRot/titleRot/valueRot`.
- `layout.ts:2447-2450` — `applyAccountTextOverrides` copies `override.rot` *before* the
  dx/dy skip guard; rotation-only overrides were being dropped.
- `layout.ts:3037` — new `isRotatableTextKey(data,key)`. One predicate, four consumers.
- `layout.ts:2362` — `accountTextBlock` exported so text render and rotate handle share a pivot.
- `MapInspector.tsx:238` — `rotKey` accepts account text keys.
- `MapSvg.tsx:1222` — `rotateHandleTarget` returns an account-text target.
- `MapSvg.tsx:1374,1394,1436,1545` — `textRotation()` wraps each role's `<text>` **plus its
  hit-rect** in one rotate `<g>`, so clicks stay aligned with the glyphs.
- `MapSvg.tsx:2812-2818` — **root cause.** `[data-account-id]` beat the text's
  `data-layout-key` in the click resolver, so account text could never be selected at all.
  A rotatable text key now claims the click first.

## Step constants — all 5°
| Where | file:line | was |
|-|-|-|
| Details buttons | `MapInspector.tsx:125-126` | 5 (unchanged) |
| Keyboard `[` `]`, accounts | `MapSvg.tsx:2945` | 15 |
| Keyboard `[` `]`, text | `MapSvg.tsx:2905-2919` (new branch) | — |
| Drag snap increment | `mapInteraction.ts:779` | 15 |

The brief's "drag snap 3°" is the snap *tolerance*, not a step. Increment 15→5, tolerance
stays 3 — so drag rotation now always lands on a 5° step.

## Tests
`tests/s51-rotate.test.tsx` (7) · `tests/e2e/s51-rotate.spec.ts` (2).
Retuned to the new contract: `tests/overrides.test.ts:112` (`snaps rotation to 5-degree
steps`), `tests/e2e/map-keyboard.spec.ts:71`. Suite 744/744.

## s52 amendment — click-again, not click-once
Text stealing the first click cost the account its own label as a selection target.
Now `MapSvg.accountTextClickKey` (exported beside `nextSelectedTargetKeys`) gates the
promotion: text claims a plain click only when the selection is already *inside* its
account and nothing else — the account sole-selected, this text, or a sibling text
(drill-in: rotating label then value costs no extra click). First click, click into a
multi-selection, and every modifier-click fall through to `account:<id>` — modifier-clicks
build item selections, which text keys cannot join. It reads the same render-scope
`selectedTargetKeys` that `toggleSelectedTarget` feeds `nextSelectedTargetKeys`, so
decision and result cannot diverge. Dblclick is untouched — the hit rect owns it and
stops propagation.

Downstream, text stands in for its account everywhere the Data side cares:
- `App.dataTargetForMapKey` maps `text:<acct>:label|caption|value` to the account row;
  `flowEndpointId` derives from it (+ Flow arms, Details resolves).
- `App.selectedMapAccountId` (derived from the mapping) feeds Form/Wizard
  `selectedAccountId`, so the parent row auto-expands for a text selection.
- `MapInspector.canOpenDetails` is now just `!multiSelection && Boolean(onDetails)`;
  the App passes `onDetails` only when the selection maps to a Data row.
- `App.panelSelectionKeys` treats any key mapping to the account's row as "already
  holds the account" — the panel's focus echo used to demote a fresh text promotion
  back to the account whenever the Data panel was open (gate catch, e2e C5b).

## Residual risk
- `rows` / `sub` roles still cannot rotate — not requested, and excluded from
  `isRotatableTextKey`, so no unreachable control ships.
- Lane `node_modules` lost `.bin/` and `@axe-core/playwright` mid-session; e2e was verified
  against byte-identical sources before that.
