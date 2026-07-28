import { describe, expect, it } from 'vitest'
import {
  ACCOUNT_PRESETS,
  accountDefaultsFor,
  addClient,
  appendBlankAccount,
  blankAccountFor,
  clearedClient,
  deleteClient,
  duplicateClient,
  migrateClient,
  newBook,
  parseBook,
  resetArrangement,
  updateClient,
} from '../src/model/book'
import { layoutMap } from '../src/layout/layout'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import {
  ACCOUNT_SHAPES,
  accountShape,
  nextAccountShape,
  type Bucket,
} from '../src/model/types'

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
    expect(blank.showMath).toBeUndefined()
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

  it('duplicates custom arrows with fresh ids and remapped accounts', () => {
    const original = newBook()
    const source = original.clients[0]
    source.customArrows = [
      {
        id: 'custom-one',
        sourceId: source.accounts[0].id,
        targetId: source.accounts[1].id,
        style: 'dotted',
      },
      {
        id: 'custom-two',
        sourceId: 'income',
        targetId: source.accounts[0].id,
        style: 'solid',
      },
    ]
    const result = duplicateClient(original, source.id)
    const copy = result.book.clients.at(-1)!

    expect(copy.customArrows).toHaveLength(2)
    expect(copy.customArrows?.map((arrow) => arrow.id)).not.toEqual(
      source.customArrows!.map((arrow) => arrow.id),
    )
    expect(copy.customArrows?.[0]).toMatchObject({
      sourceId: copy.accounts[0].id,
      targetId: copy.accounts[1].id,
    })
    expect(copy.customArrows?.[1]).toMatchObject({
      sourceId: 'income',
      targetId: copy.accounts[0].id,
    })
  })

  it('duplicates map notes with fresh ids and unchanged content', () => {
    const original = newBook()
    const source = original.clients[0]
    source.notes = [
      { id: 'note-one', text: 'Keep six months liquid.', x: 420, y: 510 },
    ]

    const copy = duplicateClient(original, source.id).book.clients.at(-1)!

    expect(copy.notes).toEqual([
      {
        id: expect.stringMatching(/^note-/),
        text: 'Keep six months liquid.',
        x: 420,
        y: 510,
      },
    ])
    expect(copy.notes?.[0].id).not.toBe(source.notes[0].id)
  })

  it('remaps account text overrides when duplicating a client', () => {
    const original = newBook()
    const source = original.clients[0]
    const sourceAccount = source.accounts[0]
    source.layoutOverrides = {
      [`text:${sourceAccount.id}:label`]: { fs: 23, dx: 12 },
    }

    const copy = duplicateClient(original, source.id).book.clients.at(-1)!
    const copyKey = `text:${copy.accounts[0].id}:label`

    expect(copy.layoutOverrides?.[copyKey]).toEqual({ fs: 23, dx: 12 })
    expect(copy.layoutOverrides).not.toHaveProperty(
      `text:${sourceAccount.id}:label`,
    )
  })

  it('preserves fixed-element text overrides when duplicating a client', () => {
    const original = newBook()
    const source = original.clients[0]
    source.layoutOverrides = {
      'text:legend:label': { fs: 18, dx: 12, dy: -4 },
    }

    const copy = duplicateClient(original, source.id).book.clients.at(-1)!

    expect(copy.layoutOverrides?.['text:legend:label']).toEqual({
      fs: 18,
      dx: 12,
      dy: -4,
    })
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

  it('clears map content while preserving identity, profile, and showMath', () => {
    const source = structuredClone(SAMPLE_WHITFIELD)
    source.client.variant = 'postNote'
    source.client.postNoteLabel = 'April 2026'
    source.showMath = false
    source.needTag = 'goal'
    source.notes = [
      { id: 'clear-me', text: 'Remove with client data.', x: 500, y: 500 },
    ]
    source.accounts[0].valueTag = 'est.'
    source.layoutOverrides = {
      income: { dx: 24, dy: -12 },
      [`text:${source.accounts[0].id}:label`]: {
        dx: 18,
        dy: -6,
        fs: 22,
      },
    }

    const cleared = clearedClient(source)

    expect(cleared).toEqual({
      id: source.id,
      client: source.client,
      showMath: false,
      incomeSources: [],
      afterTaxIncome: null,
      monthlyNeed: null,
      asNeededAmount: null,
      accounts: [],
      footnotes: [],
    })
    expect(cleared.client).not.toBe(source.client)
    expect(cleared.layoutOverrides).toBeUndefined()
    expect(source.accounts).not.toEqual([])
    expect(source.layoutOverrides).toBeDefined()
  })

  it('resets account text overrides with the rest of the arrangement', () => {
    const source = structuredClone(SAMPLE_WHITFIELD)
    source.layoutOverrides = {
      income: { dx: 24 },
      [`text:${source.accounts[0].id}:caption`]: {
        dx: 60,
        dy: -30,
        fs: 19,
      },
    }

    const reset = resetArrangement(source)

    expect(reset.layoutOverrides).toBeUndefined()
    expect(source.layoutOverrides).toBeDefined()
  })

  it('lays out and validates a cleared client', () => {
    const book = newBook()
    book.clients[0] = clearedClient(book.clients[0])

    expect(() => layoutMap(book.clients[0])).not.toThrow()
    expect(parseBook(JSON.stringify(book))).toEqual(book)
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
      [`text:${book.clients[0].accounts[0].id}:label`]: {
        dx: 12,
        dy: -8,
        fs: 24,
      },
      'text:legend:label': { fs: 18 },
      'text:income:row': { fs: 20 },
      'text:need:value': { fs: 40 },
    }

    expect(parseBook(JSON.stringify(book))).toEqual(book)
  })

  it.each([
    ['malformed role', 'text:managed-ira-jordan:subtitle', { fs: 16 }],
    ['missing account', 'text:missing:label', { fs: 16 }],
    ['fixed income role', 'text:income:bogus', { fs: 16 }],
    ['fixed footnote role', 'text:footnotes:label', { fs: 16 }],
    ['font size on a shape', 'managed-ira-jordan', { fs: 16 }],
  ])('rejects a %s text override key', (_label, key, override) => {
    const book = newBook()
    book.clients[0].layoutOverrides = { [key]: override }

    expect(() => parseBook(JSON.stringify(book))).toThrow(
      'Client 1 has invalid layout overrides.',
    )
  })

  it('round-trips explicit account shapes', () => {
    const book = newBook()
    book.clients[0].accounts.slice(0, 4).forEach((account, index) => {
      account.shape = ACCOUNT_SHAPES[index]
    })

    expect(parseBook(JSON.stringify(book))).toEqual(book)
  })

  it('loads a legacy book without shapes or layout overrides', () => {
    const legacy = newBook()
    for (const client of legacy.clients) {
      delete client.layoutOverrides
      for (const account of client.accounts) delete account.shape
    }

    const parsed = parseBook(JSON.stringify(legacy))

    expect(parsed).toEqual(legacy)
    expect(parsed.clients[0].layoutOverrides).toBeUndefined()
    expect(parsed.clients[0].accounts[0].shape).toBeUndefined()
    expect(parsed.clients[0].showMath).toBeUndefined()
  })

  it('accepts absent or well-formed custom arrows', () => {
    const legacy = newBook()
    expect(parseBook(JSON.stringify(legacy))).toEqual(legacy)

    legacy.clients[0].customArrows = [
      {
        id: 'custom-one',
        sourceId: 'income',
        targetId: legacy.clients[0].accounts[0].id,
        style: 'dashed',
      },
    ]
    expect(parseBook(JSON.stringify(legacy))).toEqual(legacy)
  })

  it('normalizes legacy style-absent arrows to their shipped solid look', () => {
    const legacy = newBook()
    legacy.clients[0].customArrows = [
      {
        id: 'legacy-solid',
        sourceId: 'income',
        targetId: 'need',
      } as never,
    ]

    const parsed = parseBook(JSON.stringify(legacy))

    expect(parsed.clients[0].customArrows?.[0].style).toBe('solid')
  })

  it('validates hidden generated arrows', () => {
    const book = newBook()
    book.clients[0].hiddenArrows = ['income', 'asNeeded']
    expect(parseBook(JSON.stringify(book))).toEqual(book)

    const invalid = newBook() as unknown as {
      clients: { hiddenArrows?: unknown }[]
    }
    invalid.clients[0].hiddenArrows = ['waterfall']
    expect(() => parseBook(JSON.stringify(invalid))).toThrow(
      'Client 1 has invalid hidden arrows.',
    )
  })

  it('migrates a legacy three-account chain once and transfers overrides', () => {
    const legacy = {
      ...blankClient(),
      accounts: [
        {
          id: 'short',
          bucket: 'shortTerm' as const,
          label: 'Short',
          value: 100,
          inWaterfall: true,
        },
        {
          id: 'ira',
          bucket: 'taxDeferred' as const,
          label: 'IRA',
          value: 300,
          inWaterfall: true,
        },
        {
          id: 'trust',
          bucket: 'afterTax' as const,
          label: 'Trust',
          value: 200,
          inWaterfall: true,
        },
      ],
      layoutOverrides: {
        'arrow:waterfall:ira': { bow: 44, startT: 0.2 },
      },
    }

    const once = migrateClient(legacy)
    const twice = migrateClient(once)

    expect(twice).toEqual(once)
    expect(once.accounts.every((account) => !account.inWaterfall)).toBe(true)
    expect(once.customArrows).toEqual([
      {
        id: 'migrated-flow:ira',
        sourceId: 'ira',
        targetId: 'trust',
        style: 'dotted',
      },
      {
        id: 'migrated-flow:trust',
        sourceId: 'trust',
        targetId: 'short',
        style: 'dotted',
      },
    ])
    expect(once.layoutOverrides).not.toHaveProperty(
      'arrow:waterfall:ira',
    )
    expect(
      once.layoutOverrides?.['arrow:custom:migrated-flow:ira'],
    ).toEqual({ bow: 44, startT: 0.2 })
  })

  it('accepts absent or well-formed notes and value tags', () => {
    const legacy = newBook()
    expect(parseBook(JSON.stringify(legacy))).toEqual(legacy)

    legacy.clients[0].needTag = 'goal'
    legacy.clients[0].accounts[0].valueTag = 'est.'
    legacy.clients[0].notes = [
      { id: 'note-one', text: 'Review at year end.', x: 500, y: 420 },
    ]

    expect(parseBook(JSON.stringify(legacy))).toEqual(legacy)
  })

  it.each([
    {},
    [{ id: 1, text: 'Note', x: 10, y: 20 }],
    [{ id: 'note', text: null, x: 10, y: 20 }],
    [{ id: 'note', text: 'Note', x: 'left', y: 20 }],
    [{ id: 'note', text: 'Note', x: 10, y: null }],
  ])('rejects malformed map notes with a human message', (notes) => {
    const value = newBook() as unknown as {
      clients: { notes?: unknown }[]
    }
    value.clients[0].notes = notes

    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'Client 1 has invalid map notes.',
    )
  })

  it('rejects malformed value tags with human messages', () => {
    const invalidNeed = newBook() as unknown as {
      clients: { needTag?: unknown }[]
    }
    invalidNeed.clients[0].needTag = 12
    expect(() => parseBook(JSON.stringify(invalidNeed))).toThrow(
      'Client 1 has an invalid need tag.',
    )

    const invalidAccount = newBook() as unknown as {
      clients: { accounts: { valueTag?: unknown }[] }[]
    }
    invalidAccount.clients[0].accounts[0].valueTag = false
    expect(() => parseBook(JSON.stringify(invalidAccount))).toThrow(
      'Client 1 has an invalid account value tag.',
    )
  })

  it.each([
    {},
    [{ id: 1, sourceId: 'income', targetId: 'need' }],
    [{ id: 'arrow', sourceId: 2, targetId: 'need' }],
    [{ id: 'arrow', sourceId: 'income', targetId: null }],
  ])('rejects malformed custom arrows with a human message', (customArrows) => {
    const value = newBook() as unknown as {
      clients: { customArrows?: unknown }[]
    }
    value.clients[0].customArrows = customArrows

    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'Client 1 has invalid custom arrows.',
    )
  })

  it('round-trips explicit math visibility', () => {
    const book = newBook()
    book.clients[0].showMath = false

    expect(parseBook(JSON.stringify(book))).toEqual(book)
  })

  it('rejects invalid math visibility', () => {
    const value = newBook() as unknown as {
      clients: { showMath?: unknown }[]
    }
    value.clients[0].showMath = 'yes'

    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'invalid math visibility',
    )
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

  it('rejects an invalid explicit account shape', () => {
    const value = newBook() as unknown as {
      clients: { accounts: { shape?: string }[] }[]
    }
    value.clients[0].accounts[0].shape = 'triangle'

    expect(() => parseBook(JSON.stringify(value))).toThrow(
      'invalid account shape',
    )
  })
})

