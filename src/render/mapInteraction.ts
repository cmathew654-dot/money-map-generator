import type {
  LayoutOverride,
  MoneyMapData,
} from '../model/types'
import { newId } from '../model/types'

export interface Point {
  x: number
  y: number
}

export interface TransformMatrix {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

export interface RectBounds {
  left: number
  top: number
  right: number
  bottom: number
}

export const DRAG_THRESHOLD_PX = 4

function isArrowEndpoint(data: MoneyMapData, id: string): boolean {
  return (
    id === 'income' ||
    id === 'need' ||
    data.accounts.some((account) => account.id === id)
  )
}

export function addCustomArrow(
  data: MoneyMapData,
  sourceId: string,
  targetId: string,
): MoneyMapData {
  if (
    sourceId === targetId ||
    !isArrowEndpoint(data, sourceId) ||
    !isArrowEndpoint(data, targetId) ||
    data.customArrows?.some(
      (arrow) =>
        arrow.sourceId === sourceId && arrow.targetId === targetId,
    )
  ) {
    return data
  }

  return {
    ...data,
    customArrows: [
      ...(data.customArrows ?? []),
      { id: newId('arrow'), sourceId, targetId },
    ],
  }
}

export function deleteCustomArrow(
  data: MoneyMapData,
  id: string,
): MoneyMapData {
  if (!data.customArrows?.some((arrow) => arrow.id === id)) return data
  return {
    ...data,
    customArrows: data.customArrows.filter((arrow) => arrow.id !== id),
  }
}

export function screenPointToArtboard(
  point: Point,
  inverseScreenCtm: TransformMatrix,
): Point {
  return {
    x:
      inverseScreenCtm.a * point.x +
      inverseScreenCtm.c * point.y +
      inverseScreenCtm.e,
    y:
      inverseScreenCtm.b * point.x +
      inverseScreenCtm.d * point.y +
      inverseScreenCtm.f,
  }
}

export function screenDeltaToArtboard(
  delta: Point,
  inverseScreenCtm: TransformMatrix,
): Point {
  return {
    x:
      inverseScreenCtm.a * delta.x +
      inverseScreenCtm.c * delta.y,
    y:
      inverseScreenCtm.b * delta.x +
      inverseScreenCtm.d * delta.y,
  }
}

export function crossedDragThreshold(
  start: Point,
  current: Point,
  threshold = DRAG_THRESHOLD_PX,
): boolean {
  return Math.hypot(current.x - start.x, current.y - start.y) >= threshold
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

export function normalizeRotation(angle: number): number {
  return ((angle % 360) + 360) % 360
}

export function snapRotation(
  angle: number,
  increment = 15,
  threshold = 3,
): number {
  const normalized = normalizeRotation(angle)
  const snapped = Math.round(normalized / increment) * increment
  const distance = Math.min(
    Math.abs(normalized - snapped),
    Math.abs(normalized - (snapped - 360)),
  )
  return distance <= threshold
    ? normalizeRotation(snapped)
    : normalized
}

export function clampRectToBounds(
  rect: Rect,
  bounds: RectBounds,
): Rect {
  const w = Math.min(rect.w, bounds.right - bounds.left)
  const h = Math.min(rect.h, bounds.bottom - bounds.top)
  return {
    x: clamp(rect.x, bounds.left, bounds.right - w),
    y: clamp(rect.y, bounds.top, bounds.bottom - h),
    w,
    h,
  }
}

export function signedPerpendicularOffset(
  start: Point,
  end: Point,
  point: Point,
): number {
  const chord = { x: end.x - start.x, y: end.y - start.y }
  const length = Math.hypot(chord.x, chord.y)
  if (length === 0) return 0
  return (
    ((point.x - start.x) * -chord.y +
      (point.y - start.y) * chord.x) /
    length
  )
}

export function withOverride(
  data: MoneyMapData,
  key: string,
  patch: LayoutOverride,
): MoneyMapData {
  const previous = data.layoutOverrides?.[key] ?? {}
  const normalizedPatch =
    patch.rot === undefined
      ? patch
      : { ...patch, rot: normalizeRotation(patch.rot) }
  const merged = Object.fromEntries(
    Object.entries({ ...previous, ...normalizedPatch }).filter(
      ([, value]) => value !== undefined,
    ),
  ) as LayoutOverride

  return {
    ...data,
    layoutOverrides: {
      ...data.layoutOverrides,
      [key]: merged,
    },
  }
}
