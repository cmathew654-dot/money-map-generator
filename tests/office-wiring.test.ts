import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

/**
 * Strips comment lines so prose in a comment can neither satisfy nor break
 * an assertion below; mirrors the source-assertion convention already used
 * by tests/idle-lock.test.ts and tests/app-file-crypto.test.ts, both of
 * which read src/App.tsx as a string (no jsdom in this suite).
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .filter((line) => !/^\s*\/\//.test(line))
    .join('\n')
}

const cleanSource = stripComments(appSource)

const dataKeyCallback =
  cleanSource.match(
    /const wraps = readWraps\(envelope\)[\s\S]*?\r?\n\s*\} catch \(error\) \{/,
  )?.[0] ?? ''

describe('office key wiring into the open path (getDataKey callback)', () => {
  it('resolves the office data key before the Hello branch and the prompt loop', () => {
    expect(dataKeyCallback).not.toBe('')
    const officeIndex = dataKeyCallback.indexOf('resolveOfficeDataKey(envelope)')
    const helloIndex = dataKeyCallback.indexOf("wraps.find((wrap) => wrap.type === 'webauthn')")
    const loopIndex = dataKeyCallback.indexOf('while (true)')
    expect(officeIndex).toBeGreaterThan(-1)
    expect(helloIndex).toBeGreaterThan(-1)
    expect(loopIndex).toBeGreaterThan(-1)
    expect(officeIndex).toBeLessThan(helloIndex)
    expect(officeIndex).toBeLessThan(loopIndex)
  })

  it('returns immediately with no prompt when the office key resolves silently', () => {
    expect(dataKeyCallback).toMatch(
      /const officeDek = await resolveOfficeDataKey\(envelope\)\s*\n\s*if \(officeDek\) \{\s*\n\s*fileCrypto = \{ dek: officeDek, wraps \}\s*\n\s*return officeDek/,
    )
  })

  it('routes an office-wrapped envelope through the office-scoped dialog and both unlock factors', () => {
    expect(dataKeyCallback).toContain('officeWrapsOf(wraps).length > 0')
    expect(dataKeyCallback).toContain("promptForPassphrase('open', handle.name, true, 'office')")
    expect(dataKeyCallback).toContain('unlockOfficeWithPassword(envelope, passphrase.value)')
    expect(dataKeyCallback).toContain('unlockOfficeWithRecoveryCode(envelope, passphrase.value)')
  })

  it('keeps the legacy single-match wrap lookup for the non-office path only', () => {
    expect(dataKeyCallback).toContain(
      'wraps.find((candidate) => candidate.type === passphrase.factor)',
    )
  })
})

const createFileCryptoFn =
  cleanSource.match(
    /async function createFileCrypto\([\s\S]*?\r?\n\}\r?\n[\s\S]*?async function windowsHelloWrap/,
  )?.[0] ?? ''

const handleCreateConnectedFileFn =
  cleanSource.match(
    /const handleCreateConnectedFile = async \(\) => \{[\s\S]*?\r?\n {2}\}\r?\n\r?\n {2}const handleAddWindowsHello/,
  )?.[0] ?? ''

describe('office key wiring into the create path (createFileCrypto)', () => {
  it('mints wraps from the cached office identity with no ceremony when one already exists', () => {
    expect(createFileCryptoFn).not.toBe('')
    expect(createFileCryptoFn).toContain('readOfficeIdentity()')
    expect(createFileCryptoFn).toMatch(
      /if \(identity\) \{\s*\n\s*const wraps = await officeWraps\(dek, identity, identity\.recovery\)\s*\n\s*return \{ fileCrypto: \{ dek, wraps \}, recoveryCode: null \}/,
    )
  })

  it('runs the office setup ceremony and returns a recovery code on first run only', () => {
    expect(createFileCryptoFn).toContain('await promptOfficePassword()')
    expect(createFileCryptoFn).toContain('setupOfficePassword(password)')
    expect(createFileCryptoFn).toContain('recoveryCode: setup.recoveryCode')
  })

  it('holds no biometric step and no per-book passphrase wrap construction', () => {
    expect(createFileCryptoFn).not.toContain('windowsHelloWrap(dek)')
    expect(createFileCryptoFn).not.toContain('enrollPrf')
    expect(createFileCryptoFn).not.toMatch(/type: 'passphrase'/)
    expect(createFileCryptoFn).not.toContain('helloFirst')
  })

  it('runs no ceremony and shows no recovery dialog when creating a second book', () => {
    expect(handleCreateConnectedFileFn).not.toBe('')
    expect(handleCreateConnectedFileFn).not.toContain('isPrfAvailable')
    expect(handleCreateConnectedFileFn).not.toContain('promptForWindowsHello')
    expect(handleCreateConnectedFileFn).toMatch(
      /if \(created\.recoveryCode\) \{\s*\n\s*await showRecoveryCode\(/,
    )
  })
})
