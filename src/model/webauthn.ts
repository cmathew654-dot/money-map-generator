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

export async function isPrfAvailable(): Promise<boolean> {
  try {
    if (
      typeof PublicKeyCredential === 'undefined' ||
      typeof navigator === 'undefined' ||
      !navigator.credentials ||
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function' ||
      typeof PublicKeyCredential.getClientCapabilities !== 'function'
    ) return false
    if (!await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) return false
    const capabilities = await PublicKeyCredential.getClientCapabilities()
    return capabilities['extension:prf'] === true
  } catch {
    return false
  }
}

export async function enrollPrf(label: string): Promise<{ credentialId: string; prfSalt: string }> {
  if (!await isPrfAvailable()) {
    throw new Error('Windows Hello WebAuthn PRF is not available in this browser or on this device')
  }

  const prfSalt = crypto.getRandomValues(new Uint8Array(32))
  let created: Credential | null
  try {
    created = await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { id: location.hostname, name: 'Money Map Generator' },
        user: {
          id: crypto.getRandomValues(new Uint8Array(32)),
          name: label,
          displayName: label,
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          residentKey: 'preferred',
          userVerification: 'required',
        },
        attestation: 'none',
        extensions: { prf: { eval: { first: prfSalt } } },
      },
    })
  } catch (cause) {
    throw new Error('Windows Hello PRF enrolment was refused or could not be completed', { cause })
  }

  const credential = created as PublicKeyCredential | null
  if (!credential) throw new Error('Windows Hello PRF enrolment returned no credential')
  if (credential.getClientExtensionResults().prf?.enabled !== true) {
    throw new Error('The new Windows Hello credential does not support the WebAuthn PRF extension')
  }

  return {
    credentialId: toBase64(new Uint8Array(credential.rawId)),
    prfSalt: toBase64(prfSalt),
  }
}

export async function prfOutput(credentialId: string, prfSalt: string): Promise<ArrayBuffer> {
  if (!await isPrfAvailable()) {
    throw new Error('Windows Hello WebAuthn PRF is not available in this browser or on this device')
  }

  let requested: Credential | null
  try {
    requested = await navigator.credentials.get({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rpId: location.hostname,
        allowCredentials: [{ type: 'public-key', id: fromBase64(credentialId) }],
        userVerification: 'required',
        extensions: { prf: { eval: { first: fromBase64(prfSalt) } } },
      },
    })
  } catch (cause) {
    throw new Error('Windows Hello PRF unlock was refused or could not be completed', { cause })
  }

  const credential = requested as PublicKeyCredential | null
  const output = credential?.getClientExtensionResults().prf?.results?.first
  if (!output) throw new Error('Windows Hello did not return a WebAuthn PRF result')
  if (output instanceof ArrayBuffer) return output
  return new Uint8Array(output.buffer, output.byteOffset, output.byteLength).slice().buffer
}
