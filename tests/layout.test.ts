import { describe, expect, it } from 'vitest'
import {
  hexagonInset,
  incomePanelMetrics,
  incomeTextSizes,
  layoutMap,
  mapTextOffset,
  MIN_ACCOUNT_WIDTH,
  NOTE_MAX_WIDTH,
  NOTE_MIN_WIDTH,
  OVERRIDE_BOUNDS,
  POSITION_ROW_VALUE_GAP,
  pointOnOutline,
  rotatePoint,
  SHAPE_TEXT_PADDING,
  visibleGeneratedArrowKinds,
  type PlacedAccount,
} from '../src/layout/layout'
import { fitLines, textWidth } from '../src/layout/textfit'
import { money, moneyPer } from '../src/model/format'
import { newBook } from '../src/model/book'
import {
  blankClient,
  SAMPLE_CALLOWAY,
  SAMPLE_VENKAT,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { Account, MoneyMapData } from '../src/model/types'
import type { AccountShape } from '../src/model/types'
import { accountShape, isMigratedFlowId } from '../src/model/types'
import { LEADING, roleGap, TYPE } from '../src/render/tokens'

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

const TEXT_DESCENT = 0.22

function textTop(baseline: number, fontSize: number): number {
  return baseline - fontSize
}

function textBottom(baseline: number, fontSize: number): number {
  return baseline + fontSize * TEXT_DESCENT
}

function wrappedAccountData(shape: AccountShape, caption = true): MoneyMapData {
  const data = blankClient()
  data.asNeededAmount = 10_000
  data.accounts = [
    {
      id: 'aligned-account',
      bucket: 'shortTerm',
      shape,
      label: caption
        ? 'Long-Term Household Reserve for Future Income'
        : 'Reserve',
      caption: caption ? 'Held jointly for planned retirement spending' : undefined,
      value: 250_000,
      positions: [
        { label: 'Treasury ladder', value: 120_000 },
        { label: 'Money market reserve', value: 130_000 },
      ],
      subAccounts: [
        {
          label: 'Near-Term Funds',
          caption: 'Two years of spending',
          value: 80_000,
        },
      ],
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
      expect(
        textWidth(line, placed.text.titleFontSize),
      ).toBeLessThanOrEqual(
        placed.usableTitleWidth,
      )
    }
    for (const line of placed.captionLines) {
      expect(
        textWidth(line, placed.text.captionFontSize),
      ).toBeLessThanOrEqual(
        placed.usableCaptionWidth,
      )
    }
    for (const subLayout of placed.subAccountLayouts) {
      for (const line of subLayout.titleLines) {
        expect(
          textWidth(line, subLayout.titleFontSize),
        ).toBeLessThanOrEqual(subLayout.usableTitleWidth)
      }
      for (const line of subLayout.captionLines) {
        expect(
          textWidth(line, subLayout.captionFontSize),
        ).toBeLessThanOrEqual(subLayout.usableCaptionWidth)
      }
      expect(
        subLayout.lastBaseline +
          10 +
          roleGap(subLayout.valueFontSize, subLayout.valueFontSize),
      ).toBeLessThanOrEqual(subLayout.h)
    }

    if (accountShape(placed.account) === 'drum') {
      expect(placed.firstBaseline).toBeGreaterThanOrEqual(
        placed.capRy * 2 +
          roleGap(
            placed.text.titleLeading,
            placed.text.titleLeading,
          ),
      )
      expect(
        placed.contentBottom +
          placed.capRy +
          roleGap(
            placed.subAccountLayouts.at(-1)?.valueFontSize ??
              (placed.text.runwayY === undefined
                ? placed.text.valueFontSize
                : TYPE.runway),
            placed.subAccountLayouts.at(-1)?.valueFontSize ??
              (placed.text.runwayY === undefined
                ? placed.text.valueFontSize
                : TYPE.runway),
          ),
      ).toBeLessThanOrEqual(placed.h + 1e-9)
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
  it('wraps note blocks at 240 units and clamps them to override bounds', () => {
    const data = blankClient()
    data.notes = [
      {
        id: 'wrapped-note',
        text: 'A long margin annotation should wrap predictably at the fixed note width and remain inside the printable composition bounds.',
        x: -200,
        y: 990,
      },
    ]

    const note = layoutMap(data).notes[0]

    expect(note.lines).toEqual(fitLines(data.notes[0].text, 240, TYPE.note))
    expect(note.lines.length).toBeGreaterThan(1)
    expect(
      note.lines.every((line) => textWidth(line, TYPE.note) <= 240),
    ).toBe(true)
    expect(note.x).toBe(48)
    expect(note.y + note.h).toBe(972)
  })

  it('clamps custom note widths and re-wraps to the stored width', () => {
    const text =
      'A custom-width note should use its own measure when wrapping text.'
    const data = blankClient()
    data.notes = [
      { id: 'minimum', text, x: 100, y: 200, w: 40 },
      { id: 'custom', text, x: 100, y: 400, w: 420 },
      { id: 'maximum', text, x: 100, y: 600, w: 900 },
    ]

    const [minimum, custom, maximum] = layoutMap(data).notes

    expect(minimum.w).toBe(NOTE_MIN_WIDTH)
    expect(minimum.lines).toEqual(fitLines(text, NOTE_MIN_WIDTH, TYPE.note))
    expect(custom.w).toBe(420)
    expect(custom.lines).toEqual(fitLines(text, 420, TYPE.note))
    expect(custom.lines.length).toBeLessThan(minimum.lines.length)
    expect(maximum.w).toBe(NOTE_MAX_WIDTH)
    expect(maximum.lines).toEqual(fitLines(text, NOTE_MAX_WIDTH, TYPE.note))
  })

  it('wraps a note at its font size and grows its solid block', () => {
    const text =
      'A larger annotation should wrap sooner and grow its solid background block.'
    const data = blankClient()
    data.notes = [
      { id: 'default-note', text, x: 100, y: 200, w: 240, bg: true },
      {
        id: 'large-note',
        text,
        x: 100,
        y: 500,
        w: 240,
        bg: true,
        fs: 20,
      },
    ]

    const [defaultNote, largeNote] = layoutMap(data).notes

    expect(defaultNote.lines).toEqual(fitLines(text, 240, TYPE.note))
    expect(largeNote.lines).toEqual(fitLines(text, 240, 20))
    expect(largeNote.lines.length).toBeGreaterThan(defaultNote.lines.length)
    expect(largeNote.lineAdvance).toBeCloseTo(
      21 * (20 / TYPE.note),
    )
    expect(largeNote.h).toBeGreaterThan(defaultNote.h)
  })

  it('grows an account so a long tagged value remains on one line', () => {
    const data = blankClient()
    data.accounts = [
      {
        id: 'tag-width',
        bucket: 'cash',
        label: 'Tagged value',
        value: 165_000,
        valueTag: 'estimated balance plus pending annual distribution',
        inWaterfall: false,
      },
    ]

    const placed = layoutMap(data).accounts[0]
    const line = `${money(placed.account.value)} ${placed.account.valueTag}`

    expect(placed.w).toBeGreaterThan(250)
    expect(textWidth(line, TYPE.value)).toBeLessThanOrEqual(
      placed.usableValueWidth,
    )
  })

  it('re-wraps a 24-unit label and strictly grows its account shape', () => {
    const data = textStressData(
      'A deliberately long retirement account label that needs several lines',
    )
    const base = layoutMap(data).accounts[0]
    data.layoutOverrides = {
      [`text:${base.account.id}:label`]: { fs: 24 },
    }

    const enlarged = layoutMap(data).accounts[0]

    expect(enlarged.titleLines.length).toBeGreaterThan(
      base.titleLines.length,
    )
    expect(enlarged.h).toBeGreaterThan(base.h)
    expect(enlarged.text.titleFontSize).toBe(24)
  })

  it.each([
    ['Whitfield', SAMPLE_WHITFIELD],
    ['Calloway', SAMPLE_CALLOWAY],
    ['Venkat', SAMPLE_VENKAT],
    [
      'long-label stress client',
      textStressData(
        'A deliberately oversized account label that must remain contained even when every permitted character needs careful wrapping',
        'An oversized caption must also stay inside the shape.',
        MIN_ACCOUNT_WIDTH,
      ),
    ],
  ])(
    'contains every unmoved oversized account text for %s',
    (_label, source) => {
      const data = structuredClone(source)
      data.layoutOverrides = {
        ...data.layoutOverrides,
        ...Object.fromEntries(
          data.accounts.flatMap((account) =>
            (['label', 'caption', 'value'] as const).map((role) => [
              `text:${account.id}:${role}`,
              { fs: 28 },
            ]),
          ),
        ),
      }

      expectAccountTextIntegrity(data)
    },
  )

  it('keeps moved text bounds-clamped but exempts it from shape containment', () => {
    const data = textStressData(
      'Moved account label',
      'Caption remains automatically placed.',
    )
    const base = layoutMap(data).accounts[0]
    data.layoutOverrides = {
      [`text:${base.account.id}:label`]: {
        dx: 10_000,
        dy: -10_000,
      },
    }

    const moved = layoutMap(data).accounts[0]
    const width = Math.max(
      ...moved.titleLines.map((line) =>
        textWidth(line, moved.text.titleFontSize),
      ),
    )
    const left =
      moved.x + moved.w / 2 + moved.text.titleX - width / 2
    const top = moved.y + moved.text.titleY - moved.text.titleFontSize

    expect(moved.titleLines).toEqual(base.titleLines)
    expect(left).toBeGreaterThanOrEqual(48)
    expect(top).toBeCloseTo(118)
    expect(
      moved.x + moved.w / 2 + moved.text.titleX,
    ).toBeGreaterThan(moved.x + moved.w)
  })

  it('scales tagged value measurement and width at the overridden size', () => {
    const data = blankClient()
    data.accounts = [
      {
        id: 'scaled-tag-width',
        bucket: 'cash',
        label: 'Tagged value',
        value: 165_000,
        valueTag: 'estimated pending distribution',
        inWaterfall: false,
      },
    ]
    const base = layoutMap(data).accounts[0]
    data.layoutOverrides = {
      'text:scaled-tag-width:value': { fs: 28 },
    }

    const enlarged = layoutMap(data).accounts[0]
    const valueLine = `${money(enlarged.account.value)} ${enlarged.account.valueTag}`

    expect(enlarged.w).toBeGreaterThan(base.w)
    expect(enlarged.text.valueFontSize).toBe(28)
    expect(textWidth(valueLine, 28)).toBeLessThanOrEqual(
      enlarged.usableValueWidth,
    )
  })

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

  it('connects migrated flows from tax-deferred to after-tax to short-term', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const flows = layout.arrows.filter(
      (arrow) => arrow.id && isMigratedFlowId(arrow.id),
    )
    const byId = new Map(
      layout.accounts.map((placed) => [placed.account.id, placed]),
    )
    const chainIds = [
      flows[0].sourceId,
      ...flows.map((arrow) => arrow.targetId),
    ]
    const chain = chainIds.map((id) => byId.get(id ?? '')!)

    expect(flows).toHaveLength(2)
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

  it('keeps migrated dotted flows cap-to-cap with an apex above both caps', () => {
    const layout = layoutMap(SAMPLE_WHITFIELD)
    const byId = new Map(
      layout.accounts.map((placed) => [placed.account.id, placed]),
    )
    const migrated = layout.arrows.filter(
      (arrow) => arrow.id && isMigratedFlowId(arrow.id),
    )

    for (const arrow of migrated) {
      expect(arrow.kind).toBe('custom')
      expect(arrow.style).toBe('dotted')
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
      expect(midpoint.y).toBeGreaterThanOrEqual(128)
      expect(midpoint.y).toBeLessThan(Math.max(source.y, target.y))
    }
  })

  it('caps every sample migrated flow near its connected drum tops', () => {
    let migratedCount = 0

    for (const client of newBook().clients) {
      const layout = layoutMap(client)
      const byId = new Map(
        layout.accounts.map((placed) => [placed.account.id, placed]),
      )
      const migrated = layout.arrows.filter(
        (arrow) => arrow.id && isMigratedFlowId(arrow.id),
      )
      migratedCount += migrated.length

      for (const arrow of migrated) {
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

    expect(migratedCount).toBeGreaterThan(0)
  })

  it('grows the content-light cash drum only enough for cap clearance', () => {
    const cash = layoutMap(SAMPLE_WHITFIELD).accounts.find(
      (placed) => placed.account.id === 'cash-at-bank',
    )!

    expect(cash.h).toBeCloseTo(
      cash.contentBottom +
        cash.capRy +
        roleGap(cash.text.valueFontSize, cash.text.valueFontSize),
    )
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
        { id: 'income-stress-social-security', label: 'Social Security', amount: 2400, period: 'mo' },
        { id: 'income-stress-pension', label: 'Pension', amount: 1900, period: 'mo' },
        { id: 'income-stress-rental', label: 'Rental Income', amount: null, period: 'mo' },
        { id: 'income-stress-annuity', label: 'Annuity', amount: null, period: 'mo' },
        { id: 'income-stress-other', label: 'Other Income', amount: null, period: 'mo' },
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
        arrow.kind === 'custom'
          ? `arrow:custom:${arrow.id}`
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

  it('routes custom arrows between rotated element outlines with clearance', () => {
    const data = structuredClone(SAMPLE_WHITFIELD)
    const sourceId = data.accounts[0].id
    const targetId = data.accounts.at(-1)!.id
    data.customArrows = [
      { id: 'custom-clear', sourceId, targetId, style: 'solid' },
    ]
    data.layoutOverrides = {
      [targetId]: { rot: 30 },
    }

    const layout = layoutMap(data)
    const arrow = layout.arrows.find(
      (candidate) => candidate.id === 'custom-clear',
    )!
    const source = layout.accounts.find(
      (placed) => placed.account.id === sourceId,
    )!
    const target = layout.accounts.find(
      (placed) => placed.account.id === targetId,
    )!
    const obstacles = [
      layout.income,
      layout.need,
      ...layout.accounts.filter(
        (placed) =>
          placed.account.id !== sourceId &&
          placed.account.id !== targetId,
      ),
    ]
    const intersections = []
    let previous = arrow.start
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

    expect(arrow.kind).toBe('custom')
    expect(arrow.start).toEqual(pointOnOutline(source, arrow.startT))
    expect(arrow.end).toEqual(pointOnOutline(target, arrow.endT))
    expect(intersections).toEqual([])
  })

  it('composes custom arrow geometry overrides under its record key', () => {
    const data = structuredClone(SAMPLE_WHITFIELD)
    const sourceId = data.accounts[0].id
    const targetId = data.accounts[1].id
    data.customArrows = [
      {
        id: 'custom-overridden',
        sourceId,
        targetId,
        style: 'dashed',
        color: 'blue',
      },
    ]
    data.layoutOverrides = {
      'arrow:custom:custom-overridden': {
        bow: 45,
        startT: 0.25,
        endT: 0.75,
        startAt: { dx: 160, dy: -40 },
        endAt: { dx: -120, dy: 55 },
      },
    }

    const arrow = layoutMap(data).arrows.find(
      (candidate) => candidate.id === 'custom-overridden',
    )!

    expect(arrow).toMatchObject({
      kind: 'custom',
      bow: 45,
      startT: 0.25,
      endT: 0.75,
      startAt: { dx: 160, dy: -40 },
      endAt: { dx: -120, dy: 55 },
      color: 'blue',
    })
  })

  it('drops dangling custom arrows and preserves generated legend inputs', () => {
    const baselineKinds = layoutMap(SAMPLE_WHITFIELD).arrows
      .filter((arrow) => arrow.kind !== 'custom')
      .map((arrow) => arrow.kind)
    const data = structuredClone(SAMPLE_WHITFIELD)
    data.customArrows = [
      {
        id: 'dangling',
        sourceId: 'missing',
        targetId: 'need',
        style: 'dotted',
      },
      {
        id: 'valid',
        sourceId: 'income',
        targetId: data.accounts[0].id,
        style: 'solid',
      },
    ]

    const layout = layoutMap(data)

    expect(
      layout.arrows
        .filter((arrow) => arrow.kind !== 'custom')
        .map((arrow) => arrow.kind),
    ).toEqual(baselineKinds)
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'custom'),
    ).toHaveLength(1)
    expect(layout.arrows.some((arrow) => arrow.id === 'dangling')).toBe(false)
  })

  it('lays out a truly blank client with only the income-to-need arrow', () => {
    const layout = layoutMap(blankClient())

    expect(layout.accounts).toEqual([])
    expect(layout.arrows.filter((arrow) => arrow.kind === 'custom')).toEqual(
      [],
    )
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'asNeeded'),
    ).toEqual([])
    expect(
      layout.arrows.filter((arrow) => arrow.kind === 'income'),
    ).toHaveLength(1)
  })

  it('does not generate flow arrows from legacy flags without migration', () => {
    const data = structuredClone(SAMPLE_WHITFIELD)
    data.customArrows = []
    data.accounts.forEach((account) => {
      account.inWaterfall = true
    })

    const layout = layoutMap(data)

    expect(layout.arrows.filter((arrow) => arrow.kind === 'custom')).toEqual(
      [],
    )
  })

  it('omits hidden generated arrows and exposes truthful legend inputs', () => {
    const incomeHidden = layoutMap({
      ...SAMPLE_WHITFIELD,
      hiddenArrows: ['income'],
    })
    const allHidden = layoutMap({
      ...SAMPLE_WHITFIELD,
      hiddenArrows: ['income', 'asNeeded'],
    })

    expect(
      incomeHidden.arrows.some((arrow) => arrow.kind === 'income'),
    ).toBe(false)
    expect(visibleGeneratedArrowKinds(incomeHidden.arrows)).toEqual([
      'asNeeded',
    ])
    expect(
      allHidden.arrows.some((arrow) => arrow.kind === 'asNeeded'),
    ).toBe(false)
    expect(visibleGeneratedArrowKinds(allHidden.arrows)).toEqual([])
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
    expect(sample.income).toEqual({ x: 48, y: 118, w: 280, h: 264 })
    expect(sample.need).toEqual({ x: 48, y: 648, w: 250, h: 170 })
    expect(blank.income).toEqual({ x: 520, y: 184, w: 280, h: 132 })
    expect(blank.need).toEqual({ x: 520, y: 714, w: 250, h: 170 })
  })

  it('scales income row pitch and the first-row reach with row type', () => {
    const base = incomePanelMetrics(SAMPLE_WHITFIELD)
    const larger = incomePanelMetrics({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: { 'text:income:row': { fs: 30 } },
    })

    expect(base.rowPitch).toBe(44)
    expect(larger.rowPitch).toBe(88)
    expect(larger.firstRowY).toBe(base.firstRowY * 2)
    expect(larger.contentHeight).toBeGreaterThan(base.contentHeight)
  })

  it('measures every scaled income role in the width floor', () => {
    const scaled = {
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        income: { w: 20 },
        'text:income:header': { fs: 28 },
        'text:income:row': { fs: 30 },
        'text:income:total': { fs: 30 },
      },
    }
    const sixDigit = { ...scaled, afterTaxIncome: 999_999 }

    expect(incomeTextSizes(SAMPLE_WHITFIELD)).toEqual({
      header: 17.5,
      rowLabel: 15 * (13 / 14),
      rowQualifier: 15 * (12 / 14),
      rowValue: 15,
      totalLabel: 13,
      totalValue: 17,
    })
    expect(incomeTextSizes(scaled)).toEqual({
      header: 28,
      rowLabel: 30 * (13 / 14),
      rowQualifier: 30 * (12 / 14),
      rowValue: 30,
      totalLabel: 30 * (13 / 17),
      totalValue: 30,
    })
    expect(incomePanelMetrics(scaled).minWidth).toBeGreaterThan(
      incomePanelMetrics(SAMPLE_WHITFIELD).minWidth,
    )

    for (const data of [SAMPLE_WHITFIELD, scaled, sixDigit]) {
      const sizes = incomeTextSizes(data)
      const metrics = incomePanelMetrics(data)
      const totalWidth =
        textWidth('After-Tax Income', sizes.totalLabel) +
        16 +
        textWidth(money(data.afterTaxIncome), sizes.totalValue)

      expect(totalWidth).toBeLessThanOrEqual(metrics.minWidth - 40)
      if (data !== SAMPLE_WHITFIELD) {
        expect(layoutMap(data).income.w).toBe(metrics.minWidth)
      }
    }

    const sizes = incomeTextSizes(scaled)
    const innerWidth = incomePanelMetrics(scaled).minWidth - 40
    const headerWidth =
      textWidth('INCOME SOURCES', sizes.header) +
      ('INCOME SOURCES'.length - 1) * 1.7
    const row = scaled.incomeSources[2]
    const labelWidth = textWidth(
      row.label,
      sizes.rowLabel,
    )
    const valueWidth =
      textWidth(moneyPer(row.amount, row.period), sizes.rowValue) +
      7 +
      textWidth(row.qualifier!, sizes.rowQualifier)

    expect(headerWidth).toBeLessThanOrEqual(innerWidth)
    expect(labelWidth).toBeLessThanOrEqual(innerWidth)
    expect(valueWidth).toBeLessThanOrEqual(innerWidth)
  })

  it('fits long income rows and floors resized height at content height', () => {
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      incomeSources: [
        {
          id: 'income-long-row',
          label:
            'A deliberately long retirement income source label for meetings',
          amount: 125_000,
          period: 'yr',
          qualifier: 'After-Tax',
        },
      ],
      layoutOverrides: {
        income: { w: 20, h: 20 },
        'text:income:row': { fs: 24 },
      },
    }
    const metrics = incomePanelMetrics(data)
    const income = layoutMap(data).income

    expect(metrics.minWidth).toBeGreaterThan(280)
    expect(income.w).toBe(metrics.minWidth)
    expect(income.h).toBe(metrics.contentHeight)
  })

  it('grows account content for larger position rows and sub-account text', () => {
    const accountId = 'managed-ira-jordan'
    const data = {
      ...SAMPLE_WHITFIELD,
      accounts: SAMPLE_WHITFIELD.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              positions: [
                { label: 'US equity allocation', value: 1_200_000 },
              ],
            }
          : account,
      ),
    }
    const base = layoutMap(data).accounts.find(
      (account) => account.account.id === accountId,
    )!
    const enlarged = layoutMap({
      ...data,
      layoutOverrides: {
        [`text:${accountId}:rows`]: { fs: 40 },
        [`text:${accountId}:sub`]: { fs: 40 },
      },
    }).accounts.find((account) => account.account.id === accountId)!

    expect(enlarged.text.rowFontSize).toBe(40)
    expect(enlarged.text.rowLeading).toBeCloseTo(
      1.45 * 40,
    )
    expect(enlarged.subAccountLayouts[0].valueFontSize).toBe(40)
    expect(enlarged.subAccountLayouts[0].titleFontSize).toBeCloseTo(
      (TYPE.subAccountTitle / TYPE.subValue) * 40,
    )
    expect(enlarged.h).toBeGreaterThan(base.h)
  })

  it.each(['drum', 'card', 'rect', 'pill'] as const)(
    'centers and spaces wrapped %s account content on rendered edges',
    (shape) => {
      const placed = layoutMap(wrappedAccountData(shape)).accounts[0]
      const { text } = placed
      const titleLast =
        text.titleY +
        (placed.titleLines.length - 1) * text.titleLeading
      const captionLast =
        text.captionY! +
        (placed.captionLines.length - 1) * text.captionLeading
      const firstRow = placed.positionRows[0]
      const lastRow = placed.positionRows.at(-1)!
      const inset = placed.subAccountLayouts[0]
      const insetTitleLast =
        inset.titleY +
        (inset.titleLines.length - 1) * inset.titleLeading
      const insetCaptionLast =
        inset.captionY! +
        (inset.captionLines.length - 1) * inset.captionLeading

      expect(placed.titleLines.length).toBeGreaterThan(1)
      expect(text.titleX).toBe(0)
      expect(text.captionX).toBe(0)
      expect(text.valueX).toBe(0)
      for (const row of placed.positionRows) {
        expect((row.leftX + row.rightX) / 2).toBeCloseTo(placed.w / 2)
      }
      expect(placed.w * 0.14 + placed.w * 0.72 / 2).toBeCloseTo(
        placed.w / 2,
      )

      const titleStart = textTop(text.titleY, text.titleFontSize)
      const titleAnchor =
        shape === 'drum'
          ? placed.capRy * 2
          : textBottom(text.tagY, TYPE.accountTag)
      expect(titleStart - titleAnchor).toBeCloseTo(12)
      expect(
        textTop(text.captionY!, text.captionFontSize) -
          textBottom(titleLast, text.titleFontSize),
      ).toBeCloseTo(12)
      expect(
        textTop(firstRow.firstBaseline, text.rowFontSize) -
          textBottom(captionLast, text.captionFontSize),
      ).toBeCloseTo(12)
      expect(
        textTop(text.valueY, text.valueFontSize) -
          textBottom(lastRow.lastBaseline, text.rowFontSize),
      ).toBeCloseTo(16)
      expect(
        textTop(text.runwayY!, TYPE.runway) -
          textBottom(text.valueY, text.valueFontSize),
      ).toBeCloseTo(8)

      expect(
        textTop(inset.titleY, inset.titleFontSize) - 20,
      ).toBeCloseTo(12)
      expect(
        textTop(inset.captionY!, inset.captionFontSize) -
          textBottom(insetTitleLast, inset.titleFontSize),
      ).toBeCloseTo(12)
      expect(
        textTop(inset.valueY, inset.valueFontSize) -
          textBottom(insetCaptionLast, inset.captionFontSize),
      ).toBeCloseTo(16)
    },
  )

  it.each(['drum', 'card', 'rect', 'pill'] as const)(
    'keeps short no-caption %s accounts on the same 12/16 rhythm',
    (shape) => {
      const placed = layoutMap(wrappedAccountData(shape, false)).accounts[0]
      const { text } = placed
      const titleLast =
        text.titleY +
        (placed.titleLines.length - 1) * text.titleLeading
      const firstRow = placed.positionRows[0]
      const lastRow = placed.positionRows.at(-1)!

      expect(placed.titleLines).toHaveLength(1)
      expect(text.captionY).toBeUndefined()
      expect(
        textTop(firstRow.firstBaseline, text.rowFontSize) -
          textBottom(titleLast, text.titleFontSize),
      ).toBeCloseTo(12)
      expect(
        textTop(text.valueY, text.valueFontSize) -
          textBottom(lastRow.lastBaseline, text.rowFontSize),
      ).toBeCloseTo(16)
    },
  )

  it('wraps measured position labels at 18 while preserving the value and padding', () => {
    const accountId = 'managed-after-tax-trust'
    const placed = layoutMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        [`text:${accountId}:rows`]: { fs: 18 },
      },
    }).accounts.find((account) => account.account.id === accountId)!

    expect(placed.h).toBeGreaterThan(
      layoutMap(SAMPLE_WHITFIELD).accounts.find(
        (account) => account.account.id === accountId,
      )!.h,
    )
    for (const [index, row] of placed.positionRows.entries()) {
      expect(row.labelLines.length).toBeGreaterThan(1)
      expect(row.valueText).toBe(
        money(placed.account.positions![index].value),
      )
      expect(row.valueWidth).toBe(
        textWidth(row.valueText, placed.text.rowFontSize),
      )
      expect(
        row.labelLines.every(
          (line) =>
            textWidth(line, placed.text.rowFontSize) <=
            row.labelMaxWidth,
        ),
      ).toBe(true)
      expect(
        row.labelMaxWidth +
          POSITION_ROW_VALUE_GAP +
          row.valueWidth,
      ).toBeLessThanOrEqual(row.innerWidth)
      expect(row.leftX).toBeGreaterThanOrEqual(SHAPE_TEXT_PADDING)
      expect(placed.w - row.rightX).toBeGreaterThanOrEqual(
        SHAPE_TEXT_PADDING,
      )
    }
  })

  it('respects position-row side padding throughout the permitted type scale', () => {
    const accountId = 'managed-after-tax-trust'

    for (let fontSize = 9; fontSize <= 40; fontSize += 1) {
      const placed = layoutMap({
        ...SAMPLE_WHITFIELD,
        layoutOverrides: {
          [`text:${accountId}:rows`]: { fs: fontSize },
        },
      }).accounts.find((account) => account.account.id === accountId)!

      for (const row of placed.positionRows) {
        expect(row.leftX).toBeGreaterThanOrEqual(SHAPE_TEXT_PADDING)
        expect(placed.w - row.rightX).toBeGreaterThanOrEqual(
          SHAPE_TEXT_PADDING,
        )
        expect(row.valueWidth).toBeLessThanOrEqual(row.innerWidth)
      }
    }
  })

  it.each([
    ['default', undefined],
    ['enlarged', 40],
  ])(
    'keeps fixed rendered-edge gaps inside the %s sub-account inset',
    (_label, fontSize) => {
      const accountId = 'managed-ira-jordan'
      const placed = layoutMap({
        ...SAMPLE_WHITFIELD,
        layoutOverrides:
          fontSize === undefined
            ? undefined
            : { [`text:${accountId}:sub`]: { fs: fontSize } },
      }).accounts.find((account) => account.account.id === accountId)!
      const inset = placed.subAccountLayouts[0]
      const titleLast =
        inset.titleY +
        (inset.titleLines.length - 1) * inset.titleLeading
      const captionLast =
        inset.captionY! +
        (inset.captionLines.length - 1) * inset.captionLeading

      expect(inset.titleLeading).toBeCloseTo(
        inset.titleFontSize * 1.45,
      )
      expect(inset.captionLeading).toBeCloseTo(
        inset.captionFontSize * 1.45,
      )
      expect(
        textTop(inset.titleY, inset.titleFontSize) - 20,
      ).toBeCloseTo(12)
      expect(
        textTop(inset.captionY!, inset.captionFontSize) -
          textBottom(titleLast, inset.titleFontSize),
      ).toBeCloseTo(12)
      expect(inset.h - 10 - inset.lastBaseline).toBeCloseTo(
        roleGap(inset.valueFontSize, inset.valueFontSize),
      )
      expect(
        textTop(inset.valueY, inset.valueFontSize) -
          textBottom(captionLast, inset.captionFontSize),
      ).toBeCloseTo(16)
    },
  )

  it('pins the default proportional leading and gap token table', () => {
    expect(LEADING).toEqual({
      accountTitle: TYPE.accountTitle * 1.3,
      caption: TYPE.caption * 1.45,
      row: TYPE.row * 1.45,
      subAccountTitle: TYPE.subAccountTitle * 1.45,
      subAccountCaption: TYPE.subAccountCaption * 1.45,
    })
    for (const lineHeight of [
      LEADING.accountTitle,
      LEADING.caption,
      LEADING.row,
      LEADING.subAccountTitle,
      LEADING.subAccountCaption,
      48,
    ]) {
      expect(roleGap(lineHeight, lineHeight / 2)).toBe(
        Math.max(8, lineHeight / 1.5),
      )
    }
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

  it.each([
    ['income', 'header'],
    ['income', 'row'],
    ['income', 'total'],
    ['need', 'label'],
    ['need', 'value'],
    ['footnotes', 'line'],
    ['masthead', 'label'],
  ] as const)(
    'shifts the %s %s text block by its exact fixed-text override',
    (element, role) => {
      const key = `text:${element}:${role}`
      const data = {
        ...SAMPLE_WHITFIELD,
        layoutOverrides: { [key]: { dx: 37, dy: -23 } },
      }

      expect(
        mapTextOffset(data, element, role, {
          x: 500,
          y: 500,
          w: 200,
          h: 60,
        }),
      ).toEqual({ dx: 37, dy: -23 })
    },
  )

  it('moves position rows and sub-account text in account-local space', () => {
    const rowsId = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.positions?.length,
    )!.id
    const subId = SAMPLE_WHITFIELD.accounts.find(
      (account) => account.subAccounts?.length,
    )!.id
    const base = layoutMap(SAMPLE_WHITFIELD)
    const moved = layoutMap({
      ...SAMPLE_WHITFIELD,
      layoutOverrides: {
        [`text:${rowsId}:rows`]: { dx: 31, dy: -14 },
        [`text:${subId}:sub`]: { dx: -22, dy: 17 },
      },
    })
    const baseRows = base.accounts.find(
      (account) => account.account.id === rowsId,
    )!.positionRows
    const movedRows = moved.accounts.find(
      (account) => account.account.id === rowsId,
    )!.positionRows
    const movedSub = moved.accounts.find(
      (account) => account.account.id === subId,
    )!.subAccountLayouts

    expect(movedRows[0].leftX - baseRows[0].leftX).toBe(31)
    expect(movedRows[0].rightX - baseRows[0].rightX).toBe(31)
    expect(movedRows[0].firstBaseline - baseRows[0].firstBaseline).toBe(
      -14,
    )
    expect(movedSub[0].textDx).toBe(-22)
    expect(movedSub[0].textDy).toBe(17)
  })

  it('clamps explicit fixed text movement only to override bounds', () => {
    const block = { x: 500, y: 500, w: 200, h: 60 }
    const offset = mapTextOffset(
      {
        ...SAMPLE_WHITFIELD,
        layoutOverrides: {
          'text:masthead:label': { dx: 10_000, dy: -10_000 },
        },
      },
      'masthead',
      'label',
      block,
    )

    expect(block.x + offset.dx + block.w).toBe(OVERRIDE_BOUNDS.right)
    expect(block.y + offset.dy).toBe(OVERRIDE_BOUNDS.top)
  })

  it('keeps a custom flow label offset relative to its moving arrow midpoint', () => {
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'relative-label',
          sourceId: 'income',
          targetId: 'need',
          style: 'solid',
          label: 'Relative',
          labelDx: 41,
          labelDy: -26,
        },
      ],
    }
    const base = layoutMap(data).arrows.find(
      (arrow) => arrow.id === 'relative-label',
    )!
    const moved = layoutMap({
      ...data,
      layoutOverrides: { income: { dx: 180, dy: 70 } },
    }).arrows.find((arrow) => arrow.id === 'relative-label')!
    const midpoint = (arrow: typeof base) => ({
      x: (arrow.start.x + 2 * arrow.control.x + arrow.end.x) / 4,
      y: (arrow.start.y + 2 * arrow.control.y + arrow.end.y) / 4,
    })

    for (const arrow of [base, moved]) {
      const center = midpoint(arrow)
      expect(arrow.labelAt!.x - center.x).toBeCloseTo(41)
      expect(arrow.labelAt!.y - center.y).toBeCloseTo(-26)
    }
    expect(moved.labelAt).not.toEqual(base.labelAt)
  })
})
