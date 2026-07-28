/**
 * Every color, size, and type decision on the map lives here.
 * This file is the designer swap point — change values, not code.
 */

/** Exact US-letter landscape ratio (11 × 8.5) so print fills the page. */
import type { CustomArrowColor } from '../model/types'

export const ARTBOARD = { width: 1320, height: 1020 }

export const PAPER = '#fcfcfa'
export const INK = '#1c2422'
export const MUTED = '#5b6663'
export const HAIRLINE = '#dde1dc'

/** The one loud number on the page. */
export const NEED_RED = '#c03a2d'
/** Income + flow green. */
export const FLOW_GREEN = '#1e7a4a'

export const ARROW_COLORS = {
  ink: '#1c2422',
  green: '#1e7a4a',
  blue: '#2f6bab',
  gold: '#b98a1e',
  teal: '#2e8577',
  purple: '#6b4fa0',
  red: '#c03a2d',
} as const satisfies Record<CustomArrowColor, string>

export interface BucketStyle {
  stroke: string
  tagColor: string
  tint: string
  dashed?: boolean
  tag: string
}

export const BUCKETS: Record<string, BucketStyle> = {
  shortTerm: {
    stroke: '#2a3230',
    tagColor: '#2a3230',
    tint: '#ffffff',
    dashed: true,
    tag: 'Short-Term Bucket',
  },
  afterTax: {
    stroke: '#b98a1e',
    tagColor: '#836313',
    tint: '#fdf8ec',
    tag: 'After-Tax',
  },
  taxDeferred: {
    stroke: '#2f6bab',
    tagColor: '#2f6bab',
    tint: '#f2f7fc',
    tag: 'Tax-Deferred',
  },
  taxPreferred: {
    stroke: '#2e8577',
    tagColor: '#23695e',
    tint: '#eef7f5',
    tag: 'Tax-Preferred',
  },
  charitable: {
    stroke: '#6b4fa0',
    tagColor: '#6b4fa0',
    tint: '#f7f4fb',
    tag: 'Charitable',
  },
  cash: {
    stroke: '#59645f',
    tagColor: '#59645f',
    tint: '#f6f7f5',
    tag: 'Cash',
  },
  note: {
    stroke: '#6b4fa0',
    tagColor: '#6b4fa0',
    tint: '#fbfaf6',
    tag: 'Note',
  },
}

export const FONT_SERIF = "'Literata', Georgia, serif"
export const FONT_SANS = "'Public Sans', 'Segoe UI', sans-serif"

export const TYPE = {
  masthead: 30,
  mastheadLabel: 14,
  panelHeader: 17.5,
  incomeLabel: 13,
  incomeValue: 15,
  incomeQualifier: 12,
  incomeTotalLabel: 13,
  incomeTotalValue: 17,
  accountTitle: 19,
  accountTag: 12.5,
  caption: 14.5,
  note: 16,
  value: 25,
  subAccountTitle: 12.5,
  subAccountCaption: 10.5,
  subValue: 17,
  row: 14.5,
  needLabel: 15,
  needValue: 30,
  mathNote: 11.5,
  runway: 11.5,
  footnote: 15,
  arrowLabel: 14.5,
  legend: 12,
}

/** Baseline-to-baseline distance for multiline map text. */
export const LEADING = {
  accountTitle: 24,
  caption: 19,
  row: 20,
  subAccountTitle: 18,
  subAccountCaption: 15,
}
