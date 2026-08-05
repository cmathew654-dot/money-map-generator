import { describe, expect, it } from 'vitest'

import {
  selectionReducer,
  shouldFocusSelect,
  type SelectionState,
} from '../src/render/selection'

const CASH = 'account:cash-at-bank'
const ROTH = 'account:roth-ira-dana'
const NOTE = 'note:note-1'

const stateOf = (keys: string[]): SelectionState => ({
  keys,
  anchor: keys.at(-1) ?? null,
})

/**
 * `canvas/click` carries the whole selection decision for a map click. What was
 * once `nextSelectedTargetKeys` returning `null` for "leave the selection
 * exactly as it is" is now the reducer returning `state` by identity.
 */
const click = (
  keys: string[],
  key: string | null,
  modified: boolean,
  textKey: string | null = null,
) => {
  const state = stateOf(keys)
  const next = selectionReducer(state, {
    type: 'canvas/click',
    key,
    textKey,
    modified,
  })
  return { state, next, keys: next.keys }
}

describe('s51 selection: modifier-click never clobbers', () => {
  it('replaces the selection on a plain click', () => {
    expect(click([CASH], ROTH, false).keys).toEqual([ROTH])
  })

  it('clears the selection on a plain click of empty canvas', () => {
    expect(click([CASH], null, false).keys).toEqual([])
  })

  it('adds a second account on modifier-click', () => {
    expect(click([CASH], ROTH, true).keys).toEqual([CASH, ROTH])
  })

  it('removes an already-selected account on modifier-click', () => {
    expect(click([CASH, ROTH], CASH, true).keys).toEqual([ROTH])
  })

  it('adds a note to an account selection (mixed selection is supported)', () => {
    expect(click([CASH], NOTE, true).keys).toEqual([CASH, NOTE])
  })

  it('preserves the selection when modifier-clicking the as-needed chip', () => {
    // MapItemKey holds only `account:` / `note:` keys, so the chip cannot join a
    // multi-selection. It must be a no-op, never a silent drop of the accounts.
    const { state, next } = click([CASH, ROTH], 'asNeededChip', true)
    expect(next).toBe(state)
  })

  it('preserves the selection when modifier-clicking an arrow', () => {
    const { state, next } = click([CASH], 'arrow:custom:a1', true)
    expect(next).toBe(state)
  })

  it('selects an incompatible target outright when nothing is selected', () => {
    expect(click([], 'asNeededChip', true).keys).toEqual(['asNeededChip'])
  })

  it('drops incompatible keys already in the selection when extending', () => {
    expect(click(['asNeededChip'], CASH, true).keys).toEqual([CASH])
  })

  it('anchors on the item the click acted on', () => {
    expect(click([CASH], ROTH, true).next.anchor).toBe(ROTH)
    expect(click([CASH, ROTH], ROTH, true).next.anchor).toBe(CASH)
  })
})

/**
 * s52 click-again. Account text carries its own hit rect (`text:<acct>:<role>`),
 * but a single plain click on it must resolve to the parent ACCOUNT. The text
 * is only reachable by clicking it again while its account is SOLE-selected,
 * and never by a modifier-click — otherwise shift-clicking two labels can never
 * build the two-account selection that arms + Flow.
 */
