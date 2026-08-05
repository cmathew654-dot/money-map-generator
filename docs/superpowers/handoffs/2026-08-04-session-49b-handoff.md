# Session 49b Handoff — Dogfood Round 2 Triage Mid-Flight (2026-08-04 evening)

## The goal (why any of this exists)

Money Map is Cyril's advisor tool: a one-page visual map of a client's money (income → accounts → monthly need) he can edit live and present. Current campaign: dogfood-driven repair to ship-quality, then a PUSH-UPDATE ceremony to the existing GitHub remote (main frozen at Aug-1). Two testers: Cyril + a novice dogfooder. Their findings outrank every green suite. Everything below serves: fix what the dogfood surfaces → verdicts done → push ceremony → lane cleanup.

## Where we are RIGHT NOW

- `repair/session-42` @ **bc6070d** (tooltips merge), 716/716, tsc clean. Demo LIVE at http://192.168.1.69:4280 serving exactly this build (server restarted fresh; hash verified MATCH).
- **vite preview CACHES the file list at startup (sirv)** — after every `npm run build:demo` you MUST kill + restart the 4280 server or it serves the old bundle. This bit us twice today. Restart: kill PID on 4280 (`Get-NetTCPConnection -LocalPort 4280`), then `cd C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40; pnpm exec vite preview --outDir demo-dist --host 0.0.0.0 --port 4280 --strictPort`, then verify `curl -s http://192.168.1.69:4280/ | grep -o 'index-[^\"]*\.js'` == same grep on demo-dist/index.html.
- Shipped earlier today (all live): Wave 1 (undo/present/esc/editor/inspector/labels), Wave 2 (dblclick→Data, +Flow, note spawn, zoom 25, comma inputs, Contents groups, PDF meta, income rename, inspector-lite), toolbar Option A, rail tooltips. Details in `2026-08-04-session-49-handoff.md` + the S49 OUTCOME section of `2026-08-04-session-48-handoff.md`.

## Four fix lanes from Cyril's round-2 report — state

| Lane | Branch @ worktree | Status |
|-|-|-|
| P1 present view restore + ctrl+wheel proof | lane/s49-present @ 0f7d426, mm-lane-s49-present | DONE, audited PASS, 722/722 in-lane, NOT merged |
| P2 rotate buttons 15°→5° (all rotatables) | lane/s49-rotstep @ 7fbfaa5, mm-lane-s49-rotstep | DONE, audited PASS, 721/721 in-lane, NOT merged (touched tests/rot-inspector.test.tsx numeric expectations — accepted) |
| P3 a11y lease live-region (verdict D) | lane/s49-a11y @ 52d435c, mm-lane-s49-a11y | DONE, audited PASS, 719/719 in-lane, NOT merged |
| P4 Data panel scrolls focused item into view | lane/s49-focus @ mm-lane-s49-focus | INVESTIGATED: scroll already works (inView across viewports since a54feb0). REAL defect: scrolled-to card lands under the sticky panel header at narrower widths. Fix SHIPPED @ a254b04, audited PASS (scroll-margin-top 132px + block:start, verified 4 viewports, 719/719 in-lane). Ready to merge with P1-P3. |

**Merge plan (session 50):** merge P1 → P3 → P2 → P4 into repair/session-42 (P1 and P3 both touch App.tsx in disjoint regions: present handlers/layout-effect vs header/leaseAnnouncement — conflicts, if any, resolve by keeping both). Then `pnpm exec tsc --noEmit` + full `pnpm exec vitest run` (expect ~716+6+5+3+P4), extend gate11.mjs (worktree root, untracked) with: present exit restores BOTH zoom and scroll (map not huddled in a corner), ctrl+wheel zooms during Present then drag-pan works, rotate ± steps 5°, live region present in DOM. Interactive gate on demo-gate/4281 (kill stale listeners first), THEN build:demo + RESTART 4280 server + hash-verify.

## OPEN INVESTIGATIONS from Cyril's corrections (do these before/with merges)

