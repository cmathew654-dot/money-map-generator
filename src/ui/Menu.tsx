import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

interface MenuProps {
  ariaLabel: string
  children: ReactNode
  trigger: ReactNode
  triggerClassName?: string
}

type MenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  danger?: boolean
}

function menuItems(container: HTMLElement | null) {
  if (!container) return []
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not([disabled])',
    ),
  )
}

export function Menu({
  ariaLabel,
  children,
  trigger,
  triggerClassName = '',
}: MenuProps) {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const triggerId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const openMenu = () => {
    setOpen(true)
  }

  const closeMenu = (returnFocus = false) => {
    setOpen(false)
    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }

  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => {
      menuItems(popoverRef.current)[0]?.focus()
    })
    const handleClickAway = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu()
    }
    document.addEventListener('mousedown', handleClickAway)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('mousedown', handleClickAway)
    }
  }, [open])

  const handleTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      event.key !== 'Enter' &&
      event.key !== ' ' &&
      event.key !== 'ArrowDown'
    ) {
      return
    }
    event.preventDefault()
    openMenu()
  }

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const items = menuItems(popoverRef.current)
    if (event.key === 'Escape') {
      event.preventDefault()
      closeMenu(true)
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      const current = document.activeElement
      if (current instanceof HTMLElement && items.includes(current)) {
        current.click()
      }
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return

    event.preventDefault()
    const currentIndex = items.indexOf(
      document.activeElement as HTMLElement,
    )
    const direction = event.key === 'ArrowDown' ? 1 : -1
    const nextIndex =
      currentIndex < 0
        ? direction === 1
          ? 0
          : items.length - 1
        : (currentIndex + direction + items.length) % items.length
    items[nextIndex]?.focus()
  }

  return (
    <div className="menu" ref={rootRef}>
      <button
        ref={triggerRef}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={ariaLabel}
        className={`quiet-button menu-trigger ${triggerClassName}`.trim()}
        id={triggerId}
        type="button"
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={popoverRef}
          aria-labelledby={triggerId}
          className="menu-popover"
          id={menuId}
          role="menu"
          onClick={(event) => {
            const target = event.target as HTMLElement
            if (target.closest('[role="menuitem"]')) closeMenu()
          }}
          onKeyDown={handleMenuKeyDown}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function MenuItem({
  children,
  className = '',
  danger = false,
  type = 'button',
  ...props
}: MenuItemProps) {
  return (
    <button
      className={`menu-item${danger ? ' is-danger' : ''}${
        className ? ` ${className}` : ''
      }`}
      role="menuitem"
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}

export function MenuSeparator() {
  return <div aria-hidden="true" className="menu-separator" role="separator" />
}
