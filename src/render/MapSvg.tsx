import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type SVGProps,
} from 'react'
import {
  hexagonInset,
  incomePanelMetrics,
  footnoteLineLayouts,
  flowLabelText,
  fittedCalculatedTextLine,
  incomeSourceTextLayout,
  incomeTotalTextLayout,
  incomeTextSizes,
  layoutMap,
  layoutOverrideRect,
  mapTextOffset,
  mastheadTextLayout,
  mastheadTitleFontSize,
  needTextLayout,
  nudgeLayoutOverride,
  OVERRIDE_BOUNDS,
  usableTextWidth,
} from '../layout/layout'
import { textWidth } from '../layout/textfit'
import type {
  Arrow,
  OutlineElement,
  Placed,
  PlacedAccount,
  PlacedNote,
  SubAccountLayout,
  IncomeSourceTextLayout,
} from '../layout/layout'
import {
  accountDisplayName,
  money,
  mapMoney,
  moneyPer,
} from '../model/format'
import { gapLine, runwayLine } from '../model/math'
import type {
  AccountShape,
  AccountTextRole,
  CustomArrowColor,
  Footnote,
  IncomeSource,
  LayoutOverride,
  MapTextElement,
  MapTextElementRole,
  MoneyMapData,
} from '../model/types'
import {
  CUSTOM_ARROW_COLORS,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  accountShape,
  accountTextOverrideKey,
  mapItemTextOverrideKey,
  mapTextOverrideKey,
} from '../model/types'
import type {
  MapTextEditRect,
  MapTextEditTarget,
} from '../ui/MapTextEditor'
import { mapTextEditTargetKey, mapTextEditorTargetLabel } from '../ui/MapTextEditor'
import {
  accountTextPointerAction,
  clampRectToBounds,
  crossedDragThreshold,
  moveCustomArrowLabel,
  moveMapNote,
  retargetCustomArrow,
  snapRectToAlignment,
  snapRotation,
  screenDeltaToArtboard,
  screenPointToArtboard,
  signedPerpendicularOffset,
  withOverride,
  type AlignmentSnap,
  type Point,
  type TransformMatrix,
} from './mapInteraction'
import {
  ARROW_COLORS,
  ARTBOARD,
  BUCKETS,
  FLOW_GREEN,
  FONT_SANS,
  FONT_SERIF,
  HAIRLINE,
  INK,
  MUTED,
  NEED_RED,
  PAPER,
  TYPE,
} from './tokens'

const numericStyle = { fontVariantNumeric: 'tabular-nums' }

function fixedTextFs(
  data: MoneyMapData,
  element: MapTextElement,
  role: MapTextElementRole,
  fallback: number,
): number {
  const override = data.layoutOverrides?.[
    mapTextOverrideKey(element, role)
  ]?.fs
  return Math.min(
    MAX_MAP_TEXT_FONT_SIZE,
    Math.max(MIN_MAP_TEXT_FONT_SIZE, override ?? fallback),
  )
}

function hexagonPath(x: number, y: number, w: number, h: number): string {
  const inset = hexagonInset(w, h)
  return [
    `M ${x + inset} ${y}`,
    `L ${x + w - inset} ${y}`,
    `L ${x + w} ${y + h / 2}`,
    `L ${x + w - inset} ${y + h}`,
    `L ${x + inset} ${y + h}`,
    `L ${x} ${y + h / 2}`,
    'Z',
  ].join(' ')
}

export type MapElementTarget =
  | { kind: 'account' | 'income' | 'need'; id?: string }
  | {
      kind: 'edit'
      color?: string
      edit: MapTextEditTarget
      rect: MapTextEditRect
      anchorRect?: MapTextEditRect
    }

interface MapSvgProps {
  selectedTargetKey?: string | null
  onSelectedTargetChange?: (targetKey: string | null) => void
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onChange?: (data: MoneyMapData) => void
  highlightId?: string | null
}

interface MapEditDataAttributes {
  'data-edit-line-node'?: string
  'data-map-edit-hit'?: string
  'data-map-edit-key'?: string
  'data-map-edit-visual'?: string
  'data-map-target'?: string
  'data-layout-key'?: string
}

type DragMode =
  | 'move'
  | 'resize'
  | 'rotate'
  | 'arrowBow'
  | 'arrowStart'
  | 'arrowEnd'
  | 'noteMove'
  | 'textMove'
  | 'flowLabelMove'

interface DragSession {
  active: boolean
  initialOverride: LayoutOverride
  inverseScreenCtm: TransformMatrix
  key: string
  latestData: MoneyMapData
  mode: DragMode
  pointerId: number
  startArrow?: Arrow
  startOutline?: OutlineElement
  startPlaced?: Placed
  startScreen: Point
  startedAt: number
}

type TextPointerDown = (
  target: MapTextEditTarget,
) => (event: PointerEvent<SVGElement>) => void

function placedRotation(placed: Placed): number {
  return 'rot' in placed && typeof placed.rot === 'number'
    ? placed.rot
    : 0
}

function interactiveGroupProps(
  label: string,
  target: MapElementTarget,
  onElementClick?: (target: MapElementTarget) => void,
): SVGProps<SVGGElement> {
  if (!onElementClick) return {}

  const activate = () => onElementClick(target)
  return {
    'aria-label': label,
    onClick: activate,
    role: 'group',
    tabIndex: 0,
  }
}

function editableTextProps(
  edit: MapTextEditTarget,
  onElementClick?: (target: MapElementTarget) => void,
  onPointerDown?: (event: PointerEvent<SVGElement>) => void,
): SVGProps<SVGTextElement | SVGTSpanElement> & MapEditDataAttributes {
  if (!onElementClick) return {}

  const activate = (element: SVGGraphicsElement) => {
    const target =
      element.closest<SVGGraphicsElement>('text[data-map-edit-key]') ??
      element
    const { left, top, width, height } = target.getBoundingClientRect()
    onElementClick({
      kind: 'edit',
      color: getComputedStyle(target).fill,
      edit,
      rect: { left, top, width, height },
      anchorRect: editShapeAnchorRect(target),
    })
  }
  return {
    'aria-label': `Edit ${mapTextEditorTargetLabel(edit)}`,
    className: 'map-editable-text',
    'data-edit-line-node': mapTextEditTargetKey(edit),
    'data-map-edit-key': mapTextEditTargetKey(edit),
    'data-map-target': 'text:' + mapTextEditTargetKey(edit),
    'data-layout-key': fixedTextOverrideKey(edit) ?? undefined,
    'aria-keyshortcuts': fixedTextOverrideKey(edit) ? 'ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight' : undefined,
    onPointerDown,
    onClick: (
      event: MouseEvent<SVGTextElement | SVGTSpanElement>,
    ) => {
      event.stopPropagation()
      activate(event.currentTarget)
    },
    onKeyDown: (
      event: KeyboardEvent<SVGTextElement | SVGTSpanElement>,
    ) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopPropagation()
      activate(event.currentTarget)
    },
    role: 'button',
    tabIndex: 0,
  }
}

function editShapeAnchorRect(
  element: SVGGraphicsElement,
): MapTextEditRect | undefined {
  const shape = element.closest<SVGGraphicsElement>('g[data-map-target]')
  if (!shape) return undefined
  const { left, top, width, height } = shape.getBoundingClientRect()
  return { left, top, width, height }
}

function editableLineTextProps(
  edit: MapTextEditTarget,
  onElementClick?: (target: MapElementTarget) => void,
  editorTarget = false,
): SVGProps<SVGTextElement | SVGTSpanElement> & MapEditDataAttributes {
  if (!onElementClick) return {}
  return {
    className: 'map-editable-line',
    'data-edit-line-node': mapTextEditTargetKey(edit),
    ...(editorTarget
      ? { 'data-map-edit-key': mapTextEditTargetKey(edit) }
      : {}),
    pointerEvents: 'none',
  }
}

function editableHitAreaProps(
  edit: MapTextEditTarget,
  onElementClick?: (target: MapElementTarget) => void,
  onPointerDown?: (event: PointerEvent<SVGElement>) => void,
): SVGProps<SVGRectElement> & MapEditDataAttributes {
  if (!onElementClick) {
    return { fill: 'transparent', pointerEvents: 'none' }
  }

  const activate = (element: SVGGraphicsElement) => {
    const hitRect = element.getBoundingClientRect()
    const key = mapTextEditTargetKey(edit)
    const target = Array.from(
      element.ownerSVGElement?.querySelectorAll<SVGGraphicsElement>(
        '[data-map-edit-key]',
      ) ?? [],
    )
      .filter(
        (candidate) =>
          candidate.getAttribute('data-map-edit-key') === key,
      )
      .sort((left, right) => {
        const leftRect = left.getBoundingClientRect()
        const rightRect = right.getBoundingClientRect()
        const hitCenterY = hitRect.top + hitRect.height / 2
        return (
          Math.abs(leftRect.top + leftRect.height / 2 - hitCenterY) -
          Math.abs(rightRect.top + rightRect.height / 2 - hitCenterY)
        )
      })[0]
    const { left, top, width, height } =
      target?.getBoundingClientRect() ?? hitRect
    onElementClick({
      kind: 'edit',
      color: target ? getComputedStyle(target).fill : undefined,
      edit,
      rect: { left, top, width, height },
      anchorRect: editShapeAnchorRect(target ?? element),
    })
  }
  return {
    'aria-label': `Edit ${mapTextEditorTargetLabel(edit)}`,
    className: 'map-editable-hit',
    'data-map-edit-hit': mapTextEditTargetKey(edit),
    'data-map-target': 'text:' + mapTextEditTargetKey(edit),
    'data-layout-key': fixedTextOverrideKey(edit) ?? undefined,
    'aria-keyshortcuts': fixedTextOverrideKey(edit) ? 'ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight' : undefined,
    fill: 'transparent',
    onPointerDown,
    onClick: (event) => {
      event.stopPropagation()
      activate(event.currentTarget)
    },
    onKeyDown: (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      event.stopPropagation()
      activate(event.currentTarget)
    },
    role: 'button',
    tabIndex: 0,
  }
}

