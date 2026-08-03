# Session 42 E2E Repair Handoff

This is the copy-paste handoff for a fresh implementation window. The product
must be treated as broken until the current-UI journeys below have been run and
all blocker/high failures have either been fixed or reported with reproducible
evidence. Do not mistake test maintenance for product repair.

## Resume point

- Worktree: `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40`
- Branch: `repair/session-42`
- Current HEAD: `b52f6c7 test: cover current data-first journey routes`
- Remote: nothing pushed; never push or add a remote
- Local app: normally `http://127.0.0.1:4361`
- Existing route inventory: `REAL-WORLD-JOURNEYS.md`

## Read completely before acting

1. `C:\Users\Cyril\AGENTS.md`
2. `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\AGENTS.md`
3. `REAL-WORLD-JOURNEYS.md`
4. `docs/superpowers/specs/2026-08-02-canvas-first-editor-design.md`
5. `docs/superpowers/plans/2026-08-02-canvas-first-editor.md`
6. This handoff

Ponytail full remains active. Use the existing React/Playwright/Vitest stack.
No new dependencies, alternate state owner, test-only product modes, broad
refactor, or speculative framework.

## Non-negotiable truth rule

For every failing route, classify the failure before editing:

1. **Product defect:** the current UI behaves incorrectly. Add the smallest
   regression, make it fail for the observed behavior, fix the root cause in
   production code, and rerun the whole affected journey.
2. **Stale test:** the intended current UI works, but the test still targets a
   retired control such as `Full form`. Update only the stale interaction to
   the current `Data` path, then prove the complete journey still passes.
3. **Human product-feel failure:** the UI technically works but is confusing,
   visually weak, or erodes advisor confidence. Record exact evidence; do not
   invent a brittle DOM assertion and call the concern solved.

Changing selectors alone is not a product fix. A green automated test does not
override a visibly broken route. Never claim completion unless the user-visible
behavior changed when a product defect was found.

## Severity and stop rules

- **Blocker:** cannot create/edit/save/export, data loss/corruption, stranded
  read-only state, unrecoverable UI, or output unusable in a client meeting.
- **High:** common route is misleading, unreliable, inaccessible, or requires
  a workaround an advisor would not reasonably discover.
- **Medium:** edge-case breakage with a recoverable workaround, clipping,
  inconsistent selection, or degraded keyboard/pointer behavior.
- **Polish:** cosmetic issue that does not impair completion or confidence.

Stop after the first 30-minute pass if it finds no blocker/high issue. If it
does find one, continue only long enough to reproduce, regression-test, fix,
and rerun its overlapping routes. Do not silently expand into unrelated polish.

## Timeboxed route plan

### First 30 minutes: blocker/high-risk routes

Cover all of these, severity-first:

1. **Landing and creation orientation**
   - Start with clean storage at the default sample.
   - Verify the current client, Add, Data, Contents, Present, Print, and Export
     are discoverable and enabled when appropriate.
   - Create a new client and confirm the first useful action is obvious.
2. **Create in three orders**
   - Account -> edit -> income -> need.
   - Income -> edit -> account -> need.
   - Need -> edit -> account -> income.
   - Each Add action must create exactly one object, select it, open Data, and
     focus the relevant fields without forcing a prescribed order.
   - Preserve blank money as `null`; it must render as `~$ ______`, never zero.
3. **Add/Data transitions**
   - Add each supported item, edit it immediately, close Data with Escape,
     reselect through canvas and Contents, then edit again.
   - Selection, inspector, and Data must agree on the same object.
4. **Persistence and background-tab leases**
   - Edit, wait for save, reload, switch clients, and return.
   - Open two tabs, move one to the background, close/crash the writer, and
     verify the visible tab becomes editable without `another tab is finishing
     its work` becoming permanent.
   - Verify the latest edit survives every handoff.
