import { describe, expect, it } from 'vitest'
import {
  BLANK,
  accountDisplayName,
  bucketDisplayName,
  mastheadPeriodLabel,
  mapMoney,
  money,
  moneyPer,
  parseMoneyInput,
  stepMoney,
  wrap,
} from '../src/model/format'

describe('account display names', () => {
  it.each([
    ['shortTerm', 'Short-Term Bucket'],
    ['afterTax', 'After-Tax'],
    ['taxDeferred', 'Tax-Deferred'],
    ['taxPreferred', 'Tax-Preferred'],
    ['charitable', 'Charitable'],
    ['cash', 'Cash'],
    ['note', 'Note'],
  ] as const)('names the %s bucket', (bucket, displayName) => {
    expect(bucketDisplayName(bucket)).toBe(displayName)
  })

  it('uses the label when present and the bucket identity when blank', () => {
    expect(
      accountDisplayName({ bucket: 'shortTerm', label: 'Bridge Cash' }),
    ).toBe('Bridge Cash')
    expect(
      accountDisplayName({ bucket: 'shortTerm', label: '  ' }),
    ).toBe('Short-Term Bucket · unnamed')
  })
})

describe('parseMoneyInput', () => {
  it.each([
    ['85k', 85_000],
    ['1.2M', 1_200_000],
    ['$2,450,000', 2_450_000],
    ['.5m', 500_000],
    ['abc', null],
    ['', null],
  ])('parses %j as %s', (text, expected) => {
    expect(parseMoneyInput(text)).toBe(expected)
  })
})

describe('stepMoney', () => {
  it.each([
    [10_000, 1, 100, 10_100],
    [10_000, -1, 100, 9_900],
    [10_000, 1, 1_000, 11_000],
    [10_000, -1, 1_000, 9_000],
    [10_000, 1, 10_000, 20_000],
    [10_000, -1, 10_000, 0],
  ] as const)(
    'steps %d in direction %d on the %d tier to %d',
    (current, direction, tier, expected) => {
      expect(stepMoney(current, direction, tier)).toBe(expected)
    },
  )

  it('increments before snapping off-grid values', () => {
    expect(stepMoney(85_432, 1, 100)).toBe(85_500)
    expect(stepMoney(85_432, -1, 1_000)).toBe(84_000)
  })

  it('starts null at zero and floors negative steps at zero', () => {
    expect(stepMoney(null, 1, 100)).toBe(100)
    expect(stepMoney(null, -1, 100)).toBe(0)
    expect(stepMoney(50, -1, 100)).toBe(0)
  })

  it('accepts a parsed k/m shorthand value as its base', () => {
    expect(stepMoney(parseMoneyInput('85k'), 1, 1_000)).toBe(86_000)
    expect(stepMoney(parseMoneyInput('1.2m'), -1, 10_000)).toBe(
      1_190_000,
    )
  })
})

describe('mastheadPeriodLabel', () => {
  it('strips a trailing year from legacy mid-year labels', () => {
    expect(
      mastheadPeriodLabel({
        variant: 'postNote',
        year: '2026',
        postNoteLabel: 'April 2026',
      }),
    ).toBe('APRIL 2026')
  })

  it('renders month-only mid-year labels naturally', () => {
    expect(
      mastheadPeriodLabel({
        variant: 'postNote',
        year: '2026',
        postNoteLabel: 'April',
      }),
    ).toBe('APRIL 2026')
  })

  it('leaves the annual year untouched', () => {
    expect(
      mastheadPeriodLabel({
        variant: 'annual',
        year: 'FY 2026',
        postNoteLabel: 'April 2026',
      }),
    ).toBe('FY 2026')
  })
})

describe('money', () => {
  it('groups and rounds dollar values', () => {
    expect(money(1600000)).toBe('$1,600,000')
    expect(money(1234.6)).toBe('$1,235')
    expect(money(-2500)).toBe('-$2,500')
  })

  it('adds the optional approximate marker', () => {
    expect(money(1600000, { approx: true })).toBe('~$1,600,000')
  })

  it('keeps null and invalid values as fill-in blanks', () => {
    expect(money(null)).toBe(BLANK)
    expect(money(Number.NaN)).toBe(BLANK)
  })
})

describe('mapMoney', () => {
  it('uses exact money text whenever it fits', () => {
    expect(mapMoney(5_900, 6)).toEqual({
      display: '$5,900',
      exact: '$5,900',
    })
  })

  it('compacts long map values while retaining exact text', () => {
    expect(mapMoney(930_923_028, 8)).toEqual({
      display: '$930.9M',
      exact: '$930,923,028',
    })
  })

  it('removes trailing decimal zeroes from compact suffixes', () => {
    expect(mapMoney(1_000_000, 5)).toEqual({
      display: '$1M',
      exact: '$1,000,000',
    })
  })

  it('preserves signs, approximate markers, and blank semantics', () => {
    expect(mapMoney(-1_600_000, 8, { approx: true })).toEqual({
      display: '~-$1.6M',
      exact: '~-$1,600,000',
    })
    expect(mapMoney(null, 2)).toEqual({ display: BLANK, exact: BLANK })
  })
})
describe('moneyPer', () => {
  it('adds the requested income period', () => {
    expect(moneyPer(3000, 'mo')).toBe('$3,000 mo.')
    expect(moneyPer(25000, 'yr')).toBe('$25,000 yr.')
  })

  it('does not append a period to a blank', () => {
    expect(moneyPer(null, 'mo')).toBe(BLANK)
  })
})

describe('wrap', () => {
  it('breaks on spaces without splitting long words', () => {
    expect(wrap('alpha beta gamma', 10)).toEqual(['alpha beta', 'gamma'])
    expect(wrap('extraordinary small', 5)).toEqual([
      'extraordinary',
      'small',
    ])
  })

  it('returns no lines for empty or whitespace-only text', () => {
    expect(wrap('', 12)).toEqual([])
    expect(wrap('   ', 12)).toEqual([])
  })
})
