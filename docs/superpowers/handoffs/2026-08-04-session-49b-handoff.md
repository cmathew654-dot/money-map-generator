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
| P4 Data panel scrolls focused item into view | lane/s49-focus @ mm-lane-s49-focus | INVESTIGATED: scroll already works (inView across viewports since a54feb0). REAL defect: scrolled-to card lands under the sticky panel header at narrower widths. Fix APPROVED + redispatched: scroll-margin-top in app.css on all four section targets. Check `git log bc6070d..HEAD` in that worktree for the commit; audit + include in merge if present. |

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

Fable = judgment only: contracts, diff audits vs checkpoint, interactive gates, merges. Parallel Opus lanes, own worktree from current head + `cmd /c mklink /J node_modules` junction, frozen contract, RED-first, own NEW test file, conventional commits, NO push. Codex BENCHED for MapSvg.tsx/layout.ts. Explore/Haiku digs (verify dig claims — one mispriced income-rename interactivity). Interrupted lane → SendMessage resume, don't redispatch. Never trust "it broke" reports before verifying server up + served hash == disk hash — but ALSO never assume stale cache when the report mixes new-feature passes with failures (burned once; Cyril was right). Token discipline: lane reports <1500 chars; never read agent .output transcripts.

## Cleanup backlog (after her clean pass)

11 worktrees `mm-lane-s49-{app1,editor,inspector,labels,app2,form,misc,insplite,incname,toolbar,tooltips}` + P-lane worktrees {present,rotstep,a11y,focus} + merged lane/s49-* branches; older mm-lane-* from s44/s48.

## Session-50 prompt (copy-paste)

> Read C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-session-49b-handoff.md FULLY — it is the canonical state. Step 0: restart the 4280 demo server per the handoff (kill stale PID first, hash-verify after — vite preview caches at startup). Step 1: check lane P4 (mm-lane-s49-focus) — finished/died/uncommitted; recover per handoff. Step 2: merge P1→P3→P2→P4 into repair/session-42, tsc + full vitest, extend gate11.mjs with the four new checks, run it on 4281, deploy (build:demo + SERVER RESTART + hash check). Step 3: run the two open investigations (#19 shift-click-on-account-body real repro; #1 dblclick-typing + F10 weirdness) with an interactive driver before writing any fix contract. Step 4: dispatch the generated-arrow-thickness lane (small, override-path mirror of W2-D). Bring Cyril: the summed-number-retype design options (three in the handoff) and the keyboard-rotate-step question. Orchestration per handoff doctrine — Fable judgment-only, parallel Opus lanes, interactive gates mandatory, dogfood reports outrank green suites.
