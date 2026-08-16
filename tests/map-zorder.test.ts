import { describe, expect, it } from 'vitest'
import {
  parseBook,
  pushHistory,
  resetArrangement,
  undoHistory,
} from '../src/model/book'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { sortMapItemsByZ } from '../src/layout/layout'
import { reorderMapItem } from '../src/render/mapInteraction'

describe('manual map z-order', () => {
  it('sorts by z override while preserving source order for ties', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        first: { z: 2 },
        third: { z: 1 },
      },
    }
    const items = ['first', 'second', 'third', 'fourth']

    expect(sortMapItemsByZ(items, data, (item) => item)).toEqual([
      'second',
      'fourth',
      'third',
      'first',
    ])
  })

  it('moves selected items through the shared account and note order', () => {
    const note = { id: 'note-1', text: 'Note', x: 0, y: 0 }
    const data = {
      ...SAMPLE_WHITFIELD,
      accounts: SAMPLE_WHITFIELD.accounts.slice(0, 2),
      notes: [note],
    }
    const keys = ['cash-at-bank', 'ira', 'note:note-1']
    const next = reorderMapItem(data, 'cash-at-bank', 'forward')

    expect(sortMapItemsByZ(keys, next, (item) => item)).toEqual([
      'ira',
      'cash-at-bank',
      'note:note-1',
    ])
  })

  it('brings an item to front and sends it to back', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      accounts: SAMPLE_WHITFIELD.accounts.slice(0, 3),
    }
    const keys = data.accounts.map((account) => account.id)

    const front = reorderMapItem(data, keys[0], 'front')
    expect(sortMapItemsByZ(keys, front, (item) => item).at(-1)).toBe(keys[0])

    const back = reorderMapItem(front, keys[0], 'back')
    expect(sortMapItemsByZ(keys, back, (item) => item)[0]).toBe(keys[0])
  })

  it('reset arrangement clears z overrides', () => {
    const data = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: { 'cash-at-bank': { z: 3 } },
    }

    expect(resetArrangement(data).layoutOverrides).toBeUndefined()
  })

  it('persists z overrides and undo restores the prior z order', () => {
    const before = { ...SAMPLE_WHITFIELD }
    const after = reorderMapItem(before, 'cash-at-bank', 'front')
    const book = { fileType: 'money-map-book' as const, version: 1 as const, clients: [after] }
    const parsed = parseBook(JSON.stringify(book))
    expect(parsed.clients[0].layoutOverrides?.['cash-at-bank']?.z).toBeDefined()

    const history = pushHistory(
      { past: [], future: [] },
      { book: { ...book, clients: [before] }, activeClientId: before.id },
      { book, activeClientId: before.id },
      before.id,
      Date.now(),
    )
    const undone = undoHistory(history)
    expect(undone.snapshot?.book.clients[0].layoutOverrides?.['cash-at-bank']?.z).toBeUndefined()
  })
})
