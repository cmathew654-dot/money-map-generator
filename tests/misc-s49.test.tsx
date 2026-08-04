import { createElement, createRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { buildPdf } from '../src/export/pdf'
import { SAMPLE_WHITFIELD } from '../src/model/samples'
import { EditorPanels, contentGroups, contentItems } from '../src/ui/EditorPanels'
import type { MoneyMapData } from '../src/model/types'

const decoder = new TextDecoder('latin1')

const DATA: MoneyMapData = {
  ...SAMPLE_WHITFIELD,
  notes: [{ id: 'note-1', text: 'Review beneficiary update', x: 100, y: 100 }],
}

function contentsMarkup(): string {
  return renderToStaticMarkup(
    createElement(EditorPanels, {
      activePanel: 'contents',
      data: DATA,
      selectedTargetKey: null,
      canMutate: true,
      headingRef: createRef<HTMLHeadingElement>(),
      onClose: () => {},
      onOpenData: () => {},
      onSelectTarget: () => {},
      onAddIncome: () => {},
      onAddAccount: () => {},
      onSetNeed: () => {},
      onAddFlow: () => {},
      onAddTextNote: () => {},
      onAddFinePrint: () => {},
      onRestoreGeneratedFlows: () => {},
    }),
  )
}

describe('contents panel grouping', () => {
  it('groups every item and keeps the panel order Income, Needs, Accounts, Flows, Notes', () => {
    const groups = contentGroups(contentItems(DATA))
    expect(groups.map(([name]) => name)).toEqual(['Income', 'Needs', 'Accounts', 'Flows', 'Notes'])
  })

  it('puts each item under the group its type implies', () => {
    const groups = new Map<string, { key: string }[]>(contentGroups(contentItems(DATA)))
    const keys = (name: string) => (groups.get(name) ?? []).map((item) => item.key)
    expect(keys('Income')).toEqual(['income'])
    expect(keys('Needs')).toEqual(['need'])
    expect(keys('Accounts').every((key) => key.startsWith('account:'))).toBe(true)
    expect(keys('Accounts')).toHaveLength(DATA.accounts.length)
    expect(keys('Flows').every((key) => key.startsWith('arrow:'))).toBe(true)
    expect(keys('Flows').length).toBeGreaterThan(0)
    expect(keys('Notes')).toContain('note:note-1')
    expect(keys('Notes').some((key) => key.startsWith('text:footnotes:line:'))).toBe(true)
  })

  it('drops groups with no items', () => {
    const bare: MoneyMapData = { ...DATA, notes: [], footnotes: [], customArrows: [], accounts: [] }
    expect(contentGroups(contentItems(bare)).map(([name]) => name)).not.toContain('Notes')
    expect(contentGroups(contentItems(bare)).map(([name]) => name)).not.toContain('Accounts')
  })

  it('renders a heading per group above the unchanged rows', () => {
    const markup = contentsMarkup()
    for (const name of ['Income', 'Needs', 'Accounts', 'Flows', 'Notes']) {
      expect(markup).toContain(`<h3>${name}</h3>`)
    }
    expect(markup.indexOf('<h3>Income</h3>')).toBeLessThan(markup.indexOf('<h3>Accounts</h3>'))
    expect(markup.indexOf('<h3>Accounts</h3>')).toBeLessThan(markup.indexOf('<h3>Notes</h3>'))
    expect(markup).toContain('class="editor-content-row"')
    expect(markup).toContain('Review beneficiary update')
  })
})

describe('pdf provenance metadata', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0x01, 0x02, 0xff, 0xd9])

  it('names a producer and a well-formed creation date', () => {
    const source = decoder.decode(buildPdf(jpeg, 800, 600))
    expect(source).toContain('/Producer <FEFF004D006F006E006500790020004D00610070>')
    expect(source).toMatch(/\/CreationDate \(D:\d{14}\+00'00'\)/)
  })

  it("writes a two-part document /ID in the trailer, derived from the file's own bytes", () => {
    const source = decoder.decode(buildPdf(jpeg, 800, 600))
    const match = /\/ID \[<([0-9A-F]{32})> <([0-9A-F]{32})>\]/.exec(source)
    expect(match).not.toBeNull()
    expect(match![1]).toBe(match![2])
    const other = decoder.decode(buildPdf(new Uint8Array([0xff, 0xd8, 0x09, 0xff, 0xd9]), 800, 600))
    expect(/\/ID \[<([0-9A-F]{32})>/.exec(other)![1]).not.toBe(match![1])
  })

  it('keeps the xref offsets and startxref valid with the metadata added', () => {
    const pdf = buildPdf(jpeg, 800, 600)
    const source = decoder.decode(pdf)
    const table = /xref\n0 (\d+)\n([\s\S]*?)trailer/.exec(source)!
    const offsets = table[2].trim().split('\n').slice(1).map((entry) => Number(entry.slice(0, 10)))
    expect(offsets).toHaveLength(Number(table[1]) - 1)
    offsets.forEach((offset, index) => {
      expect(source.slice(offset)).toMatch(new RegExp(`^${index + 1} 0 obj\\n`))
    })
    expect(source.slice(Number(/startxref\n(\d+)/.exec(source)![1]))).toMatch(/^xref\n/)
    expect(source.endsWith('%%EOF\n')).toBe(true)
  })
})
