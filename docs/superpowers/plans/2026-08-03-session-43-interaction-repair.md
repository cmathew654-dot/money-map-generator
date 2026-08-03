# Session 43 — Interaction & Trust Repair Plan

Audited 2026-08-03 by Fable 5 (live headless reproduction + three code audits).
Full evidence: scratchpad `audit-interaction.md`, `audit-state.md`, `audit-layout.md`
(session scratchpad), screenshots `evidence/*.png`.

Worktree: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`
Branch: `repair/session-42` (continue on it). Never push, never add a remote.

## Verdict that frames everything

Dragging is NOT mechanically broken. It feels broken because:
(1) a single click anywhere on an object opens a text editor instead of
selecting it, and (2) opening the inspector re-fits the map so objects jump up
to 330px on screen mid-interaction. Fix the interaction model and most of the
"can't move/click/drag" complaint disappears. 534/534 unit tests are green
while the product is unusable — tests validate math, not journeys. Every slice
below therefore lands with one journey-shaped check, not more unit polish.

## Rules for the implementation model (Codex 5.3 Spark) — read before every slice

- Do ONLY the slice you were given. No refactors, no renames, no drive-by
  cleanups, no new dependencies, no new files unless the slice says so.
- RED first: run the named check, confirm it fails for the stated reason,
  paste the failing output into your report. Then implement. Then GREEN: paste
  passing output. A slice without both outputs is incomplete.
- If a file/line anchor doesn't match what you find, STOP and report — do not
  improvise a different fix location.
- `App.tsx` stays the sole owner of book/history/persistence/writer state.
  Null money stays null (renders `~$ ______`, never 0).
- Playwright: always `--workers=1`, one project (`chromium-1280x720`), unique
  `PLAYWRIGHT_PORT`, hard timeout. Never weaken an assertion, never add sleeps,
  never update a screenshot baseline.
- One commit per slice, message `fix(scope): ...` or `test(scope): ...`.

Per-slice gate (orchestrator runs, not Spark): review full `git diff` against
the slice contract, run the slice's verify commands yourself, screenshot the
affected route. Spark's self-report is never trusted over the diff.

## Global verify (after slices 1-5, and again at the end)

```powershell
npx vitest run
$env:PLAYWRIGHT_PORT='4411'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
npm run build
git diff --check
```

---

## Slice 1 — Single click selects; double-click / Enter edits  [BLOCKER, core]

Goal: clicking any part of a map object selects the whole object (inspector
opens, no text editor). Editing text requires double-click, or Enter/Space on
the focused hotspot (keyboard path unchanged).

Files: `src/render/MapSvg.tsx` — `editableTextProps` (~line 262-267) and
`editableHitAreaProps` (~line 362-369). Both currently call `activate()` from
`onClick`.

Change:
1. In both prop builders, move the `activate()` call from `onClick` to a new
   `onDoubleClick` handler. The `onClick` should instead select the containing
   object (see Slice 1b) — i.e. fall through to the container selection path
   rather than `stopPropagation`-ing into edit.
2. Keep the existing keyboard activation (Enter/Space) exactly as is.
3. `src/styles/app.css` ~2103-2106 and ~2360-2362: `.map-editable-hit`
   `cursor: text` → `cursor: grab`.

Slice 1b (same commit): `handleMapClickCapture` (`MapSvg.tsx` ~2677-2685)
resolves the clicked hit-rect's own `data-layout-key`, so income/need clicks
select an inner text run instead of the container. Resolve the closest
`[data-map-target]` container key FIRST; only fall back to the text key when
no container exists. (Accounts already escape via the `[data-account-id]`
check — make income/need behave the same way.)

RED (write first, in `tests/e2e/interaction-regression.spec.ts`):
- Route "single click selects container": open app, click the CENTER of the
  income panel body. Assert the inspector heading shows the income panel (not
  "Income amount for ..."), and assert no `textarea` exists in the DOM.
  This fails today: click opens a textarea for "Income amount for Pension — Dana".
- Route "double click edits": dblclick the same point, assert a `textarea`
  appears.

Verify:
```powershell
$env:PLAYWRIGHT_PORT='4412'; npx playwright test tests/e2e/interaction-regression.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
npx vitest run
```
Don't: touch `beginDrag`/`finishDrag`, don't change hotspot geometry, don't
remove keyboard activation, don't touch MapInspector.

Est: 45 min.

## Slice 2 — Selection must not move the map  [BLOCKER, core]

Goal: opening/closing the inspector leaves the canvas exactly where it was.

Files: `src/styles/app.css` ~746-748 — delete the rule
`.preview-pane.has-map-inspector .map-scroller { top: 112px }` (the inspector
is already absolutely positioned). Then check `App.tsx` ~380-393 (fit
recompute): if the fit effect re-runs because pane height changed on
selection, guard it so selection state alone never triggers a re-fit.

RED: Playwright route: record `getBoundingClientRect()` of an account group,
click it (selects after Slice 1), assert the rect moved < 2px.
Today it jumps ~112-330px.

Verify: same commands as Slice 1 (port 4413).
Don't: touch zoom controls or Fit button behavior.

Est: 30 min.

## Slice 3 — Kill the phantom undo step  [HIGH]

Goal: a drag that ends with zero net displacement commits nothing; first
Ctrl+Z after a real drag reverts that drag.

Root cause: `nudgeLayoutOverride` (`src/layout/layout.ts` ~3003-3034) always
returns a new object even when computed dx/dy equal the existing override, and
`pushHistory`'s guard (`src/model/book.ts` ~238-243) is reference-only.

Change (root fix, all callers benefit): at the top of the return path in
`nudgeLayoutOverride`, if the computed `dx`/`dy` (and any other written
fields) are strictly equal to the existing override values, return the
original `data` object unchanged. Reference equality then makes
`finishDrag`'s `onChange` → `pushHistory` a natural no-op.

RED (vitest, `src/layout/` test file next to existing layout tests): call
`nudgeLayoutOverride` with a delta that lands exactly on the current
override; assert the SAME object reference is returned. Fails today.
Plus Playwright route: drag an account 100px and release, press Ctrl+Z once,
assert the account is back at its original rect (one undo, not two).

Verify: `npx vitest run` + interaction spec (port 4414).
Don't: change `DRAG_THRESHOLD_PX`, don't make `pushHistory` deep-compare
(that's the expensive path — fix at the source instead).

Est: 30 min.

## Slice 4 — Stop stale text drafts resurrecting on undo  [HIGH]

Goal: undo/redo while a map text editor is open discards the draft; it never
re-commits stale text on top of the restored snapshot.

Root cause: `restoreHistorySnapshot` (`src/App.tsx` ~452-464) nulls
`mapTextEdit` in the same commit that rolls back the book; unmounting the
focused `MapTextEditor` fires native blur → stale inline `onCommit`
(`App.tsx` ~1985-2016) re-applies pre-undo text.

Change: add a ref, e.g. `const discardMapTextCommitRef = useRef(false)`.
`restoreHistorySnapshot` sets it `true` before `setMapTextEdit(null)` and
resets it in a microtask/effect after. The inline `onCommit` returns
immediately (no `applyMapTextEdit`, no `handleClientChange`) when the ref is
set. Also set the ref in `selectClient` (`App.tsx` ~880-886) before switching
clients — same unmount-blur path can commit client A's draft into client B.

RED (Playwright, `tests/e2e/multitab-history.spec.ts` or interaction spec):
start editing a map text (type "STALE DRAFT", don't commit), press Ctrl+Z.
Assert "STALE DRAFT" appears nowhere in the SVG and the undo took effect.

Verify: interaction + multitab specs (port 4415) + vitest.
Don't: switch `onCommit` to `onCancel` semantics globally; normal blur-commit
behavior must stay.

Est: 45 min.

## Slice 5 — Quick-add routes you into the new object  [HIGH, create flow]

Goal: "+ Account" → pick type → the new account is selected AND its name is
ready to type (text editor open on the name field). Keyboard: the popover
takes focus, arrows/Tab move between types, Enter picks, Escape closes.

Files: `src/App.tsx` ~2045 (`.shape-quick-add` popover) and the add-account
handler (~1449); `src/App.tsx` ~2077 pan-zoom hint.

Change:
1. When the popover opens, move focus to the first type button
   (`ref`+`focus()` in an effect). Escape returns focus to "+ Account".
2. After a type is chosen: select the new account (`selectedMapTargetKey`)
   and open the map text editor on its name (same mechanism a dblclick on the
   name would use after Slice 1).
3. Occlusion: opening the popover dismisses (or temporarily hides) the
   pan-zoom "Got it" hint so the type chips are never covered.

RED (Playwright): on a fresh client, click "+ Account", assert
`document.activeElement` is inside the popover. Choose "Cash"; assert a new
account exists, is selected, and a textarea/name editor is focused. Today:
focus stays on the button and typing goes nowhere.

Verify: canvas-editor spec (port 4416) + vitest.
Don't: redesign the popover, don't add a modal, don't touch the wizard.

Est: 45 min.

## Slice 6 — New accounts never land on occupied ground  [HIGH]

Goal: quick-add and panel-add place the new account in free space.

Root cause: `appendBlankAccount` (`src/model/book.ts` ~200) stores no
position; `placeColumn` (`src/layout/layout.ts` ~1098) stacks by bucket with
no collision awareness of user-dragged `layoutOverrides` (applied at
layout.ts ~2103-2121). A working AABB check already exists:
`duplicatePlacement` (`src/render/mapInteraction.ts` ~465-489).

Change: after adding, compute the new account's laid-out rect; if it
intersects any existing item rect, apply the `duplicatePlacement`-style nudge
(+24,+24 then −24,−24, clamped) as a dx/dy override in the SAME history step
as the add (one undo removes the account, position included).

RED (vitest): build a book where the default slot for a new after-tax account
is occupied by a dragged account; add an account; assert no pairwise overlap
among laid-out rects. Plus keep the existing live repro in mind: adding to the
Whitfield sample previously overlapped the Roth cylinder.

Verify: vitest + canvas-editor spec (port 4417).
Don't: change `placeColumn`'s base layout, don't reflow existing items.

Est: 45 min.

## Slice 7 — Tidy resolves overlaps  [HIGH]

Goal: after "Tidy map", no two items overlap.

Root cause: `tidyArrangement` (`src/model/book.ts` ~368-408) is a pure
per-item grid snap (±6px to nearest 12px), zero intersection testing.

Change: after the snap loop, one pairwise AABB pass over laid-out rects
(reuse the intersection predicate from `mapInteraction.ts` ~477-482): for
each overlapping pair, nudge the later item down/right in 12px grid steps
until clear, writing dx/dy overrides. Still ONE history step.
`# ponytail: O(n²) pairwise pass — fine at advisor map sizes (<50 items)`

