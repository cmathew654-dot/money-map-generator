# Session 41 Report

**Date:** 2026-08-02
**Branch:** `repair/session-41`
**Base commit:** `e12408567f49f642366395b347b89e6667f252f6`

## Outcome

Fixed the shared production regression behind inert Tidy/Reset/Clear actions and delayed field rendering.

`MapSvg` kept its last drag-preview snapshot after pointer-up. The form, canonical book, autosave, Reset, Clear, and Tidy all updated correctly, but rendering continued to prefer that stale snapshot. A later canvas drag rebuilt the preview from current canonical data, producing the destructive-looking collapse and making the Salary edit appear all at once.

The fix clears the temporary preview when a drag finishes. It is one production line in the shared drag lifecycle. No dependency, state framework, persistence layer, or UI redesign was added.

## Reproduction and root-cause evidence

- Actual Chrome and Windows app control both launched successfully in the narrowly rooted session; sandbox error 1344 did not recur.
- Before the fix, actual Chrome reproduced the reported sequence in isolated local state:
  - Tidy removed the stored override but left the SVG at its dragged coordinates.
  - Reset showed `Arrangement reset` and removed the stored override but left the SVG at its dragged coordinates.
  - Clear showed `Map cleared — Undo brings it back` and cleared canonical state while the old populated SVG remained visible.
  - Salary / Wages committed on input, but the old SVG remained visible.
  - The next Income Sources drag rebuilt the preview from canonical state, making the already-cleared map and Salary `$5,000 mo.` appear together.
  - Reload retained the cleared-plus-Salary state; stale autosave did not resurrect old content.
- The public demo does not use writer leases. Existing real-mode lease tests confirm one active writer and prevent passive-tab commits. Writer ownership was not causal.
- `git blame` traces the incomplete preview lifecycle to `b001ed9f`; the recent editor/canvas repairs exposed it but did not introduce it.

## Implementation

| Absolute path | Change | LOC |
| --- | --- | --- |
| `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\src\render\MapSvg.tsx` | Modified: clear `previewData` in `finishDrag` | +1 / -0; 2,897 total |
| `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\tests\e2e\interaction-regression.spec.ts` | Modified: exact Tidy and shared state regressions in Chromium/WebKit | +139 / -13; 758 total |
| `C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40\docs\codex\SESSION-41-REPORT.md` | Added: required session report | 120 lines |

## Failing tests before production edit

```text
2 failed
Tidy: stored override was undefined, but SVG received x=450 y=490 instead of x=390 y=459.
Reset: stored state reset, but SVG received x=87 y=141 instead of x=48 y=118.
```

Both failures proved that canonical state was correct while the rendered drag preview was stale.

## Gate outputs

### Focused Chromium regression

```text
Running 2 tests using 1 worker
ok 1 ... Tidy map is one undoable action after a manual move (2.9s)
ok 2 ... drag preview yields to reset, clear, Salary edits, and reload (3.0s)
2 passed (13.5s)
```

### Focused WebKit regression

```text
Running 2 tests using 1 worker
ok 1 ... Tidy map is one undoable action after a manual move (3.6s)
ok 2 ... drag preview yields to reset, clear, Salary edits, and reload (5.8s)
2 passed (17.0s)
```

### Affected Chromium/WebKit resilience checks

```text
Running 12 tests using 1 worker
12 passed (28.0s)
```

### Unit tests

```text
Test Files  28 passed (28)
Tests       498 passed (498)
Duration    2.16s
```

### Production build

```text
vite v7.3.6 building client environment for production...
58 modules transformed.
dist/assets/index-7ojRiCNn.css  29.81 kB | gzip: 6.79 kB
dist/assets/index-CgExLaoa.js  373.41 kB | gzip: 115.42 kB
built in 880ms
```

### Diff integrity

```text
git diff --check
exit 0
```

## Actual Chrome verification after the fix

In a fresh isolated real-mode origin on port 43147:

- Tidy visibly returned the moved Income Sources card to its automatic position, became disabled, and the automated Undo check restored the move.
- Reset immediately restored the generated arrangement and remained reset after reload.
- Changing Social Security to 5000 immediately rendered `$5,000 mo.` without another canvas interaction.
- Clear immediately removed all sample accounts and income despite the preceding field edit.
- Adding Salary / Wages at 5000 immediately rendered `$5,000 mo.`.
- The cleared-plus-Salary state remained intact after further interaction and reload.

The final Windows app-control screenshot request timed out waiting for app approval and was stopped. This was runner setup, not an app assertion; actual Chrome control remained healthy. A fresh Windows capture will be attempted once after deployment, without polling.

## Deviations and justified additions

- No `SESSION-41.md` file was created because the owner supplied the session scope directly and prohibited extra ceremony.
- This new report is the sole `docs/codex` addition and is required by `AGENTS.md`; no existing protected document was edited.
- No visual baseline run was needed because the steady-state UI and CSS did not change. The regression checks assert the visible SVG coordinates directly.
- GitHub certification, merge, Pages deployment, asset fingerprints, and the adversarial live smoke occur after this report is committed; their receipts belong to the pull request and final handoff so the certified SHA is not changed afterward.

## Not changed

After clearing while an inline map label was selected, the selection inspector can remain visible with a generic label until focus changes. It does not retain or restore financial content and is not caused by the stale drag preview, so it was recorded rather than folded into this root-cause patch.
