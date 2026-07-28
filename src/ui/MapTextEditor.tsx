import { useRef, useState, type CSSProperties, type RefObject } from 'react'
import { parseMoneyInput } from '../model/format'
import type { MoneyMapData } from '../model/types'
import { addMapNote } from '../render/mapInteraction'

export type MapTextEditTarget =
  | { kind: 'accountValue'; accountId: string }
  | { kind: 'accountLabel'; accountId: string }
  | { kind: 'incomeAmount'; incomeIndex: number }
  | { kind: 'monthlyNeed' }
  | { kind: 'asNeededAmount' }
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
    case 'incomeAmount':
      return String(data.incomeSources[target.incomeIndex]?.amount ?? '')
    case 'monthlyNeed':
      return String(data.monthlyNeed ?? '')
    case 'asNeededAmount':
      return String(data.asNeededAmount ?? '')
    case 'noteText':
      return data.notes?.find((note) => note.id === target.noteId)?.text ?? ''
  }
}

export function applyMapTextEdit(
  data: MoneyMapData,
  target: MapTextEditTarget,
  rawValue: string | null,
): MoneyMapData {
  if (rawValue === null) return data
  if (target.kind === 'accountLabel') {
    const label = rawValue.trim()
    return {
      ...data,
      accounts: data.accounts.map((account) =>
        account.id === target.accountId ? { ...account, label } : account,
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
    case 'monthlyNeed':
      return { ...data, monthlyNeed: value }
    case 'asNeededAmount':
      return { ...data, asNeededAmount: value }
  }
}

function editorLabel(target: MapTextEditTarget): string {
  if (target.kind === 'accountLabel') return 'Edit account label'
  if (target.kind === 'incomeAmount') return 'Edit income source amount'
  if (target.kind === 'monthlyNeed') return 'Edit monthly income need'
  if (target.kind === 'asNeededAmount') return 'Edit as-needed draw amount'
  if (target.kind === 'noteText') return 'Edit map note'
  return 'Edit account value'
}

export function MapTextEditor({
  edit,
  containerRef,
  onCancel,
  onCommit,
}: {
  edit: ActiveMapTextEdit
  containerRef: RefObject<HTMLElement | null>
  onCancel(): void
  onCommit(rawValue: string): void
}) {
  const [rawValue, setRawValue] = useState(edit.rawValue)
  const finished = useRef(false)
  const container = containerRef.current
  const containerRect = container?.getBoundingClientRect()
  const width = Math.max(edit.rect.width + 16, 104)
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

  return (
    <input
      autoFocus
      aria-label={editorLabel(edit.target)}
      className={`map-text-editor${
        edit.target.kind === 'noteText' ? ' is-note' : ''
      }`}
      inputMode={
        edit.target.kind === 'accountLabel' ||
        edit.target.kind === 'noteText'
          ? 'text'
          : 'decimal'
      }
      placeholder={edit.target.kind === 'noteText' ? 'Add a note…' : undefined}
      style={style}
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
  )
}
