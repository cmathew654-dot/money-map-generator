import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from './samples'
import type { MoneyMapData, MoneyMapFile } from './types'
import { newId } from './types'

function withFreshIds(data: MoneyMapData): MoneyMapData {
  const copy = structuredClone(data)
  copy.id = newId('client')
  copy.accounts = copy.accounts.map((account) => ({
    ...account,
    id: newId('account'),
  }))
  return copy
}

function makeBlankClient(title = ''): MoneyMapData {
  const client = withFreshIds(blankClient())
  client.client.title = title
  return client
}

export function newBook(): MoneyMapFile {
  return {
    fileType: 'money-map-book',
    version: 1,
    clients: [
      structuredClone(SAMPLE_WHITFIELD),
      structuredClone(SAMPLE_CALLOWAY),
      structuredClone(SAMPLE_VENKAT),
      makeBlankClient(),
    ],
  }
}

export function addClient(
  book: MoneyMapFile,
): { book: MoneyMapFile; id: string } {
  const client = makeBlankClient('New Client')
  return {
    book: { ...book, clients: [...book.clients, client] },
    id: client.id,
  }
}

export function duplicateClient(
  book: MoneyMapFile,
  id: string,
): { book: MoneyMapFile; id: string } {
  const source = book.clients.find((client) => client.id === id)
  if (!source) throw new Error('Client to duplicate was not found.')

  const copy = withFreshIds(source)
  copy.client.title = `${source.client.title} (copy)`
  return {
    book: { ...book, clients: [...book.clients, copy] },
    id: copy.id,
  }
}

export function deleteClient(
  book: MoneyMapFile,
  id: string,
): MoneyMapFile {
  const clients = book.clients.filter((client) => client.id !== id)
  return {
    ...book,
    clients: clients.length > 0 ? clients : [makeBlankClient()],
  }
}

export function updateClient(
  book: MoneyMapFile,
  id: string,
  data: MoneyMapData,
): MoneyMapFile {
  return {
    ...book,
    clients: book.clients.map((client) =>
      client.id === id ? data : client,
    ),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateClient(value: unknown, index: number): void {
  if (!isRecord(value)) {
    throw new Error(`Client ${index + 1} must be an object.`)
  }
  if (typeof value.id !== 'string') {
    throw new Error(`Client ${index + 1} is missing a valid id.`)
  }
  if (!isRecord(value.client)) {
    throw new Error(`Client ${index + 1} is missing client details.`)
  }
  const details = value.client
  if (
    typeof details.title !== 'string' ||
    typeof details.year !== 'string' ||
    (details.variant !== 'annual' && details.variant !== 'postNote')
  ) {
    throw new Error(`Client ${index + 1} has invalid client details.`)
  }
  for (const field of ['incomeSources', 'accounts', 'footnotes'] as const) {
    if (!Array.isArray(value[field])) {
      throw new Error(`Client ${index + 1} has invalid ${field}.`)
    }
  }
}

export function parseBook(json: string): MoneyMapFile {
  let value: unknown
  try {
    value = JSON.parse(json)
  } catch {
    throw new Error('The selected file is not valid JSON.')
  }

  if (!isRecord(value)) {
    throw new Error('The selected file is not a Money Map book.')
  }
  if (value.fileType !== 'money-map-book') {
    throw new Error('The selected file has the wrong file type.')
  }
  if (value.version !== 1) {
    throw new Error('This Money Map book version is not supported.')
  }
  if (!Array.isArray(value.clients)) {
    throw new Error('The Money Map book must contain a clients array.')
  }
  if (value.clients.length === 0) {
    throw new Error('The Money Map book must contain at least one client.')
  }
  value.clients.forEach(validateClient)
  return value as unknown as MoneyMapFile
}
