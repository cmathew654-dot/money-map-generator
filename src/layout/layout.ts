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
const AS_NEEDED_LABEL_WIDTH = 260
const AS_NEEDED_LABEL_HEIGHT = 38
const AS_NEEDED_LABEL_CLEARANCE = 10

const COLUMNS: Column[] = [
  { x: 390, y: 150, w: 250, buckets: ['cash', 'shortTerm', 'note'] },
  { x: 700, y: 190, w: 260, buckets: ['afterTax'] },
  {
    x: 1020,
    y: 150,
    w: 260,
    buckets: ['taxDeferred', 'taxPreferred', 'charitable'],
  },
]

const WATERFALL_ORDER: Bucket[] = ['taxDeferred', 'afterTax', 'shortTerm']

function accountHeight(account: Account, width: number): number {
  const capRy = Math.round(width * 0.13)
  const titleLines = Math.max(1, wrap(account.label, 24).length)
  const captionLines = account.caption ? wrap(account.caption, 30).length : 0
  const positionsHeight = account.positions?.length
    ? account.positions.length * 20 + 20
    : 0
  const subAccountsHeight = (account.subAccounts?.length ?? 0) * 96
  const isContentLight =
    account.value === null &&
    captionLines === 0 &&
    positionsHeight === 0 &&
    subAccountsHeight === 0
  if (isContentLight && account.bucket !== 'shortTerm') {
    return Math.max(MIN_ACCOUNT_HEIGHT, capRy * 2 + 86)
  }

  const contentHeight =
    capRy * 2 +
    16 +
    titleLines * 20 +
    captionLines * 15 +
    positionsHeight +
    34 +
    subAccountsHeight +
    24

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
      x: target.x + target.w * (approachingFromRight ? 0.35 : 0.65),
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
    const controlY = interveningTop - 80
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
            `${coordinate(clearX)} ${coordinate(interveningTop - 20)}`,
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

function labelOverlapsAccount(
  labelAt: { x: number; y: number },
  account: PlacedAccount,
): boolean {
  const halfWidth = AS_NEEDED_LABEL_WIDTH / 2
  const halfHeight = AS_NEEDED_LABEL_HEIGHT / 2

  return (
    labelAt.x + halfWidth + AS_NEEDED_LABEL_CLEARANCE > account.x &&
    labelAt.x - halfWidth - AS_NEEDED_LABEL_CLEARANCE <
      account.x + account.w &&
    labelAt.y + halfHeight + AS_NEEDED_LABEL_CLEARANCE > account.y &&
    labelAt.y - halfHeight - AS_NEEDED_LABEL_CLEARANCE <
      account.y + account.h
  )
}

function clearAsNeededLabel(
  labelAt: { x: number; y: number },
  accounts: PlacedAccount[],
): { x: number; y: number } {
  const collidingAtCurve = accounts.filter((account) =>
    labelOverlapsAccount(labelAt, account),
  )
  const raised = {
    x: labelAt.x,
    y: Math.min(
      labelAt.y,
      ...collidingAtCurve.map(
        (account) =>
          account.y -
          AS_NEEDED_LABEL_CLEARANCE -
          AS_NEEDED_LABEL_HEIGHT / 2,
      ),
    ),
  }
  const collidingAfterRaise = accounts.filter((account) =>
    labelOverlapsAccount(raised, account),
  )

  return {
    x: Math.min(
      raised.x,
      ...collidingAfterRaise.map(
        (account) =>
          account.x -
          AS_NEEDED_LABEL_CLEARANCE -
          AS_NEEDED_LABEL_WIDTH / 2,
      ),
    ),
    y: raised.y,
  }
}

function asNeededArrow(
  shortTerm: PlacedAccount,
  need: Placed,
  accounts: PlacedAccount[],
): Arrow {
  const start = {
    x: shortTerm.x,
    y: shortTerm.y + shortTerm.h * 0.72,
  }
  const end = {
    x: need.x + need.w + 6,
    y: need.y + need.h * 0.45,
  }
  const control = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2 + 40,
  }
  const t = 0.4
  const oneMinusT = 1 - t
  const labelOnCurve = {
    x:
      oneMinusT * oneMinusT * start.x +
      2 * oneMinusT * t * control.x +
      t * t * end.x,
    y:
      oneMinusT * oneMinusT * start.y +
      2 * oneMinusT * t * control.y +
      t * t * end.y,
  }
  const labelAt = clearAsNeededLabel(labelOnCurve, accounts)

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
    y: 150,
    w: 280,
    h: 44 + data.incomeSources.length * 40 + 14 + 46 + 24,
  }
  const need: Placed = { x: 48, y: 680, w: 250, h: 170 }
  const accounts = COLUMNS.flatMap((column) => placeColumn(data, column))
  const arrows = [
    ...waterfallArrows(accounts),
    incomeArrow(income, need),
  ]
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm) arrows.push(asNeededArrow(shortTerm, need, accounts))

  return {
    artboard: ARTBOARD,
    income,
    need,
    accounts,
    arrows,
    footnotesAt: { x: 390, y: 930 },
  }
}
