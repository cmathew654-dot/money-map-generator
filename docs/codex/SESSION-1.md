# SESSION-1 — Model, layout engine, renderer, static sample (M1+M2)

Read `AGENTS.md` at repo root first. It is law. This prompt is the entire
scope of this session.

## Context (you have none — read carefully)

Financial advisors hand-build "Money Map" one-pagers in PowerPoint: a client's
income sources, accounts drawn as cylinders color-coded by tax bucket, and a
monthly income need, connected by dotted green arrows showing how money flows
and refills. This repo replaces that with a generator: structured data in, a
generated SVG map out. The scaffold (Vite + React 19 + TS, fonts in
`public/fonts/`) already exists and builds. There is NO canvas, NO drag, NO
editing on the map itself — the map is pure output.

This session builds the static render path: domain model → pure layout →
SVG component, rendering one hardcoded sample client. A form and multi-client
file management come in later sessions — do not build them.

**Visual mandate:** the PowerPoint originals look ancient. You are building a
*highly upgraded* version of the same grammar: flat, crisp, editorial, print-
grade. No gradients, no drop shadows, no glow, no rounded-corner-soup. Depth
comes from tinted flat fills, hairlines, and typography. Think financial
broadsheet, not slide deck.

## The visual grammar you are reproducing (modernized)

One page, letter-landscape. Regions:

- **Masthead** top-left: client title (serif, large), a tracked-out small
  label `MONEY MAP 2026` (or `MONEY MAP — POST NOTE — APRIL 2026` for the
  postNote variant), and a full-width hairline rule beneath.
- **Income Sources panel** left column: card listing income line items
  (label + amount per month/year + qualifier like "Gross"), then a
  double-rule and an "After-Tax Income" total.
- **Monthly Income Need card** bottom-left: the one loud moment on the page —
  a red dollar figure. Everything else stays quiet.
- **Account cylinders** center + right: classic database-drum silhouette
  (ellipse cap, straight sides, bottom arc). Color-coded by tax bucket via
  stroke + light tint fill. Short-term bucket is *dashed* stroke. Inside a
  cylinder, top to bottom: tiny uppercase bucket tag, title, optional italic
  caption, optional **position rows** (label left / value right, hairline
  separators — holdings of note), the dollar value (serif, tabular), and
  optionally one **inset sub-account cylinder** (a smaller dashed drum seated
  in the lower body — e.g. short-term funds earmarked inside an IRA for RMDs).
- **Note card** (bucket `note`): rounded rect, not a drum — e.g. an
  installment note.
- **Arrows**, all in flow green: the *refill waterfall* — dotted beziers
  arcing right-to-left across cylinder tops (tax-deferred → after-tax trust →
  short-term bucket); a dashed drop from the income panel down to the need
  card; a dashed diagonal from the short-term cylinder to the need card
  carrying the label "Monthly Income as Needed" + amount.
- **Footnote lines** bottom-center: e.g. `Jordan 2026 RMD: $96,500 → $74,300
  after withholding`, with the net figure in green.
- A `null` dollar value ANYWHERE renders as the blank `~$ ______` — advisors
  fill these in live. Blanks are a feature (AGENTS.md rule 6).

## Files to create (this session, exactly these)

```
src/main.tsx               mount
src/App.tsx                renders the sample map centered on a gray page (temporary shell)
src/model/types.ts         VERBATIM below
src/model/format.ts        VERBATIM below
src/model/samples.ts       the sample client literal below + `blankClient()` factory
src/layout/layout.ts       pure: MoneyMapData → MapLayout (positioned boxes + svg path strings)
src/render/tokens.ts       VERBATIM below
src/render/MapSvg.tsx      the one SVG component tree; consumes MapLayout + tokens only
src/styles/app.css         @font-face (4 woff2 in /fonts/), page shell
tests/format.test.ts
tests/layout.test.ts
```

## Verbatim files

`src/model/types.ts`:

