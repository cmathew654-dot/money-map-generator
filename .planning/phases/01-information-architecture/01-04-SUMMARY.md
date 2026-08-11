---
phase: 01-information-architecture
plan: 04
subsystem: ui
tags: [react, forms, typescript, information-architecture, naming]

requires: [01-03]
provides:
  - "'after-tax' names exactly one concept (the household income total); the account-type bucket is 'Taxable' and the fine-print help line says 'net'"
  - "As-needed withdrawal panel label matches the phrase the map prints"
affects: [02-flow, 04-verify]

actuals:
  tokens: 8500
  tasks: 1
  commits: 2

tech-stack:
  added: []
  patterns: []

key-files:
  created: []
  modified:
    - src/model/book.ts
    - src/model/format.ts
    - src/render/tokens.ts
    - src/form/Form.tsx
    - tests/format.test.ts
    - tests/e2e/interaction-regression.spec.ts
    - tests/e2e/visual.spec.ts

key-decisions:
  - "Cyril's ruling (2026-08-09, verbatim, recorded below): household total keeps 'After-Tax Income' unchanged; account-type bucket becomes 'Taxable'; fine-print help line loses the term."
  - "Task 1 inventory (orchestrator-run, recorded below) corrected the plan's cost model: renaming the account-type bucket does not ripple through ~10 test files as implied — only format.test.ts:18 asserts the bucket label; the other 9 files match user-authored account names/qualifier values (book data), untouched."
  - "Form.tsx's two edits (as-needed label at line 512, fine-print help text at line 1268) were split across the two commits with git add -p so each commit matches its stated purpose exactly: the fine-print wording change rode with the naming-ruling commit (it is one of the ruling's two losing concepts), the as-needed label rode with the IA-06 commit."

patterns-established: []

requirements-completed: [IA-05, IA-06]

coverage:
  - id: D1
    description: "Account-type bucket renamed across all three sites (book.ts, format.ts, tokens.ts) in one commit; stored enum value untouched"
    requirement: "IA-05"
    verification:
      - kind: unit
        ref: "tests/format.test.ts#account display names > names the afterTax bucket (Taxable)"
        status: pass
      - kind: manual
        ref: "git diff src/model/book.ts shows label-only change, value 'afterTax' untouched (T-01-08 evidence, pasted below)"
        status: pass
    human_judgment: false
  - id: D2
    description: "As-needed panel label matches the phrase MapSvg.tsx prints"
    requirement: "IA-06"
    verification:
      - kind: e2e
        ref: "tests/e2e/visual.spec.ts:176 selected account/arrow/note/calculated-text spec, chromium-1440x900"
        status: pass
      - kind: e2e
        ref: "tests/e2e/interaction-regression.spec.ts:993 (parked-red spec; locator realigned, not unparked)"
        status: not-run-parked
    human_judgment: false

duration: 25min
completed: 2026-08-09
status: complete
---

# Phase 1 Plan 04: After-Tax Naming Ruling and As-Needed Label Alignment Summary

**Account-type bucket "After-tax" renamed to "Taxable" across its three panel-and-map sites in one commit (stored value `afterTax` untouched); the fine-print help line reworded to "net"; the as-needed withdrawal panel label realigned from "Monthly account withdrawal" to the phrase the map already prints, "As needed" — both e2e locators updated to match.**

## Task 1: Rename Blast-Radius Inventory (orchestrator-run, verbatim)

| Concept | What it is | Source sites | Tests asserting it | Prints on map? |
|-|-|-|-|-|
| A — "After-Tax Income" | Household income total | 9 sites / 6 files: Form.tsx:661, layout.ts:420, layout.ts:476, layout.ts:2884, layout.ts:2890, MapInspector.tsx:153, MapTextEditor.tsx:769, export.ts:39, App.tsx:2498 | 3: export.test.ts:108, layout.test.ts:1485, mapedit.test.ts:257 | Yes — headline label; layout.ts:420 measures the literal string for width math |
| B — "After-tax" | Account-type bucket | 3: book.ts:58 (option label), format.ts:9 (bucket display map), tokens.ts:51 (map tag) | 1: format.test.ts:18 `['afterTax', 'After-Tax']` | Yes — bucket tag prints on account shapes |
| C — "the after-tax amount" | One fine-print help line | 1: Form.tsx:1268 | 0 | No |

