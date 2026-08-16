import { useState, type FormEvent } from 'react'
import { Dialog } from './Dialog'

interface PassphraseDialogProps {
  fileName: string
  mode: 'create' | 'open'
  onCancel(): void
  onSubmit(passphrase: string): void
}

export function PassphraseDialog({
  fileName,
  mode,
  onCancel,
  onSubmit,
}: PassphraseDialogProps) {
  const [passphrase, setPassphrase] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const creating = mode === 'create'

  const submit = () => {
    if (creating && passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters.')
      return
    }
    if (creating && passphrase !== confirmation) {
      setError('Passphrases do not match.')
      return
    }
    onSubmit(passphrase)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  return (
    <Dialog
      confirmLabel={creating ? 'Encrypt and save' : 'Open file'}
      open
      title={creating ? 'Create a file passphrase' : 'Open encrypted file'}
      onClose={onCancel}
      onConfirm={submit}
    >
      <form onSubmit={handleSubmit}>
        <p className="form-caption">
          {creating
            ? `This passphrase protects ${fileName}. It cannot be recovered.`
            : `Enter the passphrase for ${fileName}.`}
        </p>
        <div className="client-fields">
          <label className="form-field">
            <span>Passphrase</span>
            <input
              aria-describedby="passphrase-error"
              aria-invalid={Boolean(error) || undefined}
              autoComplete={creating ? 'new-password' : 'current-password'}
              autoFocus
              name="passphrase"
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
            />
          </label>
          {creating && (
            <label className="form-field">
              <span>Confirm passphrase</span>
              <input
                aria-describedby="passphrase-error"
                aria-invalid={Boolean(error) || undefined}
                autoComplete="new-password"
                name="passphrase-confirmation"
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </label>
          )}
        </div>
        <p
          aria-live="polite"
          className="form-caption"
          id="passphrase-error"
          role="status"
        >
          {error}
        </p>
        <button className="visually-hidden" tabIndex={-1} type="submit">
          Submit
        </button>
      </form>
    </Dialog>
  )
}
