import {
  useId,
  type KeyboardEvent,
  type SVGProps,
} from 'react'
import { CAP_CONTENT_GAP, layoutMap } from '../layout/layout'
import type {
  Arrow,
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
  Footnote,
  IncomeSource,
  MoneyMapData,
  SubAccount,
} from '../model/types'
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

export interface MapElementTarget {
  kind: 'account' | 'income' | 'need'
  id?: string
}

interface MapSvgProps {
  data: MoneyMapData
  onElementClick?: (target: MapElementTarget) => void
  highlightId?: string | null
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
  source,
  x,
  y,
}: {
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
        {moneyPer(source.amount, source.period)}
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
  placed,
}: {
  data: MoneyMapData
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
          key={`${source.label}-${index}`}
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
  value,
  placed,
}: {
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

function NoteCard({ placed }: { placed: PlacedAccount }) {
  const style = BUCKETS.note
  const titleLines = wrap(placed.account.label, 24)
  const captionLines = placed.account.caption
    ? wrap(placed.account.caption, 30)
    : []

  return (
    <g>
      <rect
        x={placed.x}
        y={placed.y}
        width={placed.w}
        height={placed.h}
        rx={12}
        fill={style.tint}
        stroke={style.stroke}
        strokeWidth={2.5}
      />
      <text
        x={placed.x + placed.w / 2}
        y={placed.y + 25}
        fill={style.tagColor}
        fontFamily={FONT_SANS}
        fontSize={TYPE.accountTag}
        fontWeight={700}
        letterSpacing={1.2}
        textAnchor="middle"
      >
        {style.tag.toUpperCase()}
      </text>
      <text
        x={placed.x + placed.w / 2}
        y={placed.y + 52}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.accountTitle}
        fontWeight={600}
        textAnchor="middle"
      >
        {titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={placed.x + placed.w / 2}
            dy={index === 0 ? 0 : 20}
          >
            {line}
          </tspan>
        ))}
      </text>
      {captionLines.length > 0 && (
        <text
          x={placed.x + placed.w / 2}
          y={placed.y + 56 + titleLines.length * 20}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.caption}
          textAnchor="middle"
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={placed.x + placed.w / 2}
              dy={index === 0 ? 0 : 15}
            >
              {line}
            </tspan>
          ))}
        </text>
      )}
      <text
        x={placed.x + placed.w / 2}
        y={placed.y + placed.h - 25}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.value}
        fontWeight={600}
        textAnchor="middle"
        style={numericStyle}
      >
        {money(placed.account.value)}
      </text>
    </g>
  )
}

function Cylinder({ placed }: { placed: PlacedAccount }) {
  const { account, x, y, w, h, capRy } = placed
  const style = BUCKETS[account.bucket]
  const dash = style.dashed ? '8 6' : undefined
  const titleLines = wrap(account.label, 24)
  const captionLines = account.caption ? wrap(account.caption, 30) : []
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
      <text
        x={centerX}
        y={tagY}
        fill={style.tagColor}
        fontFamily={FONT_SANS}
        fontSize={TYPE.accountTag}
        fontWeight={700}
        letterSpacing={1.2}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {style.tag.toUpperCase()}
      </text>
      <text
        x={centerX}
        y={titleY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.accountTitle}
        fontWeight={600}
        textAnchor="middle"
      >
        {titleLines.map((line, index) => (
          <tspan
            key={`${line}-${index}`}
            x={centerX}
            dy={index === 0 ? 0 : 20}
          >
            {line}
          </tspan>
        ))}
      </text>
      {captionLines.length > 0 && (
        <text
          x={centerX}
          y={captionY}
          fill={MUTED}
          fontFamily={FONT_SANS}
          fontSize={TYPE.caption}
          textAnchor="middle"
        >
          {captionLines.map((line, index) => (
            <tspan
              key={`${line}-${index}`}
              x={centerX}
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
        x={centerX}
        y={valueY}
        fill={INK}
        fontFamily={FONT_SERIF}
        fontSize={TYPE.value}
        fontWeight={600}
        textAnchor="middle"
        style={numericStyle}
      >
        {money(account.value)}
      </text>
      {subAccounts.map((subAccount, index) => (
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

function AsNeededLabel({
  arrow,
  amount,
}: {
  arrow: Arrow
  amount: number | null
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
  highlightId,
}: MapSvgProps) {
  const id = useId().replaceAll(':', '')
  const markerId = `flow-arrowhead-${id}`
  const legendMarkerId = `legend-arrowhead-${id}`
  const layout = layoutMap(data)
  const asNeeded = layout.arrows.find((arrow) => arrow.kind === 'asNeeded')

  return (
    <svg
      aria-label={`Money Map for ${data.client.title}`}
      role="img"
      viewBox={`0 0 ${ARTBOARD.width} ${ARTBOARD.height}`}
      xmlns="http://www.w3.org/2000/svg"
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

      <Masthead data={data} />
      <g aria-label="Money flow">
        {layout.arrows.map((arrow, index) => (
          <ArrowPath
            key={`${arrow.kind}-${index}`}
            arrow={arrow}
            markerId={markerId}
          />
        ))}
      </g>
      <g
        {...interactiveGroupProps(
          'Income sources',
          { kind: 'income' },
          onElementClick,
        )}
      >
        <IncomePanel data={data} placed={layout.income} />
      </g>
      <g
        {...interactiveGroupProps(
          'Monthly income need',
          { kind: 'need' },
          onElementClick,
        )}
      >
        <NeedCard value={data.monthlyNeed} placed={layout.need} />
      </g>
      <g aria-label="Accounts">
        {layout.accounts.map((placed, index) => {
          const style = BUCKETS[placed.account.bucket]
          return (
            <g
              key={`${placed.account.id}-${index}`}
              {...interactiveGroupProps(
                accountDisplayName(placed.account),
                { kind: 'account', id: placed.account.id },
                onElementClick,
              )}
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
              {placed.account.bucket === 'note' ? (
                <NoteCard placed={placed} />
              ) : (
                <Cylinder placed={placed} />
              )}
            </g>
          )
        })}
      </g>
      {asNeeded && (
        <AsNeededLabel arrow={asNeeded} amount={data.asNeededAmount} />
      )}
      <Footnotes
        footnotes={data.footnotes}
        x={layout.footnotesAt.x}
        y={layout.footnotesAt.y}
      />
      <FlowLegend arrows={layout.arrows} markerId={legendMarkerId} />
    </svg>
  )
}
