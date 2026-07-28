/**
 * Domain model. A "book" file holds every client's map (designed for 100–200
 * clients in one JSON file). All dollar values are `number | null`:
 * null renders as the fill-in blank "~$ ______" on the map, on purpose —
 * blanks get captured live in client meetings.
 */

export type Bucket =
  | 'shortTerm' // dashed ink cylinder — 2-3 years of income needs
  | 'afterTax' // gold — trust / managed after-tax
  | 'taxDeferred' // blue — IRA / 401k
  | 'taxPreferred' // teal — Roth, cash-value life
  | 'charitable' // purple — DAF / charitable fund
  | 'cash' // neutral — cash at bank / at home
  | 'note' // rounded card, not a cylinder — e.g. installment note

export const ACCOUNT_SHAPES = ['drum', 'card', 'rect', 'pill'] as const
export type AccountShape = (typeof ACCOUNT_SHAPES)[number]

export interface Position {
  label: string
  value: number | null
}

export interface SubAccount {
  label: string
  caption?: string
  value: number | null
}

export interface Account {
  id: string
  bucket: Bucket
  /** absent uses the bucket default: notes are cards; everything else is a drum */
  shape?: AccountShape
  label: string
  value: number | null
  /** short qualifier rendered beside the value, e.g. "est." */
  valueTag?: string
  /** small line under the label — allocation notes, "2-3 years' worth…" */
  caption?: string
  /** ruled label/value rows inside the cylinder — holdings of note */
  positions?: Position[]
  /** nested earmarked pool drawn as an inset cylinder — e.g. RMD short-term funds */
  subAccounts?: SubAccount[]
  /** accepted for legacy book migration; ignored after load */
  inWaterfall?: boolean
}

export interface IncomeSource {
  label: string
  amount: number | null
  period: 'mo' | 'yr'
  /** e.g. "Gross", "After-Tax" — rendered after the amount */
  qualifier?: string
}

export interface Footnote {
  label: string // e.g. "Dan 2026 RMD"
  gross: number | null
  net: number | null // after withholding — rendered in green
}

export const CUSTOM_ARROW_COLORS = [
  'ink',
  'green',
  'blue',
  'gold',
  'teal',
  'purple',
  'red',
] as const
export type CustomArrowColor = (typeof CUSTOM_ARROW_COLORS)[number]

export interface CustomArrow {
  id: string
  sourceId: string
  targetId: string
  style: 'dotted' | 'dashed' | 'solid'
  label?: string
  color?: CustomArrowColor
}

export type GeneratedArrowKind = 'income' | 'asNeeded'

export const MIGRATED_FLOW_ID_PREFIX = 'migrated-flow:'

export function migratedFlowId(sourceId: string): string {
  return `${MIGRATED_FLOW_ID_PREFIX}${sourceId}`
}

export function isMigratedFlowId(id: string): boolean {
  return id.startsWith(MIGRATED_FLOW_ID_PREFIX)
}

export interface MapNote {
  id: string
  text: string
  x: number
  y: number
  w?: number
  bg?: boolean
  fs?: number
}

export const ACCOUNT_TEXT_ROLES = ['label', 'caption', 'value'] as const
export type AccountTextRole = (typeof ACCOUNT_TEXT_ROLES)[number]
export const MIN_ACCOUNT_TEXT_FONT_SIZE = 9
export const MAX_ACCOUNT_TEXT_FONT_SIZE = 28
export const MAP_TEXT_ELEMENTS = {
  income: ['header', 'row', 'total'],
  need: ['label', 'value'],
  footnotes: ['line'],
  legend: ['label'],
} as const
export type MapTextElement = keyof typeof MAP_TEXT_ELEMENTS
export type MapTextElementRole =
  (typeof MAP_TEXT_ELEMENTS)[MapTextElement][number]
export const MIN_MAP_TEXT_FONT_SIZE = 9
export const MAX_MAP_TEXT_FONT_SIZE = 40

export function accountTextOverrideKey(
  accountId: string,
  role: AccountTextRole,
): string {
  return `text:${accountId}:${role}`
}

export function mapTextOverrideKey<
  Element extends MapTextElement,
>(
  element: Element,
  role: (typeof MAP_TEXT_ELEMENTS)[Element][number],
): string {
  return `text:${element}:${role}`
}

export interface LayoutOverride {
  dx?: number
  dy?: number
  fs?: number
  w?: number
  h?: number
  rot?: number
  bow?: number
  startT?: number
  endT?: number
  startAt?: { dx: number; dy: number }
  endAt?: { dx: number; dy: number }
}

export interface MoneyMapData {
  id: string
  /** omitted in legacy books; arithmetic captions default on */
  showMath?: boolean
  client: {
    title: string // "Jordan & Dana Whitfield"
    year: string // "2026"
    variant: 'annual' | 'postNote'
    postNoteLabel?: string // "April 2026" when variant is postNote
    mastheadLabel?: string
  }
  incomeSources: IncomeSource[]
  afterTaxIncome: number | null // the income box total line
  monthlyNeed: number | null // the red number
  /** short qualifier rendered beside the monthly need */
  needTag?: string
  asNeededAmount: number | null // "Monthly Income as Needed" arrow label
  accounts: Account[]
  footnotes: Footnote[]
  /** advisor-drawn connections; omitted in legacy books */
  customArrows?: CustomArrow[]
  /** generated arrows hidden by the advisor; omitted when both are visible */
  hiddenArrows?: GeneratedArrowKind[]
  /** free text annotations in artboard coordinates; omitted in legacy books */
  notes?: MapNote[]
  layoutOverrides?: Record<string, LayoutOverride>
}

/** The whole practice in one file. */
export interface MoneyMapFile {
  fileType: 'money-map-book'
  version: 1
  clients: MoneyMapData[]
}

export function accountShape(
  account: Pick<Account, 'bucket' | 'shape'>,
): AccountShape {
  return account.shape ?? (account.bucket === 'note' ? 'card' : 'drum')
}

export function nextAccountShape(shape: AccountShape): AccountShape {
  const index = ACCOUNT_SHAPES.indexOf(shape)
  return ACCOUNT_SHAPES[(index + 1) % ACCOUNT_SHAPES.length]
}

let counter = 0
/** Collision-proof-enough id for in-file entities. */
export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}
