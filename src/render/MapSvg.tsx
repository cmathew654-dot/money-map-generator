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
  layoutMap,
  nearestOutlineT,
  NOTE_LEADING,
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
  Footnote,
  IncomeSource,
  LayoutOverride,
  MoneyMapData,
} from '../model/types'
import {
  accountShape,
  nextAccountShape,
} from '../model/types'
import type {
  MapTextEditRect,
  MapTextEditTarget,
} from '../ui/MapTextEditor'
import {
  addCustomArrow,
  clampRectToBounds,
  crossedDragThreshold,
  deleteCustomArrow,
  deleteMapNote,
  moveMapNote,
  snapRotation,
  screenDeltaToArtboard,
  screenPointToArtboard,
  signedPerpendicularOffset,
  withOverride,
  type Point,
  type TransformMatrix,
} from './mapInteraction'
import {
  ARTBOARD,
  BUCKETS,
  FLOW_GREEN,
  FONT_SANS,
  FONT_SERIF,
  HAIRLINE,
  INK,
  LEADING,
  MUTED,
  NEED_RED,
  PAPER,
  TYPE,
} from './tokens'

const numericStyle = { fontVariantNumeric: 'tabular-nums' }

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
      edit: MapTextEditTarget
      rect: MapTextEditRect
    }

interface MapSvgProps {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  onChange?: (data: MoneyMapData) => void
  highlightId?: string | null
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
): SVGProps<SVGTextElement | SVGTSpanElement> {
  if (!onElementClick) return {}

  const activate = (element: SVGGraphicsElement) => {
    const { left, top, width, height } = element.getBoundingClientRect()
    onElementClick({
      kind: 'edit',
      edit,
      rect: { left, top, width, height },
    })
  }
  return {
    className: 'map-editable-text',
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

function mastheadLabel(data: MoneyMapData): string {
  const period = mastheadPeriodLabel(data.client)
  if (data.client.variant === 'postNote') {
    return `MONEY MAP — ${period}`
  }
  return `MONEY MAP ${period}`
}

function Masthead({ data }: { data: MoneyMapData }) {
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
      <text
        x={470}
        y={83}
        fill={MUTED}
        fontFamily={FONT_SANS}
        fontSize={TYPE.mastheadLabel}
        fontWeight={600}
        letterSpacing={2.5}
      >
        {mastheadLabel(data).toUpperCase()}
      </text>
      <line x1={48} y1={118} x2={1272} y2={118} stroke={HAIRLINE} />
    </g>
  )
}

function IncomeRow({
  index,
  onElementClick,
  source,
  x,
  y,
}: {
  index: number
  onElementClick?: (target: MapElementTarget) => void
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
        fontSize={TYPE.incomeLabel}
      >
        {source.label}
      </text>
      <text
        x={x}
        y={y + 18}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.incomeValue}
        fontWeight={600}
        style={numericStyle}
      >
        <tspan
          {...editableTextProps(
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
            fontSize={TYPE.incomeQualifier}
            fontWeight={400}
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
  placed,
}: {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  placed: Placed
}) {
  const dividerY =
    placed.y + 44 + data.incomeSources.length * 40 + 4

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
      <text
        x={placed.x + 20}
        y={placed.y + 29}
        fill={FLOW_GREEN}
        fontFamily={FONT_SANS}
        fontSize={TYPE.panelHeader}
        fontWeight={700}
        letterSpacing={1.7}
      >
        INCOME SOURCES
      </text>
      <line
        x1={placed.x + 20}
        y1={placed.y + 40}
        x2={placed.x + 48}
        y2={placed.y + 40}
        stroke={FLOW_GREEN}
        strokeWidth={2}
      />
      {data.incomeSources.map((source, index) => (
        <IncomeRow
          index={index}
          key={`${source.label}-${index}`}
          onElementClick={onElementClick}
          source={source}
          x={placed.x + 20}
          y={placed.y + 61 + index * 40}
        />
      ))}
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
      <text
        x={placed.x + 20}
        y={dividerY + 31}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={TYPE.incomeTotalLabel}
        fontWeight={600}
      >
        After-Tax Income
      </text>
      <text
        x={placed.x + placed.w - 20}
        y={dividerY + 31}
        fill={FLOW_GREEN}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.incomeTotalValue}
        fontWeight={600}
        textAnchor="end"
        style={numericStyle}
      >
        {money(data.afterTaxIncome)}
      </text>
    </g>
  )
}

