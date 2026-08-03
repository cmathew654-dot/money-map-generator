# Session 46 - stale writer lease fix report

Date: 2026-08-03
Branch: repair/session-42

## Issue

An idle/background Money Map tab continued refreshing its browser writer lease, leaving the active tab stuck behind “Another tab is finishing its work.”

## Fix

`src/App.tsx` now flushes and releases the writer lease when the tab becomes hidden, then marks itself non-writer so focus can reacquire ownership later. Visible tabs still retain the lease and takeover protection.

## Verification

- Focused lease/app tests: 11 passed.
- Full unit gate: 28 files, 534 tests passed.
- Production build: passed, 61 modules transformed.

Reload the currently blocked tab once to clear its existing lease. No deploy or push was performed.
