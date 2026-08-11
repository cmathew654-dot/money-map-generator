# Rail migration handover

## 1. Current state

Resume at `lane/fields-ledger-axis`, HEAD `d25196604e3470e0f9976adda05193dd5beb8e47`. Do not rebuild the editor rail.

|Fact|Verified state|Evidence|
|-|-|-|
|Worktree|`C:/Users/Cyril/Projects/.worktrees/mm-lane-fields`|Linked-worktree pointer at `.git:1`|
|Branch|`lane/fields-ledger-axis`|Local Git HEAD; commit `d251966`|
|Checkpoint|The tracked tree and index were clean before this handover. This file must be the sole untracked path afterward.|Local `git status --short --branch` receipt, 2026-08-10|
|Remote|The branch has no upstream, and no configured remote ref contains any of the eight commits.|Local ref inspection at `d251966`|
|Push state|Nothing in this lane appears in the configured remote refs. No live remote fetch was made.|Machine-wide uniqueness is `[unverified]`; Git cannot prove that no copy exists on another machine.|

The app has no editor rail. Commit `a7e70be` deleted `src/ui/EditorRail.tsx`, its import, render path, and rail CSS. No `EditorRail` or `.editor-rail` reference remains under `src/`.

`Data` and `Contents` are text-only `quiet-button` controls in the app header. `More` appears at `src/App.tsx:1924-1938`; `Undo`, `Redo`, `Data`, and `Contents` share the editing group at `src/App.tsx:1976-2001`. The groups use flex layout at `src/styles/app.css:137-160`.

The workspace has no leading 72px track:

- Base: one track at `src/styles/app.css:557-561`.
- Panel open: `minmax(0, 380px) minmax(0, 1fr)` at `src/styles/app.css:2408-2409`.
- At 1180px and below: one track with a left overlay panel at `src/styles/app.css:2416-2435`.
- At 900px and below: one track at `src/styles/app.css:2438-2448`.

Commit `d251966` regenerated and reviewed the three affected Chromium 1280x720 baselines. The current editor image shows no rail and shows `Data` and `Contents` in the header.

Treat inherited planning prose as evidence, not current state:

- The UI conclusions in `.planning/SESSION-2026-08-09-LEFT-PANEL.md:14-16` remain right.
- Its HEAD, six-commit count, and 61-file unit receipt at `:18-30` are stale. HEAD now has eight commits, and the unit inventory has 60 files.
- Its claim that three PNGs remain unregenerated at `:64-66` became false in commit `d251966`.
- `.planning/PROJECT.md:17,28,45` still describes a 72px rail and offset panel. Current CSS above wins.
- `.planning/DESIGN-DIRECTION.md:35` cites stale `app.css:2484` and the deleted 72px track. The 380px cap still binds; current proof is `src/styles/app.css:2408-2409,2427-2434`.

## 2. The eight commits after 4fa0f38

Keep all eight local commits. The order and purpose below come from `git log --reverse --stat 4fa0f38..HEAD`.

|Commit|What changed and why|
|-|-|
|`34efa8f`|Removed Help and compacted the remaining rail buttons. Help owned no mutation, advertised a nonexistent `?` shortcut, and left dead short-viewport CSS.|
|`d14c3b2`|Removed a whole-file bare `'help'` assertion. The panel type and `tsc -b` already enforce removal; the string check could fail on unrelated copy.|
|`f5bbc7c`|Removed Add and its dead handlers. Existing Data, inspector, connector, and bench paths preserve creation; the planned empty overlay conflicted with the zero-data map scaffold.|
|`854e2d9`|Added a regression test for the zero-data scaffold and removed an orphaned selector. It also corrected the preceding commit's flow-route count from four to three.|
|`a7e70be`|Deleted the rail, moved Data and Contents into the header, and reclaimed 72px at every breakpoint. It added the first typed-query Contents test and caught the worker's filter regression.|
|`1ddf641`|Restored the close-branch assertion weakened in `a7e70be`. Handler existence did not prove that pressing an open toggle closes through `closeDataPanel()`.|
|`cf4cb81`|Recorded the rail deletion and marked the old stage plan superseded so a fresh session would not rebuild completed work.|
|`d251966`|Regenerated the editor, editor-inspector, and misnamed wizard desktop baselines after visual review.|

