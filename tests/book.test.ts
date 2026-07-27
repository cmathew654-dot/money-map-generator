import { describe, expect, it } from 'vitest'
import {
  addClient,
  deleteClient,
  duplicateClient,
  newBook,
  parseBook,
  updateClient,
} from '../src/model/book'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'

describe('book operations', () => {
  it('creates a truly blank client', () => {
    const blank = blankClient()

    expect(blank.client).toEqual({
      title: '',
      year: '',
      variant: 'annual',
    })
    expect(blank.incomeSources).toEqual([])
    expect(blank.accounts).toEqual([])
    expect(blank.afterTaxIncome).toBeNull()
    expect(blank.monthlyNeed).toBeNull()
    expect(blank.asNeededAmount).toBeNull()
  })

  it('starts with three samples and one blank client', () => {
    const book = newBook()

    expect(book.fileType).toBe('money-map-book')
    expect(book.version).toBe(1)
    expect(book.clients).toHaveLength(4)
    expect(book.clients[0]).toEqual(SAMPLE_WHITFIELD)
    expect(book.clients[1]).toEqual(SAMPLE_CALLOWAY)
    expect(book.clients[2]).toEqual(SAMPLE_VENKAT)
    expect(book.clients[3].client.title).toBe('')
    expect(book.clients[3].id).not.toBe('')
    expect(book.clients[3].accounts).toEqual([])
    expect(book.clients[3].incomeSources).toEqual([])
  })

  it('adds a titled blank client without mutating the book', () => {
    const original = newBook()
    const result = addClient(original)

    expect(original.clients).toHaveLength(4)
    expect(result.book.clients).toHaveLength(5)
    expect(result.book.clients.at(-1)?.client.title).toBe('New Client')
    expect(result.book.clients.at(-1)?.id).toBe(result.id)
  })

  it('duplicates deeply with fresh client and account ids', () => {
    const original = newBook()
    const source = original.clients[0]
    const result = duplicateClient(original, source.id)
    const copy = result.book.clients.at(-1)!

    expect(copy.client.title).toBe(`${source.client.title} (copy)`)
    expect(copy.id).toBe(result.id)
    expect(copy.id).not.toBe(source.id)
    expect(copy.accounts.map((account) => account.id)).not.toEqual(
      source.accounts.map((account) => account.id),
    )
    copy.client.year = '2040'
    expect(source.client.year).toBe('2026')
  })

  it('rejects duplication of an unknown client', () => {
    expect(() => duplicateClient(newBook(), 'missing')).toThrow(
      'Client to duplicate was not found.',
    )
  })

  it('deletes a client and replaces the final client with a blank', () => {
    const book = newBook()
    const remaining = deleteClient(book, book.clients[0].id)
    const emptied = deleteClient(
      { ...remaining, clients: [remaining.clients[0]] },
      remaining.clients[0].id,
    )

    expect(remaining.clients).toHaveLength(3)
    expect(emptied.clients).toHaveLength(1)
    expect(emptied.clients[0].client.title).toBe('')
    expect(emptied.clients[0].id).not.toBe('')
  })

  it('replaces a client by id without changing file order', () => {
    const book = newBook()
    const replacement = structuredClone(book.clients[0])
    replacement.client.title = 'Updated'
    const updated = updateClient(book, replacement.id, replacement)

    expect(updated.clients[0]).toBe(replacement)
    expect(updated.clients[1]).toBe(book.clients[1])
    expect(book.clients[0].client.title).toBe('Jordan & Dana Whitfield')
  })
})

describe('parseBook', () => {
  it('parses a valid book', () => {
    const book = newBook()
    expect(parseBook(JSON.stringify(book))).toEqual(book)
  })

  it('round-trips a client with layout overrides', () => {
    const book = newBook()
    book.clients[0].layoutOverrides = {
      income: { dx: 24, dy: -12 },
      'managed-ira-jordan': { dx: -80, dy: 60, w: 340, h: 280 },
      asNeededChip: { dx: 30, dy: 18 },
    }

    expect(parseBook(JSON.stringify(book))).toEqual(book)
  })

  it('loads a legacy book without layout overrides', () => {
    const legacy = newBook()
    for (const client of legacy.clients) {
      delete client.layoutOverrides
    }

    const parsed = parseBook(JSON.stringify(legacy))

    expect(parsed).toEqual(legacy)
    expect(parsed.clients[0].layoutOverrides).toBeUndefined()
  })

  it('rejects malformed JSON with a human message', () => {
    expect(() => parseBook('{bad json')).toThrow(
      'The selected file is not valid JSON.',
    )
  })

  it('rejects the wrong file type', () => {
    const value = { ...newBook(), fileType: 'something-else' }
    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'wrong file type',
    )
  })

  it('rejects the wrong version', () => {
    const value = { ...newBook(), version: 2 }
    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'version is not supported',
    )
  })

  it('rejects non-array clients', () => {
    const value = { ...newBook(), clients: {} }
    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'clients array',
    )
  })

  it('rejects invalid client shapes', () => {
    const value = { ...newBook(), clients: [{ id: 'incomplete' }] }
    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'missing client details',
    )
  })
})
