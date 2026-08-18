/**
 * Office-key model layer: one office password derives one non-extractable
 * KEK, cached per machine, used to wrap/unwrap any book's DEK. Composes
 * existing crypto.ts primitives only — no new cryptography, no new Wrap
 * type. Pure async functions, no React/DOM (RESEARCH.md Open Question 2).
 */

import {
  kekFromPassphrase,
  kekFromRecoveryCode,
  newRecoveryCode,
  newSalt,
  readWraps,
  unwrapDataKey,
  wrapDataKey,
  type Wrap,
} from './crypto'
import {
  cacheOfficeKek,
  cacheOfficeRecovery,
  readCachedOfficeKek,
  readCachedOfficeRecovery,
  readCurrentOfficeSalt,
  setCurrentOfficeSalt,
  type CachedOfficeRecovery,
} from './officeKeyCache'

export const MIN_OFFICE_PASSWORD_LENGTH = 12
export const OFFICE_PASSPHRASE_LABEL = 'Office password'
export const OFFICE_RECOVERY_LABEL = 'Office recovery code'
export const OFFICE_KDF_ITERATIONS = 600_000

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
}

function bytesFromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

export interface OfficeCredential {
  saltBase64: string
  kek: CryptoKey
  iter: number
}

export interface OfficeIdentity extends OfficeCredential {
  recovery: CachedOfficeRecovery | null
}

export interface OfficeSetupResult {
  office: OfficeCredential
  recovery: CachedOfficeRecovery
  recoveryCode: string
}

export function validateOfficePassword(password: string): string | null {
  if (!password || password.length < MIN_OFFICE_PASSWORD_LENGTH)
    return `Office password must be at least ${MIN_OFFICE_PASSWORD_LENGTH} characters.`
  return null
}

export async function setupOfficePassword(password: string): Promise<OfficeSetupResult> {
  const validationError = validateOfficePassword(password)
  if (validationError) throw new Error(validationError)

  const salt = newSalt()
  const saltBase64 = bytesToBase64(salt)
  const kek = await kekFromPassphrase(password, salt, OFFICE_KDF_ITERATIONS)
  await cacheOfficeKek(saltBase64, kek)
  await setCurrentOfficeSalt(saltBase64)

  const recoveryCode = newRecoveryCode()
  const recoverySalt = newSalt()
  const recovery: CachedOfficeRecovery = {
    saltBase64: bytesToBase64(recoverySalt),
    kek: await kekFromRecoveryCode(recoveryCode, recoverySalt),
  }
  await cacheOfficeRecovery(saltBase64, recovery)

  return { office: { saltBase64, kek, iter: OFFICE_KDF_ITERATIONS }, recovery, recoveryCode }
}

export async function officeWraps(
  dek: CryptoKey,
  office: OfficeCredential,
  recovery: CachedOfficeRecovery | null,
): Promise<Wrap[]> {
  const wraps: Wrap[] = [
    await wrapDataKey(dek, office.kek, {
      type: 'passphrase',
      label: OFFICE_PASSPHRASE_LABEL,
      salt: office.saltBase64,
      iter: office.iter,
    }),
  ]
  if (recovery) {
    wraps.push(
      await wrapDataKey(dek, recovery.kek, {
        type: 'recovery',
        label: OFFICE_RECOVERY_LABEL,
        salt: recovery.saltBase64,
      }),
    )
  }
  return wraps
}

export function officeWrapsOf(wraps: Wrap[]): Wrap[] {
  return wraps.filter(
    (wrap) => wrap.type === 'passphrase' && wrap.label === OFFICE_PASSPHRASE_LABEL && wrap.salt,
  )
}

function officeRecoveryWrapsOf(wraps: Wrap[]): Wrap[] {
  return wraps.filter(
    (wrap) => wrap.type === 'recovery' && wrap.label === OFFICE_RECOVERY_LABEL && wrap.salt,
  )
}

export async function readOfficeIdentity(): Promise<OfficeIdentity | null> {
  const saltBase64 = await readCurrentOfficeSalt()
  if (!saltBase64) return null
  const kek = await readCachedOfficeKek(saltBase64)
  if (!kek) return null
  const recovery = await readCachedOfficeRecovery(saltBase64)
  return { saltBase64, kek, iter: OFFICE_KDF_ITERATIONS, recovery }
}

/** The silent path: never prompts, never derives, never throws on a wrong key. */
export async function resolveOfficeDataKey(envelope: string): Promise<CryptoKey | null> {
  for (const wrap of officeWrapsOf(readWraps(envelope))) {
    const kek = await readCachedOfficeKek(wrap.salt!)
    if (!kek) continue
    try {
      return await unwrapDataKey(wrap, kek)
    } catch {
      // Wrong key for this wrap's salt (shouldn't happen on an exact-match
      // lookup, but a wrong-key GCM failure is the established signal) — continue.
    }
  }
  return null
}

/** Typed office password on any machine. Caches on success so the next open is silent (KEY-04). */
export async function unlockOfficeWithPassword(
  envelope: string,
  password: string,
): Promise<CryptoKey | null> {
  const validationError = validateOfficePassword(password)
  if (validationError) throw new Error(validationError)

  for (const wrap of officeWrapsOf(readWraps(envelope))) {
    try {
      const kek = await kekFromPassphrase(password, bytesFromBase64(wrap.salt!), wrap.iter)
      const dek = await unwrapDataKey(wrap, kek)
      await cacheOfficeKek(wrap.salt!, kek)
      await setCurrentOfficeSalt(wrap.salt!)
      return dek
    } catch {
      // Wrong password for this wrap — try the next candidate.
    }
  }
  return null
}

/** Printed recovery code. Deliberately never reads or writes the machine cache (RESEARCH.md Pitfall 3). */
export async function unlockOfficeWithRecoveryCode(
  envelope: string,
  code: string,
): Promise<CryptoKey | null> {
  for (const wrap of officeRecoveryWrapsOf(readWraps(envelope))) {
    try {
      const kek = await kekFromRecoveryCode(code, bytesFromBase64(wrap.salt!))
      return await unwrapDataKey(wrap, kek)
    } catch {
      // Wrong code for this wrap — try the next candidate.
    }
  }
  return null
}
