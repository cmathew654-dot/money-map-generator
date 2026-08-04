# Session 44 Handoff — Money Map sprint: all 12 slices merged; spec-modernization + final gate remain (2026-08-03)

Written by Fable 5 (xhigh) at stop point. Worktree `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`, branch `repair/session-42` at `3f232af`. NEVER push, never add a remote — now ENFORCED deterministically (see VC policy). One window owns the tree.

## What landed today (all merged, each lane-gated: vitest + tsc; e2e at integration)
- `06f733f` slice 5.5 — text-drag suppresses native selection (user-select on `.map-page` + preventDefault in MapSvg else-branch). Gate-verified incl. new e2e test.
- `475113c` lease slice (subsumes slice 9) — missing `visible`-branch takeover added (App.tsx visibilitychange), `.map-readonly-banner` click-to-take-over pill, StrictMode-safe deferred release (setTimeout(0) + cancel-on-remount; pagehide still releases synchronously), new `tests/e2e/lease-robustness.spec.ts`.
- `e01ab81` slice 6 — appendBlankAccount collision-avoids via exported `placementsOverlap` + reused `duplicatePlacement` nudge (mapInteraction.ts). book.ts now imports from render layer — watch for cycle issues (none seen).
- `8ea178a` slice 10 — inspector truncation: flex-wrap + flex-shrink:0 + select width:auto (CSS-only).
- `e556ea9` slice 7 — tidyArrangement resolves overlaps (nudge loop vs placementsOverlap). PONYTAIL CEILING: uses TIDY_DEFAULT_W/H 180x120 when callers don't pass dims; wire real mapLayout dims if dogfood shows big shapes still colliding.
- `daa1b9a` slices 11+12 — `.map-chrome` position:fixed at ≤700px; pan-zoom hint omits pan wording at fit zoom. New `tests/e2e/chrome-layout.spec.ts`.
- `2e1436e` slice 8 — toast-region bottom 18→64px (140px at ≤700px), addToast queue cap `.slice(-2)`. NOTE: occlusion was visual-only (pointer-events:none pre-existed).
- `c5474a7` lease spec fix — no Vite-only import (WRITER_HEARTBEAT_MS mirrored as const 2000), alternating drag directions (first version buried the target under another card → false FROZEN).
- `3f232af` chore — repo-hook verification commit.

Untracked (deliberate): 5 auto-generated visual snapshots `tests/e2e/visual.spec.ts-snapshots/editor-inspector-*.png` — commit them with the visual-baseline regen in spec-modernization.

## Root causes proven today (instrumented Playwright repros, scripts in old session scratchpad — gone; method reproducible)
1. Two-tab brick: second tab steals writer lease on load → first tab silently read-only forever (`onChange` undefined at App.tsx ~1964 → edit hotspots unmount → `map-interactive`+user-select gone). Pre-existed at 65f2892 — NOT terra's 1d93953 (exonerated; no revert). FIXED by lease slice.
2. Ghost-lease recovery on fresh load: WORKS (2.5s) — Cyril's "same issue after refresh" was actually the then-unfixed text-highlight bug (screenshot-confirmed).
3. Codex sandbox CreateProcessWithLogonW failed:2 = TWO CODEX INSTANCES CONCURRENTLY. Rule: one codex at a time. Solo probe clean.

## Legacy e2e failure inventory (full-suite run on Wave-1 merge: 870 passed / 16 failed, 1.2h)
Classified (Explore verdicts, full detail in old session — key facts):
- OLD-DESIGN, rewrite to new lease design: `app-guidance-s40.spec.ts:77` (retry-without-steal → assert banner + instant steal), `certification.spec.ts:64` ("without guard UI" → assert `.map-readonly-banner` presence), `multitab-history.spec.ts:65` (waits-for-TTL → assert instant takeover).
- Visual baselines to regenerate: `visual.spec.ts:44` (editor), `:62` (editor with map inspector) — intended CSS changes.
- REAL BUG FOUND: `certification.spec.ts:46` wizard heading — `App.tsx:1827` hardcodes `hasWarnings={false}` so "Review the map before sharing." can never render. Follow-up, not sprint scope, unless baseline shows it recent.
- Also failing, pending baseline split (pre-existing vs today): app-resilience:6/:77/:109, certification:31/:82, extended-certification:544/:707, multitab-history:79, adversarial-remediation:66, reflow:20. Suspect today's CSS for reflow/adversarial; suspect pre-existing for money-input tests (:31, multitab:79 — locator not found at all).
- ALSO: guidance spec lines ~16-19 assert the old always-shown pan hint string — must split into fit-zoom (no pan wording) / zoomed (pan wording) per slice 12.
- **BASELINE SPLIT COMPLETE (ran at 06f733f, chromium-1280x720): ALL 16 failures are PRE-EXISTING — today's waves introduced ZERO regressions.** All 25 sibling tests that passed at 06f733f still pass at the Wave tip. Even visual.spec 44/62 were already ~3%-diff stale BEFORE today (drift from slices 1-5 era). Consequence: the 11 NEUTRAL pre-existing failures (money-input locator rot, wizard hardcode, a11y/reflow, rapid-handoff races, 200-client stress, WCAG) are INHERITED DEBT, not sprint scope — log, don't fix, unless Cyril says otherwise.