function NeedCard({
  mathLine,
  onElementClick,
  tag,
  value,
  placed,
}: {
  mathLine: string | null
  onElementClick?: (target: MapElementTarget) => void
  tag?: string
  value: number | null
  placed: Placed
}) {
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
      <text
        x={placed.x + placed.w / 2}
        y={placed.y + 58}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={TYPE.needLabel}
        fontWeight={700}
        letterSpacing={1.8}
        textAnchor="middle"
      >
        MONTHLY INCOME NEED
      </text>
      <text
        x={placed.x + placed.w / 2}
        y={placed.y + 111}
        fill={NEED_RED}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.needValue}
        fontWeight={600}
        textAnchor="middle"
      >
        <tspan
          style={numericStyle}
          {...editableTextProps({ kind: 'monthlyNeed' }, onElementClick)}
        >
          {money(value)}
        </tspan>
        {tag && (
          <tspan fill={MUTED} fontStyle="italic" fontWeight={400}>
            {` ${tag}`}
          </tspan>
        )}
      </text>
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
  layout,
  x,
  y,
  w,
  fill,
  stroke,
}: {
  layout: SubAccountLayout
  x: number
  y: number
  w: number
  fill: string
  stroke: string
}) {
  const capRy = 10
  const { subAccount } = layout

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
      <text
        x={x + w / 2}
        y={y + layout.titleY}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={TYPE.subAccountTitle}
        fontWeight={600}
        textAnchor="middle"
      >
        {layout.titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2}
            dy={index === 0 ? 0 : LEADING.subAccountTitle}
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
          fontSize={TYPE.subAccountCaption}
          textAnchor="middle"
        >
          {layout.captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2}
              dy={index === 0 ? 0 : LEADING.subAccountCaption}
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
        fontSize={TYPE.subValue}
        fontWeight={600}
        textAnchor="middle"
        style={numericStyle}
      >
        {money(subAccount.value)}
      </text>
    </g>
  )
}

function AccountContent({
  onElementClick,
  placed,
  runway,
  verticallyCenterTag = false,
}: {
  onElementClick?: (target: MapElementTarget) => void
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
        x={x + w / 2}
        y={y + text.titleY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.accountTitle}
        fontWeight={600}
        textAnchor="middle"
        {...editableTextProps(
          { kind: 'accountLabel', accountId: account.id },
          onElementClick,
        )}
      >
        {titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={x + w / 2}
            dy={index === 0 ? 0 : LEADING.accountTitle}
          >
            {line}
          </tspan>
        ))}
      </text>
      {text.captionY !== undefined && (
        <text
          x={x + w / 2}
          y={y + text.captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.caption}
          textAnchor="middle"
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2}
              dy={index === 0 ? 0 : LEADING.caption}
            >
              {line}
            </tspan>
          ))}
        </text>
      )}
      {account.positions?.map((position, index) => {
        const rowBaseline = y + text.rowBaselines[index]
        const rowTop = rowBaseline - TYPE.row - 3
        return (
          <g key={`${position.label}-${index}`}>
            <line
              x1={x + 20}
              y1={rowTop}
              x2={x + w - 20}
              y2={rowTop}
              stroke={HAIRLINE}
            />
            <text
              x={x + 20}
              y={rowBaseline}
              fill={INK}
              fontFamily={FONT_SANS}
              fontSize={TYPE.row}
            >
              {position.label}
            </text>
            <text
              x={x + w - 20}
              y={rowBaseline}
              fill={INK}
              fontFamily={FONT_SERIF}
              fontSize={TYPE.row}
              fontWeight={600}
              textAnchor="end"
              style={numericStyle}
            >
              {money(position.value)}
            </text>
          </g>
        )
      })}
      <text
        x={x + w / 2}
        y={y + text.valueY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.value}
        fontWeight={600}
        textAnchor="middle"
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
          <tspan fill={MUTED} fontStyle="italic" fontWeight={400}>
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
        const priorHeight = subAccountLayouts
          .slice(0, index)
          .reduce((sum, prior) => sum + prior.h + 8, 0)
        return (
          <SubAccountDrum
            key={`${layout.subAccount.label}-${index}`}
            layout={layout}
            x={x + w * 0.14}
            y={y + text.subStartY + priorHeight}
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
  placed,
  runway,
  shape,
}: {
  onElementClick?: (target: MapElementTarget) => void
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
  placed,
  runway,
}: {
  onElementClick?: (target: MapElementTarget) => void
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
        placed={placed}
        runway={runway}
        verticallyCenterTag
      />
    </g>
  )
}

