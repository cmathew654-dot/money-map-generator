/** AES-256-GCM envelope for the client book JSON. WebCrypto only, no deps. */

const KDF_ITERATIONS = 600_000

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

export function newSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16))
}

export async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: KDF_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
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
