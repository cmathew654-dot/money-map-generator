import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from './samples'
import type {
  Account,
  AccountShape,
  Bucket,
  CustomArrow,
  MoneyMapData,
  MoneyMapFile,
} from './types'
import {
  ACCOUNT_SHAPES,
  ACCOUNT_TEXT_ROLES,
  MAP_TEXT_ELEMENTS,
  accountTextOverrideKey,
  isMigratedFlowId,
  migratedFlowId,
  newId,
  type MapTextElement,
} from './types'

export const HISTORY_LIMIT = 50
export const HISTORY_COALESCE_MS = 800

const BUCKET_DEFAULTS: Record<Bucket, { shape: AccountShape }> = {
  shortTerm: { shape: 'drum' },
  afterTax: { shape: 'drum' },
  taxDeferred: { shape: 'drum' },
  taxPreferred: { shape: 'drum' },
  charitable: { shape: 'drum' },
  cash: { shape: 'drum' },
  note: { shape: 'card' },
}

const LEGACY_WATERFALL_ORDER: Bucket[] = [
  'taxDeferred',
  'afterTax',
  'shortTerm',
]

export function accountDefaultsFor(bucket: Bucket) {
  return { bucket, ...BUCKET_DEFAULTS[bucket] }
}

export const ACCOUNT_PRESETS = [
  {
    chipLabel: 'Short-Term',
    label: 'Short-Term Funds',
    caption: "2-3 years' worth of income needs",
    ...accountDefaultsFor('shortTerm'),
  },
  {
    chipLabel: 'Trust',
    label: 'Trust Account',
    ...accountDefaultsFor('afterTax'),
  },
  {
    chipLabel: 'IRA',
    label: 'IRA',
    ...accountDefaultsFor('taxDeferred'),
  },
  {
    chipLabel: 'Roth',
    label: 'Roth IRA',
    ...accountDefaultsFor('taxPreferred'),
  },
  {
    chipLabel: 'Cash',
    label: 'Cash at Bank',
    ...accountDefaultsFor('cash'),
  },
  {
    chipLabel: 'Charitable',
    label: 'Donor-Advised Fund',
    ...accountDefaultsFor('charitable'),
  },
  {
    chipLabel: 'Note',
    label: 'Note',
    ...accountDefaultsFor('note'),
  },
] satisfies (Omit<Account, 'id' | 'value'> & { chipLabel: string })[]

export function blankAccountFor(bucket: Bucket): Account {
  return {
    id: newId('account'),
    label: '',
    value: null,
    ...accountDefaultsFor(bucket),
  }
}

function uniqueMigratedFlowId(
  sourceId: string,
  usedIds: Set<string>,
): string {
  const base = migratedFlowId(sourceId)
  let id = base
  let suffix = 2
  while (usedIds.has(id)) {
    id = `${base}:${suffix}`
    suffix += 1
  }
  usedIds.add(id)
  return id
}

export function migrateClient(data: MoneyMapData): MoneyMapData {
  const existingArrows = data.customArrows ?? []
  const normalizedArrows = existingArrows.map((arrow) =>
    arrow.style === undefined
      ? { ...arrow, style: 'solid' as const }
      : arrow,
  )
  const hasLegacyChain = data.accounts.some(
    (account) => account.inWaterfall === true,
  )

  if (!hasLegacyChain) {
    return normalizedArrows.some(
      (arrow, index) => arrow !== existingArrows[index],
    )
      ? { ...data, customArrows: normalizedArrows }
      : data
  }

  const chain = LEGACY_WATERFALL_ORDER.flatMap((bucket) =>
    data.accounts.filter(
      (account) =>
        account.bucket === bucket && account.inWaterfall === true,
    ),
  )
  const usedIds = new Set(normalizedArrows.map((arrow) => arrow.id))
  const migratedArrows: CustomArrow[] = []
  const layoutOverrides = { ...(data.layoutOverrides ?? {}) }

  for (let index = 0; index < chain.length - 1; index += 1) {
    const source = chain[index]
    const target = chain[index + 1]
    const id = uniqueMigratedFlowId(source.id, usedIds)
    migratedArrows.push({
      id,
      sourceId: source.id,
      targetId: target.id,
      style: 'dotted',
    })

    const legacyKey = `arrow:waterfall:${source.id}`
    const flowKey = `arrow:custom:${id}`
    if (layoutOverrides[legacyKey]) {
      layoutOverrides[flowKey] = layoutOverrides[legacyKey]
      delete layoutOverrides[legacyKey]
    }
  }

  return {
    ...data,
    accounts: data.accounts.map((account) => ({
      ...account,
      inWaterfall: false,
    })),
    customArrows: [...migratedArrows, ...normalizedArrows],
    ...(Object.keys(layoutOverrides).length > 0
      ? { layoutOverrides }
      : { layoutOverrides: undefined }),
  }
}

