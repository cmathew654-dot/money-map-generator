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
  CAP_CONTENT_GAP,
  hexagonInset,
  layoutMap,
  nearestOutlineT,
} from '../layout/layout'
import type {
  Arrow,
  OutlineElement,
  Placed,
  PlacedAccount,
} from '../layout/layout'
import {
  accountDisplayName,
  money,
  moneyPer,
  wrap,
} from '../model/format'
import type {
  AccountShape,
  Footnote,
  IncomeSource,
  LayoutOverride,
  MoneyMapData,
  SubAccount,
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
  crossedDragThreshold,
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
  MUTED,
  NEED_RED,
  PAPER,
  TYPE,
} from './tokens'

const numericStyle = { fontVariantNumeric: 'tabular-nums' }
const SUB_ACCOUNT_CAP_CONTENT_GAP = 14

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

function wrapLengths(placed: PlacedAccount): {
  title: number
  caption: number
} {
  const baseWidth = ['shortTerm', 'cash', 'note'].includes(
    placed.account.bucket,
  )
    ? 250
    : 260
  return {
    title: Math.max(12, Math.round((24 * placed.w) / baseWidth)),
    caption: Math.max(16, Math.round((30 * placed.w) / baseWidth)),
  }
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
  | 'arrowBow'
  | 'arrowStart'
  | 'arrowEnd'

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
  if (data.client.variant === 'postNote') {
    const asOf = data.client.postNoteLabel?.trim()
    return asOf
      ? `MONEY MAP — ${asOf} UPDATE`
      : 'MONEY MAP — UPDATE'
  }
  return `MONEY MAP ${data.client.year}`
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
        fontSize={13}
      >
        {source.label}
      </text>
      <text
        x={x}
        y={y + 18}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={14}
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
            fontSize={12}
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
        fontSize={13}
        fontWeight={600}
      >
        After-Tax Income
      </text>
      <text
        x={placed.x + placed.w - 20}
        y={dividerY + 31}
        fill={FLOW_GREEN}
        fontFamily={FONT_SERIF}
        fontSize={16}
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
  onElementClick,
  value,
  placed,
}: {
  onElementClick?: (target: MapElementTarget) => void
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
        style={numericStyle}
        {...editableTextProps({ kind: 'monthlyNeed' }, onElementClick)}
      >
        {money(value)}
      </text>
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
  subAccount,
  x,
  y,
  w,
  fill,
  stroke,
}: {
  subAccount: SubAccount
  x: number
  y: number
  w: number
  fill: string
  stroke: string
}) {
  const h = 88
  const capRy = 10
  const titleY = y + capRy * 2 + SUB_ACCOUNT_CAP_CONTENT_GAP

  return (
    <g>
      <path
        d={cylinderBody(x, y, w, h, capRy)}
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
        y={titleY}
        fill={INK}
        fontFamily={FONT_SANS}
        fontSize={12.5}
        fontWeight={600}
        textAnchor="middle"
      >
        {subAccount.label}
      </text>
      {subAccount.caption && (
        <text
          x={x + w / 2}
          y={y + 51}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={10.5}
          textAnchor="middle"
        >
          {subAccount.caption}
        </text>
      )}
      <text
        x={x + w / 2}
        y={y + 70}
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
  captionLines,
  captionY,
  onElementClick,
  placed,
  rowsY,
  subStartY,
  tagY,
  titleLines,
  titleY,
  valueY,
  verticallyCenterTag = false,
}: {
  captionLines: string[]
  captionY: number
  onElementClick?: (target: MapElementTarget) => void
  placed: PlacedAccount
  rowsY: number
  subStartY: number
  tagY: number
  titleLines: string[]
  titleY: number
  valueY: number
  verticallyCenterTag?: boolean
}) {
  const { account, x, w } = placed
  const style = BUCKETS[account.bucket]
  return (
    <>
      <text
        x={x + w / 2}
        y={tagY}
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
        y={titleY}
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
            dy={index === 0 ? 0 : 20}
          >
            {line}
          </tspan>
        ))}
      </text>
      {captionLines.length > 0 && (
        <text
          x={x + w / 2}
          y={captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.caption}
          textAnchor="middle"
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={x + w / 2}
              dy={index === 0 ? 0 : 15}
            >
              {line}
            </tspan>
          ))}
        </text>
      )}
      {account.positions?.map((position, index) => {
        const rowTop = rowsY + index * 20
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
              y={rowTop + 15}
              fill={INK}
              fontFamily={FONT_SANS}
              fontSize={TYPE.row}
            >
              {position.label}
            </text>
            <text
              x={x + w - 20}
              y={rowTop + 15}
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
        y={valueY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.value}
        fontWeight={600}
        textAnchor="middle"
        style={numericStyle}
        {...editableTextProps(
          { kind: 'accountValue', accountId: account.id },
          onElementClick,
        )}
      >
        {money(account.value)}
      </text>
      {account.subAccounts?.map((subAccount, index) => (
        <SubAccountDrum
          key={`${subAccount.label}-${index}`}
          subAccount={subAccount}
          x={x + w * 0.14}
          y={subStartY + index * 96}
          w={w * 0.72}
          fill={style.tint}
          stroke={style.stroke}
        />
      ))}
    </>
  )
}

function FlatAccount({
  onElementClick,
  placed,
  shape,
}: {
  onElementClick?: (target: MapElementTarget) => void
  placed: PlacedAccount
  shape: Exclude<AccountShape, 'drum'>
}) {
  const { account, x, y, w, h } = placed
  const style = BUCKETS[account.bucket]
  const dash = style.dashed ? '8 6' : undefined
  const wrapAt = wrapLengths(placed)
  const titleLines = wrap(
    accountDisplayName(account),
    wrapAt.title,
  )
  const captionLines = account.caption
    ? wrap(account.caption, wrapAt.caption)
    : []
  const subAccounts = account.subAccounts ?? []
  const radius = shape === 'card' ? 12 : Math.min(w, h) / 2
  const captionY = y + 56 + titleLines.length * 20
  const rowsY =
    captionLines.length > 0
      ? captionY + captionLines.length * 15 + 11
      : y + 58 + titleLines.length * 20
  const lowerInset =
    shape === 'pill' ? Math.max(12, radius * 0.32) : 12
  const subStartY = y + h - lowerInset - subAccounts.length * 96
  const valueY = subAccounts.length ? subStartY - 17 : y + h - 25
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
        captionLines={captionLines}
        captionY={captionY}
        onElementClick={onElementClick}
        placed={placed}
        rowsY={rowsY}
        subStartY={subStartY}
        tagY={y + 25}
        titleLines={titleLines}
        titleY={y + 52}
        valueY={valueY}
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
}: {
  onElementClick?: (target: MapElementTarget) => void
  placed: PlacedAccount
}) {
  const { account, x, y, w, h, capRy } = placed
  const style = BUCKETS[account.bucket]
  const dash = style.dashed ? '8 6' : undefined
  const wrapAt = wrapLengths(placed)
  const titleLines = wrap(accountDisplayName(account), wrapAt.title)
  const captionLines = account.caption
    ? wrap(account.caption, wrapAt.caption)
    : []
  const centerX = x + w / 2
  const tagY = y + capRy
  const minimumTitleY = y + capRy * 2 + CAP_CONTENT_GAP
  const subAccounts = account.subAccounts ?? []
  const valueY = subAccounts.length
    ? y + h - capRy - subAccounts.length * 96 - 17
    : y + h - capRy - 18
  const distributesSlack =
    account.bucket === 'shortTerm' &&
    !account.positions?.length &&
    subAccounts.length === 0
  const semanticGapCount = captionLines.length > 0 ? 3 : 2
  const baseGapTotal = captionLines.length > 0 ? 45 : 30
  const fixedLineSpan =
    Math.max(0, titleLines.length - 1) * 20 +
    Math.max(0, captionLines.length - 1) * 15
  const sharedSlack = distributesSlack
    ? Math.max(
        0,
        valueY - minimumTitleY - fixedLineSpan - baseGapTotal,
      ) / semanticGapCount
    : 0
  const titleY = minimumTitleY + sharedSlack
  const captionY =
    titleY + titleLines.length * 20 + sharedSlack
  const rowsY = captionY + captionLines.length * 15 + 11
  const subStartY = y + h - capRy - subAccounts.length * 96

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
        captionLines={captionLines}
        captionY={captionY}
        onElementClick={onElementClick}
        placed={placed}
        rowsY={rowsY}
        subStartY={subStartY}
        tagY={tagY}
        titleLines={titleLines}
        titleY={titleY}
        valueY={valueY}
        verticallyCenterTag
      />
    </g>
  )
}

