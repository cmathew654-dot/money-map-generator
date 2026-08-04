import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { money, parseMoneyInput } from '../model/format'
import type { AccountTextRole, MoneyMapData } from '../model/types'
import {
  accountTextOverrideKey,
  MAX_ACCOUNT_TEXT_FONT_SIZE,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  mapItemTextOverrideKey,
  mapTextOverrideKey,
} from '../model/types'
import { addMapNote } from '../render/mapInteraction'
import {
  ARTBOARD,
  FLOW_GREEN,
  FONT_SANS,
  FONT_SERIF,
  INK,
  MUTED,
  NEED_RED,
  TYPE,
} from '../render/tokens'

export type MapTextEditTarget =
  | { kind: 'accountValue'; accountId: string }
  | { kind: 'accountLabel'; accountId: string }
  | { kind: 'accountCaption'; accountId: string }
  | { kind: 'accountRows'; accountId: string }
  | { kind: 'accountSub'; accountId: string }
  | { kind: 'accountPositionLabel'; accountId: string; positionIndex: number }
  | { kind: 'accountPositionValue'; accountId: string; positionIndex: number }
  | { kind: 'accountSubLabel'; accountId: string; subAccountIndex: number }
  | { kind: 'accountSubCaption'; accountId: string; subAccountIndex: number }
  | { kind: 'accountSubValue'; accountId: string; subAccountIndex: number }
  | { kind: 'incomeHeader' }
  | { kind: 'incomeAmount'; incomeIndex: number; incomeId?: string }
  | { kind: 'afterTaxIncome' }
  | { kind: 'needLabel' }
  | { kind: 'monthlyNeed' }
  | { kind: 'mastheadLabel' }
  | { kind: 'footnoteText'; footnoteId?: string }
  | { kind: 'asNeededAmount' }
  | { kind: 'flowLabel'; arrowId: string }
  | { kind: 'noteText'; noteId: string; x?: number; y?: number }

export interface MapTextEditRect {
  left: number
  top: number
  width: number
  height: number
}

export interface ActiveMapTextEdit {
  color?: string
  target: MapTextEditTarget
  rect: MapTextEditRect
  anchorRect?: MapTextEditRect
  rawValue: string
  fontSize?: number
  fontSizeMax?: number
  fontSizeChanged?: boolean
}

export interface MapTextEditorTextStyle {
  color: string
  fontFamily: string
  fontSize: number
  fontWeight: number
  letterSpacing?: number
  textAlign: 'left' | 'center' | 'right'
  textTransform?: 'uppercase'
}

export interface MapTextEditorPillPosition {
  left: number
  placement: 'above' | 'below'
  top: number
}

export type MapTextEditorDismissReason = 'close' | 'escape' | 'outside'
export type MapTextEditorDismissAction = 'cancel' | 'commit'

export function mapTextEditorDismissAction(
  reason: MapTextEditorDismissReason,
): MapTextEditorDismissAction {
  return reason === 'escape' ? 'cancel' : 'commit'
}
export function mapTextEditorShouldRestoreFocus(
  reason: MapTextEditorDismissReason,
): boolean {
  return reason !== 'outside'
}
export function mapTextEditorFocusOrigin<
  T extends {
    readonly isConnected: boolean
    getAttribute(name: string): string | null
  },
>(captured: T | null, targetKey: string, fallbacks: readonly T[] = []): T | null {
  const matches = (candidate: T) =>
    candidate.isConnected &&
    candidate.getAttribute('data-map-edit-key') === targetKey
  if (captured && matches(captured)) return captured
  return fallbacks.find(matches) ?? null
}
export function mapTextEditTargetKey(target: MapTextEditTarget): string {
  switch (target.kind) {
    case 'accountValue':
    case 'accountLabel':
    case 'accountCaption':
    case 'accountRows':
    case 'accountSub':
      return `${target.kind}:${target.accountId}`
    case 'accountPositionLabel':
    case 'accountPositionValue':
      return `${target.kind}:${target.accountId}:${target.positionIndex}`
    case 'accountSubLabel':
    case 'accountSubCaption':
    case 'accountSubValue':
      return `${target.kind}:${target.accountId}:${target.subAccountIndex}`
    case 'incomeAmount':
      return `${target.kind}:${target.incomeId ?? target.incomeIndex}`
    case 'footnoteText':
      return target.footnoteId ? `${target.kind}:${target.footnoteId}` : target.kind
    case 'flowLabel':
      return `${target.kind}:${target.arrowId}`
    case 'noteText':
      return `${target.kind}:${target.noteId}`
    default:
      return target.kind
  }
}

