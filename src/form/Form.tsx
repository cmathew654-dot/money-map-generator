import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from 'react'
import {
  BLANK,
  accountDisplayName,
  money,
  parseMoneyInput,
  stepMoney,
} from '../model/format'
import {
  ACCOUNT_PRESETS,
  ACCOUNT_TYPE_OPTIONS,
  changeAccountBucket,
} from '../model/book'
import type {
  Account,
  AccountShape,
  Footnote,
  IncomeSource,
  MoneyMapData,
  Position,
  SubAccount,
} from '../model/types'
import {
  ACCOUNT_SHAPES,
  accountShape,
  newId,
} from '../model/types'
import {
  ACCOUNT_TYPE_SEEDS,
  CARRIER_SEEDS,
  type VocabularyTerm,
} from '../model/vocab'
import { NOTE_WIDTH } from '../layout/layout'
import { ARTBOARD } from '../render/tokens'
import { Autocomplete } from '../ui/Autocomplete'

export type FormSection = 'client' | 'income' | 'accounts' | 'need' | 'notes'

export interface FormProps {
  data: MoneyMapData
  onChange(next: MoneyMapData): void
  /** Same close path as the editor rail toggle; omitted outside the panel. */
  onClose?: () => void
  filter?: string
  onFilterChange?: (filter: string) => void
  activeSection?: FormSection
  onSectionFocus?: (section: FormSection) => void
  focusRequest?: { id: string; at: number }
  onHoverAccount?: (id: string | null) => void
  selectedAccountId?: string | null
  /**
   * `modifiers` present = a row CLICK (a primary act, so it may replace or
   * toggle the selection). Absent = a focus echo, which must never disturb a
   * selection the map already built.
   */
  onSelectAccount?: (id: string, modifiers?: { modified: boolean }) => void
  vocabulary?: readonly VocabularyTerm[]
}

interface MoneyFieldProps {
  inputRef?: Ref<HTMLInputElement>
  label: string
  value: number | null
  onChange(value: number | null): void
}

const incomePresets = [
  { chipLabel: 'Social Security', label: 'Social Security' },
  { chipLabel: 'Pension', label: 'Pension' },
  { chipLabel: 'Salary / Wages', label: 'Salary / Wages' },
  { chipLabel: 'Rental Income', label: 'Rental Income' },
  { chipLabel: 'Annuity', label: 'Annuity' },
  { chipLabel: 'Something else', label: '' },
]

const accountNameSeeds = [...ACCOUNT_TYPE_SEEDS, ...CARRIER_SEEDS]
const incomeSourceSeeds = incomePresets.flatMap((preset) =>
  preset.label ? [preset.label] : [],
)
const noSeeds: readonly string[] = []

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function addIncomeSource(
  incomeSources: IncomeSource[],
  label: string,
): IncomeSource[] {
  return [
    ...incomeSources,
    { id: newId('income'), label, amount: null, period: 'mo' },
  ]
}

export function appendBlankPosition(positions: Position[]): Position[] {
  return [...positions, { label: '', value: null }]
}

export function yearSelectOptions(
  storedValue: string,
  currentYear = new Date().getFullYear(),
): string[] {
  const options = [-1, 0, 1].map((offset) =>
    String(currentYear + offset),
  )
  return options.includes(storedValue)
    ? options
    : [storedValue, ...options]
}

export function appendBlankNote(data: MoneyMapData): MoneyMapData {
  return {
    ...data,
    notes: [
      ...(data.notes ?? []),
      {
        id: newId('note'),
        text: '',
        x: (ARTBOARD.width - NOTE_WIDTH) / 2,
        y: ARTBOARD.height / 2,
      },
    ],
  }
}

export function updateNoteText(
  data: MoneyMapData,
  id: string,
  text: string,
): MoneyMapData {
  if (!data.notes?.some((note) => note.id === id)) return data

  return {
    ...data,
    notes: data.notes.map((note) =>
      note.id === id ? { ...note, text } : note,
    ),
  }
}

export function isMoneyDraftDirty(
  draft: string | null,
  focusSnapshot: string,
): boolean {
  return draft !== null && draft !== focusSnapshot
}

export function synchronizeMoneyDraft(
  draft: string | null,
  isFocused: boolean,
  value: number | null,
): string | null {
  if (!isFocused) return null
  if (parseMoneyInput(draft ?? '') === value) return draft
  // A value that changed under the caret still has to arrive formatted.
  return value === null ? '' : formatMoneyDraft(String(value), 0).text
}
/** Plain dollar drafts only — k/m shorthand and junk pass through untouched. */
const PLAIN_MONEY_DRAFT = /^([+-]?)(\$?)(\d*)(\.\d*)?$/

/**
 * Regroup a money draft with thousands separators, keeping the caret on the
 * character the user was standing next to (commas are not counted).
 */
