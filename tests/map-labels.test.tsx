import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  incomeTotalTextLayout,
  layoutMap,
  needTextLayout,
} from '../src/layout/layout'
import { parseBook } from '../src/model/book'
import {
  SAMPLE_CALLOWAY,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import {
  applyMapTextEdit,
  mapTextEditFsInfo,
  mapTextEditRawValue,
  type MapTextEditTarget,
} from '../src/ui/MapTextEditor'
import { MapSvg } from '../src/render/MapSvg'

type LabelFields = {
  incomeTotalLabel?: string
  needLabel?: string
  asNeededLabel?: string
  needCaption?: string
}

function withLabels(
  data: MoneyMapData,
  labels: LabelFields,
): MoneyMapData {
  return { ...data, ...labels } as MoneyMapData
}

function bookFor(data: MoneyMapData) {
  return {
    fileType: 'money-map-book' as const,
    version: 1 as const,
    clients: [data],
  }
}

function render(data: MoneyMapData): string {
  return renderToStaticMarkup(createElement(MapSvg, { data }))
}

async function markupHash(data: MoneyMapData): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(render(data)),
  )
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
}

function excessStory(): MoneyMapData {
  return {
    id: 'example-surplus-map',
    client: { title: 'Example Household', year: '2026', variant: 'annual' },
    incomeSources: [
      { id: 'example-income', label: 'Salary', amount: 10000, period: 'mo' },
    ],
    afterTaxIncome: 10000,
    incomeTotalLabel: 'GROSS INCOME',
    monthlyNeed: 4000,
    needLabel: 'MONTHLY EXCESS',
    needCaption: 'Surplus supports long-term investments.',
    asNeededAmount: 2000,
    asNeededLabel: 'Invest monthly',
    accounts: [
      {
        id: 'long-term-investments',
        bucket: 'afterTax',
        label: 'Long-Term Investments',
        value: 100000,
      },
    ],
    footnotes: [],
    hiddenArrows: ['income'],
    customArrows: [
      {
        id: 'surplus-flow',
        sourceId: 'need',
        targetId: 'long-term-investments',
        style: 'solid',
        label: '$6,000/mo surplus allocation',
      },
    ],
  }
}

function renderInteractive(data: MoneyMapData): string {
  return renderToStaticMarkup(createElement(MapSvg, {
    data,
    onChange: () => undefined,
    onElementClick: () => undefined,
  }))
}

