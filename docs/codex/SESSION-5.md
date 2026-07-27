# SESSION-5 — Breathing room up top + map-click navigation + input ergonomics

Read `AGENTS.md` first. Three workstreams, owner-approved. The map remains
output-only for EDITING — no in-place text editing on the SVG. Clicking the
map only navigates the form.

## P1 — Vertical rebalance (owner: "why is this so close to the top?")

After SESSION-4 clamped arrows below the masthead rule, the arc lane is a
cramped ~30-unit strip under the rule while the page bottom sits empty.
In `src/layout/layout.ts`: shift the content band down — column start ys
+50 (center 150→200, trust 190→240, far 150→200); income panel top
150→170; need card top +20. Footnotes stay. Arc clearance/clamp rules
unchanged — arcs should now ride ~drumTop−30 with ≥50 units of air below
the masthead rule. Update the tests that pin these slot coordinates (that
is the only sanctioned existing-test change) and re-verify the SESSION-4B
obstacle clearances still pass for all samples.

## P2 — Map-click navigation (form and map become one system)

- `src/render/MapSvg.tsx`: add OPTIONAL props
  `onElementClick?: (t: { kind: 'account' | 'income' | 'need'; id?: string }) => void`
  and `highlightId?: string | null`. When `onElementClick` is present:
  each account/note group, the income panel, and the need card get
  `cursor: pointer`, `role="button"`, `tabIndex={0}`, an aria-label
  (account label or "Income sources" / "Monthly income need"), click and
  Enter/Space handlers. When `highlightId` matches an account id, render a
  soft halo (e.g. a rounded outline 6px outside the box in the bucket
  stroke color at ~35% opacity — flat, no glow filters). When the props are
  absent (print container, PNG export clone), NOTHING interactive renders —
  print/PNG output must be byte-identical in appearance to today.
- `src/form/Form.tsx`: accept `focusRequest?: { id: string; at: number }`
  and `onHoverAccount?: (id: string | null) => void`. Each account card
  registers a ref by account id; when `focusRequest` changes, open that
  card's `<details>`, `scrollIntoView({ block: 'center', behavior:
  'smooth' })`, and focus its label input. Card `onMouseEnter/Leave` call
  `onHoverAccount`. Income/need focus requests scroll to the Income
  section.
- `src/App.tsx`: wire it — map click → focusRequest (use a counter so
  re-clicking the same drum retriggers); form card hover → `highlightId`
  on the SCREEN MapSvg only.

## P3 — Input ergonomics

- `src/model/format.ts`: add `parseMoneyInput(text: string): number | null`
  — trims; strips `$ , spaces`; accepts `85k`/`1.2m` (case-insensitive,
  fractional ok) → 85000 / 1200000; plain numbers pass through; empty or
  junk → null. Money fields in Form.tsx commit through it on blur (typing
  behavior otherwise unchanged; the blurred display still uses `money()`).
  Unit tests: `85k`, `1.2M`, `$2,450,000`, `.5m`, `abc` → null, `''` → null.
- Enter-to-next: inside the form, Enter in a text/money input moves focus
  to the next focusable form field (like Tab; ignore selects/buttons/
  textareas if any). One form-level keydown handler; no per-field wiring.
- Bucket-preset add: replace the single `+ Add account` with a labeled chip
  row ("Add:") — `Short-Term`, `Trust`, `IRA`, `Roth`, `Cash`,
  `Charitable`, `Note`. Each creates an account preset:
  {shortTerm, "Short-Term Funds", caption "2-3 years' worth of income
  needs", inWaterfall true} · {afterTax, "Trust Account", inWaterfall true}
  · {taxDeferred, "IRA", inWaterfall true} · {taxPreferred, "Roth IRA"} ·
  {cash, "Cash at Bank"} · {charitable, "Donor-Advised Fund"} ·
  {note, "Note"}. New card still mounts expanded. Chips styled like quiet
  buttons with the bucket swatch square; no new colors.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Headless verification, describe method + results: (1) top spacing visible
  on all four clients (screenshot); (2) click a drum → its form card opens
  + scrolls; (3) hover a form card → halo appears on that drum; (4) print
  media capture unchanged apart from P1 spacing (NO halos, NO cursor
  artifacts); (5) `85k` blur → `$85,000` on map.
- Commit in logical steps; `docs/codex/SESSION-5-REPORT.md`; budget
  ≈ 400–600 changed lines. Overrun = disclose.
