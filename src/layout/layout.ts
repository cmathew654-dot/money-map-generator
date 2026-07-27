import { wrap } from '../model/format'
import type { Account, Bucket, MoneyMapData } from '../model/types'

export interface Placed {
  x: number
  y: number
  w: number
  h: number
}

export interface PlacedAccount extends Placed {
  account: Account
  capRy: number
}

export interface Arrow {
  kind: 'waterfall' | 'income' | 'asNeeded'
  d: string
  labelAt?: { x: number; y: number }
  sourceId?: string
  targetId?: string
}

export interface MapLayout {
  artboard: { width: number; height: number }
  income: Placed
  need: Placed
  accounts: PlacedAccount[]
  arrows: Arrow[]
  footnotesAt: { x: number; y: number }
}

interface Column {
  x: number
  y: number
  w: number
  buckets: Bucket[]
}

const STACK_BOTTOM = 890
const ARTBOARD = { width: 1320, height: 1020 }
const DEFAULT_GAP = 28
const COMPRESSED_GAP = 16
const MIN_ACCOUNT_HEIGHT = 120
export const CAP_CONTENT_GAP = 21
const WATERFALL_MIN_Y = 128
const WATERFALL_CLEARANCE = 30
const WATERFALL_MAX_RISE = 24
const AS_NEEDED_LABEL_WIDTH = 260
const AS_NEEDED_LABEL_HEIGHT = 34
const AS_NEEDED_LABEL_CLEARANCE = 10
const AS_NEEDED_START_FRACTIONS = [0.72, 0.77, 0.82, 0.87, 0.92, 0.95]
const AS_NEEDED_LABEL_TS = [
  0.4, 0.35, 0.45, 0.3, 0.5, 0.25, 0.55, 0.2, 0.6, 0.15, 0.65, 0.7,
  0.75, 0.8,
]

const COLUMNS: Column[] = [
  { x: 390, y: 200, w: 250, buckets: ['shortTerm', 'cash', 'note'] },
  { x: 700, y: 240, w: 260, buckets: ['afterTax'] },
  {
    x: 1020,
    y: 200,
    w: 260,
    buckets: ['taxDeferred', 'taxPreferred', 'charitable'],
  },
]

const WATERFALL_ORDER: Bucket[] = ['taxDeferred', 'afterTax', 'shortTerm']

function accountHeight(account: Account, width: number): number {
  const capRy = Math.round(width * 0.13)
  const titleLines = Math.max(1, wrap(account.label, 24).length)
  const captionLines = account.caption ? wrap(account.caption, 30).length : 0
  const positionCount = account.positions?.length ?? 0
  const subAccountsHeight = (account.subAccounts?.length ?? 0) * 96
  const isContentLight =
    account.value === null &&
    captionLines === 0 &&
    positionCount === 0 &&
    subAccountsHeight === 0
  if (isContentLight && account.bucket !== 'shortTerm') {
    return Math.max(
      MIN_ACCOUNT_HEIGHT,
      capRy * 3 + CAP_CONTENT_GAP + 48,
    )
  }

  const titleBaseline = capRy * 2 + CAP_CONTENT_GAP
  let valueBaseline: number
  if (positionCount > 0) {
    valueBaseline =
      titleBaseline +
      titleLines * 20 +
      captionLines * 15 +
      positionCount * 20 +
      34
  } else if (captionLines > 0) {
    valueBaseline =
      titleBaseline +
      titleLines * 20 +
      (captionLines - 1) * 15 +
      25
  } else {
    valueBaseline =
      titleBaseline + (titleLines - 1) * 20 + 30
  }
  const contentHeight =
    valueBaseline + capRy + 18 + subAccountsHeight

  if (account.bucket === 'shortTerm') return Math.max(250, contentHeight)
  if (account.bucket === 'cash') return Math.max(120, contentHeight)
  return Math.max(MIN_ACCOUNT_HEIGHT, contentHeight)
}

function orderForColumn(accounts: Account[], buckets: Bucket[]): Account[] {
  return buckets.flatMap((bucket) =>
    accounts.filter((account) => account.bucket === bucket),
  )
}

