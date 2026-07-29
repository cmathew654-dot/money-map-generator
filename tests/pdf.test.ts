import { describe, expect, it } from 'vitest'
import { buildPdf } from '../src/export/pdf'

const decoder = new TextDecoder('latin1')

function objectOffsets(pdf: Uint8Array): number[] {
  const source = decoder.decode(pdf)
  const match = /xref\n0 6\n([\s\S]*?)trailer/.exec(source)
  if (!match) throw new Error('xref table not found')
  return match[1]
    .trim()
    .split('\n')
    .slice(1)
    .map((entry) => Number(entry.slice(0, 10)))
}

describe('buildPdf', () => {
  it('writes one landscape page with an exact JPEG stream', () => {
    const jpeg = new Uint8Array([0xff, 0xd8, 0x01, 0x02, 0xff, 0xd9])
    const pdf = buildPdf(jpeg, 2640, 2040)
    const source = decoder.decode(pdf)

    expect(source.startsWith('%PDF-1.4')).toBe(true)
    expect(source).toContain('/Count 1')
    expect(source).toContain('/MediaBox [0 0 792 612]')
    expect(source).toContain('/Subtype /Image')
    expect(source).toContain('/Filter /DCTDecode')
    expect(source).toContain(`/Length ${jpeg.length} >>\nstream\n`)
    expect(source).toContain('/Width 2640 /Height 2040')
    expect(source).toContain('trailer\n<< /Size 6 /Root 1 0 R >>')
  })

  it('computes xref offsets from the actual byte positions', () => {
    const pdf = buildPdf(
      new Uint8Array([0xff, 0xd8, 0x00, 0xff, 0xd9]),
      1320,
      1020,
    )
    const source = decoder.decode(pdf)

    objectOffsets(pdf).forEach((offset, index) => {
      expect(source.slice(offset)).toMatch(
        new RegExp(`^${index + 1} 0 obj\\n`),
      )
    })

    const startXref = Number(/startxref\n(\d+)/.exec(source)?.[1])
    expect(source.slice(startXref)).toMatch(/^xref\n/)
  })
})
