import { money } from './format'

function isPresentNumber(value: number | null): value is number {
  return value !== null && Number.isFinite(value)
}

export function runwayLine(
  accountValue: number | null,
  asNeededAmount: number | null,
  showMath = true,
): string | null {
  if (
    !showMath ||
    !isPresentNumber(accountValue) ||
    accountValue <= 0 ||
    !isPresentNumber(asNeededAmount) ||
    asNeededAmount <= 0
  ) {
    return null
  }

  const runway = accountValue / asNeededAmount / 12
  if (!Number.isFinite(runway) || runway > 99) return null
  return `Approximately ${runway.toFixed(1)} years at ${money(asNeededAmount)} per month.`
}

export function gapLine(
  monthlyNeed: number | null,
  afterTaxIncome: number | null,
  asNeededAmount: number | null,
  showMath = true,
): string | null {
  if (
    !showMath ||
    !isPresentNumber(monthlyNeed) ||
    !isPresentNumber(afterTaxIncome) ||
    !isPresentNumber(asNeededAmount)
  ) {
    return null
  }

  const gap = monthlyNeed - afterTaxIncome - asNeededAmount
  if (!Number.isFinite(gap)) return null
  return gap > 0
    ? `${money(gap)} per month is still needed after income and account withdrawals.`
    : 'Approximately covered by income and account withdrawals.'
}