function compressedHeights(
  heights: number[],
  available: number,
): { heights: number[]; gap: number } {
  const gap = COMPRESSED_GAP
  const heightBudget = available - gap * Math.max(0, heights.length - 1)
  const minimumTotal = MIN_ACCOUNT_HEIGHT * heights.length
  const flexibleTotal = heights.reduce(
    (sum, height) => sum + Math.max(0, height - MIN_ACCOUNT_HEIGHT),
    0,
  )

  if (heightBudget >= minimumTotal && flexibleTotal > 0) {
    const scale = Math.min(
      1,
      (heightBudget - minimumTotal) / flexibleTotal,
    )
    return {
      gap,
      heights: heights.map(
        (height) =>
          MIN_ACCOUNT_HEIGHT +
          Math.max(0, height - MIN_ACCOUNT_HEIGHT) * scale,
      ),
    }
  }

  return { gap, heights: heights.map(() => MIN_ACCOUNT_HEIGHT) }
}

function placeColumn(data: MoneyMapData, column: Column): PlacedAccount[] {
  const accounts = orderForColumn(data.accounts, column.buckets)
  if (accounts.length === 0) return []

  let heights = accounts.map((account) => accountHeight(account, column.w))
  let gap = DEFAULT_GAP
  const available = STACK_BOTTOM - column.y
  const total =
    heights.reduce((sum, height) => sum + height, 0) +
    gap * Math.max(0, accounts.length - 1)

  if (total > available) {
    const compressed = compressedHeights(heights, available)
    heights = compressed.heights
    gap = compressed.gap
  }

  let y = column.y
  return accounts.map((account, index) => {
    const placed = {
      account,
      x: column.x,
      y,
      w: column.w,
      h: heights[index],
      capRy: Math.round(column.w * 0.13),
    }
    y += heights[index] + gap
    return placed
  })
}

