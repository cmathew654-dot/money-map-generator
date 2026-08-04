# Session 48 → 49 Handoff — Dogfood Triage Execution (2026-08-04)

## Context

Session 48 shipped 5 gated fixes (note text color cf6a0d9, note font-size buttons c6e4392, data-filter rows 765764f, flow labels ed3e22b/d602eff, ctrl+wheel leak 6baed99/c4ee8c4). The novice dogfooder then filed ~30 findings (on the PRE-fix build — 4 items already fixed). All unknowns were root-caused by an Explore dig; three Wave-1 lanes ran RESEARCH-ONLY (plan mode blocked edits) and corrected three wrong premises. The S49 plan (`C:\Users\Cyril\.claude\plans\handoff-doc-committed-6d3fb03-fizzy-locket.md`) is final and research-complete. Nothing implemented for Wave 1/2 at handoff time.

## Ground truth

- `repair/session-42` @ **c4ee8c4**, vitest **625/625** (37 files), tsc clean. Live demo `demo-dist` = this build.
- Demo server port 4280 runs as a background task of the current session — dies with it. Restart: `cd C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40; pnpm exec vite preview --outDir demo-dist --host 0.0.0.0 --port 4280` (no rebuild). URL http://192.168.1.69:4280.
- Test-drive artifact (novice language, stable URL): https://claude.ai/code/artifact/9e90b938-f99d-49eb-9d8e-4e0149e83123 — updating from a new session requires passing `url` to the Artifact tool.
- Verdicts A–H still open with Cyril; C–E gate the push ceremony. Push/remotes hard-denied by guardrails vc (removal = deliberate ceremony).

## Triage verdicts

- **Already fixed — she re-verifies:** size buttons resize text; note font size exists; ctrl+wheel; custom-flow labels.
- **By design / answered:** generated-flow labels exist; NO auto-arrows (Cyril); chip rides its own arrow.
- **Deferred to designed inspector-redesign pass:** toolbar reorg, colors dropdown, remove START/END nudge groups, arrow thickness, account inline mini-popover (dblclick marriage pt 2), income-name fields in inspector.

## Lane state at handoff (worktrees EXIST — do not re-create)

| Lane | Worktree / branch | State |
|-|-|-|
| W1-A | mm-lane-s49-app1 / lane/s49-app1 @ c4ee8c4 | exists, junction OK, research done, no edits |
| W1-B | mm-lane-s49-editor / lane/s49-editor @ c4ee8c4 | exists, junction OK, research done, no edits |
| W1-C | mm-lane-s49-inspector / lane/s49-inspector @ c4ee8c4 | exists, junction DENIED by permissions — approve `cmd /c mklink /J` or run `pnpm install` in-lane first |
| W1-D | not created | not dispatched |
| W2-A/B/C | not created | not dispatched |

Lane research plan files: `C:\Users\Cyril\.claude\plans\handoff-doc-committed-6d3fb03-fizzy-locket-agent-<id>.md` (three exist). Re-dispatched lanes get the **corrected contracts from the S49 plan**, not the stale s48 chat versions.

## Wave 1 — four parallel Opus lanes (corrected contracts)

**W1-A `lane/s49-app1` — App.tsx state bugs (research-verified):**
1. Undo closes sidebar: DELETE the `closeDataPanel()` call in `restoreHistorySnapshot` (App.tsx:521-528) — verified redundant (`setFocusRequest(undefined)` already happens via `bumpFormRevision()`). Selection cleared only if target vanished — key shapes: `account:`/`note:`/`arrow:custom:` need id lookups; id-less income/need always survive.
2. Present mode: stash zoom on `handlePresent` (:948), restore in `exitPresentMode` (:833); ALSO route the fullscreenchange handler (App.tsx:845-849) through `exitPresentMode()` — it currently calls `setPresentMode(false)` directly and would skip the restore (lane-found second leak). Pan-from-anywhere while presenting: relax the `[data-map-background]` gate (:1514) when presentMode.
3. Esc chain (:813-819): move `placingTextNote` cancellation to the front.
- Tests: 3 new exported pure helpers (`mapTargetKeyStillExists`, `canStartMapPan`, `presentExitZoom`) + `?raw` source assertions, mirroring `tests/session40-app.test.ts`; ~9 tests in `tests/app-state-s49.test.tsx`.

