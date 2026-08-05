import { layoutMap, OVERRIDE_BOUNDS, rotatedBounds } from '../layout/layout'
import {
  duplicatePlacement,
  placementsOverlap,
  withOverride,
} from '../render/mapInteraction'
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
  MapNoteFont,
  MoneyMapData,
  MoneyMapFile,
} from './types'
import {
  ACCOUNT_SHAPES,
  ACCOUNT_TEXT_ROLES,
  CUSTOM_ARROW_COLORS,
  MAX_CUSTOM_ARROW_WIDTH,
  MIN_CUSTOM_ARROW_WIDTH,
  MAP_NOTE_FONTS,
  MAP_TEXT_ELEMENTS,
  accountShape,
  accountTextOverrideKey,
  mapItemTextOverrideKey,
  migratedFlowId,
  newId,
  type MapTextElement,
} from './types'

export const HISTORY_LIMIT = 50
export const HISTORY_COALESCE_MS = 800

export class BookValidationError extends Error {}

const BUCKET_DEFAULTS: Record<Bucket, { shape: AccountShape }> = {
  shortTerm: { shape: 'drum' },
  afterTax: { shape: 'drum' },
  taxDeferred: { shape: 'drum' },
  taxPreferred: { shape: 'drum' },
  charitable: { shape: 'drum' },
  cash: { shape: 'drum' },
  note: { shape: 'card' },
}

export const ACCOUNT_TYPE_OPTIONS: readonly {
  value: Bucket
  label: string
}[] = [
  { value: 'shortTerm', label: 'Short-term' },
  { value: 'afterTax', label: 'After-tax' },
  { value: 'taxDeferred', label: 'Tax-deferred' },
  { value: 'taxPreferred', label: 'Tax-preferred' },
  { value: 'charitable', label: 'Charitable' },
  { value: 'cash', label: 'Cash' },
  { value: 'note', label: 'Note' },
]

const LEGACY_WATERFALL_ORDER: Bucket[] = [
  'taxDeferred',
  'afterTax',
  'shortTerm',
]

export function accountDefaultsFor(bucket: Bucket) {
  return { bucket, ...BUCKET_DEFAULTS[bucket] }
}

