import { describe, expect, it } from 'vitest'
import { gapLine, runwayLine } from '../src/model/math'

describe('runwayLine', () => {
  it('renders one decimal place from account value and monthly draw', () => {
    expect(runwayLine(165_000, 6_000)).toBe(
      'Approximately 2.3 years at $6,000 per month.',
    )
  })

  it.each([
    [null, 6_000],
    [165_000, null],
    [0, 6_000],
    [-165_000, 6_000],
    [165_000, 0],
    [165_000, -6_000],
  ])('suppresses absent or non-positive inputs (%s, %s)', (value, draw) => {
    expect(runwayLine(value, draw)).toBeNull()
  })

  it('suppresses a runway over 99 years', () => {
    expect(runwayLine(600_000, 500)).toBeNull()
    expect(runwayLine(594_000, 500)).toBe(
      'Approximately 99.0 years at $500 per month.',
    )
  })

  it('suppresses the line when math is off', () => {
    expect(runwayLine(165_000, 6_000, false)).toBeNull()
  })
})

describe('gapLine', () => {
  it.each([
    [null, 5_900, 2_000],
    [15_000, null, 2_000],
    [15_000, 5_900, null],
  ])(
    'suppresses when an input is absent (%s, %s, %s)',
    (need, income, draw) => {
      expect(gapLine(need, income, draw)).toBeNull()
    },
  )

  it('renders a positive gap from stated after-tax income and draw', () => {
    expect(gapLine(15_000, 5_900, 2_000)).toBe(
      '$7,100 per month is still needed after income and account withdrawals.',
    )
  })

  it('renders covered for zero and negative gaps', () => {
    expect(gapLine(15_000, 5_000, 10_000)).toBe(
      'Approximately covered by income and account withdrawals.',
    )
    expect(gapLine(15_000, 6_000, 10_000)).toBe(
      'Approximately covered by income and account withdrawals.',
    )
  })

  it('uses a stated zero or negative draw without guessing', () => {
    expect(gapLine(15_000, 5_000, 0)).toBe(
      '$10,000 per month is still needed after income and account withdrawals.',
    )
    expect(gapLine(15_000, 5_000, -1_000)).toBe(
      '$11,000 per month is still needed after income and account withdrawals.',
    )
  })

  it('suppresses the line when math is off', () => {
    expect(gapLine(15_000, 5_900, 2_000, false)).toBeNull()
  })
})
