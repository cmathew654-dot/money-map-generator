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
  CustomArrowColor,
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
  DEFAULT_CUSTOM_ARROW_WIDTH,
  MAP_NOTE_FONTS,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  accountShape,
} from '../model/types'
import {
  addCustomArrow,
  alignMapItems,
  clamp,
  clampRectToBounds,
  deleteCustomArrow,
  deleteMapAccount,
  deleteMapNote,
  distributeMapItems,
  duplicateMapAccount,
  duplicateMapNote,
  hideGeneratedArrow,
  moveCustomArrowLabel,
  moveMapNote,
  retargetCustomArrow,
  resetTextPosition,
  setCustomArrowColor,
  setCustomArrowLabel,
  setCustomArrowWidth,
  setMapNoteBackground,
  setMapNoteFont,
  setMapNoteFontSize,
  withOverride,
} from './mapInteraction'
import { ARROW_COLORS, ARTBOARD, TYPE } from './tokens'

interface MapInspectorProps {
  data: MoneyMapData
  selectedTargetKey: string
  selectedTargetKeys?: readonly string[]
  onChange: (data: MoneyMapData) => void
  onClose: () => void
  onDetails?: () => void
  onSelect: (key: string) => void
}

const FLOW_COLOR_POPOVER_ID = 'map-inspector-flow-colors'

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

