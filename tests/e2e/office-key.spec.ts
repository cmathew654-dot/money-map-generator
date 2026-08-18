import { expect, test } from '@playwright/test'

/**
 * Closes the Phase 1 blocker recorded in STATE.md: does a non-extractable
 * office KEK genuinely survive IndexedDB structured-clone persistence
 * across a real page reload, in the real Chromium runtime target?
 *
 * Loads the model modules directly from the Vite dev server (dynamic import
 * against a runtime-built specifier, so no test hook ships in production
 * code) rather than driving the app UI, which does not wire this phase yet.
 */

test.describe('office key: real IndexedDB persistence', () => {
  test('a book sealed before a reload reopens silently after it, with a non-extractable office KEK', async ({ page }) => {
    await page.goto('/')

    const setupResult = await page.evaluate(async () => {
      const officeKey = await import(`${location.origin}/src/model/officeKey.ts`)
      const crypto = await import(`${location.origin}/src/model/crypto.ts`)

      const setup = await officeKey.setupOfficePassword('a-real-browser-12-plus-pw')
      const dek = await crypto.newDataKey()
      const wraps = await officeKey.officeWraps(dek, setup.office, setup.recovery)
      const envelope = await crypto.sealBook(dek, 'real browser payload', wraps)

      return { envelope, extractable: setup.office.kek.extractable }
    })

    expect(setupResult.extractable).toBe(false)

    await page.reload()

    const reopened = await page.evaluate(async (envelope: string) => {
      const officeKey = await import(`${location.origin}/src/model/officeKey.ts`)
      const crypto = await import(`${location.origin}/src/model/crypto.ts`)

      const dek = await officeKey.resolveOfficeDataKey(envelope)
      if (!dek) return null
      return crypto.openBook(dek, envelope)
    }, setupResult.envelope)

    expect(reopened).toBe('real browser payload')
  })

  test('a wiped office database resolves to null until the password is typed once, then is silent (KEY-04)', async ({ page }) => {
    await page.goto('/')

    const setupResult = await page.evaluate(async () => {
      const officeKey = await import(`${location.origin}/src/model/officeKey.ts`)
      const crypto = await import(`${location.origin}/src/model/crypto.ts`)

      const setup = await officeKey.setupOfficePassword('another-real-browser-pw-12')
      const dek = await crypto.newDataKey()
      const wraps = await officeKey.officeWraps(dek, setup.office, setup.recovery)
      const envelope = await crypto.sealBook(dek, 'colleague payload', wraps)

      return { envelope, password: 'another-real-browser-pw-12' }
    })

    await page.evaluate(() => new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase('money-map-office-key')
      deleteRequest.onsuccess = () => resolve()
      deleteRequest.onerror = () => reject(deleteRequest.error)
    }))
    await page.reload()

    const freshMachineResult = await page.evaluate(async (envelope: string) => {
      const officeKey = await import(`${location.origin}/src/model/officeKey.ts`)
      return officeKey.resolveOfficeDataKey(envelope)
    }, setupResult.envelope)

    expect(freshMachineResult).toBeNull()

    const unlockedThenSilent = await page.evaluate(async ({ envelope, password }: { envelope: string; password: string }) => {
      const officeKey = await import(`${location.origin}/src/model/officeKey.ts`)
      const crypto = await import(`${location.origin}/src/model/crypto.ts`)

      const dek = await officeKey.unlockOfficeWithPassword(envelope, password)
      if (!dek) return { unlocked: null, silent: null }
      const unlocked = await crypto.openBook(dek, envelope)

      const silentDek = await officeKey.resolveOfficeDataKey(envelope)
      const silent = silentDek ? await crypto.openBook(silentDek, envelope) : null

      return { unlocked, silent }
    }, setupResult)

    expect(unlockedThenSilent.unlocked).toBe('colleague payload')
    expect(unlockedThenSilent.silent).toBe('colleague payload')
  })
})