describe('account shapes', () => {
  it.each([
    ['shortTerm', 'drum'],
    ['afterTax', 'drum'],
    ['taxDeferred', 'drum'],
    ['taxPreferred', 'drum'],
    ['charitable', 'drum'],
    ['cash', 'drum'],
    ['note', 'card'],
  ] satisfies [Bucket, string][])(
    'derives the %s bucket default as %s',
    (bucket, expected) => {
      expect(accountShape({ bucket })).toBe(expected)
    },
  )

  it('honors an explicit shape and cycles through the palette purely', () => {
    expect(accountShape({ bucket: 'note', shape: 'pill' })).toBe('pill')
    expect(ACCOUNT_SHAPES.map(nextAccountShape)).toEqual([
      'card',
      'rect',
      'pill',
      'drum',
    ])
    expect(ACCOUNT_SHAPES).toEqual(['drum', 'card', 'rect', 'pill'])
  })
})

describe('account bucket defaults', () => {
  it.each([
    ['shortTerm', 'drum'],
    ['afterTax', 'drum'],
    ['taxDeferred', 'drum'],
    ['taxPreferred', 'drum'],
    ['charitable', 'drum'],
    ['cash', 'drum'],
    ['note', 'card'],
  ] satisfies [Bucket, string][])(
    'shares the %s defaults with the form preset',
    (bucket, shape) => {
      const defaults = accountDefaultsFor(bucket)
      const preset = ACCOUNT_PRESETS.find(
        (item) => item.bucket === bucket,
      )

      expect(defaults).toEqual({ bucket, shape })
      expect(preset).toMatchObject(defaults)
    },
  )

  it('creates blank accounts with fresh ids and no caption', () => {
    const first = blankAccountFor('cash')
    const second = blankAccountFor('cash')

    expect(first).toEqual({
      id: expect.stringMatching(/^account-/),
      bucket: 'cash',
      shape: 'drum',
      label: '',
      value: null,
    })
    expect(second.id).not.toBe(first.id)
    expect(first).not.toHaveProperty('caption')
  })

  it('appends exactly one blank account without touching existing accounts', () => {
    const original = SAMPLE_WHITFIELD
    const existingAccounts = original.accounts
    const appended = appendBlankAccount(original, 'note')

    expect(appended.accounts).toHaveLength(existingAccounts.length + 1)
    expect(appended.accounts.slice(0, -1)).toEqual(existingAccounts)
    expect(
      appended.accounts.slice(0, -1).every(
        (account, index) => account === existingAccounts[index],
      ),
    ).toBe(true)
    expect(appended.accounts.at(-1)).toMatchObject({
      bucket: 'note',
      shape: 'card',
      label: '',
      value: null,
    })
    expect(original.accounts).toBe(existingAccounts)
  })
})
