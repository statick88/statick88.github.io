import { test, expect } from '@playwright/test'
import { SECTION_IDS } from '../src/config/navigation'

test.beforeEach(async ({ page }) => { await page.goto('/') })

test('every section opens its full content in a single native modal', async ({ page }) => {
  await expect(page.locator('.cv-section-modal')).toHaveCount(SECTION_IDS.length)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  for (const id of SECTION_IDS) {
    const trigger = page.locator(`#${id} > .cv-section-trigger`)
    await trigger.click()
    const dialog = page.locator(`#modal-${id}`)
    await expect(dialog).toBeVisible()
    await expect(page.getByRole('dialog')).toHaveCount(1)
    await expect(dialog.locator('.cv-section-content')).toBeVisible()
    await dialog.getByRole('button', { name: /^Cerrar / }).click()
    await expect(dialog).toBeHidden()
    await expect(trigger).toBeFocused()
  }
})

test('Escape and backdrop close, focus stays trapped, and background cannot scroll', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Abrir experiencia', exact: true })
  await trigger.focus()
  await trigger.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'experiencia', exact: true })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Cerrar experiencia' })).toBeFocused()
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden')
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press(key)
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
    }
  }
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.locator('.cv-modal-header h2').click()
  await expect(dialog).toBeVisible()
  await page.mouse.click(2, 2)
  await expect(dialog).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('navigation and hero CTA open modals; bilingual labels and themes remain usable', async ({ page }) => {
  await page.getByRole('navigation').getByRole('button', { name: /ir a proyectos/i }).click()
  await expect(page.getByRole('dialog', { name: 'proyectos', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar proyectos' }).click()
  await page.getByRole('button', { name: /Explorar servicios/i }).click()
  await expect(page.getByRole('dialog', { name: 'servicios', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByTestId('language-toggle').click()
  await page.getByRole('button', { name: 'Open education', exact: true }).click()
  const education = page.getByRole('dialog', { name: 'education', exact: true })
  await expect(education).toContainText('expected graduation in 2028')
  await page.getByRole('button', { name: 'Close education' }).click()
  await page.getByTestId('theme-toggle').click()
  await page.getByRole('button', { name: 'Open experience', exact: true }).click()
  await expect(page.getByRole('dialog', { name: 'experience', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('printing exposes all section content without modal chrome and restores the open section', async ({ page }) => {
  await page.getByRole('button', { name: 'Abrir experiencia', exact: true }).click()
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
  await expect(page.locator('.cv-section-modal[open]')).toHaveCount(0)
  await page.emulateMedia({ media: 'print' })
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#modal-${id} .cv-section-content`)).toBeVisible()
    await expect(page.locator(`#modal-${id} .cv-modal-header`)).toBeHidden()
  }
  await page.emulateMedia({ media: 'screen' })
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')))
  await expect(page.getByRole('dialog')).toHaveCount(1)
  await expect(page.getByRole('dialog', { name: 'experiencia', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})

test('full-width layout and mailto links remain intact', async ({ page }) => {
  const width = await page.evaluate(() => innerWidth)
  const sheet = await page.locator('.cv-sheet').boundingBox()
  expect(sheet).not.toBeNull()
  expect(sheet!.x).toBe(0)
  expect(sheet!.width).toBeGreaterThanOrEqual(width - 20)
  const emailLinks = page.locator('a[href^="mailto:"]')
  expect(await emailLinks.count()).toBeGreaterThan(0)
  for (const link of await emailLinks.all()) {
    await expect(link).toHaveAttribute('href', 'mailto:dsaavedra88@gmail.com')
    await expect(link).not.toHaveAttribute('target', '_blank')
  }
})
