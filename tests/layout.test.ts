import { describe, expect, it } from 'vitest'
import { layoutMap, type PlacedAccount } from '../src/layout/layout'
import { blankClient, SAMPLE_WHITFIELD } from '../src/model/samples'
import type { Account, MoneyMapData } from '../src/model/types'

function expectInsideArtboard(data: MoneyMapData) {
  const layout = layoutMap(data)
  const boxes = [layout.income, layout.need, ...layout.accounts]

  for (const box of boxes) {
    expect(box.x).toBeGreaterThanOrEqual(0)
    expect(box.y).toBeGreaterThanOrEqual(0)
    expect(box.x + box.w).toBeLessThanOrEqual(layout.artboard.width)
    expect(box.y + box.h).toBeLessThanOrEqual(layout.artboard.height)
  }
}

function expectColumnGaps(accounts: PlacedAccount[]) {
  const xCoordinates = [...new Set(accounts.map((account) => account.x))]

  for (const x of xCoordinates) {
    const column = accounts
      .filter((account) => account.x === x)
      .sort((a, b) => a.y - b.y)

    for (let index = 1; index < column.length; index += 1) {
      const previous = column[index - 1]
      const gap = column[index].y - (previous.y + previous.h)
      expect(gap).toBeGreaterThanOrEqual(8)
    }
  }
}

describe('layoutMap', () => {
  it.each([
    ['sample client', SAMPLE_WHITFIELD],
    ['blank client', blankClient()],
  ])('keeps every %s box within the artboard', (_label, data) => {
    expectInsideArtboard(data)
  })

  it.each([
    ['sample client', SAMPLE_WHITFIELD],
    ['blank client', blankClient()],
  ])('does not overlap accounts for the %s', (_label, data) => {
    expectColumnGaps(layoutMap(data).accounts)
  })

  it('connects the waterfall from tax-deferred to after-tax to short-term', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const waterfall = layout.arrows.filter(
      (arrow) => arrow.kind === 'waterfall',
    )
    const byId = new Map(
      layout.accounts.map((placed) => [placed.account.id, placed]),
    )
    const chainIds = [
      waterfall[0].sourceId,
      ...waterfall.map((arrow) => arrow.targetId),
    ]
    const chain = chainIds.map((id) => byId.get(id ?? '')!)

    expect(waterfall).toHaveLength(2)
    expect(chain.map((placed) => placed.account.bucket)).toEqual([
      'taxDeferred',
      'afterTax',
      'shortTerm',
    ])
    expect(chain[0].x).toBeGreaterThan(chain[1].x)
    expect(chain[1].x).toBeGreaterThan(chain[2].x)
  })

  it('uses the specified fixed panel and footnote slots', () => {
    const sample = layoutMap(SAMPLE_WHITFIELD)
    const blank = layoutMap(blankClient())

    for (const layout of [sample, blank]) {
      expect(layout.income.x).toBe(48)
      expect(layout.income.y).toBe(150)
      expect(layout.income.w).toBe(280)
      expect(layout.need).toEqual({ x: 48, y: 680, w: 250, h: 170 })
      expect(layout.footnotesAt).toEqual({ x: 390, y: 930 })
    }
  })

  it('compresses a dense eight-account client without shrinking below 120', () => {
    const denseAccount = (id: string): Account => ({
      id,
      bucket: 'taxDeferred',
      label: 'Additional Managed Retirement Account',
      caption: 'A deliberately tall test account',
      value: null,
      subAccounts: [
        {
          label: 'Short-Term Funds',
          caption: 'Annual distributions',
          value: null,
        },
      ],
      inWaterfall: false,
    })
    const dense: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      accounts: [
        ...SAMPLE_WHITFIELD.accounts,
        denseAccount('dense-one'),
        denseAccount('dense-two'),
      ],
    }
    const layout = layoutMap(dense)
    const farColumn = layout.accounts.filter((account) => account.x === 1020)

    expect(layout.accounts).toHaveLength(8)
    expect(farColumn).toHaveLength(5)
    expect(farColumn.some((account) => account.h < 159)).toBe(true)
    expect(farColumn.every((account) => account.h >= 120)).toBe(true)
    expect(
      Math.max(...farColumn.map((account) => account.y + account.h)),
    ).toBeLessThanOrEqual(890)
    expectColumnGaps(layout.accounts)
  })
})