```ts
/**
 * Domain model. A "book" file holds every client's map (designed for 100–200
 * clients in one JSON file). All dollar values are `number | null`:
 * null renders as the fill-in blank "~$ ______" on the map, on purpose —
 * blanks get captured live in client meetings.
 */

export type Bucket =
  | 'shortTerm' // dashed ink cylinder — 2-3 years of income needs
  | 'afterTax' // gold — trust / managed after-tax
  | 'taxDeferred' // blue — IRA / 401k
  | 'taxPreferred' // light blue — Roth, cash-value life
  | 'charitable' // purple — DAF / charitable fund
  | 'cash' // neutral — cash at bank / at home
  | 'note' // rounded card, not a cylinder — e.g. installment note

export interface Position {
  label: string
  value: number | null
}

export interface SubAccount {
  label: string
  caption?: string
  value: number | null
}

export interface Account {
  id: string
  bucket: Bucket
  label: string
  value: number | null
  /** small italic line under the label — allocation notes, "2-3 years' worth…" */
  caption?: string
  /** ruled label/value rows inside the cylinder — holdings of note */
  positions?: Position[]
  /** nested earmarked pool drawn as an inset cylinder — e.g. RMD short-term funds */
  subAccounts?: SubAccount[]
  /** participates in the right-to-left refill chain of dotted arrows */
  inWaterfall: boolean
}

export interface IncomeSource {
  label: string
  amount: number | null
  period: 'mo' | 'yr'
  /** e.g. "Gross", "After-Tax" — rendered after the amount */
  qualifier?: string
}

export interface Footnote {
  label: string // e.g. "Dan 2026 RMD"
  gross: number | null
  net: number | null // after withholding — rendered in green
}

export interface MoneyMapData {
  id: string
  client: {
    title: string // "Jordan & Dana Whitfield"
    year: string // "2026"
    variant: 'annual' | 'postNote'
    postNoteLabel?: string // "April 2026" when variant is postNote
  }
  incomeSources: IncomeSource[]
  afterTaxIncome: number | null // the income box total line
  monthlyNeed: number | null // the red number
  asNeededAmount: number | null // "Monthly Income as Needed" arrow label
  accounts: Account[]
  footnotes: Footnote[]
}

/** The whole practice in one file. */
export interface MoneyMapFile {
  fileType: 'money-map-book'
  version: 1
  clients: MoneyMapData[]
}

let counter = 0
/** Collision-proof-enough id for in-file entities. */
export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}
```

`src/model/format.ts`:

```ts
/** Pure formatting helpers. null → the fill-in blank, by design. */

export const BLANK = '~$ ______'

/** $1,600,000 — approximate marker optional. */
export function money(value: number | null, opts?: { approx?: boolean }): string {
  if (value === null || Number.isNaN(value)) return BLANK
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const whole = Math.round(abs)
  const grouped = whole.toLocaleString('en-US')
  return `${opts?.approx ? '~' : ''}${sign}$${grouped}`
}

/** For income rows: "$3,000 mo." / "$25,000 yr." */
export function moneyPer(value: number | null, period: 'mo' | 'yr'): string {
  if (value === null) return BLANK
  return `${money(value)} ${period}.`
}

/** Wrap text to lines of at most `max` chars, breaking on spaces. Pure; used by layout. */
export function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= max || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}
```

`src/render/tokens.ts`:

```ts
/**
 * Every color, size, and type decision on the map lives here.
 * This file is the designer swap point — change values, not code.
 */

/** Exact US-letter landscape ratio (11 × 8.5) so print fills the page. */
export const ARTBOARD = { width: 1320, height: 1020 }

export const PAPER = '#fcfcfa'
export const INK = '#1c2422'
export const MUTED = '#5b6663'
export const HAIRLINE = '#dde1dc'

/** The one loud number on the page. */
export const NEED_RED = '#c43d2e'
/** Income + flow green. */
export const FLOW_GREEN = '#1e7a4a'

export interface BucketStyle {
  stroke: string
  tint: string // body fill
  capTint: string // top ellipse fill, slightly deeper than body
  dashed?: boolean
  tag: string // tiny classification label rendered above the title
}

export const BUCKETS: Record<string, BucketStyle> = {
  shortTerm: { stroke: '#2a3230', tint: '#ffffff', capTint: '#f1f3f0', dashed: true, tag: 'Short-Term Bucket' },
  afterTax: { stroke: '#b98a1e', tint: '#fdf8ec', capTint: '#f7ecd2', tag: 'After-Tax' },
  taxDeferred: { stroke: '#2f6bab', tint: '#f2f7fc', capTint: '#e0ecf7', tag: 'Tax-Deferred' },
  taxPreferred: { stroke: '#6fa7d4', tint: '#f6fafd', capTint: '#e9f2fa', tag: 'Tax-Preferred' },
  charitable: { stroke: '#6b4fa0', tint: '#f7f4fb', capTint: '#ece6f6', tag: 'Charitable' },
  cash: { stroke: '#59645f', tint: '#f6f7f5', capTint: '#eceeea', tag: 'Cash' },
  note: { stroke: '#6b4fa0', tint: '#fbfaf6', capTint: '#fbfaf6', tag: 'Note' },
}

export const FONT_SERIF = "'Literata', Georgia, serif"
export const FONT_SANS = "'Public Sans', 'Segoe UI', sans-serif"

export const TYPE = {
  masthead: 30,
  mastheadLabel: 13,
  panelHeader: 15,
  accountTitle: 16,
  accountTag: 10.5,
  caption: 12,
  value: 21,
  subValue: 15,
  row: 12.5,
  needLabel: 13,
  needValue: 30,
  footnote: 13,
  arrowLabel: 12.5,
}
```

