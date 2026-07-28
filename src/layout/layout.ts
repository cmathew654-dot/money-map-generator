import { accountDisplayName } from '../model/format'
import { runwayLine } from '../model/math'
import type {
  Account,
  AccountShape,
  Bucket,
  LayoutOverride,
  MoneyMapData,
  SubAccount,
} from '../model/types'
import { accountShape } from '../model/types'
import {
  clamp,
  clampRectToBounds,
  normalizeRotation,
} from '../render/mapInteraction'
import { LEADING, TYPE } from '../render/tokens'
import { fitLines } from './textfit'

export interface Placed {
  x: number
  y: number
  w: number
  h: number
}

export interface PlacedAccount extends Placed {
  account: Account
  captionLines: string[]
  capRy: number
  contentBottom: number
  firstBaseline: number
  lastBaseline: number
  rot: number
  subAccountLayouts: SubAccountLayout[]
  text: AccountTextLayout
  titleLines: string[]
  usableCaptionWidth: number
  usableTitleWidth: number
}

export interface SubAccountLayout {
  captionLines: string[]
  captionY?: number
  h: number
  lastBaseline: number
  subAccount: SubAccount
  titleLines: string[]
  titleY: number
  usableCaptionWidth: number
  usableTitleWidth: number
  valueY: number
}

export interface AccountTextLayout {
  captionY?: number
  rowBaselines: number[]
  runwayY?: number
  subStartY: number
  tagY: number
  titleY: number
  valueY: number
}

