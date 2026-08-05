import { describe, expect, it } from 'vitest'

import {
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
