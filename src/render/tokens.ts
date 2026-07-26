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
export const NEED_RED = '#c43d2e'
/** Income + flow green. */
export const FLOW_GREEN = '#1e7a4a'

export interface BucketStyle {
  stroke: string
  tint: string // body fill
  capTint: string // top ellipse fill, slightly deeper than body
  dashed?: boolean
  tag: string // tiny classification label rendered above the title
}

export const BUCKETS: Record<string, BucketStyle> = {
  shortTerm: { stroke: '#2a3230', tint: '#ffffff', capTint: '#f1f3f0', dashed: true, tag: 'Short-Term Bucket' },
  afterTax: { stroke: '#b98a1e', tint: '#fdf8ec', capTint: '#f7ecd2', tag: 'After-Tax' },
  taxDeferred: { stroke: '#2f6bab', tint: '#f2f7fc', capTint: '#e0ecf7', tag: 'Tax-Deferred' },
  taxPreferred: { stroke: '#6fa7d4', tint: '#f6fafd', capTint: '#e9f2fa', tag: 'Tax-Preferred' },
  charitable: { stroke: '#6b4fa0', tint: '#f7f4fb', capTint: '#ece6f6', tag: 'Charitable' },
  cash: { stroke: '#59645f', tint: '#f6f7f5', capTint: '#eceeea', tag: 'Cash' },
  note: { stroke: '#6b4fa0', tint: '#fbfaf6', capTint: '#fbfaf6', tag: 'Note' },
}

export const FONT_SERIF = "'Literata', Georgia, serif"
export const FONT_SANS = "'Public Sans', 'Segoe UI', sans-serif"

export const TYPE = {
  masthead: 30,
  mastheadLabel: 13,
  panelHeader: 15,
  accountTitle: 16,
  accountTag: 10.5,
  caption: 12,
  value: 21,
  subValue: 15,
  row: 12.5,
  needLabel: 13,
  needValue: 30,
  footnote: 13,
  arrowLabel: 12.5,
}
