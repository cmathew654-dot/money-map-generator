import type {
  CustomArrowColor,
  GeneratedArrowKind,
  LayoutOverride,
  MapNote,
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

export interface AlignmentGuide {
  axis: 'x' | 'y'
  rect: Rect
  value: number
}

export interface AlignmentMatch {
  delta: number
  guide: AlignmentGuide
}

export interface AlignmentSnap {
  rect: Rect
  x?: AlignmentGuide
  y?: AlignmentGuide
}

export interface RectBounds {
  left: number
  top: number
  right: number
  bottom: number
}

export const DRAG_THRESHOLD_PX = 4
const ARTBOARD_CENTER_X = 660

export function alignmentGuides(
  rects: readonly Rect[],
  artboardCenterX = ARTBOARD_CENTER_X,
): AlignmentGuide[] {
  return [
    ...rects.flatMap((rect) => [
      { axis: 'x' as const, rect, value: rect.x },
      { axis: 'x' as const, rect, value: rect.x + rect.w / 2 },
      { axis: 'x' as const, rect, value: rect.x + rect.w },
      { axis: 'y' as const, rect, value: rect.y },
      { axis: 'y' as const, rect, value: rect.y + rect.h / 2 },
      { axis: 'y' as const, rect, value: rect.y + rect.h },
    ]),
    {
      axis: 'x',
      rect: { x: artboardCenterX, y: 0, w: 0, h: 1020 },
      value: artboardCenterX,
    },
  ]
}

export function nearestAlignmentMatch(
  rect: Rect,
  axis: 'x' | 'y',
  guides: readonly AlignmentGuide[],
  radius: number,
): AlignmentMatch | undefined {
  const anchors =
    axis === 'x'
      ? [rect.x, rect.x + rect.w / 2, rect.x + rect.w]
      : [rect.y, rect.y + rect.h / 2, rect.y + rect.h]
  let closest: AlignmentMatch | undefined

  for (const guide of guides) {
    if (guide.axis !== axis) continue
    for (const anchor of anchors) {
      const delta = guide.value - anchor
      if (
        Math.abs(delta) <= radius &&
        (!closest || Math.abs(delta) < Math.abs(closest.delta))
      ) {
        closest = { delta, guide }
      }
    }
  }

  return closest
}

export function snapRectToAlignment(
  rect: Rect,
  otherRects: readonly Rect[],
  radius: number,
  bypass = false,
): AlignmentSnap {
  if (bypass) return { rect }

  const guides = alignmentGuides(otherRects)
  const x = nearestAlignmentMatch(rect, 'x', guides, radius)
  const y = nearestAlignmentMatch(rect, 'y', guides, radius)

  return {
    rect: {
      ...rect,
      x: rect.x + (x?.delta ?? 0),
      y: rect.y + (y?.delta ?? 0),
    },
    x: x?.guide,
    y: y?.guide,
  }
}

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
      { id: newId('arrow'), sourceId, targetId, style: 'dotted' },
    ],
  }
}

export function cycleCustomArrowStyle(
  data: MoneyMapData,
  id: string,
): MoneyMapData {
  const arrow = data.customArrows?.find((item) => item.id === id)
  if (!arrow) return data
  const next = {
    dotted: 'dashed',
    dashed: 'solid',
    solid: 'dotted',
  } as const
  return {
    ...data,
    customArrows: data.customArrows?.map((item) =>
      item.id === id
        ? {
            ...item,
            style: next[item.style],
            color:
              item.color ??
              (item.style === 'solid' ? 'ink' : 'green'),
          }
        : item,
    ),
  }
}