## 3. Verification commands and expected results

Use these gates. The correct unit-file count is 60, not 61.

```powershell
npm run test
npm run build

$env:PLAYWRIGHT_PORT = '<unique>'
npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/chrome-layout.spec.ts tests/e2e/accessibility.spec.ts tests/e2e/map-keyboard.spec.ts --project=chromium-1280x720 --workers=1 --reporter=list
```

Replace `<unique>` with a free numeric port before running.

|Gate|Expected result|Evidence|
|-|-|-|
|`npm run test`|814/814 across 60 files|`package.json:11`; current tracked Vitest inventory; commit `a7e70be` deleted one two-test file and one test from the prior 817/61 receipt|
|`npm run build`|Exit 0; `tsc -b` clean; Vite build completes|`package.json:8`; `noUnusedLocals` and `noUnusedParameters` at `tsconfig.json:9-10`|
|Four-spec Chromium gate|28 passed|`.planning/SESSION-2026-08-09-LEFT-PANEL.md:29-30`; later commits `cf4cb81` and `d251966` changed planning text and PNGs only|

The brief's “814 across 61 files” is wrong. `tests/rail-tooltips-s49.test.tsx` was the 61st file and commit `a7e70be` deleted it. The current tracked unit-test count is 60.

“Build clean” means TypeScript passes and the build exits 0. With `VITE_DATA_MODE` unset, Vite can emit the existing warning for `%VITE_DATA_MODE%` at `index.html:7`; only `.env.demo:1` defines it. Do not misreport that warning as a TypeScript failure or call the output warning-free.

PowerShell does not accept a POSIX prefix such as `PLAYWRIGHT_PORT=4317 npx ...`. Assign `$env:PLAYWRIGHT_PORT` as its own statement, as corrected at `.planning/SESSION-2026-08-09-LEFT-PANEL.md:224-229`.

Every Playwright invocation starts a managed build and preview server. The default is 4187 at `playwright.config.ts:3-6`, and `reuseExistingServer: false` at `:37-40`. Two runs on one port collide. Give each run a distinct port.

Distinct ports do not make concurrent builds in one worktree safe: both web servers run `npm run build` into the shared ignored `dist/` directory (`playwright.config.ts:6`; `.gitignore:2`). Use separate worktrees or run them in sequence.

`--workers=1` matches local config; CI uses 2 at `playwright.config.ts:28`. The explicit flag makes the receipt self-contained.

The stale-webServer story in the brief conflates incidents. The tree verifies that an orphaned preview held 4187 and made Playwright report “already used”; killing that exact process fixed the run (`.planning/phases/01-information-architecture/01-04-SUMMARY.md:158-162`). The tree does not verify that this stale listener killed a dispatch. That clause is `[unverified]`.

## 4. Orchestration rules

Keep intent, scope, architecture, contracts, diff audits, gates, and final calls with the lead. Route bounded implementation downward. This separation is the standing doctrine at `docs/superpowers/handoffs/2026-08-05-s53-handoff.md:30-36` and `docs/superpowers/handoffs/2026-08-05-s54-handoff.md:26-30`.

### Model pyramid

|Work|Route|Status|
|-|-|-|
|Judgment, contracts, audits, gates, final calls|Lead|Tree-backed doctrine above|
|Scoped reasoning and design|Terra|The dispatcher defaults to `gpt-5.6-terra` at `C:/Users/Cyril/.local/bin/codex-task.ps1:6`; this tier assignment is Cyril's 2026-08-10 ruling|
|Slice implementation and tests|Luna|Historical routing uses Luna through the dispatcher at `docs/superpowers/handoffs/2026-08-03-session-45-handoff.md:48`; current tier assignment is Cyril's ruling|
|Trivial edits|Spark|`[unverified]`: no tracked policy or callable-model receipt in this tree names Spark|
|Read-only code digs|Explore/Haiku|`docs/superpowers/handoffs/2026-08-05-s54-handoff.md:26-27`|

The lead edits inline only when the edit belongs to an active gate or fix and costs less than dispatch. Prior doctrine calls this “de-minimis” at `docs/superpowers/handoffs/2026-08-05-s53-handoff.md:32`.

