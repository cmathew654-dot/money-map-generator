import type {
  CustomArrowColor,
  GeneratedArrowKind,
  LayoutOverride,
  MapNote,
  MapNoteFont,
  MoneyMapData,
} from '../model/types'
import { layoutMap, layoutOverrideRect } from '../layout/layout'
import {
  ACCOUNT_TEXT_ROLES,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  accountTextOverrideKey,
  newId,
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

export interface AlignmentGuide {
  axis: 'x' | 'y'
  rect: Rect
  value: number
}

export interface AlignmentMatch {
  delta: number
  guide: AlignmentGuide
}

export type MapItemKey = `account:${string}` | `note:${string}`
export type MapAlignmentMode =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom'
export type MapDistributionMode = 'horizontal' | 'vertical'

export function isCompatibleMapItemKey(key: string): key is MapItemKey {
  return key.startsWith('account:') || key.startsWith('note:')
}

export function layoutRect(
  data: MoneyMapData,
  key: string,
): Rect | null {
  if (key.startsWith('account:')) {
    return layoutOverrideRect(data, key.slice('account:'.length))
  }
  if (!key.startsWith('note:')) return null
  const noteId = key.slice('note:'.length)
  const placed = layoutMap(data).notes.find(
    (candidate) => candidate.note.id === noteId,
  )
  return placed ? { x: placed.x, y: placed.y, w: placed.w, h: placed.h } : null
}

function moveMapItemTo(
  data: MoneyMapData,
  key: MapItemKey,
  x: number,
  y: number,
): MoneyMapData {
  const current = layoutRect(data, key)
  if (!current || (current.x === x && current.y === y)) return data
  if (key.startsWith('note:')) {
    return moveMapNote(data, key.slice('note:'.length), x, y)
  }

  const id = key.slice('account:'.length)
  const previous = data.layoutOverrides?.[id] ?? {}
  const base = layoutRect(
    {
      ...data,
      layoutOverrides: {
        ...data.layoutOverrides,
        [id]: { ...previous, dx: undefined, dy: undefined },
      },
    },
    key,
  )
  return base
    ? withOverride(data, id, { dx: x - base.x, dy: y - base.y })
    : data
}

export function alignMapItems(
  data: MoneyMapData,
  selectedKeys: readonly string[],
  mode: MapAlignmentMode,
): MoneyMapData {
  const items = selectedKeys
    .filter(isCompatibleMapItemKey)
    .map((key) => ({ key, rect: layoutRect(data, key) }))
    .filter((item): item is { key: MapItemKey; rect: Rect } => Boolean(item.rect))
  if (items.length < 2) return data

  const left = Math.min(...items.map(({ rect }) => rect.x))
  const right = Math.max(...items.map(({ rect }) => rect.x + rect.w))
  const top = Math.min(...items.map(({ rect }) => rect.y))
  const bottom = Math.max(...items.map(({ rect }) => rect.y + rect.h))
  const center = (left + right) / 2
  const middle = (top + bottom) / 2

  return items.reduce((next, { key, rect }) => {
    const x =
      mode === 'left'
        ? left
        : mode === 'center'
          ? center - rect.w / 2
          : mode === 'right'
            ? right - rect.w
            : rect.x
    const y =
      mode === 'top'
        ? top
        : mode === 'middle'
          ? middle - rect.h / 2
          : mode === 'bottom'
            ? bottom - rect.h
            : rect.y
    return moveMapItemTo(next, key, x, y)
  }, data)
}

export function distributeMapItems(
  data: MoneyMapData,
  selectedKeys: readonly string[],
  mode: MapDistributionMode,
): MoneyMapData {
  const axis = mode === 'horizontal' ? 'x' : 'y'
  const size = mode === 'horizontal' ? 'w' : 'h'
  const items = selectedKeys
    .filter(isCompatibleMapItemKey)
    .map((key, index) => ({ key, rect: layoutRect(data, key), index }))
    .filter(
      (item): item is { key: MapItemKey; rect: Rect; index: number } =>
        Boolean(item.rect),
    )
    .sort((left, right) => left.rect[axis] - right.rect[axis] || left.index - right.index)
  if (items.length < 3) return data

  const first = items[0].rect[axis]
  const last = items.at(-1)!.rect[axis] + items.at(-1)!.rect[size]
  const totalSize = items.reduce((sum, item) => sum + item.rect[size], 0)
  const gap = (last - first - totalSize) / (items.length - 1)
  let cursor = first

  return items.reduce((next, { key, rect }) => {
    const position = cursor
    cursor += rect[size] + gap
    return moveMapItemTo(
      next,
      key,
      mode === 'horizontal' ? position : rect.x,
      mode === 'vertical' ? position : rect.y,
    )
  }, data)
}

export function resetTextPosition(data: MoneyMapData, key: string): MoneyMapData {
  const override = data.layoutOverrides?.[key]
  if (!key.startsWith('text:') || !override || (override.dx === undefined && override.dy === undefined)) return data
  const { dx: _dx, dy: _dy, ...appearance } = override
  const { [key]: _removed, ...layoutOverrides } = data.layoutOverrides ?? {}
  return {
    ...data,
    layoutOverrides: Object.keys(appearance).length
      ? { ...layoutOverrides, [key]: appearance }
      : layoutOverrides,
  }
}

export function resetTextPositions(data: MoneyMapData): MoneyMapData {
  return Object.keys(data.layoutOverrides ?? {}).reduce(
    (current, key) => resetTextPosition(current, key),
    data,
  )
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

export function setCustomArrowLabel(
  data: MoneyMapData,
  id: string,
  label: string,
): MoneyMapData {
  if (!data.customArrows?.some((arrow) => arrow.id === id)) return data
  const trimmed = label.trim()
  return {
    ...data,
    customArrows: data.customArrows.map((arrow) =>
      arrow.id === id ? { ...arrow, label: trimmed || undefined } : arrow,
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

/** AABB intersection test. Shared by duplicate-placement and add-account collision checks. */
export function placementsOverlap(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  )
}

export function duplicatePlacement(
  sourceRect: Rect,
  blockedRects: readonly Rect[],
  bounds: RectBounds,
): Rect {
  const forward = clampRectToBounds(
    { ...sourceRect, x: sourceRect.x + 24, y: sourceRect.y + 24 },
    bounds,
  )
  const blocked =
    forward.x !== sourceRect.x + 24 ||
    forward.y !== sourceRect.y + 24 ||
    blockedRects.some((rect) => placementsOverlap(forward, rect))
  return blocked
    ? clampRectToBounds(
        { ...sourceRect, x: sourceRect.x - 24, y: sourceRect.y - 24 },
        bounds,
      )
    : forward
}

export function duplicateMapAccount(
  data: MoneyMapData,
  id: string,
  sourceRect: Rect,
  blockedRects: readonly Rect[],
  bounds: RectBounds,
): { data: MoneyMapData; rect: Rect; targetKey: string } | null {
  const account = data.accounts.find((candidate) => candidate.id === id)
  if (!account) return null
  const placed = duplicatePlacement(sourceRect, blockedRects, bounds)
  const copyId = newId('account')
  const sourceOverride = data.layoutOverrides?.[id] ?? {}
  const visualOverride = { ...sourceOverride }
  delete visualOverride.dx
  delete visualOverride.dy
  const layoutOverrides = {
    ...data.layoutOverrides,
    [copyId]: visualOverride,
  }
  for (const role of ACCOUNT_TEXT_ROLES) {
    const override = data.layoutOverrides?.[accountTextOverrideKey(id, role)]
    if (override) layoutOverrides[accountTextOverrideKey(copyId, role)] = { ...override }
  }

  return {
    data: {
      ...data,
      accounts: data.accounts.flatMap((candidate) =>
        candidate.id === id
          ? [candidate, { ...structuredClone(candidate), id: copyId }]
          : [candidate],
      ),
      layoutOverrides,
    },
    rect: placed,
    targetKey: 'account:' + copyId,
  }
}

export function duplicateMapNote(
  data: MoneyMapData,
  id: string,
  sourceRect: Rect,
  blockedRects: readonly Rect[],
  bounds: RectBounds,
): { data: MoneyMapData; rect: Rect; targetKey: string } | null {
  const note = data.notes?.find((candidate) => candidate.id === id)
  if (!note) return null
  const placed = duplicatePlacement(sourceRect, blockedRects, bounds)
  const copyId = newId('note')

  return {
    data: {
      ...data,
      notes: data.notes?.flatMap((candidate) =>
        candidate.id === id
          ? [candidate, { ...candidate, id: copyId, x: placed.x, y: placed.y }]
          : [candidate],
      ),
    },
    rect: placed,
    targetKey: 'note:' + copyId,
  }
}

export function deleteMapAccount(
  data: MoneyMapData,
  id: string,
): MoneyMapData {
  if (!data.accounts.some((account) => account.id === id)) return data
  const layoutOverrides = Object.fromEntries(
    Object.entries(data.layoutOverrides ?? {}).filter(
      ([key]) => key !== id && !key.startsWith(`text:${id}:`),
    ),
  )
  return {
    ...data,
    accounts: data.accounts.filter((account) => account.id !== id),
    customArrows: data.customArrows?.filter(
      (arrow) => arrow.sourceId !== id && arrow.targetId !== id,
    ),
    layoutOverrides: Object.keys(layoutOverrides).length
      ? layoutOverrides
      : undefined,
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

export function setMapNoteFontSize(
  data: MoneyMapData,
  id: string,
  fs: number,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id
        ? {
            ...note,
            fs: clamp(fs, MIN_MAP_TEXT_FONT_SIZE, MAX_MAP_TEXT_FONT_SIZE),
          }
        : note,
    ),
  }
}

export function setMapNoteFont(
  data: MoneyMapData,
  id: string,
  font: MapNoteFont,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, font } : note,
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
