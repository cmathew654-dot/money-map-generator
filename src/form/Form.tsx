import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from 'react'
import {
  accountDisplayName,
  money,
  parseMoneyInput,
} from '../model/format'
import type {
  Account,
  AccountShape,
  Bucket,
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

export interface FormProps {
  data: MoneyMapData
  onChange(next: MoneyMapData): void
  focusRequest?: { id: string; at: number }
  onHoverAccount?: (id: string | null) => void
}

interface MoneyFieldProps {
  inputRef?: Ref<HTMLInputElement>
  label: string
  value: number | null
  onChange(value: number | null): void
}

const bucketOptions: { value: Bucket; label: string }[] = [
  { value: 'shortTerm', label: 'Short-Term Bucket' },
  { value: 'afterTax', label: 'After-Tax' },
  { value: 'taxDeferred', label: 'Tax-Deferred' },
  { value: 'taxPreferred', label: 'Tax-Preferred' },
  { value: 'charitable', label: 'Charitable' },
  { value: 'cash', label: 'Cash' },
  { value: 'note', label: 'Note' },
]

const accountPresets: {
  chipLabel: string
  account: Omit<Account, 'id' | 'value'>
}[] = [
  {
    chipLabel: 'Short-Term',
    account: {
      bucket: 'shortTerm',
      label: 'Short-Term Funds',
      caption: "2-3 years' worth of income needs",
      inWaterfall: true,
    },
  },
  {
    chipLabel: 'Trust',
    account: {
      bucket: 'afterTax',
      label: 'Trust Account',
      inWaterfall: true,
    },
  },
  {
    chipLabel: 'IRA',
    account: {
      bucket: 'taxDeferred',
      label: 'IRA',
      inWaterfall: true,
    },
  },
  {
    chipLabel: 'Roth',
    account: {
      bucket: 'taxPreferred',
      label: 'Roth IRA',
      inWaterfall: false,
    },
  },
  {
    chipLabel: 'Cash',
    account: {
      bucket: 'cash',
      label: 'Cash at Bank',
      inWaterfall: false,
    },
  },
  {
    chipLabel: 'Charitable',
    account: {
      bucket: 'charitable',
      label: 'Donor-Advised Fund',
      inWaterfall: false,
    },
  },
  {
    chipLabel: 'Note',
    account: {
      bucket: 'note',
      label: 'Note',
      inWaterfall: false,
    },
  },
]

const incomePresets = [
  { chipLabel: 'Social Security', label: 'Social Security' },
  { chipLabel: 'Pension', label: 'Pension' },
  { chipLabel: 'Salary / Wages', label: 'Salary / Wages' },
  { chipLabel: 'Rental Income', label: 'Rental Income' },
  { chipLabel: 'Annuity', label: 'Annuity' },
  { chipLabel: 'Something else', label: '' },
]

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
    { label, amount: null, period: 'mo' },
  ]
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
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')

  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        className="money-input"
        inputMode="decimal"
        placeholder="~$ ______"
        ref={inputRef}
        type="text"
        value={focused ? raw : value === null ? '' : money(value)}
        onBlur={() => {
          onChange(parseMoneyInput(raw))
          setFocused(false)
        }}
        onChange={(event) => {
          setRaw(event.target.value)
          onChange(parseMoneyInput(event.target.value))
        }}
        onFocus={() => {
          setRaw(value === null ? '' : String(value))
          setFocused(true)
        }}
      />
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  inputRef,
  placeholder,
}: {
  label: string
  value: string
  onChange(value: string): void
  inputRef?: Ref<HTMLInputElement>
  placeholder?: string
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        ref={inputRef}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
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
}: Pick<FormProps, 'data' | 'onChange'> & {
  embedded?: boolean
  sectionRef?: Ref<HTMLElement>
}) {
  const fields = (
    <>
      <div>
        <MoneyField
          label="Monthly Income Need"
          value={data.monthlyNeed}
          onChange={(monthlyNeed) => onChange({ ...data, monthlyNeed })}
        />
        <p className="help-text">
          The red number — what the household must cover each month.
        </p>
      </div>
      <div className="wide-field">
        <MoneyField
          label="Draw from Short-Term Bucket"
          value={data.asNeededAmount}
          onChange={(asNeededAmount) =>
            onChange({ ...data, asNeededAmount })
          }
        />
        <p className="help-text">
          Optional monthly draw — appears on the arrow from the short-term
          bucket.
        </p>
      </div>
    </>
  )

  if (embedded) return fields

  return (
    <section className="form-section" ref={sectionRef}>
      <h2>Need</h2>
      <div className="field-grid">{fields}</div>
    </section>
  )
}

