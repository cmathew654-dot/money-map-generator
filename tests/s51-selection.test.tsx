import { describe, expect, it } from 'vitest'

import { SAMPLE_WHITFIELD } from '../src/model/samples'
import {
  accountTextClickKey,
  nextSelectedTargetKeys,
  shouldFocusSelect,
} from '../src/render/MapSvg'

const CASH = 'account:cash-at-bank'
const ROTH = 'account:roth-ira-dana'
const NOTE = 'note:note-1'

/**
 * `nextSelectedTargetKeys` is the whole selection decision for a map click.
 * It returns `null` to mean "leave the selection exactly as it is".
 */
describe('s51 selection: modifier-click never clobbers', () => {
  it('replaces the selection on a plain click', () => {
    expect(nextSelectedTargetKeys([CASH], ROTH, false)).toEqual([ROTH])
  })

  it('clears the selection on a plain click of empty canvas', () => {
    expect(nextSelectedTargetKeys([CASH], null, false)).toEqual([])
  })

  it('adds a second account on modifier-click', () => {
    expect(nextSelectedTargetKeys([CASH], ROTH, true)).toEqual([CASH, ROTH])
  })

  it('removes an already-selected account on modifier-click', () => {
    expect(nextSelectedTargetKeys([CASH, ROTH], CASH, true)).toEqual([ROTH])
  })

  it('adds a note to an account selection (mixed selection is supported)', () => {
    expect(nextSelectedTargetKeys([CASH], NOTE, true)).toEqual([CASH, NOTE])
  })

  it('preserves the selection when modifier-clicking the as-needed chip', () => {
    // MapItemKey holds only `account:` / `note:` keys, so the chip cannot join a
    // multi-selection. It must be a no-op, never a silent drop of the accounts.
    expect(nextSelectedTargetKeys([CASH, ROTH], 'asNeededChip', true)).toBeNull()
  })

  it('preserves the selection when modifier-clicking an arrow', () => {
    expect(nextSelectedTargetKeys([CASH], 'arrow:custom:a1', true)).toBeNull()
  })

  it('selects an incompatible target outright when nothing is selected', () => {
    expect(nextSelectedTargetKeys([], 'asNeededChip', true)).toEqual([
      'asNeededChip',
    ])
  })

  it('drops incompatible keys already in the selection when extending', () => {
    expect(nextSelectedTargetKeys(['asNeededChip'], CASH, true)).toEqual([CASH])
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
   * Mirrors `handleMapClickCapture`: `accountTextClickKey` decides whether the
   * text claims the click; otherwise the click falls through to the account
   * the text sits inside, and either way the key feeds the selection rules.
   */
  const clickAccountText = (
    selection: string[],
    textKey: string,
    modified: boolean,
  ) =>
    nextSelectedTargetKeys(
      selection,
      accountTextClickKey(SAMPLE_WHITFIELD, textKey, selection, modified) ??
        `account:${textKey.split(':')[1]}`,
      modified,
    )

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
})
