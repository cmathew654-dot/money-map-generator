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

describe('the unlock ladder is never gated on the protection toggle (Phase 2)', () => {
  it('the getDataKey callback slice contains no reference to protectionEnabled', () => {
    expect(dataKeyCallback).not.toBe('')
    expect(dataKeyCallback).not.toContain('protectionEnabled')
  })
})

describe('plain-by-default protection gate (Phase 2)', () => {
  it("createFileCrypto's first statement is the protectionEnabled() gate, before any ceremony code runs", () => {
    expect(createFileCryptoFn).not.toBe('')
    const gateMatch = createFileCryptoFn.match(
      /\{\s*\n\s*if \(!protectionEnabled\(\)\) \{\s*\n\s*return \{ fileCrypto: \{ dek: null, wraps: \[\] \}, recoveryCode: null \}\s*\n\s*\}/,
    )
    expect(gateMatch).not.toBeNull()
    const gateEnd = gateMatch ? (gateMatch.index ?? 0) + gateMatch[0].length : -1
    const bodyBeforeGate = createFileCryptoFn.slice(0, gateEnd)
    for (const forbidden of [
      'newDataKey(',
      'readOfficeIdentity(',
      'officeWraps(',
      'setupOfficePassword(',
      'promptOfficePassword(',
    ]) {
      expect(bodyBeforeGate).not.toContain(forbidden)
    }
  })

  it("handleCreateConnectedFile routes its write through writeConnectedBook, never writeBookFile directly", () => {
    expect(handleCreateConnectedFileFn).not.toBe('')
    expect(handleCreateConnectedFileFn).toContain('writeConnectedBook(')
    expect(handleCreateConnectedFileFn).not.toContain('writeBookFile(')
  })
})

const flushConnectedFileSaveFn =
  cleanSource.match(
    /const flushConnectedFileSave = useCallback\(\(\) => \{[\s\S]*?\r?\n {2}\}, \[connectedFile\]\)/,
  )?.[0] ?? ''

const autosaveEffect =
  cleanSource.match(
    /useEffect\(\(\) => \{\r?\n\s*if \(!connectedFile[\s\S]*?\r?\n\s*\}, \[addToast, book, canMutate, connectedFile\]\)/,
  )?.[0] ?? ''

const lockConnectedFileFn =
  cleanSource.match(
    /const lockConnectedFile = useCallback\(async \(\) => \{[\s\S]*?\r?\n {2}\}, \[addToast, connectedFile, flushBrowserSave, flushConnectedFileSave, showHistory, showSnapshot\]\)/,
  )?.[0] ?? ''

const idleLockCheckFn =
  cleanSource.match(
    /const check = \(\) => \{[\s\S]*?\r?\n {4}\}/,
  )?.[0] ?? ''

const handleAddWindowsHelloFn =
  cleanSource.match(
    /const handleAddWindowsHello = async \(\) => \{[\s\S]*?\r?\n {2}\}\r?\n\r?\n {2}const handleOpenConnectedFile/,
  )?.[0] ?? ''

const replaceBookFromFileFn =
  cleanSource.match(
    /const replaceBookFromFile = useCallback\(\r?\n\s*async \(handle: BookFileHandle, isReconnect: boolean\) => \{[\s\S]*?\r?\n\s*\},\r?\n\s*\[addToast, canMutate, closeMapTextEditor, commitSnapshot, locked, promptForPassphrase, promptForWindowsHello, rememberConnectedFile, resetWizard, showRecoveryCode\],\r?\n\s*\)/,
  )?.[0] ?? ''

const convertToPlainBranch =
  replaceBookFromFileFn.match(
    /\} else if \(connectionFormat === 'convert-to-plain'\) \{[\s\S]*?\r?\n\s*\} else \{/,
  )?.[0] ?? ''

const connectPlainBranch =
  replaceBookFromFileFn.match(
    /if \(connectionFormat === 'connect-plain'\) \{[\s\S]*?\r?\n\s*\} else if/,
  )?.[0] ?? ''

describe('legacy conversion fork drives the write-back decision (Phase 2)', () => {
  it("replaceBookFromFile's body calls resolveConnectionFormat", () => {
    expect(replaceBookFromFileFn).not.toBe('')
    expect(replaceBookFromFileFn).toContain('resolveConnectionFormat(')
  })

  it("the 'convert-to-plain' branch writes plain, clears the stale cached key, then toasts, in order", () => {
    expect(convertToPlainBranch).not.toBe('')
    const writeIndex = convertToPlainBranch.indexOf('writePlainBookFile(')
    const deleteIndex = convertToPlainBranch.indexOf('deleteStoredBookDataKey(')
    const toastIndex = convertToPlainBranch.indexOf(
      'Saved without a password — this file no longer needs one to open.',
    )
    expect(writeIndex).toBeGreaterThan(-1)
    expect(deleteIndex).toBeGreaterThan(-1)
    expect(toastIndex).toBeGreaterThan(-1)
    expect(writeIndex).toBeLessThan(deleteIndex)
    expect(deleteIndex).toBeLessThan(toastIndex)
  })

  it('the stale-key cleanup is non-fatal and sits outside the write try/catch — a converted file never reports "Nothing was changed"', () => {
    expect(convertToPlainBranch).not.toBe('')
    const failureToastIndex = convertToPlainBranch.indexOf("Couldn't save this file.")
    const deleteIndex = convertToPlainBranch.indexOf('deleteStoredBookDataKey(')
    expect(failureToastIndex).toBeGreaterThan(-1)
    expect(deleteIndex).toBeGreaterThan(-1)
    // The write's catch block (and its `return`) must be fully closed before
    // the cache cleanup runs, or a failed IndexedDB delete would falsely claim
    // the conversion did not happen and abort the connection.
    expect(failureToastIndex).toBeLessThan(deleteIndex)
    expect(convertToPlainBranch).toMatch(/deleteStoredBookDataKey\([^)]*\)\s*\.catch\(/)
  })

  it("the 'connect-plain' branch performs no write and shows no toast — re-opening a plain book is a disk no-op", () => {
    expect(connectPlainBranch).not.toBe('')
    expect(connectPlainBranch).not.toContain('writePlainBookFile(')
    expect(connectPlainBranch).not.toContain('writeConnectedBook(')
    expect(connectPlainBranch).not.toContain('addToast(')
  })

  it('the unseal ceremony additionally requires a data key, so a converted book shows no ceremony', () => {
    expect(replaceBookFromFileFn).toContain(
      'if (openedEnvelope && !migrated && fileCrypto.dek) {',
    )
  })

  it("the 'convert-to-plain' catch shows the error toast and returns before commitSnapshot — a failed conversion never connects the book", () => {
    expect(convertToPlainBranch).not.toBe('')
    const catchMatch = convertToPlainBranch.match(/\} catch \{[\s\S]*?\r?\n\s*\}/)
    expect(catchMatch).not.toBeNull()
    const catchBody = catchMatch?.[0] ?? ''
    expect(catchBody).toContain("Couldn't save this file. Nothing was changed — try again.")
    expect(catchBody).toContain('return')
    expect(catchBody).not.toContain('commitSnapshot(')
  })

  it("storeBookFileDataKey in replaceBookFromFile's tail is inside a data-key condition", () => {
    expect(replaceBookFromFileFn).toMatch(
      /if \(fileCrypto\.dek\) \{\s*\n\s*void storeBookFileDataKey\(handle, fileCrypto\.dek\)/,
    )
  })
})

describe('nullable-dek sentinel routing for the remaining write and lock paths (Phase 2)', () => {
  it('flushConnectedFileSave routes through writeConnectedBook and keeps the not-connected guard', () => {
    expect(flushConnectedFileSaveFn).not.toBe('')
    expect(flushConnectedFileSaveFn).toContain('writeConnectedBook(')
    expect(flushConnectedFileSaveFn).not.toContain('writeBookFile(')
    expect(flushConnectedFileSaveFn).toMatch(/if \(!handle \|\| !fileCrypto\) return/)
  })

  it('the autosave effect routes through writeConnectedBook and keeps the not-connected guard', () => {
    expect(autosaveEffect).not.toBe('')
    expect(autosaveEffect).toContain('writeConnectedBook(')
    expect(autosaveEffect).not.toContain('writeBookFile(')
    expect(autosaveEffect).toMatch(/if \(!fileCrypto\) return/)
  })

  it("lockConnectedFile's guard reads the dek, so an unprotected connected book is never auto-locked", () => {
    expect(lockConnectedFileFn).not.toBe('')
    expect(lockConnectedFileFn).toContain('fileCryptoRef.current?.dek')
  })

  it("shouldAutoLock's hasCrypto argument reads the dek, not just ref presence", () => {
    expect(idleLockCheckFn).not.toBe('')
    expect(idleLockCheckFn).toContain('hasCrypto: Boolean(fileCryptoRef.current?.dek)')
  })

  it('handleAddWindowsHello still short-circuits with no dek and keeps its direct writeBookFile call', () => {
    expect(handleAddWindowsHelloFn).not.toBe('')
    expect(handleAddWindowsHelloFn).toMatch(
      /if \(!connectedFile \|\| !fileCrypto \|\| !fileCrypto\.dek\) return/,
    )
    expect(handleAddWindowsHelloFn).toContain('writeBookFile(')
  })

  it('no writeBookFile( call remains outside handleAddWindowsHello and the body of writeConnectedBook', () => {
    const matches = [...cleanSource.matchAll(/writeBookFile\(/g)]
    expect(matches.length).toBe(2)
  })
})

const protectionToggleBlock =
  cleanSource.match(
    /<div className="menu-section-label">Settings<\/div>[\s\S]*?<\/label>/,
  )?.[0] ?? ''

const protectionToggleOnChange =
  protectionToggleBlock.match(/onChange=\{\(event\) => \{[\s\S]*?\r?\n\s*\}\}/)?.[0] ?? ''

describe('protection-toggle menu row (Phase 2)', () => {
  it('the Settings section label is immediately followed by a single checkbox-field row', () => {
    expect(protectionToggleBlock).not.toBe('')
    expect(protectionToggleBlock).toContain('className="checkbox-field protection-toggle"')
  })

  it('the label and title copy match the UI-SPEC Copywriting Contract verbatim', () => {
    expect(protectionToggleBlock).toContain('<span>Protect files with an office password</span>')
    expect(protectionToggleBlock).toContain(
      "title=\"Adds a password so this file stays protected if it's emailed or synced elsewhere. Off is fine on office computers already secured by IT.\"",
    )
  })

  it('the checkbox reads the preference from component state, not from storage inline during render', () => {
    expect(protectionToggleBlock).toContain('checked={protectionOn}')
    expect(protectionToggleBlock).not.toContain('checked={protectionEnabled()}')
  })

  it("the row's onChange writes the setting and mirrors local state, with no dialog, ceremony, or prompt call", () => {
    expect(protectionToggleOnChange).not.toBe('')
    expect(protectionToggleOnChange).toContain('setProtectionEnabled(event.target.checked)')
    expect(protectionToggleOnChange).toContain('setProtectionOn(event.target.checked)')
    for (const forbidden of [
      'setDialog(',
      'setCeremony(',
      'showRecoveryCode(',
      'promptForPassphrase(',
    ]) {
      expect(protectionToggleOnChange).not.toContain(forbidden)
    }
  })

  it('protectionEnabled() is called from exactly three places: the state initializer, createFileCrypto, and the replaceBookFromFile format fork', () => {
    const matches = [...cleanSource.matchAll(/protectionEnabled\(\)/g)]
    expect(matches.length).toBe(3)
    expect(createFileCryptoFn).toContain('protectionEnabled()')
    expect(replaceBookFromFileFn).toContain('protectionOn: protectionEnabled()')
    expect(cleanSource).toContain('useState(() => protectionEnabled())')
  })
})
