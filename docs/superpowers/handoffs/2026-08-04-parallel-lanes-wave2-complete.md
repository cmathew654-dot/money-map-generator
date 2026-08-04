# Handoff — Map-polish waves 1+2 COMPLETE (2026-08-04, session 47)

Supersedes `2026-08-03-parallel-lanes-wave1-handoff.md`. The session-46 sequence (dogfood → four verdicts → push-update ceremony → s44 lane cleanup) still stands and takes precedence.

## State

`repair/session-42` @ `9862fb7`. **All five plan items shipped and green**: vitest 569/569, tsc clean, playwright interaction suite 20/20 headless. `.lanes\*` worktrees pruned; `lane/*` branches retain full history. Stale s44 `mm-lane-*` worktrees still listed (session-46 cleanup item).

## What shipped (plan: `C:\Users\Cyril\.claude\plans\let-s-just-plan-for-fluttering-avalanche.md`)

- **pointer** `6af667e` — chip pointerdown forwarded to drag ownership; `editableHitAreaProps` 3rd arg now required (contract's "~30 call sites" was actually 14, all already passing one).
- **anchor** `142b4ec`+`7d8dee0` — chip anchor sampled against other arrows AND income/need/account boxes; legacy fallback kept. Judgment: pre-existing clearance tests = real spec. Far-first distance order `[150,110,70]` is LOAD-BEARING (anchor stability when non-endpoints move — do not "fix" to near-first; verified red both ways). Wave-1 worker had mojibake-corrupted `—`/`…` in layout.ts; repaired.
- **notes** `0170201`+`e892b81` — note color box (reuses `LayoutOverride.color` + `CUSTOM_ARROW_COLORS`) + inspector swatches. First codex round confabulated the swatch UI ("Deviations: None" with setNoteColor never called) — caught in audit, fixed in round 2.
- **rot-render** `64d611b`, **rot-inspector** `57e8ad2`, **rot-handle** `d0e8755` — rotation via `LayoutOverride.rot` on keys `asNeededChip` / `note:<id>` / `text:footnotes:line:<id>` (contract said `text:footnotes:<id>` — WRONG, real key has `line:`; all lanes prefix-match). Render transform + inspector ± control (shared `RotateControls`) + selection-chrome drag handle riding the EXISTING `'rotate'` drag mode.
- **e2e spec fixes** `e0d7be1` (Fable) — pointer lane's never-run specs had two bugs: page renders two MapSvg instances (`.first()` needed) and amount editor opens on dblclick.

## Known behavior notes (dogfood items)

- Rotate handle inherits `snapRotation(a,15,3)` — a 3° magnet at 15° steps, same as accounts. Plan said "free rotate"; accepted for UX consistency + shared-plumbing scope. If Cyril wants pure-free: one line in `previewDrag`.
- Reset note zeroes rotation but keeps its color override (deliberate: deleting the key would wipe color).
- Anchor collision fix means the chip can sit up to 150px from its arrow on dense maps.

## Orchestration learnings (session 47)

- codex luna FAILED the rotation lane twice (40-min timeout mid-edit leaving syntax errors; then `apply_patch` UTF-8 thrash ×3, watchdog early-kill). The apply_patch UTF-8 flake is plausibly the same encoding weakness that mojibake'd wave 1. **Claude-side lanes are the safer default for MapSvg.tsx/layout.ts** (non-ASCII-heavy files).
- Cyril's standing order (2026-08-04): implementation subagents = **Opus** (Agent tool has no per-call effort knob; model override only). Parallel worktree lanes, own CONTRACT.md each, own NEW test file each (kills test-merge conflicts). 3 Opus lanes ≈ 4-6 min each vs codex 40+ serial.
- vitest at s40 root sweeps `.lanes\*` test copies — prune lanes before root runs.
- guardrails vc hook false-flags `git stash push`; salvaged node_modules symlinks break cross-lane (pnpm relinks point at the dead path — fresh `pnpm install --offline` fixes).

## Remaining

1. Cyril dogfoods the merged map polish (chip drag, anchor position, note colors, rotation) — his four session-46 verdicts still pending and gate the push-update ceremony.
2. **curved** lane (plan item 7, textPath follow-line): SHELVED per plan's droppable clause — only if dogfood says labels still read poorly.
3. s44 `mm-lane-*` worktree cleanup (session-46 item).

## Session-48 continuation prompt (copy-paste)

Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-parallel-lanes-wave2-complete.md. Waves 1+2 of map polish are merged and green on repair/session-42 @ 9862fb7 (vitest 569/569, playwright 20/20). Next: support Cyril's dogfood of the five shipped features, apply his verdicts (incl. the 3°-snap-vs-free-rotate call and chip-anchor distance), decide the shelved curved lane, then the session-46 sequence: four verdicts → push-update ceremony → s44 lane cleanup. Orchestration: Fable judgment-only; parallel Opus worktree lanes with per-lane contracts for implementation (codex benched for MapSvg/layout.ts — apply_patch UTF-8 flake); audit diffs, never worker self-reports.
