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

  const runwayMonths = accountValue / asNeededAmount
  if (!Number.isFinite(runwayMonths) || runwayMonths < 1) return null
  if (runwayMonths < 12) {
    const months = Math.min(11, Math.max(1, Math.floor(runwayMonths)))
    return `Approximately ${months} ${months === 1 ? 'month' : 'months'} at ${money(asNeededAmount)} per month.`
  }
  const runwayYears = runwayMonths / 12
  if (runwayYears > 99) return null
  return `Approximately ${runwayYears.toFixed(1)} years at ${money(asNeededAmount)} per month.`
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