function setNoteColor(data: MoneyMapData, id: string, color: CustomArrowColor | undefined): MoneyMapData {
  const key = `note:${id}`
  if (color) return withOverride(data, key, { color })
  const existing = data.layoutOverrides?.[key]
  if (!existing) return data
  const { color: _removed, ...rest } = existing
  if (Object.keys(rest).length === 0) return withoutOverride(data, key)
  return { ...data, layoutOverrides: { ...data.layoutOverrides, [key]: rest } }
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

function RotateControls({ rot, apply }: { rot: number; apply: (rot: number) => void }) {
  return (
    <InspectorGroup label="Rotate">
      <button aria-label="Rotate counterclockwise" type="button" onClick={() => apply(rot - 15)}>↺</button>
      <button aria-label="Rotate clockwise" type="button" onClick={() => apply(rot + 15)}>↻</button>
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
  selectedTargetKeys,
  onChange,
  onClose,
  onDetails,
  onSelect,
}: MapInspectorProps) {
  const selectionKeys = selectedTargetKeys?.length
    ? selectedTargetKeys
    : [selectedTargetKey]
  const compatibleSelectionKeys = selectionKeys.filter(
    (key): key is `account:${string}` | `note:${string}` =>
      key.startsWith('account:') || key.startsWith('note:'),
  )
  const multiSelection = compatibleSelectionKeys.length > 1
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
  const noteColor = noteId ? data.layoutOverrides?.[`note:${noteId}`]?.color : undefined
  const isText = selectedTargetKey.startsWith('text:')
  const layoutKey = accountId ??
    (selectedTargetKey === 'income' || selectedTargetKey === 'need' || selectedTargetKey === 'asNeededChip' || isText
      ? selectedTargetKey
      : null)
  const rotKey =
    selectedTargetKey === 'asNeededChip' ||
    noteId ||
    selectedTargetKey.startsWith('text:footnotes:')
      ? selectedTargetKey
      : null
  const endpoints = [
    { id: 'income', label: 'Income sources' },
    { id: 'need', label: 'Monthly need' },
    ...data.accounts.map((candidate) => ({ id: candidate.id, label: candidate.label })),
  ]
  const endpointLabel = (id: string) =>
    endpoints.find((endpoint) => endpoint.id === id)?.label ?? 'Map item'
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
            ? { ...candidate, style: 'dotted', color: undefined, sw: undefined }
            : candidate,
        ),
      }
    }
    onChange(next)
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
  const title = multiSelection
    ? `${compatibleSelectionKeys.length} map items selected`
    : account?.label ??
    (selectedTargetKey === 'income' ? 'Income sources' : undefined) ??
    (selectedTargetKey === 'need' ? 'Monthly income need' : undefined) ??
    (selectedTargetKey === 'asNeededChip' ? 'As-needed label' : undefined) ??
    (customArrow ? `Flow from ${endpointLabel(customArrow.sourceId)} to ${endpointLabel(customArrow.targetId)}` : undefined) ??
    (generatedKind === 'income' ? 'Flow from Income sources to Monthly need' : undefined) ??
    (generatedKind === 'asNeeded' ? `Flow from ${endpointLabel(arrow?.sourceId ?? '')} to Monthly need` : undefined) ??
    (note ? note.text : undefined) ??
    (isText ? textTargetTitle(data, selectedTargetKey) : 'Map item')
  const canOpenDetails =
    !multiSelection &&
    Boolean(onDetails) &&
    Boolean(account || note || selectedTargetKey === 'income' || selectedTargetKey === 'need')

  if (!multiSelection && !account && !layoutKey && !arrow && !note) return null

  return (
    <section className="map-inspector" aria-label={`Adjust ${title}`}>
      <div className="map-inspector-heading">
        <div><span>Selected</span><strong>{title}</strong></div>
        {canOpenDetails && <button aria-label="Details" type="button" onClick={onDetails}>Details</button>}
        <button aria-label="Close inspector" title="Close" type="button" onClick={onClose}>×</button>
      </div>
      <div className="map-inspector-controls">
        {multiSelection && (
          <>
            <InspectorGroup label='Align'>
              <button aria-label='Align left' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'left'))}>Left</button>
              <button aria-label='Align center' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'center'))}>Center</button>
              <button aria-label='Align right' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'right'))}>Right</button>
              <button aria-label='Align top' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'top'))}>Top</button>
              <button aria-label='Align middle' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'middle'))}>Middle</button>
              <button aria-label='Align bottom' type='button' onClick={() => onChange(alignMapItems(data, compatibleSelectionKeys, 'bottom'))}>Bottom</button>
            </InspectorGroup>
            <InspectorGroup label='Distribute'>
              <button aria-label='Distribute horizontally' disabled={compatibleSelectionKeys.length < 3} type='button' onClick={() => onChange(distributeMapItems(data, compatibleSelectionKeys, 'horizontal'))}>Horizontal</button>
              <button aria-label='Distribute vertically' disabled={compatibleSelectionKeys.length < 3} type='button' onClick={() => onChange(distributeMapItems(data, compatibleSelectionKeys, 'vertical'))}>Vertical</button>
            </InspectorGroup>
          </>
        )}
        {!multiSelection && <>
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
            <RotateControls
              rot={layout.accounts.find((candidate) => candidate.account.id === account.id)?.rot ?? 0}
              apply={(rot) => onChange(withOverride(data, account.id, { rot }))}
            />
          </>
        )}

        {(selectedTargetKey === 'income' || selectedTargetKey === 'need') && (
          <InspectorGroup label="Size">
            <button aria-label="Decrease size" type="button" onClick={() => resize(selectedTargetKey, -12)}>−</button>
            <button aria-label="Increase size" type="button" onClick={() => resize(selectedTargetKey, 12)}>+</button>
          </InspectorGroup>
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

        {arrow && arrowKey && (
          <>
            <label className="map-inspector-field">Style
              <select aria-label="Style" value={arrow.style ?? (arrow.kind === 'asNeeded' ? 'dashed' : 'solid')} onChange={(event) => setArrowAppearance({ style: event.target.value as LayoutOverride['style'] })}>
                <option value="dotted">Dotted</option><option value="dashed">Dashed</option><option value="solid">Solid</option>
              </select>
            </label>
            <InspectorGroup label="Color">
              <button
                aria-label="Flow color"
                className="map-inspector-color"
                popoverTarget={FLOW_COLOR_POPOVER_ID}
                style={{ backgroundColor: ARROW_COLORS[resolvedArrowColor] }}
                title={`${resolvedArrowColor[0].toUpperCase() + resolvedArrowColor.slice(1)} — pick a flow color`}
                type="button"
              />
              <div className="map-inspector-swatches" id={FLOW_COLOR_POPOVER_ID} popover="auto">
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
              </div>
            </InspectorGroup>
            {customArrow && (
              <InspectorGroup label="Thickness">
                {([-1, 1] as const).map((amount) => (
                  <button
                    aria-label={amount < 0 ? 'Decrease flow thickness' : 'Increase flow thickness'}
                    key={amount}
                    type="button"
                    onClick={() => onChange(setCustomArrowWidth(
                      data,
                      customArrow.id,
                      (customArrow.sw ?? DEFAULT_CUSTOM_ARROW_WIDTH) + amount,
                    ))}
                  >{amount < 0 ? '−' : '+'}</button>
                ))}
              </InspectorGroup>
            )}
            <InspectorGroup label="Curve">
              <button aria-label="Decrease curve" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow - 12 }))}>−</button>
              <button aria-label="Increase curve" type="button" onClick={() => onChange(withOverride(data, arrowKey, { bow: arrow.bow + 12 }))}>+</button>
            </InspectorGroup>
            {customArrow && (
              <>
                <label className="map-inspector-field">Label
                  <input
                    aria-label="Label"
                    defaultValue={customArrow.label ?? ''}
                    key={`${customArrow.id}:${customArrow.label ?? ''}`}
                    placeholder="Name this flow"
                    type="text"
                    onBlur={(event) => onChange(setCustomArrowLabel(data, customArrow.id, event.target.value))}
                    onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }}
                  />
                </label>
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
            {customArrow?.label && arrow.labelAt && (
              <MoveControls label="Label position" move={nudgeArrowLabel} />
            )}
          </>
        )}

        {note && noteId && (
          <>
            <InspectorGroup label="Size">
              <button aria-label="Decrease note size" type="button" onClick={() => onChange(setMapNoteFontSize(data, noteId, (note.fs ?? TYPE.note) - 2))}>−</button>
              <button aria-label="Increase note size" type="button" onClick={() => onChange(setMapNoteFontSize(data, noteId, (note.fs ?? TYPE.note) + 2))}>+</button>
            </InspectorGroup>
            <InspectorGroup label="Color">
              {CUSTOM_ARROW_COLORS.map((color) => (
                <button
                  aria-label={`${color[0].toUpperCase() + color.slice(1)} note color`}
                  aria-pressed={noteColor === color}
                  className="map-inspector-color"
                  key={color}
                  style={{ backgroundColor: ARROW_COLORS[color] }}
                  title={color[0].toUpperCase() + color.slice(1)}
                  type="button"
                  onClick={() => onChange(setNoteColor(data, noteId, color))}
                />
              ))}
              <button
                aria-label="Clear note color"
                aria-pressed={noteColor === undefined}
                className="map-inspector-color"
                title="None"
                type="button"
                onClick={() => onChange(setNoteColor(data, noteId, undefined))}
              />
            </InspectorGroup>
            <InspectorGroup label="Background">
              <button aria-pressed={Boolean(note.bg)} type="button" onClick={() => onChange(setMapNoteBackground(data, noteId, !note.bg))}>{note.bg ? 'On' : 'Off'}</button>
            </InspectorGroup>
            <InspectorGroup label="Font">
              {MAP_NOTE_FONTS.map((font) => (
                <button key={font} aria-pressed={(note.font ?? 'serif') === font} type="button" onClick={() => onChange(setMapNoteFont(data, noteId, font))}>{font === 'serif' ? 'Serif' : 'Sans'}</button>
              ))}
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

        {rotKey && (
          <RotateControls
            rot={data.layoutOverrides?.[rotKey]?.rot ?? 0}
            apply={(rot) => onChange(withOverride(data, rotKey, { rot }))}
          />
        )}

        {(layoutKey || note) && <MoveControls move={move} />}
        {(account || note) && <button type="button" onClick={duplicate}>Duplicate</button>}

        <span aria-hidden="true" className="map-inspector-divider" />

        <InspectorGroup label={arrowKey ? 'Reset flow' : noteId ? 'Reset note' : isText ? 'Reset text position' : 'Reset item'}>
          <button type="button" onClick={() => {
            if (arrowKey) resetArrow()
            else if (noteId) onChange({
              ...moveMapNote(withOverride(data, `note:${noteId}`, { rot: 0 }), noteId, (ARTBOARD.width - NOTE_WIDTH) / 2, ARTBOARD.height / 2),
              notes: data.notes?.map((candidate) => candidate.id === noteId ? { ...candidate, x: (ARTBOARD.width - NOTE_WIDTH) / 2, y: ARTBOARD.height / 2, w: undefined, bg: undefined, fs: undefined, font: undefined } : candidate),
            })
            else if (layoutKey) onChange(isText ? resetTextPosition(data, layoutKey) : withoutOverride(data, layoutKey))
          }}>{arrowKey ? 'Reset flow' : noteId ? 'Reset note' : isText ? 'Reset text position' : 'Reset item'}</button>
        </InspectorGroup>

        {customArrowId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteCustomArrow(data, customArrowId)); onClose() }}>Delete flow</button>}
        {generatedKind && <button className="map-inspector-danger" type="button" onClick={() => { onChange(hideGeneratedArrow(data, generatedKind)); onClose() }}>Hide flow</button>}
        {noteId && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteMapNote(data, noteId)); onClose() }}>Delete note</button>}
        {account && <button className="map-inspector-danger" type="button" onClick={() => { onChange(deleteMapAccount(data, account.id)); onClose() }}>Delete account</button>}
        </>}
      </div>
    </section>
  )
}
