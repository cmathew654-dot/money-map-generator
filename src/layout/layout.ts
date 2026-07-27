import { wrap } from '../model/format'
import type {
  Account,
  Bucket,
  LayoutOverride,
  MoneyMapData,
} from '../model/types'
import {
  clamp,
  clampRectToBounds,
} from '../render/mapInteraction'

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
  contentBounds: Placed
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
const PAGE_MARGIN = 48
const MASTHEAD_RULE_Y = 118
const FOOTNOTED_CONTENT_BOTTOM = 900
const OPEN_CONTENT_BOTTOM = 950
const FOOTNOTE_BASELINE_Y = 930
const DEFAULT_GAP = 28
const COMPRESSED_GAP = 16
export const MIN_ACCOUNT_HEIGHT = 120
export const MIN_ACCOUNT_WIDTH = 180
export const CAP_CONTENT_GAP = 21
const WATERFALL_MIN_Y = 128
const WATERFALL_CLEARANCE = 30
const WATERFALL_MAX_RISE = 24
const AS_NEEDED_LABEL_WIDTH = 260
const AS_NEEDED_LABEL_HEIGHT = 34
const AS_NEEDED_LABEL_CLEARANCE = 10
const AS_NEEDED_CHIP_WIDTH = 250
const AS_NEEDED_CHIP_HEIGHT = 38
const AS_NEEDED_START_X_FRACTIONS = [0.25, 0.3, 0.35, 0.4, 0.45]
const AS_NEEDED_CONTROL_RISES = [12, 8, 16, 4, 20]
const AS_NEEDED_CURVE_SAMPLES = 32
const AS_NEEDED_LABEL_TS = [
  0.4, 0.35, 0.45, 0.3, 0.5, 0.25, 0.55, 0.2, 0.6, 0.15, 0.65, 0.7,
  0.75, 0.8,
]