describe('s52 click-again: account text resolves to its account first', () => {
  const CASH_LABEL = 'text:cash-at-bank:label'
  const CASH_VALUE = 'text:cash-at-bank:value'
  const ROTH_LABEL = 'text:roth-ira-dana:label'

  /**
   * Mirrors `handleMapClickCapture`: the account under the pointer is the key,
   * the rotatable text on top of it is `textKey`, and the reducer decides which
   * one claims the click.
   */
  const clickAccountText = (
    selection: string[],
    textKey: string,
    modified: boolean,
  ) =>
    click(selection, `account:${textKey.split(':')[1]}`, modified, textKey).keys

  it('selects the account when nothing is selected', () => {
    expect(clickAccountText([], CASH_LABEL, false)).toEqual([CASH])
  })

  it('selects the account when a different account is selected', () => {
    expect(clickAccountText([ROTH], CASH_LABEL, false)).toEqual([CASH])
  })

  it('collapses a multi-selection to the clicked account', () => {
    expect(clickAccountText([CASH, ROTH], CASH_LABEL, false)).toEqual([CASH])
    expect(clickAccountText([NOTE, ROTH], CASH_LABEL, false)).toEqual([CASH])
  })

  it('promotes to the text when its account is already sole-selected', () => {
    expect(clickAccountText([CASH], CASH_LABEL, false)).toEqual([CASH_LABEL])
    expect(clickAccountText([CASH], CASH_VALUE, false)).toEqual([CASH_VALUE])
  })

  it('keeps the text selected on a repeat click', () => {
    expect(clickAccountText([CASH_LABEL], CASH_LABEL, false)).toEqual([CASH_LABEL])
  })

  it('selects the sibling text when a sibling role is clicked', () => {
    // Drill-in: the selection is already inside this account, so the sibling
    // text claims the click directly instead of demoting to the account.
    expect(clickAccountText([CASH_LABEL], CASH_VALUE, false)).toEqual([CASH_VALUE])
  })

  it('extends by ACCOUNT on a modifier-click of account text', () => {
    expect(clickAccountText([CASH], ROTH_LABEL, true)).toEqual([CASH, ROTH])
    expect(clickAccountText([], CASH_LABEL, true)).toEqual([CASH])
  })

  it('removes an already-selected account on a modifier-click of its text', () => {
    expect(clickAccountText([CASH, ROTH], CASH_LABEL, true)).toEqual([ROTH])
  })
})

describe('s51 selection: focus only selects when focus came from the keyboard', () => {
  const element = (focusVisible: boolean) =>
    ({ matches: (selector: string) => selector === ':focus-visible' && focusVisible }) as Element

  it('selects on keyboard focus', () => {
    expect(shouldFocusSelect(element(true))).toBe(true)
  })

  it('defers to the click handler on pointer focus', () => {
    // Pointer focus fires before click; selecting here would clobber a
    // shift-click that is meant to extend the selection.
    expect(shouldFocusSelect(element(false))).toBe(false)
  })

  it('fails open when :focus-visible is unsupported', () => {
    const broken = {
      matches: () => {
        throw new SyntaxError('unknown pseudo-class')
      },
    } as unknown as Element
    expect(shouldFocusSelect(broken)).toBe(true)
  })

  it('fails open without an element', () => {
    expect(shouldFocusSelect(null)).toBe(true)
  })

  it('keyboard focus selects, and tabbing within a selection keeps it', () => {
    // focus/reveal is keyboard-only (every sender is shouldFocusSelect-gated),
    // so it is a positive act: it selects even over an existing selection.
    // Ruled 2026-08-05 — s51-selection-context pins Tab-to-select on a note.
    expect(selectionReducer(stateOf([]), { type: 'focus/reveal', key: NOTE })).toEqual(
      { keys: [NOTE], anchor: NOTE },
    )
    expect(selectionReducer(stateOf([CASH]), { type: 'focus/reveal', key: NOTE })).toEqual(
      { keys: [NOTE], anchor: NOTE },
    )
    const held = stateOf([CASH, NOTE])
    expect(selectionReducer(held, { type: 'focus/reveal', key: NOTE })).toBe(held)
  })

  it('keeps the panel focus echo subordinate', () => {
    // The Form/Wizard onFocusCapture echo carries no modality and no intent —
    // it may speak only into an empty selection.
    const held = stateOf([NOTE])
    expect(
      selectionReducer(held, { type: 'panel/rowFocus', accountId: 'cash-at-bank' }),
    ).toBe(held)
  })
})
