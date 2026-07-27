import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from 'react'
import { money, parseMoneyInput } from '../model/format'
import type {
  Account,
  Bucket,
  Footnote,
  IncomeSource,
  MoneyMapData,
  Position,
  SubAccount,
} from '../model/types'
import { newId } from '../model/types'

interface FormProps {
  data: MoneyMapData
  onChange(next: MoneyMapData): void
  focusRequest?: { id: string; at: number }
  onHoverAccount?: (id: string | null) => void
}

interface MoneyFieldProps {
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
  { value: 'note', label: 'Note card' },
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

function MoneyField({ label, value, onChange }: MoneyFieldProps) {
  const [focused, setFocused] = useState(false)
  const [raw, setRaw] = useState('')

  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        className="money-input"
        inputMode="decimal"
        placeholder="~$ ______"
        type="text"
        value={focused ? raw : value === null ? '' : money(value)}
        onBlur={() => {
          onChange(parseMoneyInput(raw))
          setFocused(false)
        }}
        onChange={(event) => setRaw(event.target.value)}
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
}: {
  label: string
  value: string
  onChange(value: string): void
  inputRef?: Ref<HTMLInputElement>
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input
        ref={inputRef}
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

function IncomeSection({
  data,
  onChange,
  sectionRef,
}: Pick<FormProps, 'data' | 'onChange'> & {
  sectionRef?: Ref<HTMLElement>
}) {
  const setSources = (incomeSources: IncomeSource[]) =>
    onChange({ ...data, incomeSources })
  const updateSource = (index: number, source: IncomeSource) =>
    setSources(
      data.incomeSources.map((item, itemIndex) =>
        itemIndex === index ? source : item,
      ),
    )

  return (
    <section className="form-section" ref={sectionRef}>
      <h2>Income</h2>
      <div className="row-list">
        {data.incomeSources.map((source, index) => (
          <div className="stacked-row income-row" key={index}>
            <div className="stacked-row-heading">
              <TextField
                label="Label"
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
                label="Qualifier"
                value={source.qualifier ?? ''}
                onChange={(qualifier) =>
                  updateSource(index, { ...source, qualifier })
                }
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="add-button"
        type="button"
        onClick={() =>
          setSources([
            ...data.incomeSources,
            { label: '', amount: null, period: 'mo' },
          ])
        }
      >
        + Add income source
      </button>
      <div className="field-grid income-totals">
        <MoneyField
          label="After-Tax Income"
          value={data.afterTaxIncome}
          onChange={(afterTaxIncome) => onChange({ ...data, afterTaxIncome })}
        />
        <MoneyField
          label="Monthly Income Need"
          value={data.monthlyNeed}
          onChange={(monthlyNeed) => onChange({ ...data, monthlyNeed })}
        />
        <div className="wide-field">
          <MoneyField
            label="Monthly income as needed"
            value={data.asNeededAmount}
            onChange={(asNeededAmount) =>
              onChange({ ...data, asNeededAmount })
            }
          />
          <p className="help-text">Appears on the arrow.</p>
        </div>
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
        <span className="account-summary-label">
          {account.label || 'Untitled account'}
        </span>
        <span className="account-summary-value">{money(account.value)}</span>
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
            label="Label"
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

function AccountsSection({
  data,
  focusRequest,
  onChange,
  onHoverAccount,
}: FormProps) {
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
    <section className="form-section">
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
        <span className="account-preset-label">Add:</span>
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
    </section>
  )
}

function FootnotesSection({ data, onChange }: FormProps) {
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

export function Form({
  data,
  focusRequest,
  onChange,
  onHoverAccount,
}: FormProps) {
  const incomeSectionRef = useRef<HTMLElement>(null)
  const updateClient = (
    client: Partial<MoneyMapData['client']>,
  ) => onChange({ ...data, client: { ...data.client, ...client } })

  useEffect(() => {
    if (
      !focusRequest ||
      (focusRequest.id !== 'income' && focusRequest.id !== 'need')
    ) {
      return
    }
    incomeSectionRef.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    })
  }, [focusRequest])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLFormElement>) => {
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

  return (
    <form
      className="client-form"
      onKeyDown={handleKeyDown}
      onSubmit={(event) => event.preventDefault()}
    >
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
            <TextField
              label="Year"
              value={data.client.year}
              onChange={(year) => updateClient({ year })}
            />
            <label className="form-field">
              <span>Variant</span>
              <select
                value={data.client.variant}
                onChange={(event) =>
                  updateClient({
                    variant: event.target.value as 'annual' | 'postNote',
                  })
                }
              >
                <option value="annual">Annual</option>
                <option value="postNote">Post Note</option>
              </select>
            </label>
          </div>
          {data.client.variant === 'postNote' && (
            <div className="client-post-note-row">
              <TextField
                label="Post Note Label"
                value={data.client.postNoteLabel ?? ''}
                onChange={(postNoteLabel) =>
                  updateClient({ postNoteLabel })
                }
              />
            </div>
          )}
        </div>
      </section>
      <IncomeSection
        data={data}
        onChange={onChange}
        sectionRef={incomeSectionRef}
      />
      <AccountsSection
        data={data}
        focusRequest={focusRequest}
        onChange={onChange}
        onHoverAccount={onHoverAccount}
      />
      <FootnotesSection data={data} onChange={onChange} />
    </form>
  )
}
