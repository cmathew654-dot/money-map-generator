import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from './samples'
import type { MoneyMapData, MoneyMapFile } from './types'
import { ACCOUNT_SHAPES, newId } from './types'

export const HISTORY_LIMIT = 50
export const HISTORY_COALESCE_MS = 800

export interface BookSnapshot {
  book: MoneyMapFile
  activeClientId: string
}

export interface HistoryStep {
  before: BookSnapshot
  after: BookSnapshot
  targetClientId: string | null
  committedAt: number
}

export interface BookHistory {
  past: HistoryStep[]
  future: HistoryStep[]
}

export function emptyHistory(): BookHistory {
  return { past: [], future: [] }
}

export function pushHistory(
  history: BookHistory,
  before: BookSnapshot,
  after: BookSnapshot,
  targetClientId: string | null,
  committedAt: number,
): BookHistory {
  if (
    before.book === after.book &&
    before.activeClientId === after.activeClientId
  ) {
    return history
  }

  const last = history.past.at(-1)
  const coalesces =
    targetClientId !== null &&
    last?.targetClientId === targetClientId &&
    committedAt >= last.committedAt &&
    committedAt - last.committedAt <= HISTORY_COALESCE_MS &&
    last.after.book === before.book &&
    last.after.activeClientId === before.activeClientId

  const step: HistoryStep = coalesces
    ? { ...last, after, committedAt }
    : { before, after, targetClientId, committedAt }
  const past = coalesces
    ? [...history.past.slice(0, -1), step]
    : [...history.past, step].slice(-HISTORY_LIMIT)
  return { past, future: [] }
}

export function undoHistory(history: BookHistory): {
  history: BookHistory
  snapshot: BookSnapshot | null
} {
  const step = history.past.at(-1)
  if (!step) return { history, snapshot: null }
  return {
    history: {
      past: history.past.slice(0, -1),
      future: [step, ...history.future],
    },
    snapshot: step.before,
  }
}

export function redoHistory(history: BookHistory): {
  history: BookHistory
  snapshot: BookSnapshot | null
} {
  const [step, ...future] = history.future
  if (!step) return { history, snapshot: null }
  return {
    history: {
      past: [...history.past, step].slice(-HISTORY_LIMIT),
      future,
    },
    snapshot: step.after,
  }
}

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

function validateLayoutOverrides(
  value: unknown,
  clientIndex: number,
): void {
  if (value === undefined) return
  if (!isRecord(value)) {
    throw new Error(
      `Client ${clientIndex + 1} has invalid layout overrides.`,
    )
  }

  for (const override of Object.values(value)) {
    if (!isRecord(override)) {
      throw new Error(
        `Client ${clientIndex + 1} has invalid layout overrides.`,
      )
    }
    for (const field of [
      'dx',
      'dy',
      'w',
      'h',
      'rot',
      'bow',
      'startT',
      'endT',
    ] as const) {
      if (
        override[field] !== undefined &&
        (typeof override[field] !== 'number' ||
          !Number.isFinite(override[field]))
      ) {
        throw new Error(
          `Client ${clientIndex + 1} has invalid layout overrides.`,
        )
      }
    }
    for (const field of ['startAt', 'endAt'] as const) {
      const point = override[field]
      if (
        point !== undefined &&
        (!isRecord(point) ||
          typeof point.dx !== 'number' ||
          !Number.isFinite(point.dx) ||
          typeof point.dy !== 'number' ||
          !Number.isFinite(point.dy))
      ) {
        throw new Error(
          `Client ${clientIndex + 1} has invalid layout overrides.`,
        )
      }
    }
    if (typeof override.rot === 'number') {
      override.rot = ((override.rot % 360) + 360) % 360
    }
  }
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
  if (
    value.showMath !== undefined &&
    typeof value.showMath !== 'boolean'
  ) {
    throw new Error(`Client ${index + 1} has invalid math visibility.`)
  }
  const accounts = value.accounts as unknown[]
  for (const account of accounts) {
    if (
      !isRecord(account) ||
      (account.shape !== undefined &&
        !ACCOUNT_SHAPES.includes(
          account.shape as (typeof ACCOUNT_SHAPES)[number],
        ))
    ) {
      throw new Error(`Client ${index + 1} has an invalid account shape.`)
    }
  }
  validateLayoutOverrides(value.layoutOverrides, index)
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
