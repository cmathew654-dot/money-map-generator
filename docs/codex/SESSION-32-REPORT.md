# SESSION-32 REPORT — Rapid entry

## What was built

- Reworked every form money input around a local draft and focus snapshot.
  Typing no longer commits transient values; blur and Enter commit
  synchronously only when dirty; Escape reverts; focus selects all; and
  externally changed values are not overwritten by an untouched field.
- Added tiered ArrowUp/ArrowDown money stepping with immediate map feedback:
  $100 normally, $1,000 with Shift, and $10,000 with Alt.
- Extended Enter-as-Tab through enabled selects and added
  `enterKeyHint="next"` to money and text inputs.
- Replaced the separate pending-focus implementations with one internal hook
  used by income presets, account presets, positions, sub-accounts, fine
  print, and notes.
- Added a WAI-ARIA editable combobox with substring matching, emphasized
  matches, eight-result limit, keyboard navigation, free-text entry, and
  mousedown selection that does not blur the input.
- Added practice-wide vocabulary harvesting with case-insensitive frequency
  ranking plus the specified account-type and carrier seeds.
- Wired autocomplete to account names, position labels, sub-account labels,
  income source labels, account captions, and income qualifiers in both full
  form and guided modes.
- Added the required money, vocabulary, form-flow, focus, dirty-check, and
  round-risk regression coverage.

The production-browser pass found one issue that SSR tests could not expose:
React's formatted-to-raw value update collapsed the browser's initial
selection. A post-render layout effect now reapplies select-all, and the
complete browser pass was rerun successfully.

## File-by-file LOC

| File | Final LOC | Session work |
| --- | ---: | --- |
| `src/form/Form.tsx` | 1,303 | MoneyField v2, keyboard flow, shared focus hook, and autocomplete wiring. |
| `src/form/Wizard.tsx` | 261 | Vocabulary prop pass-through to the independently rendered Income and Accounts steps. |
| `src/ui/Autocomplete.tsx` | 146 | New editable APG combobox. |
| `src/model/vocab.ts` | 182 | New seeds, vocabulary harvesting, ranking, dedupe, and suggestion helpers. |
| `src/model/format.ts` | 103 | Added pure `stepMoney`. |
| `src/App.tsx` | 1,257 | Five-line sanctioned memoized vocabulary plumbing. |
| `src/styles/app.css` | 1,683 | One `/* S32 — rapid entry */` block immediately after the form help-text rules. |
| `tests/form.test.ts` | 241 | Enter/select, dirty-check, shared focus, and round-risk tests. |
| `tests/format.test.ts` | 157 | Tier table, off-grid snap, null/floor, and k/m composition tests. |
| `tests/vocab.test.ts` | 184 | Frequency, casing, ordering, substring indices, limit, and empty-query tests. |

`Form.tsx` remains above the repository's ~400 LOC warning threshold at
1,303 lines. It was already 1,118 lines at session start; it was not split
because the session file map did not authorize another form file.
`App.tsx` also remains above that threshold at 1,257 lines; this session only
added the explicitly sanctioned five plumbing lines.

## Browser verification

The production preview ran at `http://127.0.0.1:4321/`. Headless Chrome used
an isolated profile and had both streams redirected before launch:

- `C:\tmp\s32-chrome.stdout.log` — 0 bytes
- `C:\tmp\s32-chrome.stderr.log` — 244 bytes
- `C:\tmp\s32-preview.stdout.log` — 39 bytes
- `C:\tmp\s32-preview.stderr.log` — 0 bytes
- `C:\tmp\s32-check.stdout.log` — 1,004 bytes
- `C:\tmp\s32-check.stderr.log` — 0 bytes

The driver combined DOM/state assertions with screenshots, and every final
screenshot was visually inspected:

