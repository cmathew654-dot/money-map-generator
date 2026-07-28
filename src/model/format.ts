import type { Account, Bucket, MoneyMapData } from './types'

/** Pure formatting helpers. null → the fill-in blank, by design. */

export const BLANK = '~$ ______'

const BUCKET_DISPLAY_NAMES: Record<Bucket, string> = {
  shortTerm: 'Short-Term Bucket',
  afterTax: 'After-Tax',
  taxDeferred: 'Tax-Deferred',
  taxPreferred: 'Tax-Preferred',
  charitable: 'Charitable',
  cash: 'Cash',
  note: 'Note',
}

export function bucketDisplayName(bucket: Bucket): string {
  return BUCKET_DISPLAY_NAMES[bucket]
}

export function accountDisplayName(
  account: Pick<Account, 'bucket' | 'label'>,
): string {
  return account.label.trim()
    ? account.label
    : `${bucketDisplayName(account.bucket)} · unnamed`
}

export function mastheadPeriodLabel(
  client: Pick<
    MoneyMapData['client'],
    'postNoteLabel' | 'variant' | 'year'
  >,
): string {
  if (client.variant === 'annual') return client.year

  const asOf = client.postNoteLabel
    ?.trim()
    .replace(/\s+\d{4}$/, '')
    .trim()
  return asOf ? `${asOf.toUpperCase()} UPDATE` : 'UPDATE'
}

/** Parse advisor-friendly dollar input, including k/m shorthand. */
export function parseMoneyInput(text: string): number | null {
  const normalized = text.trim().replace(/[$,\s]/g, '')
  const match = normalized.match(
    /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))([km])?$/i,
  )
  if (!match) return null

  const value = Number(match[1])
  const suffix = match[2]?.toLowerCase()
  const multiplier = suffix === 'k' ? 1_000 : suffix === 'm' ? 1_000_000 : 1
  const result = value * multiplier
  return Number.isFinite(result) ? result : null
}

/** $1,600,000 — approximate marker optional. */
export function money(value: number | null, opts?: { approx?: boolean }): string {
  if (value === null || Number.isNaN(value)) return BLANK
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  const whole = Math.round(abs)
  const grouped = whole.toLocaleString('en-US')
  return `${opts?.approx ? '~' : ''}${sign}$${grouped}`
}

/** For income rows: "$3,000 mo." / "$25,000 yr." */
export function moneyPer(value: number | null, period: 'mo' | 'yr'): string {
  if (value === null) return BLANK
  return `${money(value)} ${period}.`
}

/** Wrap text to lines of at most `max` chars, breaking on spaces. Pure; used by layout. */
export function wrap(text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= max || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
  }
  if (line) lines.push(line)
  return lines
}
