# SESSION-36 — "Save" menu: PNG / PDF / SVG + book-status clarity

Read `AGENTS.md` first. Owner ask: the header "Export PNG" button
should read as SAVING and offer the common formats. No new
dependencies — the PDF is hand-written (details below). DO NOT PUSH.

## P1 — The Save menu

- The header "Export PNG" button becomes a `Save ▾` menu (reuse
  `src/ui/Menu.tsx`): items **"PNG image"**, **"PDF document"**,
  **"SVG image"**, then a separator and one MUTED, non-interactive
  status line about the BOOK (not the map): "Book auto-saves —
  connected to <filename> ✓" when a file is connected, otherwise
  "Book auto-saves in this browser — connect a file from Book ▾".
  Read the existing connection state App already holds; do not touch
  filestore.ts.
- PNG: the existing `exportPng` path unchanged (filename via
  `mapFileName`).
- SVG: serialize the same offscreen noninteractive map SVG used for
  PNG (fonts embedded the same way `exportPng` does), download as
  `<Title> — Money Map <Year>.svg` via the existing Blob pattern.
- PDF: a true one-click `.pdf` download, hand-written, no library:
  render the map to a canvas exactly as `exportPng` does, take a
  high-quality JPEG (`canvas.toDataURL('image/jpeg', 0.92)`), and
  write a minimal single-page PDF: US-letter LANDSCAPE (792×612 pt)
  with one image XObject (`/DCTDecode`, the JPEG bytes) drawn
  full-page, correct xref table and byte offsets. ~120–200 LOC pure
  function in `src/export/pdf.ts` taking the JPEG bytes + pixel
  dimensions and returning a `Uint8Array`. Validate output opens in
  Chrome and a second viewer (e.g. Edge). Filename mirrors
  `mapFileName` with `.pdf`.
  - FALLBACK (only if a generated PDF fails to open in either
    viewer): the menu item triggers the print dialog instead, and
    the report discloses the downgrade honestly.

## P2 — README positioning (owner's framing)

- README: lead the features with the book-as-the-practice framing,
  in the owner's spirit: today an advisor's maps live nested in
  client files inside folders inside folders — here, ONE book holds
  every client's map, auto-saved locally (connect it to a real file
  and it saves to your own disk/OneDrive; nothing ever leaves the
  machine). Keep it tight — strengthen the existing "whole practice
  in one file" and "private by construction" bullets rather than
  rewriting the document.

## Gates & report

- `npm run build` + `npm test` green (quote verbatim).
- Tests — `tests/export.test.ts` (or new `tests/pdf.test.ts`): the
  PDF builder emits a well-formed header (`%PDF-1.4`), a single page
  of 792×612, a `/DCTDecode` XObject with the exact JPEG byte
  length, a trailer with correct `/Size`, and xref offsets that
  match the actual byte positions (compute, don't hardcode); SVG
  export serializes a complete `<svg` document containing embedded
  font data and no editor chrome classes.
- Screenshot verification: (1) the Save ▾ menu open — three items +
  the book status line (both connected and browser-only states);
  (2) each of the three files downloaded; open the PDF in a viewer
  and screenshot it — one landscape page, the full map; (3) the
  README section rendered (plain text review is fine).
- Redirect all browser output to files under C:\tmp; any free port.
- File map — create: `src/export/pdf.ts`, `tests/pdf.test.ts`
  (optional if covered in export.test.ts). Touch: `src/App.tsx`
  (menu swap, minimal), `src/export/export.ts` (SVG serialize +
  shared render plumbing), `src/styles/app.css` (menu status line
  style), `README.md`, `tests/export.test.ts`. Budget ≈ 300–450
  changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-36-REPORT.md`.
