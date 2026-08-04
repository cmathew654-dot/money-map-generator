# Money Map — Final Acceptance Pass (Dogfood Route)

**Purpose:** last full pass before upload. This walks the whole product surface, not just this
sprint's changes, and deliberately stages the messy states the automated tests never reach.
Expect **25–40 minutes**. Every step is *action → expected*. Tick the box when the expected
thing happened; write a one-line note (step number + what you saw) when it didn't.

**Golden rule for this pass: don't fix, don't work around — record and move on.**
Exception: if editing ever locks up in the multi-tab section, **freeze** — leave every tab
exactly as it is and report before touching anything, so the live state can be inspected.

---

## Setup (2 min)

1. Dev server must be up. Check: open http://127.0.0.1:4361 — the app loads.
   If it doesn't: `cd C:\Users\Cyril\Projects\.worktrees\money-map-generator-s40; npx vite --host 127.0.0.1 --port 4361 --strictPort`
2. Use an **incognito window** (Ctrl+Shift+N), one tab only. This guarantees fresh storage
   (true cold start), no session-restored tabs, and no extensions.
3. Keep DevTools console open (F12) the whole drive. Any red error at any step is a finding —
   note the step number.

---

## A. Cold start & wizard (4 min)

- [ ] **A1** Open http://127.0.0.1:4361 in the incognito tab. → Exactly one tab; the app loads;
      console clean.
- [ ] **A2** Start a new client (guided setup). Fill it **realistically but messily** — this is
      deliberate staging for later steps:
      - one income source with a **long name** (e.g. "Deferred Compensation Plan — Meridian Partners LLC")
      - one **huge** account value (e.g. $1,250,000,000) and one **blank/unknown** value left as ~$____
      - 7+ accounts total so columns get crowded
- [ ] **A3** While filling: the wizard footer (Back/Next) stays pinned to the bottom and never
      jumps as fields appear/disappear.
- [ ] **A4** Finish the wizard. → You land on the map with your client rendered.
- [ ] **A5** *Known gap, confirm it's still the only one:* the "Review the map before sharing."
      heading never appears anywhere in the wizard. That's the known `hasWarnings` hardcode —
      don't file it, but note anything *else* odd in wizard flow.

## B. Core canvas editing (8 min)

- [ ] **B1** Drag an account **by its body** ×3. → Moves smoothly, stays where dropped, re-drags.
- [ ] **B2** Press-drag starting **on the account's text**. → The account moves; the text never
      gets a selection highlight mid-drag.
- [ ] **B3** Double-click the text. → Inline editor opens; you can select *within* the text.
- [ ] **B4** On a **cylinder** account: drag it once grabbing the **top cap**, once grabbing the
      **lower body**. → Both grab and move it. (Cap and body are separate hit shapes.)
- [ ] **B5** Select an account → drag its **resize handle**. → Resizes live, no jumpiness.
- [ ] **B6** Drag its **connector handle** onto another account. → A flow is created and selected.
- [ ] **B7** Quick-add: `+ Account`, `+ Text note`, and an Add-panel flow (From/To → Add flow).
      → Each lands selected/focused; the text note drops where you aimed it.
- [ ] **B8** Undo/redo each of: a money edit, a drag, a multi-select alignment (Shift-click two
      accounts → align). → Each is exactly **one** undo step; redo restores it.
- [ ] **B9** **Money undo by hand** (automated coverage is dead here — this is the only check):
      edit a dollar amount, Ctrl+Z inside the field → old value returns; Ctrl+Shift+Z → new value
      returns.
- [ ] **B10** **Your long name + huge value from A2:** look at those accounts on the map. → Text
      wraps or truncates *gracefully* — nothing overflows its shape, nothing collides with a
      neighbor's text. (The old 'Duplica' truncation bug lived here.)

## C. Tidy map — staged mess (3 min)

- [ ] **C1** Drag one account **directly on top of** another. Fully overlapping.
- [ ] **C2** Click **Tidy map**. → The stacked accounts **separate with a visible gap**; anything
      displaced settles into free space (nothing piles at the artboard edge, nothing vanishes
      behind a neighbor). *(Fixed tonight — 7bd9059 — after this exact scenario failed live.)*
- [ ] **C3** Press Ctrl+Z once. → The whole tidy is one step; your mess comes back. Redo → tidy again.

## D. Inspector & panels (4 min)

- [ ] **D1** At a ~1440×900 window: select an account. → Inspector shows **full** labels
      ('Duplicate', 'Cylinder', 'Short-term', 'Choose…' — not 'Duplica'/'S'/'Cho').
- [ ] **D2** **VERDICT NEEDED:** in that same inspector, find the **RESET ITEM** group — it wraps
      to a second row that the panel clips. Decide: acceptable as-is, or CSS follow-up?
- [ ] **D3** Exercise: shape change, short-term toggle, duplicate, delete. → Each works, each is
      one undo step.
