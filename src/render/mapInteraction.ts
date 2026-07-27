import type {
  LayoutOverride,
  MoneyMapData,
} from '../model/types'

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

export function withOverride(
  data: MoneyMapData,
  key: string,
  patch: LayoutOverride,
): MoneyMapData {
  const previous = data.layoutOverrides?.[key] ?? {}
  const merged = Object.fromEntries(
    Object.entries({ ...previous, ...patch }).filter(
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