function ArrowPath({
  arrow,
  customMarkerId,
  markerId,
}: {
  arrow: Arrow
  customMarkerId: string
  markerId: string
}) {
  const waterfall = arrow.kind === 'waterfall'
  const asNeeded = arrow.kind === 'asNeeded'
  const custom = arrow.kind === 'custom'
  return (
    <path
      data-arrow-kind={arrow.kind}
      d={arrow.d}
      fill="none"
      markerEnd={`url(#${custom ? customMarkerId : markerId})`}
      stroke={custom ? INK : FLOW_GREEN}
      strokeDasharray={
        waterfall ? '0.1 9' : asNeeded ? '7 6' : undefined
      }
      strokeLinecap={waterfall ? 'round' : 'butt'}
      strokeWidth={waterfall ? 3.5 : 2}
    />
  )
}

function ArrowEditor({
  arrow,
  customMarkerId,
  markerId,
  onBeginDrag,
  onDelete,
}: {
  arrow: Arrow
  customMarkerId: string
  markerId: string
  onBeginDrag: (
    mode: DragMode,
    outline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => void
  onDelete?: () => void
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
        customMarkerId={customMarkerId}
        markerId={markerId}
      />
      <path
        className="map-arrow-hit"
        d={arrow.d}
        fill="none"
        onPointerDown={onBeginDrag('arrowBow')}
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
          aria-label="Delete custom arrow"
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
      <text
        x={arrow.labelAt.x}
        y={arrow.labelAt.y + 5}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={TYPE.arrowLabel}
        textAnchor="middle"
      >
        Monthly Income as Needed
        <tspan
          dx={7}
          fontFamily={FONT_SERIF}
          fontWeight={600}
          style={numericStyle}
          {...editableTextProps(
            { kind: 'asNeededAmount' },
            onElementClick,
          )}
        >
          {money(amount)}
        </tspan>
      </text>
    </g>
  )
}

function FootnoteLine({
  footnote,
  x,
  y,
}: {
  footnote: Footnote
  x: number
  y: number
}) {
  return (
    <text
      x={x}
      y={y}
      fill={INK}
      fontFamily={FONT_SANS}
      fontSize={TYPE.footnote}
      textAnchor="middle"
    >
      {footnote.label}:{' '}
      <tspan
        fontFamily={FONT_SERIF}
        fontWeight={600}
        style={numericStyle}
      >
        {money(footnote.gross)}
      </tspan>
      {' → '}
      <tspan
        fill={FLOW_GREEN}
        fontFamily={FONT_SERIF}
        fontWeight={600}
        style={numericStyle}
      >
        {money(footnote.net)}
      </tspan>{' '}
      after withholding
    </text>
  )
}

function Footnotes({
  footnotes,
  x,
  y,
}: {
  footnotes: Footnote[]
  x: number
  y: number
}) {
  if (footnotes.length === 0) return null
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
          key={`${footnote.label}-${index}`}
          footnote={footnote}
          x={x}
          y={y + index * 24}
        />
      ))}
    </g>
  )
}

const LEGEND_Y = 966
const LEGEND_ITEMS: {
  kind: Arrow['kind']
  label: string
  width: number
}[] = [
  { kind: 'waterfall', label: 'Refills', width: 84 },
  { kind: 'income', label: 'Income', width: 83 },
  { kind: 'asNeeded', label: 'Draw as needed', width: 124 },
]