function fixedTextOverrideKey(target: MapTextEditTarget): string | null {
  switch (target.kind) {
    case 'accountLabel':
      return accountTextOverrideKey(target.accountId, 'label')
    case 'accountCaption':
      return accountTextOverrideKey(target.accountId, 'caption')
    case 'accountValue':
      return accountTextOverrideKey(target.accountId, 'value')
    case 'accountRows':
    case 'accountPositionLabel':
    case 'accountPositionValue':
      return accountTextOverrideKey(target.accountId, 'rows')
    case 'accountSub':
    case 'accountSubLabel':
    case 'accountSubCaption':
    case 'accountSubValue':
      return accountTextOverrideKey(target.accountId, 'sub')
    case 'incomeHeader':
      return mapTextOverrideKey('income', 'header')
    case 'incomeAmount':
      return target.incomeId
        ? mapItemTextOverrideKey('income', 'row', target.incomeId)
        : mapTextOverrideKey('income', 'row')
    case 'afterTaxIncome':
      return mapTextOverrideKey('income', 'total')
    case 'needLabel':
      return mapTextOverrideKey('need', 'label')
    case 'monthlyNeed':
      return mapTextOverrideKey('need', 'value')
    case 'footnoteText':
      return target.footnoteId
        ? mapItemTextOverrideKey('footnotes', 'line', target.footnoteId)
        : mapTextOverrideKey('footnotes', 'line')
    case 'mastheadLabel':
      return mapTextOverrideKey('masthead', 'label')
    default:
      return null
  }
}

function Masthead({
  data,
  onElementClick,
  onTextPointerDown,
}: {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
}) {
  const edit = { kind: 'mastheadLabel' } as const
  const text = mastheadTextLayout(data)
  const offset = mapTextOffset(data, 'masthead', 'label', {
    x: 454,
    y: 58,
    w: 818,
    h: 40,
  })
  return (
    <g>
      <text
        x={48}
        y={84}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={mastheadTitleFontSize(data)}
        fontWeight={600}
        aria-label={text.title.exact}
      >
        {text.title.display}
      </text>
      <g transform={`translate(${offset.dx} ${offset.dy})`}>
        <rect
          x={454}
          y={58}
          width={818}
          height={40}
          {...editableHitAreaProps(
            edit,
            onElementClick,
            onTextPointerDown?.(edit),
          )}
        />
        <text
          x={470}
          y={83}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.mastheadLabel}
          fontWeight={600}
          letterSpacing={2.5}
          {...editableTextProps(
            edit,
            onElementClick,
            onTextPointerDown?.(edit),
          )}
          aria-label={
            onElementClick
              ? `Edit ${mapTextEditorTargetLabel(edit)}: ${text.label.exact}`
              : text.label.exact
          }
        >
          {text.label.display}
        </text>
      </g>
      <line x1={48} y1={118} x2={1272} y2={118} stroke={HAIRLINE} />
    </g>
  )
}

function IncomeRow({
  fontSize,
  index,
  onElementClick,
  valueOffset,
  source,
  text,
  x,
  y,
}: {
  fontSize: number
  index: number
  onElementClick?: (target: MapElementTarget) => void
  valueOffset: number
  source: IncomeSource
  text: IncomeSourceTextLayout
  x: number
  y: number
}) {
  return (
    <g>
      <text
        x={x}
        y={y}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={fontSize * (13 / 14)}
        aria-label={text.label.exact}
        {...editableLineTextProps(
          { kind: 'incomeAmount', incomeIndex: index, incomeId: source.id },
          onElementClick,
        )}
      >
        {text.label.display}
      </text>
      <text
        x={x}
        y={y + valueOffset}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={fontSize}
        fontWeight={600}
        style={numericStyle}
        aria-label={text.amount.exact}
        {...editableLineTextProps(
          { kind: 'incomeAmount', incomeIndex: index, incomeId: source.id },
          onElementClick,
          true,
        )}
      >
        {text.amount.display === text.amount.exact ? (
          <>
            <tspan
            {...editableLineTextProps(
              { kind: 'incomeAmount', incomeIndex: index, incomeId: source.id },
              onElementClick,
            )}
            >
              {moneyPer(source.amount, source.period)}
            </tspan>
            {source.qualifier && (
              <tspan
                dx={7}
                fill={MUTED}
                fontFamily={FONT_SANS}
                fontSize={fontSize * (12 / 14)}
                fontWeight={400}
                {...editableLineTextProps(
                  { kind: 'incomeAmount', incomeIndex: index, incomeId: source.id },
                  onElementClick,
                )}
              >
                {source.qualifier}
              </tspan>
            )}
          </>
        ) : text.amount.display}
      </text>
    </g>
  )
}

function IncomePanel({
  data,
  onElementClick,
  onTextPointerDown,
  placed,
}: {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  placed: Placed
}) {
  const metrics = incomePanelMetrics(data)
  const sizes = incomeTextSizes(data)
  const dividerY = placed.y + metrics.dividerY
  const {
    firstRowY,
    rowPitch,
    rowValueOffset,
  } = metrics
  const headerFs = sizes.header
  const rowFs = sizes.rowValue
  const totalFs = sizes.totalValue
  const headerEdit = { kind: 'incomeHeader' } as const
  const headerOffset = mapTextOffset(data, 'income', 'header', {
    x: placed.x + 12,
    y: placed.y + 7,
    w: placed.w - 24,
    h: 35,
  })
  const totalEdit = { kind: 'afterTaxIncome' } as const
  const totalOffset = mapTextOffset(data, 'income', 'total', {
    x: placed.x + 12,
    y: dividerY + 7,
    w: placed.w - 24,
    h: 48,
  })
  const totalText = incomeTotalTextLayout(data, placed)

  return (
    <g>
      <rect
        x={placed.x}
        y={placed.y}
        width={placed.w}
        height={placed.h}
        rx={10}
        fill="#ffffff"
        stroke={HAIRLINE}
        strokeWidth={1.5}
      />
      <g transform={`translate(${headerOffset.dx} ${headerOffset.dy})`}>
        <rect
          x={placed.x + 12}
          y={placed.y + 7}
          width={placed.w - 24}
          height={35}
          {...editableHitAreaProps(
            headerEdit,
            onElementClick,
            onTextPointerDown?.(headerEdit),
          )}
        />
        <text
          x={placed.x + 20}
          y={placed.y + 29}
          fill={FLOW_GREEN}
          fontFamily={FONT_SANS}
          fontSize={headerFs}
          fontWeight={700}
          letterSpacing={1.7}
          {...editableTextProps(
            headerEdit,
            onElementClick,
            onTextPointerDown?.(headerEdit),
          )}
        >
          INCOME SOURCES
        </text>
      </g>
      <line
        x1={placed.x + 20}
        y1={placed.y + 40}
        x2={placed.x + 48}
        y2={placed.y + 40}
        stroke={FLOW_GREEN}
        strokeWidth={2}
      />
      {data.incomeSources.map((source, index) => {
        const text = incomeSourceTextLayout(data, placed, source)
        const edit = { kind: 'incomeAmount', incomeIndex: index, incomeId: source.id } as const
        const visibleWidth = Math.min(
          placed.w - 24,
          Math.max(
            textWidth(text.label.display, rowFs * (13 / 14)),
            textWidth(text.amount.display, rowFs),
          ) + 16,
        )
        const rowBlock = {
          x: placed.x + 12,
          y:
            placed.y +
            firstRowY +
            index * rowPitch -
            rowFs * (13 / 14) -
            5,
          w: visibleWidth,
          h: rowPitch,
        }
        const offset = mapTextOffset(
          data,
          'income',
          'row',
          rowBlock,
          source.id,
        )
        return (
        <g
          key={`${source.label}-${index}`}
          transform={`translate(${offset.dx} ${offset.dy})`}
        >
          <rect
            x={rowBlock.x}
            y={rowBlock.y}
            width={rowBlock.w}
            height={rowBlock.h}
            {...editableHitAreaProps(
              edit,
              onElementClick,
              onTextPointerDown?.(edit),
            )}
          />
          <IncomeRow
            fontSize={rowFs}
            index={index}
            onElementClick={onElementClick}
            source={source}
            text={text}
            valueOffset={rowValueOffset}
            x={placed.x + 20}
            y={placed.y + firstRowY + index * rowPitch}
          />
        </g>
        )
      })}
      <line
        x1={placed.x + 20}
        y1={dividerY}
        x2={placed.x + placed.w - 20}
        y2={dividerY}
        stroke={HAIRLINE}
      />
      <line
        x1={placed.x + 20}
        y1={dividerY + 3}
        x2={placed.x + placed.w - 20}
        y2={dividerY + 3}
        stroke={HAIRLINE}
      />
      <g transform={`translate(${totalOffset.dx} ${totalOffset.dy})`}>
        <rect
          x={placed.x + 12}
          y={dividerY + 7}
          width={placed.w - 24}
          height={48}
          {...editableHitAreaProps(
            totalEdit,
            onElementClick,
            onTextPointerDown?.(totalEdit),
          )}
        />
        <text
          x={placed.x + 20}
          y={dividerY + 31}
          fill={INK}
          fontFamily={FONT_SANS}
          fontSize={sizes.totalLabel}
          fontWeight={600}
          aria-label={totalText.label.exact}
          {...editableLineTextProps(totalEdit, onElementClick)}
        >
          {totalText.label.display}
        </text>
        <text
          x={placed.x + placed.w - 20}
          y={dividerY + 31}
          fill={FLOW_GREEN}
          fontFamily={FONT_SERIF}
          fontSize={totalFs}
          fontWeight={600}
          aria-label={totalText.value.exact}
          textAnchor="end"
          style={numericStyle}
          {...editableLineTextProps(totalEdit, onElementClick, true)}
        >
          {totalText.value.display}
        </text>
      </g>
    </g>
  )
}

