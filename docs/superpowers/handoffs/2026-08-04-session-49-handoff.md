# Session 49 Handoff — Waves 1+2 + Toolbar Shipped, Dogfood Round 2 In Flight (2026-08-04)

## Ground truth

- `repair/session-42` @ **1acf6e7** (merge: lane/s49-toolbar). vitest **712/712** (47 files), tsc clean.
- **Live demo**: demo-dist rebuilt at 1acf6e7, served at http://192.168.1.69:4280 (vite preview, background task of the running session — **dies with session or reboot**; her mid-run "dblclick fails" was exactly this: stale tab + dead server after Cyril's PC restart, NOT a bug). Restart: `cd C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40; pnpm exec vite preview --outDir demo-dist --host 0.0.0.0 --port 4280` (no rebuild needed). ALWAYS verify server up + served bundle hash == `demo-dist/index.html` hash before triaging any dogfood finding.
- Push/remotes still hard-denied by guardrails vc. Ceremony gated on verdicts C–E.

## Shipped this session (all gated, all live)

- **Wave 1** (merged @ a4e0511 + gate fix 77eb483): undo keeps panel + selection survival; present-mode zoom stash/restore incl. fullscreenchange path; Esc cancels armed note placement first; honest "Text size" pill on size-only targets; growing single-line editor input; consume-once chip-discard; incomeHeader + asNeededAmount font pills; inspector bar unclipped (min-height, grows down) + Delete account + Close title; flow labels lifted to a layer painted after accounts; chip font-size end-to-end.
- **Gate-found real bug** (77eb483): `exitPresentMode` nulled `presentZoomRef` BEFORE React ran the functional `setMapZoom` updater that read it → restore always kept 'fit'. Invisible to 660 green unit tests; interactive gate caught it in one run. Pinned via source assertion in tests/app-state-s49.test.tsx.
- **Wave 2** (merged through 451db96): dblclick account/income/need BODY → Data panel (text runs keep their own dblclick — designed marriage); "+ Flow" chrome button (needs 2-item selection); note spawn bottom-center + 18px cascade; zoom floor 25; live thousands separators (caret-safe, DOM-sync-before-setState pattern); Contents grouped under Income/Needs/Accounts/Flows/Notes; PDF /Producer /Creator /CreationDate /ID (content-derived FNV-1a, ponytail-marked); **income row rename on map** (new `incomeRowLabel` target kind; name run made interactive — Cyril challenged the "too hard" verdict and was right, ~130 lines); **inspector-lite**: START/END nudge groups deleted, colors collapsed to native-popover dropdown, custom-arrow thickness `sw` 1–6 (model→book validation→layout→render, mirrors color).
- **Toolbar Option A** (merged @ 1acf6e7): grammar order — identity → appearance → connections → position → divider → danger — applied to every selection state. Cyril picked A from the mockup artifact. Lane survived a mid-work PC reboot via SendMessage resume from transcript.
- Accepted deviations: tests/pdf.test.ts one assertion loosened (/ID legally lives in the trailer); tests/map-inspector.test.tsx four Start/End-point strings removed with the deleted feature; tests/misc-s49.test.tsx +1 line (cross-lane onOpenTarget prop).

## Artifacts (stable URLs; update = pass `url` to Artifact tool from a new session)

- **Dogfood run doc (STATEFUL)**: https://claude.ai/code/artifact/e2a6c37a-74b5-49ca-baa0-dbe778846f0b — 22 Do/Expect cards with Pass/Issue + notes, A–H verdict pickers (real s47 sheet: A rotate snap keep/free; B bar clip — likely resolved by s49 unclip, confirm; C undo-on-handoff accept/backlog; D SR lease a11y dispatch/backlog; E ceremony ff/rewrite; F curved labels skip/build; G wizard heading leave/wire; H note spawn — SHIPPED, confirm via check #20). State = localStorage per device (no shared-state capability on this runtime); **"Copy report" button** emits a paste-back summary — that paste is the input for triage. Share to the dogfooder via the page share menu (artifacts start private).
- **Toolbar options** (decided — A): https://claude.ai/code/artifact/644a41a1-1803-4973-8b33-b4f28bed64b6

