import {
  useEffect,
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
  incomeTextSizes,
  layoutMap,
  mapTextOffset,
  nearestOutlineT,
  OVERRIDE_BOUNDS,
  pointOnOutline,
} from '../layout/layout'
import type {
  Arrow,
  OutlineElement,
  Placed,
  PlacedAccount,
  PlacedNote,
  SubAccountLayout,
} from '../layout/layout'
import {
  accountDisplayName,
  mastheadPeriodLabel,
  money,
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
  mapTextOverrideKey,
  nextAccountShape,
} from '../model/types'
import type {
  MapTextEditRect,
  MapTextEditTarget,
} from '../ui/MapTextEditor'
import { mapTextEditTargetKey } from '../ui/MapTextEditor'
import {
  addCustomArrow,
  accountTextPointerAction,
  clampRectToBounds,
  crossedDragThreshold,
  cycleCustomArrowStyle,
  deleteCustomArrow,
  deleteMapNote,
  hideGeneratedArrow,
  moveCustomArrowLabel,
  moveMapNote,
  resizeMapNote,
  setCustomArrowColor,
  setMapNoteBackground,
  snapRotation,
  screenDeltaToArtboard,
  screenPointToArtboard,
  signedPerpendicularOffset,
  withOverride,
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
    }

interface MapSvgProps {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onChange?: (data: MoneyMapData) => void
  highlightId?: string | null
}

interface MapEditDataAttributes {
  'data-edit-line-node'?: string
  'data-map-edit-hit'?: string
  'data-map-edit-key'?: string
}

type DragMode =
  | 'move'
  | 'resize'
  | 'rotate'
  | 'arrowBow'
  | 'arrowStart'
  | 'arrowEnd'
  | 'connect'
  | 'noteMove'
  | 'noteResize'
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
  sourceId?: string
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
    onKeyDown: (event: KeyboardEvent<SVGGElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      activate()
    },
    role: 'button',
    style: { cursor: 'pointer' },
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
    })
  }
  return {
    className: 'map-editable-text',
    'data-edit-line-node': mapTextEditTargetKey(edit),
    'data-map-edit-key': mapTextEditTargetKey(edit),
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
    })
  }
  return {
    className: 'map-editable-hit',
    'data-map-edit-hit': mapTextEditTargetKey(edit),
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

function mastheadLabel(data: MoneyMapData): string {
  const period = mastheadPeriodLabel(data.client)
  const label = data.client.mastheadLabel?.trim() || 'Money Map'
  if (data.client.variant === 'postNote') {
    return `${label} — ${period}`
  }
  return `${label} ${period}`
}

function fixedTextOverrideKey(target: MapTextEditTarget): string | null {
  switch (target.kind) {
    case 'incomeHeader':
      return mapTextOverrideKey('income', 'header')
    case 'incomeAmount':
      return mapTextOverrideKey('income', 'row')
    case 'afterTaxIncome':
      return mapTextOverrideKey('income', 'total')
    case 'needLabel':
      return mapTextOverrideKey('need', 'label')
    case 'monthlyNeed':
      return mapTextOverrideKey('need', 'value')
    case 'footnoteText':
      return mapTextOverrideKey('footnotes', 'line')
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
        fontSize={TYPE.masthead}
        fontWeight={600}
      >
        {data.client.title}
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
        >
          {mastheadLabel(data).toUpperCase()}
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
  x,
  y,
}: {
  fontSize: number
  index: number
  onElementClick?: (target: MapElementTarget) => void
  valueOffset: number
  source: IncomeSource
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
        {...editableLineTextProps(
          { kind: 'incomeAmount', incomeIndex: index },
          onElementClick,
        )}
      >
        {source.label}
      </text>
      <text
        x={x}
        y={y + valueOffset}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={fontSize}
        fontWeight={600}
        style={numericStyle}
        {...editableLineTextProps(
          { kind: 'incomeAmount', incomeIndex: index },
          onElementClick,
          true,
        )}
      >
        <tspan
          {...editableLineTextProps(
            { kind: 'incomeAmount', incomeIndex: index },
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
              { kind: 'incomeAmount', incomeIndex: index },
              onElementClick,
            )}
          >
            {source.qualifier}
          </tspan>
        )}
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
        const edit = { kind: 'incomeAmount', incomeIndex: index } as const
        const rowBlock = {
          x: placed.x + 12,
          y:
            placed.y +
            firstRowY +
            index * rowPitch -
            rowFs * (13 / 14) -
            5,
          w: placed.w - 24,
          h: rowPitch,
        }
        const offset = mapTextOffset(data, 'income', 'row', rowBlock)
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
          {...editableLineTextProps(totalEdit, onElementClick)}
        >
          After-Tax Income
        </text>
        <text
          x={placed.x + placed.w - 20}
          y={dividerY + 31}
          fill={FLOW_GREEN}
          fontFamily={FONT_SERIF}
          fontSize={totalFs}
          fontWeight={600}
          textAnchor="end"
          style={numericStyle}
          {...editableLineTextProps(totalEdit, onElementClick, true)}
        >
          {money(data.afterTaxIncome)}
        </text>
      </g>
    </g>
  )
}

