import {
  accountDisplayName,
  mastheadPeriodLabel,
  money,
  moneyPer,
} from '../model/format'
import { gapLine, runwayLine } from '../model/math'
import type { TidyAnchor } from '../model/book'
import type {
  Account,
  AccountShape,
  AccountTextRole,
  Bucket,
  CustomArrow,
  Footnote,
  GeneratedArrowKind,
  IncomeSource,
  LayoutOverride,
  MapNote,
  MapTextElement,
  MapTextElementRole,
  MoneyMapData,
  SubAccount,
} from '../model/types'
import {
  ACCOUNT_TEXT_ROLES,
  accountShape,
  accountTextOverrideKey,
  isMigratedFlowId,
  MAX_ACCOUNT_TEXT_FONT_SIZE,
  MAX_MAP_TEXT_FONT_SIZE,
  MIN_ACCOUNT_TEXT_FONT_SIZE,
  MIN_MAP_TEXT_FONT_SIZE,
  mapItemTextOverrideKey,
  mapTextOverrideKey,
} from '../model/types'
import {
  clamp,
  clampRectToBounds,
  normalizeRotation,
} from '../render/mapInteraction'
import { LEADING, roleGap, TYPE } from '../render/tokens'
import { fitLines, textWidth } from './textfit'

export interface Placed {
  x: number
  y: number
  w: number
  h: number
}

export interface PlacedAccount extends Placed {
  account: Account
  captionLines: string[]
  capRy: number
  contentBottom: number
  firstBaseline: number
  lastBaseline: number
  positionRows: PositionRowLayout[]
  rot: number
  subAccountLayouts: SubAccountLayout[]
  text: AccountTextLayout
  titleLines: string[]
  usableCaptionWidth: number
  usableTitleWidth: number
  usableValueWidth: number
  valueText: string
}

export interface PlacedNote extends Placed {
  fontSize: number
  lineAdvance: number
  lines: string[]
  note: MapNote
}

export interface SubAccountLayout {
  captionFontSize: number
  captionLeading: number
  captionLines: string[]
  captionY?: number
  h: number
  lastBaseline: number
  subAccount: SubAccount
  titleFontSize: number
  titleLeading: number
  titleLines: string[]
  titleY: number
  usableCaptionWidth: number
  usableTitleWidth: number
  valueFontSize: number
  valueText: string
  valueY: number
  y: number
  textDx?: number
  textDy?: number
}

export interface PositionRowLayout {
  firstBaseline: number
  h: number
  innerWidth: number
  labelLines: string[]
  labelMaxWidth: number
  lastBaseline: number
  leftX: number
  topY: number
  valueText: string
  valueWidth: number
  rightX: number
}

export interface AccountTextLayout {
  captionFontSize: number
  captionLeading: number
  captionX: number
  captionY?: number
  rowFontSize: number
  rowBaselines: number[]
  rowLeading: number
  runwayY?: number
  subFontSize: number
  subStartY: number
  tagY: number
  titleFontSize: number
  titleLeading: number
  titleX: number
  titleY: number
  valueFontSize: number
  valueX: number
  valueY: number
}

export interface Arrow {
  kind: 'income' | 'asNeeded' | 'custom'
  id?: string
  d: string
  start: { x: number; y: number }
  control: { x: number; y: number }
  end: { x: number; y: number }
  bow: number
  startT: number
  endT: number
  startAt?: { dx: number; dy: number }
  endAt?: { dx: number; dy: number }
  labelAt?: { x: number; y: number }
  sourceId?: string
  targetId?: string
  style?: CustomArrow['style']
  color?: CustomArrow['color']
  label?: string
}

export interface MapLayout {
  artboard: { width: number; height: number }
  income: Placed
  need: Placed
  accounts: PlacedAccount[]
  notes: PlacedNote[]
  arrows: Arrow[]
  contentBounds: Placed
  footnotesAt: { x: number; y: number }
  warnings: LayoutWarning[]
}

/**
 * Anchor list for tidyArrangement, carrying each item's real placed size so
 * the de-overlap pass sees true footprints instead of the 180x120 fallback.
 * x/y semantics match what tidy writes back: placement coords for accounts
 * and cards, model coords for notes, override rect for the as-needed chip.
 */
export function buildTidyAnchors(
  layout: MapLayout,
  asNeededChipRect: { x: number; y: number; w?: number; h?: number } | null,
): TidyAnchor[] {
  return [
    { key: 'income', x: layout.income.x, y: layout.income.y, w: layout.income.w, h: layout.income.h },
    { key: 'need', x: layout.need.x, y: layout.need.y, w: layout.need.w, h: layout.need.h },
    ...layout.accounts.map((placed) => ({
      key: placed.account.id,
      x: placed.x,
      y: placed.y,
      w: placed.w,
      h: placed.h,
    })),
    ...layout.notes.map((placed) => ({
      key: `note:${placed.note.id}`,
      x: placed.note.x,
      y: placed.note.y,
      w: placed.w,
      h: placed.h,
    })),
    ...(asNeededChipRect
      ? [
          {
            key: 'asNeededChip',
            x: asNeededChipRect.x,
            y: asNeededChipRect.y,
            w: asNeededChipRect.w,
            h: asNeededChipRect.h,
          },
        ]
      : []),
  ]
}

export interface LayoutWarning {
  code:
    | 'account-column-overflow'
    | 'account-overlap'
    | 'account-panel-overlap'
    | 'footnote-overlap'
    | 'income-need-overlap'
    | 'masthead-title-overflow'
    | 'note-content-overlap'
    | 'panel-out-of-bounds'
    | 'text-abbreviated'
  message: string
  targetKey?: string
  fieldLabel?: string
}

interface Column {
  x: number
  y: number
  w: number
  buckets: Bucket[]
}

const STACK_BOTTOM = 890
const ARTBOARD = { width: 1320, height: 1020 }
const PAGE_MARGIN = 48
const MASTHEAD_RULE_Y = 118
const FOOTNOTED_CONTENT_BOTTOM = 900
const OPEN_CONTENT_BOTTOM = 950
const FOOTNOTE_BASELINE_Y = 930
const MASTHEAD_TITLE_MAX_WIDTH = 382
const MASTHEAD_LABEL_MAX_WIDTH = 786
const FLOW_LABEL_MAX_WIDTH = 236
const MIN_MASTHEAD_TITLE_SIZE = 18
const DEFAULT_GAP = 28
const COMPRESSED_GAP = 16
export const MIN_ACCOUNT_HEIGHT = 120
export const MIN_ACCOUNT_WIDTH = 180
export const MIN_INCOME_WIDTH = 240
export const SHAPE_TEXT_PADDING = 20
export const POSITION_ROW_SIDE_PADDING = 21
export const POSITION_ROW_VALUE_GAP = 16
export const NOTE_WIDTH = 240
export const NOTE_MIN_WIDTH = 120
export const NOTE_MAX_WIDTH = 600
export const NOTE_LEADING = 21
const MIGRATED_FLOW_MIN_Y = 128
const AS_NEEDED_CHIP_WIDTH = 188
const AS_NEEDED_CHIP_HEIGHT = 38
const OUTLINE_SAMPLES = 512
const DEFAULT_BOW_FRACTION = 0.15
const MAX_BOW_FRACTION = 0.5
const COLUMNS: Column[] = [
  { x: 390, y: 200, w: 250, buckets: ['shortTerm', 'cash', 'note'] },
  { x: 700, y: 240, w: 260, buckets: ['afterTax'] },
  {
    x: 1012,
    y: 200,
    w: 260,
    buckets: ['taxDeferred', 'taxPreferred', 'charitable'],
  },
]

const SUB_ACCOUNT_GAP = 8
const SUB_ACCOUNT_CAP_RY = 10
const TEXT_DESCENT = 0.22
const DETAIL_GAP = 12
const VALUE_GAP = 16
const SUPPORT_GAP = 8

function baselineAfterText(
  previousBaseline: number,
  previousFontSize: number,
  nextFontSize: number,
  clearSpace: number,
): number {
  return previousBaseline +
    previousFontSize * TEXT_DESCENT +
    clearSpace +
    nextFontSize
}

type AccountTextOverrides = Partial<Record<AccountTextRole, LayoutOverride>>

function accountTextOverrides(
  overrides: Record<string, LayoutOverride> | undefined,
  accountId: string,
): AccountTextOverrides {
  return {
    label: overrides?.[accountTextOverrideKey(accountId, 'label')],
    caption: overrides?.[accountTextOverrideKey(accountId, 'caption')],
    value: overrides?.[accountTextOverrideKey(accountId, 'value')],
    rows: overrides?.[accountTextOverrideKey(accountId, 'rows')],
    sub: overrides?.[accountTextOverrideKey(accountId, 'sub')],
  }
}

function accountTextFontSize(
  overrides: AccountTextOverrides,
  role: AccountTextRole,
  fallback: number,
): number {
  const maximum =
    role === 'rows' || role === 'sub'
      ? MAX_MAP_TEXT_FONT_SIZE
      : MAX_ACCOUNT_TEXT_FONT_SIZE
  return clamp(
    overrides[role]?.fs ?? fallback,
    MIN_ACCOUNT_TEXT_FONT_SIZE,
    maximum,
  )
}

function scaledLeading(
  defaultLeading: number,
  defaultFontSize: number,
  fontSize: number,
): number {
  return (defaultLeading / defaultFontSize) * fontSize
}

export interface IncomePanelMetrics {
  contentHeight: number
  dividerY: number
  firstRowY: number
  headerFontSize: number
  minWidth: number
  rowFontSize: number
  rowPitch: number
  rowValueOffset: number
  totalFontSize: number
}

export interface IncomeTextSizes {
  header: number
  rowLabel: number
  rowQualifier: number
  rowValue: number
  totalLabel: number
  totalValue: number
}