RED (vitest): two items overlapping by 20px → `tidyArrangement` → assert no
overlap and both positions on the 12px grid. Fails today.

Verify: vitest + canvas-editor spec (port 4418).
Don't: build a full packing/reflow algorithm. Nudge-until-clear only.

Est: 45 min.

## Slice 8 — Toasts stop covering the toolbar  [MEDIUM]

Files: `src/styles/app.css` ~510 (`.toast-region` bottom/right 18, z 20) vs
~943 (`.map-chrome` bottom/right 16, z 5); `src/App.tsx` ~484 (`addToast`).

Change: move `.toast-region` up so it stacks ABOVE the toolbar's height
(e.g. `bottom: 64px`), and cap the queue in `addToast` to the 2 most recent.

RED (Playwright): trigger add-account + tidy quickly; assert "Tidy map"
button's center point hit-tests to the button (`document.elementFromPoint`),
not a toast.

Verify: canvas-editor spec (port 4419).
Est: 20 min.

## Slice 9 — Writer lease re-acquires on tab return  [HIGH, trust]

Goal: a tab that released its lease on hide re-acquires it when it becomes
visible again (no other tab holding it) — the permanent "View only — editing
is active in another Money Map tab" state dies.

Root cause: `visibilitychange → hidden` releases (`src/App.tsx` ~619-628) but
there is no `→ visible` counterpart; re-acquire rides only on `focus`/
`pageshow` (~581-637), which don't fire on every hidden→visible transition.