| Scenario | Screenshot | SHA-256 |
| --- | --- | --- |
| `85k`, Tab, one map transition to `$85,000` | `C:\tmp\s32-session-32-evidence\01-85k-tab-single-map-update.png` | `f6e3f582420bf666faab99ab1e1afa94a145647022109e6cfea011773d710023` |
| Mid-typing `16` while map retains `$85,000` | `C:\tmp\s32-session-32-evidence\02-mid-typing-map-holds-prior-value.png` | `61602ae24e8def82c5dc5b90daa8c0af2a301b3cf11ac15f49aa1d0262b07aec` |
| Filled raw value selected from index 0 through 5 | `C:\tmp\s32-session-32-evidence\03-filled-money-field-selected.png` | `59e02dd6b4fc53b1117c6ef19455cd436434ce542bd3beebc8d7016d3e68d18d` |
| Shift+ArrowUp live ticks `$16,000`, `$17,000`, `$18,000` | `C:\tmp\s32-session-32-evidence\04-shift-arrow-live-need-steps.png` | `015d1ed9d961d7d5f65131b978b37748136e5204aa2ca581f8b8bdf5fc9c0649` |
| `ja` lists Jackson National with `Ja` emphasized; ArrowDown+Enter selects | `C:\tmp\s32-session-32-evidence\05-jackson-match-emphasized.png` | `a993f786dad4ed39db4ec8b4295eda2907759b1e592e5e53edcac5aabea56613` |
| Client A's Beacon Harbor Account ranks first on client B | `C:\tmp\s32-session-32-evidence\06-cross-client-book-term-ranks-first.png` | `f00c35eabc890f533e40da3f2ef92def2b51dd9cbb129815708a344aff6fda4c` |
| Enter reaches Amount, Period select, then Shown as | `C:\tmp\s32-session-32-evidence\07-enter-walks-input-money-select-input.png` | `a0334fe92df21de1ffe1bb7fa0bb6961693c4c750e871c7e4a51f5d6920d4f4b` |
| Add position focuses the new row's Label input | `C:\tmp\s32-session-32-evidence\08-add-position-focuses-new-row.png` | `e8fe1c79227eb204f4beb45d3db8f3af936afc34011c5f611c6f9f0ec947e1a7` |
| Same-gesture blur/add retains `$123,000` and the new position | `C:\tmp\s32-session-32-evidence\09-round-risk-money-and-position-survive.png` | `add0e74b65e72ff30a7021b843de1d79193ddf3d42d93e1c4679b10cd8311cae` |

## Gates

### `npm run build`

```text
> money-map-generator@0.1.0 build
> tsc -b && vite build

vite v7.3.6 building client environment for production...
transforming...
✓ 55 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                                             0.49 kB │ gzip:  0.31 kB
dist/assets/public-sans-latin-wght-normal-DdeTHZLK.woff2   26.83 kB
dist/assets/public-sans-latin-wght-italic-DGZ7iaiu.woff2   28.29 kB
dist/assets/literata-latin-wght-normal-DLxlUchJ.woff2      52.50 kB
dist/assets/literata-latin-wght-italic-Bm_GJfSc.woff2      53.73 kB
dist/assets/index-8SALuNC5.css                             24.09 kB │ gzip:  5.49 kB
dist/assets/index-CsadEuER.js                             302.90 kB │ gzip: 95.09 kB
✓ built in 734ms
```

### `npm test`

```text
> money-map-generator@0.1.0 test
> vitest run


 RUN  v3.2.7 C:/Users/cmath/projects/mm-wt-s32

 ✓ tests/textfit.test.ts (5 tests) 6ms
 ✓ tests/contrast.test.ts (10 tests) 3ms
 ✓ tests/vocab.test.ts (7 tests) 11ms
 ✓ tests/undo.test.ts (6 tests) 8ms
 ✓ tests/math.test.ts (16 tests) 14ms
 ✓ tests/export.test.ts (3 tests) 4ms
 ✓ tests/filestore.test.ts (3 tests) 5ms
 ✓ tests/format.test.ts (33 tests) 16ms
 ✓ tests/book.test.ts (63 tests) 30ms
 ✓ tests/overrides.test.ts (20 tests) 76ms
 ✓ tests/wizard.test.ts (6 tests) 9ms
 ✓ tests/form.test.ts (12 tests) 33ms
 ✓ tests/layout.test.ts (58 tests) 148ms
 ✓ tests/mapedit.test.ts (29 tests) 71ms

 Test Files  14 passed (14)
      Tests  271 passed (271)
   Start at  01:13:30
   Duration  1.20s (transform 1.92s, setup 0ms, collect 4.44s, tests 432ms, environment 2ms, prepare 2.10s)
```

## Commits

- `59c24d4` — Add rapid money entry keyboard flow
- `4a17e15` — Add practice vocabulary autocomplete
- `a5ec9c1` — Harden focused entry behavior

## Deviations and scope notes

- No dependencies were added, and no MUST NOT TOUCH file or CSS region was
  changed.
- The full optional wiring was completed; the pre-authorized caption /
  “Shown as” trim was not used.
- `Wizard.tsx` needed three prop-only lines rather than the spec's anticipated
  one-line pass-through because the current Wizard renders Income and Accounts
  as separate sections. No Wizard behavior changed.
- The implementation is approximately 979 changed lines (925 additions and 54
  deletions), above the approximate 600–800 budget. The excess is confined to
  the required file map and is primarily the explicit regression fixtures and
  required pure vocabulary implementation.
- Exact current free text is suppressed from its own suggestion list. Without
  this, the active client's just-typed partial value would be harvested into
  the memoized book vocabulary and incorrectly outrank the established term
  from another client.

## Noticed but not done

No out-of-scope changes were made. Temporary browser driver, isolated Chrome
profiles, logs, and screenshots remain under `C:\tmp`; none were added to the
repository.
