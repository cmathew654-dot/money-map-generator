# Session 43 handoff — Money Map drag recovery

Date: 2026-08-03
Worktree: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`
Branch: `repair/session-42`
HEAD: `1d93953 fix: recover writer lease for dev map dragging`

## Current state

The user’s screenshot showed native text selection while dragging “Short-Term Funds.” The visible drag code was already correct. The actual failure was writer ownership:

1. Real mode starts with a foreign browser writer lease.
2. `App` therefore passed no `onChange` to `MapSvg`.
3. The map lost `map-interactive` and `user-select: none`, so Chromium selected text instead of starting a drag.
4. In Vite development, React StrictMode replay canceled the 250 ms takeover timer during effect cleanup. The timer ref stayed non-null and the one-shot/request guards prevented the replay from scheduling a replacement.

Commit `1d93953` fixes only that lifecycle path:

- `writerFocusInitializedRef` is set only after a successful takeover, not during effect setup.
- `writerFocusRequestedRef` is reset when the focus effect cleans up.
- Cleanup nulls `writerTakeoverTimerRef` after canceling its timer.

No map hit-area, CSS-selection, or drag math workaround was added.

## What is committed

- `355779c` — Slices 1–4 interaction repair.
- `17de605` — force writer takeover / removed “Still waiting” banner.
- `65f2892` — quick-add account flow.
- `1d93953` — StrictMode writer recovery that restores dragging in the dev app.

The canonical repair plan is at:
`C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\plans\2026-08-03-session-43-interaction-repair.md`

## Verification completed

- Dev/StrictMode hard gate, unique port 4475: 1/1 foreign-lease drag regression passed; command wall 6.5 s, Playwright test duration 4.7 s.
- Preview compatibility gate, unique port 4473: 1/1 passed; command wall 13.7 s, Playwright test duration 11.7 s.
- Full unit suite: 28 files / 535 tests passed; command wall 4.137 s.
- Production build (`npm run build`): passed; command wall 5.677 s.
- `git diff --check`: passed before commit.
- Exact live reproduction after the fix: map class `map-interactive`, computed `user-select: none`, Short-Term Funds moved 80×40 px, browser selection remained empty.

A full writer-certification subset was also run and exposed unrelated/stale test expectations:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\app-resilience.spec.ts:77` could not find the expected disabled `Delete client` menu item.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\certification.spec.ts:64` and `:82` timed out in the helper’s `Title`-locator writer count.

Do not call those stale UI-suite failures a drag regression. They were not changed by `1d93953`; investigate separately if requested.

## Working-tree items to preserve

`git status` currently shows one unstaged test edit and this handoff file:

- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\interaction-regression.spec.ts` has an earlier, unstaged income-text drag regression (`dragging an income text run...`). It was deliberately not included in `1d93953`; inspect it before deciding whether to keep, split, or discard it.
- `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-03-session-43-handoff.md` is this handoff and is intentionally uncommitted.

Do not reset or delete either item without Cyril’s direction.

A full-worktree checkpoint made before this fix is:
`C:\tmp\money-map-generator-s40-checkpoint-20260803-145320-drag-fix-full.zip`
SHA-256: `50039FAE90165A96BF2D6D2F07E57A109491B36A7A02D8DB3B4D199941DBAC35`

Temporary verification servers on ports 4463, 4465, 4469, 4471–4475 were stopped/owned by Playwright cleanup. The user’s existing dev server at `http://127.0.0.1:4361` may still be running from this worktree.

## Mandatory next step: user dogfood pause

Do not start Slice 5 or any later slice yet. Cyril explicitly asked to pause after Slice 4, and this drag recovery is the follow-up needed to complete that dogfood gate.

Cyril should hard-reload `http://127.0.0.1:4361` and drag the visible “Short-Term Funds” shape. Expected result: the shape moves and no text is highlighted. Wait for Cyril’s pass/fail before any additional implementation.

## Routing / coordination

- Terra 5.6 max owns high-level reasoning, delegation, sequencing, strict gates, and babysitting.
- Luna 5.6 max (Cyril’s selected implementation model) handles concrete edits/tests.
- Ignore all references to Codex 5.3 Spark; they are obsolete.
- A separate Fable 5 read-only audit window may be running against another checkout. Do not mutate or reset that checkout; stay in `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`.
- Run ponytail audit for major decisions. This fix is intentionally small; no new abstraction or CSS masking was added.
- Never push, add a remote, or run destructive cleanup. Use unique browser ports and clean their process trees.

## Copy-paste prompt for the fresh session

```text
Resume the Money Map repair in C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40.

Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-03-session-43-handoff.md completely before acting. Do not touch C:\Users\Cyril\Projects\money-map-generator, where a separate read-only Fable audit may be running. Ignore every Codex 5.3 Spark reference.

Routing: Terra 5.6 max owns high-level reasoning, assignment, strict gates, and babysitting. Luna 5.6 max handles implementation. Never push or add a remote.

Current branch is repair/session-42 at commit 1d93953 (writer recovery for dev map dragging). Slices 1–4 and this follow-up are committed. Slice 5+ is paused pending Cyril’s dogfood pass.

First action: run `git status --short --branch` in the worktree. Preserve the unstaged income-text regression in C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\interaction-regression.spec.ts until Cyril decides what to do with it. Do not reset it.

Dogfood gate: hard-reload http://127.0.0.1:4361 and drag the visible Short-Term Funds shape. It must move without highlighting text. If Cyril reports pass, ask before starting Slice 5. If it fails, reproduce in dev mode with a unique port and use systematic debugging; do not add CSS/preventDefault masking without evidence.

For verification, the focused regression is:
$env:PLAYWRIGHT_SERVER_MODE='dev'; $env:PLAYWRIGHT_PORT='UNIQUE_PORT'; npx playwright test tests/e2e/interaction-regression.spec.ts -g 'foreign writer lease still hands editing' --project=chromium-1280x720 --workers=1 --reporter=line

Use the existing plan at C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\plans\2026-08-03-session-43-interaction-repair.md only after the dogfood pause is cleared.
```