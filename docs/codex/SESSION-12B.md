# SESSION-12B — Post-drag focus rectangle (review catch)

Read `AGENTS.md` first. One cosmetic defect from the SESSION-12 review.
DO NOT PUSH.

## The defect

After any pointer drag (or resize) of a map element, Chromium paints its
default black bbox focus rectangle around the focused SVG group, and it
stays until the user clicks elsewhere. The app's own focus styling
(`.map-page svg [role='button']:focus-visible` → green outline) is
correct; what shows is the UA fallback on plain `:focus`, which
`:focus-visible` does not suppress for pointer-initiated focus on SVG
elements.

## The fix

Preferred, CSS-only (`src/styles/app.css`): explicitly null the outline on
pointer focus while keeping the keyboard ring —
`.map-page svg [role='button']:focus:not(:focus-visible) { outline: none; }`
(extend the selector to `.map-draggable:focus` if the draggable group is
not the `[role='button']` element). If Chromium still paints the UA rect
after that (SVG focus quirk), the fallback is a minimal change in
`src/render/MapSvg.tsx`: blur the group when a drag session ENDS
(commit or cancel) — never on plain clicks, and keyboard focus/navigation
must be untouched.

## Gates & report

- `npm run build` + `npm test` green (quote outputs).
- Browser verification: (1) mouse-drag a drum — after release, NO black
  rectangle; (2) Tab to a drum — the green focus-visible ring still shows;
  (3) click-to-navigate and click-to-edit still work.
- File map: `src/styles/app.css` (+ `src/render/MapSvg.tsx` only if the
  CSS route fails — say which in the report). Budget ≤ 25 changed lines.
- Commit; end with `docs/codex/SESSION-12B-REPORT.md`.
