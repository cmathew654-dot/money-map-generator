import { describe, expect, it } from 'vitest'

import {
  EMPTY_SELECTION,
  selectionReducer,
  type SelectionState,
} from '../src/render/selection'

const CASH = 'account:cash-at-bank'
const ROTH = 'account:roth-ira-dana'
const NOTE = 'note:note-1'

const state = (keys: string[]): SelectionState => ({
  keys,
  anchor: keys.at(-1) ?? null,
})

const rowFocus = (from: SelectionState, accountId: string) =>
  selectionReducer(from, { type: 'panel/rowFocus', accountId })

const rowClick = (from: SelectionState, accountId: string, modified = false) =>
  selectionReducer(from, { type: 'panel/rowClick', accountId, modified })

/**
 * The Data panel reports the account it focused back as a selection. That echo
 * used to be a selection write like any other (`panelSelectionKeys`), so it had
 * to be hand-guarded against narrowing what the map had just built. It is now a
 * SUBORDINATE event: it can speak only into an empty selection, and is a no-op
 * — by reference — on anything else.
 */
describe('s51 A1b: the panel focus echo is subordinate', () => {
  it('selects the focused account when nothing is selected', () => {
    expect(rowFocus(EMPTY_SELECTION, 'cash-at-bank')).toEqual({
      keys: [CASH],
      anchor: CASH,
    })
  })

  it('is a no-op on any non-empty selection, whoever it holds', () => {
    for (const keys of [[CASH], [CASH, ROTH], [NOTE, CASH], ['text:cash-at-bank:label']]) {
      const before = state(keys)
      // Reference identity, not just equality: the prune effect depends on it.
      expect(rowFocus(before, 'roth-ira-dana')).toBe(before)
      expect(rowFocus(before, 'cash-at-bank')).toBe(before)
    }
  })
})

/**
 * A row CLICK is a primary act and shares one rule with the canvas — so a
 * modifier-click builds the same multi-selection in the sidebar as on the map.
 */
describe('s54: a panel row click follows the canvas modifier rule', () => {
  it('replaces the selection on a plain click', () => {
    expect(rowClick(state([CASH, NOTE]), 'roth-ira-dana')).toEqual({
      keys: [ROTH],
      anchor: ROTH,
    })
  })

  it('extends the selection on a modifier-click', () => {
    expect(rowClick(state([CASH]), 'roth-ira-dana', true)).toEqual({
      keys: [CASH, ROTH],
      anchor: ROTH,
    })
  })

  it('removes an already-selected account on a modifier-click', () => {
    expect(rowClick(state([CASH, ROTH]), 'cash-at-bank', true)).toEqual({
      keys: [ROTH],
      anchor: ROTH,
    })
  })
})
