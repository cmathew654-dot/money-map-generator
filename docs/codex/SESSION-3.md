# SESSION-3 — Print, PNG export, sample clients (M4)

Read `AGENTS.md` first. SESSION-2 delivered the live form + client book.
This is the last implementation session: export paths and demo content.

**Do not touch** `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
`src/render/tokens.ts`, `src/form/Form.tsx`. Existing tests may only change
where this spec says so.

## Files this session

```
src/styles/print.css     NEW — letter-landscape, map-only print
src/export/export.ts     EXTEND — PNG export + filename helper
src/model/samples.ts     EXTEND — two more fictional sample clients
src/model/book.ts        TOUCH ONLY newBook()
src/App.tsx              EXTEND — Print + Export PNG buttons, print container
src/styles/app.css       EXTEND — button styles if needed
tests/book.test.ts       UPDATE only the newBook expectations
tests/export.test.ts     NEW — filename helper
```

## Print (`src/styles/print.css`, imported from App)

- `@page { size: letter landscape; margin: 0.25in }`.
- In `@media print`: hide the header, form pane, and screen preview
  entirely; show a dedicated print-only container (rendered by App next to
  the preview, `display: none` on screen) holding one full-artboard
  `<MapSvg>` of the ACTIVE client, scaled to fill the printable width,
  centered. Nothing else prints — no scrollbars, no second page (verify:
  `page-break-inside: avoid`, height fits).
- Header gains a `Print` button → `window.print()`.

## PNG export (`src/export/export.ts`)

- `mapFileName(title: string | undefined, year: string): string` — pure:
  `"<title> — Money Map <year>.png"`, fallback title `Client`, strip
  characters illegal in Windows filenames (`\ / : * ? " < > |`), collapse
  whitespace. Unit-test this in `tests/export.test.ts` (illegal chars, empty
  title, long title trimmed to ≤ 120 chars).
- `exportPng(svg: SVGSVGElement, fileName: string): Promise<void>`:
  1. `cloneNode(true)` the SVG; set explicit `width`/`height` attrs from the
     1320×1020 viewBox.
  2. Fetch the four `/fonts/*.woff2`, base64-encode, inject a `<style>` in
     `<defs>` with the four `@font-face` rules using `data:font/woff2;base64`
     URLs — without this the rasterized PNG falls back to system fonts.
  3. Serialize with `XMLSerializer`, make a `Blob` URL, draw onto a canvas at
     2× (2640×2040) via an `Image`, `canvas.toBlob('image/png')`, download
     via `a[download]`, revoke both URLs.
- Header gains an `Export PNG` button wired to the ACTIVE client's rendered
  print-container SVG (full artboard, not the scaled screen preview).

## Two more sample clients (`src/model/samples.ts`)

`SAMPLE_CALLOWAY` — exercises postNote, cash-at-home, the note card, and a
nested sub-account:

- id `sample-calloway`; title `The Calloway Family`, year `2026`, variant
  `postNote`, postNoteLabel `April 2026`
- income: `Real Estate Income` 21000/mo Gross · `Union Pension` 1200/mo
  Gross · `Social Security` 3100/mo Gross; afterTaxIncome 17000;
  monthlyNeed 30000; asNeededAmount 20000
- accounts: cash `Cash at Home` 450000 · shortTerm `Short-Term Account`
  520000 caption `Earmarked taxes and 2-3 years' worth of income needs`,
  inWaterfall · afterTax `Trust Account` 4900000 caption `Target 70-80%
  Equities — Tax-Managed`, inWaterfall · taxDeferred `IRA — Marcus` 2650000
  caption `Most Aggressive Allocation`, inWaterfall, subAccounts
  [`Short-Term Account`, 110000] · taxPreferred `Cash-Value Life Insurance`
  350000 · charitable `Donor-Advised Fund` 160000 · note `5-Year
  Installment Note` 185000 caption `Through Feb 2027 — $92K pre-tax annual`
- footnotes: [`Marcus 2026 RMD`, 89000, 67000]

`SAMPLE_VENKAT` — exercises blanks-heavy early-retiree shape and positions:

- id `sample-venkat`; title `Sam & Priya Venkat`, year `2026`, variant
  `annual`
- income: `Rental Income` 26000/mo Gross · `Eventual Social Security`
  null/mo; afterTaxIncome null; monthlyNeed 13000; asNeededAmount null
- accounts: shortTerm `Short-Term Bucket` 18000 caption `2-3 years' worth
  of income needs`, inWaterfall · cash `Cash Accounts` 1450000 ·
  afterTax `Trust After-Tax Account` 690000 caption `Concentrated holding`,
  inWaterfall, positions [`S&P 500 Index`, 495000] · afterTax `Brokerage —
  Individual Stocks` 720000 · taxDeferred `IRAs — Most Aggressive` 2100000
  caption `70% Equity Allocation`, inWaterfall · charitable `Family
  Charitable Fund` 140000
- footnotes: []

`newBook()` now returns `[SAMPLE_WHITFIELD, SAMPLE_CALLOWAY, SAMPLE_VENKAT,
blankClient()]`. Update the `newBook` test expectations accordingly (this is
the ONLY existing-test change allowed).

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Manual verification via dev server, then describe: switch to each sample —
  no layout crash, waterfall arrows sane, note card renders; Export PNG
  downloads and the PNG opens with correct serif figures (check a real
  decode, e.g. draw it back or confirm non-trivial byte size and open it if
  your environment allows); print preview shows exactly one landscape page
  with only the map (describe how you checked, e.g. Chrome `--print-to-pdf`).
- Clear-localStorage note: existing browsers hold a SESSION-2 book; state
  in the report that users with an old autosave won't see the new samples
  until they Load or reset — do NOT add migration code.
- Commit in logical steps; `docs/codex/SESSION-3-REPORT.md`; LOC budget
  ≈ 350–550.