export function formatMoneyDraft(
  draft: string,
  caret: number,
): { text: string; caret: number } {
  const match = PLAIN_MONEY_DRAFT.exec(draft.replace(/,/g, ''))
  if (!match) return { text: draft, caret }

  const [, sign, dollar, digits, decimals = ''] = match
  const grouped = digits
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  const text = `${sign}${dollar}${grouped}${decimals}`
  if (text === draft) return { text, caret }

  const wanted = draft.slice(0, caret).replace(/,/g, '').length
  let seen = 0
  let index = 0
  while (index < text.length && seen < wanted) {
    if (text[index] !== ',') seen += 1
    index += 1
  }
  return { text, caret: index }
}

type PendingFocusTarget = {
  focus(): void
}

export function focusPendingTarget(
  resolve: (() => PendingFocusTarget | null | undefined) | null,
): boolean {
  const target = resolve?.()
  if (!target) return false
  target.focus()
  return true
}

function usePendingFocus(dependency: unknown) {
  const pendingFocus = useRef<
    (() => PendingFocusTarget | null | undefined) | null
  >(null)
  const requestFocus = useCallback(
    (resolve: () => PendingFocusTarget | null | undefined) => {
      pendingFocus.current = resolve
    },
    [],
  )

  useEffect(() => {
    if (focusPendingTarget(pendingFocus.current)) {
      pendingFocus.current = null
    }
  }, [dependency])

  return requestFocus
}

function monthSelectOptions(storedValue: string): string[] {
  return months.includes(storedValue)
    ? months
    : [storedValue, ...months]
}

const shapeLabels: Record<AccountShape, string> = {
  drum: 'Drum',
  card: 'Card',
  rect: 'Hexagon',
  pill: 'Pill',
}

function ShapeGlyph({ shape }: { shape: AccountShape }) {
  if (shape === 'drum') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 16">
        <path d="M4 4v7c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V4" />
        <ellipse cx="12" cy="4" rx="8" ry="2.5" />
      </svg>
    )
  }
  if (shape === 'rect') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 16">
        <path d="M5.4 2.5h13.2l2.4 5.5-2.4 5.5H5.4L3 8Z" />
      </svg>
    )
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 16">
      <rect
        x="3"
        y="2.5"
        width="18"
        height="11"
        rx={shape === 'card' ? 2.5 : shape === 'pill' ? 5.5 : 0.5}
      />
    </svg>
  )
}

function MoneyField({
  inputRef,
  label,
  value,
  onChange,
}: MoneyFieldProps) {
  const [draft, setDraft] = useState<string | null>(null)
  const focusSnapshot = useRef('')
  const originalValue = useRef<number | null>(value)
  const isFocused = useRef(false)
  const focusedInput = useRef<HTMLInputElement | null>(null)
  const selectAfterRender = useRef(false)
  const commitDraft = () => {
    if (!isMoneyDraftDirty(draft, focusSnapshot.current)) return
    const nextDraft = draft ?? ''
    onChange(parseMoneyInput(nextDraft))
    focusSnapshot.current = nextDraft
  }


  useEffect(() => {
    setDraft((current) => {
      const next = synchronizeMoneyDraft(
        current,
        isFocused.current,
        value,
      )
      if (isFocused.current && next !== current) {
        // The adopted draft *is* the snapshot; anything else would read as
        // dirty typing on blur now that the draft arrives formatted.
        focusSnapshot.current = next ?? ''
        originalValue.current = value
      }
      return next
    })
  }, [value])
  useLayoutEffect(() => {
    if (!selectAfterRender.current) return
    selectAfterRender.current = false
    focusedInput.current?.select()
  }, [draft])

  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        className="money-input"
        enterKeyHint="next"
        inputMode="decimal"
        placeholder={BLANK}
        ref={inputRef}
        type="text"
        value={draft ?? (value === null ? '' : money(value))}
        onBlur={() => {
          isFocused.current = false
          commitDraft()
          setDraft(null)
        }}
        onChange={(event) => {
          const input = event.target
          const { text, caret } = formatMoneyDraft(
            input.value,
            input.selectionStart ?? input.value.length,
          )
          if (text !== input.value) {
            // keep the DOM in sync now so React's render leaves the caret alone
            input.value = text
            input.setSelectionRange(caret, caret)
          }
          setDraft(text)
          onChange(parseMoneyInput(text))
        }}
        onFocus={(event) => {
          isFocused.current = true
          const snapshot = value === null ? '' : String(value)
          focusSnapshot.current = snapshot
          originalValue.current = value
          focusedInput.current = event.currentTarget
          selectAfterRender.current = true
          setDraft(snapshot)
          event.currentTarget.select()
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setDraft(focusSnapshot.current)
            onChange(originalValue.current)
            return
          }
          if (event.key === 'Enter') {
            commitDraft()
            return
          }
          if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
            return
          }

          event.preventDefault()
          const tier = event.altKey
            ? 10_000
            : event.shiftKey
              ? 1_000
              : 100
          const base = parseMoneyInput(draft ?? '') ?? value ?? 0
          const next = stepMoney(
            base,
            event.key === 'ArrowUp' ? 1 : -1,
            tier,
          )
          const nextDraft = formatMoneyDraft(String(next), 0).text
          setDraft(nextDraft)
          onChange(next)
        }}
      />
    </label>
  )
}