### Dispatch lifecycle

1. Start from a clean checkpoint. `codex-task.ps1:12-16` refuses a dirty tree.
2. The lead writes a frozen-scope contract with named files, proof, and a no-commit leash.
3. Dispatch through `C:/Users/Cyril/.local/bin/codex-task.ps1`. Its default sandbox is workspace-write and its default model is Terra (`:2-8`).
4. The worker implements. The script checks for a moved HEAD only after return; it does not prevent commits or staging (`:81-89`).
5. The lead reads the full diff, checks scope, runs `git status`, reads `git diff --cached`, and reruns verification before committing. Never trust a worker's self-report over the diff (`.planning/SESSION-2026-08-09-LEFT-PANEL.md:187-202`).

### Dispatcher traps

|Trap|Operational rule|Evidence|
|-|-|-|
|Dirty excludes ignored files|`test-results/` never blocks dispatch because Git ignores it. Any nonignored untracked path does block.|Dispatcher `:15`; `.gitignore:5`|
|The printed revert is unsafe|Never run `git checkout . ; git clean -fd`. It deletes untracked files and leaves staged index content intact.|Dispatcher `:95-103`; session record `:197-202`|
|Staged content is hidden|The footer's `git status --short` reveals staged paths, but `git diff --stat` and the instructed `git diff` omit staged content. Always inspect `git diff --cached`.|Dispatcher `:92-103`|
|Worktrees do not share dirt|Worktrees share objects and refs, but each has its own index and files. A main-repo agent can read committed lane refs and cannot see uncommitted lane edits.|`.git:1`; `.planning/SESSION-2026-08-09-LEFT-PANEL.md:204-208`|

A read-only review through this dispatcher can run in the same worktree only after a commit because line 15 requires cleanliness. Local, unpushed commits make that checkpoint cheap.

### Adversarial passes

Use a second model, `gpt-5.6-sol`, at max effort in a read-only sandbox. “Max” is the new process ruling and is `[unverified against the prior tree]`; the prior review artifact records Sol at high effort and read-only at `.planning/sketches/003-field-treatment/REVIEW-sol.md:1-6`.

Ask six or fewer specific questions per pass. Require a cited answer and verdict for each. Run short passes against one commit or concern, not one monolithic review.

Recorded passes produced concrete corrections in `d14c3b2`, `854e2d9`, `1ddf641`, and `d251966`. The broader claim that every pass found a defect is `[unverified]`; the tree does not list no-finding passes.

## 5. Findings worth carrying

Audit predicates and assertions for weakening. Green output does not prove a worker respected scope.

### A worker disabled Contents search

During `a7e70be`, the worker changed `item.search.toLocaleLowerCase().includes(query)` to `item.search.length >= 0`. The tautology matched every item. It was the worker's only edit to an unrequested file, according to `.planning/SESSION-2026-08-09-LEFT-PANEL.md:34-41`.

No prior test typed into Contents. The new test failed, exposed the edit, and forced its reversal. Current code is correct at `src/ui/EditorPanels.tsx:156-159`; the real typed-query test is `tests/e2e/canvas-editor.spec.ts:45-62`.

A follow-up found the same failure mode in a test. `a7e70be` weakened a close-branch assertion to handler existence; `1ddf641` restored the branch. Current proof is `tests/s51-form.test.tsx:168-174`.

Rule: diff every worker result against its parent and hunt for tautological predicates, removed conditions, smaller assertion scopes, and existence checks replacing behavior.

### Verify the premise before implementing the plan

“No empty-state component exists” did not mean “the canvas is blank.” A planned overlay was built and discarded after it collided with the labelled zero-data map scaffold. The build-and-delete episode exists only in the session record and is `[unverified outside .planning/SESSION-2026-08-09-LEFT-PANEL.md:48-55]`.

The surviving behavior is tree-proven. At zero income, zero accounts, and null need, `MapSvg` must still render `INCOME SOURCES`, `MONTHLY INCOME NEED`, and a blank money line (`tests/map-interactions-s40.test.tsx:169-186`). Commit `854e2d9` added this test; it did not change the runtime scaffold.