describe('advisor-controlled map labels', () => {
  it('keeps the default labels and box widths unchanged', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)

    expect(incomeTotalTextLayout(SAMPLE_WHITFIELD, layout.income).label.exact)
      .toBe('After-Tax Income')
    expect(needTextLayout(SAMPLE_WHITFIELD, layout.need).label.exact)
      .toBe('MONTHLY INCOME NEED')
    expect(layout.income.w).toBe(280)
    expect(layout.need.w).toBeCloseTo(257.08)
  })

  it('uses custom income and need labels for both text and measured box width', () => {
    const incomeData = withLabels(SAMPLE_WHITFIELD, {
      incomeTotalLabel: 'GROSS INCOME AVAILABLE FOR INVESTMENT',
    })
    const needData = withLabels(SAMPLE_WHITFIELD, {
      needLabel: 'MONTHLY SURPLUS AVAILABLE FOR INVESTMENT',
    })
    const incomeLayout = layoutMap(incomeData)
    const needLayout = layoutMap(needData)

    expect(incomeTotalTextLayout(incomeData, incomeLayout.income).label.exact)
      .toBe('GROSS INCOME AVAILABLE FOR INVESTMENT')
    expect(incomeLayout.income.w).toBeGreaterThan(280)
    expect(needTextLayout(needData, needLayout.need).label.exact)
      .toBe('MONTHLY SURPLUS AVAILABLE FOR INVESTMENT')
    expect(needLayout.need.w).toBeGreaterThan(257.08)
  })

  it('renders advisor wording for the chip and need caption while retaining the amount', () => {
    const data = withLabels(SAMPLE_CALLOWAY, {
      asNeededLabel: 'Funds investments',
      needLabel: 'MONTHLY INVESTMENT RESERVE '.repeat(4),
      needCaption: 'Surplus reserve.',
    })
    const markup = render(data)

    expect(markup).toContain('Funds investments')
    expect(markup).toContain('$20,000')
    expect(markup).toContain('Surplus reserve.')
    expect(markup).not.toContain(
      'Approximately covered by income and account withdrawals.',
    )
  })

  it('restores each built-in when its stored value is empty or whitespace only', () => {
    const data = withLabels(SAMPLE_CALLOWAY, {
      incomeTotalLabel: ' ',
      needLabel: '\n\t',
      asNeededLabel: '   ',
    })
    const layout = layoutMap(data)
    const markup = render(data)

    expect(incomeTotalTextLayout(data, layout.income).label.exact).toBe(
      'After-Tax Income',
    )
    expect(needTextLayout(data, layout.need).label.exact).toBe(
      'MONTHLY INCOME NEED',
    )
    expect(markup).toContain('As needed')
    const roomyCaption = render(withLabels(SAMPLE_CALLOWAY, {
      needLabel: 'MONTHLY INVESTMENT RESERVE '.repeat(4),
      needCaption: '\t',
    }))
    expect(roomyCaption).toContain(
      'Approximately covered by income and account withdrawals.',
    )
  })

  it('round-trips every advisor label through a book', () => {
    const labels: LabelFields = {
      incomeTotalLabel: 'GROSS',
      needLabel: 'MONTHLY EXCESS',
      asNeededLabel: 'Invest as available',
      needCaption: 'Excess supports the long-term plan.',
    }
    const parsed = parseBook(JSON.stringify(bookFor(withLabels(SAMPLE_WHITFIELD, labels))))
      .clients[0] as MoneyMapData & LabelFields

    expect(parsed).toMatchObject(labels)
  })

  it.each([
    'incomeTotalLabel',
    'needLabel',
    'asNeededLabel',
    'needCaption',
  ] as const)('rejects a non-string %s', (field) => {
    const invalid = {
      ...SAMPLE_WHITFIELD,
      [field]: 42,
    } as MoneyMapData

    expect(() => parseBook(JSON.stringify(bookFor(invalid)))).toThrow()
  })
})

const EDITABLE_LABELS = [
  [
    { kind: 'incomeTotalLabel' } as MapTextEditTarget,
    'incomeTotalLabel',
    'After-Tax Income',
    'GROSS',
    'text:income:total',
  ],
  [
    { kind: 'needLabel' } as MapTextEditTarget,
    'needLabel',
    'MONTHLY INCOME NEED',
    'MONTHLY EXCESS',
    'text:need:label',
  ],
  [
    { kind: 'asNeededLabel' } as MapTextEditTarget,
    'asNeededLabel',
    'As needed',
    'Invest as available',
    'text:asNeeded:amount',
  ],
  [
    { kind: 'needCaption' } as MapTextEditTarget,
    'needCaption',
    'Approximately covered by income and account withdrawals.',
    'Surplus reserve.',
    'text:need:supporting',
  ],
] as const

