import { describe, expect, it } from 'vitest'
import { mapFileName } from '../src/export/export'

describe('mapFileName', () => {
  it('strips Windows-illegal characters and collapses whitespace', () => {
    expect(mapFileName('  Sam\\ / Priya:*? "Venkat" <Family>|  ', '2026')).toBe(
      'Sam Priya Venkat Family — Money Map 2026.png',
    )
  })

  it('uses Client when the title is empty', () => {
    expect(mapFileName('  ', '2026')).toBe(
      'Client — Money Map 2026.png',
    )
    expect(mapFileName(undefined, '2026')).toBe(
      'Client — Money Map 2026.png',
    )
  })

  it('trims a long title to a filename no longer than 120 characters', () => {
    const fileName = mapFileName('A very long client title '.repeat(10), '2026')

    expect(fileName.length).toBeLessThanOrEqual(120)
    expect(fileName).toMatch(/ — Money Map 2026\.png$/)
  })
})