export function changeAccountBucket(account: Account, bucket: Bucket): Account {
  return { ...account, bucket, shape: accountShape(account) }
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
  const incomeSources = data.incomeSources.map((source) => ({ ...source, id: typeof source.id === 'string' && source.id ? source.id : newId('income') }))
  const footnotes = data.footnotes.map((footnote) => ({ ...footnote, id: typeof footnote.id === 'string' && footnote.id ? footnote.id : newId('footnote') }))
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
      ? { ...data, incomeSources, footnotes, customArrows: normalizedArrows }
      : { ...data, incomeSources, footnotes }
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
    incomeSources,
    footnotes,
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
  const account = blankAccountFor(bucket)
  const withAccount: MoneyMapData = {
    ...data,
    accounts: [...data.accounts, account],
  }

  const layout = layoutMap(withAccount)
  const placed = layout.accounts.find((item) => item.account.id === account.id)
  if (!placed) return withAccount

  const sourceRect = rotatedBounds(placed, placed.rot)
  const blockedRects = layout.accounts
    .filter((item) => item.account.id !== account.id)
    .map((item) => rotatedBounds(item, item.rot))
  if (!blockedRects.some((rect) => placementsOverlap(sourceRect, rect))) {
    return withAccount
  }

  const nudged = duplicatePlacement(sourceRect, blockedRects, OVERRIDE_BOUNDS)
  return withOverride(withAccount, account.id, {
    dx: nudged.x - sourceRect.x,
    dy: nudged.y - sourceRect.y,
  })
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
  const accounts = new Map<string, string>()
  const incomes = new Map<string, string>()
  const footnotes = new Map<string, string>()
  const arrows = new Map<string, string>()
  copy.accounts = copy.accounts.map((item) => { const id = newId('account'); accounts.set(item.id, id); return { ...item, id } })
  copy.incomeSources = copy.incomeSources.map((item) => { const id = newId('income'); incomes.set(item.id, id); return { ...item, id } })
  copy.footnotes = copy.footnotes.map((item) => { const id = newId('footnote'); footnotes.set(item.id, id); return { ...item, id } })
  copy.customArrows?.forEach((item) => arrows.set(item.id, newId('arrow')))
  const remapKey = (key: string): string => {
    if (accounts.has(key)) return accounts.get(key)!
    const parts = key.split(':')
    if (parts.length === 3 && parts[0] === 'text' && accounts.has(parts[1])) return accountTextOverrideKey(accounts.get(parts[1])!, parts[2] as (typeof ACCOUNT_TEXT_ROLES)[number])
    if (parts.length === 4 && parts[0] === 'text' && parts[1] === 'income' && parts[2] === 'row' && incomes.has(parts[3])) return mapItemTextOverrideKey('income', 'row', incomes.get(parts[3])!)
    if (parts.length === 4 && parts[0] === 'text' && parts[1] === 'footnotes' && parts[2] === 'line' && footnotes.has(parts[3])) return mapItemTextOverrideKey('footnotes', 'line', footnotes.get(parts[3])!)
    if (key.startsWith('arrow:custom:') && arrows.has(key.slice(13))) return `arrow:custom:${arrows.get(key.slice(13))}`
    if (key.startsWith('arrow:waterfall:') && accounts.has(key.slice(16))) return `arrow:waterfall:${accounts.get(key.slice(16))}`
    return key
  }
  if (copy.layoutOverrides) copy.layoutOverrides = Object.fromEntries(Object.entries(copy.layoutOverrides).map(([key, value]) => [remapKey(key), value]))
  if (copy.customArrows) copy.customArrows = copy.customArrows.map((item) => ({ ...item, id: arrows.get(item.id)!, sourceId: accounts.get(item.sourceId) ?? item.sourceId, targetId: accounts.get(item.targetId) ?? item.targetId }))
  if (copy.notes) copy.notes = copy.notes.map((item) => ({ ...item, id: newId('note') }))
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
  if (reset.customArrows) {
    reset.customArrows = reset.customArrows.map((arrow) => {
      const restored = { ...arrow }
      delete restored.labelDx
      delete restored.labelDy
      return restored
    })
  }
  return reset
}

/** Where an item currently sits on the map, keyed by layout key or `note:<id>`. */
export interface TidyAnchor {
  key: string
  x: number
  y: number
  w?: number
  h?: number
}

const TIDY_GRID = 12
// ponytail: fallback box size when a caller doesn't pass real w/h — good enough for
// overlap checks; upgrade path is wiring actual placed w/h into TidyAnchor.
const TIDY_DEFAULT_W = 180
const TIDY_DEFAULT_H = 120
const TIDY_MAX_RING = 1200
// Relocated items keep this much clearance from neighbors: exact edge-to-edge
// adjacency reads as touching on screen and can round into a 1px overlap.
const TIDY_CLEARANCE = 4

/**
 * Snaps each anchor to the nearest grid line, then searches outward in grid
 * rings for the nearest clear placement. Leaves everything else — sizes,
 * rotations, text offsets, arrow labels — exactly as the advisor arranged it.
 */