export function mapTextEditorPillPosition(
  rect: MapTextEditRect,
  mapTop: number,
  pillWidth = 72,
  pillHeight = 30,
  gap = 8,
): MapTextEditorPillPosition {
  const placement = rect.top - mapTop < 48 ? 'below' : 'above'
  return {
    left: rect.left + (rect.width - pillWidth) / 2,
    placement,
    top:
      placement === 'below'
        ? rect.top + rect.height + gap
        : rect.top - pillHeight - gap,
  }
}

type MapTextEditKind = MapTextEditTarget['kind']
type MapTextEditorStyleBase = Omit<MapTextEditorTextStyle, 'fontSize'>

const MAP_TEXT_EDITOR_STYLES: Record<
  MapTextEditKind,
  MapTextEditorStyleBase
> = {
  accountCaption: {
    color: MUTED, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'center',
  },
  accountLabel: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'center',
  },
  accountRows: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'left',
  },
  accountSub: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'center',
  },
  accountPositionLabel: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'left',
  },
  accountPositionValue: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'right',
  },
  accountSubLabel: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 600, textAlign: 'center',
  },
  accountSubCaption: {
    color: MUTED, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'center',
  },
  accountSubValue: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'center',
  },
  accountValue: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'center',
  },
  afterTaxIncome: {
    color: FLOW_GREEN, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'right',
  },
  asNeededAmount: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'left',
  },
  flowLabel: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'center',
  },
  footnoteText: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 400, textAlign: 'center',
  },
  incomeAmount: {
    color: INK, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'left',
  },
  incomeHeader: {
    color: FLOW_GREEN, fontFamily: FONT_SANS, fontWeight: 700,
    letterSpacing: 1.7, textAlign: 'left', textTransform: 'uppercase',
  },
  mastheadLabel: {
    color: MUTED, fontFamily: FONT_SANS, fontWeight: 600,
    letterSpacing: 2.5, textAlign: 'left', textTransform: 'uppercase',
  },
  monthlyNeed: {
    color: NEED_RED, fontFamily: FONT_SERIF, fontWeight: 600, textAlign: 'center',
  },
  needLabel: {
    color: INK, fontFamily: FONT_SANS, fontWeight: 700,
    letterSpacing: 1.8, textAlign: 'center', textTransform: 'uppercase',
  },
  noteText: {
    color: MUTED, fontFamily: FONT_SERIF, fontWeight: 400, textAlign: 'left',
  },
}

const MAP_TEXT_EDITOR_FONT_SIZES: Record<MapTextEditKind, number> = {
  accountCaption: TYPE.caption,
  accountLabel: TYPE.accountTitle,
  accountRows: TYPE.row,
  accountSub: TYPE.subValue,
  accountPositionLabel: TYPE.row,
  accountPositionValue: TYPE.row,
  accountSubLabel: TYPE.subAccountTitle,
  accountSubCaption: TYPE.subAccountCaption,
  accountSubValue: TYPE.subValue,
  accountValue: TYPE.value,
  afterTaxIncome: TYPE.incomeTotalValue,
  asNeededAmount: TYPE.arrowLabel,
  flowLabel: TYPE.arrowLabel,
  footnoteText: TYPE.footnote,
  incomeAmount: TYPE.incomeValue,
  incomeHeader: TYPE.panelHeader,
  mastheadLabel: TYPE.mastheadLabel,
  monthlyNeed: TYPE.needValue,
  needLabel: TYPE.needLabel,
  noteText: TYPE.note,
}

export function mapTextEditorTextStyle(
  target: MapTextEditTarget,
  fontSize?: number,
): MapTextEditorTextStyle {
  return {
    ...MAP_TEXT_EDITOR_STYLES[target.kind],
    fontSize: fontSize ?? MAP_TEXT_EDITOR_FONT_SIZES[target.kind],
  }
}

