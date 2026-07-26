# SESSION-2 — Form + the client book (M3)

Read `AGENTS.md` first. SESSION-1/1B built the static render path (model →
layout → `MapSvg`). This session makes it a real tool: a form on the left
editing a live map preview on the right, with the whole practice stored as
one "book" of many clients (`MoneyMapFile`, designed for 100–200 clients).

**Do not touch** `src/layout/layout.ts`, `src/render/MapSvg.tsx`,
`src/render/tokens.ts`, or existing tests (you may ADD tests).

## Files this session

```
src/model/book.ts        NEW — pure book operations (below)
src/form/Form.tsx        NEW — the whole form (say so in the report if it passes ~450 LOC)
src/export/export.ts     NEW — saveBookToFile / loadBookFromFile ONLY (print/PNG are next session)
src/App.tsx              REWRITE — book state owner, header, two-pane shell
src/styles/app.css       EXTEND — header, panes, form styles
tests/book.test.ts       NEW
.gitignore               add `tsconfig.tsbuildinfo`
```

## `src/model/book.ts` — pure functions, unit-tested

```ts
newBook(): MoneyMapFile                    // contains SAMPLE_WHITFIELD + one blankClient()
addClient(book): { book; id }              // appends blankClient() titled "New Client"
duplicateClient(book, id): { book; id }    // deep copy, fresh ids, title + " (copy)"
deleteClient(book, id): MoneyMapFile       // never leaves the book empty — deleting the last client replaces it with blankClient()
updateClient(book, id, data): MoneyMapFile // replace by id
parseBook(json: string): MoneyMapFile      // JSON.parse + validate fileType/version/clients array + per-client minimal shape; throw Error with a human message on anything invalid
```

Deep-copy via `structuredClone`. Tests cover every function, including
parseBook rejecting wrong fileType, wrong version, and non-array clients.

## `src/App.tsx` — the one state owner

- `useState<MoneyMapFile>` initialized from `localStorage['money-map-book:v1']`
  (via `parseBook`; fall back to `newBook()` on absence or corruption) +
  `useState<string>` activeClientId (first client on boot).
- Autosave: `useEffect` writes the book to localStorage, debounced ~400ms,
  `try/catch` swallowing quota errors.
- Layout: slim header bar; below it, left pane (form, width ~400px, own
  scroll) and right pane (preview, fills the rest, map scaled to fit while
  keeping the 1320:1020 ratio, light-gray ground).
- Header contents, left to right: wordmark `Money Map` (Literata 600); a
  client `<select>` (file order, label = client title or "Untitled"); buttons
  `New`, `Duplicate`, `Delete` (uses `window.confirm`), spacer, `Save book`,
  `Load book`. Quiet styling: paper background, hairline bottom border, ink
  text, NO icon library, no color except the existing palette. `Load book`
  is a hidden `<input type="file" accept=".json">` behind a button.
- On Load: `parseBook` the file text; on failure `window.alert` the error
  message and keep current state; on success replace book + select first
  client.

## `src/export/export.ts`

- `saveBookToFile(book)` — `JSON.stringify(book, null, 2)` → Blob →
  `a[download]` named `money-map-book.json`, revoke the object URL.
- `loadBookFromFile(file: File): Promise<MoneyMapFile>` — read text, `parseBook`.

## `src/form/Form.tsx`

Props: `{ data: MoneyMapData; onChange(next: MoneyMapData): void }`. Plain
controlled inputs; every keystroke flows up (App re-renders the map live).
No validation walls, no masks — blanks are a feature (AGENTS.md rule 6).

Sections, in map reading order, each with a quiet uppercase-tracked heading:

1. **Client** — title, year, variant (`annual`/`postNote` radio or select),
   postNoteLabel input shown only for postNote.
2. **Income** — one row per source: label, amount, period (`mo`/`yr`
   select), qualifier. Row remove ×, `+ Add income source`. Then After-Tax
   Income (money field) and Monthly Income Need (money field), and
   "Monthly income as needed" (money field, help text: appears on the arrow).
3. **Accounts** — one card per account: bucket `<select>` (labels:
   Short-Term Bucket / After-Tax / Tax-Deferred / Tax-Preferred /
   Charitable / Cash / Note card), label, value, caption, `In refill chain`
   checkbox, then two nested row lists: **Positions** (label + value rows)
   and **Sub-accounts** (label + caption + value rows), each with add/remove.
   Account remove button. `+ Add account`.
4. **Footnotes** — label + gross + net rows, add/remove. Help text: "net
   renders in green — after withholding".

**Money fields** (one small shared component inside Form.tsx): text input,
right-aligned; parse on change by stripping `$ , spaces`; empty or
non-numeric → `null`; display the raw digits while focused and the
`money()`-formatted value when blurred. Blank shows placeholder `~$ ______`.

Styling in `app.css`: labels Public Sans 12 uppercase tracked MUTED; inputs
hairline borders, paper background, INK text, focus ring FLOW_GREEN; account
cards separated by hairlines with the bucket's stroke color as a 3px left
edge on the card — the ONLY colored element in the form.

## Gates & report

- `npm run build`, `npm test` green — quote outputs.
- Manual check via dev server: edit title → map updates live; add an
  account → appears; reload page → state persisted; Save then Load the JSON
  → identical map. Describe what you verified.
- Commit in logical steps. Write `docs/codex/SESSION-2-REPORT.md` (what was
  built, LOC table, gates verbatim, deviations, noticed-not-done).
- LOC budget: ≈ 650–900 new lines. Overrun = say so, don't compress.