export interface Arrow {
  kind: 'waterfall' | 'income' | 'asNeeded'
  d: string
  start: { x: number; y: number }
  control: { x: number; y: number }
  end: { x: number; y: number }
  bow: number
  startT: number
  endT: number
  startAt?: { dx: number; dy: number }
  endAt?: { dx: number; dy: number }
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
export const SHAPE_TEXT_PADDING = 20
const WATERFALL_MIN_Y = 128
const AS_NEEDED_LABEL_WIDTH = 260
const AS_NEEDED_LABEL_HEIGHT = 34
const AS_NEEDED_LABEL_CLEARANCE = 10
const AS_NEEDED_CHIP_WIDTH = 250
const AS_NEEDED_CHIP_HEIGHT = 38
const CURVE_SAMPLES = 32
const OUTLINE_SAMPLES = 512
const DEFAULT_BOW_FRACTION = 0.15
const MAX_BOW_FRACTION = 0.5
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

const ROLE_GAP = 6
const SUB_ACCOUNT_GAP = 8
const SUB_ACCOUNT_CAP_RY = 10
const SUB_ACCOUNT_CAP_CONTENT_GAP = 14
const BOTTOM_CONTENT_GAP = 8

function nextRoleBaseline(baseline: number, size: number): number {
  return baseline + size + ROLE_GAP
}

function pillInset(width: number, height: number, y: number): number {
  const radius = Math.min(width, height) / 2
  if (radius === 0 || (y >= radius && y <= height - radius)) return 0
  const distance = y < radius ? radius - y : y - (height - radius)
  return radius - Math.sqrt(Math.max(0, radius ** 2 - distance ** 2))
}

export function usableTextWidth(
  shape: AccountShape,
  width: number,
  height: number,
  baseline: number,
  size: number,
): number {
  const textTop = Math.max(0, baseline - size)
  const textBottom = Math.min(height, baseline + size * 0.22)
  let shapeInset = 0

  if (shape === 'rect') {
    const inset = hexagonInset(width, height)
    const insetAt = (y: number) =>
      y < height / 2
        ? inset * (1 - (2 * y) / height)
        : inset * (1 - (2 * (height - y)) / height)
    shapeInset = Math.max(insetAt(textTop), insetAt(textBottom), 0)
  } else if (shape === 'pill') {
    shapeInset = Math.max(
      pillInset(width, height, textTop),
      pillInset(width, height, textBottom),
    )
  }

  return Math.max(
    1,
    width - 2 * (SHAPE_TEXT_PADDING + shapeInset),
  )
}

function subAccountLayout(
  subAccount: SubAccount,
  width: number,
): SubAccountLayout {
  const usableWidth = Math.max(1, width - SHAPE_TEXT_PADDING * 2)
  const titleLines = fitLines(
    subAccount.label,
    usableWidth,
    TYPE.subAccountTitle,
  )
  const safeTitleLines = titleLines.length > 0 ? titleLines : ['']
  const captionLines = subAccount.caption
    ? fitLines(
        subAccount.caption,
        usableWidth,
        TYPE.subAccountCaption,
      )
    : []
  const titleY =
    SUB_ACCOUNT_CAP_RY * 2 + SUB_ACCOUNT_CAP_CONTENT_GAP
  const titleLast =
    titleY +
    (safeTitleLines.length - 1) * LEADING.subAccountTitle
  const captionY =
    captionLines.length > 0
      ? nextRoleBaseline(titleLast, TYPE.subAccountCaption)
      : undefined
  const captionLast =
    captionY === undefined
      ? titleLast
      : captionY +
        (captionLines.length - 1) * LEADING.subAccountCaption
  const valueY = nextRoleBaseline(captionLast, TYPE.subValue)
  const lastBaseline = valueY
  const h = Math.max(
    88,
    lastBaseline + SUB_ACCOUNT_CAP_RY + BOTTOM_CONTENT_GAP,
  )

  return {
    captionLines,
    captionY,
    h,
    lastBaseline,
    subAccount,
    titleLines: safeTitleLines,
    titleY,
    usableCaptionWidth: usableWidth,
    usableTitleWidth: usableWidth,
    valueY,
  }
}

interface AccountSizing {
  captionLines: string[]
  capRy: number
  contentBottom: number
  firstBaseline: number
  h: number
  lastBaseline: number
  subAccountLayouts: SubAccountLayout[]
  text: AccountTextLayout
  titleLines: string[]
  usableCaptionWidth: number
  usableTitleWidth: number
}

function accountSizing(
  account: Account,
  width: number,
  hasRunway: boolean,
  requestedHeight = 0,
): AccountSizing {
  const shape = accountShape(account)
  const capRy = Math.round(width * 0.13)
  let height = Math.max(
    requestedHeight,
    account.bucket === 'shortTerm' ? 250 : MIN_ACCOUNT_HEIGHT,
  )
  let sizing: AccountSizing | undefined

  for (let pass = 0; pass < 8; pass += 1) {
    const tagY = shape === 'drum' ? capRy : 25
    const titleY =
      shape === 'drum'
        ? capRy * 2 + CAP_CONTENT_GAP
        : nextRoleBaseline(tagY, TYPE.accountTitle)
    const usableTitleWidth = usableTextWidth(
      shape,
      width,
      height,
      titleY,
      TYPE.accountTitle,
    )
    const titleLines = fitLines(
      accountDisplayName(account),
      usableTitleWidth,
      TYPE.accountTitle,
    )
    const safeTitleLines =
      titleLines.length > 0 ? titleLines : ['']
    const titleLast =
      titleY +
      (safeTitleLines.length - 1) * LEADING.accountTitle
    const provisionalCaptionY = nextRoleBaseline(
      titleLast,
      TYPE.caption,
    )
    const usableCaptionWidth = usableTextWidth(
      shape,
      width,
      height,
      provisionalCaptionY,
      TYPE.caption,
    )
    const captionLines = account.caption
      ? fitLines(
          account.caption,
          usableCaptionWidth,
          TYPE.caption,
        )
      : []
    const captionY =
      captionLines.length > 0 ? provisionalCaptionY : undefined
    let previousBaseline =
      captionY === undefined
        ? titleLast
        : captionY +
          (captionLines.length - 1) * LEADING.caption
    const rowBaselines = (account.positions ?? []).map(
      (_position, index) => {
        const baseline =
          index === 0
            ? nextRoleBaseline(previousBaseline, TYPE.row)
            : previousBaseline + LEADING.row
        previousBaseline = baseline
        return baseline
      },
    )
    const valueY = nextRoleBaseline(previousBaseline, TYPE.value)
    const runwayY = hasRunway
      ? nextRoleBaseline(valueY, TYPE.runway)
      : undefined
    previousBaseline = runwayY ?? valueY

    const subWidth = width * 0.72
    const subAccountLayouts = (account.subAccounts ?? []).map(
      (subAccount) => subAccountLayout(subAccount, subWidth),
    )
    const subStartY =
      subAccountLayouts.length > 0
        ? previousBaseline + 12
        : previousBaseline
    let contentBottom = previousBaseline
    let lastBaseline = previousBaseline
    if (subAccountLayouts.length > 0) {
      let subY = subStartY
      for (const subLayout of subAccountLayouts) {
        lastBaseline = subY + subLayout.lastBaseline
        subY += subLayout.h + SUB_ACCOUNT_GAP
      }
      contentBottom = subY - SUB_ACCOUNT_GAP
    }

    const bottomClearance =
      shape === 'drum'
        ? capRy + BOTTOM_CONTENT_GAP
        : shape === 'pill'
          ? 24
          : 20
    const minimumHeight =
      account.bucket === 'shortTerm' ? 250 : MIN_ACCOUNT_HEIGHT
    const requiredHeight = Math.max(
      requestedHeight,
      minimumHeight,
      contentBottom + bottomClearance,
    )

    sizing = {
      captionLines,
      capRy,
      contentBottom,
      firstBaseline: titleY,
      h: requiredHeight,
      lastBaseline,
      subAccountLayouts,
      text: {
        captionY,
        rowBaselines,
        runwayY,
        subStartY,
        tagY,
        titleY,
        valueY,
      },
      titleLines: safeTitleLines,
      usableCaptionWidth,
      usableTitleWidth,
    }

    if (Math.abs(requiredHeight - height) < 0.01) break
    height = requiredHeight
  }

  return sizing!
}

function orderForColumn(accounts: Account[], buckets: Bucket[]): Account[] {
  return buckets.flatMap((bucket) =>
    accounts.filter((account) => account.bucket === bucket),
  )
}

function compressedGap(
  heights: number[],
  available: number,
): number {
  if (heights.length < 2) return 0
  const remaining = available - heights.reduce((sum, height) => sum + height, 0)
  return Math.max(8, Math.min(COMPRESSED_GAP, remaining / (heights.length - 1)))
}

function placeColumn(data: MoneyMapData, column: Column): PlacedAccount[] {
  const accounts = orderForColumn(data.accounts, column.buckets)
  if (accounts.length === 0) return []

  const sizings = accounts.map((account) =>
    accountSizing(
      account,
      column.w,
      runwayLine(
        account.value,
        data.asNeededAmount,
        data.showMath !== false,
      ) !== null && account.bucket === 'shortTerm',
    ),
  )
  const heights = sizings.map((sizing) => sizing.h)
  let gap = DEFAULT_GAP
  const available = STACK_BOTTOM - column.y
  const total =
    heights.reduce((sum, height) => sum + height, 0) +
    gap * Math.max(0, accounts.length - 1)

  if (total > available) {
    gap = compressedGap(heights, available)
  }

  let y = column.y
  return accounts.map((account, index) => {
    const sizing = sizings[index]
    const placed = {
      account,
      ...sizing,
      x: column.x,
      y,
      w: column.w,
      rot: 0,
    }
    y += heights[index] + gap
    return placed
  })
}

function coordinate(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

type Point = { x: number; y: number }
export type OutlineElement = Placed | PlacedAccount

export function hexagonInset(width: number, height: number): number {
  return Math.min(height * 0.22, 34, width / 2)
}

function isDrum(element: OutlineElement): boolean {
  return (
    'account' in element &&
    accountShape(element.account) === 'drum'
  )
}

function pointOnRoundedRect(
  element: Placed,
  t: number,
  radius: number,
): Point {
  const r = Math.min(radius, element.w / 2, element.h / 2)
  const quarter = Math.min(3, Math.floor(t * 4))
  const progress = t * 4 - quarter
  const horizontal = element.w - r * 2
  const vertical = element.h - r * 2
  const arc = (Math.PI * r) / 2
  const edge = quarter % 2 === 0 ? horizontal : vertical
  const distance = progress * (edge + arc)

  if (distance <= edge) {
    if (quarter === 0) {
      return { x: element.x + r + distance, y: element.y }
    }
    if (quarter === 1) {
      return {
        x: element.x + element.w,
        y: element.y + r + distance,
      }
    }
    if (quarter === 2) {
      return {
        x: element.x + element.w - r - distance,
        y: element.y + element.h,
      }
    }
    return {
      x: element.x,
      y: element.y + element.h - r - distance,
    }
  }

  const angleProgress = arc === 0 ? 1 : (distance - edge) / arc
  const angle = -Math.PI / 2 + (quarter + angleProgress) * (Math.PI / 2)
  const cornerCenters = [
    { x: element.x + element.w - r, y: element.y + r },
    {
      x: element.x + element.w - r,
      y: element.y + element.h - r,
    },
    { x: element.x + r, y: element.y + element.h - r },
    { x: element.x + r, y: element.y + r },
  ]
  const center = cornerCenters[quarter]
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle),
  }
}