export function tidyArrangement(
  data: MoneyMapData,
  anchors: readonly TidyAnchor[],
  bounds?: {
    left: number
    top: number
    right: number
    bottom: number
  },
): MoneyMapData {
  const snap = (value: number) => Math.round(value / TIDY_GRID) * TIDY_GRID

  const placed: { x: number; y: number; w: number; h: number }[] = []
  for (const anchor of anchors) {
    const w = anchor.w ?? TIDY_DEFAULT_W
    const h = anchor.h ?? TIDY_DEFAULT_H
    let x = snap(anchor.x)
    let y = snap(anchor.y)

    // The renderer clamps overrides into these bounds, so a snap that lands
    // outside would write a delta the item never actually moves by — and tidy
    // would report work left to do forever.
    if (bounds !== undefined) {
      x = Math.min(Math.max(x, bounds.left), bounds.right - w)
      y = Math.min(Math.max(y, bounds.top), bounds.bottom - h)
    }

    if (placed.some((rect) => placementsOverlap({ x, y, w, h }, rect))) {
      let found = false
      for (
        let distance = TIDY_GRID;
        distance <= TIDY_MAX_RING && !found;
        distance += TIDY_GRID
      ) {
        const candidates: { dx: number; dy: number }[] = []
        for (let dx = -distance; dx <= distance; dx += TIDY_GRID) {
          for (let dy = -distance; dy <= distance; dy += TIDY_GRID) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== distance) continue
            candidates.push({ dx, dy })
          }
        }
        candidates.sort(
          (a, b) =>
            a.dx * a.dx + a.dy * a.dy - (b.dx * b.dx + b.dy * b.dy) ||
            a.dy - b.dy ||
            a.dx - b.dx,
        )

        for (const { dx, dy } of candidates) {
          const candidateX = x + dx
          const candidateY = y + dy
          if (
            (bounds === undefined ||
              // The renderer clamps override positions at the bounds, so a
              // candidate whose footprint sticks out would silently not move.
              (candidateX >= bounds.left &&
                candidateX + w <= bounds.right &&
                candidateY >= bounds.top &&
                candidateY + h <= bounds.bottom)) &&
            !placed.some((rect) =>
              placementsOverlap(
                {
                  x: candidateX - TIDY_CLEARANCE,
                  y: candidateY - TIDY_CLEARANCE,
                  w: w + TIDY_CLEARANCE * 2,
                  h: h + TIDY_CLEARANCE * 2,
                },
                rect,
              ),
            )
          ) {
            x = candidateX
            y = candidateY
            found = true
            break
          }
        }
      }
    }
    placed.push({ x, y, w, h })
  }

  let next = data

  anchors.forEach((anchor, i) => {
    // Sub-pixel residue is invisible on screen but keeps the Tidy button live.
    const dx = Math.abs(placed[i].x - anchor.x) < 0.5 ? 0 : placed[i].x - anchor.x
    const dy = Math.abs(placed[i].y - anchor.y) < 0.5 ? 0 : placed[i].y - anchor.y
    if (dx === 0 && dy === 0) return

    if (anchor.key.startsWith('note:')) {
      const id = anchor.key.slice('note:'.length)
      if (!next.notes?.some((note) => note.id === id)) return
      next = {
        ...next,
        notes: next.notes.map((note) =>
          note.id === id ? { ...note, x: note.x + dx, y: note.y + dy } : note,
        ),
      }
      return
    }

    const overrides = next.layoutOverrides ?? {}
    const override = overrides[anchor.key] ?? {}
    next = {
      ...next,
      layoutOverrides: {
        ...overrides,
        [anchor.key]: {
          ...override,
          ...(dx === 0 ? {} : { dx: (override.dx ?? 0) + dx }),
          ...(dy === 0 ? {} : { dy: (override.dy ?? 0) + dy }),
        },
      },
    }
  })

  return next
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

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === 'string'
}
function isMoneyValue(value: unknown): boolean {
  return value === null || (typeof value === 'number' && Number.isFinite(value))
}
function uniqueIds(values: unknown[], index: number, label: string, allowMissing = false): Set<string> {
  const ids = new Set<string>()
  for (const value of values) {
    if (!isRecord(value)) continue
    const id = value.id
    if (allowMissing && (id === undefined || id === '')) continue
    if (typeof id !== 'string' || id.length === 0 || ids.has(id)) throw new Error(`Client ${index + 1} has invalid or duplicate ${label} ids.`)
    ids.add(id)
  }
  return ids
}

