import { describe, expect, it } from 'vitest'
import {
  layoutMap,
  MIN_ACCOUNT_HEIGHT,
  MIN_ACCOUNT_WIDTH,
} from '../src/layout/layout'
import {
  blankClient,
  SAMPLE_WHITFIELD,
} from '../src/model/samples'
import type { MoneyMapData } from '../src/model/types'
import {
  clampRectToBounds,
  crossedDragThreshold,
  screenDeltaToArtboard,
  screenPointToArtboard,
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
    expect(movedIra.y).toBe(baseIra.y + 80)
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
    expect(widened.h).toBe(300)
    expect(widened.capRy).toBe(Math.round(410 * 0.13))
    expect(minimum.w).toBe(MIN_ACCOUNT_WIDTH)
    expect(minimum.h).toBe(MIN_ACCOUNT_HEIGHT)
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

  it('re-attaches waterfall arrows to moved and resized drums', () => {
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
        arrow.kind === 'waterfall' && arrow.sourceId === TRUST_ID,
    )!
    const incoming = layout.arrows.find(
      (arrow) =>
        arrow.kind === 'waterfall' && arrow.targetId === TRUST_ID,
    )!

    expect(pathNumbers(outgoing.d).slice(0, 2)).toEqual([
      trust.x + trust.w * 0.35,
      trust.y,
    ])
    expect(pathNumbers(incoming.d).slice(-2)).toEqual([
      trust.x + trust.w * 0.35,
      trust.y - 4,
    ])
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