function pointOnHexagon(element: Placed, t: number): Point {
  const inset = hexagonInset(element.w, element.h)
  const points = [
    { x: element.x + inset, y: element.y },
    { x: element.x + element.w - inset, y: element.y },
    { x: element.x + element.w, y: element.y + element.h / 2 },
    { x: element.x + element.w - inset, y: element.y + element.h },
    { x: element.x + inset, y: element.y + element.h },
    { x: element.x, y: element.y + element.h / 2 },
  ]
  const segment = Math.min(5, Math.floor(t * 6))
  const progress = t * 6 - segment
  const start = points[segment]
  const end = points[(segment + 1) % points.length]
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  }
}

function centerOf(element: Placed): Point {
  return {
    x: element.x + element.w / 2,
    y: element.y + element.h / 2,
  }
}

export function rotatePoint(
  point: Point,
  center: Point,
  degrees: number,
): Point {
  const radians = (degrees * Math.PI) / 180
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)
  const dx = point.x - center.x
  const dy = point.y - center.y
  return {
    x: center.x + dx * cosine - dy * sine,
    y: center.y + dx * sine + dy * cosine,
  }
}

export function rotatedBounds(element: Placed, degrees: number): Placed {
  const radians = (degrees * Math.PI) / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  const w = element.w * cosine + element.h * sine
  const h = element.w * sine + element.h * cosine
  const center = centerOf(element)
  return {
    x: center.x - w / 2,
    y: center.y - h / 2,
    w,
    h,
  }
}

