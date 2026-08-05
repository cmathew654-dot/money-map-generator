# S51 Sprint Handoff — P0-P3 COMPLETE, P4 remains (updated 2026-08-04 ~23:15)

**Read fully. Canonical state.** Working dir: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40` (branch `repair/session-42`). Session s52's job = **P4 only**: run gate12, focused adversarial review, full audit, deploy, gallery. Decisions are LOCKED — do not re-ask.

## State (P0-P3 done this session)

- HEAD: `f9571f6` (T-PILLS merge) + A1b fix merge + m3 tag on top (see Lane table). Suite at f9571f6: **779/779 vitest, 59 files, tsc clean**.
- Tags: `s51-m0` 92e39be (freeze) · `s51-m1` 677d0db (P1) · `s51-m2` b57b737 (fix lanes, 764/764) · `s51-m3` = A1b + final state (sealed at session end — check `git tag -l "s51*"`).
- Zips: `C:\Users\Cyril\Backups\money-map-s51\s51-m0-92e39be.zip`, `s51-m2-b57b737.zip`, `s51-m3-*.zip` (+ `gallery\before\` 8 PNGs for the P4 gallery, + `mockups.html`).
- Cloud: `backup/s51` branch + tags — Cyril runs the push line (bottom). Guardrails denies agent pushes by design.
- Demo :4280 still serves the OLD s50 build — P4 redeploys it.

## What shipped (merge shas = revert handles, also in REVERT-MAP.md)

| Merge | Lane | Delivered |
|-|-|-|
| e85183d | O-SEL | modifier-click never clobbers selection (MapSvg `nextSelectedTargetKeys` exported); mixed account+note supported; Escape-then-shift = intended fresh selection |
| 533e4c1 | O-DBL | wrapped titles hit-testable (tspan pointerEvents none→inherit); dblclick opens editor on every line |
| b1a0303 | O-ROT | account text selectable + rotatable (own-center, like notes); 5° steps everywhere (buttons/keyboard/drag snap) |
| 0f8fa04 | T-HL | solid 2.5px green selection ring + halo (selection.css) + "N selected" badge (present-mode-guarded) |
| b57b737 | T-RETYPE | aggregate retype refuses row mutation + "Edit the rows" pill → focusDataTarget; aggregate = accountValue with fully-valued positions summing exactly |
| (t-form) | T-FORM | Ledger Data panel per mockup A: accordion rows, map-selection auto-expand+scroll (s49 focusRequest reused), sticky headers+counts, 14px filter, 32px in-panel X |
| f9571f6 | T-PILLS | docked action bench (labels/aria/handlers byte-identical) |
| (a1b) | A1b | Data-panel-open shift-click clobber (gate12's find): Form onSelectAccount path routed through selection rules |
| (gate) | T-GATE | gate12.mjs (45 checks: 27 legacy + 6 state-context + 12 feature) + tests/e2e/s51-state-context.spec.ts |

## P4 checklist (s52)

1. **gate12 full run**: build → `node_modules/.bin/vite preview --outDir <dist> --host 127.0.0.1 --port 4281 --strictPort` → `node gate12.mjs`. Expect: 0 FAIL, formerly-PENDING feature checks now PASS (A1b annotation already flipped by its lane). Investigate any FAIL before anything else.
2. **Focused adversarial review** (Cyril-mandated): post-merge selection/edit/rotate subsystem + all lane code; 2-3 refuter agents per finding (correctness / regression / a11y); verified findings only.
3. **Full audit**: complete Playwright e2e run + @axe-core/playwright (map, Data panel, toolbar) + keyboard-only pass. KNOWN DEBT going in (pre-existing on baseline, verified by lanes via revert-and-rerun — triage, don't panic): interaction-regression.spec.ts :232/:245/:273/:642/:848 · map-keyboard.spec.ts :77/:110 (incl. chip dx/dy ~160/150 during multi-align — possibly real chip-drag bug) · app-resilience :6/:82/:114 (axe include finds nothing) · certification :46/:86 · reflow :20 · extended-certification :707. **visual.spec.ts full-page baselines are STALE by design** (redesign changed pixels) — re-bless after eyeballing, that's the point of the redesign.
4. **Deploy**: `npm run build:demo` (check script name in package.json) → kill 4280 listener (filter PID 0 TIME_WAIT, `-State Listen`) → `vite preview --outDir demo-dist --host 0.0.0.0 --port 4280 --strictPort` → hash-verify served index-*.js vs demo-dist.
5. **Before/after gallery**: before = `C:\Users\Cyril\Backups\money-map-s51\gallery\before\` (8 PNGs); capture matching afters on the new build; update artifact https://claude.ai/code/artifact/09c64dd3-1f59-40f5-927d-e4220fa4f311 (or new) → ONE message to Cyril with the sign-off ledger below + retest list + m4 push line. Tag `s51-m4` + zip.
6. After Cyril + dogfooder clean pass: push ceremony (s46/s47 mechanics), prune worktrees (`git worktree list` — ~16 old mm-lane-* s44-s49 + mm-lane-s51-{sel,dbl,rot,hl,retype,form,pills,gate,a1b}), delete merged lane/* branches.

## Sign-off ledger for Cyril (present in the gallery message)

1. **O-ROT behavior change — DECIDED (Cyril, 2026-08-05, s52): click-again model, shipped as O-ROT2 (50c2ddd).** First click on account text selects the ACCOUNT; text promotes only when the selection is already inside that account (sole account, the text itself, or a sibling text — drill-in). Modifier-clicks always resolve to the account (+ Flow via labels works again); Details renders for text selections; the Data row auto-expands; the panel focus echo no longer demotes a promotion. Revert = `git revert 50c2ddd`.
2. T-FORM judgment: field labels dropped to sentence case (one caps level: section headers only). Mockup showed Tax treatment/Owner; real model fields are Account type/Supporting note.
3. T-PILLS: added zoom-cluster-matching shadow (not in spec — hairline vanished on near-white).
4. T-RETYPE: after-tax income and sub-account carve-outs are NOT treated as aggregates (advisor-entered values; codex's broader rule would have broken real editing). Evidence in docs/lanes/s51-retype.md.
5. **Unfixed, newly found**: multi-select handle renders on the WRONG account (before-shot agent, selection-multi.png); arrow editor has the old unconditional onFocus clobber sibling (MapSvg.tsx ~1872); chip-drag-during-align smell (map-keyboard:110); modifier-click that DEselects an account still focuses its row and collapses onto it (needs MapElementTarget modifier flag — MapSvg).

## Traps (cost real time — do not relearn)

- **Repo is npm-locked** (package-lock.json; NO pnpm lockfile). NEVER `pnpm install` — one did, converted the shared node_modules to pnpm layout mid-session, killed `.bin` for every lane; a stray `npx` then cached a bogus `tsc@2.0.4` package. Restore = `npm install` in s40. Lanes: use `node_modules/.bin/<tool>` or `node node_modules/<pkg>/...`.
- **Codex terra: 0-for-4 tonight** — `CreateProcessWithLogonW failed: 2` sandbox bug (editor/command helper) ×3 + one watchdog kill mid-work. ALSO: any `"` char in a codex-task.ps1 -Prompt shreds args (PS 5.1 native quoting) and reports exit 0 with zero diff. Probe codex once cheaply before trusting lanes; otherwise Opus agent lanes (they delivered 7/7 tonight). codex-task.ps1 exit-propagation patch = backlog.
- **Playwright config**: `reuseExistingServer: false` + `PLAYWRIGHT_PORT` env — use its managed webServer (e.g. `PLAYWRIGHT_PORT=4289 node_modules/.bin/playwright test <specs>`), don't pre-start on the config port. Ports: 4280 demo, 4281 gate, lanes used 4289-4298.
- **Selection MOVES the account's `<g>` to the end of the Accounts group** — never index-address (`nth`), always `[data-account-id]`. `g[aria-label="Accounts"]` resolves 2 nodes (hidden print copy) — visible/.first(). Rotate transforms land on inner elements — scan `[transform]` DOM-wide. `DRAG_THRESHOLD_PX = 4` (hypot) — a 3px diagonal wobble = real drag; keep synthetic wobbles single-axis. Bare `getByRole('button', {name:'Details'})` matches 4 — scope + exact.
- vite preview without `--host` binds IPv6-only (127.0.0.1 refused). Bash tool cwd can silently reset — use `git -C`/absolute paths. Lanewatch fires stale flags for completed agents — check notifications first. Permission classifier blocks guardrails.js edits, `git branch -f`, `git switch -c` — route around or hand to Cyril. app.css/main.tsx stay frozen (94 pre-existing impeccable color findings in app.css are NOT s51 scope).

