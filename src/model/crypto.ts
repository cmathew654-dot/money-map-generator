/** AES-256-GCM envelope for the client book JSON. WebCrypto only, no deps. */

const KDF_ITERATIONS = 600_000
const MAX_KDF_ITERATIONS = 1_000_000
const HKDF_INFO = new TextEncoder().encode('money-map KEK v2')
const RECOVERY_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

interface Envelope {
  v: 1
  kdf: 'PBKDF2-SHA256'
  iter: number
  salt: string
  iv: string
  ct: string
}

export interface Wrap {
  id: string
  type: 'passphrase' | 'recovery' | 'webauthn'
  label: string
  iv: string
  ek: string
  salt?: string
  iter?: number
  credentialId?: string
  prfSalt?: string
}

interface EnvelopeV2 {
  v: 2
  iv: string
  ct: string
  wraps: Wrap[]
}

function isWrap(value: unknown): value is Wrap {
  if (value === null || typeof value !== 'object') return false
  const wrap = value as Record<string, unknown>
  return (
    typeof wrap.id === 'string' &&
    (wrap.type === 'passphrase' || wrap.type === 'recovery' || wrap.type === 'webauthn') &&
    typeof wrap.label === 'string' &&
    typeof wrap.iv === 'string' &&
    typeof wrap.ek === 'string' &&
    (wrap.salt === undefined || typeof wrap.salt === 'string') &&
    (wrap.iter === undefined ||
      (typeof wrap.iter === 'number' &&
        Number.isSafeInteger(wrap.iter) &&
        wrap.iter > 0 &&
        wrap.iter <= MAX_KDF_ITERATIONS)) &&
    (wrap.credentialId === undefined || typeof wrap.credentialId === 'string') &&
    (wrap.prfSalt === undefined || typeof wrap.prfSalt === 'string')
  )
}

function isEnvelopeV2(value: unknown): value is EnvelopeV2 {
  if (value === null || typeof value !== 'object') return false
  const envelope = value as Record<string, unknown>
  return (
    envelope.v === 2 &&
    typeof envelope.iv === 'string' &&
    typeof envelope.ct === 'string' &&
    Array.isArray(envelope.wraps) &&
    envelope.wraps.every(isWrap)
  )
}

async function derivePassphraseKey(
  passphrase: string,
  salt: Uint8Array,
  iterations: number,
  usages: KeyUsage[],
): Promise<CryptoKey> {
  if (
    !Number.isSafeInteger(iterations) ||
    iterations < 1 ||
    iterations > MAX_KDF_ITERATIONS
  )
    throw new RangeError(`PBKDF2 iterations must be between 1 and ${MAX_KDF_ITERATIONS}`)

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    usages,
  )
}

async function deriveHkdfKey(secret: Uint8Array, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey('raw', secret, 'HKDF', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt, info: HKDF_INFO },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['wrapKey', 'unwrapKey'],
  )
}

export function newSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  return derivePassphraseKey(passphrase, salt, KDF_ITERATIONS, ['encrypt', 'decrypt'])
}

export async function seal(key: CryptoKey, plaintext: string, salt: Uint8Array): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  )
  const envelope: Envelope = {
    v: 1,
    kdf: 'PBKDF2-SHA256',
    iter: KDF_ITERATIONS,
    salt: toBase64(salt),
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(ct)),
  }
  return JSON.stringify(envelope)
}

export async function open(key: CryptoKey, envelope: string): Promise<string> {
  const parsed: Envelope = JSON.parse(envelope)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(parsed.iv) },
    key,
    fromBase64(parsed.ct),
  )
  return new TextDecoder().decode(plaintext)
}

export function isEnvelope(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw)
    return parsed?.v === 1 && parsed?.kdf === 'PBKDF2-SHA256' && typeof parsed?.ct === 'string'
  } catch {
    return false
  }
}

export function saltFromEnvelope(envelope: string): Uint8Array {
  const parsed: Envelope = JSON.parse(envelope)
  return fromBase64(parsed.salt)
}

export function envelopeVersion(raw: string): 1 | 2 | null {
  try {
    const parsed = JSON.parse(raw)
    if (parsed?.v === 1 && parsed?.kdf === 'PBKDF2-SHA256' && typeof parsed?.ct === 'string')
      return 1
    return isEnvelopeV2(parsed) ? 2 : null
  } catch {
    return null
  }
}

export async function newDataKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ])
}

export async function sealBook(
  dek: CryptoKey,
  plaintext: string,
  wraps: Wrap[],
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    dek,
    new TextEncoder().encode(plaintext),
  )
  const envelope: EnvelopeV2 = {
    v: 2,
    iv: toBase64(iv),
    ct: toBase64(new Uint8Array(ct)),
    wraps,
  }
  return JSON.stringify(envelope)
}

export async function openBook(dek: CryptoKey, envelope: string): Promise<string> {
  const parsed: EnvelopeV2 = JSON.parse(envelope)
  if (parsed.v !== 2) throw new Error('Not a v2 envelope')
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(parsed.iv) },
    dek,
    fromBase64(parsed.ct),
  )
  return new TextDecoder().decode(plaintext)
}

export function readWraps(envelope: string): Wrap[] {
  try {
    const parsed = JSON.parse(envelope)
    return isEnvelopeV2(parsed) ? parsed.wraps : []
  } catch {
    return []
  }
}

export async function kekFromPassphrase(
  passphrase: string,
  salt: Uint8Array,
  iter = KDF_ITERATIONS,
): Promise<CryptoKey> {
  return derivePassphraseKey(passphrase, salt, iter, ['wrapKey', 'unwrapKey'])
}

export async function kekFromRecoveryCode(code: string, salt: Uint8Array): Promise<CryptoKey> {
  return deriveHkdfKey(new TextEncoder().encode(normalizeRecoveryCode(code)), salt)
}

export async function kekFromPrf(prfOutput: ArrayBuffer): Promise<CryptoKey> {
  return deriveHkdfKey(new Uint8Array(prfOutput), new Uint8Array())
}

export async function wrapDataKey(
  dek: CryptoKey,
  kek: CryptoKey,
  meta: Omit<Wrap, 'id' | 'iv' | 'ek'>,
): Promise<Wrap> {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const id = Array.from(crypto.getRandomValues(new Uint8Array(6)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
  const encryptedKey = await crypto.subtle.wrapKey('raw', dek, kek, { name: 'AES-GCM', iv })
  return { ...meta, id, iv: toBase64(iv), ek: toBase64(new Uint8Array(encryptedKey)) }
}

export async function unwrapDataKey(wrap: Wrap, kek: CryptoKey): Promise<CryptoKey> {
  return crypto.subtle.unwrapKey(
    'raw',
    fromBase64(wrap.ek),
    kek,
    { name: 'AES-GCM', iv: fromBase64(wrap.iv) },
    'AES-GCM',
    true,
    ['encrypt', 'decrypt'],
  )
}

export function newRecoveryCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20))
  const code = Array.from(
    bytes,
    (byte) => RECOVERY_ALPHABET[byte >>> 3] + RECOVERY_ALPHABET[byte & 31],
  ).join('')
  return code.match(/.{5}/g)!.join('-')
}

export function normalizeRecoveryCode(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1')
}