- [ ] **D4** Open/close Data, Contents, Help. → Help lists keyboard shortcuts; Esc always closes;
      focus returns somewhere sensible (not lost to `<body>`).

## E. View modes, zoom & reflow (5 min)

- [ ] **E1** With a **fresh hint** visible (incognito = fresh): click toolbar **Zoom in**. → The
      pan-zoom hint **stays** and now mentions panning ("zoomed past fit" wording).
- [ ] **E2** Ctrl+wheel zoom, then pan-drag, then reload and click "Got it". → Each of the three
      dismisses the hint for good.
- [ ] **E3** Fit / zoom % / Tidy round-trip a few times. → Zoom label tracks; Fit always frames
      everything.
- [ ] **E4** Present mode. → Chrome hides, map only; Esc exits cleanly.
- [ ] **E5** Narrow the window below ~700px. → The map toolbar sits at the **viewport bottom**
      (if you ever see it mid-page, that's a real finding — the wizard-baseline artifact was
      fullPage-stitch, not this).
- [ ] **E6** Set **browser zoom to 200%** (Ctrl+plus). Open the **Add panel**, then try to click
      an account the panel half-covers. → You can still reach it (close the panel if needed —
      note *how much* of the canvas it eats). Do one drag and one text edit at 200%. → Both land
      where you aimed. Reset zoom after.

## F. Persistence & export (4 min)

- [ ] **F1** Reload the tab. → Map, arrangement, zoom prefs, dismissed hint all persist; save
      status shows saved; console clean.
- [ ] **F2** Export PNG. → Button shows busy state, second click does nothing while busy, file
      downloads.
- [ ] **F3** **Open the PNG next to the live map and compare** (nobody automated this): fonts,
      dashed strokes, cylinder caps, the RMD footnote, your long-name account, colors. → The
      artifact matches the screen. Any divergence is a finding — this is the client deliverable.
- [ ] **F4** Print preview (Ctrl+P from the app's Print button). → Layout sane, nothing clipped.
      Cancel out.
- [ ] **F5** Save Book / damaged-copy download if offered. → Status messages are honest (no
      silent success claims).

## G. Keyboard-only segment (3 min)

Mouse off the table for this section.

- [ ] **G1** Tab through the app from the address bar. → Focus is always *visible*; order is
      sane (toolbar → panels → canvas controls).
- [ ] **G2** Reach and activate: undo, a panel, the Tidy button, Present (Esc out). → All
      reachable and operable.
- [ ] **G3** *Known gap (verdict pending, don't file):* in read-only mode, disabled controls
      don't explain why and the takeover banner isn't announced to screen readers. If you notice
      **new** keyboard traps beyond that, note them.

## H. Multi-tab — deliberate, last (5 min)

Do this section only after everything above; it changes writer state.

- [ ] **H1** Open a **second tab** of http://127.0.0.1:4361 (same incognito window). Focus it.
      → Within ~2s it becomes editable **without clicking anything**; tab 1 (check it) shows the
      "View only — editing is active in another tab. Click to take over." banner.
- [ ] **H2** Return to tab 1. → It auto-recovers editing on focus (or after one click on the
      banner). **This is the path that locked you earlier tonight — watch it closely. If it
      locks: FREEZE, leave both tabs, report.**
- [ ] **H3** Edit the title in tab 2, switch to tab 1. → The change is there.
- [ ] **H4** *Known behavior (verdict pending):* after any handoff, Ctrl+Z does nothing — the
      undo stack dies with the handoff. Confirm that's what you see; decide accept-and-document
      vs backlog a fix.
- [ ] **H5** Close tab 2. → Tab 1 reclaims writing promptly (no long wait).
- [ ] **H6** Both-tabs-at-once (the split-brain fix, 29e69ad): duplicate the tab, then reload
      **both** as close to simultaneously as you can (Ctrl+R in one, immediately Ctrl+R in the
      other). → Exactly **one** tab is editable; the other shows the banner. Never both editable.

---

## Verdict sheet (fill in at the end)

| # | Decision | Options | Your call |
|-|-|-|-|
| 1 | RESET ITEM row clipped at 1440×900 (D2) | accept / CSS follow-up | |
| 2 | Undo wiped on tab handoff (H4) | accept + document / backlog fix | |
| 3 | Screen-reader lease invisibility (G3) | small dispatch now / backlog | |
| 4 | Upload ceremony shape | fast-forward update / history rewrite (GitHub repo already has Aug-1 `main`) | |

## Do NOT file these (known, tracked)

- Wizard "Review the map before sharing." heading never renders (`hasWarnings` hardcode).
- Money-input e2e failures — test-side locator rot; that's why B9 is manual.
- Text-zoom-200 e2e cluster — panel occlusion at 200%, tracked; E6 is the manual sanity check.
- Rapid-handoff e2e races (certification:86 family) — flaky test family, tracked.
