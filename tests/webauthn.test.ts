import { afterEach, describe, expect, it, vi } from 'vitest'
import { enrollPrf, isPrfAvailable, prfOutput } from '../src/model/webauthn'

afterEach(() => vi.unstubAllGlobals())

function stubPrfSupport(uvpaa = true, prf = true) {
  vi.stubGlobal('PublicKeyCredential', {
    isUserVerifyingPlatformAuthenticatorAvailable: vi.fn().mockResolvedValue(uvpaa),
    getClientCapabilities: vi.fn().mockResolvedValue({ 'extension:prf': prf }),
  })
}

describe('WebAuthn PRF', () => {
  it('returns false without throwing when PublicKeyCredential is absent', async () => {
    vi.stubGlobal('PublicKeyCredential', undefined)

    await expect(isPrfAvailable()).resolves.toBe(false)
  })

  it('returns false when no user-verifying platform authenticator is available', async () => {
    vi.stubGlobal('navigator', { credentials: {} })
    stubPrfSupport(false)

    await expect(isPrfAvailable()).resolves.toBe(false)
  })

  it('returns false when the browser does not report PRF support', async () => {
    vi.stubGlobal('navigator', { credentials: {} })
    stubPrfSupport(true, false)

    await expect(isPrfAvailable()).resolves.toBe(false)
  })

  it('returns true when the platform authenticator and PRF are available', async () => {
    vi.stubGlobal('navigator', { credentials: {} })
    stubPrfSupport()

    await expect(isPrfAvailable()).resolves.toBe(true)
  })

  it('enrols with required user verification and the PRF extension', async () => {
    const create = vi
      .fn<(options?: CredentialCreationOptions) => Promise<Credential | null>>()
      .mockResolvedValue({
        rawId: new Uint8Array([1, 2, 3]).buffer,
        getClientExtensionResults: () => ({ prf: { enabled: true } }),
      } as unknown as Credential)
    vi.stubGlobal('navigator', { credentials: { create } })
    vi.stubGlobal('location', { hostname: 'localhost' })
    stubPrfSupport()

    const enrolled = await enrollPrf('Advisor client book')
    const publicKey = create.mock.calls[0][0]!.publicKey!

    expect(publicKey.rp.id).toBe('localhost')
    expect(publicKey.authenticatorSelection).toMatchObject({
      authenticatorAttachment: 'platform',
      residentKey: 'preferred',
      userVerification: 'required',
    })
    expect(publicKey.extensions?.prf?.eval?.first).toBeInstanceOf(Uint8Array)
    expect(enrolled.credentialId).toBe('AQID')
    expect(atob(enrolled.prfSalt)).toHaveLength(32)
  })

  it('pins the assertion to the credential and evaluates the decoded PRF salt', async () => {
    const output = new Uint8Array(32).fill(42).buffer
    const get = vi
      .fn<(options?: CredentialRequestOptions) => Promise<Credential | null>>()
      .mockResolvedValue({
        getClientExtensionResults: () => ({ prf: { results: { first: output } } }),
      } as unknown as Credential)
    vi.stubGlobal('navigator', { credentials: { get } })
    vi.stubGlobal('location', { hostname: 'localhost' })
    stubPrfSupport()

    await expect(prfOutput('AAEC+v8=', 'CQgHBg==')).resolves.toBe(output)
    const publicKey = get.mock.calls[0][0]!.publicKey!

    expect(Array.from(publicKey.allowCredentials![0].id as Uint8Array)).toEqual([0, 1, 2, 250, 255])
    expect(Array.from(publicKey.extensions!.prf!.eval!.first as Uint8Array)).toEqual([9, 8, 7, 6])
    expect(publicKey.userVerification).toBe('required')
  })

  it('throws a descriptive error when the assertion has no PRF result', async () => {
    const get = vi
      .fn<(options?: CredentialRequestOptions) => Promise<Credential | null>>()
      .mockResolvedValue({
        getClientExtensionResults: () => ({ prf: {} }),
      } as unknown as Credential)
    vi.stubGlobal('navigator', { credentials: { get } })
    vi.stubGlobal('location', { hostname: 'localhost' })
    stubPrfSupport()

    await expect(prfOutput('AQID', 'CQgHBg==')).rejects.toThrow(
      'Windows Hello did not return a WebAuthn PRF result',
    )
  })
})
