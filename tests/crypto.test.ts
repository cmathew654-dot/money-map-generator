import { describe, expect, it } from 'vitest'
import { deriveKey, isEnvelope, newSalt, open, seal } from '../src/model/crypto'

const PLAINTEXT = JSON.stringify({ fileType: 'money-map-book', version: 1, clients: [] })

describe('crypto envelope', () => {
  it('round-trips: seal then open with the same passphrase+salt returns the original JSON', async () => {
    const salt = newSalt()
    const key = await deriveKey('correct horse', salt)
    const envelope = await seal(key, PLAINTEXT, salt)

    const opened = await open(key, envelope)

    expect(opened).toBe(PLAINTEXT)
  })

  it('rejects a wrong passphrase', async () => {
    const salt = newSalt()
    const key = await deriveKey('correct horse', salt)
    const envelope = await seal(key, PLAINTEXT, salt)
    const wrongKey = await deriveKey('wrong horse', salt)

    await expect(open(wrongKey, envelope)).rejects.toThrow()
  })

  it('rejects tampered ciphertext', async () => {
    const salt = newSalt()
    const key = await deriveKey('correct horse', salt)
    const envelope = await seal(key, PLAINTEXT, salt)
    const parsed = JSON.parse(envelope)
    parsed.ct = parsed.ct.slice(0, -4) + (parsed.ct.slice(-4) === 'AAAA' ? 'BBBB' : 'AAAA')

    await expect(open(key, JSON.stringify(parsed))).rejects.toThrow()
  })

  it('produces different envelopes for two seals of identical plaintext', async () => {
    const salt = newSalt()
    const key = await deriveKey('correct horse', salt)

    const envelopeA = await seal(key, PLAINTEXT, salt)
    const envelopeB = await seal(key, PLAINTEXT, salt)

    expect(envelopeA).not.toBe(envelopeB)
  })

  it('isEnvelope distinguishes encrypted envelopes from legacy plaintext book JSON', async () => {
    const salt = newSalt()
    const key = await deriveKey('correct horse', salt)
    const envelope = await seal(key, PLAINTEXT, salt)

    expect(isEnvelope(envelope)).toBe(true)
    expect(isEnvelope(PLAINTEXT)).toBe(false)
  })
})
