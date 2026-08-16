import { beforeAll, describe, expect, it } from 'vitest'
import {
  envelopeVersion,
  kekFromPassphrase,
  kekFromPrf,
  kekFromRecoveryCode,
  newDataKey,
  newRecoveryCode,
  newSalt,
  normalizeRecoveryCode,
  openBook,
  readWraps,
  seal,
  sealBook,
  unwrapDataKey,
  wrapDataKey,
} from '../src/model/crypto'

const PLAINTEXT = JSON.stringify({ fileType: 'money-map-book', version: 1, clients: [] })
const PASSPHRASE = 'correct horse battery staple'
const WRONG_PASSPHRASE = 'wrong horse battery staple'
const RECOVERY_CODE = '01234-56789-ABCDE-FGHJK-MNPQR-STVWX-YZ234-56789'
const passphraseSalt = newSalt()
const recoverySalt = newSalt()
const prfOutput = new Uint8Array(32).fill(7).buffer

let passphraseKek: CryptoKey
let wrongPassphraseKek: CryptoKey
let recoveryKek: CryptoKey
let prfKek: CryptoKey

function base64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

beforeAll(async () => {
  const keys = await Promise.all([
    kekFromPassphrase(PASSPHRASE, passphraseSalt),
    kekFromPassphrase(WRONG_PASSPHRASE, passphraseSalt),
    kekFromRecoveryCode(RECOVERY_CODE, recoverySalt),
    kekFromPrf(prfOutput),
  ])
  passphraseKek = keys[0]
  wrongPassphraseKek = keys[1]
  recoveryKek = keys[2]
  prfKek = keys[3]
})