5. **Undo/redo**
   - Cover text, money, Add, delete, drag, resize, rotate, Tidy, and flow edits.
   - One user action must equal one history step. Stale focused drafts must not
     resurrect after undo, client switch, reload, or drag.
6. **Flows**
   - Create income-to-need, account-to-need, and account-to-account flows.
   - Reject invalid/self/duplicate targets without history pollution.
   - Delete an endpoint, undo/redo, and verify no orphan or reversed arrow.
7. **Present, print, and export**
   - Enter/exit Present with pointer and Escape.
   - Exercise Print plus PNG, PDF, and SVG export.
   - Verify output has no rail, panels, selection chrome, handles, or hit areas;
     blank money and long labels remain legible.
8. **Recovery**
   - Seed malformed saved JSON, verify explicit recovery, download the raw copy,
     start fresh, and load a valid backup.
   - Never claim a save succeeded when storage failed.
9. **200% zoom**
   - At 640x360/200%, reach Add, Data, Contents, Present, Print, Export, undo,
     redo, and the selected object controls by keyboard and pointer.
   - The panel must overlay/scroll independently; controls and status banners
     must not trap or obscure the map.

### Next 60-90 minutes: stabilize current-UI E2E

Only proceed when requested, or when the first pass found blocker/high failures
whose overlapping routes require broader proof.

- Convert the blocker/high journeys above into stable Playwright routes using
  current UI language and accessible selectors.
- Replace stale `Full form` assumptions with the current `Data` interaction.
  Keep the explicit assertion that `Full form` no longer exists where it
  documents the intended product.
- Reuse `tests/e2e/helpers.ts`; do not duplicate navigation/focus/storage setup.
- Run Playwright serially with `--workers=1`, one project at a time, and a unique
  `PLAYWRIGHT_PORT` per command. Start with `chromium-1280x720`.
- Prefer journey-sized tests over isolated selector checks. A route must begin
  from a realistic state and assert the final user outcome.
- Remove or repair a flaky route only after identifying whether timing, focus,
  lifecycle simulation, or the product is responsible. No arbitrary sleeps.

### Another 30-45 minutes: medium-risk routes

- Long titles, account names, supporting notes, fine print, and multiline text.
- Punctuation: `~`, `$`, `%`, `&`, apostrophes, slashes, and em dashes.
- Text notes in blank space and over shapes; edit, move, resize, reload.
- Shape body/title/blank-space selection, drag, resize, and rotate.
- Rapid Add/edit/Escape, Tidy/undo, delete/undo, and tab handoff actions.
- Narrow layouts and canvas panning at 1024x768, 900x700, and 640x360.
- Full keyboard navigation, visible focus, menus, Escape, Enter, Space,
  undo/redo, and Delete without stealing keystrokes from text fields.

### Human-only dogfood

Automation may collect screenshots/video and flag clipping, dead controls,
unexpected copy, or state disagreement. It may not certify these questions:

- “What am I looking at?”
- “Where do I create a new map?”
- Does the hierarchy feel calm and intentional?
- Is any copy confusing or overly technical?
- Would an advisor trust this during a live client meeting?

Record the exact screen, action, expectation, actual feeling/problem, severity,
and screenshot. Do not convert subjective judgment into a fake green test.

## Implementation guardrails

- Sol high owns route reasoning, severity, overlap analysis, review, gate
  interpretation, and stop/commit decisions.
- Use one Codex 5.3 Spark fast implementation stream for bounded test/product
  patches. Never run concurrent writers against `App.tsx` or E2E files.
- Before each product edit, trace every caller of the shared function or event
  handler. Fix the root once, not the named symptom in one route.
- Strict RED/GREEN for every product defect. Capture the failing assertion and
  the observed user behavior before implementation.
- Preserve App as sole book/history/persistence/writer owner and preserve null
  money semantics.
- Do not weaken assertions, disable accessibility rules, add broad timeouts, or
  update screenshots until the observed difference is understood.