1. **#19 REAL BUG — account + shift-click account does nothing for him.** He explicitly clicked account then shift-clicked ANOTHER ACCOUNT. Code says that should toggle multi-select (MapSvg.tsx:2285-2296, isCompatibleMapItemKey = account:/note: only). Suspect: the editable-text hit rects cover most of the account body (MapSvg.tsx:355-371 editableHitAreaProps pointerdown preventDefaults on shift but may swallow/not route the selection toggle), so shift-click lands on a text hit rect and never reaches the multi-select path. Reproduce in a driver: shift-click account CENTER (text area) vs EDGE. If center fails, fix = route shift/ctrl clicks on text hit rects to the selection toggle. Then + Flow lights up.
2. **#1 REAL, UNRESOLVED — dblclick a plain account number, typing "does not occur"** (his words), on the default map. Gate + live-check pass this headless on accountValue, so something environment/flow-specific: reproduce with mouse-real dblclick at his 1440×900; check if the editor opens but paints off-screen/invisible at some zoom; check focus. Related: **F10 reproducibly "changes it to some weird shit"** during these edits. F10 in Chrome focuses the browser menu / Shift+F10 opens context menu — but CHECK the app: grep key handlers (F10 not found in earlier greps; verify) and test what F10 does mid-edit in a driver. Ask him for a screenshot if not reproducible.
3. **Summed numbers: he wants dblclick-retype to work there too** ("it fucking should"). Today: size-only pill BY DESIGN (aggregates: accountRows/accountSub/afterTaxIncome etc., applyMapTextEdit:~497 hard-returns). Making sums retypeable is a PRODUCT DESIGN question (which row absorbs the delta?) — do NOT bolt on. Options to bring him: (a) retype total → proportionally scale rows; (b) retype total → adjust a "remainder" row; (c) keep size-only but make the pill offer "Edit the rows" jump. Needs his call before any lane.
4. **Generated-arrow thickness** (green income / as-needed): he wants it "unless huge PITA". It is NOT huge: generated arrows already take appearance overrides via layoutOverrides (inspector shows Style/Color/Curve for them — same withOverride path). Add `sw` to that override path + inspector Thickness group for generated selections, reusing W2-D's clamp/constants. One small lane; do not touch chip freeze logic.
5. **#20 notes-on-whitespace** deferred (his "ignore if heavy"). **#22 PDF insecure-download** = http-LAN browser behavior, not fixable; tell testers to use Keep, gone on https deploy.

## Verdict sheet — FINAL STATE (recorded 2026-08-04 evening)

A: smaller steps SHIPPED (P2, buttons 5°; keyboard [ ]/drag-snap untouched at 15°/3° — flag raised with Cyril, response pending, default = leave keyboard as is). B: RESOLVED (s49 unclip; he confirms not clipped). C: **accept + document** (undo lost on tab handoff = known limitation; app never opens tabs itself). D: **SHIPPED** (P3 lane). E: **fast-forward**. F: **skip**. G: **leave**. H: **shipped**.
→ C documented + D merged + E decided = **push ceremony UNBLOCKED** once P-lanes merge and his re-verify passes. Ceremony mechanics: s46/s47 handoffs (pre-push hook removal is the deliberate step; guardrails vc denies push otherwise).

## Dogfood instrument (how feedback flows)

Stateful doc at **https://claude.ai/code/artifact/e2a6c37a-74b5-49ca-baa0-dbe778846f0b** (update from a new session: pass this URL as `url` to the Artifact tool; source file lives in THIS session's scratchpad — recreate from artifact via WebFetch if needed). 22 Do/Expect cards + A–H pickers; state in localStorage per device; **Copy report** emits the paste-back (with clipboard fallback box). Cards #5/#16/#19 were corrected after his round-2 confusion. His round-2 report is fully triaged above — she has NOT run round 2 yet; share via page share menu.
Toolbar options artifact (decided, A shipped): 644a41a1-1803-4973-8b33-b4f28bed64b6.

## Cross-project notes landed this session

- **Last Mile fonts: NO WORK NEEDED** — site already ships IBM Plex Sans (body) + IBM Plex Mono (labels) + Archivo (display); the pasted "swap Inter" feedback was stale. Only optional nit: fonts via Google CDN → self-host (1 file, index.html; canvas silkscreen fallback at js/scene/labels.js:14). Repo branch gsd/phase-03-post-hero-seam.

## Doctrine (binding, unchanged)

Fable = judgment only: contracts, diff audits vs checkpoint, interactive gates, merges. **ROUTING CHANGE (Cyril, 2026-08-04 evening): implementation lanes = parallel codex TERRA HIGH via codex-task.ps1 (fast lanes), NOT Opus.** Constraints that survive the change: (a) concurrent codex crashed before (CreateProcessWithLogonW) — probe 2 trivial concurrent terra dispatches first; if it still crashes, run terra SERIAL and fall back to Opus lanes only if terra can't hold a contract; (b) MapSvg.tsx/layout.ts codex bench STAYS (apply_patch UTF-8 corruption ×2) — those files get Opus lanes regardless. Lane mechanics unchanged: own worktree from current head + `cmd /c mklink /J node_modules` junction, frozen contract, RED-first, own NEW test file, conventional commits, NO push. Codex BENCHED for MapSvg.tsx/layout.ts. Explore/Haiku digs (verify dig claims — one mispriced income-rename interactivity). Interrupted lane → SendMessage resume, don't redispatch. Never trust "it broke" reports before verifying server up + served hash == disk hash — but ALSO never assume stale cache when the report mixes new-feature passes with failures (burned once; Cyril was right). Token discipline: lane reports <1500 chars; never read agent .output transcripts.

## Cleanup backlog (after her clean pass)

11 worktrees `mm-lane-s49-{app1,editor,inspector,labels,app2,form,misc,insplite,incname,toolbar,tooltips}` + P-lane worktrees {present,rotstep,a11y,focus} + merged lane/s49-* branches; older mm-lane-* from s44/s48.

## Session-50 prompt (copy-paste)

> Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-session-49b-handoff.md FULLY before anything else — it is the canonical state (goal chain, lane table, investigations, verdicts, doctrine). State snapshot: repair/session-42 @ bc6070d + handoff commits, 716/716 at root, tsc clean; FOUR fix lanes done + audited + UNMERGED on their branches (P1 lane/s49-present @ 0f7d426, P2 lane/s49-rotstep @ 7fbfaa5, P3 lane/s49-a11y @ 52d435c, P4 lane/s49-focus @ a254b04); demo live on http://192.168.1.69:4280.
>
> ROUTING (Cyril's standing order, changed 2026-08-04 evening): implementation lanes = parallel CODEX TERRA HIGH via codex-task.ps1 (C:\Users\Cyril\.local\bin), NOT Opus. Before first parallel use, probe 2 trivial concurrent terra dispatches (concurrent codex crashed with CreateProcessWithLogonW before); if still crashing, run terra serial. MapSvg.tsx/layout.ts stay codex-BENCHED (UTF-8 apply_patch corruption ×2) — anything touching those two files goes to an Opus lane instead. Same lane rules regardless of engine: own worktree from current head + `cmd /c mklink /J node_modules` junction to the s40 worktree, frozen contract prompt (scope, RED-first, own NEW test file, full tsc+vitest green, conventional commits, NO push, report <1500 chars outcomes-only), and Fable audits every diff vs the checkpoint + reruns verification personally — never trust self-reports.
>
> FABLE CONTEXT DISCIPLINE (strict — the window is the scarce resource): judgment, audits, gates, merges ONLY in main context. Every dig → Explore/Haiku subagent. Never read agent .output transcripts. One notification read per lane. Grep before Read; offset/limit over full files; never re-read. At ~60% context: write the next handoff + prompt unprompted.
>
> EXECUTE IN ORDER:
> 1. Demo server: kill any PID on 4280 (Get-NetTCPConnection -LocalPort 4280), start `pnpm exec vite preview --outDir demo-dist --host 0.0.0.0 --port 4280 --strictPort` in background from the s40 worktree, curl 200, verify served index-*.js hash equals demo-dist/index.html's. vite preview SNAPSHOTS files at startup — every future build:demo needs a server restart + hash check.
> 2. Merge P1 → P3 → P2 → P4 into repair/session-42 (P1+P3 both touch App.tsx in disjoint regions — keep both sides on conflict). Then `pnpm exec tsc --noEmit` + full `pnpm exec vitest run` at root (expect ~733: 716+6+3+5+3).
> 3. Gate: extend gate11.mjs (s40 worktree root, untracked; TIMEOUT-BUDGET 4000ms; driver traps in 2026-08-04-session-49-handoff.md §Gate driver) with four checks — present exit restores zoom AND scroll (map not huddled in a corner), ctrl+wheel zooms during Present then drag-pan works, rotate ± buttons step 5°, lease live-region div in DOM. Build demo-gate (--mode demo), serve 4281 --strictPort (kill stale 0.0.0.0 squatters from dead sessions FIRST), run full gate, eyeball screenshots, kill 4281.
> 4. Deploy: npm run build:demo → RESTART 4280 server → hash-verify → tell Cyril which checks to retest (#9, #10, rotate steps, #14).
> 5. Investigations (driver repro FIRST, fix contract only after): (a) #19 — Cyril clicked an account then shift-clicked a SECOND ACCOUNT and nothing happened; reproduce clicking account CENTER (text hit rects, suspected swallow at MapSvg.tsx:355-371) vs EDGE; likely fix = route shift/ctrl clicks on text hit rects into the multi-select toggle (MapSvg.tsx:2285-2296) — MapSvg = Opus lane per bench. (b) #1 — dblclick a plain account number, typing "does not occur" for him, and F10 reproducibly does "weird shit" mid-edit; repro at 1440×900 real-mouse, check editor visibility/focus at various zooms, test F10 mid-edit; if no repro, get his screenshot before touching code.
> 6. Dispatch generated-arrow thickness (terra lane): `sw` override for generated income/as-needed arrows via the SAME layoutOverrides/withOverride path their Style/Color/Curve use, reuse W2-D clamp constants, Thickness group for generated selections in MapInspector; chip freeze logic untouchable; if the diff must touch MapSvg.tsx render consumption → Opus lane instead.
> 7. Bring Cyril two decisions: summed-number retype (3 options, §investigation 3 — his pick gates any lane) and keyboard [ ]/drag rotate still 15°/3° vs buttons 5° (default: leave).
> 8. After his + the dogfooder's clean re-pass: push-update ceremony per s46/s47 handoffs (C documented, D shipped, E = fast-forward; deliberate pre-push-hook removal), then delete ~15 mm-lane-* worktrees + prune merged lane/* branches.
>
> Feedback channel: the stateful dogfood artifact (e2a6c37a-74b5-49ca-baa0-dbe778846f0b) — Cyril pastes "MONEY MAP DOGFOOD REPORT" text; those findings outrank every green suite. Interactive gates are mandatory before every deploy — static green missed user-visible bugs four times across s47–s49.