function fixedTextFontSize(
  data: MoneyMapData,
  element: 'income',
  role: 'header' | 'row' | 'total',
  fallback: number,
): number {
  return clamp(
    data.layoutOverrides?.[mapTextOverrideKey(element, role)]?.fs ??
      fallback,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
}

export function incomeTextSizes(data: MoneyMapData): IncomeTextSizes {
  const rowValue = fixedTextFontSize(
    data,
    'income',
    'row',
    TYPE.incomeValue,
  )
  const totalValue = fixedTextFontSize(
    data,
    'income',
    'total',
    TYPE.incomeTotalValue,
  )

  return {
    header: fixedTextFontSize(
      data,
      'income',
      'header',
      TYPE.panelHeader,
    ),
    rowLabel: rowValue * (13 / 14),
    rowQualifier: rowValue * (12 / 14),
    rowValue,
    totalLabel:
      totalValue * (TYPE.incomeTotalLabel / TYPE.incomeTotalValue),
    totalValue,
  }
}

export function incomePanelMetrics(
  data: MoneyMapData,
): IncomePanelMetrics {
  const sizes = incomeTextSizes(data)
  const headerFontSize = sizes.header
  const rowFontSize = sizes.rowValue
  const totalFontSize = sizes.totalValue
  const scale = rowFontSize / TYPE.incomeValue
  const headerBand = 48 * scale
  const rowPitch = 44 * scale
  const rowValueOffset = 18 * scale
  const firstRowY = headerBand + 17 * scale
  const dividerY =
    headerBand + data.incomeSources.length * rowPitch + 4 * scale
  const contentHeight = dividerY + 80
  const sourceWidths = data.incomeSources.flatMap((source) => [
    textWidth(source.label, sizes.rowLabel),
    textWidth(moneyPer(source.amount, source.period), rowFontSize),
  ])
  const headerWidth =
    textWidth('INCOME SOURCES', headerFontSize) +
    Math.max(0, 'INCOME SOURCES'.length - 1) * 1.7
  const totalWidth =
    textWidth('After-Tax Income', sizes.totalLabel) +
    16 +
    textWidth(money(data.afterTaxIncome), totalFontSize)
  const minWidth = Math.min(
    OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left,
    Math.max(
      MIN_INCOME_WIDTH,
      headerWidth + 40,
      totalWidth + 40,
      ...sourceWidths.map((width) => width + 40),
    ),
  )

  return {
    contentHeight,
    dividerY,
    firstRowY,
    headerFontSize,
    minWidth,
    rowFontSize,
    rowPitch,
    rowValueOffset,
    totalFontSize,
  }
}

export interface IncomeSourceTextLayout {
  id: string
  label: FittedText
  amount: FittedText
}

export function incomeSourceTextLayout(
  data: MoneyMapData,
  placed: Placed,
  source: IncomeSource,
): IncomeSourceTextLayout {
  const sizes = incomeTextSizes(data)
  const width = Math.max(1, placed.w - 40)
  return {
    id: source.id,
    label: fittedTextLine(source.label, width, sizes.rowLabel),
    amount: fittedTextLine(
      moneyPer(source.amount, source.period),
      width,
      sizes.rowValue,
    ),
  }
}

export function incomeTotalTextLayout(
  data: MoneyMapData,
  placed: Placed,
) {
  const sizes = incomeTextSizes(data)
  const available = Math.max(1, placed.w - 56)
  const labelText = 'After-Tax Income'
  const valueText = money(data.afterTaxIncome)
  const labelWidth = textWidth(labelText, sizes.totalLabel)
  const valueWidth = textWidth(valueText, sizes.totalValue)
  const scale =
    labelWidth + valueWidth <= available
      ? 1
      : available / (labelWidth + valueWidth)
  return {
    label: fittedTextLine(labelText, Math.max(1, labelWidth * scale), sizes.totalLabel),
    value: fittedTextLine(valueText, Math.max(1, valueWidth * scale), sizes.totalValue),
  }
}

export function needTextLayout(
  data: MoneyMapData,
  placed: Placed,
  supporting: string | null = null,
) {
  const width = Math.max(1, placed.w - 40)
  const valueSize = clamp(
    data.layoutOverrides?.[mapTextOverrideKey('need', 'value')]?.fs ??
      TYPE.needValue,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
  const labelSize = clamp(
    data.layoutOverrides?.[mapTextOverrideKey('need', 'label')]?.fs ??
      TYPE.needLabel,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
  const supportingSize = clamp(
    data.layoutOverrides?.[mapTextOverrideKey('need', 'supporting')]?.fs ??
      TYPE.mathNote,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
  return {
    label: fittedTextLine('MONTHLY INCOME NEED', width, labelSize),
    value: fittedTextLine(money(data.monthlyNeed), width, valueSize),
    supporting: fittedCalculatedTextLine(
      supporting ?? '',
      width,
      supportingSize,
    ),
  }
}

export function mastheadTitleFontSize(data: MoneyMapData): number {
  const title = data.client.title.trim()
  if (!title) return TYPE.masthead
  const naturalWidth = textWidth(title, TYPE.masthead)
  if (naturalWidth <= MASTHEAD_TITLE_MAX_WIDTH) return TYPE.masthead
  return clamp(
    TYPE.masthead * (MASTHEAD_TITLE_MAX_WIDTH / naturalWidth),
    MIN_MASTHEAD_TITLE_SIZE,
    TYPE.masthead,
  )
}

export interface FittedText {
  display: string
  exact: string
}

export interface FittedCalculatedText extends FittedText {
  fontSize: number
}

export function fittedCalculatedTextLine(
  text: string,
  maxWidth: number,
  size: number,
  minimumSize = MIN_MAP_TEXT_FONT_SIZE,
): FittedCalculatedText {
  const naturalWidth = textWidth(text, size)
  const readableFloor = Math.min(size, minimumSize)
  const fontSize = naturalWidth <= maxWidth || naturalWidth === 0
    ? size
    : Math.max(readableFloor, size * (maxWidth / naturalWidth))
  return {
    display: textWidth(text, fontSize) <= maxWidth ? text : '',
    exact: text,
    fontSize,
  }
}

export function fittedTextLine(
  text: string,
  maxWidth: number,
  size: number,
): FittedText {
  return {
    display: fitLines(text, maxWidth, size, 1)[0] ?? '',
    exact: text,
  }
}

function mastheadLabel(data: MoneyMapData): string {
  const period = mastheadPeriodLabel(data.client)
  const label = data.client.mastheadLabel?.trim() || 'Money Map'
  return data.client.variant === 'postNote'
    ? `${label} — ${period}`
    : `${label} ${period}`
}

export function mastheadTextLayout(data: MoneyMapData) {
  return {
    title: fittedTextLine(
      data.client.title,
      MASTHEAD_TITLE_MAX_WIDTH,
      mastheadTitleFontSize(data),
    ),
    label: fittedTextLine(
      mastheadLabel(data).toUpperCase(),
      MASTHEAD_LABEL_MAX_WIDTH,
      TYPE.mastheadLabel,
    ),
  }
}

export function flowLabelText(arrow: Arrow): FittedText {
  return fittedTextLine(
    arrow.label ?? '',
    FLOW_LABEL_MAX_WIDTH,
    TYPE.arrowLabel,
  )
}

function pillInset(width: number, height: number, y: number): number {
  const radius = Math.min(width, height) / 2
  if (radius === 0 || (y >= radius && y <= height - radius)) return 0
  const distance = y < radius ? radius - y : y - (height - radius)
  return radius - Math.sqrt(Math.max(0, radius ** 2 - distance ** 2))
}

export function usableTextWidth(
  shape: AccountShape,
  width: number,
  height: number,
  baseline: number,
  size: number,
): number {
  const textTop = Math.max(0, baseline - size)
  const textBottom = Math.min(height, baseline + size * TEXT_DESCENT)
  let shapeInset = 0

  if (shape === 'rect') {
    const inset = hexagonInset(width, height)
    const insetAt = (y: number) =>
      y < height / 2
        ? inset * (1 - (2 * y) / height)
        : inset * (1 - (2 * (height - y)) / height)
    shapeInset = Math.max(insetAt(textTop), insetAt(textBottom), 0)
  } else if (shape === 'pill') {
    shapeInset = Math.max(
      pillInset(width, height, textTop),
      pillInset(width, height, textBottom),
    )
  }

  return Math.max(
    1,
    width - 2 * (SHAPE_TEXT_PADDING + shapeInset),
  )
}

function subAccountLayout(
  subAccount: SubAccount,
  width: number,
  valueFontSize: number,
  textBudget: number,
): SubAccountLayout {
  const scale = valueFontSize / TYPE.subValue
  const titleFontSize = TYPE.subAccountTitle * scale
  const captionFontSize = TYPE.subAccountCaption * scale
  const titleLeading = LEADING.subAccountTitle * scale
  const captionLeading = LEADING.subAccountCaption * scale
  const usableWidth = Math.max(1, width - SHAPE_TEXT_PADDING * 2)
  const titleLines = fitLines(
    subAccount.label,
    usableWidth,
    titleFontSize,
    Math.max(2, Math.floor(textBudget / titleLeading)),
  )
  const safeTitleLines = titleLines.length > 0 ? titleLines : ['']
  const captionLines = subAccount.caption
    ? fitLines(
        subAccount.caption,
        usableWidth,
        captionFontSize,
        Math.max(2, Math.floor(textBudget / captionLeading)),
      )
    : []
  const titleY =
    SUB_ACCOUNT_CAP_RY * 2 + DETAIL_GAP + titleFontSize
  const titleLast =
    titleY +
    (safeTitleLines.length - 1) * titleLeading
  const captionY =
    captionLines.length > 0
      ? baselineAfterText(
          titleLast,
          titleFontSize,
          captionFontSize,
          DETAIL_GAP,
        )
      : undefined
  const captionLast =
    captionY === undefined
      ? titleLast
      : captionY +
        (captionLines.length - 1) * captionLeading
  const priorFontSize =
    captionY === undefined ? titleFontSize : captionFontSize
  const valueY = baselineAfterText(
    captionLast,
    priorFontSize,
    valueFontSize,
    VALUE_GAP,
  )
  const valueText = fittedTextLine(
    money(subAccount.value),
    usableWidth,
    valueFontSize,
  ).display
  const lastBaseline = valueY
  const h = Math.max(
    88,
    lastBaseline +
      SUB_ACCOUNT_CAP_RY +
      roleGap(valueFontSize, valueFontSize),
  )

  return {
    captionFontSize,
    captionLeading,
    captionLines,
    captionY,
    h,
    lastBaseline,
    subAccount,
    titleFontSize,
    titleLeading,
    titleLines: safeTitleLines,
    titleY,
    usableCaptionWidth: usableWidth,
    usableTitleWidth: usableWidth,
    valueFontSize,
    valueText,
    valueY,
    y: 0,
  }
}

function positionRowLayout(
  label: string,
  value: number | null,
  shape: AccountShape,
  width: number,
  height: number,
  firstBaseline: number,
  rowFontSize: number,
  rowLeading: number,
  textBudget: number,
): PositionRowLayout {
  const usableRowWidth = (baseline: number) => {
    const shapeWidth = usableTextWidth(
      shape,
      width,
      height,
      baseline,
      rowFontSize,
    )
    const shapePadding = (width - shapeWidth) / 2
    return Math.max(
      1,
      width -
        2 * Math.max(POSITION_ROW_SIDE_PADDING, shapePadding),
    )
  }
  const firstInnerWidth = usableRowWidth(firstBaseline)
  const valueText = fittedTextLine(
    money(value),
    firstInnerWidth * 0.6,
    rowFontSize,
  ).display
  const valueWidth = textWidth(valueText, rowFontSize)
  let innerWidth = usableRowWidth(firstBaseline)
  let labelMaxWidth = Math.max(
    1,
    innerWidth - POSITION_ROW_VALUE_GAP - valueWidth,
  )
  const maxLines = Math.max(1, Math.floor(textBudget / rowLeading))
  let labelLines = fitLines(label, labelMaxWidth, rowFontSize, maxLines)
  if (labelLines.length === 0) labelLines = ['']

  for (let pass = 0; pass < 8; pass += 1) {
    const lineWidths = labelLines.map(
      (_line, index) =>
        usableRowWidth(firstBaseline + index * rowLeading),
    )
    const nextInnerWidth = Math.min(...lineWidths)
    const nextLabelMaxWidth = Math.max(
      1,
      nextInnerWidth - POSITION_ROW_VALUE_GAP - valueWidth,
    )
    const nextLabelLines = fitLines(
      label,
      nextLabelMaxWidth,
      rowFontSize,
      maxLines,
    )
    const safeNextLabelLines =
      nextLabelLines.length > 0 ? nextLabelLines : ['']
    const stable =
      nextInnerWidth === innerWidth &&
      safeNextLabelLines.length === labelLines.length &&
      safeNextLabelLines.every((line, index) => line === labelLines[index])

    innerWidth = nextInnerWidth
    labelMaxWidth = nextLabelMaxWidth
    labelLines = safeNextLabelLines
    if (stable) break
  }

  const lastBaseline =
    firstBaseline + (labelLines.length - 1) * rowLeading
  const leftX = (width - innerWidth) / 2

  return {
    firstBaseline,
    h: rowFontSize + (labelLines.length - 1) * rowLeading,
    innerWidth,
    labelLines,
    labelMaxWidth,
    lastBaseline,
    leftX,
    topY: firstBaseline - rowFontSize,
    valueText,
    valueWidth,
    rightX: width - leftX,
  }
}

interface AccountSizing {
  captionLines: string[]
  capRy: number
  contentBottom: number
  firstBaseline: number
  h: number
  lastBaseline: number
  positionRows: PositionRowLayout[]
  subAccountLayouts: SubAccountLayout[]
  text: AccountTextLayout
  titleLines: string[]
  usableCaptionWidth: number
  usableTitleWidth: number
  usableValueWidth: number
  valueText: string
}

function accountSizing(
  account: Account,
  width: number,
  hasRunway: boolean,
  requestedHeight = 0,
  textOverrides: AccountTextOverrides = {},
  textBudgetLimit?: number,
): AccountSizing {
  const shape = accountShape(account)
  const capRy = Math.round(width * 0.13)
  const titleFontSize = accountTextFontSize(
    textOverrides,
    'label',
    TYPE.accountTitle,
  )
  const captionFontSize = accountTextFontSize(
    textOverrides,
    'caption',
    TYPE.caption,
  )
  const valueFontSize = accountTextFontSize(
    textOverrides,
    'value',
    TYPE.value,
  )
  const rowFontSize = accountTextFontSize(
    textOverrides,
    'rows',
    TYPE.row,
  )
  const rowLeading = scaledLeading(
    LEADING.row,
    TYPE.row,
    rowFontSize,
  )
  const subFontSize = accountTextFontSize(
    textOverrides,
    'sub',
    TYPE.subValue,
  )
  const titleLeading = scaledLeading(
    LEADING.accountTitle,
    TYPE.accountTitle,
    titleFontSize,
  )
  const captionLeading = scaledLeading(
    LEADING.caption,
    TYPE.caption,
    captionFontSize,
  )
  const flexibleRoles =
    2 + (account.positions?.length ?? 0) + 2 * (account.subAccounts?.length ?? 0)
  const textBudget = textBudgetLimit ??
    (OVERRIDE_BOUNDS.bottom - OVERRIDE_BOUNDS.top) / flexibleRoles
  let height = Math.max(
    requestedHeight,
    account.bucket === 'shortTerm' ? 250 : MIN_ACCOUNT_HEIGHT,
  )
  let sizing: AccountSizing | undefined

  for (let pass = 0; pass < 8; pass += 1) {
    const tagY = shape === 'drum' ? capRy : 25
    const titleY =
      shape === 'drum'
        ? capRy * 2 + DETAIL_GAP + titleFontSize
        : baselineAfterText(
            tagY,
            TYPE.accountTag,
            titleFontSize,
            DETAIL_GAP,
          )
    const usableTitleWidth = usableTextWidth(
      shape,
      width,
      height,
      titleY,
      titleFontSize,
    )
    const titleLines = fitLines(
      accountDisplayName(account),
      usableTitleWidth,
      titleFontSize,
      Math.max(2, Math.floor(textBudget / titleLeading)),
    )
    const safeTitleLines =
      titleLines.length > 0 ? titleLines : ['']
    const titleLast =
      titleY +
      (safeTitleLines.length - 1) * titleLeading
    const provisionalCaptionY = baselineAfterText(
      titleLast,
      titleFontSize,
      captionFontSize,
      DETAIL_GAP,
    )
    const usableCaptionWidth = usableTextWidth(
      shape,
      width,
      height,
      provisionalCaptionY,
      captionFontSize,
    )
    const captionLines = account.caption
      ? fitLines(
          account.caption,
          usableCaptionWidth,
          captionFontSize,
          Math.max(2, Math.floor(textBudget / captionLeading)),
        )
      : []
    const captionY =
      captionLines.length > 0 ? provisionalCaptionY : undefined
    let previousBaseline =
      captionY === undefined
          ? titleLast
          : captionY +
          (captionLines.length - 1) * captionLeading
    let previousLineHeight =
      captionY === undefined ? titleLeading : captionLeading
    let previousFontSize =
      captionY === undefined ? titleFontSize : captionFontSize
    const positionRows = (account.positions ?? []).map(
      (position, index) => {
        const firstBaseline =
          index === 0
            ? baselineAfterText(
                previousBaseline,
                previousFontSize,
                rowFontSize,
                DETAIL_GAP,
              )
            : previousBaseline + rowLeading
        const row = positionRowLayout(
          position.label,
          position.value,
          shape,
          width,
          height,
          firstBaseline,
          rowFontSize,
          rowLeading,
          textBudget,
        )
        previousBaseline = row.lastBaseline
        previousLineHeight = rowLeading
        previousFontSize = rowFontSize
        return row
      },
    )
    const rowBaselines = positionRows.map((row) => row.firstBaseline)
    const valueY = baselineAfterText(
      previousBaseline,
      previousFontSize,
      valueFontSize,
      VALUE_GAP,
    )
    const usableValueWidth = usableTextWidth(
      shape,
      width,
      height,
      valueY,
      valueFontSize,
    )
    const valueText = fittedTextLine(
      money(account.value),
      usableValueWidth,
      valueFontSize,
    ).display
    const runwayY = hasRunway
      ? baselineAfterText(
          valueY,
          valueFontSize,
          TYPE.runway,
          SUPPORT_GAP,
        )
      : undefined
    previousBaseline = runwayY ?? valueY
    previousLineHeight = runwayY === undefined ? valueFontSize : TYPE.runway

    const subWidth = width * 0.72
    const rawSubAccountLayouts = (account.subAccounts ?? []).map(
      (subAccount) =>
        subAccountLayout(subAccount, subWidth, subFontSize, textBudget),
    )
    const firstSubLineHeight =
      rawSubAccountLayouts[0]?.titleLeading ?? subFontSize
    const subStartY =
      rawSubAccountLayouts.length > 0
        ? previousBaseline +
          roleGap(previousLineHeight, firstSubLineHeight)
        : previousBaseline
    let nextSubY = subStartY
    const subAccountLayouts = rawSubAccountLayouts.map((subLayout) => {
      const placedSubLayout = { ...subLayout, y: nextSubY }
      nextSubY += subLayout.h + SUB_ACCOUNT_GAP
      return placedSubLayout
    })
    let contentBottom = previousBaseline
    let lastBaseline = previousBaseline
    if (subAccountLayouts.length > 0) {
      for (const subLayout of subAccountLayouts) {
        lastBaseline = subLayout.y + subLayout.lastBaseline
      }
      contentBottom =
        subAccountLayouts[subAccountLayouts.length - 1].y +
        subAccountLayouts[subAccountLayouts.length - 1].h
      previousLineHeight =
        subAccountLayouts[subAccountLayouts.length - 1].valueFontSize
    }

    const proportionalBottomGap = roleGap(
      previousLineHeight,
      previousLineHeight,
    )
    const bottomClearance =
      shape === 'drum'
        ? capRy + proportionalBottomGap
        : shape === 'pill'
          ? Math.max(24, proportionalBottomGap)
          : Math.max(SHAPE_TEXT_PADDING, proportionalBottomGap)
    const minimumHeight =
      account.bucket === 'shortTerm' ? 250 : MIN_ACCOUNT_HEIGHT
    const requiredHeight = Math.max(
      requestedHeight,
      minimumHeight,
      contentBottom + bottomClearance,
    )

    sizing = {
      captionLines,
      capRy,
      contentBottom,
      firstBaseline: titleY,
      h: requiredHeight,
      lastBaseline,
      positionRows,
      subAccountLayouts,
      text: {
        captionFontSize,
        captionLeading,
        captionX: 0,
        captionY,
        rowFontSize,
        rowBaselines,
        rowLeading,
        runwayY,
        subFontSize,
        subStartY,
        tagY,
        titleFontSize,
        titleLeading,
        titleX: 0,
        titleY,
        valueFontSize,
        valueX: 0,
        valueY,
      },
      titleLines: safeTitleLines,
      usableCaptionWidth,
      usableTitleWidth,
      usableValueWidth,
      valueText,
    }

    if (Math.abs(requiredHeight - height) < 0.01) break
    height = requiredHeight
  }

  return sizing!
}

function fittedAccount(
  account: Account,
  minimumWidth: number,
  hasRunway: boolean,
  requestedHeight = 0,
  textOverrides: AccountTextOverrides = {},
  textBudgetLimit?: number,
): { sizing: AccountSizing; width: number } {
  const sizing = accountSizing(
    account,
    minimumWidth,
    hasRunway,
    requestedHeight,
    textOverrides,
    textBudgetLimit,
  )
  return { sizing, width: minimumWidth }
}

function orderForColumn(accounts: Account[], buckets: Bucket[]): Account[] {
  return buckets.flatMap((bucket) =>
    accounts.filter((account) => account.bucket === bucket),
  )
}

function compressedGap(
  heights: number[],
  available: number,
): number {
  if (heights.length < 2) return 0
  const remaining = available - heights.reduce((sum, height) => sum + height, 0)
  return Math.max(8, Math.min(COMPRESSED_GAP, remaining / (heights.length - 1)))
}

function placeColumn(data: MoneyMapData, column: Column): PlacedAccount[] {
  const accounts = orderForColumn(data.accounts, column.buckets)
  if (accounts.length === 0) return []

  const available = STACK_BOTTOM - column.y
  const roleCount = (account: Account) =>
    2 + (account.positions?.length ?? 0) +
      2 * (account.subAccounts?.length ?? 0)
  let textBudget = available /
    accounts.reduce((total, account) => total + roleCount(account), 0)
  let fitted: ReturnType<typeof fittedAccount>[] = []
  for (let pass = 0; pass < 8; pass += 1) {
    fitted = accounts.map((account) =>
      fittedAccount(
        account,
        column.w,
        runwayLine(
          account.value,
          data.asNeededAmount,
          data.showMath !== false,
        ) !== null && account.bucket === 'shortTerm',
        0,
        accountTextOverrides(data.layoutOverrides, account.id),
        textBudget,
      ),
    )
    const used = fitted.reduce((total, item) => total + item.sizing.h, 0) +
      8 * Math.max(0, accounts.length - 1)
    if (used <= available) break
    textBudget *= Math.max(0.5, available / used)
  }
  const sizings = fitted.map((item) => item.sizing)
  const heights = sizings.map((sizing) => sizing.h)
  let gap = DEFAULT_GAP
  const total =
    heights.reduce((sum, height) => sum + height, 0) +
    gap * Math.max(0, accounts.length - 1)

  if (total > available) {
    gap = compressedGap(heights, available)
  }

  let y = column.y
  return accounts.map((account, index) => {
    const sizing = sizings[index]
    const placed = {
      account,
      ...sizing,
      x: column.x,
      y,
      w: fitted[index].width,
      rot: 0,
    }
    y += heights[index] + gap
    return placed
  })
}

function coordinate(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

type Point = { x: number; y: number }
export type OutlineElement = Placed | PlacedAccount

export function hexagonInset(width: number, height: number): number {
  return Math.min(height * 0.22, 34, width / 2)
}

function isDrum(element: OutlineElement): boolean {
  return (
    'account' in element &&
    accountShape(element.account) === 'drum'
  )
}

function pointOnRoundedRect(
  element: Placed,
  t: number,
  radius: number,
): Point {
  const r = Math.min(radius, element.w / 2, element.h / 2)
  const quarter = Math.min(3, Math.floor(t * 4))
  const progress = t * 4 - quarter
  const horizontal = element.w - r * 2
  const vertical = element.h - r * 2
  const arc = (Math.PI * r) / 2
  const edge = quarter % 2 === 0 ? horizontal : vertical
  const distance = progress * (edge + arc)

  if (distance <= edge) {
    if (quarter === 0) {
      return { x: element.x + r + distance, y: element.y }
    }
    if (quarter === 1) {
      return {
        x: element.x + element.w,
        y: element.y + r + distance,
      }
    }
    if (quarter === 2) {
      return {
        x: element.x + element.w - r - distance,
        y: element.y + element.h,
      }
    }
    return {
      x: element.x,
      y: element.y + element.h - r - distance,
    }
  }

  const angleProgress = arc === 0 ? 1 : (distance - edge) / arc
  const angle = -Math.PI / 2 + (quarter + angleProgress) * (Math.PI / 2)
  const cornerCenters = [
    { x: element.x + element.w - r, y: element.y + r },
    {
      x: element.x + element.w - r,
      y: element.y + element.h - r,
    },
    { x: element.x + r, y: element.y + element.h - r },
    { x: element.x + r, y: element.y + r },
  ]
  const center = cornerCenters[quarter]
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle),
  }
}

function pointOnHexagon(element: Placed, t: number): Point {
  const inset = hexagonInset(element.w, element.h)
  const points = [
    { x: element.x + inset, y: element.y },
    { x: element.x + element.w - inset, y: element.y },
    { x: element.x + element.w, y: element.y + element.h / 2 },
    { x: element.x + element.w - inset, y: element.y + element.h },
    { x: element.x + inset, y: element.y + element.h },
    { x: element.x, y: element.y + element.h / 2 },
  ]
  const segment = Math.min(5, Math.floor(t * 6))
  const progress = t * 6 - segment
  const start = points[segment]
  const end = points[(segment + 1) % points.length]
  return {
    x: start.x + (end.x - start.x) * progress,
    y: start.y + (end.y - start.y) * progress,
  }
}

function centerOf(element: Placed): Point {
  return {
    x: element.x + element.w / 2,
    y: element.y + element.h / 2,
  }
}

export function rotatePoint(
  point: Point,
  center: Point,
  degrees: number,
): Point {
  const radians = (degrees * Math.PI) / 180
  const cosine = Math.cos(radians)
  const sine = Math.sin(radians)
  const dx = point.x - center.x
  const dy = point.y - center.y
  return {
    x: center.x + dx * cosine - dy * sine,
    y: center.y + dx * sine + dy * cosine,
  }
}

export function rotatedBounds(element: Placed, degrees: number): Placed {
  const radians = (degrees * Math.PI) / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  const w = element.w * cosine + element.h * sine
  const h = element.w * sine + element.h * cosine
  const center = centerOf(element)
  return {
    x: center.x - w / 2,
    y: center.y - h / 2,
    w,
    h,
  }
}

function obstacleBounds(element: Placed): Placed {
  return 'rot' in element
    ? rotatedBounds(element, (element as PlacedAccount).rot)
    : element
}

/**
 * Clockwise outline parameter. Flat shapes start along their top-left edge;
 * drums start at the left shoulder and follow the top arc, right side,
 * bottom arc, then left side.
 */
function pointOnUnrotatedOutline(
  element: OutlineElement,
  rawT: number,
): Point {
  const t = clamp(rawT, 0, 1)
  if ('account' in element && !isDrum(element)) {
    const shape = accountShape(element.account)
    if (shape === 'rect') return pointOnHexagon(element, t)
    const radius =
      shape === 'card'
        ? 12
        : shape === 'pill'
          ? Math.min(element.w, element.h) / 2
          : 0
    return pointOnRoundedRect(element, t, radius)
  }
  if (!('account' in element)) {
    if (t <= 0.25) {
      return { x: element.x + element.w * t * 4, y: element.y }
    }
    if (t <= 0.5) {
      return {
        x: element.x + element.w,
        y: element.y + element.h * (t - 0.25) * 4,
      }
    }
    if (t <= 0.75) {
      return {
        x: element.x + element.w * (1 - (t - 0.5) * 4),
        y: element.y + element.h,
      }
    }
    return {
      x: element.x,
      y: element.y + element.h * (1 - (t - 0.75) * 4),
    }
  }

  const centerX = element.x + element.w / 2
  const radiusX = element.w / 2
  if (t <= 0.25) {
    const angle = Math.PI + t * 4 * Math.PI
    return {
      x: centerX + radiusX * Math.cos(angle),
      y: element.y + element.capRy + element.capRy * Math.sin(angle),
    }
  }
  if (t <= 0.5) {
    return {
      x: element.x + element.w,
      y:
        element.y +
        element.capRy +
        (element.h - element.capRy * 2) * (t - 0.25) * 4,
    }
  }
  if (t <= 0.75) {
    const angle = (t - 0.5) * 4 * Math.PI
    return {
      x: centerX + radiusX * Math.cos(angle),
      y:
        element.y +
        element.h -
        element.capRy +
        element.capRy * Math.sin(angle),
    }
  }
  return {
    x: element.x,
    y:
      element.y +
      element.h -
      element.capRy -
      (element.h - element.capRy * 2) * (t - 0.75) * 4,
  }
}

export function pointOnOutline(
  element: OutlineElement,
  rawT: number,
): Point {
  const point = pointOnUnrotatedOutline(element, rawT)
  return 'rot' in element && element.rot !== 0
    ? rotatePoint(point, centerOf(element), element.rot)
    : point
}

function facingOutlineT(
  element: OutlineElement,
  counterpart: OutlineElement,
): number {
  const center = centerOf(element)
  const toward = centerOf(counterpart)
  const direction = {
    x: toward.x - center.x,
    y: toward.y - center.y,
  }
  const length = Math.hypot(direction.x, direction.y)
  if (length === 0) return 0

  let bestT = 0
  let bestScore = Number.POSITIVE_INFINITY
  for (let sample = 0; sample < OUTLINE_SAMPLES; sample += 1) {
    const t = sample / OUTLINE_SAMPLES
    const point = pointOnOutline(element, t)
    const relative = { x: point.x - center.x, y: point.y - center.y }
    const forward =
      (relative.x * direction.x + relative.y * direction.y) / length
    if (forward <= 0) continue
    const perpendicular = Math.abs(
      relative.x * direction.y - relative.y * direction.x,
    ) / length
    const score = perpendicular / forward
    if (score < bestScore) {
      bestScore = score
      bestT = t
    }
  }
  return bestT
}

export function nearestOutlineT(
  element: OutlineElement,
  point: Point,
): number {
  let bestT = 0
  let bestDistance = Number.POSITIVE_INFINITY
  for (let sample = 0; sample <= OUTLINE_SAMPLES; sample += 1) {
    const t = sample / OUTLINE_SAMPLES
    const candidate = pointOnOutline(element, t)
    const distance = Math.hypot(
      point.x - candidate.x,
      point.y - candidate.y,
    )
    if (distance < bestDistance) {
      bestDistance = distance
      bestT = t
    }
  }
  return bestT
}

function topCapT(xFraction = 0.35): number {
  const angle = Math.acos(xFraction * 2 - 1)
  return (Math.PI * 2 - angle - Math.PI) / (Math.PI * 4)
}

function pointOnQuadratic(
  start: Point,
  control: Point,
  end: Point,
  t: number,
): Point {
  const oneMinusT = 1 - t
  return {
    x:
      oneMinusT ** 2 * start.x +
      2 * oneMinusT * t * control.x +
      t ** 2 * end.x,
    y:
      oneMinusT ** 2 * start.y +
      2 * oneMinusT * t * control.y +
      t ** 2 * end.y,
  }
}

function controlForBow(start: Point, end: Point, bow: number): Point {
  const chordX = end.x - start.x
  const chordY = end.y - start.y
  const length = Math.hypot(chordX, chordY) || 1
  return {
    x: (start.x + end.x) / 2 - (chordY / length) * bow,
    y: (start.y + end.y) / 2 + (chordX / length) * bow,
  }
}

const MIN_ARROW_CHORD = 24

function separatedArrowEnd(
  start: Point,
  end: Point,
  source: OutlineElement,
  target: OutlineElement,
): Point {
  const chord = { x: end.x - start.x, y: end.y - start.y }
  const chordLength = Math.hypot(chord.x, chord.y)
  if (chordLength >= MIN_ARROW_CHORD) return end

  const sourceCenter = centerOf(source)
  const targetCenter = centerOf(target)
  const semantic = {
    x: targetCenter.x - sourceCenter.x,
    y: targetCenter.y - sourceCenter.y,
  }
  const direction = chordLength > 0 ? chord : semantic
  const length = Math.hypot(direction.x, direction.y) || 1
  const unit = { x: direction.x / length, y: direction.y / length }
  const candidates = [
    unit,
    { x: -unit.x, y: -unit.y },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
  ].map((candidate) => ({
    x: start.x + candidate.x * MIN_ARROW_CHORD,
    y: start.y + candidate.y * MIN_ARROW_CHORD,
  }))

  return candidates.find(
    (candidate) =>
      candidate.x >= OVERRIDE_BOUNDS.left &&
      candidate.x <= OVERRIDE_BOUNDS.right &&
      candidate.y >= OVERRIDE_BOUNDS.top &&
      candidate.y <= OVERRIDE_BOUNDS.bottom,
  ) ?? end
}

function boundedBow(
  start: Point,
  end: Point,
  requested: number,
  minimumY: number,
): number {
  const chordX = end.x - start.x
  const chordY = end.y - start.y
  const chordLength = Math.hypot(chordX, chordY) || 1
  const maximumBow = chordLength * MAX_BOW_FRACTION
  const midpoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  }
  const normal = {
    x: -chordY / chordLength,
    y: chordX / chordLength,
  }
  let minimum = -maximumBow
  let maximum = maximumBow
  const constrain = (
    midpointValue: number,
    normalValue: number,
    lowerBound: number,
    upperBound: number,
  ) => {
    if (Math.abs(normalValue) < 1e-9) return
    const first = (lowerBound - midpointValue) / normalValue
    const second = (upperBound - midpointValue) / normalValue
    minimum = Math.max(minimum, Math.min(first, second))
    maximum = Math.min(maximum, Math.max(first, second))
  }
  constrain(
    midpoint.x,
    normal.x,
    OVERRIDE_BOUNDS.left,
    OVERRIDE_BOUNDS.right,
  )
  constrain(
    midpoint.y,
    normal.y,
    Math.max(OVERRIDE_BOUNDS.top, minimumY),
    OVERRIDE_BOUNDS.bottom,
  )
  return clamp(requested, minimum, maximum)
}

function routedArrow({
  kind,
  source,
  target,
  override,
  preferredStartT,
  preferredEndT,
  preferAbove = false,
  minimumY = MASTHEAD_RULE_Y,
  sourceId,
  targetId,
}: {
  kind: Arrow['kind']
  source: OutlineElement
  target: OutlineElement
  override?: LayoutOverride
  preferredStartT?: number
  preferredEndT?: number
  preferAbove?: boolean
  minimumY?: number
  sourceId?: string
  targetId?: string
}): Arrow {
  const defaultStartT =
    preferredStartT ?? facingOutlineT(source, target)
  const defaultEndT = preferredEndT ?? facingOutlineT(target, source)
  const startT = clamp(override?.startT ?? defaultStartT, 0, 1)
  const endT = clamp(override?.endT ?? defaultEndT, 0, 1)
  const freePoint = (
    element: OutlineElement,
    offset: { dx: number; dy: number },
  ): Point => {
    const center = centerOf(element)
    return {
      x: clamp(
        center.x + offset.dx,
        OVERRIDE_BOUNDS.left,
        OVERRIDE_BOUNDS.right,
      ),
      y: clamp(
        center.y + offset.dy,
        OVERRIDE_BOUNDS.top,
        OVERRIDE_BOUNDS.bottom,
      ),
    }
  }
  const start = override?.startAt
    ? freePoint(source, override.startAt)
    : pointOnOutline(source, startT)
  const rawEnd = override?.endAt
    ? freePoint(target, override.endAt)
    : pointOnOutline(target, endT)
  const end = override?.startAt || override?.endAt
    ? separatedArrowEnd(start, rawEnd, source, target)
    : rawEnd
  const chordLength = Math.hypot(end.x - start.x, end.y - start.y)
  const baseMagnitude = chordLength * DEFAULT_BOW_FRACTION
  const normalY = chordLength === 0 ? 0 : (end.x - start.x) / chordLength
  const preferredSign = preferAbove
    ? normalY <= 0
      ? 1
      : -1
    : -1
  const bow = boundedBow(
    start,
    end,
    override?.bow ?? preferredSign * baseMagnitude,
    preferAbove ? minimumY : OVERRIDE_BOUNDS.top,
  )
  const control = controlForBow(start, end, bow)
  const startCenter = centerOf(source)
  const endCenter = centerOf(target)

  return {
    kind,
    sourceId,
    targetId,
    start,
    control,
    end,
    bow,
    startT,
    endT,
    startAt: override?.startAt
      ? { dx: start.x - startCenter.x, dy: start.y - startCenter.y }
      : undefined,
    endAt: override?.endAt
      ? { dx: end.x - endCenter.x, dy: end.y - endCenter.y }
      : undefined,
    style: override?.style,
    color: override?.color,
    d: [
      `M ${coordinate(start.x)} ${coordinate(start.y)}`,
      `Q ${coordinate(control.x)} ${coordinate(control.y)}`,
      `${coordinate(end.x)} ${coordinate(end.y)}`,
    ].join(' '),
  }
}

function incomeArrow(
  income: Placed,
  need: Placed,
  override?: LayoutOverride,
): Arrow {
  return routedArrow({
    kind: 'income',
    source: income,
    target: need,
    override,
  })
}

function customArrowLayouts(
  customArrows: CustomArrow[] | undefined,
  income: Placed,
  need: Placed,
  accounts: PlacedAccount[],
  overrides?: Record<string, LayoutOverride>,
): Arrow[] {
  const elements = new Map<string, OutlineElement>([
    ['income', income],
    ['need', need],
    ...accounts.map(
      (placed) => [placed.account.id, placed] as [string, OutlineElement],
    ),
  ])
  const migratedAccountIds = new Set(
    (customArrows ?? []).flatMap((record) =>
      isMigratedFlowId(record.id)
        ? [record.sourceId, record.targetId]
        : [],
    ),
  )
  const preserveMigratedCaps = [...migratedAccountIds].every((id) => {
    const override = overrides?.[id]
    return (
      override?.dx === undefined &&
      override?.dy === undefined &&
      override?.w === undefined &&
      override?.h === undefined &&
      override?.rot === undefined
    )
  })

  return (customArrows ?? []).flatMap((record) => {
    const source = elements.get(record.sourceId)
    const target = elements.get(record.targetId)
    if (!source || !target) return []

    const migrated = isMigratedFlowId(record.id)
    const capT = migrated && preserveMigratedCaps ? topCapT() : undefined
    const arrow = routedArrow({
      kind: 'custom',
      source,
      target,
      override: overrides?.[`arrow:custom:${record.id}`],
      preferredStartT: isDrum(source) ? capT : undefined,
      preferredEndT: isDrum(target) ? capT : undefined,
      preferAbove: migrated && preserveMigratedCaps,
      minimumY: migrated
        ? MIGRATED_FLOW_MIN_Y
        : MASTHEAD_RULE_Y,
      sourceId: record.sourceId,
      targetId: record.targetId,
    })
    return [
      {
        ...arrow,
        id: record.id,
        style: record.style ?? 'solid',
        color: record.color,
        label: record.label,
        labelAt: record.label
          ? (() => {
              const midpoint = pointOnQuadratic(
                arrow.start,
                arrow.control,
                arrow.end,
                0.5,
              )
              return {
                x: midpoint.x + (record.labelDx ?? 0),
                y: midpoint.y + (record.labelDy ?? 0),
              }
            })()
          : undefined,
      },
    ]
  })
}

export function visibleGeneratedArrowKinds(
  arrows: Arrow[],
): GeneratedArrowKind[] {
  const present = new Set(arrows.map((arrow) => arrow.kind))
  return (['income', 'asNeeded'] as const).filter((kind) =>
    present.has(kind),
  )
}

function asNeededArrow(
  shortTerm: PlacedAccount,
  need: Placed,
  override?: LayoutOverride,
): Arrow {
  const arrow = routedArrow({
    kind: 'asNeeded',
    source: shortTerm,
    target: need,
    override,
    sourceId: shortTerm.account.id,
  })
  const { start, control, end } = arrow
  const t = 0.7
  const point = pointOnQuadratic(start, control, end, t)
  const tangent = {
    x: 2 * (1 - t) * (control.x - start.x) + 2 * t * (end.x - control.x),
    y: 2 * (1 - t) * (control.y - start.y) + 2 * t * (end.y - control.y),
  }
  const tangentLength = Math.hypot(tangent.x, tangent.y) || 1

  return {
    ...arrow,
    labelAt: {
      x: point.x - (tangent.y / tangentLength) * 70,
      y: point.y + (tangent.x / tangentLength) * 70,
    },
  }
}

function pathCoordinates(path: string): { x: number; y: number }[] {
  const values = [...path.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0]),
  )
  const points: { x: number; y: number }[] = []
  for (let index = 0; index < values.length; index += 2) {
    points.push({ x: values[index], y: values[index + 1] })
  }
  return points
}