Change: in the same visibilitychange handler, when
`document.visibilityState === 'visible'` and `!isWriter`, run the same
re-acquire path `focus` uses (`requestOnFocus` logic).

RED: extend `tests/e2e/multitab-history.spec.ts`: single tab, dispatch
`visibilitychange` to hidden (lease released), then to visible WITHOUT firing
window `focus`; assert the tab becomes writable (Title field enabled) within
the lease TTL. Fails today.

Verify: multitab spec (port 4420) + vitest.
Don't: touch TTL/heartbeat constants or the takeover protocol.

Est: 30 min.

## Slice 10 — Inspector strip speaks English  [MEDIUM, feel]

Goal: the "SELECTED" strip stops truncating ("Cyli", "After-t", "Choo").

Files: `src/render/MapInspector.tsx` (~423-620), `src/styles/app.css`
~806-860 (`.map-inspector-controls`, `select` widths).

Change: give `.map-inspector select` a min-width that fits its longest option
(or `width:auto`); allow the controls row to wrap to a second line. Full
labels stay ("Shape", "Account type", "Add flow to" already exist — the
truncation is CSS width, not copy).

RED (Playwright): select an account; for each `select` in the inspector,
assert `el.scrollWidth <= el.clientWidth` (no clipped text).

Verify: interaction spec (port 4421).
Don't: redesign the inspector or move it. Width/wrap only.