function obstacleBounds(element: Placed): Placed {
  return 'rot' in element
    ? rotatedBounds(element, (element as PlacedAccount).rot)
    : element
}

/**
 * Clockwise outline parameter. Flat shapes start along their top-left edge;
 * drums start at the left shoulder and follow the top arc, right side,
 * bottom arc, then left side.
 */
function pointOnUnrotatedOutline(
  element: OutlineElement,
  rawT: number,
): Point {
  const t = clamp(rawT, 0, 1)
  if ('account' in element && !isDrum(element)) {
    const shape = accountShape(element.account)
    if (shape === 'rect') return pointOnHexagon(element, t)
    const radius =
      shape === 'card'
        ? 12
        : shape === 'pill'
          ? Math.min(element.w, element.h) / 2
          : 0
    return pointOnRoundedRect(element, t, radius)
  }
  if (!('account' in element)) {
    if (t <= 0.25) {
      return { x: element.x + element.w * t * 4, y: element.y }
    }
    if (t <= 0.5) {
      return {
        x: element.x + element.w,
        y: element.y + element.h * (t - 0.25) * 4,
      }
    }
    if (t <= 0.75) {
      return {
        x: element.x + element.w * (1 - (t - 0.5) * 4),
        y: element.y + element.h,
      }
    }
    return {
      x: element.x,
      y: element.y + element.h * (1 - (t - 0.75) * 4),
    }
  }

  const centerX = element.x + element.w / 2
  const radiusX = element.w / 2
  if (t <= 0.25) {
    const angle = Math.PI + t * 4 * Math.PI
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: element.y + element.capRy + element.capRy * Math.sin(angle),
    }
  }
  if (t <= 0.5) {
    return {
      x: element.x + element.w,
      y:
        element.y +
        element.capRy +
        (element.h - element.capRy * 2) * (t - 0.25) * 4,
    }
  }
  if (t <= 0.75) {
    const angle = (t - 0.5) * 4 * Math.PI
    return {
      x: centerX + radiusX * Math.cos(angle),
      y:
        element.y +
        element.h -
        element.capRy +
        element.capRy * Math.sin(angle),
    }
  }
  return {
    x: element.x,
    y:
      element.y +
      element.h -
      element.capRy -
      (element.h - element.capRy * 2) * (t - 0.75) * 4,
  }
}

