import { describe, expect, it } from 'vitest'
import { layoutMap, type PlacedAccount } from '../src/layout/layout'
import { newBook } from '../src/model/book'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
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

function pathNumbers(path: string): number[] {
  return [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
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

  it('places short-term accounts above cash in the center column', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const cash = layout.accounts.find(
      (placed) => placed.account.id === 'cash-at-bank',
    )!
    const shortTerm = layout.accounts.find(
      (placed) => placed.account.id === 'short-term-funds',
    )!

    expect(shortTerm.x).toBe(cash.x)
    expect(shortTerm.y).toBeLessThan(cash.y)
  })

  it('routes the after-tax waterfall directly into the target cap left shoulder', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const shortTerm = layout.accounts.find(
      (placed) => placed.account.id === 'short-term-funds',
    )!
    const arrow = layout.arrows.find(
      (candidate) =>
        candidate.kind === 'waterfall' &&
        candidate.sourceId === 'managed-after-tax-trust' &&
        candidate.targetId === 'short-term-funds',
    )!
    const path = pathNumbers(arrow.d)
    const [, , , firstControlY, , secondControlY] = path
    const [endX, endY] = path.slice(-2)

    expect(path).toHaveLength(8)
    expect(firstControlY).toBeLessThan(shortTerm.y)
    expect(secondControlY).toBe(firstControlY)
    expect(endX).toBe(shortTerm.x + shortTerm.w * 0.35)
    expect(endY).toBe(shortTerm.y - 4)
  })

  it('keeps every waterfall coordinate below the masthead band', () => {
    const waterfall = newBook().clients.flatMap((client) =>
      layoutMap(client).arrows.filter(
        (arrow) => arrow.kind === 'waterfall',
      ),
    )

    expect(waterfall.length).toBeGreaterThan(0)
    for (const arrow of waterfall) {
      expect(arrow.d).not.toContain('NaN')
      const coordinates = pathNumbers(arrow.d)
      expect(coordinates.length).toBeGreaterThan(0)
      expect(coordinates.length % 2).toBe(0)
      expect(coordinates.every(Number.isFinite)).toBe(true)
      const yCoordinates = coordinates.filter((_, index) => index % 2 === 1)
      expect(Math.min(...yCoordinates)).toBeGreaterThanOrEqual(128)
    }
  })

  it('keeps the content-light cash drum compact', () => {
    const cash = layoutMap(SAMPLE_WHITFIELD).accounts.find(
      (placed) => placed.account.id === 'cash-at-bank',
    )!

    expect(cash.h).toBeGreaterThanOrEqual(150)
    expect(cash.h).toBeLessThanOrEqual(170)
  })

  it('lands need-card arrows at their distinct requested anchors', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const income = layout.arrows.find((arrow) => arrow.kind === 'income')!
    const asNeeded = layout.arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!
    const incomePath = pathNumbers(income.d)
    const asNeededPath = pathNumbers(asNeeded.d)
    const shortTerm = layout.accounts.find(
      (placed) => placed.account.id === 'short-term-funds',
    )!

    expect(incomePath).toEqual([
      layout.income.x + layout.income.w / 2,
      layout.income.y + layout.income.h,
      layout.need.x + layout.need.w / 2,
      layout.need.y,
    ])
    expect(asNeededPath.slice(-2)).toEqual([
      layout.need.x + layout.need.w + 6,
      layout.need.y + layout.need.h * 0.45,
    ])

    const [startX, startY, controlX, controlY, endX, endY] =
      asNeededPath
    const t = 0.4
    const oneMinusT = 1 - t
    const labelX =
      oneMinusT ** 2 * startX +
      2 * oneMinusT * t * controlX +
      t ** 2 * endX
    const labelY =
      oneMinusT ** 2 * startY +
      2 * oneMinusT * t * controlY +
      t ** 2 * endY
    expect(asNeeded.labelAt?.x).toBeLessThanOrEqual(labelX)
    expect(asNeeded.labelAt?.y).toBeLessThanOrEqual(labelY)
    expect(startY).toBe(shortTerm.y + shortTerm.h * 0.72)
  })

  it('keeps the Calloway as-needed chip clear of every account', () => {
    const layout = layoutMap(SAMPLE_CALLOWAY)
    const labelAt = layout.arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!.labelAt!
    const clearance = 10
    const labelBox = {
      x: labelAt.x - 260 / 2 - clearance,
      y: labelAt.y - 34 / 2 - clearance,
      w: 260 + clearance * 2,
      h: 34 + clearance * 2,
    }
    const intersects = (account: PlacedAccount) =>
      labelBox.x < account.x + account.w &&
      labelBox.x + labelBox.w > account.x &&
      labelBox.y < account.y + account.h &&
      labelBox.y + labelBox.h > account.y

    expect(layout.accounts.filter(intersects)).toEqual([])
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