## Remaining sequence
1. DONE — baseline split above. No today-regressions exist; sprint-scope spec work = 3 OLD-DESIGN rewrites + guidance-hint split + visual baseline regen only.
2. Spec-modernization lane (sonnet agent in worktree, or luna via codex-task.ps1 — ONE codex at a time): rewrite 3 OLD-DESIGN tests to new lease design, split guidance hint assertion, `npx playwright test tests/e2e/visual.spec.ts --update-snapshots` (chromium-1280x720 + commit the 5 untracked editor-inspector PNGs), plus any today-regressions from step 1.
3. Final full-suite gate on the tip (Fable runs): `npx playwright test tests/e2e/` (~1.2h, 18 projects) + `npx vitest run` (537 baseline) + `npx tsc --noEmit`. Target: 0 unexplained failures.
4. Cyril dogfood (4 routes, dev server must be RESTARTED first — the running vite on 4361 hot-reloads but Cyril must hard-refresh his tab): (1) drag object body ×3 — moves, stays, re-drags; (2) press-drag from text — moves, zero highlight; (3) dblclick text — editor opens, inner selection works; (4) open second tab, drag there, return to first tab — banner appears then auto-recovers editing on return (or click banner).
5. UPLOAD (Cyril's stated end goal): the ceremony = Cyril says go → remove `C:\Users\Cyril\Projects\money-map-generator\.git\hooks\pre-push` → add remote → push. Confirm target repo with Cyril first (no remote exists by policy).
6. Cleanup after gate: remove lane worktrees (`git worktree remove ..\mm-lane-lease` etc. — junctions inside, remove worktree via git, don't recursive-delete), prune lane branches.

## VC policy stack (NEW — deployed + verified this session)
- Repo hooks in `C:\Users\Cyril\Projects\money-map-generator\.git\hooks\` (bind ALL actors incl. other AI windows, shared by every worktree): `pre-push` always-blocks (verified), `commit-msg` conventional-format (verified block+pass from worktree), `pre-commit` blocks main/master.
- `~/.claude/settings.json`: permissions.deny (git push / remote add / remote set-url, Bash+PowerShell) + permissions.ask (reset --hard / rebase / commit --amend / filter-branch) + new PreToolUse `Bash|PowerShell` → `guardrails.js vc`.
- `guardrails.js vc` check: deny/ask via permissionDecision, 6/6 test matrix passed. CAVEAT: regex is deliberately paranoid — commands merely CONTAINING push-like strings (e.g. the literal path `.git/hooks/pre-push`) get denied; work around by rephrasing the command, never by removing the guard.
- `codex-task.ps1`: post-run assertions — any remote present or HEAD moved from checkpoint → exit 98. Parse-checked, not yet exercised by a real dispatch. KNOWN BUG (backlog): script reported exit 0 on an early codex CLI arg failure (job exit propagation) — watchdog trust issue, fix later. Also: prompts must contain NO double quotes (PS 5.1 native-arg mangling — burned one dispatch).

## Known debt (log, don't do unless asked)
wizard hasWarnings hardcode (App.tsx:1827); session40-app.test.ts regex asserts effect source-shape (brittle); tidy default-dims ceiling; vc regex false positives; codex-task exit-propagation bug; impeccable hook reports ~76 pre-existing color-drift findings in app.css (noise, unrelated).

## Copy-paste prompt for fresh session

```text
Resume Money Map sprint close-out. Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-03-session-44-handoff.md completely first — it has the full state. Branch repair/session-42 at 3f232af, all 12 slices merged, 5 untracked visual snapshots pending baseline regen. VC policy now HARD-ENFORCED (repo hooks + settings deny + guardrails vc) — pushes/remotes are blocked by design; the upload ceremony at the end goes through me explicitly.

Sequence: (1) recover or rerun the 06f733f baseline split per handoff §Legacy; (2) dispatch spec-modernization lane (3 old-design lease tests → new design, guidance-hint assertion split, visual baseline regen + commit untracked PNGs, any today-regressions from the split); (3) final full-suite gate yourself (playwright tests/e2e ~1.2h + vitest 537 + tsc); (4) restart dev server, then I dogfood the 4 routes in the handoff; (5) upload ceremony with me; (6) worktree cleanup.

Standing rules: routing pyramid (Fable judgment-only; sonnet worktree lanes or luna via codex-task.ps1 for implementation — ONE codex at a time, no double quotes in -Prompt), hangup ratio, probe-first, delegate-digs, guardrails armed banner incl. vc. Never trust worker self-reports over diffs; rerun verification yourself before committing.
```
