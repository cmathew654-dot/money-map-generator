import type { ReactNode } from 'react'
import {
  layoutMap,
  layoutOverrideRect,
  nudgeLayoutOverride,
  NOTE_WIDTH,
  OVERRIDE_BOUNDS,
} from '../layout/layout'
import type {
  AccountShape,
  CustomArrowColor,
  LayoutOverride,
  MoneyMapData,
} from '../model/types'
import {
  ACCOUNT_SHAPES,
  CUSTOM_ARROW_COLORS,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  accountShape,
} from '../model/types'
import {
  addCustomArrow,
  clamp,
  clampRectToBounds,
  deleteCustomArrow,
  deleteMapNote,
  hideGeneratedArrow,
  moveMapNote,
  resizeMapNote,
  setCustomArrowColor,
  setMapNoteBackground,
  withOverride,
} from './mapInteraction'
import { ARTBOARD, TYPE } from './tokens'

interface MapInspectorProps {
  data: MoneyMapData
  selectedTargetKey: string
  onChange: (data: MoneyMapData) => void
  onClose: () => void
}

const SHAPE_LABELS: Record<AccountShape, string> = {
  card: 'Card',
  drum: 'Cylinder',
  rect: 'Bucket',
  pill: 'Pill',
}

function withoutOverride(data: MoneyMapData, key: string): MoneyMapData {
  const { [key]: _removed, ...layoutOverrides } = data.layoutOverrides ?? {}
  return {
    ...data,
    layoutOverrides:
      Object.keys(layoutOverrides).length > 0 ? layoutOverrides : undefined,
  }
}

function InspectorGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="map-inspector-group" role="group" aria-label={label}>
      <span className="map-inspector-label">{label}</span>
      <div className="map-inspector-actions">{children}</div>
    </div>
  )
}

function MoveControls({ move }: { move: (x: number, y: number) => void }) {
  return (
    <InspectorGroup label="Move">
      <button aria-label="Move left" type="button" onClick={() => move(-12, 0)}>←</button>
      <button aria-label="Move up" type="button" onClick={() => move(0, -12)}>↑</button>
      <button aria-label="Move down" type="button" onClick={() => move(0, 12)}>↓</button>
      <button aria-label="Move right" type="button" onClick={() => move(12, 0)}>→</button>
    </InspectorGroup>
  )
}

function textDefaultSize(key: string): number {
  const role = key.split(':')[2]
  if (key === 'text:need:supporting') return TYPE.mathNote
  if (key.startsWith('text:need:')) return role === 'value' ? TYPE.needValue : TYPE.needLabel
  if (key.startsWith('text:income:')) return role === 'header' ? TYPE.panelHeader : role === 'total' ? TYPE.incomeTotalValue : TYPE.incomeValue
  if (key.startsWith('text:footnotes:')) return TYPE.footnote
  if (key.startsWith('text:masthead:')) return TYPE.mastheadLabel
  return role === 'value' ? TYPE.value : role === 'caption' ? TYPE.caption : role === 'rows' ? TYPE.row : role === 'sub' ? TYPE.subValue : TYPE.accountTitle
}

