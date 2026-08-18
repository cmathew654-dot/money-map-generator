import { useState, type FormEvent } from 'react'
import { normalizeRecoveryCode } from '../model/crypto'
import { validateOfficePassword } from '../model/officeKey'
import { Dialog } from './Dialog'

interface PassphraseDialogProps {
  allowRecovery?: boolean
  fileName?: string
  mode: 'create' | 'open'
  scope?: 'file' | 'office'
  onCancel(): void
  onSubmit(value: string, factor: 'passphrase' | 'recovery'): void
}

interface SubmissionInput {
  creating: boolean
  office: boolean
  recovering: boolean
  passphrase: string
  confirmation: string
}

/**
 * Pure submit decision, exported so it can be tested directly: this app's
 * vitest suite has no DOM (no jsdom/testing-library), so hook components are
 * verified by rendering their markup with renderToStaticMarkup and by testing
 * their decision logic as a plain function, not by simulating clicks/submits.
 */
export function resolvePassphraseSubmission({
  creating,
  office,
  recovering,
  passphrase,
  confirmation,
}: SubmissionInput):
  | { error: string }
  | { value: string; factor: 'passphrase' | 'recovery' } {
  if (creating) {
    const lengthError = office
      ? validateOfficePassword(passphrase)
      : passphrase.length < 8
        ? 'Password must be at least 8 characters.'
        : null
    if (lengthError) return { error: lengthError }
    if (passphrase !== confirmation) return { error: 'Passwords do not match.' }
  }
  return {
    value: recovering ? normalizeRecoveryCode(passphrase) : passphrase,
    factor: recovering ? 'recovery' : 'passphrase',
  }
}

export function PassphraseDialog({
  allowRecovery = true,
  fileName,
  mode,
  scope = 'file',
  onCancel,
  onSubmit,
}: PassphraseDialogProps) {
  const [passphrase, setPassphrase] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [recoveryMode, setRecoveryMode] = useState(false)
  const creating = mode === 'create'
  const recovering = !creating && recoveryMode
  const office = scope === 'office'

  const submit = () => {
    const result = resolvePassphraseSubmission({
      creating,
      office,
      recovering,
      passphrase,
      confirmation,
    })
    if ('error' in result) {
      setError(result.error)
      return
    }
    onSubmit(result.value, result.factor)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    submit()
  }

  const title = office
    ? creating
      ? 'Create your office password'
      : 'Enter your office password'
    : creating
      ? 'Create a file password'
      : 'Open encrypted file'

  const confirmLabel = office
    ? creating
      ? 'Continue'
      : 'Unlock'
    : creating
      ? 'Encrypt and save'
      : 'Open file'

  const caption = office
    ? creating
      ? "This password protects every client book in your office. On the next step you'll get a recovery code — save it, because it's the only way back in if you ever forget this password."
      : recovering
        ? 'Enter your office recovery code.'
        : 'Enter your office password.'
    : creating
      ? `This password locks ${fileName}. You'll get a recovery code on the next step — save it, because there is no other way back in.`
      : recovering
        ? `Enter the recovery code for ${fileName}.`
        : `Enter the password for ${fileName}.`

  return (
    <Dialog
      confirmLabel={confirmLabel}
      open
      title={title}
      onClose={onCancel}
      onConfirm={submit}
    >
      <form onSubmit={handleSubmit}>
        <p className="form-caption">{caption}</p>
        <div className="client-fields">
          <label className="form-field">
            <span>{recovering ? 'Recovery code' : 'Password'}</span>
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
              <span>Confirm password</span>
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