type SizeOnlyMapTextEditTarget = Extract<
  MapTextEditTarget,
  {
    kind:
      | 'accountRows'
      | 'accountSub'
      | 'incomeHeader'
      | 'needLabel'
      | 'footnoteText'
  }
>

function isSizeOnlyTarget(
  target: MapTextEditTarget,
): target is SizeOnlyMapTextEditTarget {
  return (
    target.kind === 'accountRows' ||
    target.kind === 'accountSub' ||
    target.kind === 'incomeHeader' ||
    target.kind === 'needLabel' ||
    target.kind === 'footnoteText'
  )
}

export function accountTextRoleForTarget(
  target: MapTextEditTarget,
): AccountTextRole | null {
  if (target.kind === 'accountLabel') return 'label'
  if (target.kind === 'accountCaption') return 'caption'
  if (target.kind === 'accountValue') return 'value'
  return null
}

export interface MapTextEditFsInfo {
  key?: string
  fallback: number
  max: number
}

export function mapTextEditFsInfo(
  _data: MoneyMapData,
  target: MapTextEditTarget,
): MapTextEditFsInfo | null {
  const accountRole = accountTextRoleForTarget(target)
  if (accountRole && 'accountId' in target) {
    return {
      key: accountTextOverrideKey(target.accountId, accountRole),
      fallback:
        accountRole === 'label'
          ? TYPE.accountTitle
          : accountRole === 'caption'
            ? TYPE.caption
            : TYPE.value,
      max: MAX_ACCOUNT_TEXT_FONT_SIZE,
    }
  }

  switch (target.kind) {
    case 'accountRows':
    case 'accountPositionLabel':
    case 'accountPositionValue':
      return {
        key: accountTextOverrideKey(target.accountId, 'rows'),
        fallback: TYPE.row,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'accountSub':
    case 'accountSubLabel':
    case 'accountSubCaption':
    case 'accountSubValue':
      return {
        key: accountTextOverrideKey(target.accountId, 'sub'),
        fallback: TYPE.subValue,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'asNeededAmount':
      return {
        key: mapTextOverrideKey('asNeeded', 'amount'),
        fallback: TYPE.arrowLabel,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'incomeAmount':
      return {
        key: mapTextOverrideKey('income', 'row'),
        fallback: TYPE.incomeValue,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'afterTaxIncome':
      return {
        key: mapTextOverrideKey('income', 'total'),
        fallback: TYPE.incomeTotalValue,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'needLabel':
      return {
        key: mapTextOverrideKey('need', 'label'),
        fallback: TYPE.needLabel,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'monthlyNeed':
      return {
        key: mapTextOverrideKey('need', 'value'),
        fallback: TYPE.needValue,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'footnoteText':
      return {
        key: target.footnoteId
          ? mapItemTextOverrideKey('footnotes', 'line', target.footnoteId)
          : mapTextOverrideKey('footnotes', 'line'),
        fallback: TYPE.footnote,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'noteText':
      return {
        fallback:
          _data.notes?.find((note) => note.id === target.noteId)?.fs ??
          TYPE.note,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    default:
      return null
  }
}

export function adjustMapTextFontSize(
  fontSize: number,
  change: number,
  max: number,
): number {
  return Math.min(
    max,
    Math.max(MIN_MAP_TEXT_FONT_SIZE, fontSize + change),
  )
}

export function applyMapTextFontSize(
  data: MoneyMapData,
  target: MapTextEditTarget,
  fontSize: number,
): MoneyMapData {
  const fsInfo = mapTextEditFsInfo(data, target)
  if (!fsInfo) return data
  const fs = adjustMapTextFontSize(fontSize, 0, fsInfo.max)
  if (fsInfo.key) {
    const previous = data.layoutOverrides?.[fsInfo.key] ?? {}
    return {
      ...data,
      layoutOverrides: {
        ...data.layoutOverrides,
        [fsInfo.key]: { ...previous, fs },
      },
    }
  }
  if (
    target.kind !== 'noteText' ||
    !data.notes?.some((note) => note.id === target.noteId)
  ) {
    return data
  }
  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === target.noteId ? { ...note, fs } : note,
    ),
  }
}

export function mapTextEditRawValue(
  data: MoneyMapData,
  target: MapTextEditTarget,
): string {
  switch (target.kind) {
    case 'accountValue':
      return money(
        data.accounts.find((account) => account.id === target.accountId)
          ?.value ?? null,
      )
    case 'accountLabel':
      return (
        data.accounts.find((account) => account.id === target.accountId)
          ?.label ?? ''
      )
    case 'accountCaption':
      return (
        data.accounts.find((account) => account.id === target.accountId)
          ?.caption ?? ''
      )
    case 'accountPositionLabel':
      return data.accounts.find((account) => account.id === target.accountId)
        ?.positions?.[target.positionIndex]?.label ?? ''
    case 'accountPositionValue':
      return money(data.accounts.find((account) => account.id === target.accountId)
        ?.positions?.[target.positionIndex]?.value ?? null)
    case 'accountSubLabel':
      return data.accounts.find((account) => account.id === target.accountId)
        ?.subAccounts?.[target.subAccountIndex]?.label ?? ''
    case 'accountSubCaption':
      return data.accounts.find((account) => account.id === target.accountId)
        ?.subAccounts?.[target.subAccountIndex]?.caption ?? ''
    case 'accountSubValue':
      return money(data.accounts.find((account) => account.id === target.accountId)
        ?.subAccounts?.[target.subAccountIndex]?.value ?? null)
    case 'incomeAmount':
      return money(
        data.incomeSources[target.incomeIndex]?.amount ?? null,
      )
    case 'afterTaxIncome':
      return money(data.afterTaxIncome)
    case 'monthlyNeed':
      return money(data.monthlyNeed)
    case 'asNeededAmount':
      return money(data.asNeededAmount)
    case 'flowLabel':
      return (
        data.customArrows?.find((arrow) => arrow.id === target.arrowId)
          ?.label ?? ''
      )
    case 'mastheadLabel':
      return data.client.mastheadLabel ?? 'Money Map'
    case 'noteText':
      return data.notes?.find((note) => note.id === target.noteId)?.text ?? ''
    case 'incomeHeader':
    case 'needLabel':
    case 'footnoteText':
    case 'accountRows':
    case 'accountSub':
      return ''
  }
}

export function applyMapTextEdit(
  data: MoneyMapData,
  target: MapTextEditTarget,
  rawValue: string | null,
): MoneyMapData {
  if (rawValue === null) return data
  if (isSizeOnlyTarget(target)) return data
  if (
    target.kind === 'accountLabel' ||
    target.kind === 'accountCaption' ||
    target.kind === 'accountPositionLabel' ||
    target.kind === 'accountSubLabel' ||
    target.kind === 'accountSubCaption'
  ) {
    const text = rawValue.trim()
    return {
      ...data,
      accounts: data.accounts.map((account) =>
        account.id === target.accountId
          ? target.kind === 'accountLabel'
            ? { ...account, label: text }
            : target.kind === 'accountCaption'
              ? { ...account, caption: text }
              : target.kind === 'accountPositionLabel'
                ? {
                    ...account,
                    positions: account.positions?.map((position, index) =>
                      index === target.positionIndex
                        ? { ...position, label: text }
                        : position,
                    ),
                  }
                : {
                    ...account,
                    subAccounts: account.subAccounts?.map((subAccount, index) =>
                      index === target.subAccountIndex
                        ? {
                            ...subAccount,
                            [target.kind === 'accountSubLabel' ? 'label' : 'caption']: text,
                          }
                        : subAccount,
                    ),
                  }
          : account,
      ),
    }
  }
  if (target.kind === 'mastheadLabel') {
    const mastheadLabel = rawValue.trim()
    const current = data.client.mastheadLabel
    if (
      mastheadLabel === (current ?? 'Money Map') ||
      (!mastheadLabel && current === undefined)
    ) {
      return data
    }
    const client = { ...data.client }
    if (mastheadLabel) client.mastheadLabel = mastheadLabel
    else delete client.mastheadLabel
    return { ...data, client }
  }
  if (target.kind === 'noteText') {
    const existing = data.notes?.some((note) => note.id === target.noteId)
    if (!existing) {
      return addMapNote(data, {
        id: target.noteId,
        text: rawValue,
        x: target.x ?? 0,
        y: target.y ?? 0,
      })
    }
    return {
      ...data,
      notes: data.notes?.map((note) =>
        note.id === target.noteId ? { ...note, text: rawValue } : note,
      ),
    }
  }
  if (target.kind === 'flowLabel') {
    const exists = data.customArrows?.some(
      (arrow) => arrow.id === target.arrowId,
    )
    if (!exists) return data
    const label = rawValue.trim()
    return {
      ...data,
      customArrows: data.customArrows?.map((arrow) =>
        arrow.id === target.arrowId
          ? {
              ...arrow,
              ...(label ? { label } : {}),
              ...(!label && arrow.label ? { label: undefined } : {}),
            }
          : arrow,
      ),
    }
  }

  const value = parseMoneyInput(rawValue)
  switch (target.kind) {
    case 'accountValue':
      return {
        ...data,
        accounts: data.accounts.map((account) =>
          account.id === target.accountId ? { ...account, value } : account,
        ),
      }
    case 'accountPositionValue':
      return {
        ...data,
        accounts: data.accounts.map((account) =>
          account.id === target.accountId
            ? {
                ...account,
                positions: account.positions?.map((position, index) =>
                  index === target.positionIndex
                    ? { ...position, value }
                    : position,
                ),
              }
            : account,
        ),
      }
    case 'accountSubValue':
      return {
        ...data,
        accounts: data.accounts.map((account) =>
          account.id === target.accountId
            ? {
                ...account,
                subAccounts: account.subAccounts?.map((subAccount, index) =>
                  index === target.subAccountIndex
                    ? { ...subAccount, value }
                    : subAccount,
                ),
              }
            : account,
        ),
      }
    case 'incomeAmount':
      return {
        ...data,
        incomeSources: data.incomeSources.map((source, index) =>
          index === target.incomeIndex ? { ...source, amount: value } : source,
        ),
      }
    case 'afterTaxIncome':
      return { ...data, afterTaxIncome: value }
    case 'monthlyNeed':
      return { ...data, monthlyNeed: value }
    case 'asNeededAmount':
      return { ...data, asNeededAmount: value }
  }
}

export function mapTextEditorTargetLabel(target: MapTextEditTarget): string {
  if (target.kind === 'mastheadLabel') return 'map heading'
  if (target.kind === 'accountLabel') return 'account name'
  if (target.kind === 'accountCaption') return 'account description'
  if (target.kind === 'accountRows') return 'investment details'
  if (target.kind === 'accountSub') return 'nested account details'
  if (target.kind === 'accountPositionLabel') return 'investment name'
  if (target.kind === 'accountPositionValue') return 'investment amount'
  if (target.kind === 'accountSubLabel') return 'nested account name'
  if (target.kind === 'accountSubCaption') return 'nested account description'
  if (target.kind === 'accountSubValue') return 'nested account amount'
  if (target.kind === 'incomeHeader') return 'income heading'
  if (target.kind === 'incomeAmount') return 'income source amount'
  if (target.kind === 'afterTaxIncome') return 'after-tax income'
  if (target.kind === 'needLabel') return 'monthly amount needed heading'
  if (target.kind === 'monthlyNeed') return 'monthly amount needed'
  if (target.kind === 'footnoteText') return 'fine print'
  if (target.kind === 'asNeededAmount') return 'monthly account withdrawal'
  if (target.kind === 'flowLabel') return 'transfer description'
  if (target.kind === 'noteText') return 'map note'
  return 'account value'
}

export function MapTextEditor({
  edit,
  containerRef,
  onCancel,
  onCommit,
  onFontSizeChange,
}: {
  edit: ActiveMapTextEdit
  containerRef: RefObject<HTMLElement | null>
  onCancel(): void
  onCommit(rawValue: string): void
  onFontSizeChange?(fontSize: number): void
}) {
  const targetKey = mapTextEditTargetKey(edit.target)
  const activeElement =
    typeof document === 'undefined' ? null : document.activeElement
  const [rawValue, setRawValue] = useState(edit.rawValue)
  const editorRef = useRef<HTMLDivElement>(null)
  const finished = useRef(false)
  const originRef = useRef<SVGElement | null>(
    typeof SVGElement !== 'undefined' && activeElement instanceof SVGElement
      ? mapTextEditorFocusOrigin(activeElement, targetKey)
      : null,
  )
  const sizeControlsRef = useRef<HTMLDivElement>(null)
  const container = containerRef.current
  const containerRect = container?.getBoundingClientRect()
  const mapRect = container?.querySelector('svg')?.getBoundingClientRect()
  const sizeOnly = isSizeOnlyTarget(edit.target)
  const fontSizeMax = edit.fontSizeMax ?? MAX_ACCOUNT_TEXT_FONT_SIZE
  const mapScale = mapRect ? mapRect.width / ARTBOARD.width : 1
  const textStyle = mapTextEditorTextStyle(
    edit.target,
    edit.fontSize,
  )
  const multiline =
    edit.rect.height > textStyle.fontSize * mapScale * 1.45
  const inputStyle: CSSProperties = {
    color: edit.color ?? textStyle.color,
    fontFamily: textStyle.fontFamily,
    fontSize: textStyle.fontSize * mapScale,
    fontWeight: textStyle.fontWeight,
    height: edit.rect.height,
    left:
      edit.rect.left -
      (containerRect?.left ?? 0) +
      (container?.scrollLeft ?? 0),
    letterSpacing:
      textStyle.letterSpacing === undefined
        ? undefined
        : textStyle.letterSpacing * mapScale,
    lineHeight: `${
      multiline
        ? textStyle.fontSize * mapScale * 1.25
        : edit.rect.height
    }px`,
    textAlign: textStyle.textAlign,
    textTransform: textStyle.textTransform,
    top:
      edit.rect.top -
      (containerRect?.top ?? 0) +
      (container?.scrollTop ?? 0),
    width: Math.max(edit.rect.width, 24),
  }
  const pillButtonCount = edit.fontSize === undefined ? 1 : 3
  const pillAnchor = edit.anchorRect
    ? {
        left: edit.rect.left,
        width: edit.rect.width,
        top: Math.min(edit.anchorRect.top, edit.rect.top),
        height:
          Math.max(
            edit.anchorRect.top + edit.anchorRect.height,
            edit.rect.top + edit.rect.height,
          ) - Math.min(edit.anchorRect.top, edit.rect.top),
      }
    : edit.rect
  const pillScreenPosition = mapTextEditorPillPosition(
    pillAnchor,
    mapRect?.top ?? pillAnchor.top,
    pillButtonCount * 36,
  )
  const pillStyle: CSSProperties = {
    left:
      pillScreenPosition.left -
      (containerRect?.left ?? 0) +
      (container?.scrollLeft ?? 0),
    top:
      pillScreenPosition.top -
      (containerRect?.top ?? 0) +
      (container?.scrollTop ?? 0),
  }
  const restoreOriginFocus = () => {
    const origin = originRef.current
    window.setTimeout(() => {
      if (origin?.isConnected) origin.focus()
    }, 0)
  }
  const finish = (reason: MapTextEditorDismissReason) => {
    if (finished.current) return
    finished.current = true
    if (mapTextEditorDismissAction(reason) === 'cancel') onCancel()
    else onCommit(rawValue)
    if (mapTextEditorShouldRestoreFocus(reason)) restoreOriginFocus()
  }

  useEffect(() => {
    if (sizeOnly) sizeControlsRef.current?.focus()
  }, [sizeOnly])

  useEffect(() => {
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (
        editorRef.current?.contains(target) ||
        sizeControlsRef.current?.contains(target)
      ) {
        return
      }
      finish('outside')
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () =>
      document.removeEventListener('pointerdown', handlePointerDown, true)
  })

  useLayoutEffect(() => {
    const editedElements = Array.from(
      containerRef.current?.querySelectorAll<SVGElement>(
        '[data-map-edit-key]',
      ) ?? [],
    ).filter(
      (element) => element.getAttribute('data-map-edit-key') === targetKey,
    )
    const focusedElements = editedElements.filter(
      (element) => element === document.activeElement,
    )
    const tabStops = editedElements.filter((element) =>
      element.hasAttribute('tabindex'),
    )
    originRef.current = mapTextEditorFocusOrigin(
      originRef.current,
      targetKey,
      [...focusedElements, ...tabStops, ...editedElements],
    )
    if (!sizeOnly) {
      editedElements.forEach((element) =>
        element.classList.add('map-editing-text'),
      )
    }
    return () => {
      editedElements.forEach((element) =>
        element.classList.remove('map-editing-text'),
      )
    }
  }, [containerRef, sizeOnly, targetKey])

  const inputMode: 'decimal' | 'text' =
    edit.target.kind === 'accountLabel' ||
    edit.target.kind === 'accountCaption' ||
    edit.target.kind === 'accountPositionLabel' ||
    edit.target.kind === 'accountSubLabel' ||
    edit.target.kind === 'accountSubCaption' ||
    edit.target.kind === 'mastheadLabel' ||
    edit.target.kind === 'flowLabel' ||
    edit.target.kind === 'noteText'
      ? 'text'
      : 'decimal'
  const controlProps = {
    'aria-label': `${sizeOnly ? 'Adjust' : 'Edit'} ${mapTextEditorTargetLabel(edit.target)}`,
    autoFocus: true,
    className: 'map-text-editor-input',
    inputMode,
    onBlur: (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextTarget = event.relatedTarget as Node | null
      if (nextTarget && sizeControlsRef.current?.contains(nextTarget)) return
      finish('outside')
    },
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setRawValue(event.target.value),
    onFocus: (
      event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => event.currentTarget.select(),
    onKeyDown: (
      event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        finish('close')
      } else if (event.key === 'Escape') {
        event.preventDefault()
        // Dismissing the editor must not reach the app-level Escape handler,
        // which would read the just-cleared edit and drop the selection too.
        event.stopPropagation()
        finish('escape')
      }
    },
    placeholder:
      edit.target.kind === 'noteText' ? 'Add a note…' : undefined,
    value: rawValue,
  }

  return (
    <>
      {!sizeOnly && (
        <div ref={editorRef} className="map-text-editor" style={inputStyle}>
          {multiline ? (
            <textarea {...controlProps} />
          ) : (
            <input {...controlProps} type="text" />
          )}
        </div>
      )}
      <div
        ref={sizeControlsRef}
        aria-label={sizeOnly ? `Adjust ${mapTextEditorTargetLabel(edit.target)}` : undefined}
        className={`map-text-size-controls is-${pillScreenPosition.placement}`}
        role={sizeOnly ? 'group' : undefined}
        style={pillStyle}
        tabIndex={sizeOnly ? 0 : undefined}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget as Node | null
          if (
            nextTarget &&
            (event.currentTarget.contains(nextTarget) ||
              editorRef.current?.contains(nextTarget))
          ) {
            return
          }
          finish('outside')
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            finish('escape')
          } else if (
            sizeOnly &&
            event.key === 'Enter' &&
            event.target === event.currentTarget
          ) {
            event.preventDefault()
            finish('close')
          }
        }}
      >
        {edit.fontSize !== undefined && (
          <>
            <button
              aria-label="Decrease font size"
              disabled={edit.fontSize <= MIN_MAP_TEXT_FONT_SIZE}
              type="button"
              onClick={() =>
                onFontSizeChange?.(
                  adjustMapTextFontSize(edit.fontSize!, -1, fontSizeMax),
                )
              }
              onPointerDown={(event) => event.preventDefault()}
            >
              A−
            </button>
            <button
              aria-label="Increase font size"
              disabled={edit.fontSize >= fontSizeMax}
              type="button"
              onClick={() =>
                onFontSizeChange?.(
                  adjustMapTextFontSize(edit.fontSize!, 1, fontSizeMax),
                )
              }
              onPointerDown={(event) => event.preventDefault()}
            >
              A+
            </button>
          </>
        )}
        <button
          aria-label="Close text editor"
          type="button"
          onClick={() => finish('close')}
          onPointerDown={(event) => event.preventDefault()}
        >
          ×
        </button>
      </div>
    </>
  )
}