export function retargetCustomArrow(
  data: MoneyMapData,
  id: string,
  field: 'sourceId' | 'targetId',
  endpointId: string,
): MoneyMapData {
  const arrow = data.customArrows?.find((item) => item.id === id)
  if (!arrow || !isArrowEndpoint(data, endpointId)) return data
  const otherField = field === 'sourceId' ? 'targetId' : 'sourceId'
  if (
    endpointId === arrow[otherField] ||
    data.customArrows?.some(
      (item) =>
        item.id !== id &&
        item[field] === endpointId &&
        item[otherField] === arrow[otherField],
    )
  ) {
    return data
  }

  const key = `arrow:custom:${id}`
  const override = { ...(data.layoutOverrides?.[key] ?? {}) }
  if (field === 'sourceId') {
    delete override.startAt
    delete override.startT
  } else {
    delete override.endAt
    delete override.endT
  }
  const layoutOverrides = { ...data.layoutOverrides }
  if (Object.keys(override).length > 0) layoutOverrides[key] = override
  else delete layoutOverrides[key]

  return {
    ...data,
    customArrows: data.customArrows?.map((item) =>
      item.id === id ? { ...item, [field]: endpointId } : item,
    ),
    layoutOverrides:
      Object.keys(layoutOverrides).length > 0 ? layoutOverrides : undefined,
  }
}

export function setCustomArrowColor(
  data: MoneyMapData,
  id: string,
  color: CustomArrowColor,
): MoneyMapData {
  if (!data.customArrows?.some((arrow) => arrow.id === id)) return data
  return {
    ...data,
    customArrows: data.customArrows.map((arrow) =>
      arrow.id === id ? { ...arrow, color } : arrow,
    ),
  }
}

export function moveCustomArrowLabel(
  data: MoneyMapData,
  id: string,
  labelDx: number,
  labelDy: number,
): MoneyMapData {
  if (!data.customArrows?.some((arrow) => arrow.id === id)) return data
  return {
    ...data,
    customArrows: data.customArrows.map((arrow) =>
      arrow.id === id ? { ...arrow, labelDx, labelDy } : arrow,
    ),
  }
}

export function hideGeneratedArrow(
  data: MoneyMapData,
  kind: GeneratedArrowKind,
): MoneyMapData {
  if (data.hiddenArrows?.includes(kind)) return data
  return {
    ...data,
    hiddenArrows: [...(data.hiddenArrows ?? []), kind],
  }
}

export function restoreGeneratedArrows(
  data: MoneyMapData,
): MoneyMapData {
  if (!data.hiddenArrows?.length) return data
  const restored = { ...data }
  delete restored.hiddenArrows
  return restored
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

export function addMapNote(
  data: MoneyMapData,
  note: MapNote,
): MoneyMapData {
  const text = note.text.trim()
  if (!text || data.notes?.some((item) => item.id === note.id)) return data
  return {
    ...data,
    notes: [...(data.notes ?? []), { ...note, text }],
  }
}

export function deleteMapNote(
  data: MoneyMapData,
  id: string,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.filter((note) => note.id !== id),
  }
}

export function moveMapNote(
  data: MoneyMapData,
  id: string,
  x: number,
  y: number,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, x, y } : note,
    ),
  }
}

export function resizeMapNote(
  data: MoneyMapData,
  id: string,
  w: number,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, w: clamp(w, 120, 600) } : note,
    ),
  }
}

export function setMapNoteBackground(
  data: MoneyMapData,
  id: string,
  bg: boolean,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, bg } : note,
    ),
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

export const TEXT_DRAG_THRESHOLD_PX = 8
export const TEXT_DRAG_MIN_MS = 180
export const TEXT_DRAG_FLICK_PX = 24

export function accountTextPointerAction(
  start: Point,
  current: Point,
  elapsedMs = Number.POSITIVE_INFINITY,
): 'edit' | 'move' {
  if (crossedDragThreshold(start, current, TEXT_DRAG_FLICK_PX)) return 'move'
  return crossedDragThreshold(start, current, TEXT_DRAG_THRESHOLD_PX) &&
    elapsedMs >= TEXT_DRAG_MIN_MS
    ? 'move'
    : 'edit'
}

export function pannedScrollPosition(
  startPointer: Point,
  currentPointer: Point,
  startScroll: Point,
): Point {
  return {
    x: startScroll.x + startPointer.x - currentPointer.x,
    y: startScroll.y + startPointer.y - currentPointer.y,
  }
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