function coordinate(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function waterfallArrows(accounts: PlacedAccount[]): Arrow[] {
  const chain = WATERFALL_ORDER.flatMap((bucket) =>
    accounts
      .filter(
        (placed) =>
          placed.account.bucket === bucket && placed.account.inWaterfall,
      )
      .sort((a, b) => a.y - b.y),
  )

  return chain.slice(0, -1).map((source, index) => {
    const target = chain[index + 1]
    const start = { x: source.x + source.w * 0.35, y: source.y }
    const approachingFromRight = source.x > target.x
    const end = {
      x: target.x + target.w * 0.35,
      y: target.y - 4,
    }
    const leftColumnX = Math.min(source.x, target.x)
    const rightColumnX = Math.max(source.x, target.x)
    const interveningTop = Math.min(
      ...accounts
        .filter(
          (placed) =>
            placed.x >= leftColumnX && placed.x <= rightColumnX,
        )
        .map((placed) => placed.y),
    )
    const connectedTop = Math.min(source.y, target.y)
    const waterfallApexFloor = connectedTop - WATERFALL_MAX_RISE
    const controlY = Math.max(
      WATERFALL_MIN_Y,
      connectedTop - WATERFALL_CLEARANCE,
      waterfallApexFloor,
    )
    const targetColumnBlockers = accounts.filter(
      (placed) =>
        placed.x === target.x &&
        placed.account.id !== target.account.id &&
        placed.y < target.y,
    )
    const clearX = approachingFromRight
      ? target.x - 18
      : target.x + target.w + 18
    const d =
      targetColumnBlockers.length > 0
        ? [
            `M ${coordinate(start.x)} ${coordinate(start.y)}`,
            `C ${coordinate(start.x)} ${coordinate(controlY)}`,
            `${coordinate(clearX)} ${coordinate(controlY)}`,
            `${coordinate(clearX)} ${coordinate(
              Math.max(
                WATERFALL_MIN_Y,
                interveningTop - 20,
                waterfallApexFloor,
              ),
            )}`,
            `L ${coordinate(clearX)} ${coordinate(
              Math.max(
                ...targetColumnBlockers.map(
                  (placed) => placed.y + placed.h,
                ),
              ) + 8,
            )}`,
            `Q ${coordinate(clearX)} ${coordinate(end.y)}`,
            `${coordinate(end.x)} ${coordinate(end.y)}`,
          ].join(' ')
        : [
            `M ${coordinate(start.x)} ${coordinate(start.y)}`,
            `C ${coordinate(start.x)} ${coordinate(controlY)}`,
            `${coordinate(end.x)} ${coordinate(controlY)}`,
            `${coordinate(end.x)} ${coordinate(end.y)}`,
          ].join(' ')

    return {
      kind: 'waterfall',
      sourceId: source.account.id,
      targetId: target.account.id,
      d,
    }
  })
}

function incomeArrow(income: Placed, need: Placed): Arrow {
  return {
    kind: 'income',
    d: `M ${coordinate(income.x + income.w / 2)} ${coordinate(
      income.y + income.h,
    )} L ${coordinate(need.x + need.w / 2)} ${coordinate(need.y)}`,
  }
}

function boxesIntersect(
  first: Placed,
  second: Placed,
): boolean {
  return (
    first.x < second.x + second.w &&
    first.x + first.w > second.x &&
    first.y < second.y + second.h &&
    first.y + first.h > second.y
  )
}

function segmentIntersectsBox(
  start: { x: number; y: number },
  end: { x: number; y: number },
  box: Placed,
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

function labelBox(labelAt: { x: number; y: number }): Placed {
  return {
    x:
      labelAt.x -
      AS_NEEDED_LABEL_WIDTH / 2 -
      AS_NEEDED_LABEL_CLEARANCE,
    y:
      labelAt.y -
      AS_NEEDED_LABEL_HEIGHT / 2 -
      AS_NEEDED_LABEL_CLEARANCE,
    w: AS_NEEDED_LABEL_WIDTH + AS_NEEDED_LABEL_CLEARANCE * 2,
    h: AS_NEEDED_LABEL_HEIGHT + AS_NEEDED_LABEL_CLEARANCE * 2,
  }
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

function clearAsNeededLabel(
  labelAt: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number },
  obstacles: Placed[],
): { x: number; y: number } {
  const clears = (candidate: { x: number; y: number }) =>
    obstacles.every(
      (obstacle) => !boxesIntersect(labelBox(candidate), obstacle),
    )
  if (clears(labelAt)) return labelAt

  const length = Math.hypot(end.x - start.x, end.y - start.y)
  const upwardNormal = {
    x: -(end.y - start.y) / length,
    y: (end.x - start.x) / length,
  }
  let offset = 8
  while (true) {
    const candidate = {
      x: labelAt.x + upwardNormal.x * offset,
      y: labelAt.y + upwardNormal.y * offset,
    }
    if (clears(candidate)) return candidate
    offset += 8
  }
}

function asNeededArrow(
  shortTerm: PlacedAccount,
  need: Placed,
  obstacles: Placed[],
): Arrow {
  const end = {
    x: need.x + need.w + 6,
    y: need.y + need.h * 0.45,
  }
  let start = {
    x: shortTerm.x,
    y: shortTerm.y + shortTerm.h * AS_NEEDED_START_FRACTIONS.at(-1)!,
  }
  for (const fraction of AS_NEEDED_START_FRACTIONS) {
    const candidate = {
      x: shortTerm.x,
      y: shortTerm.y + shortTerm.h * fraction,
    }
    if (
      obstacles.every(
        (obstacle) => !segmentIntersectsBox(candidate, end, obstacle),
      )
    ) {
      start = candidate
      break
    }
  }
  const control = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 + 40,
  }
  let labelAt = pointOnQuadratic(start, control, end, 0.4)
  for (const t of AS_NEEDED_LABEL_TS) {
    const candidate = pointOnQuadratic(start, control, end, t)
    if (
      obstacles.every(
        (obstacle) => !boxesIntersect(labelBox(candidate), obstacle),
      )
    ) {
      labelAt = candidate
      break
    }
  }
  labelAt = clearAsNeededLabel(labelAt, start, end, obstacles)

  return {
    kind: 'asNeeded',
    sourceId: shortTerm.account.id,
    d: [
      `M ${coordinate(start.x)} ${coordinate(start.y)}`,
      `Q ${coordinate(control.x)} ${coordinate(control.y)}`,
      `${coordinate(end.x)} ${coordinate(end.y)}`,
    ].join(' '),
    labelAt,
  }
}

export function layoutMap(data: MoneyMapData): MapLayout {
  const income: Placed = {
    x: 48,
    y: 170,
    w: 280,
    h: 44 + data.incomeSources.length * 40 + 14 + 46 + 24,
  }
  const need: Placed = { x: 48, y: 700, w: 250, h: 170 }
  const accounts = COLUMNS.flatMap((column) => placeColumn(data, column))
  const arrows = [
    ...waterfallArrows(accounts),
    incomeArrow(income, need),
  ]
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm) {
    arrows.push(
      asNeededArrow(shortTerm, need, [income, need, ...accounts]),
    )
  }

  return {
    artboard: ARTBOARD,
    income,
    need,
    accounts,
    arrows,
    footnotesAt: { x: 390, y: 930 },
  }
}