export function appendBlankAccount(
  data: MoneyMapData,
  bucket: Bucket,
): MoneyMapData {
  return {
    ...data,
    accounts: [...data.accounts, blankAccountFor(bucket)],
  }
}

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
  const accountIds = new Map<string, string>()
  copy.accounts = copy.accounts.map((account) => {
    const id = newId('account')
    accountIds.set(account.id, id)
    return { ...account, id }
  })
  if (copy.layoutOverrides) {
    copy.layoutOverrides = Object.fromEntries(
      Object.entries(copy.layoutOverrides).map(([key, override]) => {
        const [prefix, accountId, role, ...extra] = key.split(':')
        const remappedId = accountIds.get(accountId)
        return prefix === 'text' &&
          remappedId &&
          extra.length === 0 &&
          ACCOUNT_TEXT_ROLES.includes(
            role as (typeof ACCOUNT_TEXT_ROLES)[number],
          )
          ? [
              accountTextOverrideKey(
                remappedId,
                role as (typeof ACCOUNT_TEXT_ROLES)[number],
              ),
              override,
            ]
          : [key, override]
      }),
    )
  }
  if (copy.customArrows) {
    copy.customArrows = copy.customArrows.map((arrow) => ({
      ...arrow,
      id: isMigratedFlowId(arrow.id)
        ? migratedFlowId(accountIds.get(arrow.sourceId) ?? arrow.sourceId)
        : newId('arrow'),
      sourceId: accountIds.get(arrow.sourceId) ?? arrow.sourceId,
      targetId: accountIds.get(arrow.targetId) ?? arrow.targetId,
    }))
  }
  if (copy.notes) {
    copy.notes = copy.notes.map((note) => ({
      ...note,
      id: newId('note'),
    }))
  }
  return copy
}

function makeBlankClient(title = ''): MoneyMapData {
  const client = withFreshIds(blankClient())
  client.client.title = title
  return client
}

export function clearedClient(data: MoneyMapData): MoneyMapData {
  const cleared: MoneyMapData = {
    id: data.id,
    client: { ...data.client },
    incomeSources: [],
    afterTaxIncome: null,
    monthlyNeed: null,
    asNeededAmount: null,
    accounts: [],
    footnotes: [],
  }
  if (data.showMath !== undefined) cleared.showMath = data.showMath
  return cleared
}

export function resetArrangement(data: MoneyMapData): MoneyMapData {
  const reset = { ...data }
  delete reset.layoutOverrides
  return reset
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
  accountIds: Set<string>,
): void {
  if (value === undefined) return
  if (!isRecord(value)) {
    throw new Error(
      `Client ${clientIndex + 1} has invalid layout overrides.`,
    )
  }

  for (const [key, override] of Object.entries(value)) {
    if (!isRecord(override)) {
      throw new Error(
        `Client ${clientIndex + 1} has invalid layout overrides.`,
      )
    }
    for (const field of [
      'dx',
      'dy',
      'fs',
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
    if (key.startsWith('text:')) {
      const parts = key.split(':')
      const fixedRoles =
        MAP_TEXT_ELEMENTS[parts[1] as MapTextElement]
      const validAccountText =
        accountIds.has(parts[1]) &&
        ACCOUNT_TEXT_ROLES.includes(
          parts[2] as (typeof ACCOUNT_TEXT_ROLES)[number],
        )
      const validFixedText =
        fixedRoles?.includes(parts[2] as never) === true
      if (
        parts.length !== 3 ||
        (!validAccountText && !validFixedText)
      ) {
        throw new Error(
          `Client ${clientIndex + 1} has invalid layout overrides.`,
        )
      }
    } else if (override.fs !== undefined) {
      throw new Error(
        `Client ${clientIndex + 1} has invalid layout overrides.`,
      )
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
  if (value.needTag !== undefined && typeof value.needTag !== 'string') {
    throw new Error(`Client ${index + 1} has an invalid need tag.`)
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
    if (
      account.valueTag !== undefined &&
      typeof account.valueTag !== 'string'
    ) {
      throw new Error(`Client ${index + 1} has an invalid account value tag.`)
    }
    if (
      account.inWaterfall !== undefined &&
      typeof account.inWaterfall !== 'boolean'
    ) {
      throw new Error(`Client ${index + 1} has an invalid legacy flow flag.`)
    }
  }
  if (value.customArrows !== undefined) {
    if (
      !Array.isArray(value.customArrows) ||
      value.customArrows.some(
        (arrow) =>
          !isRecord(arrow) ||
          typeof arrow.id !== 'string' ||
          typeof arrow.sourceId !== 'string' ||
          typeof arrow.targetId !== 'string' ||
          (arrow.style !== undefined &&
            arrow.style !== 'dotted' &&
            arrow.style !== 'dashed' &&
            arrow.style !== 'solid') ||
          (arrow.label !== undefined && typeof arrow.label !== 'string'),
      )
    ) {
      throw new Error(`Client ${index + 1} has invalid custom arrows.`)
    }
  }
  if (
    value.hiddenArrows !== undefined &&
    (!Array.isArray(value.hiddenArrows) ||
      value.hiddenArrows.some(
        (kind) => kind !== 'income' && kind !== 'asNeeded',
      ))
  ) {
    throw new Error(`Client ${index + 1} has invalid hidden arrows.`)
  }
  if (value.notes !== undefined) {
    if (
      !Array.isArray(value.notes) ||
      value.notes.some(
        (note) =>
          !isRecord(note) ||
          typeof note.id !== 'string' ||
          typeof note.text !== 'string' ||
          typeof note.x !== 'number' ||
          !Number.isFinite(note.x) ||
          typeof note.y !== 'number' ||
          !Number.isFinite(note.y),
      )
    ) {
      throw new Error(`Client ${index + 1} has invalid map notes.`)
    }
  }
  validateLayoutOverrides(
    value.layoutOverrides,
    index,
    new Set(
      accounts.flatMap((account) =>
        isRecord(account) && typeof account.id === 'string'
          ? [account.id]
          : [],
      ),
    ),
  )
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
  const book = value as unknown as MoneyMapFile
  return {
    ...book,
    clients: book.clients.map(migrateClient),
  }
}
