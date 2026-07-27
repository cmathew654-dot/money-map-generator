import { useEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  children: ReactNode
  confirmLabel: string
  danger?: boolean
  open: boolean
  title: string
  onClose(): void
  onConfirm(): void
}

export function Dialog({
  children,
  confirmLabel,
  danger = false,
  open,
  title,
  onClose,
  onConfirm,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      aria-labelledby="app-dialog-title"
      className="app-dialog"
      ref={dialogRef}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
    >
      <h2 id="app-dialog-title">{title}</h2>
      <div className="dialog-message">{children}</div>
      <div className="dialog-actions">
        {danger && (
          <button className="quiet-button" type="button" onClick={onClose}>
            Cancel
          </button>
        )}
        <button
          className={danger ? 'danger-button' : 'primary-button'}
          type="button"
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </dialog>
  )
}
