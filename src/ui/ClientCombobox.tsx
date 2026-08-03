import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import type { MoneyMapData } from '../model/types'

export interface ClientComboboxProps {
  clients: readonly MoneyMapData[]
  value: string
  onChange(id: string): void
  disabled?: boolean
}

export function clientDisplayLabel(client: MoneyMapData): string {
  return client.client.title || 'Untitled'
}

export function filterClientOptions(
  clients: readonly MoneyMapData[],
  query: string,
): MoneyMapData[] {
  const normalized = query.trim().toLocaleLowerCase()
  if (!normalized) return [...clients]
  return clients.filter((client) =>
    `${clientDisplayLabel(client)} ${client.client.year}`
      .toLocaleLowerCase()
      .includes(normalized),
  )
}

export function ClientCombobox({
  clients,
  value,
  onChange,
  disabled = false,
}: ClientComboboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = useId().replaceAll(':', '')
  const activeClient =
    clients.find((client) => client.id === value) ?? clients[0]
  const activeLabel = activeClient ? clientDisplayLabel(activeClient) : ''
  const [inputValue, setInputValue] = useState(activeLabel)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const options = useMemo(
    () => filterClientOptions(clients, inputValue),
    [clients, inputValue],
  )
  const listOpen = open && options.length > 0
  const activeOptionId =
    activeIndex >= 0 && activeIndex < options.length
      ? `${listboxId}-option-${options[activeIndex].id}`
      : undefined

  useEffect(() => {
    setInputValue(activeLabel)
    setOpen(false)
    setActiveIndex(-1)
  }, [activeLabel, value])

  const choose = (client: MoneyMapData) => {
    onChange(client.id)
    setInputValue(clientDisplayLabel(client))
    setOpen(false)
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      setInputValue(activeLabel)
      setOpen(false)
      setActiveIndex(-1)
      inputRef.current?.focus()
      return
    }

    if (event.key === 'Enter') {
      if (!listOpen) return
      event.preventDefault()
      event.stopPropagation()
      const option =
        options[activeIndex] ?? (options.length === 1 ? options[0] : undefined)
      if (option) choose(option)
      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    if (options.length === 0) return
    event.preventDefault()
    event.stopPropagation()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    if (!listOpen) {
      setOpen(true)
      setActiveIndex(direction === 1 ? 0 : options.length - 1)
      return
    }
    setActiveIndex((current) =>
      current < 0
        ? direction === 1
          ? 0
          : options.length - 1
        : (current + direction + options.length) % options.length,
    )
  }

  return (
    <div className="client-combobox">
      <input
        ref={inputRef}
        aria-activedescendant={listOpen ? activeOptionId : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={listOpen}
        aria-label="Active client"
        autoComplete="off"
        className="client-select client-combobox-input"
        disabled={disabled}
        role="combobox"
        type="text"
        value={inputValue}
        onBlur={() => {
          setInputValue(activeLabel)
          setOpen(false)
          setActiveIndex(-1)
        }}
        onChange={(event) => {
          setInputValue(event.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {listOpen && (
        <div className="client-combobox-list" id={listboxId} role="listbox">
          {options.map((client, index) => {
            const label = clientDisplayLabel(client)
            return (
              <div
                aria-selected={index === activeIndex}
                className={`client-combobox-option${
                  index === activeIndex ? ' is-active' : ''
                }`}
                id={`${listboxId}-option-${client.id}`}
                key={client.id}
                role="option"
                onMouseDown={(event) => {
                  event.preventDefault()
                  choose(client)
                }}
              >
                <span>{label}</span>
                <small>{client.client.year}</small>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
