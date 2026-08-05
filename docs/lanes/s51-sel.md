# s51 O-SEL — modifier-click selection clobber

Path: brief said `src/map/`; real file is `src/render/MapSvg.tsx` (line
numbers matched, scope unchanged).

## Root cause (brief's hypothesis was wrong)
`toggleSelectedTarget` ignored modifier state once `isCompatibleMapItemKey`
failed and called `setSelectedTarget` — a full replace. The note `onFocus`
race was not the mechanism: the chip has no `tabIndex`/`onFocus`, and notes
never take pointer focus because `beginDrag` calls `preventDefault()`
(MapSvg.tsx:2386). E2E proved it — the note case was green pre-fix.

## Mixed selection
account+note: **supported** (`MapItemKey`; align/distribute/delete use it).
chip/arrows/income/need: **not supported** — they now preserve the existing
selection (no-op) instead of replacing it.

## Changes
Pure `nextSelectedTargetKeys` + `shouldFocusSelect` appended at EOF —
nothing exportable fits inside the component body (deviation; appending
touches no existing line or other lane's range).
`toggleSelectedTarget` (2284) delegates to it. Note `onFocus` (3318) selects
only when `:focus-visible`, fails open. `handleMapClickCapture` untouched:
the guard sits below all callers. Left alone: line 1872, arrow editor has the
same unconditional `onFocus` — outside frozen scope.

## Verification
tsc clean; vitest 750/750; e2e 5/5 (chromium).
Escape-then-shift-click resetting to one selection is asserted as intended.
Six `interaction-regression`/`map-keyboard` failures are pre-existing,
reproduced on base 677d0db.