describe('advisor-controlled map label editing', () => {
  it.each(EDITABLE_LABELS)(
    'opens %s with its rendered text and saves then clears it',
    (target, field, builtIn, replacement) => {
      expect(mapTextEditRawValue(SAMPLE_CALLOWAY, target)).toBe(builtIn)
      expect(
        mapTextEditRawValue(
          withLabels(SAMPLE_CALLOWAY, { [field]: replacement } as LabelFields),
          target,
        ),
      ).toBe(replacement)

      const updated = applyMapTextEdit(
        SAMPLE_CALLOWAY,
        target,
        replacement,
      ) as MoneyMapData & LabelFields
      expect(updated[field]).toBe(replacement)
      expect(applyMapTextEdit(SAMPLE_CALLOWAY, target, builtIn)).toBe(
        SAMPLE_CALLOWAY,
      )

      const cleared = applyMapTextEdit(updated, target, '') as MoneyMapData & LabelFields
      expect(cleared).not.toHaveProperty(field)
      expect(mapTextEditRawValue(cleared, target)).toBe(builtIn)
    },
  )

  it.each(EDITABLE_LABELS)(
    'keeps %s on its existing text-size key',
    (target, _field, _builtIn, _replacement, key) => {
      expect(mapTextEditFsInfo(SAMPLE_CALLOWAY, target)).toMatchObject({ key })
    },
  )
})

describe('advisor-controlled map label targets', () => {
  it('keeps labels distinct from their adjacent numeric edits', () => {
    const markup = renderInteractive(withLabels(SAMPLE_CALLOWAY, {
      needLabel: 'MONTHLY INVESTMENT RESERVE '.repeat(4),
      needCaption: 'Surplus reserve.',
    }))

    expect(markup).toMatch(/data-map-edit-key=\x22incomeTotalLabel\x22/)
    expect(markup).toMatch(/data-map-edit-hit=\x22afterTaxIncome\x22/)
    expect(markup).toMatch(/data-map-edit-key=\x22needLabel\x22/)
    expect(markup).toMatch(/data-map-edit-hit=\x22monthlyNeed\x22/)
    expect(markup).toMatch(/data-map-edit-key=\x22asNeededLabel\x22/)
    expect(markup).toMatch(/data-map-edit-hit=\x22asNeededAmount\x22/)
    expect(markup).toMatch(/data-map-edit-key=\x22needCaption\x22/)
  })
})

describe('advisor-controlled map label final regressions', () => {
  it('keeps the shipped sample static markup byte-identical', async () => {
    expect(await markupHash(SAMPLE_WHITFIELD)).toBe(
      '89d3ee6eb39abfcca937f7835e91dfac70de121de6824a9ec448f5b8a6ebcf7f',
    )
  })

  it('renders a labelled custom surplus flow after hiding the generated income arrow', () => {
    const data = excessStory()
    const layout = layoutMap(data)
    const custom = layout.arrows.find((arrow) => arrow.id === 'surplus-flow')

    expect(custom).toMatchObject({
      kind: 'custom',
      id: 'surplus-flow',
      sourceId: 'need',
      targetId: 'long-term-investments',
      label: '$6,000/mo surplus allocation',
      labelAt: { x: expect.any(Number), y: expect.any(Number) },
    })
    expect(layout.arrows.some((arrow) => arrow.kind === 'income')).toBe(false)
    expect(parseBook(JSON.stringify(bookFor(data))).clients[0]).toMatchObject({
      incomeTotalLabel: 'GROSS INCOME',
      needLabel: 'MONTHLY EXCESS',
      needCaption: 'Surplus supports long-term investments.',
      asNeededLabel: 'Invest monthly',
      hiddenArrows: ['income'],
      customArrows: [
        {
          id: 'surplus-flow',
          sourceId: 'need',
          targetId: 'long-term-investments',
          label: '$6,000/mo surplus allocation',
        },
      ],
    })
  })

  it('keeps a redrawn custom flow label static when amounts change (D6 limitation)', () => {
    const data = excessStory()
    const initial = layoutMap(data).arrows.find(
      (arrow) => arrow.id === 'surplus-flow',
    )
    const changed = layoutMap({
      ...data,
      afterTaxIncome: 12000,
      asNeededAmount: 3000,
    }).arrows.find((arrow) => arrow.id === 'surplus-flow')

    expect(initial?.label).toBe('$6,000/mo surplus allocation')
    expect(changed?.label).toBe('$6,000/mo surplus allocation')
  })
})