function boundsForPoints(
  points: { x: number; y: number }[],
): Placed {
  const xValues = points.map((point) => point.x)
  const yValues = points.map((point) => point.y)
  const x = Math.min(...xValues)
  const y = Math.min(...yValues)
  return {
    x,
    y,
    w: Math.max(...xValues) - x,
    h: Math.max(...yValues) - y,
  }
}

function arrowBounds(arrow: Arrow): Placed[] {
  const bounds = [boundsForPoints(pathCoordinates(arrow.d))]
  if (arrow.labelAt) {
    const isFlowLabel = arrow.kind === 'custom' && arrow.label
    const width = isFlowLabel
      ? textWidth(flowLabelText(arrow).display, TYPE.arrowLabel) + 12
      : AS_NEEDED_CHIP_WIDTH
    const height = isFlowLabel
      ? TYPE.arrowLabel + 8
      : AS_NEEDED_CHIP_HEIGHT
    bounds.push({
      x: arrow.labelAt.x - width / 2,
      y: arrow.labelAt.y - height / 2,
      w: width,
      h: height,
    })
  }
  return bounds
}

function contentBounds(
  layout: Pick<MapLayout, 'income' | 'need' | 'accounts' | 'arrows'> &
    Partial<Pick<MapLayout, 'notes'>>,
): Placed {
  const boxes = [
    layout.income,
    layout.need,
    ...layout.accounts.map(obstacleBounds),
    ...(layout.notes ?? []),
    ...layout.arrows.flatMap(arrowBounds),
  ]
  const x = Math.min(...boxes.map((box) => box.x))
  const y = Math.min(...boxes.map((box) => box.y))
  const right = Math.max(...boxes.map((box) => box.x + box.w))
  const bottom = Math.max(...boxes.map((box) => box.y + box.h))
  return { x, y, w: right - x, h: bottom - y }
}

