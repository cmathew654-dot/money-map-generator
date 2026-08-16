import { useState, type FormEvent } from 'react'
import { normalizeRecoveryCode } from '../model/crypto'
import { Dialog } from './Dialog'

interface PassphraseDialogProps {
  allowRecovery?: boolean
  fileName: string
  mode: 'create' | 'open'
  onCancel(): void
  onSubmit(value: string, factor: 'passphrase' | 'recovery'): void
}

export function PassphraseDialog({
  allowRecovery = true,
  fileName,
  mode,
  onCancel,
  onSubmit,
}: PassphraseDialogProps) {
  const [passphrase, setPassphrase] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const creating = mode === 'create'
  const recovering = !creating && recoveryMode

  const submit = () => {
    if (creating && passphrase.length < 8) {
      setError('Passphrase must be at least 8 characters.')
      return
    }
    if (creating && passphrase !== confirmation) {
      setError('Passphrases do not match.')
      return
    }
    onSubmit(
      recovering ? normalizeRecoveryCode(passphrase) : passphrase,
      recovering ? 'recovery' : 'passphrase',
    )
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
            : recovering
              ? `Enter the recovery code for ${fileName}.`
              : `Enter the passphrase for ${fileName}.`}
        </p>
        <div className="client-fields">
          <label className="form-field">
            <span>{recovering ? 'Recovery code' : 'Passphrase'}</span>
            <input
              aria-describedby="passphrase-error"
              aria-invalid={Boolean(error) || undefined}
              autoComplete={
                creating
                  ? 'new-password'
                  : recovering
                    ? 'one-time-code'
                    : 'current-password'
              }
              autoFocus
              name={recovering ? 'recovery-code' : 'passphrase'}
              type={recovering ? 'text' : 'password'}
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
        {!creating && allowRecovery && !recovering && (
          <button
            className="text-button"
            type="button"
            onClick={() => {
              setPassphrase('')
              setError('')
              setRecoveryMode(true)
            }}
          >
            Use a recovery code instead
          </button>
        )}
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
