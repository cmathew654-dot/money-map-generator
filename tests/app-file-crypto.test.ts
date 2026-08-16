import appSource from '../src/App.tsx?raw'
import { describe, expect, it } from 'vitest'

const connectedSaveEffect =
  appSource.match(
    /useEffect\(\(\) => \{\r?\n\s*if \(!connectedFile[\s\S]*?\r?\n\s*\}, \[addToast, book, canMutate, connectedFile\]\)/,
  )?.[0] ?? ''

const replaceBookFromFile =
  appSource.match(
    /const replaceBookFromFile = useCallback\([\s\S]*?\r?\n\s*const handleCreateConnectedFile/,
  )?.[0] ?? ''

describe('connected file encryption wiring', () => {
  it('reuses the connected file key and salt for autosaves', () => {
    expect(connectedSaveEffect).toMatch(
      /const fileCrypto = fileCryptoRef\.current/,
    )
    expect(connectedSaveEffect).toMatch(
      /writeBookFile\(connectedFile, book, fileCrypto\.key, fileCrypto\.salt\)/,
    )
    expect(connectedSaveEffect).not.toContain('deriveKey(')
  })

  it('skips an autosave with no connected file crypto identity', () => {
    expect(connectedSaveEffect).toMatch(
      /const fileCrypto = fileCryptoRef\.current\r?\n\s*if \(!fileCrypto\) return\r?\n\s*fileSaveRevision\.current/,
    )
  })

  it('gives readBookFile a key callback', () => {
    expect(replaceBookFromFile).toMatch(
      /readBookFile\(handle, async \(salt\) =>/,
    )
  })

  /*
   * A plaintext book never invokes getKey, so it reaches the commit with no
   * key. Connecting in that state would leave the save effect skipping every
   * write while the advisor is told the file is saving: silent data loss.
   */
  it('encrypts a plaintext book before connecting to it', () => {
    expect(replaceBookFromFile).toMatch(
      /if \(!fileCrypto\) \{[\s\S]*?promptForPassphrase\('create'/,
    )
    expect(replaceBookFromFile).toMatch(
      /if \(!fileCrypto\) \{[\s\S]*?writeBookFile\(handle, resolution\.book, key, salt\)/,
    )
  })

  it('does not connect when the migration passphrase is cancelled', () => {
    expect(replaceBookFromFile).toMatch(
      /if \(!fileCrypto\) \{[\s\S]*?if \(passphrase === null\) return/,
    )
  })
})
