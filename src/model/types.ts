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
  /** small line under the label — allocation notes, "2-3 years' worth…" */
  caption?: string
  /** ruled label/value rows inside the cylinder — holdings of note */
  positions?: Position[]
  /** nested earmarked pool drawn as an inset cylinder — e.g. RMD short-term funds */
  subAccounts?: SubAccount[]
  /** participates in the right-to-left refill chain of dotted arrows */
  inWaterfall: boolean
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

export interface LayoutOverride {
  dx?: number
  dy?: number
  w?: number
  h?: number
  bow?: number
  startT?: number
  endT?: number
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
  }
  incomeSources: IncomeSource[]
  afterTaxIncome: number | null // the income box total line
  monthlyNeed: number | null // the red number
  asNeededAmount: number | null // "Monthly Income as Needed" arrow label
  accounts: Account[]
  footnotes: Footnote[]
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
