import type { MouseEvent } from 'react'
import '../styles/recovery.css'

export interface RecoveryCodeDialogProps {
  code: string
  fileName: string
  onConfirm(): void
}

function setActionStatus(button: HTMLButtonElement, message: string) {
  const status = button
    .closest('.recovery-dialog')
    ?.querySelector<HTMLElement>('.recovery-action-status')
  if (status) status.textContent = message
}

export function RecoveryCodeDialog({
  code,
  fileName,
  onConfirm,
}: RecoveryCodeDialogProps) {
  const printedOn = new Date().toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const copyCode = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    try {
      await navigator.clipboard.writeText(code)
      setActionStatus(button, 'Recovery code copied.')
    } catch {
      setActionStatus(
        button,
        'Copy did not complete. Write down the code or try again.',
      )
    }
  }

  return (
    <dialog
      aria-describedby="recovery-dialog-intro"
      aria-labelledby="recovery-dialog-title"
      aria-modal="true"
      className="app-dialog recovery-dialog"
      ref={(dialog) => {
        if (dialog && !dialog.open) dialog.showModal()
      }}
      onCancel={(event) => event.preventDefault()}
    >
      <h2 id="recovery-dialog-title">Save the recovery code</h2>
      <div className="dialog-message recovery-dialog-content">
        <p className="recovery-intro" id="recovery-dialog-intro">
          Store this code somewhere secure before continuing.
        </p>

        <dl className="recovery-details">
          <div>
            <dt>Client book</dt>
            <dd>{fileName}</dd>
          </div>
          <div className="recovery-print-date">
            <dt>Date</dt>
            <dd>{printedOn}</dd>
          </div>
        </dl>

        <p className="recovery-code-label" id="recovery-code-label">
          Recovery code
        </p>
        <output
          aria-labelledby="recovery-code-label"
          className="recovery-code"
        >
          {code}
        </output>

        <div className="recovery-code-actions">
          <button
            className="quiet-button recovery-secondary-action"
            name="recovery-copy"
            type="button"
            onClick={copyCode}
          >
            Copy code
          </button>
          <button
            className="quiet-button recovery-secondary-action"
            name="recovery-print"
            type="button"
            onClick={(event) => {
              setActionStatus(event.currentTarget, 'Print dialog opened.')
              window.print()
            }}
          >
            Print
          </button>
          <p
            aria-live="polite"
            className="recovery-action-status"
            role="status"
          />
        </div>

        <form className="recovery-confirmation">
          <label className="recovery-acknowledgement">
            <input
              autoFocus
              name="recovery-acknowledgement"
              type="checkbox"
              onChange={(event) => {
                const confirm = event.currentTarget.form?.elements.namedItem(
                  'recovery-confirm',
                ) as HTMLButtonElement | null
                if (confirm) confirm.disabled = !event.currentTarget.checked
              }}
            />
            <span>
              I have saved this code and understand it cannot be recovered; without
              it, the client book cannot be opened if I forget the passphrase.
            </span>
          </label>

          <div className="dialog-actions">
            <button
              className="primary-button recovery-confirm"
              disabled
              name="recovery-confirm"
              type="button"
              onClick={(event) => {
                const acknowledgement = event.currentTarget.form?.elements.namedItem(
                  'recovery-acknowledgement',
                ) as HTMLInputElement | null
                if (acknowledgement?.checked) onConfirm()
              }}
            >
              I have saved the code
            </button>
          </div>
        </form>
      </div>
    </dialog>
  )
}