function constrainedOffset(
  desired: number,
  minimum: number,
  maximum: number,
): number {
  if (minimum > maximum) return (minimum + maximum) / 2
  return Math.min(maximum, Math.max(minimum, desired))
}

function translatePath(path: string, dx: number, dy: number): string {
  let index = 0
  return path.replace(/-?\d+(?:\.\d+)?/g, (match) => {
    const offset = index % 2 === 0 ? dx : dy
    index += 1
    return coordinate(Number(match) + offset)
  })
}

function translatePlaced<T extends Placed>(
  placed: T,
  dx: number,
  dy: number,
): T {
  return { ...placed, x: placed.x + dx, y: placed.y + dy }
}

function centerComposition(
  layout: Omit<MapLayout, 'contentBounds'>,
  hasFootnotes: boolean,
): MapLayout {
  const bounds = contentBounds(layout)
  const horizontalCenter = ARTBOARD.width / 2
  const lowerBound = hasFootnotes
    ? FOOTNOTED_CONTENT_BOTTOM
    : OPEN_CONTENT_BOTTOM
  const verticalCenter = (MASTHEAD_RULE_Y + lowerBound) / 2
  const minimumDy = Math.max(
    MASTHEAD_RULE_Y - bounds.y,
    OVERRIDE_BOUNDS.top - layout.income.y,
  )
  const maximumDy = lowerBound - (bounds.y + bounds.h)
  const desiredDy = verticalCenter - (bounds.y + bounds.h / 2)
  const dx =
    Math.round(
      constrainedOffset(
        horizontalCenter - (bounds.x + bounds.w / 2),
        PAGE_MARGIN - bounds.x,
        ARTBOARD.width - PAGE_MARGIN - (bounds.x + bounds.w),
      ) * 10,
    ) / 10
  const dy =
    Math.round(
      (minimumDy > maximumDy
        ? minimumDy
        : constrainedOffset(desiredDy, minimumDy, maximumDy)) * 10,
    ) / 10
  const centered = {
    ...layout,
    income: translatePlaced(layout.income, dx, dy),
    need: translatePlaced(layout.need, dx, dy),
    accounts: layout.accounts.map((account) =>
      translatePlaced(account, dx, dy),
    ),
    arrows: layout.arrows.map((arrow) => ({
      ...arrow,
      d: translatePath(arrow.d, dx, dy),
      start: {
        x: arrow.start.x + dx,
        y: arrow.start.y + dy,
      },
      control: {
        x: arrow.control.x + dx,
        y: arrow.control.y + dy,
      },
      end: {
        x: arrow.end.x + dx,
        y: arrow.end.y + dy,
      },
      labelAt: arrow.labelAt
        ? {
            x: arrow.labelAt.x + dx,
            y: arrow.labelAt.y + dy,
          }
        : undefined,
    })),
  }
  const centeredBounds = contentBounds(centered)

  return {
    ...centered,
    contentBounds: centeredBounds,
    footnotesAt: {
      x: centeredBounds.x + centeredBounds.w / 2,
      y: FOOTNOTE_BASELINE_Y,
    },
  }
}

