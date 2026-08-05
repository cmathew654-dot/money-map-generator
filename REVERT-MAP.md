# S51 Revert Map

Every s51 lane lands as ONE `--no-ff` merge commit on `repair/session-42`. Any lane can be removed alone; any milestone can be restored whole. Design lanes merge LAST, so the "non-ambitious fallback pass" is: revert the design merges, keep the bug fixes.

## Milestone restore (whole-state)

| Tag | State | Restore command |
|-|-|-|
| s51-m0 | Carbon copy of session-50 ship + gate scripts (92e39be) | `git -C C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40 checkout s51-m0` (inspect) or `git revert` back / new branch from tag |

Zip fallback (no git needed): `C:\Users\Cyril\Backups\money-map-s51\s51-m0-92e39be.zip`
Cloud: `backup/s51` branch + `s51-*` tags on origin (push lines given per milestone).

## Lane revert (surgical) — filled at each merge

| Lane | Merge commit | Revert command |
|-|-|-|
| (pending) | | `git revert -m 1 <merge-sha>` |

## Fallback pass recipe

1. `git revert -m 1 <T-PILLS merge>` then `git revert -m 1 <T-FORM merge>` (design lanes only).
2. Suite + gate12 rerun → redeploy. Bug-fix lanes (O-SEL, O-DBL, O-ROT, T-HL, T-RETYPE) stay in.