function TextField({
  autocomplete,
  label,
  value,
  onChange,
  inputRef,
  placeholder,
}: {
  autocomplete?: {
    bookTerms: readonly VocabularyTerm[]
    seeds: readonly string[]
  }
  label: string
  value: string
  onChange(value: string): void
  inputRef?: Ref<HTMLInputElement>
  placeholder?: string
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {autocomplete ? (
        <Autocomplete
          bookTerms={autocomplete.bookTerms}
          inputRef={inputRef}
          placeholder={placeholder}
          seeds={autocomplete.seeds}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          enterKeyHint="next"
          ref={inputRef}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  )
}

function SectionHead({
  count,
  title,
}: {
  count?: number
  title: string
}) {
  return (
    <header className="form-section-head">
      <h2>{title}</h2>
      {count !== undefined && (
        <span className="form-section-count">{count}</span>
      )}
    </header>
  )
}

function RemoveButton({
  label,
  onClick,
}: {
  label: string
  onClick(): void
}) {
  return (
    <button
      aria-label={label}
      className="remove-button"
      type="button"
      onClick={onClick}
    >
      ×
    </button>
  )
}

export function NeedSection({
  data,
  onChange,
  embedded = false,
  sectionRef,
  active = false,
}: Pick<FormProps, 'data' | 'onChange'> & {
  embedded?: boolean
  sectionRef?: Ref<HTMLElement>
  active?: boolean
}) {
  const fields = (
    <div className="value-tag-fields need-fields">
      <MoneyField
        label="Monthly amount needed"
        value={data.monthlyNeed}
        onChange={(monthlyNeed) => onChange({ ...data, monthlyNeed })}
      />
      <p className="help-text">
        The red number — what the household must cover each month.
      </p>
      <MoneyField
        label="Monthly account withdrawal"
        value={data.asNeededAmount}
        onChange={(asNeededAmount) =>
          onChange({ ...data, asNeededAmount })
        }
      />
      <p className="help-text">
        Optional monthly withdrawal — appears on the flow from short-term
        accounts.
      </p>
    </div>
  )

  if (embedded) return fields

  return (
    <section className={active ? 'form-section is-active' : 'form-section'} data-form-section="need" ref={sectionRef}>
      <SectionHead title="Need" />
      {fields}
      <FinePrintSection data={data} onChange={onChange} />
    </section>
  )
}

export function IncomeSection({
  data,
  onChange,
  sectionRef,
  includeNeed = true,
  active = false,
  vocabulary = [],
}: Pick<FormProps, 'data' | 'onChange'> & {
  sectionRef?: Ref<HTMLElement>
  includeNeed?: boolean
  active?: boolean
  vocabulary?: readonly VocabularyTerm[]
}) {
  const labelInputs = useRef<(HTMLInputElement | null)[]>([])
  const amountInputs = useRef<(HTMLInputElement | null)[]>([])
  const requestFocus = usePendingFocus(data.incomeSources.length)
  const setSources = (incomeSources: IncomeSource[]) =>
    onChange({ ...data, incomeSources })
  const updateSource = (index: number, source: IncomeSource) =>
    setSources(
      data.incomeSources.map((item, itemIndex) =>
        itemIndex === index ? source : item,
      ),
    )

  return (
    <section className={active ? 'form-section is-active' : 'form-section'} data-form-section="income" ref={sectionRef}>
      <SectionHead count={data.incomeSources.length} title="Income" />
      <div className="row-list">
        {data.incomeSources.map((source, index) => (
          <div className="stacked-row income-row" key={index}>
            <div className="stacked-row-heading">
              <TextField
                autocomplete={{
                  bookTerms: vocabulary,
                  seeds: incomeSourceSeeds,
                }}
                inputRef={(element) => {
                  labelInputs.current[index] = element
                }}
                label="Income source"
                value={source.label}
                onChange={(label) =>
                  updateSource(index, { ...source, label })
                }
              />
              <RemoveButton
                label={`Remove income source ${index + 1}`}
                onClick={() =>
                  setSources(
                    data.incomeSources.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  )
                }
              />
            </div>
            <div className="income-row-fields">
              <MoneyField
                inputRef={(element) => {
                  amountInputs.current[index] = element
                }}
                label="Amount"
                value={source.amount}
                onChange={(amount) =>
                  updateSource(index, { ...source, amount })
                }
              />
              <label className="form-field period-field">
                <span>Period</span>
                <select
                  value={source.period}
                  onChange={(event) =>
                    updateSource(index, {
                      ...source,
                      period: event.target.value as 'mo' | 'yr',
                    })
                  }
                >
                  <option value="mo">mo</option>
                  <option value="yr">yr</option>
                </select>
              </label>
            </div>
          </div>
        ))}
      </div>
      {data.incomeSources.length === 0 && (
        <p className="empty-state">No income sources yet.</p>
      )}
      <div className="account-preset-row" aria-label="Add income source">
        <span className="account-preset-label">Add:</span>
        {incomePresets.map((preset) => (
          <button
            className="account-preset-button"
            key={preset.chipLabel}
            type="button"
            onClick={() => {
              const index = data.incomeSources.length
              const inputs = preset.label ? amountInputs : labelInputs
              requestFocus(() => inputs.current[index])
              setSources(
                addIncomeSource(data.incomeSources, preset.label),
              )
            }}
          >
            {preset.chipLabel}
          </button>
        ))}
      </div>
      <div className="field-grid income-totals">
        <MoneyField
          label="After-Tax Income"
          value={data.afterTaxIncome}
          onChange={(afterTaxIncome) => onChange({ ...data, afterTaxIncome })}
        />
        {includeNeed && (
          <NeedSection data={data} embedded onChange={onChange} />
        )}
      </div>
    </section>
  )
}

function PositionRows({
  positions,
  onChange,
  vocabulary,
}: {
  positions: Position[]
  onChange(positions: Position[]): void
  vocabulary: readonly VocabularyTerm[]
}) {
  const labelInputs = useRef<(HTMLInputElement | null)[]>([])
  const requestFocus = usePendingFocus(positions.length)

  return (
    <div className="nested-list">
      <h4>Positions</h4>
      {positions.map((position, index) => (
        <div className="stacked-row nested-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
              autocomplete={{
                bookTerms: vocabulary,
                seeds: CARRIER_SEEDS,
              }}
              inputRef={(element) => {
                labelInputs.current[index] = element
              }}
              label="Label"
              value={position.label}
              onChange={(label) =>
                onChange(
                  positions.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, label } : item,
                  ),
                )
              }
            />
            <RemoveButton
              label={`Remove position ${index + 1}`}
              onClick={() =>
                onChange(
                  positions.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          </div>
          <div className="nested-row-fields">
            <MoneyField
              label="Value"
              value={position.value}
              onChange={(value) =>
                onChange(
                  positions.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, value } : item,
                  ),
                )
              }
            />
          </div>
        </div>
      ))}
      <button
        className="add-button"
        type="button"
        onClick={() => {
          const index = positions.length
          requestFocus(() => labelInputs.current[index])
          onChange(appendBlankPosition(positions))
        }}
      >
        + Add position
      </button>
    </div>
  )
}

