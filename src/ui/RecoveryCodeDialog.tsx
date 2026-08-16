import type { MouseEvent } from 'react'
import '../styles/recovery.css'

export interface RecoveryCodeDialogProps {
  code: string
  fileName: string
  hasPassphraseWrap?: boolean
  /**
   * Held by the parent rather than local state: this component is rendered as
   * a plain function in tests, so it cannot use hooks. The alternative it
   * originally used - toggling button.disabled by hand and reading the
   * checkbox back through form.elements - failed silently whenever a link in
   * that chain was null, which left the advisor stuck on this screen.
   */
  acknowledged: boolean
  onAcknowledgedChange(next: boolean): void
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
  hasPassphraseWrap = true,
  acknowledged,
  onAcknowledgedChange,
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
        {!hasPassphraseWrap && (
          <p>
            If this computer breaks or is replaced, this code is the only way to open the file.
          </p>
        )}

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

        {/*
          Acknowledgement is React state, not imperative DOM. Reading the
          checkbox back through form.elements and toggling button.disabled by
          hand fails silently when any link in the chain is null, and React
          re-applies its own disabled prop on the next render anyway.
        */}
        <div className="recovery-confirmation">
          <label className="recovery-acknowledgement">
            <input
              autoFocus
              checked={acknowledged}
              name="recovery-acknowledgement"
              type="checkbox"
              onChange={(event) => onAcknowledgedChange(event.currentTarget.checked)}
            />
            <span>
              I saved this code. Without it, a lost password (or a broken computer) means this file can never be opened.
            </span>
          </label>

          <div className="dialog-actions">
            <button
              className="primary-button recovery-confirm"
              disabled={!acknowledged}
              name="recovery-confirm"
              type="button"
              onClick={onConfirm}
            >
              I have saved the code
            </button>
          </div>
        </div>
      </div>
    </dialog>
  )
}