function centeredTextBaseline(top: number, height: number, fontSize: number) {
  return top + height / 2 + fontSize * 0.35
}

function NeedCard({
  data,
  mathLine,
  onElementClick,
  onTextPointerDown,
  onSupportingFocus,
  onSupportingPointerDown,
  supportingSelected,
  tag,
  value,
  placed,
}: {
  data: MoneyMapData
  mathLine: string | null
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  onSupportingFocus?: () => void
  onSupportingPointerDown?: (event: PointerEvent<SVGElement>) => void
  supportingSelected?: boolean
  tag?: string
  value: number | null
  placed: Placed
}) {
  const fitted = needTextLayout(data, placed, mathLine)
  const labelFs = fixedTextFs(data, 'need', 'label', TYPE.needLabel)
  const valueFs = fixedTextFs(data, 'need', 'value', TYPE.needValue)
  const labelEdit = { kind: 'needLabel' } as const
  const labelRow = {
    x: placed.x + 12,
    y: placed.y + 31,
    w: placed.w - 24,
    h: 38,
  }
  const labelOffset = mapTextOffset(data, 'need', 'label', labelRow)
  const valueEdit = { kind: 'monthlyNeed' } as const
  const valueRow = {
    x: placed.x + 12,
    y: placed.y + 75,
    w: placed.w - 24,
    h: 52,
  }
  const valueOffset = mapTextOffset(data, 'need', 'value', valueRow)
  const supportingKey = mapTextOverrideKey('need', 'supporting')
  const supportingOffset = mapTextOffset(data, 'need', 'supporting', {
    x: placed.x + 12,
    y: placed.y + 120,
    w: placed.w - 24,
    h: 28,
  })
  return (
    <g>
      <rect
        x={placed.x}
        y={placed.y}
        width={placed.w}
        height={placed.h}
        rx={14}
        fill="#faeae7"
        stroke={NEED_RED}
        strokeWidth={2}
      />
      <g transform={`translate(${labelOffset.dx} ${labelOffset.dy})`}>
        <rect
          x={labelRow.x}
          y={labelRow.y}
          width={labelRow.w}
          height={labelRow.h}
          {...editableHitAreaProps(
            labelEdit,
            onElementClick,
            onTextPointerDown?.(labelEdit),
          )}
        />
        <text
          x={placed.x + placed.w / 2}
          y={centeredTextBaseline(labelRow.y, labelRow.h, labelFs)}
          fill={INK}
          fontFamily={FONT_SANS}
          fontSize={labelFs}
          fontWeight={700}
          letterSpacing={1.8}
          textAnchor="middle"
          {...editableTextProps(
            labelEdit,
            onElementClick,
            onTextPointerDown?.(labelEdit),
          )}
          aria-label={
            onElementClick
              ? `Edit ${mapTextEditorTargetLabel(labelEdit)}: ${fitted.label.exact}`
              : fitted.label.exact
          }
        >
          {fitted.label.display}
        </text>
      </g>
      <g transform={`translate(${valueOffset.dx} ${valueOffset.dy})`}>
        <rect
          x={valueRow.x}
          y={valueRow.y}
          width={valueRow.w}
          height={valueRow.h}
          {...editableHitAreaProps(
            valueEdit,
            onElementClick,
            onTextPointerDown?.(valueEdit),
          )}
        />
        <text
          x={placed.x + placed.w / 2}
          y={centeredTextBaseline(valueRow.y, valueRow.h, valueFs)}
          fill={NEED_RED}
          fontFamily={FONT_SERIF}
          fontSize={valueFs}
          fontWeight={600}
          aria-label={fitted.value.exact}
          textAnchor="middle"
          {...editableLineTextProps(valueEdit, onElementClick)}
        >
          <tspan
            style={numericStyle}
            {...editableLineTextProps(valueEdit, onElementClick, true)}
          >
            {fitted.value.display === fitted.value.exact
              ? money(value)
              : fitted.value.display}
          </tspan>
          {tag && fitted.value.display === fitted.value.exact && (
            <tspan
              fill={MUTED}
              fontStyle="italic"
              fontWeight={400}
              {...editableLineTextProps(valueEdit, onElementClick)}
            >
              {` ${tag}`}
            </tspan>
          )}
        </text>
      </g>
      {mathLine && fitted.supporting.display ? (
        <g transform={`translate(${supportingOffset.dx} ${supportingOffset.dy})`}>
          <text
            aria-label={`Adjust coverage note: ${fitted.supporting.exact}`}
            className="map-calculated-text"
            data-layout-key={supportingKey}
            data-map-selected={supportingSelected ? 'true' : undefined}
            data-map-target={supportingKey}
            fill={MUTED}
            fontFamily={FONT_SANS}
            fontSize={fitted.supporting.fontSize}
            onFocus={onSupportingFocus}
            onPointerDown={onSupportingPointerDown}
            role={onSupportingPointerDown ? 'button' : undefined}
            tabIndex={onSupportingPointerDown ? 0 : undefined}
            textAnchor="middle"
            x={placed.x + placed.w / 2}
            y={placed.y + 139}
          >
            {fitted.supporting.display}
          </text>
        </g>
      ) : null}
    </g>
  )
}

function cylinderBody(
  x: number,
  y: number,
  w: number,
  h: number,
  capRy: number,
): string {
  return [
    `M ${x} ${y + capRy}`,
    `L ${x} ${y + h - capRy}`,
    `A ${w / 2} ${capRy} 0 0 0 ${x + w} ${y + h - capRy}`,
    `L ${x + w} ${y + capRy}`,
    'Z',
  ].join(' ')
}

function SubAccountDrum({
  accountId,
  layout,
  onElementClick,
  onTextPointerDown,
  x,
  y,
  w,
  fill,
  stroke,
  subAccountIndex,
}: {
  accountId: string
  layout: SubAccountLayout
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: (
    accountId: string,
    role: AccountTextRole,
  ) => (event: PointerEvent<SVGElement>) => void
  x: number
  y: number
  w: number
  fill: string
  stroke: string
  subAccountIndex: number
}) {
  const capRy = 10
  const { subAccount } = layout
  const edit = { kind: 'accountSub', accountId } as const

  return (
    <g>
      <path
        d={cylinderBody(x, y, w, layout.h, capRy)}
        fill={fill}
        stroke={stroke}
        strokeDasharray="6 5"
        strokeWidth={1.75}
      />
      <ellipse
        cx={x + w / 2}
        className="map-account-decoration"
        cy={y + capRy}
        rx={w / 2}
        ry={capRy}
        pointerEvents="none"
        fill={fill}
        stroke={stroke}
        strokeDasharray="6 5"
        strokeWidth={1.75}
      />
      <g
        transform={`translate(${layout.textDx ?? 0} ${layout.textDy ?? 0})`}
      >
      <rect
        x={x}
        y={y}
        width={w}
        height={layout.h}
        rx={capRy}
        {...editableHitAreaProps(
          edit,
          onElementClick,
          onTextPointerDown?.(accountId, 'sub'),
        )}
      />
      <text
        x={x + w / 2}
        y={y + layout.titleY}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={layout.titleFontSize}
        fontWeight={600}
        textAnchor="middle"
        {...editableTextProps(
          { kind: 'accountSubLabel', accountId, subAccountIndex },
          onElementClick,
          onTextPointerDown?.(accountId, 'sub'),
        )}
      >
        {layout.titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2}
            dy={index === 0 ? 0 : layout.titleLeading}
            {...editableLineTextProps(
              { kind: 'accountSubLabel', accountId, subAccountIndex },
              onElementClick,
            )}
          >
            {line}
          </tspan>
        ))}
      </text>
      {layout.captionY !== undefined && (
        <text
          x={x + w / 2}
          y={y + layout.captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={layout.captionFontSize}
          textAnchor="middle"
          {...editableTextProps(
            { kind: 'accountSubCaption', accountId, subAccountIndex },
            onElementClick,
            onTextPointerDown?.(accountId, 'sub'),
          )}
        >
          {layout.captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2}
              dy={index === 0 ? 0 : layout.captionLeading}
              {...editableLineTextProps(
                { kind: 'accountSubCaption', accountId, subAccountIndex },
                onElementClick,
              )}
            >
              {line}
            </tspan>
          ))}
        </text>
      )}
      <text
        x={x + w / 2}
        y={y + layout.valueY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={layout.valueFontSize}
        fontWeight={600}
        textAnchor="middle"
        style={numericStyle}
        {...editableTextProps(
          { kind: 'accountSubValue', accountId, subAccountIndex },
          onElementClick,
          onTextPointerDown?.(accountId, 'sub'),
        )}
        aria-label={money(subAccount.value)}
      >
        {layout.valueText}
      </text>
      </g>
    </g>
  )
}

function accountVisualTextProps(
  edit: MapTextEditTarget,
): SVGProps<SVGTextElement> & MapEditDataAttributes {
  const key = mapTextEditTargetKey(edit)
  return {
    'aria-hidden': true,
    className: 'map-editable-text',
    'data-edit-line-node': key,
    'data-map-edit-visual': key,
    pointerEvents: 'none',
  }
}