function validateLayoutOverrides(
  value: unknown,
  clientIndex: number,
  accountIds: Set<string>,
  incomeIds: Set<string>,
  footnoteIds: Set<string>,
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
      const validLegacyLegendText =
        parts[1] === 'legend' && parts[2] === 'label'
      const validItemText = parts.length === 4 && ((parts[1] === 'income' && parts[2] === 'row' && incomeIds.has(parts[3])) || (parts[1] === 'footnotes' && parts[2] === 'line' && footnoteIds.has(parts[3])))
      if (!validItemText && (parts.length !== 3 || (!validAccountText && !validFixedText && !validLegacyLegendText))) {
        throw new Error(
          `Client ${clientIndex + 1} has invalid layout overrides.`,
        )
      }
    } else if (override.fs !== undefined) {
      throw new Error(
        `Client ${clientIndex + 1} has invalid layout overrides.`,
      )
    }
    const generatedArrow = key === 'arrow:income' || key === 'arrow:asNeeded'
    const noteOverride = key.startsWith('note:')
    if (
      (override.style !== undefined &&
        (!generatedArrow ||
          !['dotted', 'dashed', 'solid'].includes(String(override.style)))) ||
      (override.color !== undefined &&
        ((!generatedArrow && !noteOverride) ||
          !CUSTOM_ARROW_COLORS.includes(override.color as never))) ||
      (override.sw !== undefined &&
        (!generatedArrow ||
          typeof override.sw !== 'number' ||
          !Number.isFinite(override.sw) ||
          override.sw < MIN_CUSTOM_ARROW_WIDTH ||
          override.sw > MAX_CUSTOM_ARROW_WIDTH))
    ) {
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

function validateClient(value: unknown, index: number, allowMissingItemIds = false): void {
  if (!isRecord(value)) {
    throw new Error(`Client ${index + 1} must be an object.`)
  }
  if (typeof value.id !== 'string' || value.id.length === 0) {
    throw new Error(`Client ${index + 1} is missing a valid id.`)
  }
  if (!isRecord(value.client)) {
    throw new Error(`Client ${index + 1} is missing client details.`)
  }
  const details = value.client
  if (
    typeof details.title !== 'string' ||
    typeof details.year !== 'string' ||
    !isOptionalString(details.postNoteLabel) ||
    (details.mastheadLabel !== undefined &&
      typeof details.mastheadLabel !== 'string') ||
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
  for (const field of ['afterTaxIncome', 'monthlyNeed', 'asNeededAmount'] as const) {
    if (!isMoneyValue(value[field])) throw new Error(`Client ${index + 1} has an invalid money value.`)
  }
  const incomeSources = value.incomeSources as unknown[]
  const incomeIds = uniqueIds(incomeSources, index, 'income source', allowMissingItemIds)
  if (incomeSources.some((source) =>
    !isRecord(source) ||
    (!allowMissingItemIds && (typeof source.id !== 'string' || source.id.length === 0)) ||
    typeof source.label !== 'string' || !isMoneyValue(source.amount) ||
    (source.period !== 'mo' && source.period !== 'yr') || !isOptionalString(source.qualifier)
  )) throw new Error(`Client ${index + 1} has invalid income sources.`)
  const footnotes = value.footnotes as unknown[]
  const footnoteIds = uniqueIds(footnotes, index, 'footnote', allowMissingItemIds)
  if (footnotes.some((footnote) =>
    !isRecord(footnote) ||
    (!allowMissingItemIds && (typeof footnote.id !== 'string' || footnote.id.length === 0)) ||
    typeof footnote.label !== 'string' || !isMoneyValue(footnote.gross) || !isMoneyValue(footnote.net)
  )) throw new Error(`Client ${index + 1} has invalid footnotes.`)
  const accounts = value.accounts as unknown[]
  const accountIds = uniqueIds(accounts, index, 'account')
  for (const account of accounts) {
    if (
      !isRecord(account) ||
      typeof account.id !== 'string' || account.id.length === 0 ||
      typeof account.bucket !== 'string' ||
      !Object.prototype.hasOwnProperty.call(BUCKET_DEFAULTS, account.bucket) ||
      typeof account.label !== 'string' || !isMoneyValue(account.value) ||
      !isOptionalString(account.caption) ||      (account.shape !== undefined &&
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
    if (account.positions !== undefined && (!Array.isArray(account.positions) || account.positions.some((position) =>
      !isRecord(position) || typeof position.label !== 'string' || !isMoneyValue(position.value)
    ))) throw new Error(`Client ${index + 1} has invalid account positions.`)
    if (account.subAccounts !== undefined && (!Array.isArray(account.subAccounts) || account.subAccounts.some((subAccount) =>
      !isRecord(subAccount) || typeof subAccount.label !== 'string' || !isOptionalString(subAccount.caption) || !isMoneyValue(subAccount.value)
    ))) throw new Error(`Client ${index + 1} has invalid subaccounts.`)
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
          (arrow.label !== undefined && typeof arrow.label !== 'string') ||
          (arrow.labelDx !== undefined &&
            (typeof arrow.labelDx !== 'number' ||
              !Number.isFinite(arrow.labelDx))) ||
          (arrow.labelDy !== undefined &&
            (typeof arrow.labelDy !== 'number' ||
              !Number.isFinite(arrow.labelDy))) ||
          (arrow.color !== undefined &&
            !CUSTOM_ARROW_COLORS.includes(
              arrow.color as (typeof CUSTOM_ARROW_COLORS)[number],
            )) ||
          (arrow.sw !== undefined &&
            (typeof arrow.sw !== 'number' ||
              !Number.isFinite(arrow.sw) ||
              arrow.sw < MIN_CUSTOM_ARROW_WIDTH ||
              arrow.sw > MAX_CUSTOM_ARROW_WIDTH)),
      )
    ) {
      throw new Error(`Client ${index + 1} has invalid custom arrows.`)
    }
    const arrows = value.customArrows as unknown[]
    uniqueIds(arrows, index, 'custom arrow')
    const endpoints = new Set(['income', 'need', ...accountIds])
    if (arrows.some((arrow) => isRecord(arrow) && (!endpoints.has(String(arrow.sourceId)) || !endpoints.has(String(arrow.targetId))))) {
      throw new BookValidationError(`${details.title} has a flow connected to an item that is no longer in the map. This book was not opened, and your current work was not changed.`)
    }
    const endpointLabel = (id: string) => {
      if (id === 'income') return 'Income sources'
      if (id === 'need') return 'Monthly need'
      const account = accounts.find(
        (candidate) => isRecord(candidate) && candidate.id === id,
      )
      return isRecord(account) && typeof account.label === 'string'
        ? account.label
        : 'Unknown item'
    }
    const connections = new Set<string>()
    for (const arrow of arrows) {
      if (!isRecord(arrow)) continue
      const sourceId = String(arrow.sourceId)
      const targetId = String(arrow.targetId)
      const sourceLabel = endpointLabel(sourceId)
      const targetLabel = endpointLabel(targetId)
      if (sourceId === targetId) {
        throw new BookValidationError(
          `${details.title} has a flow that connects ${sourceLabel} to itself. This book was not opened, and your current work was not changed.`,
        )
      }
      const connection = `${sourceId}\u0000${targetId}`
      if (connections.has(connection)) {
        throw new BookValidationError(
          `${details.title} has more than one flow from ${sourceLabel} to ${targetLabel}. This book was not opened, and your current work was not changed.`,
        )
      }
      connections.add(connection)
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
          !Number.isFinite(note.y) ||
          (note.w !== undefined &&
            (typeof note.w !== 'number' || !Number.isFinite(note.w))) ||
          (note.fs !== undefined &&
            (typeof note.fs !== 'number' || !Number.isFinite(note.fs))) ||
          (note.bg !== undefined && typeof note.bg !== 'boolean') ||
          (note.font !== undefined &&
            !MAP_NOTE_FONTS.includes(note.font as MapNoteFont)),
      )
    ) {
      throw new Error(`Client ${index + 1} has invalid map notes.`)
    }
    uniqueIds(value.notes as unknown[], index, 'map note')
  }
  validateLayoutOverrides(
    value.layoutOverrides,
    index,
    accountIds,
    incomeIds,
    footnoteIds,
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
  value.clients.forEach((client, index) => validateClient(client, index, true))
  const book = value as unknown as MoneyMapFile
  const clients = book.clients.map(migrateClient)
  clients.forEach((client, index) => validateClient(client, index))
  if (new Set(clients.map((client) => client.id)).size !== clients.length) throw new Error('The Money Map book contains duplicate client ids.')
  return { ...book, clients }
}