Est: 20 min.

## Slice 11 — Bottom toolbar reachable at 200% zoom  [HIGH, a11y]

Goal: at 640×360 viewport, Tidy / + Text note / + Account / zoom controls are
on-screen and clickable.

Files: `src/styles/app.css` ~943-960 (`.map-chrome`, incl. existing media
query at ~954).

Change: at narrow widths let `.map-chrome` wrap into two rows and pin within
the visible viewport (it currently sits below 360px height). Keyboard: all
its buttons already tab-focusable — verify, don't rebuild.

RED (Playwright, viewport 640×360): assert each toolbar button's bounding box
is inside the viewport and `elementFromPoint` at its center hits it.
Today: Tidy/+ Account at y=400 (offscreen).

Verify: reflow spec if it exists, else interaction spec (port 4422).
Est: 30 min.

## Slice 12 — Honest pan hint  [POLISH]

Files: `src/App.tsx` ~1391-1396 (pan disabled at fit zoom), ~2076 (hint).

Change: only show "Drag the map background to pan" when panning is actually
possible (zoomed past fit); otherwise say "Hold Ctrl (⌘) while scrolling to
zoom." Alternatively (smaller): always allow background drag to pan when the
map overflows, and keep the copy. Pick the first (copy gate) — smaller.

RED (Playwright): at fit zoom assert the hint does not mention panning.
Est: 15 min.

---

## Explicitly NOT in this plan (report, don't build)

- Wizard/panel redesign, canvas-first IA changes — that's a design decision
  for Cyril after the repairs land (the "field form nightmare" call is his).
- New E2E matrix breadth (WebKit, other viewports) — only for routes a fix
  touched.
- Any dependency, any new state owner, any test-only product mode.

## Order & stop rule

1 → 2 → 3 → 4 (core feel + trust) → 5 (create flow) → 6 → 7 (placement) →
9 (lease) → 8 → 10 → 11 → 12. Stop and report after Slice 4 for a human
dogfood pass before continuing — if the app still "feels broken" at that
point, the model above is wrong and continuing wastes the remaining slices.
