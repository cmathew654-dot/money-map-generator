---
name: Money Map Generator
description: A calm, authoritative working-paper interface for building and presenting client money maps.
colors:
  paper: "#fcfcfa"
  surface: "#ffffff"
  workspace: "#eceeea"
  section: "#f4f6f2"
  ink: "#1c2422"
  muted: "#47504d"
  hairline: "#dde1dc"
  flow: "#1e7a4a"
  need: "#c03a2d"
  afterTax: "#b98a1e"
  taxDeferred: "#2f6bab"
  taxPreferred: "#2e8577"
  charitable: "#6b4fa0"
typography:
  masthead:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "30px"
    fontWeight: 600
  workspaceTitle:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "24px"
    fontWeight: 600
  body:
    fontFamily: "Public Sans, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "Public Sans, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.08em"
  mapValue:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "25px"
    fontWeight: 600
rounded:
  control: "4px"
  dialog: "6px"
  row: "8px"
  section: "10px"
  needCard: "14px"
  pill: "999px"
spacing:
  xxs: "4px"
  xs: "8px"
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  input:
    height: "32px"
    padding: "5px 8px"
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.control}"
  formSection:
    padding: "16px 14px"
    backgroundColor: "{colors.section}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.section}"
  mapPaper:
    width: "1320px"
    height: "1020px"
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
---

## Overview

Money Map Generator uses the visual vocabulary of a carefully prepared advisor working paper. The editing workspace is a side-by-side composition: a 420px form pane and a flexible map preview, with the map itself held to a 1320px by 1020px presentation artboard. The interface stays quiet so account relationships, money flows, and planning needs remain primary.

The system is intentionally desktop-first for financial advisors working in Chrome or Edge on Windows, with Safari and Chrome on macOS as secondary targets. Editing controls are explicit and forgiving. Present mode removes application chrome and leaves the client-facing map.

The current identity is `#fcfcfa` paper with `#1c2422` ink and `#1e7a4a` flow accents; Literata carries document titles and financial values, Public Sans carries controls and explanatory text; the workspace is split side-by-side with bordered, lightly rounded surfaces, restrained shadows, and direct professional copy.

## Colors

The map is built on warm paper (`#fcfcfa`), while controls use white (`#ffffff`) and the surrounding preview uses a cooler neutral (`#eceeea`). Primary text is near-black green (`#1c2422`), secondary text is `#47504d`, and structural rules use `#dde1dc`.

Green (`#1e7a4a`) denotes money flow and active editing affordances. Red (`#c03a2d`) is reserved for planning need and danger. Account taxonomy uses controlled semantic accents: after-tax gold (`#b98a1e`), tax-deferred blue (`#2f6bab`), tax-preferred teal (`#2e8577`), and charitable purple (`#6b4fa0`). These colors clarify structure; they are not decorative status rewards.

Status surfaces remain low-chroma and readable: demo uses `#eef5ef` with `#155f4a`, warning uses `#fff6d9` with `#a97812`, and danger uses `#fff0eb` with `#9f3d2f`.

## Typography

Literata is the document face. It is used for the 30px map masthead, the 24px workspace title, 19px account titles, and 25px primary map values. Georgia is its fallback.

Public Sans is the interface and annotation face, with Segoe UI as fallback. Body and row text center around 14px to 14.5px. Interface labels are 12px, semibold, uppercase, and tracked at `0.08em`; section headings increase tracking to `0.14em`. Monetary inputs and map values use tabular numerals.

Map text uses generous role-specific leading: account titles use approximately `1.3`, while captions, rows, and sub-account labels use approximately `1.45`. Size and weight establish hierarchy before color does.

## Elevation

Most hierarchy comes from paper color, borders, and spacing rather than shadow. Form sections use a `1px` hairline border on `#f4f6f2`; stacked rows return to white. The map artboard reads as a physical sheet against the `#eceeea` preview field.

Floating UI is the exception. Dialogs use `0 14px 42px rgb(28 36 34 / 20%)`; toasts use `0 5px 18px rgb(28 36 34 / 14%)`; status banners use `0 5px 18px rgb(28 36 34 / 16%)`; compact map controls use `0 3px 10px rgb(28 36 34 / 16%)`.

Corner radii are functional and restrained: 4px controls, 6px dialogs, 8px rows and menus, 10px form sections, 14px need cards, and fully rounded compact pills.

## Components

### Buttons and navigation

Buttons use Public Sans, compact geometry, and clear border contrast. Primary actions reverse to ink with white text. Quiet actions remain white and bordered. Destructive menu items use the need color rather than introducing a new red. The wizard's next action has a minimum 128px width and 44px height; progress is shown with a simple 2px ink rule rather than decorative steps.

### Inputs

Inputs and selects are 32px high with `5px 8px` internal padding. Labels sit above fields in small uppercase text. Money inputs align right and use tabular numerals. Focus, validation, save, recovery, and error states must remain explicit.

### Menus

Menus are compact white popovers with an 8px radius, hairline border, quiet separators, and full-width menu items. Their behavior includes keyboard navigation, escape dismissal, and click-away dismissal. Danger actions remain visually distinct without dominating the menu.

### Panels

Form sections use `16px 14px` padding, a 10px radius, `#f4f6f2` fill, and `#dde1dc` border. Repeating records use white 8px-radius stacked rows with 10px padding. The density supports quick advisor entry without turning the form into a data grid.

### Money map

The money map is the signature component and the visual source of truth. It uses warm paper, Literata headings and values, Public Sans annotations, semantic account colors, and directional connectors. Editing handles appear only when useful; editable hover uses an 8% tint of flow green. Present mode removes edit chrome entirely.

## Do's and Don'ts

- Do prioritize data integrity, legible relationships, and explicit save or recovery feedback.
- Do preserve the side-by-side advisor workflow and the fixed presentation artboard.
- Do use semantic account colors consistently and sparingly.
- Do keep controls compact, bordered, and visibly interactive.
- Do use motion only for orientation: the existing quiet entrance is 160ms ease-out and interaction transitions are 120ms ease.
- Do honor reduced-motion preferences and WCAG 2.2 AA contrast and interaction requirements.
- Don't imitate Bloomberg-terminal density.
- Don't use consumer-finance gamification, rewards, celebratory color, or progress theatrics.
- Don't drift into generic SaaS-dashboard cards, metrics tiles, or interchangeable navigation.
- Don't add decorative gradients, glass effects, or heavy shadows to the map.
- Don't let interface chrome compete with the client-facing financial story.
- Don't use color as the only signal for account type, status, or error.
