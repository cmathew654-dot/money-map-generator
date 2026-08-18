import { describe, expect, it } from 'vitest'
import {
  kekFromPassphrase,
  kekFromRecoveryCode,
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
  readOfficeIdentity,
  resolveOfficeDataKey,
  setupOfficePassword,
} from '../src/model/officeKey'
import { readCachedOfficeKek } from '../src/model/officeKeyCache'

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function bytesFromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

describe('office key: setup, seal, silent reopen', () => {
  it('derives a non-extractable office KEK from a policy-satisfying password', async () => {
    const setup = await setupOfficePassword('a-12-plus-character-password')
    expect(setup.office.kek.extractable).toBe(false)
  })

  it('rejects a password under the policy floor before any derivation', async () => {
    await expect(setupOfficePassword('short')).rejects.toThrow()
  })

  it('seals a book with office wraps and reopens it with no password anywhere in the call', async () => {
    const setup = await setupOfficePassword('a-different-12-plus-password')
    const dek = await newDataKey()
    const wraps = await officeWraps(dek, setup.office, setup.recovery)
    const book = JSON.stringify({ hello: 'client book' })

    const envelope = await sealBook(dek, book, wraps)
    const resolvedDek = await resolveOfficeDataKey(envelope)

    expect(resolvedDek).not.toBeNull()
    expect(await openBook(resolvedDek!, envelope)).toBe(book)
  })

  it('returns exactly two wraps — passphrase and recovery — no fourth wrap type', async () => {
    const setup = await setupOfficePassword('yet-another-12-plus-password')
    const dek = await newDataKey()
    const wraps = await officeWraps(dek, setup.office, setup.recovery)

    expect(wraps).toHaveLength(2)
    expect(wraps[0].type).toBe('passphrase')
    expect(wraps[0].salt).toBe(setup.office.saltBase64)
    expect(wraps[0].iter).toBe(setup.office.iter)
    expect(wraps[1].type).toBe('recovery')
  })

  it('returns only the office password wrap when recovery material is null', async () => {
    const setup = await setupOfficePassword('twelve-plus-chars-no-recovery')
    const dek = await newDataKey()
    const wraps = await officeWraps(dek, setup.office, null)

    expect(wraps).toHaveLength(1)
    expect(wraps[0].type).toBe('passphrase')
  })

  it('resolves to null for an office salt this machine has never cached', async () => {
    const salt = newSalt()
    const kek = await kekFromPassphrase('some-other-offices-password', salt)
    const dek = await newDataKey()
    const wrap: Wrap = await wrapDataKey(dek, kek, {
      type: 'passphrase',
      label: 'Office password',
      salt: bytesToBase64(salt),
      iter: 600_000,
    })
    const envelope = await sealBook(dek, 'irrelevant payload', [wrap])

    await expect(resolveOfficeDataKey(envelope)).resolves.toBeNull()
  })

  it('readCachedOfficeKek on an empty store resolves to null and never manufactures a key', async () => {
    const salt = newSalt()
    const saltBase64 = bytesToBase64(salt)

    expect(await readCachedOfficeKek(saltBase64)).toBeNull()
    expect(await readCachedOfficeKek(saltBase64)).toBeNull()
  })

  it('caches the recovery KEK at setup, so a later officeWraps call still produces a recovery wrap the original code unlocks', async () => {
    const setup = await setupOfficePassword('recovery-caching-12-plus-pw')
    const identity = await readOfficeIdentity()

    expect(identity).not.toBeNull()
    expect(identity!.kek.extractable).toBe(false)
    expect(identity!.recovery).not.toBeNull()

    const dek = await newDataKey()
    const wraps = await officeWraps(dek, identity!, identity!.recovery)
    const envelope = await sealBook(dek, 'book two', wraps)
    const recoveryWrap = wraps.find((wrap) => wrap.type === 'recovery')!

    const recoveryKek = await kekFromRecoveryCode(setup.recoveryCode, bytesFromBase64(recoveryWrap.salt!))
    const recoveredDek = await unwrapDataKey(recoveryWrap, recoveryKek)

    expect(await openBook(recoveredDek, envelope)).toBe('book two')
  })
})