function accountTextHitRect(
  centerX: number,
  baselineY: number,
  accountWidth: number,
  fontSize: number,
  leading: number,
  lineCount: number,
) {
  const width = Math.max(72, accountWidth * 0.84)
  const height = Math.max(
    28,
    Math.max(0, lineCount - 1) * leading + fontSize * 1.4,
  )
  return {
    height,
    width,
    x: centerX - width / 2,
    y: baselineY - fontSize,
  }
}
function AccountContent({
  onElementClick,
  onTextPointerDown,
  placed,
  runway,
  verticallyCenterTag = false,
}: {
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: (
    accountId: string,
    role: AccountTextRole,
  ) => (event: PointerEvent<SVGElement>) => void
  placed: PlacedAccount
  runway: string | null
  verticallyCenterTag?: boolean
}) {
  const {
    account,
    captionLines,
    subAccountLayouts,
    text,
    titleLines,
    valueText,
    h,
    x,
    y,
    w,
  } = placed
  const fittedRunway = runway && text.runwayY !== undefined
    ? fittedCalculatedTextLine(
        runway,
        usableTextWidth(
          accountShape(account),
          w,
          h,
          text.runwayY,
          TYPE.runway,
        ),
        TYPE.runway,
      )
    : null
  const style = BUCKETS[account.bucket]
  const titleEdit: MapTextEditTarget = {
    kind: 'accountLabel',
    accountId: account.id,
  }
  const captionEdit: MapTextEditTarget = {
    kind: 'accountCaption',
    accountId: account.id,
  }
  const valueEdit: MapTextEditTarget = {
    kind: 'accountValue',
    accountId: account.id,
  }
  const titlePointerDown = onTextPointerDown?.(account.id, 'label')
  const captionPointerDown = onTextPointerDown?.(account.id, 'caption')
  const valuePointerDown = onTextPointerDown?.(account.id, 'value')
  const titleTextProps = onElementClick
    ? accountVisualTextProps(titleEdit)
    : editableTextProps(titleEdit, onElementClick, titlePointerDown)
  const captionTextProps = onElementClick
    ? accountVisualTextProps(captionEdit)
    : editableTextProps(captionEdit, onElementClick, captionPointerDown)
  const valueTextProps = onElementClick
    ? accountVisualTextProps(valueEdit)
    : editableTextProps(valueEdit, onElementClick, valuePointerDown)
  const titleHit = accountTextHitRect(
    x + w / 2 + text.titleX,
    y + text.titleY,
    w,
    text.titleFontSize,
    text.titleLeading,
    titleLines.length,
  )
  const captionHit =
    text.captionY === undefined
      ? null
      : accountTextHitRect(
          x + w / 2 + text.captionX,
          y + text.captionY,
          w,
          text.captionFontSize,
          text.captionLeading,
          captionLines.length,
        )
  const valueHit = accountTextHitRect(
    x + w / 2 + text.valueX,
    y + text.valueY,
    w,
    text.valueFontSize,
    text.valueFontSize,
    1,
  )
  return (
    <>
      <text
        x={x + w / 2}
        y={y + text.tagY}
        fill={style.tagColor}
        fontFamily={FONT_SANS}
        fontSize={TYPE.accountTag}
        fontWeight={700}
        letterSpacing={1.2}
        dominantBaseline={verticallyCenterTag ? 'middle' : undefined}
        textAnchor="middle"
      >
        {style.tag.toUpperCase()}
      </text>
      <text
        x={x + w / 2 + text.titleX}
        y={y + text.titleY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={text.titleFontSize}
        fontWeight={600}
        textAnchor="middle"
        {...titleTextProps}
      >
        {titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2 + text.titleX}
            dy={index === 0 ? 0 : text.titleLeading}
            {...editableLineTextProps(
              { kind: 'accountLabel', accountId: account.id },
              onElementClick,
            )}
          >
            {line}
          </tspan>
        ))}
      </text>
      {onElementClick && (
        <rect
          x={titleHit.x}
          y={titleHit.y}
          width={titleHit.width}
          height={titleHit.height}
          {...editableHitAreaProps(
            titleEdit,
            onElementClick,
            titlePointerDown,
          )}
          data-map-edit-key={mapTextEditTargetKey(titleEdit)}
          pointerEvents="all"
        />
      )}
      {text.captionY !== undefined && (
        <>
        <text
          x={x + w / 2 + text.captionX}
          y={y + text.captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={text.captionFontSize}
          textAnchor="middle"
          {...captionTextProps}
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2 + text.captionX}
              dy={index === 0 ? 0 : text.captionLeading}
              {...editableLineTextProps(
                { kind: 'accountCaption', accountId: account.id },
                onElementClick,
              )}
            >
              {line}
            </tspan>
          ))}
        </text>
        {onElementClick && captionHit && (
          <rect
            x={captionHit.x}
            y={captionHit.y}
            width={captionHit.width}
            height={captionHit.height}
            {...editableHitAreaProps(
              captionEdit,
              onElementClick,
              captionPointerDown,
            )}
            data-map-edit-key={mapTextEditTargetKey(captionEdit)}
            pointerEvents="all"
          />
        )}
        </>
      )}
      {placed.positionRows.map((row, index) => {
        return (
          <g key={`${row.valueText}-${index}`}>
            <rect
              x={x + row.leftX}
              y={y + row.topY}
              width={row.innerWidth}
              height={row.h}
            {...editableHitAreaProps(
              { kind: 'accountRows', accountId: account.id },
              onElementClick,
              onTextPointerDown?.(account.id, 'rows'),
            )}
            />
            <line
              x1={x + row.leftX}
              y1={y + row.topY}
              x2={x + row.rightX}
              y2={y + row.topY}
              stroke={HAIRLINE}
            />
            <text
              x={x + row.leftX}
              y={y + row.firstBaseline}
              fill={INK}
              fontFamily={FONT_SANS}
              fontSize={text.rowFontSize}
              {...editableTextProps(
                { kind: 'accountPositionLabel', accountId: account.id, positionIndex: index },
                onElementClick,
                onTextPointerDown?.(account.id, 'rows'),
              )}
            >
              {row.labelLines.map((line, lineIndex) => (
                <tspan
                  key={`${line}-${lineIndex}`}
                  x={x + row.leftX}
                  dy={lineIndex === 0 ? 0 : text.rowLeading}
                  {...editableLineTextProps(
                    { kind: 'accountPositionLabel', accountId: account.id, positionIndex: index },
                    onElementClick,
                  )}
                >
                  {line}
                </tspan>
              ))}
            </text>
            <text
              x={x + row.rightX}
              y={y + row.firstBaseline}
              fill={INK}
              fontFamily={FONT_SERIF}
              fontSize={text.rowFontSize}
              fontWeight={600}
              textAnchor="end"
              style={numericStyle}
              {...editableTextProps(
                { kind: 'accountPositionValue', accountId: account.id, positionIndex: index },
                onElementClick,
                onTextPointerDown?.(account.id, 'rows'),
              )}
              aria-label={money(account.positions![index].value)}
            >
              {row.valueText}
            </text>
          </g>
        )
      })}
      <text
        x={x + w / 2 + text.valueX}
        y={y + text.valueY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={text.valueFontSize}
        fontWeight={600}
        textAnchor="middle"
        {...valueTextProps}
        aria-label={`${money(account.value)}${account.valueTag ? ` ${account.valueTag}` : ''}`}
      >
        <tspan
          style={numericStyle}
          {...editableLineTextProps(
            { kind: 'accountValue', accountId: account.id },
            onElementClick,
          )}
        >
          {valueText === `${money(account.value)}${account.valueTag ? ` ${account.valueTag}` : ''}`
            ? money(account.value)
            : valueText}
        </tspan>
        {account.valueTag &&
          valueText === `${money(account.value)} ${account.valueTag}` && (
          <tspan
            fill={MUTED}
            fontStyle="italic"
            fontWeight={400}
            {...editableLineTextProps(
              { kind: 'accountValue', accountId: account.id },
              onElementClick,
            )}
          >
            {` ${account.valueTag}`}
          </tspan>
        )}
      </text>
      {onElementClick && (
        <rect
          x={valueHit.x}
          y={valueHit.y}
          width={valueHit.width}
          height={valueHit.height}
          {...editableHitAreaProps(
            valueEdit,
            onElementClick,
            valuePointerDown,
          )}
          data-map-edit-key={mapTextEditTargetKey(valueEdit)}
          pointerEvents="all"
        />
      )}
      {fittedRunway?.display ? (
        <text
          aria-label={fittedRunway.exact}
          x={x + w / 2}
          y={y + text.runwayY!}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={fittedRunway.fontSize}
          textAnchor="middle"
        >
          {fittedRunway.display}
        </text>
      ) : null}
      {subAccountLayouts.map((layout, index) => {
        return (
          <SubAccountDrum
            accountId={account.id}
            key={`${layout.subAccount.label}-${index}`}
            layout={layout}
            onElementClick={onElementClick}
            onTextPointerDown={onTextPointerDown}
            x={x + w * 0.14}
            y={y + layout.y}
            w={w * 0.72}
            fill={style.tint}
            stroke={style.stroke}
            subAccountIndex={index}
          />
        )
      })}
    </>
  )
}

function FlatAccount({
  onElementClick,
  onTextPointerDown,
  placed,
  runway,
  shape,
}: {
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: (
    accountId: string,
    role: AccountTextRole,
  ) => (event: PointerEvent<SVGElement>) => void
  placed: PlacedAccount
  runway: string | null
  shape: Exclude<AccountShape, 'drum'>
}) {
  const { account, x, y, w, h } = placed
  const style = BUCKETS[account.bucket]
  const dash = style.dashed ? '8 6' : undefined
  const radius = shape === 'card' ? 12 : Math.min(w, h) / 2
  const outlineProps = {
    fill: style.tint,
    stroke: style.stroke,
    strokeDasharray: dash,
    strokeWidth: 2.5,
  }

  return (
    <g>
      {shape === 'rect' ? (
        <path
          aria-hidden="true"
          className="map-account-body-hit"
          d={hexagonPath(x, y, w, h)}
          fill="transparent"
          pointerEvents="all"
          stroke="none"
        />
      ) : (
        <rect
          aria-hidden="true"
          className="map-account-body-hit"
          fill="transparent"
          height={h}
          pointerEvents="all"
          rx={radius}
          stroke="none"
          width={w}
          x={x}
          y={y}
        />
      )}
      {shape === 'rect' ? (
        <path
          className="map-account-decoration"
          d={hexagonPath(x, y, w, h)}
          pointerEvents="none"
          {...outlineProps}
        />
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={radius}
          className="map-account-decoration"
          pointerEvents="none"
          {...outlineProps}
        />
      )}
      <AccountContent
        onElementClick={onElementClick}
        onTextPointerDown={onTextPointerDown}
        placed={placed}
        runway={runway}
      />
    </g>
  )
}