## Layout spec (`src/layout/layout.ts`)

Pure functions only — no React, no DOM. Deterministic slot template, NOT a
graph layout. Export a `layoutMap(data: MoneyMapData): MapLayout` plus the
types below (shape may be refined, but stay in this spirit):

```ts
interface Placed { x: number; y: number; w: number; h: number }
interface PlacedAccount extends Placed { account: Account; capRy: number }
interface Arrow { kind: 'waterfall' | 'income' | 'asNeeded'; d: string; labelAt?: { x: number; y: number } }
interface MapLayout {
  artboard: { width: number; height: number }
  income: Placed
  need: Placed
  accounts: PlacedAccount[]
  arrows: Arrow[]
  footnotesAt: { x: number; y: number }
}
```

Slot columns on the 1320×1020 artboard (page margin 48):

| Slot | x | w | contents, stacking from y |
|---|---|---|---|
| left | 48 | 280 | income panel from y=150; need card w=250 h≈170 anchored at y≈680 |
| center | 390 | 250 | `cash` accounts (compact, h≈120) from y=150, then `shortTerm` (min h 250), then `note` cards |
| trust | 700 | 260 | `afterTax` accounts from y=190 |
| far | 1020 | 260 | `taxDeferred` from y=150, then `taxPreferred`, then `charitable` |

- Vertical gap between stacked accounts in a column: 28.
- Account height is computed from content: cap ellipse `capRy = round(w * 0.13)`
  top and bottom, plus tag (16) + wrapped title lines (20 each, wrap at ~24
  chars) + wrapped caption lines (15 each, wrap at ~30 chars) + position rows
  (20 each + 8 padding) + value line (34) + sub-account block (each ≈ 96) +
  paddings. Clamp to the minimums above. Use `wrap()` from format.ts so tests
  and renderer agree.
- Income panel height: header 44 + 40 per source + 14 (divider zone) + 46
  (total row) + padding.
- If a column's stack would run past y=890 (footnote strip starts ≈ 920),
  compress that column's gaps to 16, then proportionally shrink its account
  body heights (never below 120). Happy path assumes ≤ 8 accounts.
- Footnotes at x=390, y=930, one line per footnote, 24 apart.

Arrows (compute full SVG path `d` strings here):

- **waterfall**: order the `inWaterfall` accounts [taxDeferred…, afterTax…,
  shortTerm…] (bucket order, then top-to-bottom). For each adjacent pair
  (source right → target left): start at source top (x + w·0.35, y), end at
  target top (x + w·0.65, y − 4), cubic bezier with both control points ~70
  above the higher of the two tops, so the arc clears both caps.
- **income**: from income panel bottom-center straight down to need card
  top-center minus 6.
- **asNeeded**: from the short-term cylinder's lower-left edge
  (x, y + h·0.72) to the need card's right edge (x + w + 6, y + h·0.45),
  gentle quadratic sag. `labelAt` ≈ 40% along, offset 18 above the line.

## Renderer spec (`src/render/MapSvg.tsx`)

One exported component `MapSvg({ data }: { data: MoneyMapData })` → calls
`layoutMap`, renders a single `<svg viewBox="0 0 1320 1020">` with:

- Paper background + inset hairline page frame (rect at 24,24 → 1272×972,
  stroke HAIRLINE).
- Masthead (drawn from data.client, not from layout): title in Literata 600
  at 30px at (48, 84); to its right-baseline or beneath, the tracked label
  `MONEY MAP 2026` / `MONEY MAP — POST NOTE — APRIL 2026` in Public Sans
  13px, letter-spacing ~2.5px, uppercase, MUTED; hairline rule across
  1320−96 at y=118. No pill, no banner, no background fill.
- Income panel: white card (rx 10, stroke HAIRLINE 1.5), header
  `INCOME SOURCES` small-caps-style (uppercase, tracked, FLOW_GREEN) with a
  short 28px green rule under it; per source: label (Public Sans 13, INK) and
  a second line `$2,400 mo. Gross` (amount in Literata 600 14, qualifier in
  MUTED); then a double hairline (two rules 3px apart) and total row
  `After-Tax Income` + value (Literata 600 16, FLOW_GREEN). Blanks per
  format.ts.
- Need card: rx 14, fill `#faeae7`, stroke NEED_RED 2px; uppercase tracked
  label `MONTHLY INCOME NEED` (Public Sans 13, INK); value in Literata 600
  30px NEED_RED, centered.
