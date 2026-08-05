import { describe, expect, it } from 'vitest'

import { panelSelectionKeys } from '../src/App'

const CASH = 'account:cash-at-bank'
const ROTH = 'account:roth-ira-dana'
const NOTE = 'note:note-1'

/**
 * The Data panel reports the account it focused back to App as a selection.
 * That report must never narrow a selection the map already built — with the
 * panel open, a map shift-click focuses the newly added account, and the old
 * single-key setter collapsed the pair to one (the A1b defect).
 */
describe('s51 A1b: panel-driven selection never narrows the map selection', () => {
  it('selects an account the map selection does not hold', () => {
    expect(panelSelectionKeys([CASH], 'roth-ira-dana')).toEqual([ROTH])
    expect(panelSelectionKeys([], 'cash-at-bank')).toEqual([CASH])
  })

  it('keeps a multi-selection that already holds the focused account', () => {
    expect(panelSelectionKeys([CASH, ROTH], 'roth-ira-dana')).toEqual([CASH, ROTH])
    expect(panelSelectionKeys([CASH, ROTH], 'cash-at-bank')).toEqual([CASH, ROTH])
  })

  it('keeps a mixed selection, so notes are not silently dropped', () => {
    expect(panelSelectionKeys([NOTE, CASH], 'cash-at-bank')).toEqual([NOTE, CASH])
  })

  it('collapses a multi-selection that does not hold the focused account', () => {
    // A plain row click on an unselected account still selects it alone.
    expect(panelSelectionKeys([CASH, NOTE], 'roth-ira-dana')).toEqual([ROTH])
  })

  it('returns the same array when nothing changes, so React skips the render', () => {
    const keys = [CASH, ROTH]
    expect(panelSelectionKeys(keys, 'roth-ira-dana')).toBe(keys)
  })
})
