# s51 — retyping an aggregate total

Retyping an account total its positions already add up to now rewrites nothing.
`mapTextEditAggregateTarget` refuses the edit in `applyMapTextEdit` and the
editor becomes a pill, "Total is the sum of its rows — Edit the rows", which
opens the Data panel via `focusDataTarget`. Escape, a click away, or 6s
dismisses it.

## Narrower than the brief

The brief also named sub-accounts and after-tax income; both are wrong.
Sub-accounts are earmarked carve-outs and positions are "holdings of note"
(`Account` in model/types), so a breakdown that does not add up is a partial
highlight — `managed-ira-jordan` is 2,450,000 with a 240,000 carve-out.
After-tax income is advisor-entered: Whitfield's gross rows total 4,300 against
5,900. Refusing either breaks `mapedit.test.ts`. So: `accountValue` only,
every position valued, summing exactly.

## Codex's WIP

Kept the shape — refuse inside `applyMapTextEdit`, reuse the
`.map-text-size-controls` pill (Toast is `pointer-events: none`, so it cannot
host the action). Redone: the predicate; `onCommit`'s boolean return became an
`aggregate` prop; `pillButtonCount = 7` became a measured width. Fixed three
gaps — `.map-editing-text` (`visibility: hidden`) stayed on the number, so the
total vanished for 6s; nothing focused the notice, so Escape never reached it;
the unmounting input's blur cancelled it.

Gate: tsc clean, vitest 740/740, e2e 20/20 (`map-keyboard` "one undo step"
fails on the checkpoint too).
