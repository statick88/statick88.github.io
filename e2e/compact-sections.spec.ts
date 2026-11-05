import { test, expect } from '@playwright/test'
import { SECTION_IDS } from '../src/config/navigation'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('compact cards keep full content behind native keyboard disclosures', async ({ page, isMobile }) => {
  const disclosures = page.locator('.cv-section-disclosure')
  await expect(disclosures).toHaveCount(SECTION_IDS.length)
  await expect(page.locator('.cv-section-disclosure[open]')).toHaveCount(0)
  const experience = page.locator('#experiencia .cv-section-disclosure')
  const control = experience.locator('summary')
  await expect(experience.locator('.cv-section-content')).toBeHidden()
  await control.focus()
  await control.press('Enter')
  await expect(experience).toHaveAttribute('open', '')
  await expect(experience.locator('.cv-section-content')).toBeVisible()
  await expect(control).toHaveText(isMobile ? '−' : '− Menos', { useInnerText: true })
  await expect(page.locator('#proyectos .cv-section-disclosure')).not.toHaveAttribute('open')
  await control.press('Space')
  await expect(experience).not.toHaveAttribute('open')
  await expect(control).toHaveText(isMobile ? '+' : '+ Más', { useInnerText: true })
})

test('navigation opens a card, previews translate and both themes fit the viewport', async ({ page }) => {
  await page.getByRole('navigation').getByRole('button', { name: /ir a proyectos/i }).click()
  await expect(page.locator('#proyectos .cv-section-disclosure')).toHaveAttribute('open', '')
  await expect(page.locator('#proyectos')).toBeInViewport()
  await page.getByTestId('language-toggle').click()
  await expect(page.locator('#experiencia summary')).toHaveAccessibleName('Read full experience')
  await expect(page.locator('#experiencia .cv-section-preview')).toContainText('Roles')
  for (let theme = 0; theme < 2; theme++) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByTestId('theme-toggle').click()
  }
})

test('printing exposes every section and restores the screen state afterward', async ({ page }) => {
  await page.locator('#experiencia summary').click()
  const before = await page.locator('main details[open]').count()
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')))
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('.cv-section-disclosure[open]')).toHaveCount(SECTION_IDS.length)
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id} .cv-section-content`)).toBeVisible()
    await expect(page.locator(`#${id} > .cv-section-disclosure > summary`)).toBeHidden()
  }
  await page.emulateMedia({ media: 'screen' })
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')))
  await expect(page.locator('main details[open]')).toHaveCount(before)
  await expect(page.locator('#experiencia .cv-section-disclosure')).toHaveAttribute('open', '')
})


test('uses the full viewport width and native email-handler links', async ({ page }) => {
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
