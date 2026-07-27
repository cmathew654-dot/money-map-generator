# SESSION-18 — Header redesign: one clean line

Read `AGENTS.md` first. Owner verdict on the current header: "ugly,
outdated, clunky" — it accreted one control per session and now wraps
four two-line labels. Information architecture fix, UI only. No behavior
changes to any underlying action. DO NOT PUSH.

## Target layout (one row, no wrapped labels, at ≥1100px)

Left → right:
1. Mark + "Money Map" wordmark (unchanged).
2. Client select (unchanged) + a compact "New" button + a small "⋯"
   icon-button opening a CLIENT MENU containing Duplicate and Delete
   (Delete keeps its existing confirm Dialog and danger styling inside
   the menu).
3. Undo / redo icon pair (unchanged behavior).
4. A **Book ▾** menu button holding everything file-related:
   Save book, Load book, separator, then the file connection area —
   "Keep in a file…" + "Open existing" when unconnected,
   "Reconnect <name>" when offered, and when connected: the file name,
   the Saved / Saving… state, and Disconnect. When a file is connected,
   the closed Book button itself shows a small muted dot + the file
   name (truncated ~18ch) so the connection state is visible without
   opening the menu.
5. Flexible spacer.
6. "Reset layout" — RENDERS ONLY when the active client has any
   layoutOverrides (today it sits disabled forever for most clients);
   same confirm behavior.
7. "Present" (quiet secondary), then the primary dark pair
   **Print** / **Export PNG** (unchanged).

## The menu component

- New file `src/ui/Menu.tsx`: a small, dependency-free dropdown —
  trigger button + popover list. Keyboard contract: Enter/Space/ArrowDown
  opens, Arrow keys move, Enter activates, Esc closes and returns focus
  to the trigger, click-away closes. `role="menu"` / `role="menuitem"`,
  focus-visible rings per the existing contract. Used by both the client
  "⋯" and "Book ▾".
- Styling: existing quiet-button language; menu popover = white card,
  hairline border, subtle shadow consistent with Dialog; no motion
  outside the existing prefers-reduced-motion guard (a quiet
  quiet-enter is fine inside it).

## Constraints

- ZERO behavior changes: every action calls exactly the handler it calls
  today (Save book, Load book, file connect/reconnect/disconnect,
  duplicate, delete, reset, present, print, export). This session moves
  and restyles; it does not rewire.
- `App.tsx` stays the single state owner; the header may be extracted
  into a `Header` component INSIDE `App.tsx` or stay inline — do not
  create a new state-bearing file beyond `src/ui/Menu.tsx`.
- The narrow-viewport (≤900px) stacking must remain usable — collapse
  gracefully (menus help; verify nothing overlaps).
- Wizard/form/map untouched.

## Gates & report

- `npm run build` + `npm test` green (quote outputs verbatim).
- Tests: menu open/close/activate handlers at the component-logic level
  if pure extraction is natural; do not force DOM testing beyond what
  jsdom does today.
- Screenshot verification at 1600, 1280, and 900 widths: single-line
  header, no wrapped labels, Book menu open showing both connected and
  unconnected states, client ⋯ menu open, Reset layout absent without
  overrides and present with them, keyboard walk (Tab to Book, Enter,
  arrows, Esc) described.
- File map: `src/App.tsx`, `src/ui/Menu.tsx` (new),
  `src/styles/app.css`. Budget ≈ 250–420 changed lines.
- Commit in logical steps; end with `docs/codex/SESSION-18-REPORT.md`.
