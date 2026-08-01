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
  const year = client.year.trim()
  return [asOf?.toUpperCase(), year.toUpperCase()]
    .filter(Boolean)
    .join(' ')
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

export function stepMoney(
  current: number | null,
  direction: 1 | -1,
  tier: 100 | 1_000 | 10_000,
): number {
  const base = current ?? 0
  return Math.max(
    0,
    Math.round((base + direction * tier) / tier) * tier,
  )
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

export interface MapMoneyText {
  display: string
  exact: string
}

const MAP_MONEY_UNITS = [
  { divisor: 1_000, suffix: 'K' },
  { divisor: 1_000_000, suffix: 'M' },
  { divisor: 1_000_000_000, suffix: 'B' },
  { divisor: 1_000_000_000_000, suffix: 'T' },
] as const

/** Compact visual text for constrained map labels, with exact text retained. */
export function mapMoney(
  value: number | null,
  maxLength: number,
  opts?: { approx?: boolean },
): MapMoneyText {
  const exact = money(value, opts)
  if (
    value === null ||
    !Number.isFinite(value) ||
    exact.length <= maxLength
  ) {
    return { display: exact, exact }
  }

  const rounded = Math.abs(Math.round(value))
  let unitIndex = -1
  for (let index = 0; index < MAP_MONEY_UNITS.length; index += 1) {
    if (rounded >= MAP_MONEY_UNITS[index].divisor) unitIndex = index
  }
  if (unitIndex < 0) return { display: exact, exact }

  let scaled = rounded / MAP_MONEY_UNITS[unitIndex].divisor
  if (
    Number(scaled.toFixed(1)) >= 1_000 &&
    unitIndex < MAP_MONEY_UNITS.length - 1
  ) {
    unitIndex += 1
    scaled = rounded / MAP_MONEY_UNITS[unitIndex].divisor
  }
  const amount = scaled.toFixed(1).replace(/\.0$/, '')
  const prefix = `${opts?.approx ? '~' : ''}${value < 0 ? '-' : ''}$`
  return {
    display: `${prefix}${amount}${MAP_MONEY_UNITS[unitIndex].suffix}`,
    exact,
  }
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