- Cylinders: bottom arc (half-ellipse) → body rect → cap ellipse, fill tint,
  cap fill capTint, stroke bucket color 2.5px (dasharray `8 6` when dashed).
  Content per the grammar section; bucket tag uppercase tracked 10.5px in the
  bucket stroke color; title Literata 600 16 INK centered; caption Public
  Sans italic 12 MUTED; position rows: hairline-separated, label Public Sans
  12.5 left-anchored, value Literata 12.5 right-anchored, inset 20px from
  cylinder sides; value Literata 600 21 INK centered near the bottom (above
  any sub-account); sub-account: inset drum at 72% parent width, dashed
  1.75px stroke in the parent bucket color, its own label (12.5), optional
  caption (10.5 italic), value (Literata 600 15).
- Note cards: rounded rect rx 12, bucket `note` style, title/caption/value
  stack.
- Arrows: `<path>` per layout `d`, stroke FLOW_GREEN, fill none. waterfall:
  3.5px, `stroke-linecap="round"`, `stroke-dasharray="0.1 9"` (dotted beads);
  income + asNeeded: 2px dashed `7 6`. One shared `<marker>` arrowhead
  (compact filled triangle, FLOW_GREEN). asNeeded label chip at `labelAt`:
  white rounded rect, hairline stroke, text `Monthly Income as Needed` +
  amount (or blank) — Public Sans 12.5 + Literata 600.
- Footnotes: per line — label + `: ` + gross (Literata 600) + ` → ` + net +
  ` after withholding`, net figure in FLOW_GREEN 600. 13px.
- Every `<text>` uses the token fonts; dollar figures always Literata with
  `font-variant-numeric: tabular-nums`.

`src/App.tsx` this session: light-gray page (#eceeea) with the map centered
at a comfortable size (e.g. width min(96vw, 1320px), aspect preserved) —
nothing else. `src/styles/app.css`: the four @font-face rules
(Literata/Public Sans, normal+italic, `font-weight: 100 900`, files under
`/fonts/`), body reset, the shell.

## Sample client (`src/model/samples.ts`)

Export `SAMPLE_WHITFIELD: MoneyMapData` exactly with this data (fictional),
plus `blankClient(): MoneyMapData` (empty strings/nulls, one blank income
source, one shortTerm + one afterTax + one taxDeferred account with null
values, all inWaterfall, no positions/subs, empty footnotes):

- id `sample-whitfield`; client: title `Jordan & Dana Whitfield`, year
  `2026`, variant `annual`
- incomeSources: `Social Security` 2400/mo · `Pension — Dana` 1900/mo ·
  `Rental Income` null/mo qualifier `Gross`
- afterTaxIncome 5900 · monthlyNeed 15000 · asNeededAmount null
- accounts (in this order):
  1. cash `Cash at Bank`, value null, inWaterfall false
  2. shortTerm `Short-Term Funds`, caption `2-3 years' worth of income
     needs`, value 165000, inWaterfall true
  3. afterTax `Managed After-Tax Trust`, caption `~50% Equities / ~50% Fixed
     Income`, value 710000, inWaterfall true, positions:
     `S&P 500 Index Fund` 380000 · `Municipal Bond Ladder` 330000
  4. taxDeferred `Managed IRA — Jordan`, caption `Most Aggressive
     Allocation`, value 2450000, inWaterfall true, subAccounts:
     [`Short-Term Funds`, caption `Target ~$160,000 — Annual RMDs`, 240000]
  5. taxPreferred `Roth IRA — Dana`, value 85000, inWaterfall false
  6. charitable `Donor-Advised Fund`, value 120000, inWaterfall false
- footnotes: [`Jordan 2026 RMD`, gross 96500, net 74300]

## Tests

`tests/format.test.ts`: money/moneyPer grouping, approx marker, null → BLANK,
wrap edge cases (long word, empty string).

`tests/layout.test.ts` (run layoutMap on SAMPLE_WHITFIELD and blankClient):
- every placed box lies within the artboard
- no two accounts in the same column overlap; vertical gaps ≥ 8
- waterfall arrows connect in bucket order taxDeferred → afterTax → shortTerm
  (assert count and monotonically decreasing x along the chain)
- income/need/footnote slots at their spec positions
- a client with 8 accounts still fits (heights get compressed, ≥ 120)

## Gates, commits, report

- `npm run build` and `npm test` green; quote outputs in the report.
- Also run `npm run dev` briefly to confirm the page serves without console
  errors (report what you did).
- Commit in small logical steps (model → layout → render → shell → tests),
  imperative messages, no push.
- Write `docs/codex/SESSION-1-REPORT.md` per AGENTS.md.
- LOC budget for this session: ≈ 900–1,300 across the new files. If you blow
  past it, stop and say so in the report instead of compressing style.
