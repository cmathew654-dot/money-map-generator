# AGENTS.md — money-map-generator

Rules for any coding agent working in this repo. Lean on purpose. The prior
project died of process weight; this one stays light.

## What this repo is

A single-page, fully client-side tool: a financial advisor fills a form and it
generates a "Money Map" — a one-page diagram of a client's income sources,
accounts (color-coded by tax bucket), and monthly income need. One JSON file
holds the whole practice (100–200 clients). Print/PNG export per client.

## Hard rules

1. **Session prompt is the scope.** Implement what the current
   `docs/codex/SESSION-*.md` specifies. Nothing else. Wants that emerge go in
   `NOTES.md` as v2 candidates, not into code.
2. **No new dependencies.** Runtime deps are `react` + `react-dom`, ever.
   Dev deps are what `package.json` already lists. Do not add packages.
3. **The file map is the architecture.** The session prompt names every file
   you may create. A file not on the map requires a one-line justification in
   your report, or don't create it.
4. **Never push. Never add a remote.** Commit locally with clear messages,
   one logical change per commit.
5. **Do not edit** `AGENTS.md`, `docs/codex/*`, or `docs/review/*`.
6. **Blanks are a feature.** A `null` dollar value renders as `~$ ______` —
   advisors capture those live in meetings. Never coerce null to 0, never
   validate blanks away.
7. **Legibility over cleverness.** One state owner (`App.tsx`), props down,
   pure functions for layout/formatting, no context providers, no state
   libraries, no CSS-in-JS. If a file passes ~400 LOC, say so in the report
   rather than silently splitting it.
8. **Gates before "done":** `npm run build` and `npm test` green, run in this
   session, output quoted in the report. Report honestly — a red gate or a
   deviation stated plainly beats a green-looking lie. Machine-green does not
   overrule what the owner sees on screen.
9. **Windows caution:** never use PowerShell 5.1 to edit UTF-8 text files
   (it corrupts em dashes). Use the editor tools or Node.

## Report

End every session by writing `docs/codex/SESSION-<n>-REPORT.md`: what was
built, file-by-file LOC, gate outputs (verbatim), deviations from the prompt,
and anything you noticed but did not do.
