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
  | 'taxPreferred' // light blue — Roth, cash-value life
  | 'charitable' // purple — DAF / charitable fund
  | 'cash' // neutral — cash at bank / at home
  | 'note' // rounded card, not a cylinder — e.g. installment note

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
  label: string
  value: number | null
  /** small italic line under the label — allocation notes, "2-3 years' worth…" */
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

export interface MoneyMapData {
  id: string
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
}

/** The whole practice in one file. */
export interface MoneyMapFile {
  fileType: 'money-map-book'
  version: 1
  clients: MoneyMapData[]
}

let counter = 0
/** Collision-proof-enough id for in-file entities. */
export function newId(prefix: string): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter}`
}