export const OVERRIDE_BOUNDS = {
  left: PAGE_MARGIN,
  top: MASTHEAD_RULE_Y,
  right: ARTBOARD.width - PAGE_MARGIN,
  bottom: ARTBOARD.height - PAGE_MARGIN,
}

export function mapTextOffset(
  data: MoneyMapData,
  element: MapTextElement,
  role: MapTextElementRole,
  block: Placed,
  itemId?: string,
): { dx: number; dy: number } {
  const shared =
    data.layoutOverrides?.[mapTextOverrideKey(element, role)]
  const item = itemId
    ? data.layoutOverrides?.[
        mapItemTextOverrideKey(element, role, itemId)
      ]
    : undefined
  const override =
    shared || item ? { ...shared, ...item } : undefined
  if (override?.dx === undefined && override?.dy === undefined) {
    return { dx: 0, dy: 0 }
  }
  const clamped = clampRectToBounds(
    {
      ...block,
      x: block.x + (override?.dx ?? 0),
      y: block.y + (override?.dy ?? 0),
    },
    OVERRIDE_BOUNDS,
  )
  return { dx: clamped.x - block.x, dy: clamped.y - block.y }
}

export interface FootnoteLineLayout {
  fontSize: number
  footnote: Footnote
  text: FittedText
  y: number
}