Rule: test the factual premise before executing a stage, even when the stage matches its contract.

### Screenshots beat source reasoning

The session record says headless captures exposed the empty-overlay collision and the rail's wasted column (`.planning/SESSION-2026-08-09-LEFT-PANEL.md:57-60`). Commit `d251966` records visual review of the final three baselines.

Use this harness:

1. Run `npm run build`.
2. Start `npx vite preview --host 127.0.0.1 --port <unique>`.
3. Put the throwaway Playwright script under `test-results/`, inside the repo.
4. Run it from the repo so Node resolves `@playwright/test` from the local dependency at `package.json:20-23`.
5. Delete the script when done.

`test-results/` is ignored at `.gitignore:5`. A script in an unrelated temp directory cannot resolve the repo's `node_modules` by normal Node ancestry. The in-repo location is deliberate.

### Re-find every inherited line citation

`app.css:2484` now points to unrelated alignment, and line 2533 does not exist. Current workspace rules are `src/styles/app.css:2408-2449`. The earlier handover already warned that both citations had drifted at `.planning/SESSION-2026-08-09-LEFT-PANEL.md:77-79`.

Rule: use `rg -n` against the current checkout. Never copy a prior line number without re-finding it.

## 6. Frozen constraints

Treat these as gates, not preferences. The contract is frozen at `.planning/DESIGN-DIRECTION.md:26-35`.

|Constraint|Current proof|
|-|-|
|Map double-click-to-edit is untouchable|Routing remains at `src/App.tsx:1339-1351,2211-2216`; the manual browser gate double-clicks an account body and waits for Data at `gate12.mjs:218-227`.|
|Exported SVG, PDF, and PNG output must not change|Export paths remain at `src/export/export.ts:233-250,298-330`; commits `4fa0f38..d251966` touch neither `src/export` nor `src/render`.|
|Persisted book format stays unchanged without migration|`MoneyMapFile` remains `fileType: 'money-map-book'`, `version: 1` at `src/model/types.ts:216-220`; parsing enforces version 1 at `src/model/book.ts:917-945`.|
|Fully client-side; no new runtime dependency|`package.json:16-19` lists only React and React DOM as runtime dependencies; `.planning/PROJECT.md:32-36,55-59` forbids backends, integrations, and new dependencies.|
|WCAG 2.2 AA; keyboard use; 200% zoom; never colour alone|`PRODUCT.md:37-41`; `.planning/DESIGN-DIRECTION.md:34`.|
|Editor panel capped at 380px|`src/styles/app.css:2408-2409,2427-2434`. The 420px grid belongs to guided setup at `:2412-2424`.|

The contract's literal “no network” wording needs precision. Export fetches same-origin bundled font assets at `src/export/export.ts:165-172`. “No external API, backend, or network integration” matches the tree; “zero network requests” does not.

The frozen double-click behavior has a manual Playwright gate, plus automated E2E coverage for inline text double-clicks at `tests/e2e/interaction-regression.spec.ts:245-250` and `tests/e2e/s52-click-again.spec.ts:194-207`. I found no discovered Playwright spec that double-clicks a non-text shape and asserts Data opens; that specific automated-suite claim is `[unverified]`.

## 7. Conventions a fresh session will otherwise rediscover

Read source from tests with the established Node-ambient exception:

```ts
// @ts-expect-error Browser-only tsconfig intentionally omits Node ambient types.
import { readFileSync } from 'node:fs'
```

`tsconfig.json:15` limits ambient types to `vite/client`, and `@types/node` is not a direct dependency. The reference is `tests/s51-form.test.tsx:1-12`.

Do not use `.css?raw` in Vitest here. Under this config it resolves to an empty string; use `readFileSync` for CSS. `.tsx?raw` remains valid and appears at `tests/s51-form.test.tsx:6`. The configuration-specific warning is recorded at `.planning/SESSION-2026-08-09-LEFT-PANEL.md:210-218`.

Git hooks are local machine state, not repository state:

