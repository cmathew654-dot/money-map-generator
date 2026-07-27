/**
 * Every color, size, and type decision on the map lives here.
 * This file is the designer swap point — change values, not code.
 */

/** Exact US-letter landscape ratio (11 × 8.5) so print fills the page. */
export const ARTBOARD = { width: 1320, height: 1020 }

export const PAPER = '#fcfcfa'
export const INK = '#1c2422'
export const MUTED = '#5b6663'
export const HAIRLINE = '#dde1dc'

/** The one loud number on the page. */
export const NEED_RED = '#c03a2d'
/** Income + flow green. */
export const FLOW_GREEN = '#1e7a4a'

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
  mastheadLabel: 13,
  panelHeader: 15,
  accountTitle: 16,
  accountTag: 10.5,
  caption: 12.5,
  value: 24,
  subValue: 15,
  row: 12.5,
  needLabel: 13,
  needValue: 30,
  footnote: 13,
  arrowLabel: 12.5,
}