export function footnoteText(footnote: Footnote, fontSize: number): FittedText {
  return fittedTextLine(
    `${footnote.label}: ${money(footnote.gross)} → ${money(footnote.net)} after withholding`,
    720,
    fontSize,
  )
}

export function footnoteHasContent(footnote: Footnote): boolean {
  return (
    footnote.label.trim().length > 0 ||
    footnote.gross !== null ||
    footnote.net !== null
  )
}

export function footnoteLineLayouts(
  data: MoneyMapData,
  preferredBaseline = FOOTNOTE_BASELINE_Y,
): FootnoteLineLayout[] {
  const shared =
    data.layoutOverrides?.[mapTextOverrideKey('footnotes', 'line')]
  const specs = data.footnotes
    .filter(footnoteHasContent)
    .map((footnote) => {
      const item = data.layoutOverrides?.[
        mapItemTextOverrideKey('footnotes', 'line', footnote.id)
      ]
      return {
        dy: item?.dy ?? shared?.dy ?? 0,
        fontSize: clamp(
          item?.fs ?? shared?.fs ?? TYPE.footnote,
          MIN_MAP_TEXT_FONT_SIZE,
          MAX_MAP_TEXT_FONT_SIZE,
        ),
        footnote,
      }
    })
  if (specs.length === 0) return []

  let y = preferredBaseline
  const lines = specs.map((spec, index) => {
    const previous = specs[index - 1]
    if (previous) {
      const adjacentAdvance =
        Math.max(previous.fontSize, spec.fontSize) * 1.6
      y +=
        adjacentAdvance +
        Math.max(0, previous.dy - spec.dy)
    }
    return {
      fontSize: spec.fontSize,
      footnote: spec.footnote,
      text: footnoteText(spec.footnote, spec.fontSize),
      y,
    }
  })
  const last = lines.at(-1)!
  const lastDy = specs.at(-1)!.dy
  const shift = Math.min(
    0,
    OVERRIDE_BOUNDS.bottom - 6 - (last.y + lastDy),
  )
  return lines.map((line) => ({ ...line, y: line.y + shift }))
}

function placedNotes(notes: MapNote[] | undefined): PlacedNote[] {
  return (notes ?? []).map((note) => {
    const width = clamp(
      note.w ?? NOTE_WIDTH,
      NOTE_MIN_WIDTH,
      NOTE_MAX_WIDTH,
    )
    const fontSize = clamp(
      note.fs ?? TYPE.note,
      MIN_MAP_TEXT_FONT_SIZE,
      MAX_MAP_TEXT_FONT_SIZE,
    )
    const lineAdvance = NOTE_LEADING * (fontSize / TYPE.note)
    const y = clamp(
      note.y,
      OVERRIDE_BOUNDS.top,
      OVERRIDE_BOUNDS.bottom - fontSize,
    )
    const maxLines = Math.max(
      1,
      Math.floor((OVERRIDE_BOUNDS.bottom - y - fontSize) / lineAdvance) + 1,
    )
    const lines = fitLines(note.text, width, fontSize, maxLines)
    const h = Math.max(fontSize, lines.length * lineAdvance)
    const placed = clampRectToBounds(
      { x: note.x, y, w: width, h },
      OVERRIDE_BOUNDS,
    )
    return { ...placed, fontSize, lineAdvance, lines, note }
  })
}

function applyPlacedOverride<T extends Placed>(
  placed: T,
  override: LayoutOverride | undefined,
): T {
  const clamped = clampRectToBounds(
    {
      ...placed,
      x: placed.x + (override?.dx ?? 0),
      y: placed.y + (override?.dy ?? 0),
    },
    OVERRIDE_BOUNDS,
  )
  return { ...placed, ...clamped }
}

function applyIncomeOverride(
  placed: Placed,
  data: MoneyMapData,
  override: LayoutOverride | undefined,
): Placed {
  const metrics = incomePanelMetrics(data)
  const maximumWidth = OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left
  const maximumHeight = OVERRIDE_BOUNDS.bottom - OVERRIDE_BOUNDS.top
  const desired = {
    x: placed.x + (override?.dx ?? 0),
    y: placed.y + (override?.dy ?? 0),
    w: clamp(
      override?.w ?? placed.w,
      Math.min(metrics.minWidth, maximumWidth),
      maximumWidth,
    ),
    h: clamp(
      override?.h ?? placed.h,
      Math.min(metrics.contentHeight, maximumHeight),
      maximumHeight,
    ),
  }
  return clampRectToBounds(desired, OVERRIDE_BOUNDS)
}

function applyAccountOverride(
  placed: PlacedAccount,
  override: LayoutOverride | undefined,
  hasRunway: boolean,
  textOverrides: AccountTextOverrides,
): PlacedAccount {
  const rot = normalizeRotation(override?.rot ?? 0)
  let desiredWidth = clamp(
    override?.w ?? placed.w,
    MIN_ACCOUNT_WIDTH,
    OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left,
  )
  const requestedHeight = clamp(
    override?.h ?? placed.h,
    MIN_ACCOUNT_HEIGHT,
    OVERRIDE_BOUNDS.bottom - OVERRIDE_BOUNDS.top,
  )
  let fitted = fittedAccount(
    placed.account,
    desiredWidth,
    hasRunway,
    requestedHeight,
    textOverrides,
  )
  let sizing = fitted.sizing
  desiredWidth = fitted.width
  let desiredHeight = sizing.h
  const radians = (rot * Math.PI) / 180
  const cosine = Math.abs(Math.cos(radians))
  const sine = Math.abs(Math.sin(radians))
  const minimumRotatedWidth =
    MIN_ACCOUNT_WIDTH * cosine + MIN_ACCOUNT_HEIGHT * sine
  const minimumRotatedHeight =
    MIN_ACCOUNT_WIDTH * sine + MIN_ACCOUNT_HEIGHT * cosine
  const extraWidth = desiredWidth - MIN_ACCOUNT_WIDTH
  const extraHeight = desiredHeight - MIN_ACCOUNT_HEIGHT
  const rotatedExtraWidth =
    extraWidth * cosine + extraHeight * sine
  const rotatedExtraHeight =
    extraWidth * sine + extraHeight * cosine
  const sizeScale = Math.min(
    1,
    rotatedExtraWidth === 0
      ? 1
      : (OVERRIDE_BOUNDS.right -
          OVERRIDE_BOUNDS.left -
          minimumRotatedWidth) /
          rotatedExtraWidth,
    rotatedExtraHeight === 0
      ? 1
      : (OVERRIDE_BOUNDS.bottom -
          OVERRIDE_BOUNDS.top -
          minimumRotatedHeight) /
          rotatedExtraHeight,
  )
  desiredWidth = MIN_ACCOUNT_WIDTH + extraWidth * sizeScale
  desiredHeight = MIN_ACCOUNT_HEIGHT + extraHeight * sizeScale
  fitted = fittedAccount(
    placed.account,
    desiredWidth,
    hasRunway,
    desiredHeight,
    textOverrides,
  )
  sizing = fitted.sizing
  desiredWidth = fitted.width
  desiredHeight = sizing.h
  const desired = {
    x: placed.x + (override?.dx ?? 0),
    y: placed.y + (override?.dy ?? 0),
    w: desiredWidth,
    h: desiredHeight,
  }
  const rotated = rotatedBounds(desired, rot)
  const clampedBounds = clampRectToBounds(rotated, OVERRIDE_BOUNDS)
  const clamped = {
    ...desired,
    x: desired.x + clampedBounds.x - rotated.x,
    y: desired.y + clampedBounds.y - rotated.y,
  }
  return {
    ...placed,
    ...sizing,
    ...clamped,
    rot,
  }
}

function accountTextBlock(
  placed: PlacedAccount,
  role: AccountTextRole,
): Placed {
  const { text } = placed
  if (role === 'rows') {
    const rows = placed.positionRows
    if (rows.length === 0) {
      return { x: placed.x, y: placed.y, w: 1, h: 1 }
    }
    const left = Math.min(...rows.map((row) => row.leftX))
    const right = Math.max(...rows.map((row) => row.rightX))
    const top = Math.min(...rows.map((row) => row.topY))
    const bottom = Math.max(
      ...rows.map((row) => row.lastBaseline + text.rowFontSize * 0.3),
    )
    return {
      x: placed.x + left,
      y: placed.y + top,
      w: right - left,
      h: bottom - top,
    }
  }
  if (role === 'sub') {
    const subAccounts = placed.subAccountLayouts
    if (subAccounts.length === 0) {
      return { x: placed.x, y: placed.y, w: 1, h: 1 }
    }
    const first = subAccounts[0]
    const last = subAccounts[subAccounts.length - 1]
    return {
      x: placed.x + placed.w * 0.14,
      y: placed.y + first.y,
      w: placed.w * 0.72,
      h: last.y + last.h - first.y,
    }
  }
  const lines =
    role === 'label'
      ? placed.titleLines
      : role === 'caption'
        ? placed.captionLines
        : [money(placed.account.value)]
  const fontSize =
    role === 'label'
      ? text.titleFontSize
      : role === 'caption'
        ? text.captionFontSize
        : text.valueFontSize
  const leading =
    role === 'label'
      ? text.titleLeading
      : role === 'caption'
        ? text.captionLeading
        : fontSize
  const baseline =
    role === 'label'
      ? text.titleY
      : role === 'caption'
        ? text.captionY
        : text.valueY
  const width = Math.max(
    1,
    ...lines.map((line) => textWidth(line, fontSize)),
  )
  const height = fontSize + Math.max(0, lines.length - 1) * leading

  return {
    x: placed.x + placed.w / 2 - width / 2,
    y: placed.y + (baseline ?? 0) - fontSize,
    w: width,
    h: height,
  }
}

