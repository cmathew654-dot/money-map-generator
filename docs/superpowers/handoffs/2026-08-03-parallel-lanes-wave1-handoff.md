# Handoff — Map-polish parallel lanes, Wave 1 complete (2026-08-03, session 46b)

Runs alongside (does not supersede) `2026-08-03-session-46-handoff.md` — the dogfood → four verdicts → push-update ceremony → lane cleanup sequence still stands. This thread is the map-polish work Cyril green-lit during dogfood.

## What this is

Five map fixes/features (approved plan: `C:\Users\Cyril\.claude\plans\let-s-just-plan-for-fluttering-avalanche.md` — full root-cause receipts and lane contracts live there), executed as parallel lanes via ONE codex exec (luna high) orchestrating three internal subagents (`spawn_agent`/`wait_agent` collab tools; 3-concurrent cap, waves can exceed it in one run). Per-lane git worktrees under `.lanes\` INSIDE the s40 worktree (codex subagents cannot take per-agent cwds — shared sandbox; `.lanes/` is in `.git/info/exclude`).

## State at handoff

Checkpoint `271b4b5` on `repair/session-42`. Wave 1 ran to completion; **no lane is audited, committed, or merged**. Fable-verified vitest ground truth (do NOT trust the lane reports alone):

| Lane | Worktree | Branch | Ground truth |
|-|-|-|-|
| pointer | `.lanes\pointer` | `lane/pointer` | 542/542 GREEN. Chip drag fix + `editableHitAreaProps` hardening + e2e spec written (not run). Deviations claimed: RED-first blocked, callback typing caveat — see its `LANE-REPORT.md` |
| anchor | `.lanes\anchor` | `lane/anchor` | **RED: 6 failures.** Its own `keeps a collision-free as-needed anchor near its own curve` fails, AND it broke 5 PRE-EXISTING clearance tests (`keeps the default Whitfield/Venkat as-needed chip clear`, tall-income variant, extreme-text, masthead in mapedit) — the repo already had chip-clearance expectations; the naive sampling violates them |
| notes | `.lanes\notes` | `lane/notes` | 543/543 GREEN. Note color boxes + inspector swatches + `book.ts` `CUSTOM_ARROW_COLORS`-style validation entry |

Each lane has `CONTRACT.md` (frozen scope) + `LANE-REPORT.md` (worker-written) in its root, both untracked.

## Infra changes this session (outside the repo)

- `C:\Users\Cyril\.local\bin\codex-task.ps1`: remote check now snapshots remotes at start and flags only ADDITIONS (pre-existing `origin` no longer false-flags exit 98).
- Known trap: guardrails `vc` hook blocks dispatch prompts containing the literal words for publishing git commands — phrase contracts as "git is strictly read-only" instead.

## Remaining sequence

1. **Audit gate per lane** (Fable): full `git diff 271b4b5` in each lane vs its CONTRACT.md; flag out-of-scope files; pointer lane: verify the ~30 call-site sentinel sweep is behavior-neutral and check its "callback typing caveat" + RED-first deviation claims against the actual transcript/diff.
2. **Fix anchor lane**: single follow-up codex dispatch (luna high, `-Dir .lanes\anchor`) — make the sampling respect the existing clearance tests (they encode the real spec; the lane's contract fixtures were written blind to them). Or judge whether the existing tests themselves encode the old buggy anchor and need updating — Fable judgment call, look at what Whitfield/Venkat expect first.
3. **Commit each lane on its branch, merge** into `repair/session-42`: order `anchor` → `pointer` → `notes`; Fable resolves conflicts; full vitest + playwright interaction suite on merged tree; run pointer's new e2e spec headless.
4. **Wave 2** cut fresh from merged HEAD, same orchestrator pattern: `rotation` lane (+ optional `curved` textPath lane — droppable; see plan). Contracts not yet written — derive from plan sections 4 and 7.
5. Prune `.lanes\*` worktrees when done (git worktree remove; also the stale s44 `mm-lane-*` worktrees are still listed — that's the session-46 "lane cleanup" item).
6. Cyril's map feedback from dogfood may re-prioritize — his four session-46 verdicts are still pending and take precedence.

## Session-47 continuation prompt (copy-paste)

Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-03-parallel-lanes-wave1-handoff.md and the plan it references, then continue: audit the three .lanes worktree diffs vs 271b4b5 against their CONTRACT.md files (pointer and notes are vitest-green, anchor has 6 failures including 5 pre-existing chip-clearance tests it broke — judge whether the old tests or the new sampling is right), dispatch one codex fix round for anchor if needed, commit lanes on their branches, merge anchor→pointer→notes into repair/session-42, run full vitest + playwright on the merged tree, then cut Wave 2 (rotation lane, optional curved lane) from merged HEAD per the plan. Orchestration: Fable judgment-only, codex via codex-task.ps1 (one process at a time; parallel = subagents INSIDE one codex exec), never trust worker self-reports over diffs.
