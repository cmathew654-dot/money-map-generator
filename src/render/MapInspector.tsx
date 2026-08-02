import type { ReactNode } from 'react'
import {
  layoutMap,
  layoutOverrideRect,
  nudgeLayoutOverride,
  NOTE_WIDTH,
  OVERRIDE_BOUNDS,
  rotatedBounds,
} from '../layout/layout'
import type {
  AccountShape,
  Bucket,
  LayoutOverride,
  MoneyMapData,
} from '../model/types'
import {
  ACCOUNT_TYPE_OPTIONS,
  changeAccountBucket,
} from '../model/book'
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
  duplicateMapAccount,
  duplicateMapNote,
  hideGeneratedArrow,
  moveCustomArrowLabel,
  moveMapNote,
  resizeMapNote,
  retargetCustomArrow,
  resetTextPosition,
  setCustomArrowColor,
  setMapNoteBackground,
  withOverride,
} from './mapInteraction'
import { ARROW_COLORS, ARTBOARD, TYPE } from './tokens'

interface MapInspectorProps {
  data: MoneyMapData
  selectedTargetKey: string
  onChange: (data: MoneyMapData) => void
  onClose: () => void
  onDetails?: () => void
  onSelect: (key: string) => void
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

function MoveControls({
  label = 'Move',
  move,
}: {
  label?: string
  move: (x: number, y: number) => void
}) {
  return (
    <InspectorGroup label={label}>
      <button aria-label={`${label} left`} type="button" onClick={() => move(-12, 0)}>←</button>
      <button aria-label={`${label} up`} type="button" onClick={() => move(0, -12)}>↑</button>
      <button aria-label={`${label} down`} type="button" onClick={() => move(0, 12)}>↓</button>
      <button aria-label={`${label} right`} type="button" onClick={() => move(12, 0)}>→</button>
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

function textTargetTitle(data: MoneyMapData, key: string): string {
  const [, element, role, itemId] = key.split(':')
  if (element === 'need') {
    return role === 'supporting'
      ? 'Coverage note'
      : role === 'value'
        ? 'Monthly need amount'
        : 'Monthly need heading'
  }
  if (element === 'income') {
    if (role === 'header') return 'Income heading'
    if (role === 'total') return 'After-tax income'
    const source = data.incomeSources.find((candidate) => candidate.id === itemId)
    return source ? `Income amount for ${source.label}` : 'Income amount'
  }
  if (element === 'footnotes') {
    const footnote = data.footnotes.find((candidate) => candidate.id === itemId)
    return footnote ? `Footnote for ${footnote.label}` : 'Footnote'
  }
  if (element === 'masthead') return 'Map heading'
  const account = data.accounts.find((candidate) => candidate.id === element)
  const roleLabel = {
    label: 'Account name',
    caption: 'Supporting note',
    value: 'Account value',
    rows: 'Account details',
    sub: 'Subaccount details',
  }[role] ?? 'Account text'
  return account ? `${roleLabel} for ${account.label}` : roleLabel
}

export function MapInspector({
  data,
  selectedTargetKey,
  onChange,
  onClose,
  onDetails,
  onSelect,
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
  const resolvedArrowColor =
    arrow?.color ??
    (arrow?.kind === 'custom' && arrow.style === 'solid' ? 'ink' : 'green')
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
  const endpointLabel = (id: string) =>
    endpoints.find((endpoint) => endpoint.id === id)?.label ?? 'Map item'
  const outlineFor = (id: string) =>
    id === 'income'
      ? layout.income
      : id === 'need'
        ? layout.need
        : layout.accounts.find((candidate) => candidate.account.id === id)
  const tidyKey = accountId ??
    (selectedTargetKey === 'income' || selectedTargetKey === 'need'
      ? selectedTargetKey
      : null)
  const tidyRect = tidyKey
    ? layoutOverrideRect(data, tidyKey)
    : noteId
      ? layout.notes.find((candidate) => candidate.note.id === noteId)
      : undefined
  const tidyCandidates = [
    { key: 'income', rect: layout.income },
    { key: 'need', rect: layout.need },
    ...layout.accounts.map((rect) => ({ key: rect.account.id, rect })),
    ...layout.notes.map((rect) => ({ key: rect.note.id, rect })),
    { key: 'asNeededChip', rect: layoutOverrideRect(data, 'asNeededChip') },
  ].flatMap((candidate) =>
    candidate.key === (tidyKey ?? noteId) || !candidate.rect
      ? []
      : [candidate.rect],
  )
  const duplicate = () => {
    const sourceAccount = accountId
      ? layout.accounts.find((placed) => placed.account.id === accountId)
      : undefined
    const sourceRect = sourceAccount
      ? rotatedBounds(sourceAccount, sourceAccount.rot)
      : tidyRect
    if (!sourceRect) return
    const duplicateCandidates = accountId
      ? [
          layout.income,
          layout.need,
          ...layout.accounts.flatMap((placed) =>
            placed.account.id === accountId
              ? []
              : [rotatedBounds(placed, placed.rot)],
          ),
          ...layout.notes,
          ...[layoutOverrideRect(data, 'asNeededChip')].flatMap((rect) =>
            rect ? [rect] : [],
          ),
        ]
      : tidyCandidates
    const result = accountId
      ? duplicateMapAccount(
          data,
          accountId,
          sourceRect,
          duplicateCandidates,
          OVERRIDE_BOUNDS,
        )
      : noteId
        ? duplicateMapNote(
            data,
            noteId,
            sourceRect,
            tidyCandidates,
            OVERRIDE_BOUNDS,
          )
        : null
    if (!result) return
    const copyId = result.targetKey.slice('account:'.length)
    let next = result.data
    if (accountId) {
      for (let pass = 0; pass < 8; pass += 1) {
        const placed = layoutMap(next).accounts.find(
          (candidate) => candidate.account.id === copyId,
        )
        if (!placed) break
        const rect = rotatedBounds(placed, placed.rot)
        const dx = result.rect.x - rect.x
        const dy = result.rect.y - rect.y
        if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) break
        const override = next.layoutOverrides?.[copyId]
        next = withOverride(next, copyId, {
          dx: (override?.dx ?? 0) + dx,
          dy: (override?.dy ?? 0) + dy,
        })
      }
    }
    onChange(next)
    onSelect(result.targetKey)
  }
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
  const nudgeArrowEndpoint = (
    endpoint: 'start' | 'end',
    x: number,
    y: number,
  ) => {
    if (!arrow || !arrowKey) return
    const endpointId =
      endpoint === 'start'
        ? customArrow?.sourceId ??
          (generatedKind === 'income' ? 'income' : arrow.sourceId)
        : customArrow?.targetId ?? 'need'
    if (!endpointId) return
    const outline = outlineFor(endpointId)
    if (!outline) return
    const point = endpoint === 'start' ? arrow.start : arrow.end
    const next = clampRectToBounds(
      { x: point.x + x, y: point.y + y, w: 0, h: 0 },
      OVERRIDE_BOUNDS,
    )
    onChange(withOverride(data, arrowKey, {
      [endpoint === 'start' ? 'startAt' : 'endAt']: {
        dx: next.x - (outline.x + outline.w / 2),
        dy: next.y - (outline.y + outline.h / 2),
      },
    }))
  }
  const nudgeArrowLabel = (x: number, y: number) => {
    if (!customArrow || !arrow?.labelAt) return
    const next = clampRectToBounds(
      { x: arrow.labelAt.x + x, y: arrow.labelAt.y + y, w: 0, h: 0 },
      OVERRIDE_BOUNDS,
    )
    onChange(moveCustomArrowLabel(
      data,
      customArrow.id,
      (customArrow.labelDx ?? 0) + next.x - arrow.labelAt.x,
      (customArrow.labelDy ?? 0) + next.y - arrow.labelAt.y,
    ))
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
    onChange(withOverride(
      data,
      arrowKey,
      patch.style ? { ...patch, color: resolvedArrowColor } : patch,
    ))
  }
  const title = account?.label ??
    (selectedTargetKey === 'income' ? 'Income sources' : undefined) ??
    (selectedTargetKey === 'need' ? 'Monthly income need' : undefined) ??
    (selectedTargetKey === 'asNeededChip' ? 'As-needed label' : undefined) ??
    (customArrow ? `Flow from ${endpointLabel(customArrow.sourceId)} to ${endpointLabel(customArrow.targetId)}` : undefined) ??
    (generatedKind === 'income' ? 'Flow from Income sources to Monthly need' : undefined) ??
    (generatedKind === 'asNeeded' ? `Flow from ${endpointLabel(arrow?.sourceId ?? '')} to Monthly need` : undefined) ??
    (note ? note.text : undefined) ??
    (isText ? textTargetTitle(data, selectedTargetKey) : 'Map item')
  const canOpenDetails =
    Boolean(onDetails) &&
    Boolean(account || note || selectedTargetKey === 'income' || selectedTargetKey === 'need')

  if (!account && !layoutKey && !arrow && !note) return null

  return (
    <section className="map-inspector" aria-label={`Adjust ${title}`}>
      <div className="map-inspector-heading">
        <div><span>Selected</span><strong>{title}</strong></div>
        {canOpenDetails && <button aria-label="Details" type="button" onClick={onDetails}>Details</button>}
        <button aria-label="Close inspector" type="button" onClick={onClose}>×</button>
      </div>
      <div className="map-inspector-controls">
        {(layoutKey || note) && <MoveControls move={move} />}
        {(account || note) && <button type="button" onClick={duplicate}>Duplicate</button>}

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
            <label className="map-inspector-field">Account type
              <select
                aria-label="Account type"
                value={account.bucket}
                onChange={(event) => onChange({
                  ...data,
                  accounts: data.accounts.map((candidate) =>
                    candidate.id === account.id
                      ? changeAccountBucket(
                          candidate,
                          event.target.value as Bucket,
                        )
                      : candidate,
                  ),
                })}
              >
                {ACCOUNT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
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
          <label className="map-inspector-field">Add flow to
            <select
              aria-label="Add flow to"
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
            <InspectorGroup label="Color">
              {CUSTOM_ARROW_COLORS.map((color) => (
                <button
                  aria-label={`${color[0].toUpperCase() + color.slice(1)} flow color`}
                  aria-pressed={resolvedArrowColor === color}
                  className="map-inspector-color"
                  key={color}
                  style={{ backgroundColor: ARROW_COLORS[color] }}
                  title={color[0].toUpperCase() + color.slice(1)}
                  type="button"
                  onClick={() => setArrowAppearance({ color })}
                />
              ))}
            </InspectorGroup>
            <InspectorGroup label="Curve">
              <button aria-label="Decrease curve" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow - 12 }))}>−</button>
              <button aria-label="Increase curve" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow + 12 }))}>+</button>
            </InspectorGroup>
            <MoveControls label="Start point" move={(x, y) => nudgeArrowEndpoint('start', x, y)} />
            <MoveControls label="End point" move={(x, y) => nudgeArrowEndpoint('end', x, y)} />
            {customArrow?.label && arrow.labelAt && (
              <MoveControls label="Label position" move={nudgeArrowLabel} />
            )}
            {customArrow && (
              <>
                {(['sourceId', 'targetId'] as const).map((field) => (
                  <label className="map-inspector-field" key={field}>{field === 'sourceId' ? 'From' : 'To'}
                    <select
                      aria-label={field === 'sourceId' ? 'From' : 'To'}
                      value={customArrow[field]}
                      onChange={(event) => onChange(
                        retargetCustomArrow(
                          data,
                          customArrow.id,
                          field,
                          event.target.value,
                        ),
                      )}
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

        <InspectorGroup label={arrowKey ? 'Reset flow' : noteId ? 'Reset note' : isText ? 'Reset text position' : 'Reset item'}>
          <button type="button" onClick={() => {
            if (arrowKey) resetArrow()
            else if (noteId) onChange({
              ...moveMapNote(data, noteId, (ARTBOARD.width - NOTE_WIDTH) / 2, ARTBOARD.height / 2),
              notes: data.notes?.map((candidate) => candidate.id === noteId ? { ...candidate, x: (ARTBOARD.width - NOTE_WIDTH) / 2, y: ARTBOARD.height / 2, w: undefined, bg: undefined, fs: undefined } : candidate),
            })
            else if (layoutKey) onChange(isText ? resetTextPosition(data, layoutKey) : withoutOverride(data, layoutKey))
          }}>{arrowKey ? 'Reset flow' : noteId ? 'Reset note' : isText ? 'Reset text position' : 'Reset item'}</button>
        </InspectorGroup>

        {customArrowId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteCustomArrow(data, customArrowId)); onClose() }}>Delete flow</button>}
        {generatedKind && <button className="map-inspector-danger" type="button" onClick={() => { onChange(hideGeneratedArrow(data, generatedKind)); onClose() }}>Hide flow</button>}
        {noteId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteMapNote(data, noteId)); onClose() }}>Delete note</button>}
      </div>
    </section>
  )
}