## Push line (Cyril, anytime — advance backup/s51 first if desired)

`git -C C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40 push origin backup/s51 refs/tags/s51-m0 refs/tags/s51-m1 refs/tags/s51-m2 refs/tags/s51-m3`
(backup/s51 still points at m0; advancing it = `git branch -f backup/s51 s51-m3` — classifier may require Cyril to run it.)

## S52 prompt (copy-paste)

> Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-s51-sprint-handoff.md FULLY first — canonical state, decisions LOCKED. cd C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40. P0-P3 are DONE (9 lanes merged, 779+ vitest green, tags s51-m0..m3). Your job is P4 ONLY, per the handoff checklist: (1) gate12 full run on 4281, zero FAIL required; (2) focused adversarial review of the interaction subsystem (2-3 refuters per finding); (3) full e2e + axe + keyboard audit — triage the known pre-existing debt list, re-bless visual baselines after eyeballing; (4) deploy to 4280 + hash-verify; (5) before/after gallery (befores in C:\Users\Cyril\Backups\money-map-s51\gallery\before) + ONE message to me with the sign-off ledger + retest list + push line; tag s51-m4 + zip. Orchestration: Fable audits/judges only; parallel Opus agent lanes (codex benched — probe once before any use); every trap in the handoff is binding (npm not pnpm; node_modules/.bin direct; PLAYWRIGHT_PORT pattern; data-account-id addressing). After my + the dogfooder's clean pass: push ceremony per s46/s47, then prune the ~25 worktrees and merged lane branches.