function FlowLegend({
  arrows,
  markerId,
}: {
  arrows: Arrow[]
  markerId: string
}) {
  const present = new Set(arrows.map((arrow) => arrow.kind))
  let x = 48

  return (
    <g aria-label="Flow legend">
      {LEGEND_ITEMS.filter((item) => present.has(item.kind)).map(
        (item) => {
          const itemX = x
          x += item.width
          const waterfall = item.kind === 'waterfall'
          const asNeeded = item.kind === 'asNeeded'
          return (
            <g key={item.kind} data-legend-kind={item.kind}>
              <line
                x1={itemX}
                y1={LEGEND_Y - 4}
                x2={itemX + 24}
                y2={LEGEND_Y - 4}
                markerEnd={`url(#${markerId})`}
                stroke={FLOW_GREEN}
                strokeDasharray={
                  waterfall ? '0.1 9' : asNeeded ? '7 6' : undefined
                }
                strokeLinecap={waterfall ? 'round' : 'butt'}
                strokeWidth={waterfall ? 3.5 : 2}
              />
              <text
                x={itemX + 32}
                y={LEGEND_Y}
                fill={MUTED}
                fontFamily={FONT_SANS}
                fontSize={TYPE.legend}
              >
                {item.label}
              </text>
            </g>
          )
        },
      )}
    </g>
  )
}

function NoteBlock({
  onDelete,
  onElementClick,
  placed,
}: {
  onDelete?: () => void
  onElementClick?: (target: MapElementTarget) => void
  placed: PlacedNote
}) {
  return (
    <>
      <rect
        fill="transparent"
        height={placed.h}
        width={placed.w}
        x={placed.x}
        y={placed.y}
      />
      <text
        className="map-note-text"
        fill={MUTED}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.note}
        x={placed.x}
        y={placed.y + TYPE.note}
        {...editableTextProps(
          { kind: 'noteText', noteId: placed.note.id },
          onElementClick,
        )}
      >
        {placed.lines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={placed.x}
            dy={index === 0 ? 0 : NOTE_LEADING}
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
  const customMarkerId = `custom-arrowhead-${id}`
  const legendMarkerId = `legend-arrowhead-${id}`
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
      !crossedDragThreshold(session.startScreen, currentScreen)
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
      <rect width={ARTBOARD.width} height={ARTBOARD.height} fill={PAPER} />
      <rect
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
        <marker
          id={customMarkerId}
          viewBox="0 0 9 9"
          markerWidth={9}
          markerHeight={9}
          refX={8}
          refY={4.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 9 4.5 L 0 9 Z" fill={INK} />
        </marker>
        <marker
          id={legendMarkerId}
          viewBox="0 0 7 7"
          markerWidth={5}
          markerHeight={5}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 7 3.5 L 0 7 Z" fill={FLOW_GREEN} />
        </marker>
      </defs>

      <Masthead data={displayData} />
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
          placed={layout.income}
        />
        {onChange && (
          <ConnectHandle
            endpointId="income"
            label="income sources"
            onBegin={beginConnect}
            placed={layout.income}
          />
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
          mathLine={gapLine(
            displayData.monthlyNeed,
            displayData.afterTaxIncome,
            displayData.asNeededAmount,
            displayData.showMath !== false,
          )}
          onElementClick={onElementClick}
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
              onDelete={
                onChange
                  ? () => onChange(deleteMapNote(data, placed.note.id))
                  : undefined
              }
              onElementClick={onElementClick}
              placed={placed}
            />
          </g>
        ))}
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
                  placed={placed}
                  runway={runway}
                />
              ) : (
                <FlatAccount
                  onElementClick={onElementClick}
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
              <ArrowPath
                key={`${arrow.kind}-${index}`}
                arrow={arrow}
                customMarkerId={customMarkerId}
                markerId={markerId}
              />
            )
          }
          const key =
            arrow.kind === 'waterfall'
              ? `arrow:waterfall:${arrow.sourceId}`
              : arrow.kind === 'custom'
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
              customMarkerId={customMarkerId}
              markerId={markerId}
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
          markerEnd={`url(#${customMarkerId})`}
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
      <Footnotes
        footnotes={displayData.footnotes}
        x={layout.footnotesAt.x}
        y={layout.footnotesAt.y}
      />
      <FlowLegend arrows={layout.arrows} markerId={legendMarkerId} />
    </svg>
  )
}