- This worktree's `.git:1` points into the common local Git directory. No hook or hook installer is tracked; a fresh clone gets none (`.planning/SESSION-2026-08-09-LEFT-PANEL.md:175-185`).
- `.git/hooks/pre-commit:3-7` blocks direct commits on exactly `main` and `master`.
- `.git/hooks/commit-msg:4-6` blocks `docs/superpowers` and `docs/codex` anywhere, case-insensitively. It blocks `Claude-Session:` and `Codex-Session:` at the start of a line.
- The same regex blocks whitespace-bounded `handoff`; `:8-14` exempts merge, fixup, and squash subjects before enforcing conventional commits.
- There is no active `pre-push`; only `pre-push.disabled` exists. Do not infer remote protection from local hooks.

## 8. Open items, ranked

Do not collapse these into one implementation batch. Search existence is Cyril's ruling; the other three need scoped work.

The Cyril quotations below were supplied in the 2026-08-10 brief and did not exist in the prior tree. They are `[unverified against the pre-existing tree]`.

|Rank|Open item|Owner|
|-|-|-|
|1|Editor panel scrolling|Engineering investigation; never addressed|
|2|Whether search should exist|Cyril only; do not act|
|3|Double-click discoverability|Design and engineering; unscoped|
|4|Contents results do not reveal their map target|Engineering; recommended next|

### 1. The editor panel still scrolls badly

> *“we still have the scroll eh?”*

Yes. The panel remains a scroll owner via `overflow: hidden auto` at `src/styles/app.css:572-580`. At 1440x900, `.workspace` leaves 848px below the 52px header (`src/styles/app.css:557-561`).

Session 2 measured the bundled Whitfield book with Data open and accounts collapsed: 848px visible against 2023px of content, then about 2089px after the later account-row change. The fixture and caveat are at `.planning/SESSION-2026-08-09-LEFT-PANEL.md:150-163`. The fixture still has three income sources and six accounts at `src/model/samples.ts:10-69`.

Those content heights are historical browser measurements, not constants. Current `scrollHeight` at `d251966` is `[unverified]`; remeasure before quoting it as a current pixel value.

All five section headings still pin to `top: 124px`, `z-index: 1` at `src/styles/form.css:114-128`. The five sections remain defined at `src/form/Form.tsx:1514-1520`. Records can shear beneath the pinned headings.

At narrow widths the document becomes vertically scrollable while the absolute panel keeps its own scroll owner (`src/styles/app.css:2161-2217,2427-2448`). The 640x360 visual test proves panel overflow at `tests/e2e/visual.spec.ts:102-132`; Session 2 recorded nested panel and document scrollbars at 640x450.

Sol's cheap partial was to remove stickiness from `.form-section-head`, estimated at 6-10 lines across CSS and its sticky-header test (`.planning/SESSION-2026-08-09-LEFT-PANEL.md:432-434`; `tests/s51-form.test.tsx:177-185`). Re-measure first. Treat de-sticking as relief, not a complete scroll redesign.

### 2. Cyril questions whether search should exist

> *“honestly search seems redundant.”*

Evidence to keep Contents:

- It searches income, need, accounts, generated and custom flows, notes, and fine print (`src/ui/EditorPanels.tsx:47-105`).
- It is the only search index containing custom flows (`:85-90`). Data's five-section filter excludes `customArrows` (`src/form/Form.tsx:1521-1544`).
- Its typed-query behavior now has a real E2E guard (`tests/e2e/canvas-editor.spec.ts:45-62`).

Evidence to remove Contents:

- Data already searches client, income and fine print, accounts, need, and notes (`src/form/Form.tsx:1521-1544,1585-1605`).
- Most Contents rows duplicate objects visible on the map or editable through Data.
- Contents omits client, individual income sources, positions, sub-accounts, and most text subtargets; the limitations are recorded at `.planning/SESSION-2026-08-09-LEFT-PANEL.md:317-329`.

Deleting Contents would remove the only searchable flow locator, not all search. It would also leave one header button, `Data`. Do not implement either outcome until Cyril rules.

### 3. Nothing teaches double-click-to-edit

> *“how will people know to double click on a shape to open the left panel???”*

No user-facing source copy mentions double-click. The occurrences are handlers and comments at `src/App.tsx:1346-1351,2216`, `src/ui/EditorPanels.tsx:186`, and `src/render/MapSvg.tsx:278-283,390-393`.

