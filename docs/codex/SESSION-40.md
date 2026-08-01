# Session 40: Data Safety, Dogfood Polish, Stable IDs, and Capacity

## Goal

Finish the Money Map Generator without weakening its local-first data contract. Session 40 makes storage state visible, prevents multi-tab write conflicts, preserves damaged browser data for recovery, removes the remaining map-editing friction, and blocks output when content exceeds the printable layout.

## Data safety and recovery

- Browser persistence reports `Saving`, `Saved`, and actionable failure states.
- `pagehide` and hidden-document transitions flush the latest in-memory book.
- Focused money inputs update the model draft so navigation cannot discard typed values.
- Invalid browser JSON enters recovery mode without overwriting the raw value. Users can download it, load a valid book, or explicitly start fresh.
- One tab owns the writer lease. Other tabs are read-only and may explicitly take over.
- Loading JSON while connected to a file requires confirmation; the old file is disconnected and never overwritten.

## Map editing and identity

- Income amount editing uses a content-sized hit target while preserving click-versus-drag behavior.
- Position and subaccount labels, captions, and values have individual edit targets.
- Account shapes grow with wrapped content; subaccount title, caption, and value typography is `14.5`, `12`, and `19`.
- Income sources and footnotes have stable IDs and ID-addressed movement keys with legacy shared-offset fallback.
- Duplication remaps account, income, footnote, note, custom-arrow, endpoint, and layout-override references.

## Capacity and deployment

- Layout warnings cover printable-bound overflow and known dense-content collisions.
- Print, PNG, PDF, and SVG output remain disabled until warnings are resolved.
- GitHub Pages always builds with `VITE_DATA_MODE=demo`. Demo changes are temporary and file connections are suppressed.
- Real client use requires a private, separately controlled origin with `VITE_DATA_MODE=real`. It must not share the public GitHub Pages origin or storage namespace. Access control, retention, backup, and incident handling remain deployment responsibilities.

## Gates

- `npm test`
- `npm run build`
- Visual stress fixtures for dense income, accounts, subaccounts, and footnotes
- Manual two-tab writer takeover and corrupt-storage recovery check