**W1-B `lane/s49-editor` — src/ui/MapTextEditor.tsx (path corrected; premises fixed):**
1. Size-only targets (accountRows, accountSub, incomeHeader, needLabel, footnoteText) have NO commit path BY DESIGN (`applyMapTextEdit`:497 hard-returns; aggregates/static strings). Fix = make the pill honest: add a visible "Text size" label to the pill so dblclick doesn't look like a broken text editor. NO fake input, NO read-only mirror (decision made). Individual values keep their own editable runs.
2. Input width pinned to pre-edit rect (:735) → grow with content, pre-edit width as minimum.
3. Chip-commit discard race (App.tsx:405-410): the setTimeout is load-bearing (catches post-unmount commits) — fix is a consume-once helper at the commit site, not removing the timeout. Minimal App.tsx lines allowed for this only.
4. Font-size pill case: add `incomeHeader` to `mapTextEditFsInfo` (:378) — its fs path is live end-to-end. The `asNeededAmount` case MOVES to W1-D (consumption is hardcoded `TYPE.arrowLabel` in MapSvg.tsx:1977 + layout.ts:1941/1944 — dead control without it).
5. Editor lineHeight 1.25 → `NOTE_LEADING`/`TYPE.note` = 1.3125 (:723; constants in src/layout/layout.ts:252, tokens).
- Tests via `renderToStaticMarkup` (repo has no jsdom/RTL — node env), ~8 tests in `tests/map-text-editor-s49.test.tsx`.

**W1-C `lane/s49-inspector` — MapInspector.tsx + app.css patch:**
1. Unclip the bar: drop fixed `height:72px` (app.css:763-782), grow DOWN keeping `top:12px` anchor (decision: stable heading y, no bar-jumping), no scrollbar, cap ~2 rows; nothing clipped at 1440×900 for account/note/custom-arrow selections. Watch item: `.app-shell:has(.map-inspector) .app-status-stack { top:160px }` (app.css:2172) may need ~200px — touch only if the gate shows overlap.
2. "Delete account" button in the danger cluster (MapInspector.tsx:685-687, beside Delete flow/note), reusing `deleteMapAccount` (src/render/mapInteraction.ts:578) exactly as the keyboard path (`deleteSelectedMapItems`, App.tsx:1383-1391) does — no second implementation. Guard on the existing account derivation (MapInspector.tsx:183-188).
3. × (MapInspector.tsx:452-456): aria-label/title "Close".
- Tests mirror `tests/map-inspector.test.tsx` (function-call render + app.css regex assertions), in `tests/inspector-s49.test.tsx`. Junction/permission blocker must be cleared first.

**W1-D `lane/s49-labels` — MapSvg.tsx + layout.ts (the careful lane — Opus only, codex benched, own interactive gate):**
1. Flow-label z-order: `FlowArrowLabel` renders in the arrows group (MapSvg.tsx:2990) before `<g aria-label="Accounts">` (:3142) — lift labels into a layer painted after accounts. Do not touch chip/freeze logic (`showSnapshot`, `asNeededArrow` anchor — s47 saga).
2. Chip font size consumption (moved from W1-B): make chip label text read an fs override instead of hardcoded `TYPE.arrowLabel` (MapSvg.tsx:1977, layout.ts:1941/1944) + add the `asNeededAmount` case to `mapTextEditFsInfo` so the A−/A+ pill works end-to-end.
- Own NEW test file + the gate covers both visually.

## Wave 2 — after Wave 1 merges

- **W2-A `lane/s49-app2`** (App.tsx free again): dblclick on account/income/need BODY → `handleMapDetails` (:1165, focusDataTarget); Contents rows dblclick same (EditorPanels.tsx:290-297). "+ Flow" chrome button (App.tsx:2160-2196) reusing `handlePanelAddFlow` (:1677) / `addCustomArrow`. Note default spawn → bottom-center + cascade (App.tsx:1648-1656; retires verdict H). Zoom floor 50→25 (:1464, :1473-1476, :1751).
- **W2-B `lane/s49-form`**: live thousands separators in money drafts (Form.tsx:294-308; `parseMoneyInput` already tolerant; caret-safe).
- **W2-C `lane/s49-misc`**: Contents grouping headers (EditorPanels.tsx:46-105); PDF metadata /Producer /CreationDate /ID (export/pdf.ts — "unsecured" heuristic mitigation; http-LAN caveat documented, not fixable).

## Orchestration doctrine (BINDING)