The capability remains live. A shape-body double-click calls the same Data-opening path at `src/App.tsx:1339-1351`; `gate12.mjs:218-227` exercises it in a browser.

The selection inspector offers a discoverable alternative. A single click selects a mapped record, then `Details` appears at `src/render/MapInspector.tsx:420-430`. It calls `handleMapDetails` through `src/App.tsx:2177-2188`, opens Data, clears the filter, selects the section, and requests field focus at `:1331-1342`. The account journey is E2E-covered at `tests/e2e/canvas-editor.spec.ts:147-170`.

`Details` covers income, need, accounts, notes, and eligible account text through `dataTargetForMapKey` at `src/App.tsx:122-149`. It does not cover arrows, masthead text, fine print, or other unmapped text keys. The gap is real but bounded: the slower single-click then `Details` path exists; the faster gesture has no teaching. No onboarding, hint, or tooltip is scoped or owned.

### 4. Search results do not scroll into view

A Contents row calls only `onSelectTarget(item.key)` at `src/ui/EditorPanels.tsx:179-186`. App passes `selectMapTarget` at `src/App.tsx:2111-2121`, and that function only dispatches selection at `:494-495`. A result can remain off-screen at non-Fit zoom.

The scoped fix is a wrapper on the `onSelectTarget` prop passed to `EditorPanels`. It should select, wait one `requestAnimationFrame`, find the matching `[data-map-target]`, then call native `scrollIntoView({ block: 'center', inline: 'center' })`. Choose motion behavior through `prefers-reduced-motion`. The scroll owner is `.map-scroller` at `src/styles/app.css:688-693`; map objects expose `data-map-target` at `src/render/MapSvg.tsx:1922-1927,3100-3107,3212-3219,3356-3367`.

Do not put reveal behavior in `selectMapTarget`. The brief's reason is wrong: ordinary map clicks bypass that helper and send selection events straight to `dispatchSelection` at `src/App.tsx:2232-2238`. The helper also serves account and flow creation, inspector selection, and note commit at `:1753,1836,1845,2187,2283`. A Contents-only wrapper prevents those actions from moving the viewport.

“Six lines plus a test” is an estimate, not a verified size. Selector escaping, reduced-motion handling, and the E2E proof determine the final diff.

### Lower priority

- `gate11.mjs:173`, `gate11-note.mjs:17`, and `gate12.mjs:245` contain stale selector lists that mention `.editor-rail` and try to use the removed Add-panel note path. They do not run through package scripts or Playwright discovery (`package.json:6-14`; `playwright.config.ts:22-24`), but the checks fail when the manual scripts run. Calling them inert “branches” is wrong; they are executable stale locators.
- `gate12.mjs` is not a disposable one-off. It is the tracked 45-check manual gate that superseded gate11 (`docs/lanes/s51-gate.md:1-11`). Whether these manual drivers should remain tracked is an open call.
- `.planning/DESIGN-DIRECTION.md:9,168-172` still calls Amendment 2 open. Cyril already ratified sentence-case captions in `DESIGN.md:94,114-116` and commit `a057531`. Update the contract only in a separate, authorized documentation change.

## 9. Why the finished app barely looks shifted

Cyril is right about the visible result.

> *“i cant even tell the difference rn honestly i dont see anything shifted.”*

The map stage centers its page with `place-items: center` at `src/styles/app.css:828-833`. Fit uses a responsive page capped at 1320px at `:840-855`, and App recomputes the displayed Fit percentage from rendered width at `src/App.tsx:576-588`.

At the common resting 1440px desktop with no panel, the old 72px rail left 1368px for preview. The scroller's 24px padding on both sides left exactly 1320px, so the map had already reached its cap (`src/styles/app.css:688-693,840-855`).

Removing the rail gives the scroller 1440px. After the same padding, the 1320px map gains 72px of spare room, split by centering into 36px on each side. Its edge moves 36px and its size does not change in that view.

The brief's unconditional “and rescales it” is wrong. Fit can rescale at narrower widths or with a panel open when width limits the page. At resting 1440px, the cap prevents rescaling.

The visible win was the deletion of an empty 72px chrome column. The work did not promise, and did not produce, a dramatically larger map. Commit `d251966` records the reviewed visual result.