## Gate driver

`gate11.mjs` at the s40 worktree root (untracked): 22 interactive checks (Waves 1+2), last full run 22/22. Toolbar order gate was a separate throwaway. Serve gate builds from `demo-gate/` on 4281 (`--strictPort`), kill listener after — **stale 4281 listeners from dead sessions bind 0.0.0.0 and shadow new previews** (`Get-NetTCPConnection -LocalPort 4281` first).
Driver traps (hard-won): chip editor is a TEXTAREA (multiline — width doesn't grow, by design); chip needs DBLCLICK on `[data-map-edit-hit="asNeededAmount"]` (single click selects); note `g.map-note` exists only AFTER text commit and the 2nd DOM match is the hidden print copy (null box); the +Add PANEL's "Add text note" spawns directly (`beginTextNotePlacement(true)`) while the identically-named chrome button arms placement; account-body dblclick must avoid text runs (they own the gesture — click ~12%/75% of the bbox); font pills are aria "Increase/Decrease font size"; playwright `setContent` pages have no localStorage (SecurityError) — test artifacts over `file://`.

## Open items (in order)

1. **Dogfood round 2**: Cyril + dogfooder walk the artifact doc against 4280 (Ctrl+F5 first), paste Copy-report output back → triage Issues into parallel Opus lanes (same doctrine).
2. **Verdicts A–H** come back in the same report; C–E gate the push-update ceremony (per s46/s47 handoffs; repo pre-push hook removal is the deliberate ceremony step).
3. **Lane cleanup after her pass is clean**: 10 worktrees `mm-lane-s49-{app1,editor,inspector,labels,app2,form,misc,insplite,incname,toolbar}` + merged `lane/s49-*` branches; also stale s44/s48 `mm-lane-*` worktrees from earlier sessions.
4. Tabled by choice: account inline mini-popover (dblclick→Data covers it); frequency-based toolbar tweaks (only if her usage shows reach-across).

## Doctrine (unchanged, binding)

Fable judgment-only: contracts, diff audits vs checkpoint, interactive gates, merges. Implementation = parallel Opus lanes in own worktrees (`git worktree add … + cmd /c mklink /J node_modules`), frozen contract, RED-first, own NEW test file, no push; NEVER trust lane self-reports over the diff (but s49 lanes were honest, incl. self-flagged deviations). Codex BENCHED for MapSvg.tsx/layout.ts. Explore/Haiku for digs (the income-rename dig mispriced interactivity — lanes must re-verify dig claims against code). Merge order: App.tsx lanes first; resolve conflicts inline. Interactive gate before every deploy; deploy = `npm run build:demo` (rebuilds demo-dist; open tabs unaffected until F5). Lane interrupted mid-work (reboot/session death) → resume via SendMessage to its agent id, don't redispatch.

## Session-50 prompt (copy-paste)

> Read `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\superpowers\handoffs\2026-08-04-session-49-handoff.md` fully. State: repair/session-42 @ 1acf6e7, 712/712, tsc clean, Waves 1+2 + toolbar Option A live on demo-dist. Step 0: restart the 4280 demo server (command in the handoff), curl 200, verify served bundle hash matches demo-dist/index.html. Then: Cyril will paste a "MONEY MAP DOGFOOD REPORT" from the stateful artifact (e2a6c37a…) — triage its ISSUES into parallel Opus fix lanes per the doctrine section (frozen contracts, own worktrees from current head, RED-first, Fable audits + interactive gate via gate11.mjs on 4281, deploy after gate). Record his A–H verdicts; C–E gate the push ceremony (see s46/s47 handoffs for ceremony mechanics). After a clean pass: delete the 10 mm-lane-s49-* worktrees and prune merged lane/s49-* branches. Traps: check for stale 4281 listeners; verify server+bundle before triaging any "it broke" report; chip/note/panel driver traps listed in the handoff.