function applyAccountTextOverrides(
  placed: PlacedAccount,
  overrides: AccountTextOverrides,
): PlacedAccount {
  let text = placed.text
  let positionRows = placed.positionRows
  let subAccountLayouts = placed.subAccountLayouts

  for (const role of ACCOUNT_TEXT_ROLES) {
    const override = overrides[role]
    if (
      (override?.dx === undefined && override?.dy === undefined) ||
      (role === 'caption' && text.captionY === undefined)
    ) {
      continue
    }
    const block = accountTextBlock(
      { ...placed, positionRows, subAccountLayouts, text },
      role,
    )
    const desired = {
      ...block,
      x: block.x + (override?.dx ?? 0),
      y: block.y + (override?.dy ?? 0),
    }
    const clamped = clampRectToBounds(desired, OVERRIDE_BOUNDS)
    const dx = clamped.x - block.x
    const dy = clamped.y - block.y

    if (role === 'rows') {
      positionRows = positionRows.map((row) => ({
        ...row,
        firstBaseline: row.firstBaseline + dy,
        lastBaseline: row.lastBaseline + dy,
        leftX: row.leftX + dx,
        rightX: row.rightX + dx,
        topY: row.topY + dy,
      }))
    } else if (role === 'sub') {
      subAccountLayouts = subAccountLayouts.map((layout) => ({
        ...layout,
        textDx: dx,
        textDy: dy,
      }))
    } else if (role === 'label') {
      text = {
        ...text,
        titleX: dx,
        titleY: text.titleY + dy,
      }
    } else if (role === 'caption') {
      text = {
        ...text,
        captionX: dx,
        captionY: text.captionY! + dy,
      }
    } else {
      text = {
        ...text,
        valueX: dx,
        valueY: text.valueY + dy,
      }
    }
  }

  return { ...placed, positionRows, subAccountLayouts, text }
}

function applyAsNeededChipOverride(
  arrow: Arrow,
  override: LayoutOverride | undefined,
): Arrow {
  if (!arrow.labelAt) return arrow

  const desired = {
    x: arrow.labelAt.x + (override?.dx ?? 0),
    y: arrow.labelAt.y + (override?.dy ?? 0),
    w: AS_NEEDED_CHIP_WIDTH,
    h: AS_NEEDED_CHIP_HEIGHT,
  }
  const clamped = clampRectToBounds(
    {
      ...desired,
      x: desired.x - desired.w / 2,
      y: desired.y - desired.h / 2,
    },
    OVERRIDE_BOUNDS,
  )
  return {
    ...arrow,
    labelAt: {
      x: clamped.x + clamped.w / 2,
      y: clamped.y + clamped.h / 2,
    },
  }
}

function arrowsForFinalGeometry(
  income: Placed,
  need: Placed,
  accounts: PlacedAccount[],
  customArrows: CustomArrow[] | undefined,
  overrides: Record<string, LayoutOverride> | undefined,
  chipOverride: LayoutOverride | undefined,
  hiddenArrows: GeneratedArrowKind[] | undefined,
): Arrow[] {
  const hidden = new Set(hiddenArrows)
  const arrows: Arrow[] = []
  if (!hidden.has('income')) {
    arrows.push(incomeArrow(
      income,
      need,
      overrides?.['arrow:income'],
    ))
  }
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm && !hidden.has('asNeeded')) {
    arrows.push(
      applyAsNeededChipOverride(
        asNeededArrow(
          shortTerm,
          need,
          overrides?.['arrow:asNeeded'],
        ),
        chipOverride,
      ),
    )
  }
  arrows.push(
    ...customArrowLayouts(customArrows, income, need, accounts, overrides),
  )
  return arrows
}