export function pointOnOutline(
  element: OutlineElement,
  rawT: number,
): Point {
  const point = pointOnUnrotatedOutline(element, rawT)
  return 'rot' in element && element.rot !== 0
    ? rotatePoint(point, centerOf(element), element.rot)
    : point
}

function facingOutlineT(
  element: OutlineElement,
  counterpart: OutlineElement,
): number {
  const center = centerOf(element)
  const toward = centerOf(counterpart)
  const direction = {
    x: toward.x - center.x,
    y: toward.y - center.y,
  }
  const length = Math.hypot(direction.x, direction.y)
  if (length === 0) return 0

  let bestT = 0
  let bestScore = Number.POSITIVE_INFINITY
  for (let sample = 0; sample < OUTLINE_SAMPLES; sample += 1) {
    const t = sample / OUTLINE_SAMPLES
    const point = pointOnOutline(element, t)
    const relative = { x: point.x - center.x, y: point.y - center.y }
    const forward =
      (relative.x * direction.x + relative.y * direction.y) / length
    if (forward <= 0) continue
    const perpendicular = Math.abs(
      relative.x * direction.y - relative.y * direction.x,
    ) / length
    const score = perpendicular / forward
    if (score < bestScore) {
      bestScore = score
      bestT = t
    }
  }
  return bestT
}

export function nearestOutlineT(
  element: OutlineElement,
  point: Point,
): number {
  let bestT = 0
  let bestDistance = Number.POSITIVE_INFINITY
  for (let sample = 0; sample <= OUTLINE_SAMPLES; sample += 1) {
    const t = sample / OUTLINE_SAMPLES
    const candidate = pointOnOutline(element, t)
    const distance = Math.hypot(
      point.x - candidate.x,
      point.y - candidate.y,
    )
    if (distance < bestDistance) {
      bestDistance = distance
      bestT = t
    }
  }
  return bestT
}

function topCapT(xFraction = 0.35): number {
  const angle = Math.acos(xFraction * 2 - 1)
  return (Math.PI * 2 - angle - Math.PI) / (Math.PI * 4)
}

