# Session 45 - severity-first dogfood report

Date: 2026-08-03
Branch: repair/session-42
Scope: timed high-severity dogfood pass; stop before 30 minutes.

## Passed

- Core unit gate: 28 files, 534 tests.
- Production build: passed.
- Current canvas E2E: 17/17 passed.
- Current Add/Data routes: account-first/income-first transitions and blank-map route passed.
- Export/download: Save Book and map exports passed.
- Present and print media: passed.
- Baseline output controls: passed.
- 200% zoom guidance route: passed.
- Visual suite: 6 passed, 1 skipped.

## Finding

Several older certification/resilience routes still call a `Full form` button that no longer exists in the current canvas-first product. Those routes time out before exercising their intended behavior. This is stale test coverage, not an observed runtime crash; the current replacement is the Data rail/panel. The affected routes should be migrated before relying on them for regression coverage.

## Not observed in this pass

No data loss, wrong selection, export failure, print failure, Present-mode failure, Add-panel crash, or 200% zoom obstruction was reproduced.

The combined Playwright batches exceeded the Windows shell's two-minute command ceiling, so high-severity routes were split into individually attributable runs. Local server remains at http://127.0.0.1:4361.
