import {
  useId,
  useMemo,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react'
import {
  suggest,
  type VocabularyTerm,
  type VocabularySuggestion,
} from '../model/vocab'

interface AutocompleteProps {
  bookTerms?: readonly VocabularyTerm[]
  inputRef?: Ref<HTMLInputElement>
  onChange(value: string): void
  placeholder?: string
  seeds?: readonly string[]
  value: string
}

export function Autocomplete({
  bookTerms = [],
  inputRef,
  onChange,
  placeholder,
  seeds = [],
  value,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const listboxId = useId()
  const suggestions = useMemo(
    () => suggest(bookTerms, seeds, value),
    [bookTerms, seeds, value],
  )
  const listOpen = open && suggestions.length > 0
  const activeOption =
    activeIndex >= 0 && activeIndex < suggestions.length
      ? `${listboxId}-option-${activeIndex}`
      : undefined

  const choose = (suggestion: VocabularySuggestion) => {
    onChange(suggestion.text)
    setOpen(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && listOpen) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      setActiveIndex(-1)
      return
    }

    if (event.key === 'Enter' && listOpen) {
      event.preventDefault()
      event.stopPropagation()
      if (activeIndex >= 0) {
        const active = suggestions[activeIndex]
        if (active) choose(active)
      }
      return
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    if (suggestions.length === 0) return

    event.preventDefault()
    event.stopPropagation()
    const direction = event.key === 'ArrowDown' ? 1 : -1
    if (!listOpen) {
      setOpen(true)
      setActiveIndex(direction === 1 ? 0 : suggestions.length - 1)
      return
    }
    setActiveIndex((current) =>
      current < 0
        ? direction === 1
          ? 0
          : suggestions.length - 1
        : (current + direction + suggestions.length) %
          suggestions.length,
    )
  }

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        aria-activedescendant={listOpen ? activeOption : undefined}
        aria-autocomplete="list"
        aria-controls={listboxId}
        aria-expanded={listOpen}
        enterKeyHint="next"
        placeholder={placeholder}
        role="combobox"
        type="text"
        value={value}
        onBlur={() => {
          setOpen(false)
          setActiveIndex(-1)
        }}
        onChange={(event) => {
          const next = event.target.value
          onChange(next)
          setOpen(suggest(bookTerms, seeds, next).length > 0)
          setActiveIndex(-1)
        }}
        onKeyDown={handleKeyDown}
      />
      {listOpen && (
        <div className="autocomplete-list" id={listboxId} role="listbox">
          {suggestions.map((suggestion, index) => (
            <div
              aria-selected={index === activeIndex}
              className={`autocomplete-option${
                index === activeIndex ? ' is-active' : ''
              }`}
              data-from-book={suggestion.fromBook || undefined}
              id={`${listboxId}-option-${index}`}
              key={suggestion.text}
              role="option"
              onMouseDown={(event) => {
                event.preventDefault()
                choose(suggestion)
              }}
            >
              {suggestion.text.slice(0, suggestion.matchStart)}
              <strong>
                {suggestion.text.slice(
                  suggestion.matchStart,
                  suggestion.matchEnd,
                )}
              </strong>
              {suggestion.text.slice(suggestion.matchEnd)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