describe('crypto v2 envelope', () => {
  it('seals and opens a book through a DEK', async () => {
    const dek = await newDataKey()
    const envelope = await sealBook(dek, PLAINTEXT, [])

    expect(dek.extractable).toBe(true)
    expect(dek.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 })
    expect(fromBase64(JSON.parse(envelope).iv)).toHaveLength(12)
    expect(await openBook(dek, envelope)).toBe(PLAINTEXT)
  })

  it('unwraps a passphrase-wrapped DEK and opens the same book', async () => {
    const dek = await newDataKey()
    const meta = {
      type: 'passphrase',
      label: 'Passphrase',
      salt: base64(passphraseSalt),
      iter: 600_000,
    } as const
    const wrap = await wrapDataKey(dek, passphraseKek, meta)
    const secondWrap = await wrapDataKey(dek, passphraseKek, meta)
    const envelope = await sealBook(dek, PLAINTEXT, [wrap])
    const unwrapped = await unwrapDataKey(wrap, passphraseKek)

    expect(passphraseKek.extractable).toBe(false)
    expect(passphraseKek.algorithm).toMatchObject({ name: 'AES-GCM', length: 256 })
    expect(wrap).toMatchObject(meta)
    expect(wrap.id).toMatch(/^[0-9a-f]{12}$/)
    expect(fromBase64(wrap.iv)).toHaveLength(12)
    expect(secondWrap.iv).not.toBe(wrap.iv)
    expect(secondWrap.ek).not.toBe(wrap.ek)
    expect(unwrapped.extractable).toBe(true)
    expect(await openBook(unwrapped, envelope)).toBe(PLAINTEXT)
  })

  it('opens one book independently through passphrase and recovery wraps', async () => {
    const dek = await newDataKey()
    const [passphraseWrap, recoveryWrap] = await Promise.all([
      wrapDataKey(dek, passphraseKek, {
        type: 'passphrase',
        label: 'Passphrase',
        salt: base64(passphraseSalt),
        iter: 600_000,
      }),
      wrapDataKey(dek, recoveryKek, {
        type: 'recovery',
        label: 'Recovery code',
        salt: base64(recoverySalt),
      }),
    ])
    const envelope = await sealBook(dek, PLAINTEXT, [passphraseWrap, recoveryWrap])
    const storedWraps = readWraps(envelope)
    const storedPassphrase = storedWraps.find((wrap) => wrap.type === 'passphrase')
    const storedRecovery = storedWraps.find((wrap) => wrap.type === 'recovery')
    expect(storedPassphrase).toMatchObject({ salt: base64(passphraseSalt), iter: 600_000 })
    expect(storedRecovery).toMatchObject({ salt: base64(recoverySalt) })

    const [reopenedPassphraseKek, reopenedRecoveryKek] = await Promise.all([
      kekFromPassphrase(
        PASSPHRASE,
        fromBase64(storedPassphrase!.salt!),
        storedPassphrase!.iter,
      ),
      kekFromRecoveryCode(RECOVERY_CODE, fromBase64(storedRecovery!.salt!)),
    ])

    const viaRecovery = await openBook(
      await unwrapDataKey(storedRecovery!, reopenedRecoveryKek),
      envelope,
    )
    const viaPassphrase = await openBook(
      await unwrapDataKey(storedPassphrase!, reopenedPassphraseKek),
      envelope,
    )

    expect(recoveryKek.extractable).toBe(false)
    expect(storedWraps).toHaveLength(2)
    expect(viaRecovery).toBe(PLAINTEXT)
    expect(viaPassphrase).toBe(viaRecovery)
  })

  it('rejects a wrong passphrase without corrupting the envelope', async () => {
    const dek = await newDataKey()
    const wrap = await wrapDataKey(dek, passphraseKek, {
      type: 'passphrase',
      label: 'Passphrase',
      salt: base64(passphraseSalt),
      iter: 600_000,
    })
    const envelope = await sealBook(dek, PLAINTEXT, [wrap])
    const originalEnvelope = envelope

    await expect(unwrapDataKey(wrap, wrongPassphraseKek)).rejects.toThrow()
    expect(envelope).toBe(originalEnvelope)
    expect(await openBook(dek, envelope)).toBe(PLAINTEXT)
  })

  it('rejects excessive passphrase iterations before deriving', async () => {
    await expect(kekFromPassphrase(PASSPHRASE, passphraseSalt, 1_000_001)).rejects.toThrow(
      RangeError,
    )
  })

  it('uses a fresh IV for every seal', async () => {
    const dek = await newDataKey()

    const envelopeA = await sealBook(dek, PLAINTEXT, [])
    const envelopeB = await sealBook(dek, PLAINTEXT, [])

    expect(envelopeA).not.toBe(envelopeB)
    expect(JSON.parse(envelopeA).iv).not.toBe(JSON.parse(envelopeB).iv)
  })

  it('creates distinct recovery codes as eight unambiguous groups of five', () => {
    const codeA = newRecoveryCode()
    const codeB = newRecoveryCode()

    expect(codeA).toMatch(/^(?:[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{5}-){7}[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{5}$/)
    expect(codeB).not.toBe(codeA)
  })

  it('normalizes case, separators, and classic character confusions', () => {
    expect(normalizeRecoveryCode('abcd 011 xyz')).toBe('ABCD011XYZ')
    expect(normalizeRecoveryCode('ABCD-OIL-XYZ')).toBe('ABCD011XYZ')
  })

  it('reports v2, v1, and plaintext envelope versions', async () => {
    const dek = await newDataKey()
    const v2 = await sealBook(dek, PLAINTEXT, [])
    const v1 = await seal(dek, PLAINTEXT, passphraseSalt)
    const malformedV2 = JSON.stringify({ v: 2, iv: '', ct: '', wraps: [null] })
    const excessiveIterations = JSON.stringify({
      v: 2,
      iv: '',
      ct: '',
      wraps: [
        {
          id: '000000000000',
          type: 'passphrase',
          label: 'Passphrase',
          iv: '',
          ek: '',
          iter: 1_000_001,
        },
      ],
    })

    expect(envelopeVersion(v2)).toBe(2)
    expect(envelopeVersion(v1)).toBe(1)
    expect(envelopeVersion(PLAINTEXT)).toBeNull()
    expect(envelopeVersion(malformedV2)).toBeNull()
    expect(envelopeVersion(excessiveIterations)).toBeNull()
    expect(readWraps(v1)).toEqual([])
    expect(readWraps(PLAINTEXT)).toEqual([])
    expect(readWraps(malformedV2)).toEqual([])
    expect(readWraps(excessiveIterations)).toEqual([])
  })

  it('unwraps a PRF-wrapped DEK and opens the same book', async () => {
    const dek = await newDataKey()
    const wrap = await wrapDataKey(dek, prfKek, {
      type: 'webauthn',
      label: 'Windows Hello',
      credentialId: base64(new Uint8Array([1, 2, 3])),
      prfSalt: base64(new Uint8Array([4, 5, 6])),
    })
    const envelope = await sealBook(dek, PLAINTEXT, [wrap])
    const unwrapped = await unwrapDataKey(wrap, prfKek)

    expect(prfKek.extractable).toBe(false)
    expect(await openBook(unwrapped, envelope)).toBe(PLAINTEXT)
  })
})