function pointOnQuadratic(
  start: Point,
  control: Point,
  end: Point,
  t: number,
): Point {
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

function controlForBow(start: Point, end: Point, bow: number): Point {
  const chordX = end.x - start.x
  const chordY = end.y - start.y
  const length = Math.hypot(chordX, chordY) || 1
  return {
    x: (start.x + end.x) / 2 - (chordY / length) * bow,
    y: (start.y + end.y) / 2 + (chordX / length) * bow,
  }
}

function segmentIntersectsBox(
  start: Point,
  end: Point,
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

function routePenalty(
  start: Point,
  control: Point,
  end: Point,
  obstacles: Placed[],
  minimumY = MASTHEAD_RULE_Y,
): number {
  let penalty = 0
  let previous = start
  for (let sample = 1; sample <= CURVE_SAMPLES; sample += 1) {
    const point = pointOnQuadratic(
      start,
      control,
      end,
      sample / CURVE_SAMPLES,
    )
    penalty += obstacles.filter((obstacle) =>
      segmentIntersectsBox(previous, point, obstacleBounds(obstacle)),
    ).length * 10_000
    penalty += Math.max(0, minimumY - point.y) * 100
    previous = point
  }
  return penalty
}

function routedArrow({
  kind,
  source,
  target,
  obstacles,
  override,
  preferredStartT,
  preferredEndT,
  preferAbove = false,
  sourceId,
  targetId,
}: {
  kind: Arrow['kind']
  source: OutlineElement
  target: OutlineElement
  obstacles: Placed[]
  override?: LayoutOverride
  preferredStartT?: number
  preferredEndT?: number
  preferAbove?: boolean
  sourceId?: string
  targetId?: string
}): Arrow {
  const defaultStartT =
    preferredStartT ?? facingOutlineT(source, target)
  const defaultEndT = preferredEndT ?? facingOutlineT(target, source)
  const startT = clamp(override?.startT ?? defaultStartT, 0, 1)
  const endT = clamp(override?.endT ?? defaultEndT, 0, 1)
  const freePoint = (
    element: OutlineElement,
    offset: { dx: number; dy: number },
  ): Point => {
    const center = centerOf(element)
    return {
      x: clamp(
        center.x + offset.dx,
        PAGE_MARGIN,
        ARTBOARD.width - PAGE_MARGIN,
      ),
      y: clamp(
        center.y + offset.dy,
        PAGE_MARGIN,
        ARTBOARD.height - PAGE_MARGIN,
      ),
    }
  }
  const start = override?.startAt
    ? freePoint(source, override.startAt)
    : pointOnOutline(source, startT)
  const end = override?.endAt
    ? freePoint(target, override.endAt)
    : pointOnOutline(target, endT)
  const chordLength = Math.hypot(end.x - start.x, end.y - start.y)
  const maximumBow = chordLength * MAX_BOW_FRACTION
  const baseMagnitude = chordLength * DEFAULT_BOW_FRACTION
  const normalY = chordLength === 0 ? 0 : (end.x - start.x) / chordLength
  const preferredSign = preferAbove
    ? normalY <= 0
      ? 1
      : -1
    : -1
  const requestedBow =
    override?.bow === undefined
      ? undefined
      : clamp(override.bow, -maximumBow, maximumBow)
  const candidates =
    requestedBow === undefined
      ? [1, -1, 1.35, -1.35, 1.7, -1.7, 2.1, -2.1, 0].map(
          (scale) =>
            clamp(
              preferredSign * baseMagnitude * scale,
              -maximumBow,
              maximumBow,
            ),
        )
      : [requestedBow]
  let bow = candidates[0] ?? 0
  let control = controlForBow(start, end, bow)
  let bestPenalty = Number.POSITIVE_INFINITY
  for (const candidateBow of candidates) {
    const candidateControl = controlForBow(start, end, candidateBow)
    const penalty = routePenalty(
      start,
      candidateControl,
      end,
      obstacles,
      kind === 'waterfall' ? WATERFALL_MIN_Y : MASTHEAD_RULE_Y,
    )
    if (
      penalty < bestPenalty ||
      (candidateBow === 0 &&
        penalty === bestPenalty &&
        bestPenalty > 0)
    ) {
      bow = candidateBow
      control = candidateControl
      bestPenalty = penalty
    }
    if (penalty === 0) break
  }

  return {
    kind,
    sourceId,
    targetId,
    start,
    control,
    end,
    bow,
    startT,
    endT,
    startAt: override?.startAt,
    endAt: override?.endAt,
    d: [
      `M ${coordinate(start.x)} ${coordinate(start.y)}`,
      `Q ${coordinate(control.x)} ${coordinate(control.y)}`,
      `${coordinate(end.x)} ${coordinate(end.y)}`,
    ].join(' '),
  }
}

function waterfallArrows(
  accounts: PlacedAccount[],
  overrides?: Record<string, LayoutOverride>,
  preserveGeneratedCaps = true,
): Arrow[] {
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
    const capT = preserveGeneratedCaps ? topCapT() : undefined
    return routedArrow({
      kind: 'waterfall',
      source,
      target,
      obstacles: accounts.filter(
        (placed) => placed !== source && placed !== target,
      ),
      override: overrides?.[`arrow:waterfall:${source.account.id}`],
      preferredStartT: isDrum(source) ? capT : undefined,
      preferredEndT: isDrum(target) ? capT : undefined,
      preferAbove: preserveGeneratedCaps,
      sourceId: source.account.id,
      targetId: target.account.id,
    })
  })
}