function SubAccountRows({
  subAccounts,
  onChange,
  vocabulary,
}: {
  subAccounts: SubAccount[]
  onChange(subAccounts: SubAccount[]): void
  vocabulary: readonly VocabularyTerm[]
}) {
  const labelInputs = useRef<(HTMLInputElement | null)[]>([])
  const requestFocus = usePendingFocus(subAccounts.length)

  return (
    <div className="nested-list">
      <h4>Sub-accounts</h4>
      {subAccounts.map((subAccount, index) => (
        <div className="stacked-row subaccount-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
              autocomplete={{
                bookTerms: vocabulary,
                seeds: noSeeds,
              }}
              inputRef={(element) => {
                labelInputs.current[index] = element
              }}
              label="Label"
              value={subAccount.label}
              onChange={(label) =>
                onChange(
                  subAccounts.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, label } : item,
                  ),
                )
              }
            />
            <RemoveButton
              label={`Remove sub-account ${index + 1}`}
              onClick={() =>
                onChange(
                  subAccounts.filter((_, itemIndex) => itemIndex !== index),
                )
              }
            />
          </div>
          <div className="subaccount-row-fields">
            <TextField
              label="Supporting note"
              value={subAccount.caption ?? ''}
              onChange={(caption) =>
                onChange(
                  subAccounts.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, caption } : item,
                  ),
                )
              }
            />
            <MoneyField
              label="Value"
              value={subAccount.value}
              onChange={(value) =>
                onChange(
                  subAccounts.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, value } : item,
                  ),
                )
              }
            />
          </div>
        </div>
      ))}
      <button
        className="add-button"
        type="button"
        onClick={() => {
          const index = subAccounts.length
          requestFocus(() => labelInputs.current[index])
          onChange([
            ...subAccounts,
            { label: '', caption: '', value: null },
          ])
        }}
      >
        + Add sub-account
      </button>
    </div>
  )
}

