import { describe, expect, it } from 'vitest'
import {
  kekFromPassphrase,
  newDataKey,
  newSalt,
  openBook,
  sealBook,
  unwrapDataKey,
  wrapDataKey,
  type Wrap,
} from '../src/model/crypto'
import {
  officeWraps,
  resolveOfficeDataKey,
  setupOfficePassword,
  unlockOfficeWithPassword,
  unlockOfficeWithRecoveryCode,
} from '../src/model/officeKey'
import { readCachedOfficeKek } from '../src/model/officeKeyCache'

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

/**
 * Builds an office-wrapped envelope WITHOUT going through setupOfficePassword,
 * so nothing is cached under this wrap's salt — simulating a book that
 * arrives (email/Teams) on a machine that has never seen this office.
 */
async function buildUncachedOfficeEnvelope(password: string, book: string) {
  const salt = newSalt()
  const kek = await kekFromPassphrase(password, salt, 600_000)
  const dek = await newDataKey()
  const wrap: Wrap = await wrapDataKey(dek, kek, {
    type: 'passphrase',
    label: 'Office password',
    salt: bytesToBase64(salt),
    iter: 600_000,
  })
  const envelope = await sealBook(dek, book, [wrap])
  return { envelope, wrap }
}

describe('office key: portable unlock paths', () => {
  it('unlocks by typed password on an empty cache, then is silent on the next open (KEY-04)', async () => {
    const password = 'a-strong-12-plus-office-pw'
    const { envelope } = await buildUncachedOfficeEnvelope(password, 'book payload')

    const unlockedDek = await unlockOfficeWithPassword(envelope, password)
    expect(unlockedDek).not.toBeNull()
    expect(await openBook(unlockedDek!, envelope)).toBe('book payload')

    const silentDek = await resolveOfficeDataKey(envelope)
    expect(silentDek).not.toBeNull()
    expect(await openBook(silentDek!, envelope)).toBe('book payload')
  })

  it('returns null on a wrong password, writes nothing to the cache, leaves the envelope untouched', async () => {
    const { envelope, wrap } = await buildUncachedOfficeEnvelope(
      'the-correct-12-plus-password',
      'untouched payload',
    )
    const before = envelope

    const result = await unlockOfficeWithPassword(envelope, 'wrong-but-long-enough-password')

    expect(result).toBeNull()
    expect(envelope).toBe(before)
    expect(await readCachedOfficeKek(wrap.salt!)).toBeNull()
  })

  it('rejects a short password before any derivation is attempted', async () => {
    await expect(unlockOfficeWithPassword('{}', 'short')).rejects.toThrow()
  })

  it('unlocks by recovery code on a completely empty cache, and leaves the cache empty afterward', async () => {
    const setup = await setupOfficePassword('recovery-path-12-plus-password')
    const dek = await newDataKey()
    const wraps = await officeWraps(dek, setup.office, setup.recovery)
    const envelope = await sealBook(dek, 'recovery payload', wraps)
    const recoveryWrap = wraps.find((wrap) => wrap.type === 'recovery')!

    expect(await readCachedOfficeKek(recoveryWrap.salt!)).toBeNull()

    const recoveredDek = await unlockOfficeWithRecoveryCode(envelope, setup.recoveryCode)

    expect(recoveredDek).not.toBeNull()
    expect(await openBook(recoveredDek!, envelope)).toBe('recovery payload')
    expect(await readCachedOfficeKek(recoveryWrap.salt!)).toBeNull()
  })

  it('accepts the recovery code lowercase with hyphens stripped', async () => {
    const setup = await setupOfficePassword('lowercase-recovery-12-plus-pw')
    const dek = await newDataKey()
    const wraps = await officeWraps(dek, setup.office, setup.recovery)
    const envelope = await sealBook(dek, 'messy code payload', wraps)

    const messyCode = setup.recoveryCode.toLowerCase().replace(/-/g, '')
    const recoveredDek = await unlockOfficeWithRecoveryCode(envelope, messyCode)

    expect(recoveredDek).not.toBeNull()
    expect(await openBook(recoveredDek!, envelope)).toBe('messy code payload')
  })

  it('unlocks a book carrying both a legacy per-book wrap and an office wrap by office password, leaving the legacy wrap independently usable', async () => {
    const officePassword = 'office-password-12-plus-chars'
    const legacyPassphrase = 'legacy-book-only-passphrase'

    const legacySalt = newSalt()
    const legacyKek = await kekFromPassphrase(legacyPassphrase, legacySalt, 600_000)
    const dek = await newDataKey()
    const legacyWrap: Wrap = await wrapDataKey(dek, legacyKek, {
      type: 'passphrase',
      label: 'Passphrase',
      salt: bytesToBase64(legacySalt),
      iter: 600_000,
    })

    const officeSalt = newSalt()
    const officeKek = await kekFromPassphrase(officePassword, officeSalt, 600_000)
    const officeWrap: Wrap = await wrapDataKey(dek, officeKek, {
      type: 'passphrase',
      label: 'Office password',
      salt: bytesToBase64(officeSalt),
      iter: 600_000,
    })

    const envelope = await sealBook(dek, 'mixed wrap payload', [legacyWrap, officeWrap])

    const officeUnlocked = await unlockOfficeWithPassword(envelope, officePassword)
    expect(officeUnlocked).not.toBeNull()
    expect(await openBook(officeUnlocked!, envelope)).toBe('mixed wrap payload')

    const legacyUnwrapped = await unwrapDataKey(legacyWrap, legacyKek)
    expect(await openBook(legacyUnwrapped, envelope)).toBe('mixed wrap payload')
  })
})
