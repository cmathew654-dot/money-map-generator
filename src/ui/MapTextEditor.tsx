import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react'
import { parseMoneyInput } from '../model/format'
import type { AccountTextRole, MoneyMapData } from '../model/types'
import {
  accountTextOverrideKey,
  MAX_ACCOUNT_TEXT_FONT_SIZE,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  mapTextOverrideKey,
} from '../model/types'
import { addMapNote } from '../render/mapInteraction'
import { TYPE } from '../render/tokens'

export type MapTextEditTarget =
  | { kind: 'accountValue'; accountId: string }
  | { kind: 'accountLabel'; accountId: string }
  | { kind: 'accountCaption'; accountId: string }
  | { kind: 'incomeHeader' }
  | { kind: 'incomeAmount'; incomeIndex: number }
  | { kind: 'afterTaxIncome' }
  | { kind: 'needLabel' }
  | { kind: 'monthlyNeed' }
  | { kind: 'footnoteText' }
  | { kind: 'legendText' }
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
  target: MapTextEditTarget
  rect: MapTextEditRect
  rawValue: string
  fontSize?: number
  fontSizeMax?: number
  fontSizeChanged?: boolean
}

type SizeOnlyMapTextEditTarget = Extract<
  MapTextEditTarget,
  {
    kind: 'incomeHeader' | 'needLabel' | 'footnoteText' | 'legendText'
  }
>

