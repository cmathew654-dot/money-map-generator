import { describe, expect, it } from 'vitest'
import {
  CAP_CONTENT_GAP,
  hexagonInset,
  layoutMap,
  MIN_ACCOUNT_WIDTH,
  pointOnOutline,
  rotatePoint,
  type PlacedAccount,
} from '../src/layout/layout'
import { textWidth } from '../src/layout/textfit'
import { newBook } from '../src/model/book'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { Account, MoneyMapData } from '../src/model/types'
import type { AccountShape } from '../src/model/types'
import { accountShape } from '../src/model/types'
import { TYPE } from '../src/render/tokens'

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

function expectCenteredContent(
  data: MoneyMapData,
  lowerBound: number,
) {
  const { contentBounds } = layoutMap(data)
  const leftMargin = contentBounds.x - 48
  const rightMargin =
    1320 - 48 - (contentBounds.x + contentBounds.w)
  const topMargin = contentBounds.y - 118
  const bottomMargin =
    lowerBound - (contentBounds.y + contentBounds.h)

  expect(Math.abs(leftMargin - rightMargin)).toBeLessThanOrEqual(24)
  expect(Math.abs(topMargin - bottomMargin)).toBeLessThanOrEqual(40)
}

function pathNumbers(path: string): number[] {
  return [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
}

function boxesIntersect(
  first: { x: number; y: number; w: number; h: number },
  second: { x: number; y: number; w: number; h: number },
): boolean {
  return (
    first.x < second.x + second.w &&
    first.x + first.w > second.x &&
    first.y < second.y + second.h &&
    first.y + first.h > second.y
  )
}

function expectAsNeededChipClear(data: MoneyMapData) {
  const layout = layoutMap(data)
  const labelAt = layout.arrows.find(
    (arrow) => arrow.kind === 'asNeeded',
  )!.labelAt!
  const chip = {
    x: labelAt.x - 250 / 2,
    y: labelAt.y - 38 / 2,
    w: 250,
    h: 38,
  }

  expect(
    [layout.income, layout.need, ...layout.accounts].filter(
      (obstacle) => boxesIntersect(chip, obstacle),
    ),
  ).toEqual([])
}

function segmentIntersectsBox(
  start: { x: number; y: number },
  end: { x: number; y: number },
  box: { x: number; y: number; w: number; h: number },
): boolean {
  let entry = 0
  let exit = 1

  for (const [origin, delta, minimum, maximum] of [
    [start.x, end.x - start.x, box.x, box.x + box.w],
    [start.y, end.y - start.y, box.y, box.y + box.h],
  ]) {
    if (delta === 0) {
      if (origin <= minimum || origin >= maximum) return false
      continue
    }
    const first = (minimum - origin) / delta
    const second = (maximum - origin) / delta
    entry = Math.max(entry, Math.min(first, second))
    exit = Math.min(exit, Math.max(first, second))
  }

  return entry < exit && exit > 0 && entry < 1
}

function pointOnQuadratic(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const oneMinusT = 1 - t
  return {
    x:
      oneMinusT ** 2 * start.x +
      2 * oneMinusT * t * control.x +
      t ** 2 * end.x,
    y:
      oneMinusT ** 2 * start.y +
      2 * oneMinusT * t * control.y +
      t ** 2 * end.y,
  }
}

function singleAccountData(shape: AccountShape): MoneyMapData {
  const data = blankClient()
  data.accounts = [
    {
      id: 'shape-account',
      bucket: 'shortTerm',
      shape,
      label: 'Shape account',
      value: 250000,
      inWaterfall: false,
    },
  ]
  return data
}

function textStressData(
  label: string,
  caption?: string,
  width?: number,
): MoneyMapData {
  const data = blankClient()
  data.accounts = [
    {
      id: 'text-stress',
      bucket: 'cash',
      label,
      caption,
      value: null,
      inWaterfall: false,
    },
  ]
  if (width !== undefined) {
    data.layoutOverrides = { 'text-stress': { w: width } }
  }
  return data
}

function expectAccountTextIntegrity(data: MoneyMapData) {
  for (const placed of layoutMap(data).accounts) {
    for (const line of placed.titleLines) {
      expect(textWidth(line, TYPE.accountTitle)).toBeLessThanOrEqual(
        placed.usableTitleWidth,
      )
    }
    for (const line of placed.captionLines) {
      expect(textWidth(line, TYPE.caption)).toBeLessThanOrEqual(
        placed.usableCaptionWidth,
      )
    }
    for (const subLayout of placed.subAccountLayouts) {
      for (const line of subLayout.titleLines) {
        expect(
          textWidth(line, TYPE.subAccountTitle),
        ).toBeLessThanOrEqual(subLayout.usableTitleWidth)
      }
      for (const line of subLayout.captionLines) {
        expect(
          textWidth(line, TYPE.subAccountCaption),
        ).toBeLessThanOrEqual(subLayout.usableCaptionWidth)
      }
      expect(subLayout.lastBaseline + 10 + 8).toBeLessThanOrEqual(
        subLayout.h,
      )
    }

    if (accountShape(placed.account) === 'drum') {
      expect(placed.firstBaseline).toBeGreaterThanOrEqual(
        placed.capRy * 2 + CAP_CONTENT_GAP,
      )
      expect(
        placed.contentBottom + placed.capRy + 8,
      ).toBeLessThanOrEqual(placed.h)
    } else {
      const bottomClearance =
        accountShape(placed.account) === 'pill' ? 24 : 20
      expect(
        placed.contentBottom + bottomClearance,
      ).toBeLessThanOrEqual(placed.h)
    }

    expect(placed.contentBottom).toBeLessThan(placed.h)
    expect(placed.lastBaseline).toBeLessThan(placed.h)
  }
}

describe('layoutMap', () => {
  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
    ['60-character all-caps label', textStressData('W'.repeat(60))],
    [
      '90-character caption',
      textStressData(
        'Caption stress',
        'A measured caption must remain fully inside its account shape. '.repeat(
          2,
        ).slice(0, 90),
      ),
    ],
    [
      'minimum-width override',
      textStressData(
        'A deliberately long account label at minimum width',
        undefined,
        MIN_ACCOUNT_WIDTH,
      ),
    ],
  ])('keeps every %s account text line inside its shape', (_label, data) => {
    expectAccountTextIntegrity(data)
  })

  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
  ])('keeps the %s content bounds inside the artboard', (_label, data) => {
    const { artboard, contentBounds } = layoutMap(data)

    expect(contentBounds.x).toBeGreaterThanOrEqual(0)
    expect(contentBounds.y).toBeGreaterThanOrEqual(0)
    expect(contentBounds.x + contentBounds.w).toBeLessThanOrEqual(
      artboard.width,
    )
    expect(contentBounds.y + contentBounds.h).toBeLessThanOrEqual(
      artboard.height,
    )
  })

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

  it('keeps account placement boxes shape-independent', () => {
    const placements = (['drum', 'card', 'rect', 'pill'] as const).map(
      (shape) => {
        const placed = layoutMap(singleAccountData(shape)).accounts[0]
        return {
          x: placed.x,
          y: placed.y,
          w: placed.w,
          h: placed.h,
        }
      },
    )

    expect(placements.slice(1).every((placed) =>
      JSON.stringify(placed) === JSON.stringify(placements[0]),
    )).toBe(true)
  })

  it.each(['drum', 'card', 'rect', 'pill'] as const)(
    'anchors cardinal arrows on the facing %s boundary',
    (shape) => {
      const data = singleAccountData(shape)
      const base = layoutMap(data)
      const account = base.accounts[0]
      const need = base.need
      const center = {
        x: account.x + account.w / 2,
        y: account.y + account.h / 2,
      }
      const targets = [
        {
          edge: 'top',
          x: center.x - need.w / 2,
          y: 128,
          coordinate: account.y,
        },
        {
          edge: 'right',
          x: 1022,
          y: center.y - need.h / 2,
          coordinate: account.x + account.w,
        },
        {
          edge: 'bottom',
          x: center.x - need.w / 2,
          y: 800,
          coordinate: account.y + account.h,
        },
        {
          edge: 'left',
          x: 48,
          y: center.y - need.h / 2,
          coordinate: account.x,
        },
      ]

      for (const target of targets) {
        const placed = layoutMap({
          ...data,
          layoutOverrides: {
            need: {
              dx: target.x - need.x,
              dy: target.y - need.y,
            },
          },
        })
        const arrow = placed.arrows.find(
          (candidate) => candidate.kind === 'asNeeded',
        )!
        const boundary =
          target.edge === 'top' || target.edge === 'bottom'
            ? arrow.start.y
            : arrow.start.x
        const crossAxis =
          target.edge === 'top' || target.edge === 'bottom'
            ? arrow.start.x
            : arrow.start.y
        const expectedCrossAxis =
          target.edge === 'top' || target.edge === 'bottom'
            ? center.x
            : center.y

        expect(boundary).toBeCloseTo(target.coordinate, 0)
        if (shape === 'rect') {
          expect(Math.abs(crossAxis - expectedCrossAxis)).toBeLessThan(1)
        } else {
          expect(crossAxis).toBeCloseTo(expectedCrossAxis, 0)
        }
      }

      if (shape === 'rect') {
        const inset = hexagonInset(account.w, account.h)
        const slantMidpoint = {
          x: account.x + account.w - inset / 2,
          y: account.y + account.h / 4,
        }
        const targetCenter = {
          x: center.x + (slantMidpoint.x - center.x) * 2,
          y: center.y + (slantMidpoint.y - center.y) * 2,
        }
        const placed = layoutMap({
          ...data,
          layoutOverrides: {
            need: {
              dx: targetCenter.x - need.w / 2 - need.x,
              dy: targetCenter.y - need.h / 2 - need.y,
            },
          },
        })
        const arrow = placed.arrows.find(
          (candidate) => candidate.kind === 'asNeeded',
        )!

        expect(arrow.start.x).toBeCloseTo(slantMidpoint.x, 0)
        expect(arrow.start.y).toBeCloseTo(slantMidpoint.y, 0)
      }
    },
  )

  it.each([45, 90])(
    'rotates a cardinal drum outline anchor by %i degrees',
    (rot) => {
      const data = singleAccountData('drum')
      data.layoutOverrides = {
        'shape-account': { rot },
      }
      const layout = layoutMap(data)
      const account = layout.accounts[0]
      const unrotated = { ...account, rot: 0 }
      const center = {
        x: account.x + account.w / 2,
        y: account.y + account.h / 2,
      }
      const expected = rotatePoint(
        pointOnOutline(unrotated, 0.125),
        center,
        rot,
      )

      expect(pointOnOutline(account, 0.125).x).toBeCloseTo(expected.x)
      expect(pointOnOutline(account, 0.125).y).toBeCloseTo(expected.y)

      const arrow = layout.arrows.find(
        (candidate) => candidate.kind === 'asNeeded',
      )!
      expect(arrow.start).toEqual(
        pointOnOutline(account, arrow.startT),
      )
    },
  )

  it('keeps generated Whitfield waterfalls cap-to-cap with an apex above both caps', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const byId = new Map(
      layout.accounts.map((placed) => [placed.account.id, placed]),
    )
    const waterfall = layout.arrows.filter(
      (arrow) => arrow.kind === 'waterfall',
    )

    for (const arrow of waterfall) {
      const source = byId.get(arrow.sourceId ?? '')!
      const target = byId.get(arrow.targetId ?? '')!
      const midpoint = pointOnQuadratic(
        arrow.start,
        arrow.control,
        arrow.end,
        0.5,
      )

      expect(arrow.start.y).toBeLessThan(
        source.y + source.capRy * 0.15,
      )
      expect(arrow.end.y).toBeLessThan(
        target.y + target.capRy * 0.15,
      )
      expect(midpoint.y).toBeLessThan(source.y)
      expect(midpoint.y).toBeLessThan(target.y)
    }
  })

  it('caps every sample waterfall arc near its connected drum tops', () => {
    let waterfallCount = 0

    for (const client of newBook().clients) {
      const layout = layoutMap(client)
      const byId = new Map(
        layout.accounts.map((placed) => [placed.account.id, placed]),
      )
      const waterfall = layout.arrows.filter(
        (arrow) => arrow.kind === 'waterfall',
      )
      waterfallCount += waterfall.length

      for (const arrow of waterfall) {
        expect(arrow.d).not.toContain('NaN')
        const coordinates = pathNumbers(arrow.d)
        expect(coordinates.length).toBeGreaterThan(0)
        expect(coordinates.length % 2).toBe(0)
        expect(coordinates.every(Number.isFinite)).toBe(true)
        const source = byId.get(arrow.sourceId ?? '')!
        const target = byId.get(arrow.targetId ?? '')!
        const yCoordinates = coordinates.filter(
          (_, index) => index % 2 === 1,
        )
        const minimumPathY = Math.min(...yCoordinates)

        expect(minimumPathY).toBeGreaterThanOrEqual(
          Math.min(source.y, target.y) - 26,
        )
        expect(minimumPathY).toBeGreaterThanOrEqual(128)
      }
    }

    expect(waterfallCount).toBeGreaterThan(0)
  })

  it('keeps the content-light cash drum compact', () => {
    const cash = layoutMap(SAMPLE_WHITFIELD).accounts.find(
      (placed) => placed.account.id === 'cash-at-bank',
    )!

    expect(cash.h).toBeGreaterThanOrEqual(150)
    expect(cash.h).toBeLessThanOrEqual(170)
  })

  it.each([
    ['above', { dx: 15, dy: -596 }, { dy: 500 }, 'top', 'bottom'],
    ['below', { dx: 15 }, {}, 'bottom', 'top'],
    ['left', { dx: -472, dy: -551 }, {}, 'left', 'right'],
    ['right', { dx: 502, dy: -551 }, {}, 'right', 'left'],
  ])(
    'selects facing card anchors when the target is %s',
    (_label, needOverride, incomeOverride, sourceEdge, targetEdge) => {
      const data = blankClient()
      data.layoutOverrides = {
        income: incomeOverride,
        need: needOverride,
      }
      const layout = layoutMap(data)
      const arrow = layout.arrows.find(
        (candidate) => candidate.kind === 'income',
      )!

      const edgeCoordinate = (
        box: typeof layout.income,
        edge: string,
      ) =>
        edge === 'top'
          ? box.y
          : edge === 'bottom'
            ? box.y + box.h
            : edge === 'left'
              ? box.x
              : box.x + box.w
      const sourceValue =
        sourceEdge === 'top' || sourceEdge === 'bottom'
          ? arrow.start.y
          : arrow.start.x
      const targetValue =
        targetEdge === 'top' || targetEdge === 'bottom'
          ? arrow.end.y
          : arrow.end.x

      expect(sourceValue).toBeCloseTo(
        edgeCoordinate(layout.income, sourceEdge),
        1,
      )
      expect(targetValue).toBeCloseTo(
        edgeCoordinate(layout.need, targetEdge),
        1,
      )
    },
  )

  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
  ])('anchors and clears the %s as-needed curve', (_label, data) => {
    const layout = layoutMap(data)
    const asNeeded = layout.arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!
    const labelAt = asNeeded.labelAt!
    const labelBox = {
      x: labelAt.x - 260 / 2 - 10,
      y: labelAt.y - 34 / 2 - 10,
      w: 260 + 20,
      h: 34 + 20,
    }
    const path = pathNumbers(asNeeded.d)
    const start = { x: path[0], y: path[1] }
    const control = { x: path[2], y: path[3] }
    const end = { x: path[4], y: path[5] }
    const shortTerm = layout.accounts.find(
      (placed) => placed.account.id === asNeeded.sourceId,
    )!
    const obstacles = [
      layout.income,
      layout.need,
      ...layout.accounts.filter(
        (placed) => placed.account.id !== shortTerm.account.id,
      ),
    ]
    let previous = start
    const intersections = []
    for (let sample = 1; sample <= 32; sample += 1) {
      const point = pointOnQuadratic(
        start,
        control,
        end,
        sample / 32,
      )
      intersections.push(
        ...obstacles.filter((obstacle) =>
          segmentIntersectsBox(previous, point, obstacle),
        ),
      )
      previous = point
    }

    const chord = {
      x: end.x - start.x,
      y: end.y - start.y,
    }
    const tangent = {
      x: end.x - control.x,
      y: end.y - control.y,
    }
    const tangentAngle = Math.acos(
      (chord.x * tangent.x + chord.y * tangent.y) /
        (Math.hypot(chord.x, chord.y) *
          Math.hypot(tangent.x, tangent.y)),
    )
    expect(start.x).toBeCloseTo(asNeeded.start.x, 1)
    expect(start.y).toBeCloseTo(asNeeded.start.y, 1)
    expect(end.x).toBeCloseTo(asNeeded.end.x, 1)
    expect(end.y).toBeCloseTo(asNeeded.end.y, 1)
    expect(control.x).not.toBe(end.x)
    expect(control.y).not.toBe(end.y)
    expect(tangentAngle).toBeLessThanOrEqual(Math.PI / 4)
    expect(intersections).toEqual([])
    expect(
      obstacles.filter((obstacle) =>
        boxesIntersect(labelBox, obstacle),
      ),
    ).toEqual([])
    expect(
      Math.hypot(labelAt.x - start.x, labelAt.y - start.y),
    ).toBeGreaterThanOrEqual(60)
  })

  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
  ])('keeps the default %s as-needed chip clear', (_label, data) => {
    expectAsNeededChipClear(data)
  })

  it('keeps the default as-needed chip clear of a tall income panel', () => {
    const stress: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      id: 'tall-income-stress',
      client: {
        ...SAMPLE_WHITFIELD.client,
        variant: 'postNote',
        postNoteLabel: 'April 2026',
      },
      incomeSources: [
        { label: 'Social Security', amount: 2400, period: 'mo' },
        { label: 'Pension', amount: 1900, period: 'mo' },
        { label: 'Rental Income', amount: null, period: 'mo' },
        { label: 'Annuity', amount: null, period: 'mo' },
        { label: 'Other Income', amount: null, period: 'mo' },
      ],
      accounts: SAMPLE_WHITFIELD.accounts.filter((account) =>
        ['shortTerm', 'cash', 'afterTax', 'taxDeferred'].includes(
          account.bucket,
        ),
      ),
    }

    expectAsNeededChipClear(stress)
  })

  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
  ])('keeps every overridden %s arrow clear', (_label, data) => {
    const base = layoutMap(data)
    const layoutOverrides = Object.fromEntries(
      base.arrows.map((arrow) => [
        arrow.kind === 'waterfall'
          ? `arrow:waterfall:${arrow.sourceId}`
          : `arrow:${arrow.kind}`,
        {
          bow: arrow.bow * 0.9,
          startT: arrow.startT,
          endT: arrow.endT,
        },
      ]),
    )
    const layout = layoutMap({ ...data, layoutOverrides })

    for (const arrow of layout.arrows) {
      const obstacles =
        arrow.kind === 'income'
          ? layout.accounts
          : arrow.kind === 'asNeeded'
            ? [
                layout.income,
                ...layout.accounts.filter(
                  (placed) =>
                    placed.account.id !== arrow.sourceId,
                ),
              ]
            : layout.accounts.filter(
                (placed) =>
                  placed.account.id !== arrow.sourceId &&
                  placed.account.id !== arrow.targetId,
              )
      let previous = arrow.start
      const intersections = []
      for (let sample = 1; sample <= 32; sample += 1) {
        const point = pointOnQuadratic(
          arrow.start,
          arrow.control,
          arrow.end,
          sample / 32,
        )
        intersections.push(
          ...obstacles.filter((obstacle) =>
            segmentIntersectsBox(previous, point, obstacle),
          ),
        )
        previous = point
      }

      expect(intersections).toEqual([])
    }
  })

  it('lays out a truly blank client with only the income-to-need arrow', () => {
    const layout = layoutMap(blankClient())

    expect(layout.accounts).toEqual([])
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'waterfall'),
    ).toEqual([])
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'asNeeded'),
    ).toEqual([])
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'income'),
    ).toHaveLength(1)
  })

  it.each([
    ['blank client', blankClient(), 950],
    ['Venkat', SAMPLE_VENKAT, 950],
  ])(
    'centers the %s content between the composition bounds',
    (_label, data, lowerBound) => {
      expectCenteredContent(data, lowerBound)
    },
  )

  it('keeps the specified panel sizes and fixed footnote baseline', () => {
    const sample = layoutMap(SAMPLE_WHITFIELD)
    const blank = layoutMap(blankClient())

    for (const layout of [sample, blank]) {
      expect(layout.income.w).toBe(280)
      expect(layout.need.w).toBe(250)
      expect(layout.need.h).toBe(170)
      expect(layout.footnotesAt.y).toBe(930)
    }
    expect(sample.income).toEqual({ x: 48, y: 156, w: 280, h: 248 })
    expect(sample.need).toEqual({ x: 48, y: 686, w: 250, h: 170 })
    expect(blank.income).toEqual({ x: 520, y: 184, w: 280, h: 128 })
    expect(blank.need).toEqual({ x: 520, y: 714, w: 250, h: 170 })
  })

  it('never compresses dense account shapes below their content', () => {
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
    const farColumn = layout.accounts.filter((account) => account.x === 1012)

    expect(layout.accounts).toHaveLength(8)
    expect(farColumn).toHaveLength(5)
    expect(farColumn.every((account) => account.h >= 120)).toBe(true)
    expect(
      farColumn.every(
        (account) =>
          account.contentBottom + account.capRy + 8 <= account.h,
      ),
    ).toBe(true)
    expectColumnGaps(layout.accounts)
  })
})
