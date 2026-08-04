import { describe, expect, it } from 'vitest'
import { buildPdf } from '../src/export/pdf'

const decoder = new TextDecoder('latin1')

function objectOffsets(pdf: Uint8Array): number[] {
  const source = decoder.decode(pdf)
  const match = /xref\n0 (\d+)\n([\s\S]*?)trailer/.exec(source)
  if (!match) throw new Error('xref table not found')
  return match[2]
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
    expect(source).toContain('trailer\n<< /Size 11 /Root 1 0 R /Info 6 0 R /ID [<')
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
  it('tags the raster map with accessible document metadata', () => {
    const pdf = buildPdf(new Uint8Array([0xff, 0xd8, 0x00, 0xff, 0xd9]), 1320, 1020, {
      title: "Mélanie's Money Map", language: 'fr-CA',
      alternativeText: 'A financial map for Mélanie showing assets, debts, and goals.',
    })
    const source = decoder.decode(pdf)
    expect(source).toContain('/MarkInfo << /Marked true >>')
    expect(source).toContain('/StructTreeRoot 7 0 R')
    expect(source).toContain('/Lang <FEFF00660072002D00430041>')
    expect(source).toContain('/StructParents 0')
    expect(source).toContain('/Figure <</MCID 0>> BDC')
    expect(source).toContain('/S /Document')
    expect(source).toContain('/S /Figure')
    expect(source).toContain('/S /Figure /P 8 0 R /Pg 3 0 R')
    expect(source).toContain('/Alt <FEFF0041002000660069006E0061006E006300690061006C0020006D0061007000200066006F00720020004D00E9006C0061006E00690065002000730068006F00770069006E00670020006100730073006500740073002C002000640065006200740073002C00200061006E006400200067006F0061006C0073002E>')
    expect(source).toContain('/Title <FEFF004D00E9006C0061006E00690065002700730020004D006F006E006500790020004D00610070>')
    expect(source).toContain('/ParentTree 9 0 R')
    expect(source).toContain('/Nums [0 [10 0 R]]')
  })

  it('uses English metadata defaults when none is supplied', () => {
    const source = decoder.decode(buildPdf(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]), 2, 2))
    expect(source).toContain('/Lang <FEFF0065006E002D00550053>')
    expect(source).toContain('/Title <FEFF004D006F006E006500790020004D00610070>')
    expect(source).toContain('/Alt <FEFF00410020004D006F006E006500790020004D00610070002000660069006E0061006E006300690061006C00200070006C0061006E006E0069006E00670020006400690061006700720061006D002E>')
  })
})