- **Model routing:** Fable = judgment/audit/gates only. Implementation = parallel Opus lanes (Cyril's standing order). Evidence digs/reads = Explore agents (Haiku-class). Codex BENCHED for MapSvg.tsx/layout.ts. De-minimis inline only when gate-adjacent and smaller than dispatch overhead.
- **Parallel worktrees:** one lane = one worktree `C:\Users\Cyril\Projects\.worktrees\mm-lane-s49-*` + branch `lane/s49-*` from c4ee8c4, junctioned node_modules (`cmd /c mklink /J` — needs permission approval; PowerShell fallback if Bash mklink silently no-ops). Frozen CONTRACT prompt, NO-DRIVER-WORK token (unit lanes), RED-first, own NEW test file, conventional commits never "wip", NO push. Merge at end by Fable only: audit each diff vs c4ee8c4, rerun tsc + full vitest in-lane, merge to repair/session-42, resolve conflicts inline (W1-A and W1-B both touch App.tsx in disjoint regions — merge A first).
- **Token discipline:** lane reports <1500 chars, outcomes only; never read agent transcripts (.output JSONL) — read their small log/plan artifacts; progress probes = artifact mtimes then process table (0-byte output size is a DEAD signal — completed tasks also leave 0 bytes); one TaskOutput/notification read per agent.
- **Guardrail hooks (armed, auto-load):** lane PreToolUse DENIES browser-driver dispatches lacking `SELECTOR-MAP:`+`TIMEOUT-BUDGET:` (escape `NO-DRIVER-WORK` — needed even when a contract merely says "no playwright"); lanewatch warns on 12-min-silent tasks (one warn cap, known completed-task false positive). Audit: `node C:\Users\Cyril\.claude\hooks\guardrails.js report` / `selftest` (32 cases).
- **Gates are INTERACTIVE and Fable-run** — static green missed the note-color semantic, the wheel leak, and the typing-black-holes; humans found all three in seconds. Gate builds → `demo-gate/` on port 4281 (kill listener after; NEVER rebuild demo-dist to gate). Driver traps: click arrows ON-STROKE via `getPointAtLength`+`getScreenCTM`; Escape to clear selection before selecting a new target (open inspector swallows clicks); never assert `page.locator('svg').first()` (rail icon — use `page.content()`); selectors: `circle.map-rotate-handle`, `input[aria-label="Filter data"]`, `g.map-note[data-note-id]`, `svg[data-selected-target]`, `.map-scroller`, aria-labeled inspector buttons; TIMEOUT-BUDGET 4000ms.
- **Deploys:** rebuild demo-dist after each merged+gated wave (safe mid-dogfood: single JS bundle; open tabs unaffected until F5). Cyril's standing call: fixes go live promptly.

## gate11 (single interactive driver, post-Wave-1)

Undo keeps panel open · present pan-from-box + zoom restore incl. fullscreenchange exit · typing VISIBLE and growing in dblclick editors · chip value saves · chip + income-header font pills work · "Text size" pill label on aggregates · inspector 2-row no-clip screenshot at 1440×900 (+ status-stack overlap check) · label-over-cylinder screenshot · Esc cancels armed placement first. Post-Wave-2 additions: dblclick→Data, + Flow, bottom note spawn, zoom 25, comma typing, Contents groups.

## Verification

Per lane: RED first, tsc clean, full suite green (625 + new). Post-merge per wave: full suite at root, gate11 vs demo-gate on 4281, eyeball screenshots, live rebuild. Acceptance = her re-run (the 4 already-fixed items + the wave's items).

## Session-49 prompt (copy-paste)

> Read `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-session-48-handoff.md` fully, then the approved plan at `C:\Users\Cyril\.claude\plans\handoff-doc-committed-6d3fb03-fizzy-locket.md` — it is research-complete; execute it as written. State: repair/session-42 @ c4ee8c4, 625/625, five s48 fixes live; dogfood triage done; lane worktrees mm-lane-s49-{app1,editor,inspector} EXIST at c4ee8c4 with research done and NO edits (inspector lane needs the node_modules junction approved). Step 0: restart the demo server, commit the handoff. Then dispatch Wave 1 (four Opus lanes, corrected contracts from the plan — NOT the s48 chat versions), audit diffs vs c4ee8c4, rerun verification yourself, merge A-first, run gate11 interactively, deploy, then Wave 2. Orchestration per the handoff doctrine: Fable judgment-only, Explore for digs, codex benched for MapSvg/layout, lane+lanewatch hooks armed, interactive gates mandatory, token discipline strict. The dogfooder re-tests after each deploy — her findings outrank every green suite.