export function IncomeSection({
  data,
  onChange,
  sectionRef,
  includeNeed = true,
}: Pick<FormProps, 'data' | 'onChange'> & {
  sectionRef?: Ref<HTMLElement>
  includeNeed?: boolean
}) {
  const labelInputs = useRef<(HTMLInputElement | null)[]>([])
  const amountInputs = useRef<(HTMLInputElement | null)[]>([])
  const pendingFocus = useRef<{
    field: 'amount' | 'label'
    index: number
  } | null>(null)
  const setSources = (incomeSources: IncomeSource[]) =>
    onChange({ ...data, incomeSources })
  const updateSource = (index: number, source: IncomeSource) =>
    setSources(
      data.incomeSources.map((item, itemIndex) =>
        itemIndex === index ? source : item,
      ),
    )

  useEffect(() => {
    const request = pendingFocus.current
    if (!request) return
    const inputs =
      request.field === 'amount' ? amountInputs : labelInputs
    inputs.current[request.index]?.focus()
    pendingFocus.current = null
  }, [data.incomeSources.length])

  return (
    <section className="form-section" ref={sectionRef}>
      <h2>Income</h2>
      <div className="row-list">
        {data.incomeSources.map((source, index) => (
          <div className="stacked-row income-row" key={index}>
            <div className="stacked-row-heading">
              <TextField
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
              <TextField
                label="Shown as"
                placeholder="e.g. Gross, After-Tax"
                value={source.qualifier ?? ''}
                onChange={(qualifier) =>
                  updateSource(index, { ...source, qualifier })
                }
              />
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
              pendingFocus.current = {
                field: preset.label ? 'amount' : 'label',
                index,
              }
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
}: {
  positions: Position[]
  onChange(positions: Position[]): void
}) {
  return (
    <div className="nested-list">
      <h4>Positions</h4>
      {positions.map((position, index) => (
        <div className="stacked-row nested-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
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
        onClick={() => onChange([...positions, { label: '', value: null }])}
      >
        + Add position
      </button>
    </div>
  )
}

function SubAccountRows({
  subAccounts,
  onChange,
}: {
  subAccounts: SubAccount[]
  onChange(subAccounts: SubAccount[]): void
}) {
  return (
    <div className="nested-list">
      <h4>Sub-accounts</h4>
      {subAccounts.map((subAccount, index) => (
        <div className="stacked-row subaccount-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
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
              label="Caption"
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
        onClick={() =>
          onChange([
            ...subAccounts,
            { label: '', caption: '', value: null },
          ])
        }
      >
        + Add sub-account
      </button>
    </div>
  )
}

function AccountCard({
  account,
  initiallyOpen,
  onHoverAccount,
  registerFocusRefs,
  onChange,
  onRemove,
}: {
  account: Account
  initiallyOpen: boolean
  onHoverAccount?: (id: string | null) => void
  registerFocusRefs(
    id: string,
    refs: AccountFocusRefs | null,
  ): void
  onChange(account: Account): void
  onRemove(): void
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const labelInputRef = useRef<HTMLInputElement>(null)
  const didSetInitialOpen = useRef(false)

  useEffect(() => {
    if (didSetInitialOpen.current) return
    didSetInitialOpen.current = true
    if (initiallyOpen && detailsRef.current) {
      detailsRef.current.open = true
    }
  }, [initiallyOpen])

  useEffect(() => {
    if (!detailsRef.current || !labelInputRef.current) return
    registerFocusRefs(account.id, {
      details: detailsRef.current,
      labelInput: labelInputRef.current,
    })
    return () => registerFocusRefs(account.id, null)
  }, [account.id, registerFocusRefs])

  return (
    <details
      className={`account-card bucket-${account.bucket}`}
      onMouseEnter={() => onHoverAccount?.(account.id)}
      onMouseLeave={() => onHoverAccount?.(null)}
      ref={detailsRef}
    >
      <summary className="account-summary">
        <span aria-hidden="true" className="account-swatch" />
        <span
          className={`account-summary-label${
            account.label.trim() ? '' : ' is-unnamed'
          }`}
        >
          {accountDisplayName(account)}
        </span>
        <span className="account-summary-value">{money(account.value)}</span>
        <span
          aria-label={`Shape for ${accountDisplayName(account)}`}
          className="shape-segmented-control"
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
      </summary>
      <div className="account-body">
        <button className="text-button" type="button" onClick={onRemove}>
          Remove account
        </button>
        <div className="account-fields">
          <label className="form-field">
            <span>Bucket</span>
            <select
              value={account.bucket}
              onChange={(event) =>
                onChange({
                  ...account,
                  bucket: event.target.value as Bucket,
                })
              }
            >
              {bucketOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <TextField
            inputRef={labelInputRef}
            label="Account name"
            value={account.label}
            onChange={(label) => onChange({ ...account, label })}
          />
          <MoneyField
            label="Value"
            value={account.value}
            onChange={(value) => onChange({ ...account, value })}
          />
          <TextField
            label="Caption"
            value={account.caption ?? ''}
            onChange={(caption) => onChange({ ...account, caption })}
          />
        </div>
        <label className="checkbox-field">
          <input
            checked={account.inWaterfall}
            type="checkbox"
            onChange={(event) =>
              onChange({ ...account, inWaterfall: event.target.checked })
            }
          />
          In refill chain
        </label>
        <PositionRows
          positions={account.positions ?? []}
          onChange={(positions) => onChange({ ...account, positions })}
        />
        <SubAccountRows
          subAccounts={account.subAccounts ?? []}
          onChange={(subAccounts) => onChange({ ...account, subAccounts })}
        />
      </div>
    </details>
  )
}

interface AccountFocusRefs {
  details: HTMLDetailsElement
  labelInput: HTMLInputElement
}

export function AccountsSection({
  data,
  focusRequest,
  onChange,
  onHoverAccount,
  presetLabel = 'Add:',
}: FormProps & {
  presetLabel?: string
}) {
  const [newAccountId, setNewAccountId] = useState<string | null>(null)
  const focusRefs = useRef(new Map<string, AccountFocusRefs>())
  const registerFocusRefs = useCallback(
    (id: string, refs: AccountFocusRefs | null) => {
      if (refs) {
        focusRefs.current.set(id, refs)
      } else {
        focusRefs.current.delete(id)
      }
    },
    [],
  )
  const setAccounts = (accounts: Account[]) =>
    onChange({ ...data, accounts })

  useEffect(() => {
    if (!focusRequest) return
    const refs = focusRefs.current.get(focusRequest.id)
    if (!refs) return
    refs.details.open = true
    refs.details.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
    refs.labelInput.focus()
  }, [focusRequest])

  return (
    <section className="form-section accounts-section">
      <h2>Accounts</h2>
      {data.accounts.map((account, index) => (
        <AccountCard
          account={account}
          initiallyOpen={account.id === newAccountId}
          key={account.id}
          onHoverAccount={onHoverAccount}
          registerFocusRefs={registerFocusRefs}
          onChange={(next) =>
            setAccounts(
              data.accounts.map((item, itemIndex) =>
                itemIndex === index ? next : item,
              ),
            )
          }
          onRemove={() =>
            setAccounts(
              data.accounts.filter((_, itemIndex) => itemIndex !== index),
            )
          }
        />
      ))}
      <div className="account-preset-row" aria-label="Add account">
        <span className="account-preset-label">{presetLabel}</span>
        {accountPresets.map((preset) => (
          <button
            className={`account-preset-button bucket-${preset.account.bucket}`}
            key={preset.chipLabel}
            type="button"
            onClick={() => {
              const id = newId('account')
              setNewAccountId(id)
              setAccounts([
                ...data.accounts,
                {
                  id,
                  ...preset.account,
                  value: null,
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

export function FootnotesSection({ data, onChange }: FormProps) {
  const setFootnotes = (footnotes: Footnote[]) =>
    onChange({ ...data, footnotes })
  const updateFootnote = (index: number, footnote: Footnote) =>
    setFootnotes(
      data.footnotes.map((item, itemIndex) =>
        itemIndex === index ? footnote : item,
      ),
    )

  return (
    <section className="form-section">
      <h2>Footnotes</h2>
      {data.footnotes.map((footnote, index) => (
        <div className="stacked-row footnote-row" key={index}>
          <div className="stacked-row-heading">
            <TextField
              label="Label"
              value={footnote.label}
              onChange={(label) =>
                updateFootnote(index, { ...footnote, label })
              }
            />
            <RemoveButton
              label={`Remove footnote ${index + 1}`}
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
        onClick={() =>
          setFootnotes([
            ...data.footnotes,
            { label: '', gross: null, net: null },
          ])
        }
      >
        + Add footnote
      </button>
      <p className="help-text">
        Net renders in green — after withholding.
      </p>
    </section>
  )
}

export function ClientSection({
  data,
  onChange,
}: Pick<FormProps, 'data' | 'onChange'>) {
  const updateClient = (
    client: Partial<MoneyMapData['client']>,
  ) => onChange({ ...data, client: { ...data.client, ...client } })

  return (
    <section className="form-section">
      <h2>Client</h2>
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
              <span>As Of</span>
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
  if (
    event.key !== 'Enter' ||
    !(event.target instanceof HTMLInputElement) ||
    event.target.type !== 'text'
  ) {
    return
  }

  const inputs = Array.from(
    event.currentTarget.querySelectorAll<HTMLInputElement>(
      'input:not([type="hidden"]):not([disabled])',
    ),
  ).filter((input) => input.getClientRects().length > 0)
  const nextInput = inputs[inputs.indexOf(event.target) + 1]
  if (!nextInput) return
  event.preventDefault()
  nextInput.focus()
}

export function Form({
  data,
  focusRequest,
  onChange,
  onHoverAccount,
}: FormProps) {
  const incomeSectionRef = useRef<HTMLElement>(null)
  const needSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!focusRequest) return
    const section =
      focusRequest.id === 'income'
        ? incomeSectionRef.current
        : focusRequest.id === 'need'
          ? needSectionRef.current
          : null
    section?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
  }, [focusRequest])

  return (
    <form
      className="client-form"
      onKeyDown={handleFormKeyDown}
      onSubmit={(event) => event.preventDefault()}
    >
      <ClientSection data={data} onChange={onChange} />
      <IncomeSection
        data={data}
        includeNeed={false}
        onChange={onChange}
        sectionRef={incomeSectionRef}
      />
      <AccountsSection
        data={data}
        focusRequest={focusRequest}
        onChange={onChange}
        onHoverAccount={onHoverAccount}
      />
      <NeedSection
        data={data}
        onChange={onChange}
        sectionRef={needSectionRef}
      />
      <FootnotesSection data={data} onChange={onChange} />
    </form>
  )
}
