import { test } from '@playwright/test'
import { assertWcag22AA, fullForm, openApp } from './helpers'

test.describe('WCAG 2.2 AA certification', () => {
  test('editor', async ({ page }, info) => { await openApp(page); await fullForm(page); await assertWcag22AA(page, info, 'editor') })
  test('wizard', async ({ page }, info) => { await openApp(page); await assertWcag22AA(page, info, 'wizard') })
  test('presentation', async ({ page }, info) => { await openApp(page); await page.getByRole('button', { name: 'Present' }).click(); await assertWcag22AA(page, info, 'presentation') })
})
