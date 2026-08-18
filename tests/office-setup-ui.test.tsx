import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import {
  PassphraseDialog,
  resolvePassphraseSubmission,
} from '../src/ui/PassphraseDialog'

const FILE_NAME = 'Morgan-family.moneymap'

function renderDialog(overrides: Partial<Parameters<typeof PassphraseDialog>[0]> = {}) {
  return renderToStaticMarkup(
    createElement(PassphraseDialog, {
      mode: 'create',
      fileName: FILE_NAME,
      onCancel: () => undefined,
      onSubmit: () => undefined,
      ...overrides,
    }),
  )
}

describe('office scope markup', () => {
  it('asks for an office password and its confirmation with office-wide copy', () => {
    const markup = renderDialog({ scope: 'office', mode: 'create' })

    expect(markup).toContain('office password')
    expect(markup).toContain('every client book in your office')
    expect(markup).toContain('name="passphrase"')
    expect(markup).toContain('name="passphrase-confirmation"')
  })

  it('contains no file name and no fingerprint/PIN/biometric affordance', () => {
    const markup = renderDialog({ scope: 'office', mode: 'create' })

    expect(markup).not.toContain(FILE_NAME)
    expect(markup).not.toMatch(/fingerprint|biometric|windows hello|\bPIN\b/i)
  })

  it('renders both password inputs obscured in office scope', () => {
    const markup = renderDialog({ scope: 'office', mode: 'create' })

    expect(markup.match(/type="password"/g)?.length).toBe(2)
  })

  it('renders the default (file) scope byte-for-byte unchanged', () => {
    const markup = renderDialog({ mode: 'create' })

    expect(markup).toContain('Create a file password')
    expect(markup).toContain(`This password locks ${FILE_NAME}.`)
    expect(markup.match(/type="password"/g)?.length).toBe(2)
  })
})

describe('resolvePassphraseSubmission (office scope policy)', () => {
  it('refuses an 11-character office password with the shared policy message', () => {
    const onSubmit = vi.fn()
    const result = resolvePassphraseSubmission({
      creating: true,
      office: true,
      recovering: false,
      passphrase: '11characrs.',
      confirmation: '11characrs.',
    })

    expect('error' in result).toBe(true)
    expect((result as { error: string }).error).toMatch(/at least 12 characters/)
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('refuses a mismatched confirmation for a 12+ character office password', () => {
    const result = resolvePassphraseSubmission({
      creating: true,
      office: true,
      recovering: false,
      passphrase: 'twelve-chars',
      confirmation: 'different-one',
    })

    expect('error' in result).toBe(true)
    expect((result as { error: string }).error).toBe('Passwords do not match.')
  })

  it('accepts a valid, matching office password and returns the passphrase factor', () => {
    const result = resolvePassphraseSubmission({
      creating: true,
      office: true,
      recovering: false,
      passphrase: 'twelve-chars',
      confirmation: 'twelve-chars',
    })

    expect(result).toEqual({ value: 'twelve-chars', factor: 'passphrase' })
  })

  it('leaves the file-scope 8-character rule untouched', () => {
    const short = resolvePassphraseSubmission({
      creating: true,
      office: false,
      recovering: false,
      passphrase: 'short7c',
      confirmation: 'short7c',
    })
    expect((short as { error: string }).error).toBe(
      'Password must be at least 8 characters.',
    )

    const ok = resolvePassphraseSubmission({
      creating: true,
      office: false,
      recovering: false,
      passphrase: 'eightchr',
      confirmation: 'eightchr',
    })
    expect(ok).toEqual({ value: 'eightchr', factor: 'passphrase' })
  })
})
