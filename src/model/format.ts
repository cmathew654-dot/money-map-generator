/** Pure formatting helpers. null → the fill-in blank, by design. */

export const BLANK = '~$ ______'

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
