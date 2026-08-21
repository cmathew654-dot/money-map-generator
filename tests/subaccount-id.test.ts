import {
  Children,
  createElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { duplicateClient, newBook, parseBook } from '../src/model/book'
import { layoutMap, OVERRIDE_BOUNDS } from '../src/layout/layout'
import { duplicateMapAccount } from '../src/render/mapInteraction'
import { AccountsSection } from '../src/form/Form'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { MoneyMapData, MoneyMapFile } from '../src/model/types'

type RawSleeve = Record<string, unknown>
type RawBook = {
  clients: Array<{
    accounts: Array<{
      inWaterfall?: boolean
      subAccounts?: RawSleeve[]
    }>
  }>
}

function rawBook(): RawBook {
  return JSON.parse(JSON.stringify({
    fileType: 'money-map-book',
    version: 1,
    clients: [newBook().clients[0]],
  })) as RawBook
}

function rawSleeves(book: RawBook): RawSleeve[] {
  return book.clients.flatMap((client) =>
    client.accounts.flatMap((account) => account.subAccounts ?? []),
  )
}

function parsedSleeves(book: MoneyMapFile): RawSleeve[] {
  return book.clients.flatMap((client) =>
    client.accounts.flatMap((account) =>
      (account.subAccounts ?? []).map(
        (sleeve) => sleeve as unknown as RawSleeve,
      ),
    ),
  )
}

function withoutId(sleeve: RawSleeve): Record<string, unknown> {
  const { id: _id, ...fields } = sleeve
  return fields
}

describe('sleeve ids', () => {
  it.each([
    ['a current client', false],
    ['a legacy waterfall client', true],
  ])('backfills every sleeve from %s without losing its fields', (_label, legacy) => {
    const raw = rawBook()
    const sleeveAccount = raw.clients[0].accounts.find(
      (account) => account.subAccounts,
    )!
    sleeveAccount.inWaterfall = legacy
    for (const sleeve of rawSleeves(raw)) delete sleeve.id
    const before = rawSleeves(raw).map(withoutId)

    const parsed = parseBook(JSON.stringify(raw))
    const after = parsedSleeves(parsed)

    expect(after).toHaveLength(before.length)
    expect(after.map(withoutId)).toEqual(before)
    expect(after.every((sleeve) =>
      typeof sleeve.id === 'string' && sleeve.id.length > 0,
    )).toBe(true)
  })

  it('keeps existing sleeve ids across repeated parsing', () => {
    const raw = rawBook()
    const sleeveAccount = raw.clients[0].accounts.find(
      (account) => account.subAccounts,
    )!
    sleeveAccount.subAccounts = [
      {
        id: 'sleeve-kept',
        label: 'Municipal bonds',
        caption: 'Tax-aware income',
        value: 240_000,
      },
    ]

    const once = parseBook(JSON.stringify(raw))
    const twice = parseBook(JSON.stringify(once))

    expect(parsedSleeves(once).map((sleeve) => sleeve.id)).toEqual([
      'sleeve-kept',
    ])
    expect(parsedSleeves(twice).map((sleeve) => sleeve.id)).toEqual([
      'sleeve-kept',
    ])
  })

  it('leaves an account without subAccounts untouched', () => {
    const raw = rawBook()
    delete raw.clients[0].accounts[0].subAccounts

    const parsed = parseBook(JSON.stringify(raw))

    expect('subAccounts' in parsed.clients[0].accounts[0]).toBe(false)
  })

  it('replaces malformed sleeve ids during load', () => {
    const raw = rawBook()
    const sleeveAccount = raw.clients[0].accounts.find(
      (account) => account.subAccounts,
    )!
    sleeveAccount.subAccounts = [
      { id: 7, label: 'Number id', value: 10 },
      { id: null, label: 'Null id', value: 20 },
      { id: '', label: 'Empty id', value: 30 },
    ]

    const parsed = parseBook(JSON.stringify(raw))
    const ids = parsedSleeves(parsed).map((sleeve) => sleeve.id)

    expect(ids).toHaveLength(3)
    expect(ids.every((id) => typeof id === 'string' && id.length > 0)).toBe(
      true,
    )
  })
  it('ships ids on every sample sleeve', () => {
    const sleeves = [SAMPLE_WHITFIELD, SAMPLE_CALLOWAY, SAMPLE_VENKAT].flatMap(
      (sample) => sample.accounts.flatMap((account) => account.subAccounts ?? []),
    )

    expect(sleeves).not.toHaveLength(0)
    expect(sleeves.every((sleeve) => typeof sleeve.id === 'string' && sleeve.id.length > 0)).toBe(true)
  })
})


function bookWithSleeveEndpoints() {
  const book = newBook()
  const client = book.clients[0]
  const sourceAccount = client.accounts.find(
    (account) => account.subAccounts?.length,
  )!
  const targetAccount = client.accounts.find((account) => account.id === 'managed-after-tax-trust')!
  const targetSleeve = { id: 'sleeve-target', label: 'Equities sleeve', value: 640_000 }
  targetAccount.subAccounts = [targetSleeve]

  return {
    book,
    client,
    sourceAccount,
    sourceSleeve: sourceAccount.subAccounts![0],
    targetAccount,
    targetSleeve,
  }
}

describe('sleeve arrow endpoints', () => {
  it('accepts a sleeve-to-sleeve flow between accounts', () => {
    const { book, client, sourceSleeve, targetSleeve } = bookWithSleeveEndpoints()
    client.customArrows = [{
      id: 'sleeve-to-sleeve',
      sourceId: sourceSleeve.id!,
      targetId: targetSleeve.id,
      style: 'solid',
    }]

    expect(() => parseBook(JSON.stringify(book))).not.toThrow()
  })

  it('accepts a flow from an account to a sleeve', () => {
    const { book, client, sourceAccount, targetSleeve } = bookWithSleeveEndpoints()
    client.customArrows = [{
      id: 'account-to-sleeve',
      sourceId: sourceAccount.id,
      targetId: targetSleeve.id,
      style: 'dashed',
    }]

    expect(() => parseBook(JSON.stringify(book))).not.toThrow()
  })

  it('still rejects a flow connected to an unknown item', () => {
    const { book, client } = bookWithSleeveEndpoints()
    client.customArrows = [{
      id: 'unknown-endpoint',
      sourceId: 'not-on-the-map',
      targetId: 'need',
      style: 'solid',
    }]

    expect(() => parseBook(JSON.stringify(book))).toThrow(
      'flow connected to an item that is no longer in the map',
    )
  })

  it('names a sleeve in its self-connection error', () => {
    const { book, client, sourceSleeve } = bookWithSleeveEndpoints()
    client.customArrows = [{
      id: 'sleeve-self',
      sourceId: sourceSleeve.id!,
      targetId: sourceSleeve.id!,
      style: 'solid',
    }]

    expect(() => parseBook(JSON.stringify(book))).toThrow(
      'Short-Term Funds to itself',
    )
  })

  it('gives a duplicated client fresh sleeve ids and remaps sleeve flows', () => {
    const { book, client, sourceAccount, sourceSleeve, targetAccount, targetSleeve } = bookWithSleeveEndpoints()
    client.customArrows = [{
      id: 'copied-sleeve-flow',
      sourceId: sourceSleeve.id!,
      targetId: targetSleeve.id,
      style: 'solid',
    }]

    const result = duplicateClient(book, client.id)
    const copy = result.book.clients.find((candidate) => candidate.id === result.id)!
    const originalSleeves = client.accounts.flatMap(
      (account) => account.subAccounts ?? [],
    )
    const copiedSleeves = copy.accounts.flatMap(
      (account) => account.subAccounts ?? [],
    )

    expect(copiedSleeves.map((sleeve) => sleeve.id)).not.toEqual(
      originalSleeves.map((sleeve) => sleeve.id),
    )
    const copiedSourceSleeve = copy.accounts.find(
      (account) => account.label === sourceAccount.label,
    )!.subAccounts![0]
    const copiedTargetSleeve = copy.accounts.find(
      (account) => account.label === targetAccount.label,
    )!.subAccounts![0]

    expect(copy.customArrows).toEqual([
      expect.objectContaining({
        sourceId: copiedSourceSleeve.id,
        targetId: copiedTargetSleeve.id,
      }),
    ])
    expect(() => parseBook(JSON.stringify(result.book))).not.toThrow()
  })

  it('gives a single duplicated account fresh sleeve ids', () => {
    const { client, sourceAccount } = bookWithSleeveEndpoints()
    const sourceRect = layoutMap(client).accounts.find(
      (placed) => placed.account.id === sourceAccount.id,
    )!
    const result = duplicateMapAccount(
      client,
      sourceAccount.id,
      sourceRect,
      [],
      OVERRIDE_BOUNDS,
    )

    expect(result).not.toBeNull()
    const copy = result!.data.accounts.find(
      (account) => account.id !== sourceAccount.id && account.label === sourceAccount.label,
    )!
    expect(copy.subAccounts?.map((sleeve) => sleeve.id)).not.toEqual(
      sourceAccount.subAccounts?.map((sleeve) => sleeve.id),
    )
  })
})
type Button = ReactElement<{
  children?: ReactNode
  onClick?: () => void
}>

function findElement(
  node: ReactNode,
  predicate: (element: ReactElement) => boolean,
): ReactElement | undefined {
  if (!isValidElement(node)) return undefined
  if (predicate(node)) return node
  const { children } = node.props as { children?: ReactNode }
  for (const child of Children.toArray(children)) {
    const found = findElement(child, predicate)
    if (found) return found
  }
  return undefined
}

function renderComponent(element: ReactElement): ReactNode {
  return (element.type as (props: unknown) => ReactNode)(element.props)
}

function addSubAccountButton(
  data: MoneyMapData,
  onChange: (next: MoneyMapData) => void,
): Button {
  let button: Button | undefined

  function Probe() {
    const section = AccountsSection({
      data,
      onChange,
      selectedAccountId: data.accounts[0].id,
    })
    const card = findElement(section, (element) => {
      const props = element.props as { account?: unknown }
      return typeof element.type === 'function' && props.account !== undefined
    })
    if (!card) throw new Error('Missing account card.')
    const subAccountRows = findElement(renderComponent(card), (element) => {
      const props = element.props as { subAccounts?: unknown }
      return typeof element.type === 'function' && Array.isArray(props.subAccounts)
    })
    if (!subAccountRows) throw new Error('Missing sub-account rows.')
    button = findElement(renderComponent(subAccountRows), (element) => {
      const props = element.props as { children?: ReactNode; onClick?: () => void }
      return element.type === 'button' && props.children === '+ Add sub-account' && Boolean(props.onClick)
    }) as Button | undefined
    return null
  }

  renderToStaticMarkup(createElement(Probe))
  if (!button) throw new Error('Missing add sub-account button.')
  return button
}

describe('new sleeves', () => {
  it('gets distinct ids immediately from the Data form', () => {
    let current = blankClient()
    current.accounts = [{
      id: 'account-form-test',
      bucket: 'cash',
      label: 'Cash at Bank',
      value: 25_000,
    }]
    const onChange = (next: MoneyMapData) => {
      current = next
    }

    addSubAccountButton(current, onChange).props.onClick!()
    addSubAccountButton(current, onChange).props.onClick!()

    const sleeves = current.accounts[0].subAccounts!
    expect(sleeves).toEqual([
      { id: expect.stringMatching(/^sleeve-/), label: '', caption: '', value: null },
      { id: expect.stringMatching(/^sleeve-/), label: '', caption: '', value: null },
    ])
    expect(sleeves[0].id).not.toBe(sleeves[1].id)
  })
})
