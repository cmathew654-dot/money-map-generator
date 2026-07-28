import { describe, expect, it } from 'vitest'
import { fitLines, textWidth } from '../src/layout/textfit'

describe('textWidth', () => {
  it('increases with text length and type size', () => {
    expect(textWidth('retirement', 18)).toBeGreaterThan(
      textWidth('retire', 18),
    )
    expect(textWidth('retirement', 18)).toBeGreaterThan(
      textWidth('retirement', 13.5),
    )
  })

  it('measures caps wider than lowercase', () => {
    expect(textWidth('RETIREMENT', 18)).toBeGreaterThan(
      textWidth('retirement', 18),
    )
  })
})

describe('fitLines', () => {
  it('keeps every produced line inside the measured width', () => {
    const words = [
      'Managed',
      'IRA',
      'Jordan',
      'Most',
      'Aggressive',
      'Allocation',
      'Donor-Advised',
      'Fund',
      'S&P',
      '500',
      'extraordinary',
      'Municipal',
      'Bond',
      'Ladder',
    ]

    for (let start = 0; start < words.length; start += 1) {
      const text = words.slice(start).join(' ')
      for (const maxWidth of [72, 108, 160, 220]) {
        const lines = fitLines(text, maxWidth, 18)
        expect(
          lines.every(
            (line) => textWidth(line, 18) <= maxWidth,
          ),
        ).toBe(true)
      }
    }
  })

  it('hard-breaks an overlong word without overflowing', () => {
    const maxWidth = 80
    const lines = fitLines(
      'SUPERCALIFRAGILISTICEXPIALIDOCIOUS',
      maxWidth,
      18,
    )

    expect(lines.length).toBeGreaterThan(1)
    expect(
      lines.every((line) => textWidth(line, 18) <= maxWidth),
    ).toBe(true)
    expect(lines.join('')).toBe(
      'SUPERCALIFRAGILISTICEXPIALIDOCIOUS',
    )
  })

  it('returns no lines for empty or blank input', () => {
    expect(fitLines('', 100, 18)).toEqual([])
    expect(fitLines('   ', 100, 18)).toEqual([])
  })
})