function AccountCard({
  account,
  expanded,
  selected,
  onHoverAccount,
  onSelectAccount,
  onToggle,
  registerRow,
  onChange,
  onRemove,
  vocabulary,
}: {
  account: Account
  expanded: boolean
  selected: boolean
  onHoverAccount?: (id: string | null) => void
  /**
   * `modifiers` present = a row CLICK (a primary act, so it may replace or
   * toggle the selection). Absent = a focus echo, which must never disturb a
   * selection the map already built.
   */
  onSelectAccount?: (id: string, modifiers?: { modified: boolean }) => void
  onToggle(): void
  registerRow(id: string, row: HTMLDivElement | null): void
  onChange(account: Account): void
  onRemove(): void
  vocabulary: readonly VocabularyTerm[]
}) {
  const rowId = `account-row-${account.id}`
  const bodyId = `account-body-${account.id}`

  return (
    <div
      className="account-card-shell"
      onMouseEnter={() => onHoverAccount?.(account.id)}
      onMouseLeave={() => onHoverAccount?.(null)}
    >
      <div
        className={`account-card bucket-${account.bucket}${selected ? ' is-selected' : ''}`}
        data-account-id={account.id}
        data-selected={selected ? 'true' : undefined}
        ref={(node) => registerRow(account.id, node)}
      >
        <button
          aria-controls={bodyId}
          aria-expanded={expanded}
          className="account-summary"
          id={rowId}
          type="button"
          onClick={(event) => {
            // Same modifier rule as a map click, so the sidebar and the canvas
            // cannot disagree about what shift-click means.
            onSelectAccount?.(account.id, {
              modified: event.shiftKey || event.ctrlKey || event.metaKey,
            })
            onToggle()
          }}
        >
          <span aria-hidden="true" className="account-swatch" />
          <span
            className={`account-summary-label${
              account.label.trim() ? '' : ' is-unnamed'
            }`}
          >
            {accountDisplayName(account)}
          </span>
          <span className="account-summary-value">{money(account.value)}</span>
          <span aria-hidden="true" className="account-row-chevron">
            ›
          </span>
        </button>

        {expanded && (
          <div
            aria-labelledby={rowId}
            className="account-body"
            id={bodyId}
            role="region"
            // Selection follows focus into the fields, but not onto the row
            // button itself — that would expand the row before its own click
            // toggled it straight back shut.
            onFocusCapture={() => onSelectAccount?.(account.id)}
          >
            <div className="account-fields">
              <TextField
                autocomplete={{
                  bookTerms: vocabulary,
                  seeds: accountNameSeeds,
                }}
                label="Account name"
                value={account.label}
                onChange={(label) => onChange({ ...account, label })}
              />
              <MoneyField
                label="Value"
                value={account.value}
                onChange={(value) => onChange({ ...account, value })}
              />
              <label className="form-field">
                <span>Account type</span>
                <select
                  value={account.bucket}
                  onChange={(event) =>
                    onChange(changeAccountBucket(
                      account,
                      event.target.value as Account['bucket'],
                    ))
                  }
                >
                  {ACCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                autocomplete={{
                  bookTerms: vocabulary,
                  seeds: noSeeds,
                }}
                label="Supporting note"
                value={account.caption ?? ''}
                onChange={(caption) => onChange({ ...account, caption })}
              />
            </div>
            <PositionRows
              positions={account.positions ?? []}
              vocabulary={vocabulary}
              onChange={(positions) => onChange({ ...account, positions })}
            />
            <SubAccountRows
              subAccounts={account.subAccounts ?? []}
              vocabulary={vocabulary}
              onChange={(subAccounts) => onChange({ ...account, subAccounts })}
            />
            <div className="account-body-footer">
              <span
                aria-label={`Shape for ${accountDisplayName(account)}`}
                className="shape-segmented-control account-shape-control"
                role="group"
              >
                {ACCOUNT_SHAPES.map((shape) => (
                  <button
                    aria-label={`${shapeLabels[shape]} shape`}
                    aria-pressed={accountShape(account) === shape}
                    className="shape-option"
                    key={shape}
                    type="button"
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onChange({ ...account, shape })
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <ShapeGlyph shape={shape} />
                  </button>
                ))}
              </span>
              <button className="text-button" type="button" onClick={onRemove}>
                Remove account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** row-level twin of the section filter: same case-insensitive substring test */
export function accountMatchesQuery(account: Account, query: string) {
  return (
    !query ||
    (account.label + ' ' + JSON.stringify(account))
      .toLocaleLowerCase()
      .includes(query)
  )
}

/**
 * A row is open when the user says so; otherwise it follows the map selection.
 * Manual expands therefore survive a selection change, and the auto-expanded
 * row moves with the selection.
 */
export function isAccountExpanded(
  manualOpen: Record<string, boolean>,
  id: string,
  selectedAccountId?: string | null,
): boolean {
  return manualOpen[id] ?? id === selectedAccountId
}

export function AccountsSection({
  data,
  focusRequest,
  onChange,
  onHoverAccount,
  selectedAccountId,
  onSelectAccount,
  sectionRef,
  active = false,
  presetLabel = 'Add:',
  vocabulary = [],
  query = '',
}: FormProps & {
  sectionRef?: Ref<HTMLElement>
  active?: boolean
  presetLabel?: string
  /** already lower-cased filter query; empty renders every row */
  query?: string
}) {
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({})
  const [lastSelected, setLastSelected] = useState(selectedAccountId ?? null)
  const rowRefs = useRef(new Map<string, HTMLDivElement>())
  const requestFocus = usePendingFocus(data.accounts.length)
  const registerRow = useCallback(
    (id: string, row: HTMLDivElement | null) => {
      if (row) rowRefs.current.set(id, row)
      else rowRefs.current.delete(id)
    },
    [],
  )
  const setAccounts = (accounts: Account[]) =>
    onChange({ ...data, accounts })

  // A fresh selection always wins over a stale manual collapse, so clicking the
  // account on the map reopens it. Adjusting during render keeps this on the
  // one selection-driven path instead of adding a second effect.
  if ((selectedAccountId ?? null) !== lastSelected) {
    setLastSelected(selectedAccountId ?? null)
    if (selectedAccountId && selectedAccountId in manualOpen) {
      setManualOpen(({ [selectedAccountId]: _dropped, ...rest }) => rest)
    }
  }

  useEffect(() => {
    if (!focusRequest) return
    const row = rowRefs.current.get(focusRequest.id)
    if (!row) return
    row.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
    // ponytail: the rAF retry covers the selection and the focus request
    // landing in separate commits, when the body is not mounted yet.
    const focusFirstField = () => {
      const input = row.querySelector<HTMLInputElement>('.account-body input')
      input?.focus()
      return Boolean(input)
    }
    if (!focusFirstField()) requestAnimationFrame(focusFirstField)
  }, [focusRequest])

  const visible = data.accounts.filter((account) =>
    accountMatchesQuery(account, query),
  )

  return (
    <section className={active ? 'form-section accounts-section is-active' : 'form-section accounts-section'} data-form-section="accounts" ref={sectionRef}>
      <SectionHead count={visible.length} title="Accounts" />
      {visible.map((account) => (
        <AccountCard
          account={account}
          expanded={isAccountExpanded(manualOpen, account.id, selectedAccountId)}
          selected={account.id === selectedAccountId}
          key={account.id}
          onHoverAccount={onHoverAccount}
          onSelectAccount={onSelectAccount}
          onToggle={() =>
            setManualOpen((open) => ({
              ...open,
              [account.id]: !isAccountExpanded(
                open,
                account.id,
                selectedAccountId,
              ),
            }))
          }
          registerRow={registerRow}
          vocabulary={vocabulary}
          onChange={(next) =>
            setAccounts(
              data.accounts.map((item) =>
                item.id === account.id ? next : item,
              ),
            )
          }
          onRemove={() =>
            setAccounts(
              data.accounts.filter((item) => item.id !== account.id),
            )
          }
        />
      ))}
      <div className="account-preset-row" aria-label="Add account">
        <span className="account-preset-label">{presetLabel}</span>
        {ACCOUNT_PRESETS.map((preset) => (
          <button
            className={`account-preset-button bucket-${preset.bucket}`}
            key={preset.chipLabel}
            type="button"
            onClick={() => {
              const { chipLabel: _chipLabel, ...account } = preset
              const id = newId('account')
              setManualOpen((open) => ({ ...open, [id]: true }))
              requestFocus(() =>
                rowRefs.current
                  .get(id)
                  ?.querySelector<HTMLInputElement>('.account-body input'),
              )
              setAccounts([
                ...data.accounts,
                {
                  id,
                  value: null,
                  ...account,
                },
              ])
            }}
          >
            <span aria-hidden="true" className="account-swatch" />
            {preset.chipLabel}
          </button>
        ))}
      </div>
      {data.accounts.length === 0 && (
        <p className="empty-state">
          No accounts yet — tap a type above to add one.
        </p>
      )}
    </section>
  )
}

export function FinePrintSection({
  data,
  onChange,
}: Pick<FormProps, 'data' | 'onChange'>) {
  const labelInputs = useRef<(HTMLInputElement | null)[]>([])
  const requestFocus = usePendingFocus(data.footnotes.length)
  const setFootnotes = (footnotes: Footnote[]) =>
    onChange({ ...data, footnotes })
  const updateFootnote = (index: number, footnote: Footnote) =>
    setFootnotes(
      data.footnotes.map((item, itemIndex) =>
        itemIndex === index ? footnote : item,
      ),
    )

  return (
    <div className="nested-list fine-print-section">
      <h3>Fine print</h3>
      <p className="wizard-subtitle">
        Skip fine print unless the plan states required distributions.
      </p>
      {data.footnotes.map((footnote, index) => (
        <div className="stacked-row footnote-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
              inputRef={(element) => {
                labelInputs.current[index] = element
              }}
              label="Label"
              value={footnote.label}
              onChange={(label) =>
                updateFootnote(index, { ...footnote, label })
              }
            />
            <RemoveButton
              label={`Remove fine print line ${index + 1}`}
              onClick={() =>
                setFootnotes(
                  data.footnotes.filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                )
              }
            />
          </div>
          <div className="footnote-row-fields">
            <MoneyField
              label="Gross"
              value={footnote.gross}
              onChange={(gross) =>
                updateFootnote(index, { ...footnote, gross })
              }
            />
            <MoneyField
              label="Net"
              value={footnote.net}
              onChange={(net) =>
                updateFootnote(index, { ...footnote, net })
              }
            />
          </div>
        </div>
      ))}
      <button
        className="add-button"
        type="button"
        onClick={() => {
          const index = data.footnotes.length
          requestFocus(() => labelInputs.current[index])
          setFootnotes([
            ...data.footnotes,
            { id: newId('footnote'), label: '', gross: null, net: null },
          ])
        }}
      >
        + Add fine print line
      </button>
      <p className="help-text">
        The after-tax amount appears in green.
      </p>
    </div>
  )
}

export function NotesSection({
  data,
  focusRequest,
  onChange,
  sectionRef,
  active = false,
}: Pick<FormProps, 'data' | 'onChange'> & {
  focusRequest?: FormProps['focusRequest']
  sectionRef?: Ref<HTMLElement>
  active?: boolean
}) {
  const textareaRefs = useRef<
    Record<string, HTMLTextAreaElement | null>
  >({})
  const notes = data.notes ?? []
  const requestFocus = usePendingFocus(notes.length)

  useEffect(() => {
    if (!focusRequest) return
    const textarea = textareaRefs.current[focusRequest.id]
    if (!textarea) return
    textarea.scrollIntoView({ block: 'center', behavior: 'smooth' })
    textarea.focus()
  }, [focusRequest])

  return (
    <section className={active ? 'form-section is-active' : 'form-section'} data-form-section="notes" ref={sectionRef}>
      <SectionHead count={notes.length} title="Notes" />
      <div className="row-list">
        {notes.map((note, index) => (
          <div className="stacked-row note-row" key={note.id}>
            <textarea
              aria-label={`Note ${index + 1}`}
              data-note-id={note.id}
              ref={(element) => {
                textareaRefs.current[note.id] = element
              }}
              rows={2}
              value={note.text}
              onChange={(event) =>
                onChange(updateNoteText(data, note.id, event.target.value))
              }
            />
            <RemoveButton
              label={`Remove note ${index + 1}`}
              onClick={() =>
                onChange({
                  ...data,
                  notes: notes.filter((item) => item.id !== note.id),
                })
              }
            />
          </div>
        ))}
      </div>
      <button
        className="add-button"
        type="button"
        onClick={() => {
          const next = appendBlankNote(data)
          const nextNotes = next.notes ?? []
          const id = nextNotes[nextNotes.length - 1]?.id
          if (id) requestFocus(() => textareaRefs.current[id])
          onChange(next)
        }}
      >
        + Add note
      </button>
    </section>
  )
}

export function ClientSection({
  data,
  onChange,
  sectionRef,
  active = false,
}: Pick<FormProps, 'data' | 'onChange'> & {
  sectionRef?: Ref<HTMLElement>
  active?: boolean
}) {
  const updateClient = (
    client: Partial<MoneyMapData['client']>,
  ) => onChange({ ...data, client: { ...data.client, ...client } })

  return (
    <section className={active ? 'form-section is-active' : 'form-section'} data-form-section="client" ref={sectionRef}>
      <SectionHead title="Client" />
      <div className="client-fields">
        <div className="client-title-row">
          <TextField
            label="Title"
            value={data.client.title}
            onChange={(title) => updateClient({ title })}
          />
        </div>
        <div className="client-meta-row">
          <label className="form-field">
            <span>Year</span>
            <select
              value={data.client.year}
              onChange={(event) =>
                updateClient({ year: event.target.value })
              }
            >
              {yearSelectOptions(data.client.year).map((year) => (
                <option key={year} value={year}>
                  {year || 'Select year'}
                </option>
              ))}
            </select>
          </label>
          <label className="form-field">
            <span>Map Type</span>
            <select
              value={data.client.variant}
              onChange={(event) =>
                updateClient({
                  variant: event.target.value as 'annual' | 'postNote',
                })
              }
            >
              <option value="annual">Annual</option>
              <option value="postNote">Mid-year update</option>
            </select>
          </label>
        </div>
        {data.client.variant === 'postNote' && (
          <div className="client-post-note-row">
            <label className="form-field">
              <span>As of month</span>
              <select
                value={data.client.postNoteLabel ?? ''}
                onChange={(event) =>
                  updateClient({ postNoteLabel: event.target.value })
                }
              >
                {monthSelectOptions(
                  data.client.postNoteLabel ?? '',
                ).map((month) => (
                  <option key={month} value={month}>
                    {month || 'Select month'}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <label className="checkbox-field client-math-toggle">
          <input
            checked={data.showMath !== false}
            type="checkbox"
            onChange={(event) =>
              onChange({ ...data, showMath: event.target.checked })
            }
          />
          <span>Show runway and gap math</span>
        </label>
      </div>
    </section>
  )
}

export function handleFormKeyDown(
  event: ReactKeyboardEvent<HTMLFormElement>,
) {
  const target = event.target
  const isTextInput =
    target instanceof HTMLInputElement && target.type === 'text'
  const isSelect = target instanceof HTMLSelectElement
  if (
    event.key !== 'Enter' ||
    (!isTextInput && !isSelect)
  ) {
    return
  }

  const inputs = Array.from(
    event.currentTarget.querySelectorAll<
      HTMLInputElement | HTMLSelectElement
    >(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled])',
    ),
  ).filter((input) => input.getClientRects().length > 0)
  const nextInput = nextEnterFocusTarget(inputs, target)
  if (!nextInput) return
  event.preventDefault()
  nextInput.focus()
}

export function nextEnterFocusTarget<T>(
  focusables: readonly T[],
  current: T,
): T | undefined {
  return focusables[focusables.indexOf(current) + 1]
}

export function Form({
  data,
  filter,
  onFilterChange,
  activeSection,
  onSectionFocus,
  focusRequest,
  onChange,
  onClose,
  onHoverAccount,
  selectedAccountId,
  onSelectAccount,
  vocabulary,
}: FormProps) {
  const [localFilter, setLocalFilter] = useState(filter ?? '')
  const filterValue = onFilterChange ? filter ?? localFilter : localFilter
  const incomeSectionRef = useRef<HTMLElement>(null)
  const needSectionRef = useRef<HTMLElement>(null)
  const sectionRefs = useRef<
    Partial<Record<FormSection, HTMLElement | null>>
  >({})

  useEffect(() => {
    if (onFilterChange) setLocalFilter(filter ?? '')
  }, [filter, onFilterChange])

  const sectionLabels: Record<FormSection, string> = {
    client: 'Client',
    income: 'Income',
    accounts: 'Accounts',
    need: 'Need',
    notes: 'Notes',
  }
  const query = filterValue.trim().toLocaleLowerCase()
  const sectionMatches = (section: FormSection) => {
    const sectionData =
      section === 'client'
        ? data.client
        : section === 'income'
          ? data.incomeSources
          : section === 'accounts'
            ? data.accounts
            : section === 'need'
              ? {
                  monthlyNeed: data.monthlyNeed,
                  needTag: data.needTag,
                  asNeededAmount: data.asNeededAmount,
                  footnotes: data.footnotes,
                }
              : data.notes
    return !query ||
      (section + ' ' + sectionLabels[section] + ' ' + JSON.stringify(sectionData))
        .toLocaleLowerCase()
        .includes(query)
  }
  const registerSection = (section: FormSection) => (node: HTMLElement | null) => {
    sectionRefs.current[section] = node
  }
  const focusSection = (section: FormSection) => {
    onSectionFocus?.(section)
    const target =
      sectionRefs.current[section] ??
      (section === 'income'
        ? incomeSectionRef.current
        : section === 'need'
          ? needSectionRef.current
          : null)
    target?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (!focusRequest) return
    const section =
      focusRequest.id === 'income'
        ? incomeSectionRef.current
        : focusRequest.id === 'need'
          ? needSectionRef.current
          : null
    // 'start' + scroll-margin-top: these sections are taller than the panel,
    // so centring them puts their heading off the top of the scroller.
    section?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [focusRequest])

  return (
    <form
      className="client-form"
      onKeyDown={handleFormKeyDown}
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="data-form-tools">
        <label className="data-form-filter">
          <span>Filter</span>
          <svg
            aria-hidden="true"
            className="data-filter-glyph"
            viewBox="0 0 16 16"
          >
            <circle cx="7" cy="7" r="4.25" />
            <path d="m10.25 10.25 3.25 3.25" />
          </svg>
          <input
            aria-label="Filter data"
            placeholder="Filter data"
            type="search"
            value={filterValue}
            onChange={(event) => {
              setLocalFilter(event.target.value)
              onFilterChange?.(event.target.value)
            }}
          />
        </label>
        {filterValue.trim() && (
          <span className="data-filter-query">{filterValue.trim()}</span>
        )}
        {onClose && (
          <button
            aria-label="Close Data panel"
            className="data-form-close"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        )}
        <nav aria-label="Data sections" className="data-form-sections">
          {(Object.keys(sectionLabels) as FormSection[]).map((section) => (
            <button
              aria-current={activeSection === section ? 'true' : undefined}
              className={activeSection === section ? 'is-active' : undefined}
              key={section}
              type="button"
              onClick={() => focusSection(section)}
            >
              {sectionLabels[section]}
            </button>
          ))}
        </nav>
      </div>
      {sectionMatches('client') && (
        <ClientSection
          active={activeSection === 'client'}
          data={data}
          onChange={onChange}
          sectionRef={registerSection('client')}
        />
      )}
      {sectionMatches('income') && (
        <IncomeSection
          active={activeSection === 'income'}
          data={data}
          includeNeed={false}
          onChange={onChange}
          sectionRef={incomeSectionRef}
          vocabulary={vocabulary}
        />
      )}
      {sectionMatches('accounts') && (
        <AccountsSection
          active={activeSection === 'accounts'}
          data={data}
          focusRequest={focusRequest}
          onChange={onChange}
          onHoverAccount={onHoverAccount}
          selectedAccountId={selectedAccountId}
          onSelectAccount={onSelectAccount}
          sectionRef={registerSection('accounts')}
          vocabulary={vocabulary}
          query={query}
        />
      )}
      {sectionMatches('need') && (
        <NeedSection
          active={activeSection === 'need'}
          data={data}
          onChange={onChange}
          sectionRef={needSectionRef}
        />
      )}
      {sectionMatches('notes') && (
        <NotesSection
          active={activeSection === 'notes'}
          data={data}
          focusRequest={focusRequest}
          onChange={onChange}
          sectionRef={registerSection('notes')}
        />
      )}
      {!(Object.keys(sectionLabels) as FormSection[]).some(sectionMatches) && (
        <p className="empty-state">No matching data sections.</p>
      )}
    </form>
  )
}