**Cost-model correction (recorded per plan's instruction):** the plan implied renaming the account-type bucket would ripple through ~10 test files. It does not. Nine of those files match on user-authored account NAMES in fixtures ("Managed After-Tax Trust") and qualifier VALUES ("Gross, After-Tax") — book data, not the bucket label — and were correctly left untouched. Only `format.test.ts:18` asserts the bucket label itself.

## Task 2: Cyril's Ruling (verbatim, 2026-08-09)

1. Option `keep-total`: the household income total KEEPS the term. "After-Tax Income" is unchanged everywhere. Concept A sites untouched — no layout width re-measurement, no map output change for the total.
2. The account-type bucket LOSES the term and becomes "Taxable".
3. The fine-print help line LOSES the term.

## Task 3: Applied Renames

- `src/model/book.ts:58` — `label: 'After-tax'` -> `label: 'Taxable'`. Stored value `'afterTax'` unchanged (T-01-08).
- `src/model/format.ts:9` — `afterTax: 'After-Tax'` -> `afterTax: 'Taxable'` (key unchanged).
- `src/render/tokens.ts:51` — `tag: 'After-Tax'` -> `tag: 'Taxable'`.
- `src/form/Form.tsx:1268` — "The after-tax amount appears in green." -> "The net amount appears in green."
- `src/form/Form.tsx:512` — `label="Monthly account withdrawal"` -> `label="As needed"`; existing help line kept beneath it unchanged.

Test realignment (one line each, per plan's requirement):
- `tests/format.test.ts:18` — `['afterTax', 'After-Tax']` -> `['afterTax', 'Taxable']`. Deliberate realignment citing IA-05.
- `tests/e2e/interaction-regression.spec.ts:993` — `getByLabel('Monthly account withdrawal')` -> `getByLabel('As needed')`. Deliberate realignment citing IA-06. Explicit 5000ms timeouts added on `.fill()`/`.press()`.
- `tests/e2e/visual.spec.ts:176` — same locator change. Deliberate realignment citing IA-06. Explicit 5000ms timeouts added on `.fill()`/`.press()`.

No Concept A site touched. No fixture account name or qualifier value touched. No `test.skip` used.

## Verification

**Unit tests — `npm run test`:**
```
Test Files  61 passed (61)
     Tests  813 passed (813)
```
All suites passed, including `format.test.ts` with the realigned expectation. `layout.test.ts`, `mapedit.test.ts`, `export.test.ts` (the candidates the plan flagged) required no changes — confirmed by the task 1 inventory, since none assert Concept B.

**Build — `npm run build`:**
```
✓ 66 modules transformed.
dist/assets/index-hZe-xaxP.js   415.41 kB │ gzip: 128.49 kB
✓ built in 1.83s
```
Passed, no type errors.

**Playwright — `npx playwright test tests/e2e/visual.spec.ts --project=chromium-1440x900`:**
Ran headless, never `--headed`. Chose `chromium-1440x900` over `chromium-1280x720`: the snapshot directory (`tests/e2e/visual.spec.ts-snapshots/`) has baselines for `selected-note`, `selected-account`, and `selected-arrow` (the spec block containing the as-needed edit, line 176) only at 1440x900 — no 1280x720 baseline exists for that block. This also matches the plan's own `<verify>` command exactly.

Result: 5 passed, 2 failed.
- **Passed** — `selected account, arrow, note, and calculated text` (the spec containing the realigned `asNeeded` locator, line 176), `wizard`, `present`, `tidy reports the grid alignment`, `data panel overlays and scrolls at narrow zoomed viewport`.
- **Failed** — `editor` and `editor with map inspector`. Diff inspection (screenshots read directly) shows two categories of pixel difference: (1) the map's account-type tag now reads "TAXABLE" instead of "AFTER-TAX" — this is the intended, correct consequence of this plan's rename, not a defect; (2) the Income section's field layout differs (a Qualifier column and "Printed beside the amount on the map — e.g. Gross." caption present in the current build but absent from the stored baseline, plus a missing "Something else" chip and "After-Tax Income" section header in the current render vs. baseline). Category 2 predates this plan: `01-03-SUMMARY.md` documents `Form.tsx`'s Income-section field structure changing under plan 01-03 (fine-print relocation, filter zero-results copy), and these two baselines were never regenerated after that landed. This plan's frozen scope forbids CSS/layout/styling changes and does not authorize regenerating baselines — recording the observed failure plainly per the plan's instruction rather than fixing it. Disposition (baseline regeneration) belongs to Phase 4 verification, same as the parked-red e2e set.

**T-01-08 mitigation evidence — `git diff src/model/book.ts` (label-only change, value untouched):**
```diff
diff --git a/src/model/book.ts b/src/model/book.ts
index f487b1f..00040ff 100644
--- a/src/model/book.ts
+++ b/src/model/book.ts
@@ -55,7 +55,7 @@ export const ACCOUNT_TYPE_OPTIONS: readonly {
   label: string
 }[] = [
   { value: 'shortTerm', label: 'Short-term' },
-  { value: 'afterTax', label: 'After-tax' },
+  { value: 'afterTax', label: 'Taxable' },
   { value: 'taxDeferred', label: 'Tax-deferred' },
   { value: 'taxPreferred', label: 'Tax-preferred' },
   { value: 'charitable', label: 'Charitable' },
```

## Parked-Red Baseline Observed

`tests/e2e/interaction-regression.spec.ts` is one of the 6 pre-existing parked-red specs (per the plan's stated baseline). Its locator was realigned to `getByLabel('As needed')` per IA-06, matching the parallel edit in `visual.spec.ts`. It was not run as part of this plan's verification (not unparked, not chased) — its disposition remains Phase 4 (VERIFY-02) as the plan directs.

## Task Commits

1. `78f879e` — `refactor(labels): apply after-tax naming ruling across panel and map` — `book.ts`, `format.ts`, `tokens.ts`, `format.test.ts`, and the fine-print help-text hunk of `Form.tsx`.
2. `1883b15` — `refactor(form): align as-needed panel label with printed map phrase` — the as-needed label hunk of `Form.tsx`, `interaction-regression.spec.ts`, `visual.spec.ts`.

## Deviations from Plan

**1. [Rule 3 - blocking issue] Stray leftover preview server on port 4187**
- **Found during:** Playwright verification step
- **Issue:** A previous session's `vite preview` process (PID 23968) was still bound to port 4187, causing Playwright's webServer startup to fail with "already used."
- **Fix:** Identified the process via `netstat`/`tasklist`, confirmed it was an orphaned `node.exe` preview server, killed it, re-ran the test.
- **Files modified:** None (environment only).
- **Commit:** N/A (no source change).

No other deviations. Plan executed per the frozen scope; no architectural changes, no new packages, no CSS/layout edits.

## Known Stubs

None.

## Threat Flags

None. No new source/network/auth surface introduced — this plan is a pure rename across existing, already-reviewed sites. T-01-08, T-01-09, and T-01-10 (the plan's own threat register entries) are the mitigations documented above, not new flags.

## Self-Check: PASSED

- FOUND: src/model/book.ts (label 'Taxable', value 'afterTax' unchanged)
- FOUND: src/model/format.ts (afterTax: 'Taxable')
- FOUND: src/render/tokens.ts (tag: 'Taxable')
- FOUND: src/form/Form.tsx (label="As needed"; "The net amount appears in green.")
- FOUND: tests/format.test.ts (`['afterTax', 'Taxable']`)
- FOUND: tests/e2e/interaction-regression.spec.ts (getByLabel('As needed'))
- FOUND: tests/e2e/visual.spec.ts (getByLabel('As needed'))
- FOUND commit 78f879e in `git log --oneline`
- FOUND commit 1883b15 in `git log --oneline`

## User Setup Required

None.

## Next Phase Readiness

- IA-05 satisfied: "after-tax" now names exactly one concept (the household income total, "After-Tax Income," unchanged per Cyril's ruling); the account-type bucket is "Taxable" and the fine-print help line no longer uses the term.
- IA-06 satisfied: the as-needed withdrawal panel label reads as the phrase the map prints ("As needed"), realigned in both e2e locators that reference it.
- Roadmap Phase 1 success criteria 5 and 6 are TRUE.
- Two visual baselines (`editor`, `editor with map inspector`) are stale from plan 01-03's Income-section layout change, unrelated to this plan's edits — flagged for Phase 4 baseline regeneration, not fixed here (out of frozen scope).
- `interaction-regression.spec.ts` remains parked red per the existing 6-spec baseline; disposition is Phase 4 (VERIFY-02).

---
*Phase: 01-information-architecture*
*Completed: 2026-08-09*
