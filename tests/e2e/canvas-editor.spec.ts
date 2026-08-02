import { expect, test } from '@playwright/test'
import { openApp } from './helpers'

test('existing clients open on the canvas and Data restores rail focus when it closes', async ({ page }) => {
  await openApp(page)

  const rail = page.getByRole('complementary', { name: 'Editor tools' })
  await expect(rail).toBeVisible()
  for (const name of ['Add', 'Data', 'Contents', 'Help']) {
    await expect(rail.getByRole('button', { name })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  }
  await expect(
    page.getByRole('complementary', { name: 'Client editor' }),
  ).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Guide me' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Full form' })).toHaveCount(0)

  const data = rail.getByRole('button', { name: 'Data' })
  await data.click()
  const panel = page.getByRole('dialog', { name: 'Data' })
  await expect(panel).toBeVisible()
  await expect(data).toHaveAttribute('aria-expanded', 'true')
  await expect(panel.getByRole('heading', { name: 'Data' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(data).toBeFocused()
})

test('each editor rail button pairs its accessible text label with a visible decorative icon', async ({ page }) => {
  await openApp(page)

  const rail = page.getByRole('complementary', { name: 'Editor tools' })
  for (const name of ['Add', 'Data', 'Contents', 'Help']) {
    const button = rail.getByRole('button', { name, exact: true })
    await expect(button).toContainText(name)
    await expect(button.locator('[aria-hidden=true]')).toBeVisible()
  }
})

test('Data overlays the canvas below the desktop breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 1179, height: 720 })
  await openApp(page)
  await page.getByRole('button', { name: 'Data' }).click()

  const geometry = await page.evaluate(() => {
    const panel = document.querySelector<HTMLElement>('.editor-panel')!
    const preview = document.querySelector<HTMLElement>('.preview-pane')!
    return {
      panel: panel.getBoundingClientRect().toJSON(),
      preview: preview.getBoundingClientRect().toJSON(),
    }
  })
  expect(Math.round(geometry.panel.width)).toBe(380)
  expect(Math.round(geometry.panel.x)).toBe(Math.round(geometry.preview.x))
})

test('New still opens the guided setup', async ({ page }) => {
  await openApp(page)
  await expect(
    page.getByRole('complementary', { name: 'Editor tools' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'New', exact: true }).click()

  await expect(
    page.getByRole('heading', { name: 'Who is this map for?' }),
  ).toBeVisible()
})