function incomeArrow(
  income: Placed,
  need: Placed,
  obstacles: Placed[],
  override?: LayoutOverride,
): Arrow {
  return routedArrow({
    kind: 'income',
    source: income,
    target: need,
    obstacles,
    override,
  })
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

function chipStaysInBounds(labelAt: Point): boolean {
  const halfWidth = AS_NEEDED_CHIP_WIDTH / 2
  const halfHeight = AS_NEEDED_CHIP_HEIGHT / 2
  return (
    labelAt.x - halfWidth >= PAGE_MARGIN &&
    labelAt.x + halfWidth <= ARTBOARD.width - PAGE_MARGIN &&
    labelAt.y - halfHeight >= MASTHEAD_RULE_Y &&
    labelAt.y + halfHeight <= ARTBOARD.height - PAGE_MARGIN
  )
}

function clearAsNeededLabel(
  labelAt: { x: number; y: number },
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  obstacles: Placed[],
): { x: number; y: number } {
  const clears = (candidate: { x: number; y: number }) =>
    chipStaysInBounds(candidate) &&
    obstacles.every(
      (obstacle) => !boxesIntersect(labelBox(candidate), obstacle),
    )
  for (const t of AS_NEEDED_LABEL_TS) {
    const candidate = pointOnQuadratic(start, control, end, t)
    if (clears(candidate)) return candidate
  }

  for (let offset = 8; offset <= ARTBOARD.height; offset += 8) {
    for (const t of AS_NEEDED_LABEL_TS) {
      const pathPoint = pointOnQuadratic(start, control, end, t)
      const tangent = {
        x: 2 * ((1 - t) * (control.x - start.x) + t * (end.x - control.x)),
        y: 2 * ((1 - t) * (control.y - start.y) + t * (end.y - control.y)),
      }
      const length = Math.hypot(tangent.x, tangent.y) || 1
      const normal = { x: -tangent.y / length, y: tangent.x / length }
      for (const direction of [-1, 1]) {
        const candidate = {
          x: pathPoint.x + normal.x * offset * direction,
          y: pathPoint.y + normal.y * offset * direction,
        }
        if (clears(candidate)) return candidate
      }
    }
  }
  return labelAt
}

function asNeededArrow(
  shortTerm: PlacedAccount,
  need: Placed,
  obstacles: Placed[],
  override?: LayoutOverride,
): Arrow {
  const arrow = routedArrow({
    kind: 'asNeeded',
    source: shortTerm,
    target: need,
    obstacles: obstacles.filter(
      (obstacle) => obstacle !== shortTerm,
    ),
    override,
    sourceId: shortTerm.account.id,
  })
  const { start, control, end } = arrow
  const labelAt = clearAsNeededLabel(
    pointOnQuadratic(start, control, end, 0.4),
    start,
    control,
    end,
    obstacles,
  )

  return {
    ...arrow,
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
    ...layout.accounts.map(obstacleBounds),
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
  const dx =
    Math.round(
      constrainedOffset(
        horizontalCenter - (bounds.x + bounds.w / 2),
        PAGE_MARGIN - bounds.x,
        ARTBOARD.width - PAGE_MARGIN - (bounds.x + bounds.w),
      ) * 10,
    ) / 10
  const dy =
    Math.round(
      constrainedOffset(
        verticalCenter - (bounds.y + bounds.h / 2),
        MASTHEAD_RULE_Y - bounds.y,
        lowerBound - (bounds.y + bounds.h),
      ) * 10,
    ) / 10
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
      start: {
        x: arrow.start.x + dx,
        y: arrow.start.y + dy,
      },
      control: {
        x: arrow.control.x + dx,
        y: arrow.control.y + dy,
      },
      end: {
        x: arrow.end.x + dx,
        y: arrow.end.y + dy,
      },
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
  hasRunway: boolean,
): PlacedAccount {
  const rot = normalizeRotation(override?.rot ?? 0)
  let desiredWidth = clamp(
    override?.w ?? placed.w,
    MIN_ACCOUNT_WIDTH,
    OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left,
  )
  const requestedHeight = clamp(
    override?.h ?? placed.h,
    MIN_ACCOUNT_HEIGHT,
    OVERRIDE_BOUNDS.bottom - OVERRIDE_BOUNDS.top,
  )
  let sizing = accountSizing(
    placed.account,
    desiredWidth,
    hasRunway,
    requestedHeight,
  )
  let desiredHeight = sizing.h
  const radians = (rot * Math.PI) / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  const minimumRotatedWidth =
    MIN_ACCOUNT_WIDTH * cosine + MIN_ACCOUNT_HEIGHT * sine
  const minimumRotatedHeight =
    MIN_ACCOUNT_WIDTH * sine + MIN_ACCOUNT_HEIGHT * cosine
  const extraWidth = desiredWidth - MIN_ACCOUNT_WIDTH
  const extraHeight = desiredHeight - MIN_ACCOUNT_HEIGHT
  const rotatedExtraWidth =
    extraWidth * cosine + extraHeight * sine
  const rotatedExtraHeight =
    extraWidth * sine + extraHeight * cosine
  const sizeScale = Math.min(
    1,
    rotatedExtraWidth === 0
      ? 1
      : (OVERRIDE_BOUNDS.right -
          OVERRIDE_BOUNDS.left -
          minimumRotatedWidth) /
          rotatedExtraWidth,
    rotatedExtraHeight === 0
      ? 1
      : (OVERRIDE_BOUNDS.bottom -
          OVERRIDE_BOUNDS.top -
          minimumRotatedHeight) /
          rotatedExtraHeight,
  )
  desiredWidth = MIN_ACCOUNT_WIDTH + extraWidth * sizeScale
  desiredHeight = MIN_ACCOUNT_HEIGHT + extraHeight * sizeScale
  sizing = accountSizing(
    placed.account,
    desiredWidth,
    hasRunway,
    desiredHeight,
  )
  desiredHeight = sizing.h
  const desired = {
    x: placed.x + (override?.dx ?? 0),
    y: placed.y + (override?.dy ?? 0),
    w: desiredWidth,
    h: desiredHeight,
  }
  const rotated = rotatedBounds(desired, rot)
  const clampedBounds = clampRectToBounds(rotated, OVERRIDE_BOUNDS)
  const clamped = {
    ...desired,
    x: desired.x + clampedBounds.x - rotated.x,
    y: desired.y + clampedBounds.y - rotated.y,
  }
  return {
    ...placed,
    ...sizing,
    ...clamped,
    rot,
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
  overrides: Record<string, LayoutOverride> | undefined,
  chipOverride: LayoutOverride | undefined,
): Arrow[] {
  const preserveGeneratedCaps = accounts
    .filter((placed) => placed.account.inWaterfall)
    .every((placed) => {
      const override = overrides?.[placed.account.id]
      return (
        override?.dx === undefined &&
        override?.dy === undefined &&
        override?.w === undefined &&
        override?.h === undefined &&
        override?.rot === undefined
      )
    })
  const arrows = [
    ...waterfallArrows(
      accounts,
      overrides,
      preserveGeneratedCaps,
    ),
    incomeArrow(
      income,
      need,
      accounts,
      overrides?.['arrow:income'],
    ),
  ]
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm) {
    arrows.push(
      applyAsNeededChipOverride(
        asNeededArrow(
          shortTerm,
          need,
          [income, need, ...accounts],
          overrides?.['arrow:asNeeded'],
        ),
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
    incomeArrow(income, need, accounts),
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
    data.layoutOverrides?.[placed.account.id]
      ? applyAccountOverride(
          placed,
          data.layoutOverrides[placed.account.id],
          placed.account.bucket === 'shortTerm' &&
            runwayLine(
              placed.account.value,
              data.asNeededAmount,
              data.showMath !== false,
            ) !== null,
        )
      : placed,
  )
  const arrows = arrowsForFinalGeometry(
    income,
    need,
    accounts,
    data.layoutOverrides,
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