function ArrowPath({
  arrow,
  markerId,
}: {
  arrow: Arrow
  markerId: string
}) {
  const waterfall = arrow.kind === 'waterfall'
  const asNeeded = arrow.kind === 'asNeeded'
  return (
    <path
      data-arrow-kind={arrow.kind}
      d={arrow.d}
      fill="none"
      markerEnd={`url(#${markerId})`}
      stroke={FLOW_GREEN}
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
  markerId,
  onBeginDrag,
}: {
  arrow: Arrow
  markerId: string
  onBeginDrag: (
    mode: DragMode,
    outline?: OutlineElement,
  ) => (event: PointerEvent<SVGElement>) => void
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
      <ArrowPath arrow={arrow} markerId={markerId} />
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
                fontSize={11}
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

export function MapSvg({
  data,
  onElementClick,
  onChange,
  highlightId,
}: MapSvgProps) {
  const id = useId().replaceAll(':', '')
  const markerId = `flow-arrowhead-${id}`
  const legendMarkerId = `legend-arrowhead-${id}`
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragSession | null>(null)
  const suppressNextClickRef = useRef(false)
  const [previewData, setPreviewData] = useState<MoneyMapData | null>(
    null,
  )
  const [dragging, setDragging] = useState(false)
  const displayData = previewData ?? data
  const layout = layoutMap(displayData)
  const asNeeded = layout.arrows.find((arrow) => arrow.kind === 'asNeeded')

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
    }
    event.preventDefault()

    const delta = screenDeltaToArtboard(
      {
        x: currentScreen.x - session.startScreen.x,
        y: currentScreen.y - session.startScreen.y,
      },
      session.inverseScreenCtm,
    )
    let patch: LayoutOverride
    if (session.mode === 'resize' && session.startPlaced) {
      patch = {
        w: session.startPlaced.w + delta.x,
        h: session.startPlaced.h + delta.y,
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
      patch = {
        [session.mode === 'arrowStart' ? 'startT' : 'endT']:
          nearestOutlineT(session.startOutline, artboardPoint),
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
    if (!session.active) return

    event.preventDefault()
    suppressNextClickRef.current = true
    window.setTimeout(() => {
      suppressNextClickRef.current = false
    }, 0)
    onChange?.(session.latestData)
  }

  return (
    <svg
      aria-label={`Money Map for ${displayData.client.title}`}
      className={[
        onChange ? 'map-interactive' : '',
        dragging ? 'is-dragging' : '',
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
      </g>
      <g
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
          onElementClick={onElementClick}
          value={displayData.monthlyNeed}
          placed={layout.need}
        />
      </g>
      <g aria-label="Accounts">
        {layout.accounts.map((placed, index) => {
          const style = BUCKETS[placed.account.bucket]
          const shape = accountShape(placed.account)
          return (
            <g
              data-account-id={placed.account.id}
              data-account-shape={shape}
              key={`${placed.account.id}-${index}`}
              {...interactiveGroupProps(
                accountDisplayName(placed.account),
                { kind: 'account', id: placed.account.id },
                onElementClick,
              )}
              className={onChange ? 'map-draggable' : undefined}
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
                />
              ) : (
                <FlatAccount
                  onElementClick={onElementClick}
                  placed={placed}
                  shape={shape}
                />
              )}
              {onChange && (
                <>
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
                markerId={markerId}
              />
            )
          }
          const key =
            arrow.kind === 'waterfall'
              ? `arrow:waterfall:${arrow.sourceId}`
              : `arrow:${arrow.kind}`
          const source =
            arrow.kind === 'income'
              ? layout.income
              : layout.accounts.find(
                  (placed) =>
                    placed.account.id === arrow.sourceId,
                )
          const target =
            arrow.kind === 'income' || arrow.kind === 'asNeeded'
              ? layout.need
              : layout.accounts.find(
                  (placed) =>
                    placed.account.id === arrow.targetId,
                )
          return (
            <ArrowEditor
              key={`${arrow.kind}-${index}`}
              arrow={arrow}
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
            />
          )
        })}
      </g>
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