function isSizeOnlyTarget(
  target: MapTextEditTarget,
): target is SizeOnlyMapTextEditTarget {
  return (
    target.kind === 'incomeHeader' ||
    target.kind === 'needLabel' ||
    target.kind === 'footnoteText' ||
    target.kind === 'legendText'
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
  key: string
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
    case 'incomeHeader':
      return {
        key: mapTextOverrideKey('income', 'header'),
        fallback: TYPE.panelHeader,
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
        key: mapTextOverrideKey('footnotes', 'line'),
        fallback: TYPE.footnote,
        max: MAX_MAP_TEXT_FONT_SIZE,
      }
    case 'legendText':
      return {
        key: mapTextOverrideKey('legend', 'label'),
        fallback: TYPE.legend,
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

export function mapTextEditRawValue(
  data: MoneyMapData,
  target: MapTextEditTarget,
): string {
  switch (target.kind) {
    case 'accountValue':
      return String(
        data.accounts.find((account) => account.id === target.accountId)
          ?.value ?? '',
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
    case 'incomeAmount':
      return String(data.incomeSources[target.incomeIndex]?.amount ?? '')
    case 'afterTaxIncome':
      return String(data.afterTaxIncome ?? '')
    case 'monthlyNeed':
      return String(data.monthlyNeed ?? '')
    case 'asNeededAmount':
      return String(data.asNeededAmount ?? '')
    case 'flowLabel':
      return (
        data.customArrows?.find((arrow) => arrow.id === target.arrowId)
          ?.label ?? ''
      )
    case 'noteText':
      return data.notes?.find((note) => note.id === target.noteId)?.text ?? ''
    case 'incomeHeader':
    case 'needLabel':
    case 'footnoteText':
    case 'legendText':
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
    target.kind === 'accountCaption'
  ) {
    const text = rawValue.trim()
    return {
      ...data,
      accounts: data.accounts.map((account) =>
        account.id === target.accountId
          ? target.kind === 'accountLabel'
            ? { ...account, label: text }
            : { ...account, caption: text }
          : account,
      ),
    }
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

function editorLabel(target: MapTextEditTarget): string {
  if (target.kind === 'accountLabel') return 'Edit account label'
  if (target.kind === 'accountCaption') return 'Edit account caption'
  if (target.kind === 'incomeHeader') return 'Resize income heading'
  if (target.kind === 'incomeAmount') return 'Edit income source amount'
  if (target.kind === 'afterTaxIncome') return 'Edit after-tax income'
  if (target.kind === 'needLabel') return 'Resize monthly income need label'
  if (target.kind === 'monthlyNeed') return 'Edit monthly income need'
  if (target.kind === 'footnoteText') return 'Resize fine print'
  if (target.kind === 'legendText') return 'Resize flow legend'
  if (target.kind === 'asNeededAmount') return 'Edit as-needed draw amount'
  if (target.kind === 'flowLabel') return 'Edit flow label'
  if (target.kind === 'noteText') return 'Edit map note'
  return 'Edit account value'
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
  const [rawValue, setRawValue] = useState(edit.rawValue)
  const finished = useRef(false)
  const sizeControlsRef = useRef<HTMLDivElement>(null)
  const container = containerRef.current
  const containerRect = container?.getBoundingClientRect()
  const hasFontSize = edit.fontSize !== undefined
  const sizeOnly = isSizeOnlyTarget(edit.target)
  const fontSizeMax = edit.fontSizeMax ?? MAX_ACCOUNT_TEXT_FONT_SIZE
  const width = sizeOnly
    ? 78
    : Math.max(edit.rect.width + 16, 104) + (hasFontSize ? 70 : 0)
  const height = Math.max(edit.rect.height + 10, 32)
  const style: CSSProperties = {
    left:
      edit.rect.left -
      (containerRect?.left ?? 0) +
      (container?.scrollLeft ?? 0) -
      (width - edit.rect.width) / 2,
    top:
      edit.rect.top -
      (containerRect?.top ?? 0) +
      (container?.scrollTop ?? 0) -
      (height - edit.rect.height) / 2,
    width,
    height,
  }
  const finish = (action: () => void) => {
    if (finished.current) return
    finished.current = true
    action()
  }

  useEffect(() => {
    if (sizeOnly) sizeControlsRef.current?.focus()
  }, [sizeOnly])

  return (
    <div
      className={`map-text-editor${
        edit.target.kind === 'noteText'
          ? ' is-note'
          : edit.target.kind === 'flowLabel'
            ? ' is-flow'
            : sizeOnly
              ? ' is-size-only'
              : ''
      }`}
      style={style}
    >
      {!sizeOnly && (
        <input
          autoFocus
          aria-label={editorLabel(edit.target)}
          className="map-text-editor-input"
          inputMode={
            edit.target.kind === 'accountLabel' ||
            edit.target.kind === 'accountCaption' ||
            edit.target.kind === 'flowLabel' ||
            edit.target.kind === 'noteText'
              ? 'text'
              : 'decimal'
          }
          placeholder={
            edit.target.kind === 'noteText' ? 'Add a note…' : undefined
          }
          type="text"
          value={rawValue}
          onBlur={() => finish(() => onCommit(rawValue))}
          onChange={(event) => setRawValue(event.target.value)}
          onFocus={(event) => event.currentTarget.select()}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              finish(() => onCommit(rawValue))
            } else if (event.key === 'Escape') {
              event.preventDefault()
              finish(
                edit.target.kind === 'noteText'
                  ? () => onCommit(rawValue)
                  : onCancel,
              )
            }
          }}
        />
      )}
      {edit.fontSize !== undefined && (
        <div
          ref={sizeControlsRef}
          aria-label={sizeOnly ? editorLabel(edit.target) : 'Font size'}
          className="map-text-size-controls"
          role={sizeOnly ? 'group' : undefined}
          tabIndex={sizeOnly ? 0 : undefined}
          onBlur={(event) => {
            if (
              !sizeOnly ||
              event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              return
            }
            finish(() => onCommit(rawValue))
          }}
          onKeyDown={(event) => {
            if (!sizeOnly) return
            if (event.key === 'Escape') {
              event.preventDefault()
              finish(onCancel)
            } else if (
              event.key === 'Enter' &&
              event.target === event.currentTarget
            ) {
              event.preventDefault()
              finish(() => onCommit(rawValue))
            }
          }}
        >
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
        </div>
      )}
    </div>
  )
}