const COLUMNS: Column[] = [
  { x: 390, y: 200, w: 250, buckets: ['shortTerm', 'cash', 'note'] },
  { x: 700, y: 240, w: 260, buckets: ['afterTax'] },
  {
    x: 1012,
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

function sampledQuadraticClears(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  obstacles: Placed[],
): boolean {
  let previous = start
  for (let sample = 1; sample <= AS_NEEDED_CURVE_SAMPLES; sample += 1) {
    const point = pointOnQuadratic(
      start,
      control,
      end,
      sample / AS_NEEDED_CURVE_SAMPLES,
    )
    if (
      obstacles.some((obstacle) =>
        segmentIntersectsBox(previous, point, obstacle),
      )
    ) {
      return false
    }
    previous = point
  }
  return true
}

function lowerDrumArcPoint(
  drum: PlacedAccount,
  widthFraction: number,
): { x: number; y: number } {
  const radiusX = drum.w / 2
  const centerX = drum.x + radiusX
  const centerY = drum.y + drum.h - drum.capRy
  const x = drum.x + drum.w * widthFraction
  const normalizedX = (x - centerX) / radiusX
  return {
    x,
    y:
      centerY +
      drum.capRy * Math.sqrt(Math.max(0, 1 - normalizedX ** 2)),
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
  const otherObstacles = obstacles.filter(
    (obstacle) => obstacle !== shortTerm,
  )
  let start = lowerDrumArcPoint(
    shortTerm,
    AS_NEEDED_START_X_FRACTIONS[0],
  )
  let control = { x: end.x, y: start.y + AS_NEEDED_CONTROL_RISES[0] }

  outer: for (const fraction of AS_NEEDED_START_X_FRACTIONS) {
    const candidateStart = lowerDrumArcPoint(shortTerm, fraction)
    for (const rise of AS_NEEDED_CONTROL_RISES) {
      const candidateControl = {
        x: end.x,
        y: candidateStart.y + rise,
      }
      if (
        sampledQuadraticClears(
          candidateStart,
          candidateControl,
          end,
          otherObstacles,
        )
      ) {
        start = candidateStart
        control = candidateControl
        break outer
      }
    }
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

function pathCoordinates(path: string): { x: number; y: number }[] {
  const values = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
  const points: { x: number; y: number }[] = []
  for (let index = 0; index < values.length; index += 2) {
    points.push({ x: values[index], y: values[index + 1] })
  }
  return points
}

function boundsForPoints(
  points: { x: number; y: number }[],
): Placed {
  const xValues = points.map((point) => point.x)
  const yValues = points.map((point) => point.y)
  const x = Math.min(...xValues)
  const y = Math.min(...yValues)
  return {
    x,
    y,
    w: Math.max(...xValues) - x,
    h: Math.max(...yValues) - y,
  }
}

function arrowBounds(arrow: Arrow): Placed[] {
  const bounds = [boundsForPoints(pathCoordinates(arrow.d))]
  if (arrow.labelAt) {
    bounds.push({
      x: arrow.labelAt.x - AS_NEEDED_CHIP_WIDTH / 2,
      y: arrow.labelAt.y - AS_NEEDED_CHIP_HEIGHT / 2,
      w: AS_NEEDED_CHIP_WIDTH,
      h: AS_NEEDED_CHIP_HEIGHT,
    })
  }
  return bounds
}

function contentBounds(
  layout: Pick<MapLayout, 'income' | 'need' | 'accounts' | 'arrows'>,
): Placed {
  const boxes = [
    layout.income,
    layout.need,
    ...layout.accounts,
    ...layout.arrows.flatMap(arrowBounds),
  ]
  const x = Math.min(...boxes.map((box) => box.x))
  const y = Math.min(...boxes.map((box) => box.y))
  const right = Math.max(...boxes.map((box) => box.x + box.w))
  const bottom = Math.max(...boxes.map((box) => box.y + box.h))
  return { x, y, w: right - x, h: bottom - y }
}

function constrainedOffset(
  desired: number,
  minimum: number,
  maximum: number,
): number {
  if (minimum > maximum) return (minimum + maximum) / 2
  return Math.min(maximum, Math.max(minimum, desired))
}

function translatePath(path: string, dx: number, dy: number): string {
  let index = 0
  return path.replace(/-?\d+(?:\.\d+)?/g, (match) => {
    const offset = index % 2 === 0 ? dx : dy
    index += 1
    return coordinate(Number(match) + offset)
  })
}

function translatePlaced<T extends Placed>(
  placed: T,
  dx: number,
  dy: number,
): T {
  return { ...placed, x: placed.x + dx, y: placed.y + dy }
}

function centerComposition(
  layout: Omit<MapLayout, 'contentBounds'>,
  hasFootnotes: boolean,
): MapLayout {
  const bounds = contentBounds(layout)
  const horizontalCenter = ARTBOARD.width / 2
  const lowerBound = hasFootnotes
    ? FOOTNOTED_CONTENT_BOTTOM
    : OPEN_CONTENT_BOTTOM
  const verticalCenter = (MASTHEAD_RULE_Y + lowerBound) / 2
  const dx = constrainedOffset(
    horizontalCenter - (bounds.x + bounds.w / 2),
    PAGE_MARGIN - bounds.x,
    ARTBOARD.width - PAGE_MARGIN - (bounds.x + bounds.w),
  )
  const dy = constrainedOffset(
    verticalCenter - (bounds.y + bounds.h / 2),
    MASTHEAD_RULE_Y - bounds.y,
    lowerBound - (bounds.y + bounds.h),
  )
  const centered = {
    ...layout,
    income: translatePlaced(layout.income, dx, dy),
    need: translatePlaced(layout.need, dx, dy),
    accounts: layout.accounts.map((account) =>
      translatePlaced(account, dx, dy),
    ),
    arrows: layout.arrows.map((arrow) => ({
      ...arrow,
      d: translatePath(arrow.d, dx, dy),
      labelAt: arrow.labelAt
        ? {
            x: arrow.labelAt.x + dx,
            y: arrow.labelAt.y + dy,
          }
        : undefined,
    })),
  }
  const centeredBounds = contentBounds(centered)

  return {
    ...centered,
    contentBounds: centeredBounds,
    footnotesAt: {
      x: centeredBounds.x + centeredBounds.w / 2,
      y: FOOTNOTE_BASELINE_Y,
    },
  }
}

const OVERRIDE_BOUNDS = {
  left: PAGE_MARGIN,
  top: MASTHEAD_RULE_Y,
  right: ARTBOARD.width - PAGE_MARGIN,
  bottom: ARTBOARD.height - PAGE_MARGIN,
}

function applyPlacedOverride<T extends Placed>(
  placed: T,
  override: LayoutOverride | undefined,
): T {
  const clamped = clampRectToBounds(
    {
      ...placed,
      x: placed.x + (override?.dx ?? 0),
      y: placed.y + (override?.dy ?? 0),
    },
    OVERRIDE_BOUNDS,
  )
  return { ...placed, ...clamped }
}

function applyAccountOverride(
  placed: PlacedAccount,
  override: LayoutOverride | undefined,
): PlacedAccount {
  const desiredWidth = clamp(
    override?.w ?? placed.w,
    MIN_ACCOUNT_WIDTH,
    OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left,
  )
  const desiredHeight = clamp(
    override?.h ?? placed.h,
    MIN_ACCOUNT_HEIGHT,
    OVERRIDE_BOUNDS.bottom - OVERRIDE_BOUNDS.top,
  )
  const clamped = clampRectToBounds(
    {
      x: placed.x + (override?.dx ?? 0),
      y: placed.y + (override?.dy ?? 0),
      w: desiredWidth,
      h: desiredHeight,
    },
    OVERRIDE_BOUNDS,
  )
  return {
    ...placed,
    ...clamped,
    capRy: Math.round(clamped.w * 0.13),
  }
}

function applyAsNeededChipOverride(
  arrow: Arrow,
  override: LayoutOverride | undefined,
): Arrow {
  if (!arrow.labelAt) return arrow

  const desired = {
    x: arrow.labelAt.x + (override?.dx ?? 0),
    y: arrow.labelAt.y + (override?.dy ?? 0),
    w: AS_NEEDED_CHIP_WIDTH,
    h: AS_NEEDED_CHIP_HEIGHT,
  }
  const clamped = clampRectToBounds(
    {
      ...desired,
      x: desired.x - desired.w / 2,
      y: desired.y - desired.h / 2,
    },
    OVERRIDE_BOUNDS,
  )
  return {
    ...arrow,
    labelAt: {
      x: clamped.x + clamped.w / 2,
      y: clamped.y + clamped.h / 2,
    },
  }
}

function arrowsForFinalGeometry(
  income: Placed,
  need: Placed,
  accounts: PlacedAccount[],
  chipOverride: LayoutOverride | undefined,
): Arrow[] {
  const arrows = [
    ...waterfallArrows(accounts),
    incomeArrow(income, need),
  ]
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm) {
    arrows.push(
      applyAsNeededChipOverride(
        asNeededArrow(shortTerm, need, [income, need, ...accounts]),
        chipOverride,
      ),
    )
  }
  return arrows
}

function baseLayout(data: MoneyMapData): MapLayout {
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

  return centerComposition(
    {
      artboard: ARTBOARD,
      income,
      need,
      accounts,
      arrows,
      footnotesAt: { x: 390, y: 930 },
    },
    data.footnotes.length > 0,
  )
}

export function layoutMap(data: MoneyMapData): MapLayout {
  const base = baseLayout(data)
  const income = applyPlacedOverride(
    base.income,
    data.layoutOverrides?.income,
  )
  const need = applyPlacedOverride(
    base.need,
    data.layoutOverrides?.need,
  )
  const accounts = base.accounts.map((placed) =>
    applyAccountOverride(
      placed,
      data.layoutOverrides?.[placed.account.id],
    ),
  )
  const arrows = arrowsForFinalGeometry(
    income,
    need,
    accounts,
    data.layoutOverrides?.asNeededChip,
  )
  const finalBounds = contentBounds({
    income,
    need,
    accounts,
    arrows,
  })

  return {
    ...base,
    income,
    need,
    accounts,
    arrows,
    contentBounds: finalBounds,
    footnotesAt: {
      x: finalBounds.x + finalBounds.w / 2,
      y: FOOTNOTE_BASELINE_Y,
    },
  }
}
