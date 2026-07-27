import { describe, expect, it } from 'vitest'
import {
  BLANK,
  money,
  moneyPer,
  parseMoneyInput,
  wrap,
} from '../src/model/format'

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
