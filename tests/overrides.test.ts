import { describe, expect, it } from 'vitest'
import {
  incomePanelMetrics,
  layoutMap,
  MIN_ACCOUNT_HEIGHT,
  MIN_ACCOUNT_WIDTH,
  pointOnOutline,
  rotatedBounds,
} from '../src/layout/layout'
import { newBook, parseBook } from '../src/model/book'
import {
  blankClient,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import {
  clampRectToBounds,
  crossedDragThreshold,
  moveCustomArrowLabel,
  pannedScrollPosition,
  screenDeltaToArtboard,
  screenPointToArtboard,
  snapRotation,
  signedPerpendicularOffset,
  withOverride,
} from '../src/render/mapInteraction'

const IRA_ID = 'managed-ira-jordan'
const TRUST_ID = 'managed-after-tax-trust'

function withOverrides(
  layoutOverrides: NonNullable<MoneyMapData['layoutOverrides']>,
): MoneyMapData {
  return { ...SAMPLE_WHITFIELD, layoutOverrides }
}

function pathNumbers(path: string): number[] {
  return [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
}

describe('map interaction helpers', () => {
  it('converts screen points and deltas with inverse CTM math', () => {
    const inverse = { a: 2, b: 0.5, c: -0.25, d: 3, e: 10, f: -6 }

    expect(screenPointToArtboard({ x: 4, y: 8 }, inverse)).toEqual({
      x: 16,
      y: 20,
    })
    expect(screenDeltaToArtboard({ x: 4, y: 8 }, inverse)).toEqual({
      x: 6,
      y: 26,
    })
  })

  it('uses a four-pixel Euclidean drag threshold', () => {
    expect(
      crossedDragThreshold({ x: 10, y: 10 }, { x: 13, y: 12 }),
    ).toBe(false)
    expect(
      crossedDragThreshold({ x: 10, y: 10 }, { x: 14, y: 10 }),
    ).toBe(true)
  })

  it('maps a background drag to grab-style scroller movement', () => {
    expect(
      pannedScrollPosition(
        { x: 300, y: 240 },
        { x: 250, y: 180 },
        { x: 400, y: 500 },
      ),
    ).toEqual({ x: 450, y: 560 })
  })

  it('merges one override without mutating the client', () => {
    const translated = withOverride(SAMPLE_WHITFIELD, IRA_ID, {
      dx: -40,
    })
    const resized = withOverride(translated, IRA_ID, { w: 330 })

    expect(SAMPLE_WHITFIELD.layoutOverrides).toBeUndefined()
    expect(translated.layoutOverrides?.[IRA_ID]).toEqual({ dx: -40 })
    expect(resized.layoutOverrides?.[IRA_ID]).toEqual({
      dx: -40,
      w: 330,
    })
  })

  it('clamps rectangles to all four bounds', () => {
    expect(
      clampRectToBounds(
        { x: -20, y: 80, w: 100, h: 200 },
        { left: 48, top: 118, right: 1272, bottom: 972 },
      ),
    ).toEqual({ x: 48, y: 118, w: 100, h: 200 })
  })

  it('measures signed perpendicular arrow movement', () => {
    expect(
      signedPerpendicularOffset(
        { x: 10, y: 20 },
        { x: 110, y: 20 },
        { x: 60, y: 45 },
      ),
    ).toBe(25)
  })

  it('soft-snaps rotation within three degrees of 15-degree steps', () => {
    expect(snapRotation(32)).toBe(30)
    expect(snapRotation(33)).toBe(30)
    expect(snapRotation(33.1)).toBeCloseTo(33.1)
    expect(snapRotation(-2)).toBe(0)
    expect(snapRotation(-4)).toBe(356)
  })

  it('stores rotation modulo 360 while preserving other overrides', () => {
    const rotated = withOverride(SAMPLE_WHITFIELD, IRA_ID, {
      dx: 20,
      rot: -30,
    })
    const resized = withOverride(rotated, IRA_ID, { w: 300 })

    expect(rotated.layoutOverrides?.[IRA_ID]).toEqual({
      dx: 20,
      rot: 330,
    })
    expect(resized.layoutOverrides?.[IRA_ID]).toEqual({
      dx: 20,
      rot: 330,
      w: 300,
    })
  })

  it('normalizes and finite-validates rotation and endpoint offsets in books', () => {
    const book = newBook()
    book.clients[0].layoutOverrides = {
      [IRA_ID]: { rot: 725 },
      'arrow:income': {
        startAt: { dx: 12, dy: -8 },
        endAt: { dx: 4, dy: 9 },
      },
    }
    const parsed = parseBook(JSON.stringify(book))

    expect(parsed.clients[0].layoutOverrides?.[IRA_ID].rot).toBe(5)
    expect(
      parsed.clients[0].layoutOverrides?.['arrow:income'].startAt,
    ).toEqual({ dx: 12, dy: -8 })

    const infiniteRotation = JSON.stringify(book).replace(
      '"rot":725',
      '"rot":1e400',
    )
    expect(() => parseBook(infiniteRotation)).toThrow(
      'invalid layout overrides',
    )

    book.clients[0].layoutOverrides['arrow:income'].endAt = {
      dx: 4,
      dy: Number.NaN,
    }
    expect(() => parseBook(JSON.stringify(book))).toThrow(
      'invalid layout overrides',
    )
  })

  it('round-trips finite text overrides and rejects a non-finite font size', () => {
    const book = newBook()
    const key = `text:${IRA_ID}:value`
    const fixedKey = 'text:legend:label'
    book.clients[0].layoutOverrides = {
      [key]: { dx: 14, dy: -9, fs: 27 },
      [fixedKey]: { dx: 100, dy: -40, fs: 18 },
    }

    expect(
      parseBook(JSON.stringify(book)).clients[0].layoutOverrides?.[key],
    ).toEqual({ dx: 14, dy: -9, fs: 27 })
    expect(
      parseBook(JSON.stringify(book)).clients[0].layoutOverrides?.[fixedKey],
    ).toEqual({ dx: 100, dy: -40, fs: 18 })

    const infiniteFontSize = JSON.stringify(book).replace(
      '"fs":27',
      '"fs":1e400',
    )
    expect(() => parseBook(infiniteFontSize)).toThrow(
      'invalid layout overrides',
    )
  })

  it('moves a custom flow label on its arrow record without mutation', () => {
    const data: MoneyMapData = {
      ...SAMPLE_WHITFIELD,
      customArrows: [
        {
          id: 'label-flow',
          sourceId: 'income',
          targetId: 'need',
          style: 'solid' as const,
          label: 'Move me',
        },
      ],
    }
    const moved = moveCustomArrowLabel(data, 'label-flow', 42, -17)

    expect(moved.customArrows?.[0]).toMatchObject({
      labelDx: 42,
      labelDy: -17,
    })
    expect(data.customArrows?.[0].labelDx).toBeUndefined()
    expect(moveCustomArrowLabel(data, 'missing', 1, 2)).toBe(data)
  })
})

describe('layout overrides', () => {
  it('translates after base centering without shifting other elements', () => {
    const base = layoutMap(SAMPLE_WHITFIELD)
    const moved = layoutMap(
      withOverrides({ [IRA_ID]: { dx: -80, dy: 80 } }),
    )
    const baseIra = base.accounts.find(
      (placed) => placed.account.id === IRA_ID,
    )!
    const movedIra = moved.accounts.find(
      (placed) => placed.account.id === IRA_ID,
    )!
    const otherId = base.accounts.find(
      (placed) => placed.account.id !== IRA_ID,
    )!.account.id

    expect(movedIra.x).toBe(baseIra.x - 80)
    expect(movedIra.y).toBeCloseTo(baseIra.y + 80)
    expect(
      moved.accounts.find((placed) => placed.account.id === otherId),
    ).toEqual(
      base.accounts.find((placed) => placed.account.id === otherId),
    )
    expect(moved.income).toEqual(base.income)
    expect(moved.need).toEqual(base.need)
  })

  it('resizes accounts, re-derives cap radius, and clamps minimums', () => {
    const widened = layoutMap(
      withOverrides({ [TRUST_ID]: { w: 410, h: 300 } }),
    ).accounts.find((placed) => placed.account.id === TRUST_ID)!
    const minimum = layoutMap(
      withOverrides({ [TRUST_ID]: { w: 20, h: 40 } }),
    ).accounts.find((placed) => placed.account.id === TRUST_ID)!

    expect(widened.w).toBe(410)
    expect(widened.h).toBeGreaterThan(300)
    expect(widened.capRy).toBe(Math.round(410 * 0.13))
    expect(minimum.w).toBe(MIN_ACCOUNT_WIDTH)
    expect(minimum.h).toBeGreaterThan(MIN_ACCOUNT_HEIGHT)
    expect(
      minimum.contentBottom + minimum.capRy + 8,
    ).toBeLessThanOrEqual(minimum.h)
  })

  it('resizes income while enforcing its content width and height floors', () => {
    const metrics = incomePanelMetrics(SAMPLE_WHITFIELD)
    const widened = layoutMap(
      withOverrides({ income: { w: 420, h: 360 } }),
    ).income
    const minimum = layoutMap(
      withOverrides({ income: { w: 20, h: 40 } }),
    ).income

    expect(widened).toMatchObject({ w: 420, h: 360 })
    expect(minimum.w).toBe(metrics.minWidth)
    expect(minimum.h).toBe(metrics.contentHeight)
  })

  it('clamps translated and resized elements inside the page content area', () => {
    const layout = layoutMap(
      withOverrides({
        income: { dx: -10_000, dy: -10_000 },
        need: { dx: 10_000, dy: 10_000 },
        [TRUST_ID]: {
          dx: 10_000,
          dy: -10_000,
          w: 10_000,
          h: 10_000,
        },
        asNeededChip: { dx: -10_000, dy: -10_000 },
      }),
    )
    const trust = layout.accounts.find(
      (placed) => placed.account.id === TRUST_ID,
    )!
    const chip = layout.arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!.labelAt!

    expect(layout.income.x).toBe(48)
    expect(layout.income.y).toBe(118)
    expect(layout.need.x + layout.need.w).toBe(1272)
    expect(layout.need.y + layout.need.h).toBe(972)
    expect(trust).toMatchObject({
      x: 48,
      y: 118,
      w: 1224,
      h: 854,
    })
    expect(chip.x - 125).toBe(48)
    expect(chip.y - 19).toBe(118)
  })

  it('clamps a rotated account by its rotated bounding box', () => {
    const layout = layoutMap(
      withOverrides({
        [TRUST_ID]: {
          dx: -10_000,
          dy: -10_000,
          w: 10_000,
          h: 10_000,
          rot: 45,
        },
      }),
    )
    const trust = layout.accounts.find(
      (placed) => placed.account.id === TRUST_ID,
    )!
    const bounds = rotatedBounds(trust, trust.rot)

    expect(trust.rot).toBe(45)
    expect(bounds.x).toBeCloseTo(48)
    expect(bounds.y).toBeCloseTo(118)
    expect(bounds.x + bounds.w).toBeCloseTo(902)
    expect(bounds.y + bounds.h).toBeCloseTo(972)
  })

  it('re-attaches migrated flow arrows to moved and resized drums', () => {
    const layout = layoutMap(
      withOverrides({
        [TRUST_ID]: { dx: -90, dy: 55, w: 390, h: 280 },
      }),
    )
    const trust = layout.accounts.find(
      (placed) => placed.account.id === TRUST_ID,
    )!
    const outgoing = layout.arrows.find(
      (arrow) =>
        arrow.kind === 'custom' && arrow.sourceId === TRUST_ID,
    )!
    const incoming = layout.arrows.find(
      (arrow) =>
        arrow.kind === 'custom' && arrow.targetId === TRUST_ID,
    )!

    expect(outgoing.start).toEqual(
      pointOnOutline(trust, outgoing.startT),
    )
    expect(incoming.end).toEqual(
      pointOnOutline(trust, incoming.endT),
    )
    expect(pathNumbers(outgoing.d).slice(0, 2)).toEqual([
      Number(outgoing.start.x.toFixed(1)),
      Number(outgoing.start.y.toFixed(1)),
    ])
    expect(pathNumbers(incoming.d).slice(-2)).toEqual([
      Number(incoming.end.x.toFixed(1)),
      Number(incoming.end.y.toFixed(1)),
    ])
  })

  it('applies and clamps arrow bow and outline parameters', () => {
    const overridden = layoutMap(
      withOverrides({
        'arrow:asNeeded': {
          bow: 10_000,
          startT: -2,
          endT: 4,
        },
        'arrow:income': { bow: -72, startT: 0.35, endT: 0.8 },
      }),
    )
    const asNeeded = overridden.arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!
    const income = overridden.arrows.find(
      (arrow) => arrow.kind === 'income',
    )!
    const chordLength = Math.hypot(
      asNeeded.end.x - asNeeded.start.x,
      asNeeded.end.y - asNeeded.start.y,
    )

    expect(asNeeded.startT).toBe(0)
    expect(asNeeded.endT).toBe(1)
    expect(asNeeded.bow).toBeCloseTo(chordLength / 2)
    expect(income).toMatchObject({
      bow: -72,
      startT: 0.35,
      endT: 0.8,
    })
    expect(income.start).toEqual(
      pointOnOutline(overridden.income, 0.35),
    )
    expect(income.end).toEqual(
      pointOnOutline(overridden.need, 0.8),
    )
  })

  it('gives free endpoints precedence over legacy outline parameters', () => {
    const layout = layoutMap(
      withOverrides({
        'arrow:income': {
          bow: 40,
          startT: 0.1,
          endT: 0.9,
          startAt: { dx: 360, dy: -20 },
          endAt: { dx: 400, dy: 35 },
        },
      }),
    )
    const arrow = layout.arrows.find(
      (candidate) => candidate.kind === 'income',
    )!

    expect(arrow.start).toEqual({
      x: layout.income.x + layout.income.w / 2 + 360,
      y: layout.income.y + layout.income.h / 2 - 20,
    })
    expect(arrow.end).toEqual({
      x: layout.need.x + layout.need.w / 2 + 400,
      y: layout.need.y + layout.need.h / 2 + 35,
    })
    expect(arrow.start).not.toEqual(
      pointOnOutline(layout.income, arrow.startT),
    )
    expect(arrow.end).not.toEqual(
      pointOnOutline(layout.need, arrow.endT),
    )
    expect(arrow.bow).toBe(40)
  })

  it('moves a free endpoint with its connected element center', () => {
    const startAt = { dx: -140, dy: -90 }
    const base = layoutMap(
      withOverrides({
        [`arrow:custom:migrated-flow:${TRUST_ID}`]: { startAt },
      }),
    )
    const moved = layoutMap(
      withOverrides({
        [TRUST_ID]: { dx: -70, dy: 55, w: 340, h: 260 },
        [`arrow:custom:migrated-flow:${TRUST_ID}`]: { startAt },
      }),
    )
    const baseTrust = base.accounts.find(
      (placed) => placed.account.id === TRUST_ID,
    )!
    const movedTrust = moved.accounts.find(
      (placed) => placed.account.id === TRUST_ID,
    )!
    const baseArrow = base.arrows.find(
      (arrow) =>
        arrow.kind === 'custom' && arrow.sourceId === TRUST_ID,
    )!
    const movedArrow = moved.arrows.find(
      (arrow) =>
        arrow.kind === 'custom' && arrow.sourceId === TRUST_ID,
    )!

    expect(movedArrow.start.x - baseArrow.start.x).toBeCloseTo(
      movedTrust.x +
        movedTrust.w / 2 -
        (baseTrust.x + baseTrust.w / 2),
    )
    expect(movedArrow.start.y - baseArrow.start.y).toBeCloseTo(
      movedTrust.y +
        movedTrust.h / 2 -
        (baseTrust.y + baseTrust.h / 2),
    )
    expect(movedArrow.sourceId).toBe(baseArrow.sourceId)
    expect(movedArrow.targetId).toBe(baseArrow.targetId)
  })

  it('keeps legacy t-only arrow overrides attached unchanged', () => {
    const layout = layoutMap(
      withOverrides({
        'arrow:income': { startT: 0.35, endT: 0.8 },
      }),
    )
    const arrow = layout.arrows.find(
      (candidate) => candidate.kind === 'income',
    )!

    expect(arrow.startAt).toBeUndefined()
    expect(arrow.endAt).toBeUndefined()
    expect(arrow.start).toEqual(
      pointOnOutline(layout.income, 0.35),
    )
    expect(arrow.end).toEqual(pointOnOutline(layout.need, 0.8))
  })

  it('applies the chip delta on top of its automatic position', () => {
    const baseChip = layoutMap(SAMPLE_WHITFIELD).arrows.find(
      (arrow) => arrow.kind === 'asNeeded',
    )!.labelAt!
    const movedChip = layoutMap(
      withOverrides({ asNeededChip: { dx: 35, dy: -24 } }),
    ).arrows.find((arrow) => arrow.kind === 'asNeeded')!.labelAt!

    expect(movedChip).toEqual({
      x: baseChip.x + 35,
      y: baseChip.y - 24,
    })
  })

  it('re-derives content bounds and footnote alignment after overrides', () => {
    const blank = blankClient()
    const base = layoutMap(blank)
    const moved = layoutMap(
      { ...blank, layoutOverrides: { income: { dx: 200 } } },
    )

    expect(moved.contentBounds).not.toEqual(base.contentBounds)
    expect(moved.footnotesAt.x).toBe(
      moved.contentBounds.x + moved.contentBounds.w / 2,
    )
    expect(moved.footnotesAt.y).toBe(930)
  })
})