- Use hard command timeouts. If a Playwright web server leaves a stale repo-local
  Vite process, identify its exact command line and terminate only that process.
- Never run the full browser matrix in parallel. Never push.

## Evidence ledger

For every failure, record:

- route and exact step
- blocker/high/medium/polish
- browser, viewport, and zoom
- expected versus actual
- reproduction rate
- screenshot/video/trace path
- whether data changed or was lost
- overlapping systems: selection, form drafts, history, layout, persistence,
  writer lease, focus, rendering, print, or export
- classification: product defect, stale test, or human-only concern
- regression added, production fix, focused rerun, and overlapping reruns

## Required verification

Use hard timeouts and unique ports:

```powershell
$env:PLAYWRIGHT_PORT='4401'; npx playwright test tests/e2e/canvas-editor.spec.ts tests/e2e/app-resilience.spec.ts tests/e2e/multitab-history.spec.ts tests/e2e/interaction-regression.spec.ts tests/e2e/certification.spec.ts tests/e2e/reflow.spec.ts --project=chromium-1280x720 --workers=1 --reporter=line
npm test
npm run build
git diff --check
git status --short --branch
```

Run WebKit and the wider viewport matrix only for routes touched by a real fix
or during the explicit 60-90 minute stabilization pass. Quote actual results;
timeouts and red gates are findings, not permission to report green.

## Deliverable and stop boundary

Deliver:

1. A severity-ranked result ledger, with blocker/high items first.
2. The exact product fixes and route tests, clearly separated from stale-test
   maintenance.
3. Gate output and any unrun routes stated plainly.
4. One or more small local commits grouped by root-cause fix; no push.
5. A live local server URL for user dogfood.

If the initial 30-minute pass is clean, stop and report that bounded result.
Do not spend another two hours manufacturing exhaustive confidence.

## Copy-paste prompt

```text
Resume C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40 on repair/session-42 at current HEAD b52f6c7. Read both AGENTS.md files, REAL-WORLD-JOURNEYS.md, the canvas-first design/plan, and docs/superpowers/handoffs/2026-08-03-session-42-e2e-repair.md completely before acting. Never push or add a remote.

Treat the product as broken until the real current-UI journeys pass. Sol high is the orchestrator: it owns route reasoning, severity, overlap analysis, review, gates, and stop/commit decisions. Use one Codex 5.3 Spark fast implementation stream for bounded patches only; no concurrent writers. Ponytail full, strict RED/GREEN, no dependencies, App remains sole state/history/persistence/writer owner, and null money remains null.

Begin with the handoff's 30-minute blocker/high pass: landing/orientation; creating in account-first, income-first, and need-first orders; Add-to-Data selection/focus; persistence and background-tab leases; undo/redo; flows; PNG/PDF/SVG export; Present; print; malformed-storage recovery; and 200% zoom. Classify each failure before editing as product defect, stale test, or human product-feel concern. Changing a stale Full form selector to Data is maintenance, not a product fix. If a product route fails, reproduce it, add the smallest failing regression, fix the production root cause, and rerun the full route plus overlapping routes.

Stop after 30 minutes if no blocker/high issue is found. If one is found, continue only through its fix and overlapping proof. The optional next pass is 60-90 minutes to stabilize these as current-UI Playwright journeys and remove stale Full form assumptions. The optional medium pass is 30-45 minutes for long text, punctuation, notes, resize/rotate, rapid actions, narrow layouts, and keyboard navigation. Human-only review owns orientation, confusing copy, hierarchy, product feel, and advisor confidence; automation may capture symptoms but must not certify those judgments.

Run Playwright serially with one worker, one browser project, unique ports, and hard timeouts. Do not add sleeps or weaken assertions. Run npm test, npm run build, git diff --check, and git status before completion. Deliver a severity-ranked evidence ledger, distinguish production fixes from test maintenance, commit locally in small root-cause slices, leave a verified local server URL, and state every unrun route honestly.
```