function Cylinder({
  onElementClick,
  onTextPointerDown,
  placed,
  runway,
}: {
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: (
    accountId: string,
    role: AccountTextRole,
  ) => (event: PointerEvent<SVGElement>) => void
  placed: PlacedAccount
  runway: string | null
}) {
  const { account, x, y, w, h, capRy } = placed
  const style = BUCKETS[account.bucket]
  const dash = style.dashed ? '8 6' : undefined
  const centerX = x + w / 2

  return (
    <g>
      <path
        aria-hidden="true"
        className="map-account-body-hit"
        d={cylinderBody(x, y, w, h, capRy)}
        fill="transparent"
        pointerEvents="all"
        stroke="none"
      />
      <ellipse
        aria-hidden="true"
        className="map-account-body-hit"
        cx={centerX}
        cy={y + capRy}
        fill="transparent"
        pointerEvents="all"
        rx={w / 2}
        ry={capRy}
        stroke="none"
      />
      <path
        className="map-account-decoration"
        d={cylinderBody(x, y, w, h, capRy)}
        pointerEvents="none"
        fill={style.tint}
        stroke={style.stroke}
        strokeDasharray={dash}
        strokeWidth={2.5}
      />
      <ellipse
        cx={centerX}
        className="map-account-decoration"
        cy={y + capRy}
        rx={w / 2}
        ry={capRy}
        pointerEvents="none"
        fill={style.tint}
        stroke={style.stroke}
        strokeDasharray={dash}
        strokeWidth={2.5}
      />
      <AccountContent
        onElementClick={onElementClick}
        onTextPointerDown={onTextPointerDown}
        placed={placed}
        runway={runway}
        verticallyCenterTag
      />
    </g>
  )
}

function ArrowPath({
  arrow,
  customMarkerIds,
  markerId,
}: {
  arrow: Arrow
  customMarkerIds: Record<CustomArrowColor, string>
  markerId: string
}) {
  const asNeeded = arrow.kind === 'asNeeded'
  const custom = arrow.kind === 'custom'
  const style = arrow.style ?? (asNeeded ? 'dashed' : 'solid')
  const colorName =
    arrow.color ?? (custom ? resolveCustomArrowColor(style, undefined) : 'green')
  const color = ARROW_COLORS[colorName]
  const dotted = style === 'dotted'
  const dashed = style === 'dashed'
  return (
    <path
      data-arrow-color={colorName}
      data-arrow-kind={arrow.kind}
      data-arrow-style={style}
      d={arrow.d}
      fill="none"
      markerEnd={`url(#${
        colorName === 'green' ? markerId : customMarkerIds[colorName]
      })`}
      stroke={color}
      strokeDasharray={dotted ? '0.1 9' : dashed ? '7 6' : undefined}
      strokeLinecap={dotted ? 'round' : 'butt'}
      strokeWidth={2}
    />
  )
}

export function resolveCustomArrowColor(
  style: Arrow['style'],
  color: Arrow['color'],
): CustomArrowColor {
  if (color) return color
  return style === 'dotted' || style === 'dashed' ? 'green' : 'ink'
}

function FlowArrowLabel({
  arrow,
  onElementClick,
  onPointerDown,
}: {
  arrow: Arrow
  onElementClick?: (target: MapElementTarget) => void
  onPointerDown?: (event: PointerEvent<SVGElement>) => void
}) {
  if (!arrow.id || !arrow.label || !arrow.labelAt) return null
  const text = flowLabelText(arrow)
  return (
    <text
      x={arrow.labelAt.x}
      y={arrow.labelAt.y + TYPE.arrowLabel / 3}
      fill={
        ARROW_COLORS[
          resolveCustomArrowColor(arrow.style, arrow.color)
        ]
      }
      fontFamily={FONT_SANS}
      fontSize={TYPE.arrowLabel}
      textAnchor="middle"
      {...editableTextProps(
        { kind: 'flowLabel', arrowId: arrow.id },
        onElementClick,
        onPointerDown ?? ((event) => event.stopPropagation()),
      )}
      aria-label={
        onElementClick
          ? `Edit transfer description: ${text.exact}`
          : text.exact
      }
      className={`map-flow-label${
        onElementClick ? ' map-editable-text' : ''
      }`}
    >
      {text.display}
    </text>
  )
}

function ArrowEditor({
  accessibleName,
  arrow,
  customMarkerIds,
  markerId,
  onBeginDrag,
  onElementClick,
  onSelect,
  selected,
  targetKey,
}: {
  accessibleName: string
  arrow: Arrow
  customMarkerIds: Record<CustomArrowColor, string>
  markerId: string
  onBeginDrag: (
    mode: DragMode,
    outline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => void
  onElementClick?: (target: MapElementTarget) => void
  onSelect: () => void
  selected: boolean
  targetKey: string
}) {
  const midpoint = {
    x: (arrow.start.x + 2 * arrow.control.x + arrow.end.x) / 4,
    y: (arrow.start.y + 2 * arrow.control.y + arrow.end.y) / 4,
  }
  return (
    <g
      aria-label={accessibleName}
      aria-keyshortcuts={
        arrow.kind === 'custom'
          ? 'Control+ArrowLeft Control+ArrowRight'
          : undefined
      }
      className="map-arrow-editor"
      data-map-selected={selected ? 'true' : undefined}
      data-map-target={targetKey}
      onFocus={onSelect}
      role="group"
      tabIndex={0}
    >
      <ArrowPath
        arrow={arrow}
        customMarkerIds={customMarkerIds}
        markerId={markerId}
      />
      <path
        className="map-arrow-hit"
        d={arrow.d}
        fill="none"
        onPointerDown={onBeginDrag('arrowBow')}
      />
      <FlowArrowLabel
        arrow={arrow}
        onElementClick={onElementClick}
        onPointerDown={onBeginDrag('flowLabelMove')}
      />
      {selected && ([
        ['arrowStart', arrow.start],
        ['arrowBow', midpoint],
        ['arrowEnd', arrow.end],
      ] as const).map(([mode, point]) => (
        <g key={mode}>
          <circle
            aria-hidden="true"
            className="map-arrow-handle-hit"
            cx={point.x}
            cy={point.y}
            fill="transparent"
            r={3}
            stroke="transparent"
            strokeWidth={18}
            vectorEffect="non-scaling-stroke"
            onPointerDown={onBeginDrag(mode)}
          />
          <circle
            aria-hidden="true"
            className="map-arrow-handle"
            cx={point.x}
            cy={point.y}
            pointerEvents="none"
            r={4}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      ))}
    </g>
  )
}



function AsNeededLabel({
  arrow,
  amount,
  onElementClick,
  selected,
}: {
  arrow: Arrow
  amount: number | null
  onElementClick?: (target: MapElementTarget) => void
  selected?: boolean
}) {
  if (!arrow.labelAt) return null
  const amountText = mapMoney(amount, 10)
  const accessibleLabel =
    'Monthly income drawn as needed ' + amountText.exact
  return (
    <g
      aria-label={accessibleLabel}
      data-as-needed-chip="true"
      data-map-selected={selected ? 'true' : undefined}
      data-map-target="asNeededChip"
    >
      <title>{accessibleLabel}</title>
      <rect
        x={arrow.labelAt.x - 94}
        y={arrow.labelAt.y - 19}
        width={188}
        height={38}
        rx={19}
        fill="#ffffff"
        stroke={FLOW_GREEN}
        strokeDasharray="5 4"
      />
      <rect
        x={arrow.labelAt.x - 87}
        y={arrow.labelAt.y - 15}
        width={174}
        height={30}
        {...editableHitAreaProps(
          { kind: 'asNeededAmount' },
          onElementClick,
        )}
      />
      <text
        x={arrow.labelAt.x}
        y={arrow.labelAt.y + 5}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={TYPE.arrowLabel}
        textAnchor="middle"
        {...editableLineTextProps(
          { kind: 'asNeededAmount' },
          onElementClick,
        )}
      >
        As needed
        <tspan
          dx={7}
          fontFamily={FONT_SERIF}
          fontWeight={600}
          style={numericStyle}
          {...editableLineTextProps(
            { kind: 'asNeededAmount' },
            onElementClick,
            true,
          )}
        >
          {amountText.display}
        </tspan>
      </text>
    </g>
  )
}

function FootnoteLine({
  data,
  fontSize,
  footnote,
  onElementClick,
  onTextPointerDown,
  text,
  x,
  y,
}: {
  data: MoneyMapData
  fontSize: number
  footnote: Footnote
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  text: { display: string; exact: string }
  x: number
  y: number
}) {
  const edit = { kind: 'footnoteText', footnoteId: footnote.id } as const
  const block = {
    x: x - 360,
    y: y - fontSize - 3,
    w: 720,
    h: fontSize + 9,
  }
  const offset = mapTextOffset(
    data,
    'footnotes',
    'line',
    block,
    footnote.id,
  )
  return (
    <g transform={`translate(${offset.dx} ${offset.dy})`}>
      <rect
        x={block.x}
        y={block.y}
        width={block.w}
        height={block.h}
        {...editableHitAreaProps(
          edit,
          onElementClick,
          onTextPointerDown?.(edit),
        )}
      />
      <text
      x={x}
      y={y}
      fill={INK}
      fontFamily={FONT_SANS}
      fontSize={fontSize}
      textAnchor="middle"
      {...editableLineTextProps(
        edit,
        onElementClick,
        true,
      )}
      aria-label={text.exact}
    >
      {text.display}
      </text>
    </g>
  )
}

function Footnotes({
  data,
  onElementClick,
  onTextPointerDown,
  x,
  y,
}: {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  x: number
  y: number
}) {
  const lines = footnoteLineLayouts(data, y)
  if (lines.length === 0) return null
  const ruleY = lines[0].y - lines[0].fontSize - 3
  return (
    <g aria-label="Footnotes" role="group">
      <line
        x1={x - 110}
        y1={ruleY}
        x2={x + 110}
        y2={ruleY}
        stroke={HAIRLINE}
      />
      {lines.map((line) => (
        <FootnoteLine
          data={data}
          fontSize={line.fontSize}
          key={line.footnote.id}
          footnote={line.footnote}
          onElementClick={onElementClick}
          onTextPointerDown={onTextPointerDown}
          text={line.text}
          x={x}
          y={line.y}
        />
      ))}
    </g>
  )
}

function NoteBlock({
  onElementClick,
  placed,
}: {
  onElementClick?: (target: MapElementTarget) => void
  placed: PlacedNote
}) {
  const editProps = editableLineTextProps(
    { kind: 'noteText', noteId: placed.note.id },
    onElementClick,
    true,
  )
  return (
    <>
      {placed.note.bg && (
        <rect
          className="map-note-card"
          fill="#ffffff"
          height={placed.h + 20}
          rx={8}
          stroke={HAIRLINE}
          width={placed.w + 20}
          x={placed.x - 10}
          y={placed.y - 10}
        />
      )}
      <rect
        height={placed.h}
        width={placed.w}
        x={placed.x}
        y={placed.y}
        {...editableHitAreaProps(
          { kind: 'noteText', noteId: placed.note.id },
          onElementClick,
        )}
      />
      <text
        {...editProps}
        className={`map-note-text${
          editProps.className ? ` ${editProps.className}` : ''
        }`}
        fill={placed.note.bg ? INK : MUTED}
        fontFamily={FONT_SERIF}
        fontSize={placed.fontSize}
        x={placed.x}
        y={placed.y + placed.fontSize}
      >
        {placed.lines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={placed.x}
            dy={index === 0 ? 0 : placed.lineAdvance}
            {...editableLineTextProps(
              { kind: 'noteText', noteId: placed.note.id },
              onElementClick,
            )}
          >
            {line}
          </tspan>
        ))}
      </text>
    </>
  )
}