function baseLayout(data: MoneyMapData): MapLayout {
  const incomeMetrics = incomePanelMetrics(data)
  const income: Placed = {
    x: 48,
    y: 170,
    w: Math.max(280, incomeMetrics.minWidth),
    h: incomeMetrics.contentHeight,
  }
  const needLabelSize = clamp(
    data.layoutOverrides?.[mapTextOverrideKey('need', 'label')]?.fs ??
      TYPE.needLabel,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
  const needValueSize = clamp(
    data.layoutOverrides?.[mapTextOverrideKey('need', 'value')]?.fs ??
      TYPE.needValue,
    MIN_MAP_TEXT_FONT_SIZE,
    MAX_MAP_TEXT_FONT_SIZE,
  )
  const need: Placed = {
    x: 48,
    y: Math.max(700, income.y + income.h + 24),
    w: Math.min(
      OVERRIDE_BOUNDS.right - OVERRIDE_BOUNDS.left,
      Math.max(
        250,
        textWidth('MONTHLY INCOME NEED', needLabelSize) + 40,
        Math.min(
          480,
          textWidth(
            money(data.monthlyNeed),
            needValueSize,
          ) + 40,
        ),
      ),
    ),
    h: 170,
  }
  const accounts = COLUMNS.flatMap((column) => placeColumn(data, column))
  const hidden = new Set(data.hiddenArrows)
  const arrows: Arrow[] = []
  if (!hidden.has('income')) {
    arrows.push(incomeArrow(income, need))
  }
  const shortTerm = accounts.find(
    (placed) => placed.account.bucket === 'shortTerm',
  )
  if (shortTerm && !hidden.has('asNeeded')) {
    arrows.push(asNeededArrow(shortTerm, need))
  }
  arrows.push(
    ...customArrowLayouts(data.customArrows, income, need, accounts),
  )

  const centered = centerComposition(
    {
      artboard: ARTBOARD,
      income,
      need,
      accounts,
      notes: [],
      arrows,
      footnotesAt: { x: 390, y: 930 },
      warnings: [],
    },
    data.footnotes.some(footnoteHasContent),
  )
  const shiftByBucket = new Map(
    COLUMNS.flatMap((column) => {
      const placed = centered.accounts.filter((account) =>
        column.buckets.includes(account.account.bucket),
      )
      if (placed.length === 0) return []
      const top = Math.min(...placed.map((account) => account.y))
      const bottom = Math.max(...placed.map((account) => account.y + account.h))
      const dy = constrainedOffset(
        0,
        OVERRIDE_BOUNDS.top - top,
        OVERRIDE_BOUNDS.bottom - bottom,
      )
      return column.buckets.map((bucket) => [bucket, dy] as const)
    }),
  )
  return {
    ...centered,
    accounts: centered.accounts.map((account) =>
      translatePlaced(account, 0, shiftByBucket.get(account.account.bucket) ?? 0),
    ),
  }
}

export function layoutMap(data: MoneyMapData): MapLayout {
  const base = baseLayout(data)
  const income = applyIncomeOverride(
    base.income,
    data,
    data.layoutOverrides?.income,
  )
  const need = applyPlacedOverride(
    base.need,
    data.layoutOverrides?.need,
  )
  const accounts = base.accounts.map((placed) =>
    data.layoutOverrides?.[placed.account.id]
      ? applyAccountOverride(
          placed,
          data.layoutOverrides[placed.account.id],
          placed.account.bucket === 'shortTerm' &&
            runwayLine(
              placed.account.value,
              data.asNeededAmount,
              data.showMath !== false,
            ) !== null,
          accountTextOverrides(data.layoutOverrides, placed.account.id),
        )
      : placed,
  ).map((placed) =>
    applyAccountTextOverrides(
      placed,
      accountTextOverrides(data.layoutOverrides, placed.account.id),
    ),
  )
  const arrows = arrowsForFinalGeometry(
    income,
    need,
    accounts,
    data.customArrows,
    data.layoutOverrides,
    data.layoutOverrides?.asNeededChip,
    data.hiddenArrows,
  )
  const notes = placedNotes(data.notes)
  const finalBounds = contentBounds({
    income,
    need,
    accounts,
    notes,
    arrows,
  })
  const footnoteLines = footnoteLineLayouts(data)
  const footnoteBaseline = footnoteLines[0]?.y ?? FOOTNOTE_BASELINE_Y
  const warnings: LayoutWarning[] = []
  const warnAbbreviation = (
    fitted: FittedText,
    targetKey: string,
    fieldLabel: string,
    _container: string,
    message?: string,
  ) => {
    if (
      fitted.display === fitted.exact ||
      warnings.some(
        (warning) =>
          warning.code === 'text-abbreviated' &&
          warning.targetKey === targetKey &&
          warning.fieldLabel === fieldLabel,
      )
    ) return
    warnings.push({
      code: 'text-abbreviated',
      targetKey,
      fieldLabel,
      message: message ?? `Shorten the ${fieldLabel.toLowerCase()} or reduce its text size so the full text fits on the map.`,
    })
  }
  const incomeMetrics = incomePanelMetrics(data)
  const primaryPanels = [
    {
      name: 'Income sources',
      bounds: {
        ...income,
        w: Math.max(income.w, incomeMetrics.minWidth),
        h: Math.max(income.h, incomeMetrics.contentHeight),
      },
    },
    { name: 'Monthly need', bounds: need },
  ]
  for (const panel of primaryPanels) {
    const edges = [
      panel.bounds.x < 0 ? 'left' : null,
      panel.bounds.y < 0 ? 'top' : null,
      panel.bounds.x + panel.bounds.w > ARTBOARD.width ? 'right' : null,
      panel.bounds.y + panel.bounds.h > ARTBOARD.height ? 'bottom' : null,
    ].filter((edge): edge is string => edge !== null)
    if (edges.length > 0) {
      warnings.push({
        code: 'panel-out-of-bounds',
        message: `Move or resize ${panel.name.toLowerCase()} so it fits inside the map.`,
      })
    }
  }
  const intersects = (left: Placed, right: Placed) =>
    left.x < right.x + right.w &&
    left.x + left.w > right.x &&
    left.y < right.y + right.h &&
    left.y + left.h > right.y
  const accountRects = accounts.map(obstacleBounds)
  const accountOverlap = accountRects.some((account, index) =>
    accountRects.slice(index + 1).some((other) => intersects(account, other)),
  )
  if (accountOverlap) {
    warnings.push({
      code: 'account-overlap',
      message: 'Move or resize the overlapping accounts so each one is readable.',
    })
  }
  const accountPanelOverlap = accountRects.some(
    (account) => intersects(account, income) || intersects(account, need),
  )
  if (accountPanelOverlap) {
    warnings.push({
      code: 'account-panel-overlap',
      message: 'Move or resize the account so it no longer covers income or monthly need.',
    })
  }
  const mapContentRects = [income, need, ...accountRects]
  const noteContentOverlap = notes.some((note) =>
    mapContentRects.some((content) => intersects(note, content)),
  )
  if (noteContentOverlap) {
    warnings.push({
      code: 'note-content-overlap',
      message: 'Move the note so it no longer covers financial information.',
    })
  }
  const incomeNeedOverlap =
    income.x < need.x + need.w &&
    income.x + income.w > need.x &&
    income.y < need.y + need.h &&
    income.y + income.h > need.y
  if (incomeNeedOverlap) {
    warnings.push({
      code: 'income-need-overlap',
      message: 'Move either income sources or monthly need so they no longer overlap.',
    })
  }
  const overflowingAccounts = accounts.filter(
    (account) => account.y + account.h > OVERRIDE_BOUNDS.bottom,
  )
  if (overflowingAccounts.length > 0) {
    warnings.push({
      code: 'account-column-overflow',
      message: `Move or resize the ${overflowingAccounts.length} account ${
        overflowingAccounts.length === 1 ? 'item' : 'items'
      } that extend below the map so they fit inside it.`,
    })
  }
  const footnoteCenterX = finalBounds.x + finalBounds.w / 2
  const contentRects = [
    income,
    need,
    ...accountRects,
    ...notes,
  ]
  const footnotesOverlap = footnoteLines.some((line) => {
    const lineWidth = Math.min(
      720,
      textWidth(line.text.display, line.fontSize) + 16,
    )
    const block = {
      x: footnoteCenterX - lineWidth / 2,
      y: line.y - line.fontSize - 3,
      w: lineWidth,
      h: line.fontSize + 9,
    }
    const offset = mapTextOffset(
      data,
      'footnotes',
      'line',
      block,
      line.footnote.id,
    )
    const placed = {
      ...block,
      x: block.x + offset.dx,
      y: block.y + offset.dy,
    }
    return contentRects.some(
      (rect) => intersects(placed, rect),
    )
  })
  if (footnotesOverlap) {
    warnings.push({
      code: 'footnote-overlap',
      message: 'Move the fine print or nearby financial items so they no longer overlap.',
    })
  }
  const mastheadText = mastheadTextLayout(data)
  warnAbbreviation(
    mastheadText.label,
    mapTextOverrideKey('masthead', 'label'),
    'Map heading',
    'the masthead',
  )
  for (const source of data.incomeSources) {
    const text = incomeSourceTextLayout(data, income, source)
    const targetKey = mapItemTextOverrideKey('income', 'row', source.id)
    warnAbbreviation(text.label, targetKey, 'Income source', 'its row')
    warnAbbreviation(text.amount, targetKey, 'Income source', 'its row')
  }
  const incomeTotal = incomeTotalTextLayout(data, income)
  warnAbbreviation(
    incomeTotal.label,
    mapTextOverrideKey('income', 'total'),
    'After-tax income heading',
    'the income total row',
  )
  warnAbbreviation(
    incomeTotal.value,
    mapTextOverrideKey('income', 'total'),
    'After-tax income',
    'the income total row',
  )
  const needText = needTextLayout(
    data,
    need,
    gapLine(
      data.monthlyNeed,
      data.afterTaxIncome,
      data.asNeededAmount,
      data.showMath !== false,
    ),
  )
  warnAbbreviation(
    needText.label,
    mapTextOverrideKey('need', 'label'),
    'Monthly income need heading',
    'the monthly need card',
  )
  warnAbbreviation(
    needText.value,
    mapTextOverrideKey('need', 'value'),
    'Monthly income need',
    'the monthly need card',
  )
  warnAbbreviation(
    needText.supporting,
    mapTextOverrideKey('need', 'supporting'),
    'Monthly income calculation',
    'the monthly need card',
  )
  for (const account of accounts) {
    const key = (role: AccountTextRole) =>
      accountTextOverrideKey(account.account.id, role)
    if (account.titleLines.at(-1)?.endsWith('…')) {
      warnAbbreviation(
        { display: account.titleLines.join(' '), exact: accountDisplayName(account.account) },
        key('label'),
        'Account name',
        'the account shape',
      )
    }
    if (account.captionLines.at(-1)?.endsWith('…')) {
      warnAbbreviation(
        { display: account.captionLines.join(' '), exact: account.account.caption ?? '' },
        key('caption'),
        'Account description',
        'the account shape',
      )
    }
    warnAbbreviation(
      { display: account.valueText, exact: money(account.account.value) },
      key('value'),
      'Account amount and note',
      'the account shape',
      'Reduce the account amount text size or shorten its optional note so the full amount fits on the map.',
    )
    if (account.positionRows.some((row) => row.labelLines.at(-1)?.endsWith('…'))) {
      warnings.push({
        code: 'text-abbreviated',
        targetKey: key('rows'),
        fieldLabel: 'Investment name',
        message: 'Shorten the investment name or reduce its text size so the full text fits on the map.',
      })
    }
    if (account.subAccountLayouts.some((item) =>
      item.titleLines.at(-1)?.endsWith('…') ||
      item.captionLines.at(-1)?.endsWith('…') ||
      item.valueText.endsWith('…')
    )) {
      warnings.push({
        code: 'text-abbreviated',
        targetKey: key('sub'),
        fieldLabel: 'Nested account details',
        message: 'Shorten the nested account details or reduce their text size so the full text fits on the map.',
      })
    }
  }
  for (const arrow of arrows.filter((item) => item.kind === 'custom')) {
    warnAbbreviation(
      flowLabelText(arrow),
      `arrow:custom:${arrow.id}`,
      'Transfer description',
      'the flow label area',
    )
  }
  for (const line of footnoteLines) {
    warnAbbreviation(
      line.text,
      mapItemTextOverrideKey('footnotes', 'line', line.footnote.id),
      'Fine print',
      'the fine-print line',
    )
  }
  const mastheadSize = mastheadTitleFontSize(data)
  if (
    textWidth(data.client.title, mastheadSize) >
    MASTHEAD_TITLE_MAX_WIDTH
  ) {
    warnings.push({
      code: 'masthead-title-overflow',
      targetKey: mapTextOverrideKey('masthead', 'label'),
      fieldLabel: 'Client name',
      message: 'Shorten the client name or reduce its text size so the full name fits at the top of the map.',
    })
  }

  return {
    ...base,
    income,
    need,
    accounts,
    notes,
    arrows,
    contentBounds: finalBounds,
    footnotesAt: {
      x: finalBounds.x + finalBounds.w / 2,
      y: footnoteBaseline,
    },
    warnings,
  }
}

function movedTextBlock(
  data: MoneyMapData,
  element: MapTextElement,
  role: MapTextElementRole,
  block: Placed,
  itemId?: string,
): Placed {
  const offset = mapTextOffset(data, element, role, block, itemId)
  return { ...block, x: block.x + offset.dx, y: block.y + offset.dy }
}

export function layoutOverrideRect(
  data: MoneyMapData,
  key: string,
): Placed | null {
  const layout = layoutMap(data)
  if (key === 'income') return layout.income
  if (key === 'need') return layout.need
  if (key === 'asNeededChip') {
    const labelAt = layout.arrows.find((arrow) => arrow.kind === 'asNeeded')
      ?.labelAt
    return labelAt
      ? {
          x: labelAt.x - AS_NEEDED_CHIP_WIDTH / 2,
          y: labelAt.y - AS_NEEDED_CHIP_HEIGHT / 2,
          w: AS_NEEDED_CHIP_WIDTH,
          h: AS_NEEDED_CHIP_HEIGHT,
        }
      : null
  }
  const account = layout.accounts.find((placed) => placed.account.id === key)
  if (account) return obstacleBounds(account)
  if (!key.startsWith('text:')) return null

  const [, element, role, itemId] = key.split(':')
  const accountText = layout.accounts.find(
    (placed) => placed.account.id === element,
  )
  if (
    accountText &&
    ACCOUNT_TEXT_ROLES.includes(role as AccountTextRole)
  ) {
    return accountTextBlock(accountText, role as AccountTextRole)
  }
  if (element === 'masthead' && role === 'label') {
    return movedTextBlock(data, 'masthead', 'label', {
      x: 454,
      y: 58,
      w: 818,
      h: 40,
    })
  }
  if (element === 'need') {
    const block =
      role === 'label'
        ? { x: layout.need.x + 12, y: layout.need.y + 31, w: layout.need.w - 24, h: 38 }
        : role === 'value'
          ? { x: layout.need.x + 12, y: layout.need.y + 75, w: layout.need.w - 24, h: 52 }
          : role === 'supporting'
            ? { x: layout.need.x + 12, y: layout.need.y + 120, w: layout.need.w - 24, h: 28 }
            : null
    return block
      ? movedTextBlock(data, 'need', role as MapTextElementRole, block)
      : null
  }
  if (element === 'income') {
    const metrics = incomePanelMetrics(data)
    const sizes = incomeTextSizes(data)
    if (role === 'header') {
      return movedTextBlock(data, 'income', 'header', {
        x: layout.income.x + 12,
        y: layout.income.y + 7,
        w: layout.income.w - 24,
        h: 35,
      })
    }
    if (role === 'total') {
      return movedTextBlock(data, 'income', 'total', {
        x: layout.income.x + 12,
        y: layout.income.y + metrics.dividerY + 7,
        w: layout.income.w - 24,
        h: 48,
      })
    }
    const index = data.incomeSources.findIndex((source) => source.id === itemId)
    if (role !== 'row' || index < 0) return null
    const source = data.incomeSources[index]
    const visibleWidth = Math.min(
      layout.income.w - 24,
      Math.max(
        textWidth(source.label, sizes.rowValue * (13 / 14)),
        textWidth(moneyPer(source.amount, source.period), sizes.rowValue),
      ) + 16,
    )
    return movedTextBlock(
      data,
      'income',
      'row',
      {
        x: layout.income.x + 12,
        y:
          layout.income.y +
          metrics.firstRowY +
          index * metrics.rowPitch -
          sizes.rowValue * (13 / 14) -
          5,
        w: visibleWidth,
        h: metrics.rowPitch,
      },
      itemId,
    )
  }
  if (element === 'footnotes' && role === 'line') {
    const line = footnoteLineLayouts(data, layout.footnotesAt.y).find(
      (candidate) => candidate.footnote.id === itemId,
    )
    return line
      ? movedTextBlock(
          data,
          'footnotes',
          'line',
          {
            x: layout.footnotesAt.x - 360,
            y: line.y - line.fontSize - 3,
            w: 720,
            h: line.fontSize + 9,
          },
          itemId,
        )
      : null
  }
  return null
}

export function nudgeLayoutOverride(
  data: MoneyMapData,
  key: string,
  delta: Point,
): MoneyMapData {
  const previous = data.layoutOverrides?.[key] ?? {}
  const baseData = {
    ...data,
    layoutOverrides: {
      ...data.layoutOverrides,
      [key]: { ...previous, dx: undefined, dy: undefined },
    },
  }
  const base = layoutOverrideRect(baseData, key)
  const rendered = layoutOverrideRect(data, key)
  if (!base || !rendered) return data
  const next = clampRectToBounds(
    { ...rendered, x: rendered.x + delta.x, y: rendered.y + delta.y },
    OVERRIDE_BOUNDS,
  )
  const nextDx = next.x - base.x
  const nextDy = next.y - base.y
  if (
    Math.abs(nextDx - (previous.dx ?? 0)) < 1e-9 &&
    Math.abs(nextDy - (previous.dy ?? 0)) < 1e-9
  ) {
    return data
  }
  return {
    ...data,
    layoutOverrides: {
      ...data.layoutOverrides,
      [key]: {
        ...previous,
        dx: nextDx,
        dy: nextDy,
      },
    },
  }
}