export function MapInspector({
  data,
  selectedTargetKey,
  onChange,
  onClose,
}: MapInspectorProps) {
  const layout = layoutMap(data)
  const accountId = selectedTargetKey.startsWith('account:')
    ? selectedTargetKey.slice('account:'.length)
    : null
  const account = accountId
    ? data.accounts.find((candidate) => candidate.id === accountId)
    : undefined
  const arrowKey = selectedTargetKey.startsWith('arrow:')
    ? selectedTargetKey
    : null
  const customArrowId = arrowKey?.startsWith('arrow:custom:')
    ? arrowKey.slice('arrow:custom:'.length)
    : null
  const customArrow = customArrowId
    ? data.customArrows?.find((candidate) => candidate.id === customArrowId)
    : undefined
  const generatedKind =
    arrowKey === 'arrow:income'
      ? 'income'
      : arrowKey === 'arrow:asNeeded'
        ? 'asNeeded'
        : null
  const arrow = arrowKey
    ? layout.arrows.find((candidate) =>
        customArrowId
          ? candidate.kind === 'custom' && candidate.id === customArrowId
          : candidate.kind === generatedKind,
      )
    : undefined
  const noteId = selectedTargetKey.startsWith('note:')
    ? selectedTargetKey.slice('note:'.length)
    : null
  const note = noteId
    ? data.notes?.find((candidate) => candidate.id === noteId)
    : undefined
  const isText = selectedTargetKey.startsWith('text:')
  const layoutKey = accountId ??
    (selectedTargetKey === 'income' || selectedTargetKey === 'need' || selectedTargetKey === 'asNeededChip' || isText
      ? selectedTargetKey
      : null)
  const endpoints = [
    { id: 'income', label: 'Income sources' },
    { id: 'need', label: 'Monthly need' },
    ...data.accounts.map((candidate) => ({ id: candidate.id, label: candidate.label })),
  ]
  const move = (x: number, y: number) => {
    if (layoutKey) onChange(nudgeLayoutOverride(data, layoutKey, { x, y }))
    else if (noteId) {
      const placed = layout.notes.find((candidate) => candidate.note.id === noteId)
      if (!placed) return
      const next = clampRectToBounds(
        { ...placed, x: placed.x + x, y: placed.y + y },
        OVERRIDE_BOUNDS,
      )
      onChange(moveMapNote(data, noteId, next.x, next.y))
    }
  }
  const resize = (key: string, amount: number) => {
    const placed = layoutOverrideRect(data, key)
    if (!placed) return
    onChange(withOverride(data, key, {
      w: placed.w + amount,
      h: placed.h + amount,
    }))
  }
  const resetArrow = () => {
    if (!arrowKey) return
    let next = withoutOverride(data, arrowKey)
    if (customArrowId) {
      next = {
        ...next,
        customArrows: next.customArrows?.map((candidate) =>
          candidate.id === customArrowId
            ? { ...candidate, style: 'dotted', color: undefined }
            : candidate,
        ),
      }
    }
    onChange(next)
  }
  const setArrowAppearance = (
    patch: Pick<LayoutOverride, 'style' | 'color'>,
  ) => {
    if (!arrowKey) return
    if (customArrowId) {
      if (patch.color) onChange(setCustomArrowColor(data, customArrowId, patch.color))
      else if (patch.style) {
        onChange({
          ...data,
          customArrows: data.customArrows?.map((candidate) =>
            candidate.id === customArrowId
              ? {
                  ...candidate,
                  style: patch.style!,
                  color:
                    candidate.color ??
                    (candidate.style === 'solid' ? 'ink' : 'green'),
                }
              : candidate,
          ),
        })
      }
      return
    }
    onChange(withOverride(data, arrowKey, patch))
  }
  const title = account?.label ??
    (selectedTargetKey === 'income' ? 'Income sources' : undefined) ??
    (selectedTargetKey === 'need' ? 'Monthly income need' : undefined) ??
    (selectedTargetKey === 'asNeededChip' ? 'As-needed label' : undefined) ??
    (arrow ? `${arrow.kind === 'asNeeded' ? 'As-needed' : arrow.kind} flow` : undefined) ??
    (note ? note.text : undefined) ??
    (isText ? selectedTargetKey.split(':').slice(1).join(' ') : 'Map item')

  if (!account && !layoutKey && !arrow && !note) return null

  return (
    <section className="map-inspector" aria-label={`Adjust ${title}`}>
      <div className="map-inspector-heading">
        <div><span>Selected</span><strong>{title}</strong></div>
        <button aria-label="Close inspector" type="button" onClick={onClose}>×</button>
      </div>
      <div className="map-inspector-controls">
        {(layoutKey || note) && <MoveControls move={move} />}

        {account && (
          <>
            <label className="map-inspector-field">Shape
              <select
                aria-label="Shape"
                value={accountShape(account)}
                onChange={(event) => onChange({
                  ...data,
                  accounts: data.accounts.map((candidate) =>
                    candidate.id === account.id
                      ? { ...candidate, shape: event.target.value as AccountShape }
                      : candidate,
                  ),
                })}
              >
                {ACCOUNT_SHAPES.map((shape) => <option key={shape} value={shape}>{SHAPE_LABELS[shape]}</option>)}
              </select>
            </label>
            <InspectorGroup label="Size">
              <button aria-label="Decrease size" type="button" onClick={() => resize(account.id, -12)}>−</button>
              <button aria-label="Increase size" type="button" onClick={() => resize(account.id, 12)}>+</button>
            </InspectorGroup>
            <InspectorGroup label="Rotate">
              <button aria-label="Rotate counterclockwise" type="button" onClick={() => onChange(withOverride(data, account.id, { rot: (layout.accounts.find((candidate) => candidate.account.id === account.id)?.rot ?? 0) - 15 }))}>↺</button>
              <button aria-label="Rotate clockwise" type="button" onClick={() => onChange(withOverride(data, account.id, { rot: (layout.accounts.find((candidate) => candidate.account.id === account.id)?.rot ?? 0) + 15 }))}>↻</button>
            </InspectorGroup>
          </>
        )}

        {(account || selectedTargetKey === 'income' || selectedTargetKey === 'need') && (
          <label className="map-inspector-field">Connect to
            <select
              aria-label="Connect to"
              defaultValue=""
              onChange={(event) => {
                if (!event.target.value) return
                onChange(addCustomArrow(data, accountId ?? selectedTargetKey, event.target.value))
                event.target.value = ''
              }}
            >
              <option value="">Choose…</option>
              {endpoints.filter((endpoint) => endpoint.id !== (accountId ?? selectedTargetKey)).map((endpoint) => <option key={endpoint.id} value={endpoint.id}>{endpoint.label}</option>)}
            </select>
          </label>
        )}

        {(selectedTargetKey === 'income' || selectedTargetKey === 'need') && (
          <InspectorGroup label="Size">
            <button aria-label="Decrease size" type="button" onClick={() => resize(selectedTargetKey, -12)}>−</button>
            <button aria-label="Increase size" type="button" onClick={() => resize(selectedTargetKey, 12)}>+</button>
          </InspectorGroup>
        )}

        {arrow && arrowKey && (
          <>
            <label className="map-inspector-field">Style
              <select aria-label="Style" value={arrow.style ?? (arrow.kind === 'asNeeded' ? 'dashed' : 'solid')} onChange={(event) => setArrowAppearance({ style: event.target.value as LayoutOverride['style'] })}>
                <option value="dotted">Dotted</option><option value="dashed">Dashed</option><option value="solid">Solid</option>
              </select>
            </label>
            <label className="map-inspector-field">Color
              <select aria-label="Color" value={arrow.color ?? (arrow.kind === 'custom' && arrow.style === 'solid' ? 'ink' : 'green')} onChange={(event) => setArrowAppearance({ color: event.target.value as CustomArrowColor })}>
                {CUSTOM_ARROW_COLORS.map((color) => <option key={color} value={color}>{color[0].toUpperCase() + color.slice(1)}</option>)}
              </select>
            </label>
            <InspectorGroup label="Bend">
              <button aria-label="Decrease bend" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow - 12 }))}>−</button>
              <button aria-label="Increase bend" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow + 12 }))}>+</button>
            </InspectorGroup>
            {customArrow && (
              <>
                {(['sourceId', 'targetId'] as const).map((field) => (
                  <label className="map-inspector-field" key={field}>{field === 'sourceId' ? 'Source' : 'Target'}
                    <select
                      aria-label={field === 'sourceId' ? 'Source' : 'Target'}
                      value={customArrow[field]}
                      onChange={(event) => onChange({
                        ...data,
                        customArrows: data.customArrows?.map((candidate) =>
                          candidate.id === customArrow.id
                            ? { ...candidate, [field]: event.target.value }
                            : candidate,
                        ),
                      })}
                    >
                      {endpoints.filter((endpoint) => endpoint.id !== customArrow[field === 'sourceId' ? 'targetId' : 'sourceId']).map((endpoint) => <option key={endpoint.id} value={endpoint.id}>{endpoint.label}</option>)}
                    </select>
                  </label>
                ))}
              </>
            )}
          </>
        )}

        {note && noteId && (
          <>
            <InspectorGroup label="Size">
              <button aria-label="Decrease note size" type="button" onClick={() => onChange(resizeMapNote(data, noteId, (layout.notes.find((candidate) => candidate.note.id === noteId)?.w ?? NOTE_WIDTH) - 24))}>−</button>
              <button aria-label="Increase note size" type="button" onClick={() => onChange(resizeMapNote(data, noteId, (layout.notes.find((candidate) => candidate.note.id === noteId)?.w ?? NOTE_WIDTH) + 24))}>+</button>
            </InspectorGroup>
            <InspectorGroup label="Background">
              <button aria-pressed={Boolean(note.bg)} type="button" onClick={() => onChange(setMapNoteBackground(data, noteId, !note.bg))}>{note.bg ? 'On' : 'Off'}</button>
            </InspectorGroup>
          </>
        )}

        {isText && layoutKey && (
          <InspectorGroup label="Font size">
            {([-2, 2] as const).map((amount) => (
              <button key={amount} aria-label={amount < 0 ? 'Decrease font size' : 'Increase font size'} type="button" onClick={() => onChange(withOverride(data, layoutKey, { fs: clamp((data.layoutOverrides?.[layoutKey]?.fs ?? textDefaultSize(layoutKey)) + amount, MIN_MAP_TEXT_FONT_SIZE, MAX_MAP_TEXT_FONT_SIZE) }))}>{amount < 0 ? '−' : '+'}</button>
            ))}
          </InspectorGroup>
        )}

        <InspectorGroup label="Reset">
          <button type="button" onClick={() => {
            if (arrowKey) resetArrow()
            else if (noteId) onChange({
              ...moveMapNote(data, noteId, (ARTBOARD.width - NOTE_WIDTH) / 2, ARTBOARD.height / 2),
              notes: data.notes?.map((candidate) => candidate.id === noteId ? { ...candidate, x: (ARTBOARD.width - NOTE_WIDTH) / 2, y: ARTBOARD.height / 2, w: undefined, bg: undefined, fs: undefined } : candidate),
            })
            else if (layoutKey) onChange(withoutOverride(data, layoutKey))
          }}>Reset</button>
        </InspectorGroup>

        {customArrowId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteCustomArrow(data, customArrowId)); onClose() }}>Delete flow</button>}
        {generatedKind && <button className="map-inspector-danger" type="button" onClick={() => { onChange(hideGeneratedArrow(data, generatedKind)); onClose() }}>Hide flow</button>}
        {noteId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteMapNote(data, noteId)); onClose() }}>Delete note</button>}
      </div>
    </section>
  )
}