export interface AccountKeyboardActivation {
  selectedTargetKey: string
}

export function accountKeyboardActivation(
  key: string,
  accountId: string,
): AccountKeyboardActivation | null {
  if (key !== 'Enter' && key !== ' ') return null
  return { selectedTargetKey:
    accountId === 'income' || accountId === 'need'
      ? accountId
      : 'account:' + accountId }
}

export function MapSvg({
  selectedTargetKey: controlledSelectedTargetKey,
  onSelectedTargetChange,
  data,
  onElementClick,
  onChange,
  highlightId,
}: MapSvgProps) {
  const id = useId().replaceAll(':', '')
  const markerId = `flow-arrowhead-${id}`
  const customMarkerIds = Object.fromEntries(
    CUSTOM_ARROW_COLORS.map((color) => [
      color,
      `custom-arrowhead-${color}-${id}`,
    ]),
  ) as Record<CustomArrowColor, string>
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const suppressNextClickRef = useRef(false)
  const [previewData, setPreviewData] = useState<MoneyMapData | null>(
    null,
  )
  const [dragging, setDragging] = useState(false)
  const [snapping, setSnapping] = useState<AlignmentSnap | null>(null)
  const [localSelectedTargetKey, setLocalSelectedTargetKey] = useState<
    string | null
  >(null)
  const selectedTargetKey = onChange
    ? controlledSelectedTargetKey === undefined
      ? localSelectedTargetKey
      : controlledSelectedTargetKey
    : null

  const setSelectedTarget = (targetKey: string | null) => {
    if (controlledSelectedTargetKey === undefined) {
      setLocalSelectedTargetKey(targetKey)
    }
    onSelectedTargetChange?.(targetKey)
  }
  const displayData = previewData ?? data
  const layout = layoutMap(displayData)
  const asNeeded = layout.arrows.find((arrow) => arrow.kind === 'asNeeded')
  const alignmentRectsFor = (key: string) => {
    const asNeededChip = layoutOverrideRect(displayData, 'asNeededChip')
    return [
      { key: 'income', rect: layout.income },
      { key: 'need', rect: layout.need },
      ...layout.accounts.map((rect) => ({ key: rect.account.id, rect })),
      ...layout.notes.map((rect) => ({ key: rect.note.id, rect })),
      { key: 'asNeededChip', rect: asNeededChip },
    ].flatMap((candidate) =>
      candidate.key === key || !candidate.rect ? [] : [candidate.rect],
    )
  }
  const outlineForId = (endpointId: string | undefined) =>
    endpointId === 'income'
      ? layout.income
      : endpointId === 'need'
        ? layout.need
        : layout.accounts.find(
            (placed) => placed.account.id === endpointId,
          )
  const endpointLabelForId = (endpointId: string | undefined) => {
    if (endpointId === 'income') return 'Income sources'
    if (endpointId === 'need') return 'Monthly need'
    const account = data.accounts.find((candidate) => candidate.id === endpointId)
    return account ? accountDisplayName(account) : 'Map item'
  }

  const beginDrag = (
    key: string,
    mode: DragMode,
    startPlaced?: Placed,
    startArrow?: Arrow,
    startOutline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => {
    if (!onChange || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const screenCtm = svgRef.current?.getScreenCTM()
    if (!screenCtm) return
    const dragStartPlaced =
      mode === 'move'
        ? layoutOverrideRect(data, key) ?? startPlaced
        : startPlaced

    dragRef.current = {
      active: false,
      initialOverride: data.layoutOverrides?.[key] ?? {},
      inverseScreenCtm: screenCtm.inverse(),
      key,
      latestData: data,
      mode,
      pointerId: event.pointerId,
      startArrow,
      startOutline,
      startPlaced: dragStartPlaced,
      startScreen: { x: event.clientX, y: event.clientY },
      startedAt: performance.now(),
    }
  }
  const cancelDrag = () => {
    dragRef.current = null
    setDragging(false)
    setPreviewData(null)
    setSnapping(null)
  }
  const previewDrag = (event: PointerEvent<SVGSVGElement>) => {
    const session = dragRef.current
    if (!session || session.pointerId !== event.pointerId) return
    const currentScreen = { x: event.clientX, y: event.clientY }
    if (
      !session.active &&
      (session.mode === 'textMove' ||
      session.mode === 'flowLabelMove'
        ? accountTextPointerAction(
            session.startScreen,
            currentScreen,
            performance.now() - session.startedAt,
          ) === 'edit'
        : !crossedDragThreshold(session.startScreen, currentScreen))
    ) {
      return
    }
    if (!session.active) {
      session.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
    }
    event.preventDefault()

    const delta = screenDeltaToArtboard(
      {
        x: currentScreen.x - session.startScreen.x,
        y: currentScreen.y - session.startScreen.y,
      },
      session.inverseScreenCtm,
    )
    if (
      session.mode === 'flowLabelMove' &&
      session.startArrow?.id &&
      session.startArrow.labelAt
    ) {
      const record = data.customArrows?.find(
        (arrow) => arrow.id === session.startArrow!.id,
      )
      if (!record) return
      const desired = clampRectToBounds(
        {
          x: session.startArrow.labelAt.x + delta.x,
          y: session.startArrow.labelAt.y + delta.y,
          w: 0,
          h: 0,
        },
        OVERRIDE_BOUNDS,
      )
      const nextData = moveCustomArrowLabel(
        data,
        record.id,
        (record.labelDx ?? 0) +
          desired.x -
          session.startArrow.labelAt.x,
        (record.labelDy ?? 0) +
          desired.y -
          session.startArrow.labelAt.y,
      )
      session.latestData = nextData
      setPreviewData(nextData)
      return
    }
    if (session.mode === 'noteMove' && session.startPlaced) {
      const clamped = clampRectToBounds(
        {
          ...session.startPlaced,
          x: session.startPlaced.x + delta.x,
          y: session.startPlaced.y + delta.y,
        },
        OVERRIDE_BOUNDS,
      )
      const snapped = snapRectToAlignment(
        clamped,
        alignmentRectsFor(session.key),
        6,
        event.altKey,
      )
      setSnapping(snapped.x || snapped.y ? snapped : null)
      const nextData = moveMapNote(
        data,
        session.key,
        snapped.rect.x,
        snapped.rect.y,
      )
      session.latestData = nextData
      setPreviewData(nextData)
      return
    }
    if (session.mode === 'move' && session.startPlaced) {
      const clamped = clampRectToBounds(
        {
          ...session.startPlaced,
          x: session.startPlaced.x + delta.x,
          y: session.startPlaced.y + delta.y,
        },
        OVERRIDE_BOUNDS,
      )
      const snapped = snapRectToAlignment(
        clamped,
        alignmentRectsFor(session.key),
        6,
        event.altKey,
      )
      setSnapping(snapped.x || snapped.y ? snapped : null)
      const nextData = nudgeLayoutOverride(data, session.key, {
        x: snapped.rect.x - session.startPlaced.x,
        y: snapped.rect.y - session.startPlaced.y,
      })
      session.latestData = nextData
      setPreviewData(nextData)
      return
    }
    let patch: LayoutOverride
    if (session.mode === 'resize' && session.startPlaced) {
      const rotation = placedRotation(session.startPlaced)
      const radians = (-rotation * Math.PI) / 180
      const localDelta = {
        x:
          delta.x * Math.cos(radians) -
          delta.y * Math.sin(radians),
        y:
          delta.x * Math.sin(radians) +
          delta.y * Math.cos(radians),
      }
      patch = {
        w: session.startPlaced.w + localDelta.x,
        h: session.startPlaced.h + localDelta.y,
      }
    } else if (session.mode === 'rotate' && session.startPlaced) {
      const center = {
        x: session.startPlaced.x + session.startPlaced.w / 2,
        y: session.startPlaced.y + session.startPlaced.h / 2,
      }
      const startPoint = screenPointToArtboard(
        session.startScreen,
        session.inverseScreenCtm,
      )
      const currentPoint = screenPointToArtboard(
        currentScreen,
        session.inverseScreenCtm,
      )
      const startAngle = Math.atan2(
        startPoint.y - center.y,
        startPoint.x - center.x,
      )
      const currentAngle = Math.atan2(
        currentPoint.y - center.y,
        currentPoint.x - center.x,
      )
      patch = {
        rot: snapRotation(
          (session.initialOverride.rot ??
            placedRotation(session.startPlaced)) +
            ((currentAngle - startAngle) * 180) / Math.PI,
        ),
      }
    } else if (session.mode === 'arrowBow' && session.startArrow) {
      const perpendicularDelta = signedPerpendicularOffset(
        session.startArrow.start,
        session.startArrow.end,
        {
          x: session.startArrow.start.x + delta.x,
          y: session.startArrow.start.y + delta.y,
        },
      )
      patch = {
        bow:
          (session.initialOverride.bow ??
            session.startArrow.bow) +
          perpendicularDelta * 2,
      }
    } else if (
      (session.mode === 'arrowStart' ||
        session.mode === 'arrowEnd') &&
      session.startOutline
    ) {
      const artboardPoint = screenPointToArtboard(
        currentScreen,
        session.inverseScreenCtm,
      )
      const center = {
        x: session.startOutline.x + session.startOutline.w / 2,
        y: session.startOutline.y + session.startOutline.h / 2,
      }
      const clampedPoint = {
        x: Math.min(OVERRIDE_BOUNDS.right, Math.max(OVERRIDE_BOUNDS.left, artboardPoint.x)),
        y: Math.min(OVERRIDE_BOUNDS.bottom, Math.max(OVERRIDE_BOUNDS.top, artboardPoint.y)),
      }
      patch = {
        [session.mode === 'arrowStart' ? 'startAt' : 'endAt']: {
          dx: clampedPoint.x - center.x,
          dy: clampedPoint.y - center.y,
        },
      }
    } else {
      const nextData = nudgeLayoutOverride(data, session.key, delta)
      session.latestData = nextData
      setPreviewData(nextData)
      return
    }
    const nextData = withOverride(data, session.key, patch)
    session.latestData = nextData
    setPreviewData(nextData)
  }

  const finishDrag = (event: PointerEvent<SVGSVGElement>) => {
    const session = dragRef.current
    if (!session || session.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    setDragging(false)
    setSnapping(null)
    if (!session.active) return

    event.preventDefault()
    suppressNextClickRef.current = true
    window.setTimeout(() => {
      suppressNextClickRef.current = false
    }, 0)
    onChange?.(session.latestData)
  }

  const beginAccountTextDrag = (
    accountId: string,
    role: AccountTextRole,
  ) => beginDrag(accountTextOverrideKey(accountId, role), 'textMove')
  const beginFixedTextDrag: TextPointerDown = (target) => {
    const key = fixedTextOverrideKey(target)
    return key
      ? beginDrag(key, 'textMove')
      : (event) => event.stopPropagation()
  }

  const handleMapClickCapture = (event: MouseEvent<SVGSVGElement>) => {
    if (suppressNextClickRef.current) {
      suppressNextClickRef.current = false
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (!onChange || !(event.target instanceof Element)) return

    const element = event.target
    const note = element.closest<SVGElement>('[data-note-id]')
    const chip = element.closest<SVGElement>('[data-as-needed-chip]')
    const arrow = element.closest<SVGElement>('.map-arrow-editor')
    const target = element.closest<SVGElement>('[data-map-target]')
    const targetKey =
      note?.dataset.noteId
        ? `note:${note.dataset.noteId}`
        : chip
          ? 'asNeededChip'
          : arrow?.dataset.mapTarget ??
            target?.dataset.layoutKey ??
            target?.dataset.mapTarget ??
            null
    setSelectedTarget(targetKey)
  }

  const selectedAccountId =
    onChange && selectedTargetKey?.startsWith('account:')
      ? selectedTargetKey.slice('account:'.length)
      : null
  const selectedAccount = selectedAccountId
    ? layout.accounts.find(
        (placed) => placed.account.id === selectedAccountId,
      )
    : undefined
  const renderedAccounts = selectedAccount
    ? [
        ...layout.accounts.filter(
          (placed) => placed.account.id !== selectedAccountId,
        ),
        selectedAccount,
      ]
    : layout.accounts

  return (
    <svg
      data-selected-target={
        onChange && selectedTargetKey ? selectedTargetKey : undefined
      }
      onKeyDownCapture={(event) => {
        if (event.key === 'Escape') {
          if (!onChange) return
          event.preventDefault()
          if (dragRef.current) cancelDrag()
          setSelectedTarget(null)
          return
        }
        if (!onChange || !(event.target instanceof Element)) return
        const target = event.target
        if (target.matches('[data-connect-id]')) {
          const endpointId = target.getAttribute('data-connect-id')
          const activation = endpointId
            ? accountKeyboardActivation(event.key, endpointId)
            : null
          if (activation) {
            event.preventDefault()
            event.stopPropagation()
            setSelectedTarget(activation.selectedTargetKey)
            return
          }
        }
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
        const step = event.shiftKey ? 10 : 2
        const commit = (key: string, patch: LayoutOverride) => {
          event.preventDefault(); event.stopPropagation()
          onChange(withOverride(data, key, patch))
        }
        const commitNudge = (key: string) => {
          event.preventDefault(); event.stopPropagation()
          onChange(nudgeLayoutOverride(data, key, {
            x: event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0,
            y: event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0,
          }))
        }
        const textKey = target.closest('[data-layout-key]')?.getAttribute('data-layout-key')
        if (textKey && arrowKeys.includes(event.key) && !event.altKey && !event.ctrlKey && !event.metaKey) {
          commitNudge(textKey)
          return
        }
        const arrowNode = target.closest('.map-arrow-editor')
        if (arrowNode && event.ctrlKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
          const index = Array.from(event.currentTarget.querySelectorAll('.map-arrow-editor')).indexOf(arrowNode)
          const arrow = layout.arrows[index]
          if (arrow?.kind !== 'custom' || !arrow.id) return
          const field = event.key === 'ArrowLeft' ? 'sourceId' : 'targetId'
          const other = field === 'sourceId' ? arrow.targetId : arrow.sourceId
          const current = field === 'sourceId' ? arrow.sourceId : arrow.targetId
          const endpoints = ['income', 'need', ...data.accounts.map((account) => account.id)]
          const start = Math.max(0, endpoints.indexOf(current ?? ''))
          const next = Array.from({ length: endpoints.length }, (_, offset) => endpoints[(start + offset + 1) % endpoints.length]).find((candidate) => candidate !== other)
          if (!next) return
          event.preventDefault(); event.stopPropagation()
          onChange(retargetCustomArrow(data, arrow.id, field, next))
          return
        }
        const object = target.closest('[data-connect-id][role="group"]')
        const key = object?.getAttribute('data-connect-id')
        if (!key || (!arrowKeys.includes(event.key) && event.key !== '[' && event.key !== ']')) return
        const placed = key === 'income' ? layout.income : key === 'need' ? layout.need : layout.accounts.find((item) => item.account.id === key)
        if (!placed) return
        const value = data.layoutOverrides?.[key] ?? {}
        if (event.altKey && arrowKeys.includes(event.key) && key !== 'need') commit(key, { w: placed.w + (event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0), h: placed.h + (event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0) })
        else if (!event.altKey && !event.ctrlKey && !event.metaKey && arrowKeys.includes(event.key)) commitNudge(key)
        else if (!event.altKey && !event.ctrlKey && !event.metaKey && key !== 'income' && key !== 'need') commit(key, { rot: snapRotation((value.rot ?? placedRotation(placed)) + (event.key === ']' ? 15 : -15)) })
      }}
      aria-label={`Money Map for ${displayData.client.title}`}
      className={[
        onChange ? 'map-interactive' : '',
        dragging ? 'is-dragging' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={svgRef}
      role={onChange ? 'group' : 'img'}
      viewBox={`0 0 ${ARTBOARD.width} ${ARTBOARD.height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClickCapture={
        onChange ? handleMapClickCapture : undefined
      }
      onPointerCancel={onChange ? cancelDrag : undefined}
      onPointerMove={onChange ? previewDrag : undefined}
      onPointerUp={onChange ? finishDrag : undefined}
    >
      <rect
        data-map-background="true"
        width={ARTBOARD.width}
        height={ARTBOARD.height}
        fill={PAPER}
      />
      <rect
        data-map-background="true"
        x={24}
        y={24}
        width={1272}
        height={972}
        fill="none"
        stroke={HAIRLINE}
      />
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 8 8"
          markerWidth={8}
          markerHeight={8}
          refX={7.5}
          refY={4}
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M 0 0 L 8 4 L 0 8 Z" fill={FLOW_GREEN} />
        </marker>
        {CUSTOM_ARROW_COLORS.map((color) => (
          <marker
            key={color}
            id={customMarkerIds[color]}
            viewBox="0 0 8 8"
            markerWidth={8}
            markerHeight={8}
            refX={7.5}
            refY={4}
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 Z"
              fill={ARROW_COLORS[color]}
            />
          </marker>
        ))}
      </defs>

      <g aria-label="Money flow" role="group">
        {layout.arrows.map((arrow, index) => {
          if (!onChange) {
            return (
              <g key={`${arrow.kind}-${arrow.id ?? index}`}>
                <ArrowPath
                  arrow={arrow}
                  customMarkerIds={customMarkerIds}
                  markerId={markerId}
                />
                <FlowArrowLabel arrow={arrow} />
              </g>
            )
          }
          const key =
            arrow.kind === 'custom'
              ? `arrow:custom:${arrow.id}`
              : `arrow:${arrow.kind}`
          const source =
            arrow.kind === 'custom'
              ? outlineForId(arrow.sourceId)
              : arrow.kind === 'income'
                ? layout.income
                : layout.accounts.find(
                    (placed) =>
                      placed.account.id === arrow.sourceId,
                  )
          const target =
            arrow.kind === 'custom'
              ? outlineForId(arrow.targetId)
              : arrow.kind === 'income' || arrow.kind === 'asNeeded'
                ? layout.need
                : layout.accounts.find(
                    (placed) =>
                      placed.account.id === arrow.targetId,
                  )
          return (
            <ArrowEditor
              accessibleName={
                arrow.kind === 'custom'
                  ? `Adjust flow from ${endpointLabelForId(arrow.sourceId)} to ${endpointLabelForId(arrow.targetId)}`
                  : `Adjust ${arrow.kind === 'asNeeded' ? 'account withdrawal' : arrow.kind} flow`
              }
              key={`${arrow.kind}-${arrow.id ?? index}`}
              arrow={arrow}
              customMarkerIds={customMarkerIds}
              markerId={markerId}
              onElementClick={onElementClick}
              onSelect={() => setSelectedTarget(key)}
              onBeginDrag={(mode) =>
                beginDrag(
                  key,
                  mode,
                  undefined,
                  arrow,
                  mode === 'arrowStart' ? source : target,
                )
              }
              selected={selectedTargetKey === key}
              targetKey={key}
            />
          )
        })}
      </g>
      <Masthead
        data={displayData}
        onElementClick={onElementClick}
        onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
      />
      <g
        data-connect-id={onChange ? 'income' : undefined}
        data-map-selected={selectedTargetKey === 'income' ? 'true' : undefined}
        data-map-target={onChange ? 'income' : undefined}
        aria-keyshortcuts={onChange ? 'ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight Enter Space' : undefined}
        {...interactiveGroupProps(
          'Income sources',
          { kind: 'income' },
          onElementClick,
        )}
        className={onChange ? 'map-draggable' : undefined}
        onPointerDown={
          onChange
            ? beginDrag('income', 'move', layout.income)
            : undefined
        }
      >
        <IncomePanel
          data={displayData}
          onElementClick={onElementClick}
          onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
          placed={layout.income}
        />
      </g>
      <g
        data-connect-id={onChange ? 'need' : undefined}
        data-map-selected={selectedTargetKey === 'need' ? 'true' : undefined}
        data-map-target={onChange ? 'need' : undefined}
        aria-keyshortcuts={onChange ? 'ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Enter Space' : undefined}
        {...interactiveGroupProps(
          'Monthly income need',
          { kind: 'need' },
          onElementClick,
        )}
        className={onChange ? 'map-draggable' : undefined}
        onPointerDown={
          onChange
            ? beginDrag('need', 'move', layout.need)
            : undefined
        }
      >
        <NeedCard
          data={displayData}
          mathLine={gapLine(
            displayData.monthlyNeed,
            displayData.afterTaxIncome,
            displayData.asNeededAmount,
            displayData.showMath !== false,
          )}
          onElementClick={onElementClick}
          onSupportingFocus={() =>
            setSelectedTarget(mapTextOverrideKey('need', 'supporting'))
          }
          onSupportingPointerDown={
            onChange
              ? beginDrag(
                  mapTextOverrideKey('need', 'supporting'),
                  'textMove',
                )
              : undefined
          }
          onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
          tag={displayData.needTag}
          value={displayData.monthlyNeed}
          placed={layout.need}
          supportingSelected={
            selectedTargetKey === mapTextOverrideKey('need', 'supporting')
          }
        />
      </g>
      <g aria-label="Accounts" role="group">
        {renderedAccounts.map((placed) => {
          const style = BUCKETS[placed.account.bucket]
          const shape = accountShape(placed.account)
          const runway =
            placed.account.bucket === 'shortTerm'
              ? runwayLine(
                  placed.account.value,
                  displayData.asNeededAmount,
                  displayData.showMath !== false,
                )
              : null
          return (
            <g
              data-account-id={placed.account.id}
              data-map-target={
                onChange ? 'account:' + placed.account.id : undefined
              }
              data-map-selected={
                selectedTargetKey === 'account:' + placed.account.id
                  ? 'true'
                  : undefined
              }
              data-account-shape={shape}
              data-connect-id={onChange ? placed.account.id : undefined}
              aria-keyshortcuts={onChange ? 'ArrowUp ArrowDown ArrowLeft ArrowRight Shift+ArrowUp Shift+ArrowDown Shift+ArrowLeft Shift+ArrowRight Alt+ArrowUp Alt+ArrowDown Alt+ArrowLeft Alt+ArrowRight BracketLeft BracketRight Enter Space' : undefined}
              key={placed.account.id}
              {...interactiveGroupProps(
                accountDisplayName(placed.account),
                { kind: 'account', id: placed.account.id },
                onElementClick,
              )}
              className={onChange ? 'map-draggable' : undefined}
              transform={
                placed.rot === 0
                  ? undefined
                  : `rotate(${placed.rot} ${
                      placed.x + placed.w / 2
                    } ${placed.y + placed.h / 2})`
              }
              onPointerDown={
                onChange
                  ? beginDrag(placed.account.id, 'move', placed)
                  : undefined
              }
            >
              {highlightId === placed.account.id && (
                <rect
                  data-highlight-halo={placed.account.id}
                  fill="none"
                  height={placed.h + 12}
                  opacity={0.35}
                  pointerEvents="none"
                  rx={18}
                  stroke={style.stroke}
                  strokeWidth={4}
                  width={placed.w + 12}
                  x={placed.x - 6}
                  y={placed.y - 6}
                />
              )}
              {shape === 'drum' ? (
                <Cylinder
                  onElementClick={onElementClick}
                  onTextPointerDown={
                    onChange ? beginAccountTextDrag : undefined
                  }
                  placed={placed}
                  runway={runway}
                />
              ) : (
                <FlatAccount
                  onElementClick={onElementClick}
                  onTextPointerDown={
                    onChange ? beginAccountTextDrag : undefined
                  }
                  placed={placed}
                  runway={runway}
                  shape={shape}
                />
              )}
            </g>
          )
        })}
      </g>

      {asNeeded && (
        <g
          data-map-target={onChange ? 'asNeededChip' : undefined}
          className={onChange ? 'map-draggable' : undefined}
          onPointerDown={
            onChange
              ? beginDrag('asNeededChip', 'move')
              : undefined
          }
        >
          <AsNeededLabel
            arrow={asNeeded}
            amount={displayData.asNeededAmount}
            onElementClick={onElementClick}
            selected={selectedTargetKey === 'asNeededChip'}
          />
        </g>
      )}
      <g aria-label="Map notes" role="group">
        {layout.notes.map((placed) => (
          <g
            aria-label={onChange ? `Adjust note: ${placed.note.text}` : undefined}
            className={onChange ? 'map-draggable map-note' : 'map-note'}
            data-map-selected={
              selectedTargetKey === `note:${placed.note.id}`
                ? 'true'
                : undefined
            }
            data-map-target={onChange ? `note:${placed.note.id}` : undefined}
            data-note-id={placed.note.id}
            key={placed.note.id}
            onFocus={onChange ? () => setSelectedTarget(`note:${placed.note.id}`) : undefined}
            onPointerDown={
              onChange
                ? beginDrag(
                    placed.note.id,
                    'noteMove',
                    placed,
                  )
                : undefined
            }
            role={onChange ? 'group' : undefined}
            tabIndex={onChange ? 0 : undefined}
          >
            <NoteBlock
              onElementClick={onElementClick}
              placed={placed}
            />
          </g>
        ))}
      </g>
      <Footnotes
        data={displayData}
        onElementClick={onElementClick}
        onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
        x={layout.footnotesAt.x}
        y={layout.footnotesAt.y}
      />
      {onChange && dragging && snapping && (
        <g
          aria-hidden="true"
          className="map-alignment-guides"
          pointerEvents="none"
        >
          {snapping.x && (
            <line
              data-map-alignment-guide="x"
              stroke={MUTED}
              strokeDasharray="4 4"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              x1={snapping.x.value}
              x2={snapping.x.value}
              y1={Math.min(snapping.rect.y, snapping.x.rect.y) - 24}
              y2={Math.max(
                snapping.rect.y + snapping.rect.h,
                snapping.x.rect.y + snapping.x.rect.h,
              ) + 24}
            />
          )}
          {snapping.y && (
            <line
              data-map-alignment-guide="y"
              stroke={MUTED}
              strokeDasharray="4 4"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              x1={Math.min(snapping.rect.x, snapping.y.rect.x) - 24}
              x2={Math.max(
                snapping.rect.x + snapping.rect.w,
                snapping.y.rect.x + snapping.y.rect.w,
              ) + 24}
              y1={snapping.y.value}
              y2={snapping.y.value}
            />
          )}
        </g>
      )}
    </svg>
  )
}