function NeedCard({
  data,
  mathLine,
  onElementClick,
  onTextPointerDown,
  tag,
  value,
  placed,
}: {
  data: MoneyMapData
  mathLine: string | null
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  tag?: string
  value: number | null
  placed: Placed
}) {
  const labelFs = fixedTextFs(data, 'need', 'label', TYPE.needLabel)
  const valueFs = fixedTextFs(data, 'need', 'value', TYPE.needValue)
  const labelEdit = { kind: 'needLabel' } as const
  const labelOffset = mapTextOffset(data, 'need', 'label', {
    x: placed.x + 12,
    y: placed.y + 31,
    w: placed.w - 24,
    h: 38,
  })
  const valueEdit = { kind: 'monthlyNeed' } as const
  const valueOffset = mapTextOffset(data, 'need', 'value', {
    x: placed.x + 12,
    y: placed.y + 75,
    w: placed.w - 24,
    h: 52,
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
          x={placed.x + 12}
          y={placed.y + 31}
          width={placed.w - 24}
          height={38}
          {...editableHitAreaProps(
            labelEdit,
            onElementClick,
            onTextPointerDown?.(labelEdit),
          )}
        />
        <text
          x={placed.x + placed.w / 2}
          y={placed.y + 58}
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
        >
          MONTHLY INCOME NEED
        </text>
      </g>
      <g transform={`translate(${valueOffset.dx} ${valueOffset.dy})`}>
        <rect
          x={placed.x + 12}
          y={placed.y + 75}
          width={placed.w - 24}
          height={52}
          {...editableHitAreaProps(
            valueEdit,
            onElementClick,
            onTextPointerDown?.(valueEdit),
          )}
        />
        <text
          x={placed.x + placed.w / 2}
          y={placed.y + 111}
          fill={NEED_RED}
          fontFamily={FONT_SERIF}
          fontSize={valueFs}
          fontWeight={600}
          textAnchor="middle"
          {...editableLineTextProps(valueEdit, onElementClick)}
        >
          <tspan
            style={numericStyle}
            {...editableLineTextProps(valueEdit, onElementClick, true)}
          >
            {money(value)}
          </tspan>
          {tag && (
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
      {mathLine && (
        <text
          x={placed.x + placed.w / 2}
          y={placed.y + 139}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.mathNote}
          textAnchor="middle"
        >
          {mathLine}
        </text>
      )}
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
        cy={y + capRy}
        rx={w / 2}
        ry={capRy}
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
        {...editableLineTextProps(
          { kind: 'accountSub', accountId },
          onElementClick,
        )}
      >
        {layout.titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2}
            dy={index === 0 ? 0 : layout.titleLeading}
            {...editableLineTextProps(
              { kind: 'accountSub', accountId },
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
          {...editableLineTextProps(
            { kind: 'accountSub', accountId },
            onElementClick,
          )}
        >
          {layout.captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2}
              dy={index === 0 ? 0 : layout.captionLeading}
              {...editableLineTextProps(
                { kind: 'accountSub', accountId },
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
        {...editableLineTextProps(
          { kind: 'accountSub', accountId },
          onElementClick,
        )}
      >
        {money(subAccount.value)}
      </text>
      </g>
    </g>
  )
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
    x,
    y,
    w,
  } = placed
  const style = BUCKETS[account.bucket]
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
        {...editableTextProps(
          { kind: 'accountLabel', accountId: account.id },
          onElementClick,
          onTextPointerDown?.(account.id, 'label'),
        )}
      >
        {titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2 + text.titleX}
            dy={index === 0 ? 0 : text.titleLeading}
            {...editableTextProps(
              { kind: 'accountLabel', accountId: account.id },
              onElementClick,
            )}
          >
            {line}
          </tspan>
        ))}
      </text>
      {text.captionY !== undefined && (
        <text
          x={x + w / 2 + text.captionX}
          y={y + text.captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={text.captionFontSize}
          textAnchor="middle"
          {...editableTextProps(
            { kind: 'accountCaption', accountId: account.id },
            onElementClick,
            onTextPointerDown?.(account.id, 'caption'),
          )}
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2 + text.captionX}
              dy={index === 0 ? 0 : text.captionLeading}
              {...editableTextProps(
                { kind: 'accountCaption', accountId: account.id },
                onElementClick,
              )}
            >
              {line}
            </tspan>
          ))}
        </text>
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
              {...editableLineTextProps(
                { kind: 'accountRows', accountId: account.id },
                onElementClick,
              )}
            >
              {row.labelLines.map((line, lineIndex) => (
                <tspan
                  key={`${line}-${lineIndex}`}
                  x={x + row.leftX}
                  dy={lineIndex === 0 ? 0 : text.rowLeading}
                  {...editableLineTextProps(
                    { kind: 'accountRows', accountId: account.id },
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
              {...editableLineTextProps(
                { kind: 'accountRows', accountId: account.id },
                onElementClick,
              )}
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
        {...editableTextProps(
          { kind: 'accountValue', accountId: account.id },
          onElementClick,
          onTextPointerDown?.(account.id, 'value'),
        )}
      >
        <tspan
          style={numericStyle}
          {...editableTextProps(
            { kind: 'accountValue', accountId: account.id },
            onElementClick,
          )}
        >
          {money(account.value)}
        </tspan>
        {account.valueTag && (
          <tspan
            fill={MUTED}
            fontStyle="italic"
            fontWeight={400}
            {...editableTextProps(
              { kind: 'accountValue', accountId: account.id },
              onElementClick,
            )}
          >
            {` ${account.valueTag}`}
          </tspan>
        )}
      </text>
      {runway && (
        <text
          x={x + w / 2}
          y={y + text.runwayY!}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.runway}
          textAnchor="middle"
        >
          {runway}
        </text>
      )}
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
        <path d={hexagonPath(x, y, w, h)} {...outlineProps} />
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={radius}
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

function ShapeFlipGlyph({
  shape,
  x,
  y,
}: {
  shape: AccountShape
  x: number
  y: number
}) {
  if (shape === 'drum') {
    return (
      <>
        <path
          d={`M ${x} ${y + 2} L ${x} ${y + 8} A 6 2 0 0 0 ${x + 12} ${y + 8} L ${x + 12} ${y + 2}`}
          fill="none"
        />
        <ellipse cx={x + 6} cy={y + 2} rx={6} ry={2} fill="none" />
      </>
    )
  }
  if (shape === 'rect') {
    return <path d={hexagonPath(x, y, 12, 10)} fill="none" />
  }
  return (
    <rect
      x={x}
      y={y}
      width={12}
      height={10}
      rx={shape === 'card' ? 2 : shape === 'pill' ? 5 : 0.5}
      fill="none"
    />
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
        d={cylinderBody(x, y, w, h, capRy)}
        fill={style.tint}
        stroke={style.stroke}
        strokeDasharray={dash}
        strokeWidth={2.5}
      />
      <ellipse
        cx={centerX}
        cy={y + capRy}
        rx={w / 2}
        ry={capRy}
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
  const style = custom ? (arrow.style ?? 'solid') : undefined
  const colorName = resolveCustomArrowColor(style, arrow.color)
  const color = ARROW_COLORS[colorName]
  const dotted = style === 'dotted'
  const dashed = style === 'dashed' || asNeeded
  return (
    <path
      data-arrow-color={custom ? colorName : undefined}
      data-arrow-kind={arrow.kind}
      data-arrow-style={style}
      d={arrow.d}
      fill="none"
      markerEnd={`url(#${
        custom ? customMarkerIds[colorName] : markerId
      })`}
      stroke={custom ? color : FLOW_GREEN}
      strokeDasharray={dotted ? '0.1 9' : dashed ? '7 6' : undefined}
      strokeLinecap={dotted ? 'round' : 'butt'}
      strokeWidth={dotted ? 3.5 : 2}
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
      className={`map-flow-label${
        onElementClick ? ' map-editable-text' : ''
      }`}
    >
      {arrow.label}
    </text>
  )
}

function ArrowEditor({
  arrow,
  customMarkerIds,
  markerId,
  onBeginDrag,
  onColorChange,
  onDelete,
  onElementClick,
  onStyleCycle,
}: {
  arrow: Arrow
  customMarkerIds: Record<CustomArrowColor, string>
  markerId: string
  onBeginDrag: (
    mode: DragMode,
    outline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => void
  onColorChange?: (color: CustomArrowColor) => void
  onDelete?: () => void
  onElementClick?: (target: MapElementTarget) => void
  onStyleCycle?: () => void
}) {
  const midpoint = {
    x:
      (arrow.start.x +
        2 * arrow.control.x +
        arrow.end.x) /
      4,
    y:
      (arrow.start.y +
        2 * arrow.control.y +
        arrow.end.y) /
      4,
  }
  return (
    <g
      aria-label={`Adjust ${arrow.kind} arrow`}
      className="map-arrow-editor"
      role="button"
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
      {[
        ['arrowStart', arrow.start],
        ['arrowBow', midpoint],
        ['arrowEnd', arrow.end],
      ].map(([mode, point]) => (
        <circle
          key={mode as string}
          aria-label={`${String(mode).replace('arrow', '')} handle`}
          className="map-arrow-handle"
          cx={(point as Point).x}
          cy={(point as Point).y}
          r={7}
          onPointerDown={onBeginDrag(mode as DragMode)}
        />
      ))}
      {onDelete && (
        <g
          aria-label={`Delete ${arrow.kind === 'custom' ? 'flow' : arrow.kind} arrow`}
          className="map-arrow-delete"
          role="button"
          tabIndex={0}
          transform={`translate(${midpoint.x + 18} ${midpoint.y - 18})`}
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            event.stopPropagation()
            onDelete()
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <circle r={9} />
          <text dy={4} textAnchor="middle">
            ×
          </text>
        </g>
      )}
      {onStyleCycle && (
        <g
          aria-label={`Change flow style from ${arrow.style ?? 'solid'}`}
          className="map-arrow-style"
          role="button"
          tabIndex={0}
          transform={`translate(${midpoint.x - 23} ${midpoint.y - 21})`}
          onClick={(event) => {
            event.stopPropagation()
            onStyleCycle()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            event.stopPropagation()
            onStyleCycle()
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <rect x={-11} y={-8} width={22} height={16} rx={8} />
          <text dy={4} textAnchor="middle">
            {arrow.style === 'dotted'
              ? '···'
              : arrow.style === 'dashed'
                ? '– –'
                : '—'}
          </text>
        </g>
      )}
      {onColorChange && (
        <g
          aria-label="Flow color"
          className="map-arrow-colors"
          transform={`translate(${midpoint.x - 48} ${midpoint.y + 46})`}
        >
          {CUSTOM_ARROW_COLORS.map((color, index) => {
            const current =
              resolveCustomArrowColor(arrow.style, arrow.color) === color
            return (
              <g
                key={color}
                aria-label={`${color} flow color`}
                className="map-arrow-color-swatch"
                onClick={(event) => {
                  event.stopPropagation()
                  onColorChange(color)
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return
                  event.preventDefault()
                  event.stopPropagation()
                  onColorChange(color)
                }}
                onPointerDown={(event) => event.stopPropagation()}
                role="button"
                tabIndex={0}
              >
                {current && (
                  <circle
                    className="map-arrow-color-ring"
                    cx={index * 16}
                    cy={0}
                    r={7}
                  />
                )}
                <circle
                  cx={index * 16}
                  cy={0}
                  fill={ARROW_COLORS[color]}
                  r={5}
                />
              </g>
            )
          })}
        </g>
      )}
      {arrow.kind === 'custom' && !arrow.label && arrow.id && (
        <text
          x={midpoint.x}
          y={midpoint.y + 29}
          aria-label="Add flow label"
          textAnchor="middle"
          {...editableTextProps(
            { kind: 'flowLabel', arrowId: arrow.id },
            onElementClick,
            (event) => event.stopPropagation(),
          )}
          className="map-arrow-label-add map-editable-text"
        >
          aa
        </text>
      )}
    </g>
  )
}

function ConnectHandle({
  endpointId,
  label,
  onBegin,
  placed,
}: {
  endpointId: string
  label: string
  onBegin: (
    sourceId: string,
    source: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => void
  placed: OutlineElement
}) {
  const x = placed.x + placed.w + 22
  const y = placed.y + placed.h / 2
  return (
    <g
      aria-label={`Connect from ${label}`}
      className="map-connect-handle"
      role="button"
      tabIndex={0}
      onPointerDown={onBegin(endpointId, placed)}
    >
      <circle cx={x} cy={y} r={9} />
      <path
        className="map-connect-glyph"
        d={`M ${x - 5} ${y} H ${x + 5} M ${x + 1} ${y - 4} L ${
          x + 5
        } ${y} L ${x + 1} ${y + 4}`}
      />
    </g>
  )
}

function AsNeededLabel({
  arrow,
  amount,
  onElementClick,
}: {
  arrow: Arrow
  amount: number | null
  onElementClick?: (target: MapElementTarget) => void
}) {
  if (!arrow.labelAt) return null
  return (
    <g>
      <rect
        x={arrow.labelAt.x - 125}
        y={arrow.labelAt.y - 19}
        width={250}
        height={38}
        rx={8}
        fill="#ffffff"
        stroke={HAIRLINE}
      />
      <rect
        x={arrow.labelAt.x - 118}
        y={arrow.labelAt.y - 15}
        width={236}
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
        Monthly Income as Needed
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
          {money(amount)}
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
  x,
  y,
}: {
  data: MoneyMapData
  fontSize: number
  footnote: Footnote
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  x: number
  y: number
}) {
  const edit = { kind: 'footnoteText' } as const
  const block = {
    x: x - 360,
    y: y - fontSize - 3,
    w: 720,
    h: fontSize + 9,
  }
  const offset = mapTextOffset(data, 'footnotes', 'line', block)
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
    >
      {footnote.label}:{' '}
      <tspan
        fontFamily={FONT_SERIF}
        fontWeight={600}
        style={numericStyle}
        {...editableLineTextProps(
          edit,
          onElementClick,
        )}
      >
        {money(footnote.gross)}
      </tspan>
      {' → '}
      <tspan
        fill={FLOW_GREEN}
        fontFamily={FONT_SERIF}
        fontWeight={600}
        style={numericStyle}
        {...editableLineTextProps(
          edit,
          onElementClick,
        )}
      >
        {money(footnote.net)}
      </tspan>{' '}
      after withholding
      </text>
    </g>
  )
}

function Footnotes({
  data,
  footnotes,
  onElementClick,
  onTextPointerDown,
  x,
  y,
}: {
  data: MoneyMapData
  footnotes: Footnote[]
  onElementClick?: (target: MapElementTarget) => void
  onTextPointerDown?: TextPointerDown
  x: number
  y: number
}) {
  if (footnotes.length === 0) return null
  const fontSize = fixedTextFs(
    data,
    'footnotes',
    'line',
    TYPE.footnote,
  )
  const lineAdvance = 24 * (fontSize / TYPE.footnote)
  return (
    <g aria-label="Footnotes">
      <line
        x1={x - 110}
        y1={y - 18}
        x2={x + 110}
        y2={y - 18}
        stroke={HAIRLINE}
      />
      {footnotes.map((footnote, index) => (
        <FootnoteLine
          data={data}
          fontSize={fontSize}
          key={`${footnote.label}-${index}`}
          footnote={footnote}
          onElementClick={onElementClick}
          onTextPointerDown={onTextPointerDown}
          x={x}
          y={y + index * lineAdvance}
        />
      ))}
    </g>
  )
}

function NoteBlock({
  onBackgroundToggle,
  onDelete,
  onElementClick,
  onResize,
  placed,
}: {
  onBackgroundToggle?: () => void
  onDelete?: () => void
  onElementClick?: (target: MapElementTarget) => void
  onResize?: (event: PointerEvent<SVGElement>) => void
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
      {onDelete && (
        <g
          aria-label="Delete note"
          className="map-note-delete"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation()
            onDelete()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            event.stopPropagation()
            onDelete()
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <rect
            height={20}
            rx={10}
            width={20}
            x={placed.x + placed.w - 20}
            y={placed.y - 4}
          />
          <text
            textAnchor="middle"
            x={placed.x + placed.w - 10}
            y={placed.y + 11}
          >
            ×
          </text>
        </g>
      )}
      {onBackgroundToggle && (
        <g
          aria-label="Toggle note background"
          className="map-note-background"
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.stopPropagation()
            onBackgroundToggle()
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return
            event.preventDefault()
            event.stopPropagation()
            onBackgroundToggle()
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <rect
            height={20}
            rx={10}
            width={20}
            x={placed.x + placed.w - 44}
            y={placed.y - 4}
          />
          <rect
            className="map-note-background-glyph"
            fill={placed.note.bg ? INK : 'none'}
            height={8}
            rx={2}
            width={10}
            x={placed.x + placed.w - 39}
            y={placed.y + 2}
          />
        </g>
      )}
      {onResize && (
        <rect
          aria-label="Resize note"
          className="map-note-resize"
          height={Math.max(24, placed.h)}
          rx={4}
          width={8}
          x={placed.x + placed.w - 4}
          y={placed.y}
          onPointerDown={onResize}
        />
      )}
    </>
  )
}

export function MapSvg({
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
  const [connectPreview, setConnectPreview] = useState<{
    start: Point
    end: Point
  } | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const displayData = previewData ?? data
  const layout = layoutMap(displayData)
  const asNeeded = layout.arrows.find((arrow) => arrow.kind === 'asNeeded')
  const outlineForId = (endpointId: string | undefined) =>
    endpointId === 'income'
      ? layout.income
      : endpointId === 'need'
        ? layout.need
        : layout.accounts.find(
            (placed) => placed.account.id === endpointId,
          )

  const cycleShape = (accountId: string) => {
    onChange?.({
      ...data,
      accounts: data.accounts.map((account) =>
        account.id === accountId
          ? {
              ...account,
              shape: nextAccountShape(accountShape(account)),
            }
          : account,
      ),
    })
  }

  useEffect(() => {
    if (!dragRef.current) setPreviewData(null)
  }, [data])

  const cancelDrag = () => {
    const session = dragRef.current
    if (!session) return
    const svg = svgRef.current
    if (svg?.hasPointerCapture(session.pointerId)) {
      svg.releasePointerCapture(session.pointerId)
    }
    dragRef.current = null
    setDragging(false)
    setConnecting(false)
    setConnectPreview(null)
    setPreviewData(null)
  }

  useEffect(() => {
    if (!onChange) return
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape' || !dragRef.current) return
      event.preventDefault()
      cancelDrag()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onChange])

  const beginDrag = (
    key: string,
    mode: DragMode,
    startPlaced?: Placed,
    startArrow?: Arrow,
    startOutline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => {
    if (!onChange || event.button !== 0) return
    if (mode !== 'move') event.stopPropagation()
    const screenCtm = svgRef.current?.getScreenCTM()
    if (!screenCtm) return

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
      startPlaced,
      startScreen: { x: event.clientX, y: event.clientY },
    }
  }

  const beginConnect = (
    sourceId: string,
    source: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => {
    if (!onChange || event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const screenCtm = svgRef.current?.getScreenCTM()
    if (!screenCtm) return

    dragRef.current = {
      active: false,
      initialOverride: {},
      inverseScreenCtm: screenCtm.inverse(),
      key: '',
      latestData: data,
      mode: 'connect',
      pointerId: event.pointerId,
      sourceId,
      startOutline: source,
      startScreen: { x: event.clientX, y: event.clientY },
    }
  }

  const previewDrag = (event: PointerEvent<SVGSVGElement>) => {
    const session = dragRef.current
    if (!session || session.pointerId !== event.pointerId) return
    const currentScreen = { x: event.clientX, y: event.clientY }
    if (
      !session.active &&
      (session.mode === 'textMove' ||
      session.mode === 'flowLabelMove'
        ? accountTextPointerAction(session.startScreen, currentScreen) ===
          'edit'
        : !crossedDragThreshold(session.startScreen, currentScreen))
    ) {
      return
    }
    if (!session.active) {
      session.active = true
      event.currentTarget.setPointerCapture(event.pointerId)
      setDragging(true)
      if (session.mode === 'connect') setConnecting(true)
    }
    event.preventDefault()

    if (session.mode === 'connect' && session.startOutline) {
      const end = screenPointToArtboard(
        currentScreen,
        session.inverseScreenCtm,
      )
      setConnectPreview({
        start: pointOnOutline(
          session.startOutline,
          nearestOutlineT(session.startOutline, end),
        ),
        end,
      })
      return
    }

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
      const nextData = moveMapNote(data, session.key, clamped.x, clamped.y)
      session.latestData = nextData
      setPreviewData(nextData)
      return
    }
    if (session.mode === 'noteResize' && session.startPlaced) {
      const nextData = resizeMapNote(
        data,
        session.key,
        session.startPlaced.w + delta.x,
      )
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
      patch = {
        [session.mode === 'arrowStart' ? 'startAt' : 'endAt']: {
          dx: artboardPoint.x - center.x,
          dy: artboardPoint.y - center.y,
        },
      }
    } else {
      patch = {
        dx: (session.initialOverride.dx ?? 0) + delta.x,
        dy: (session.initialOverride.dy ?? 0) + delta.y,
      }
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
    setConnecting(false)
    setConnectPreview(null)
    if (!session.active) return

    event.preventDefault()
    suppressNextClickRef.current = true
    window.setTimeout(() => {
      suppressNextClickRef.current = false
    }, 0)
    if (session.mode === 'connect' && session.sourceId) {
      const targetId = document
        .elementsFromPoint(event.clientX, event.clientY)
        .map((element) => element.closest('[data-connect-id]'))
        .find((element) => element !== null)
        ?.getAttribute('data-connect-id')
      if (!targetId) return
      const nextData = addCustomArrow(data, session.sourceId, targetId)
      if (nextData !== data) onChange?.(nextData)
      return
    }
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

  return (
    <svg
      aria-label={`Money Map for ${displayData.client.title}`}
      className={[
        onChange ? 'map-interactive' : '',
        dragging ? 'is-dragging' : '',
        connecting ? 'is-connecting' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={svgRef}
      role="img"
      viewBox={`0 0 ${ARTBOARD.width} ${ARTBOARD.height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClickCapture={
        onChange
          ? (event) => {
              if (!suppressNextClickRef.current) return
              event.preventDefault()
              event.stopPropagation()
              suppressNextClickRef.current = false
            }
          : undefined
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
          viewBox="0 0 9 9"
          markerWidth={9}
          markerHeight={9}
          refX={8}
          refY={4.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 9 4.5 L 0 9 Z" fill={FLOW_GREEN} />
        </marker>
        {CUSTOM_ARROW_COLORS.map((color) => (
          <marker
            key={color}
            id={customMarkerIds[color]}
            viewBox="0 0 9 9"
            markerWidth={9}
            markerHeight={9}
            refX={8}
            refY={4.5}
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M 0 0 L 9 4.5 L 0 9 Z"
              fill={ARROW_COLORS[color]}
            />
          </marker>
        ))}
      </defs>

      <Masthead
        data={displayData}
        onElementClick={onElementClick}
        onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
      />
      <g
        data-connect-id={onChange ? 'income' : undefined}
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
        {onChange && (
          <>
            <rect
              aria-label="Resize income sources"
              className="map-resize-handle"
              height={16}
              rx={3}
              width={16}
              x={layout.income.x + layout.income.w - 20}
              y={layout.income.y + layout.income.h - 20}
              onPointerDown={beginDrag(
                'income',
                'resize',
                layout.income,
              )}
            />
            <ConnectHandle
              endpointId="income"
              label="income sources"
              onBegin={beginConnect}
              placed={layout.income}
            />
          </>
        )}
      </g>
      <g
        data-connect-id={onChange ? 'need' : undefined}
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
          onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
          tag={displayData.needTag}
          value={displayData.monthlyNeed}
          placed={layout.need}
        />
        {onChange && (
          <ConnectHandle
            endpointId="need"
            label="monthly income need"
            onBegin={beginConnect}
            placed={layout.need}
          />
        )}
      </g>
      <g aria-label="Accounts">
        {layout.accounts.map((placed, index) => {
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
              data-account-shape={shape}
              data-connect-id={onChange ? placed.account.id : undefined}
              key={`${placed.account.id}-${index}`}
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
              {onChange && (
                <>
                  <circle
                    aria-label={`Rotate ${accountDisplayName(
                      placed.account,
                    )}`}
                    className="map-rotate-handle"
                    cx={placed.x + placed.w / 2}
                    cy={placed.y - 22}
                    r={7}
                    onPointerDown={beginDrag(
                      placed.account.id,
                      'rotate',
                      placed,
                    )}
                  />
                  <g
                    aria-label={`Change ${accountDisplayName(
                      placed.account,
                    )} shape`}
                    className="map-shape-flip"
                    role="button"
                    tabIndex={0}
                    onClick={(event) => {
                      event.stopPropagation()
                      cycleShape(placed.account.id)
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return
                      event.preventDefault()
                      event.stopPropagation()
                      cycleShape(placed.account.id)
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <rect
                      className="map-shape-flip-surface"
                      height={16}
                      rx={3}
                      width={18}
                      x={placed.x + placed.w - 44}
                      y={placed.y + placed.h - 20}
                    />
                    <g
                      className="map-shape-flip-glyph"
                      stroke={style.stroke}
                      strokeWidth={1.3}
                    >
                      <ShapeFlipGlyph
                        shape={shape}
                        x={placed.x + placed.w - 41}
                        y={placed.y + placed.h - 17}
                      />
                    </g>
                  </g>
                  <rect
                    aria-label={`Resize ${accountDisplayName(
                      placed.account,
                    )}`}
                    className="map-resize-handle"
                    height={16}
                    rx={3}
                    width={16}
                    x={placed.x + placed.w - 20}
                    y={placed.y + placed.h - 20}
                    onPointerDown={beginDrag(
                      placed.account.id,
                      'resize',
                      placed,
                    )}
                  />
                  <ConnectHandle
                    endpointId={placed.account.id}
                    label={accountDisplayName(placed.account)}
                    onBegin={beginConnect}
                    placed={placed}
                  />
                </>
              )}
            </g>
          )
        })}
      </g>
      <g aria-label="Money flow">
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
              key={`${arrow.kind}-${arrow.id ?? index}`}
              arrow={arrow}
              customMarkerIds={customMarkerIds}
              markerId={markerId}
              onElementClick={onElementClick}
              onBeginDrag={(mode) =>
                beginDrag(
                  key,
                  mode,
                  undefined,
                  arrow,
                  mode === 'arrowStart' ? source : target,
                )
              }
              onDelete={
                arrow.kind === 'custom' && arrow.id
                  ? () => onChange(deleteCustomArrow(data, arrow.id!))
                  : arrow.kind === 'income' || arrow.kind === 'asNeeded'
                    ? () =>
                        onChange(
                          hideGeneratedArrow(
                            data,
                            arrow.kind as 'income' | 'asNeeded',
                          ),
                        )
                    : undefined
              }
              onColorChange={
                arrow.kind === 'custom' && arrow.id
                  ? (color) =>
                      onChange(
                        setCustomArrowColor(data, arrow.id!, color),
                      )
                  : undefined
              }
              onStyleCycle={
                arrow.kind === 'custom' && arrow.id
                  ? () => onChange(cycleCustomArrowStyle(data, arrow.id!))
                  : undefined
              }
            />
          )
        })}
      </g>
      {connectPreview && (
        <path
          className="map-connect-preview"
          d={`M ${connectPreview.start.x} ${connectPreview.start.y} L ${connectPreview.end.x} ${connectPreview.end.y}`}
          fill="none"
          markerEnd={`url(#${customMarkerIds.ink})`}
          pointerEvents="none"
        />
      )}
      {asNeeded && (
        <g
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
          />
        </g>
      )}
      <g aria-label="Map notes">
        {layout.notes.map((placed) => (
          <g
            className={onChange ? 'map-draggable map-note' : 'map-note'}
            key={placed.note.id}
            onPointerDown={
              onChange
                ? beginDrag(
                    placed.note.id,
                    'noteMove',
                    placed,
                  )
                : undefined
            }
          >
            <NoteBlock
              onBackgroundToggle={
                onChange
                  ? () =>
                      onChange(
                        setMapNoteBackground(
                          data,
                          placed.note.id,
                          !placed.note.bg,
                        ),
                      )
                  : undefined
              }
              onDelete={
                onChange
                  ? () => onChange(deleteMapNote(data, placed.note.id))
                  : undefined
              }
              onElementClick={onElementClick}
              onResize={
                onChange
                  ? beginDrag(
                      placed.note.id,
                      'noteResize',
                      placed,
                    )
                  : undefined
              }
              placed={placed}
            />
          </g>
        ))}
      </g>
      <Footnotes
        data={displayData}
        footnotes={displayData.footnotes}
        onElementClick={onElementClick}
        onTextPointerDown={onChange ? beginFixedTextDrag : undefined}
        x={layout.footnotesAt.x}
        y={layout.footnotesAt.y}
      />
    </svg>
  )
}
