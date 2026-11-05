import { test, expect } from '@playwright/test'
import { NAV_GROUPS } from '../src/config/navigation'

/**
 * E2E — the CV sheet as a user experiences it.
 *
 * These checks run in a real browser against the production build: the
 * document, the section navigation, the language and theme switches and the
 * single CV download are the controls that make the CV usable, so they are
 * the ones worth guarding end to end.
 */

/** Sections the document renders — derived from the navigation config. */
const SECTION_COUNT = NAV_GROUPS.flatMap((group) => group.items).length

const consoleErrors: string[] = []

test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  await page.goto('/')
})

test.afterEach(async () => {
  expect(consoleErrors, 'the page logged console errors').toEqual([])
})

test('renders the editorial hero and every CV section without a permanent sidebar', async ({ page }) => {
  await expect(page.getByTestId('console-brand')).toHaveText('Diego Medardo Saavedra García')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByTestId('portfolio-hero')).toContainText('Desarrollador Full Stack')
  const portrait = page.getByTestId('portfolio-hero').getByRole('img')
  await expect(portrait).toBeVisible()
  await expect(portrait).toHaveJSProperty('complete', true)
  expect(await portrait.evaluate((image) => image instanceof HTMLImageElement ? image.naturalWidth : 0)).toBeGreaterThan(0)
  const frame = await page.getByTestId('portfolio-hero').locator('.cv-photo-ring').evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const style = getComputedStyle(element)
    return { width: rect.width, height: rect.height, radius: parseFloat(style.borderRadius), border: parseFloat(style.borderTopWidth) }
  })
  expect(frame.width).toBe(frame.height)
  expect(frame.radius).toBeGreaterThanOrEqual(frame.width / 2)
  expect(frame.border).toBeGreaterThan(0)
  await expect(page.getByTestId('portfolio-hero').getByRole('link', { name: 'dsaavedra88@gmail.com' })).toHaveAttribute('href', 'mailto:dsaavedra88@gmail.com')
  await expect(page.getByTestId('featured-projects').getByRole('article')).toHaveCount(3)
  const courseCards = page.getByTestId('featured-projects').getByRole('article').filter({ has: page.getByRole('link', { name: 'Ver curso', exact: true }) })
  await expect(courseCards).toHaveCount(2)
  for (const card of await courseCards.all()) {
    const links = card.getByRole('link')
    await expect(links.nth(0)).toHaveAttribute('href', /^https:\/\/statick88\.github\.io\//)
    await expect(links.nth(0)).toHaveClass(/cv-primary-action/)
    await expect(links.nth(1)).toHaveAccessibleName('Código')
    await expect(links.nth(1)).toHaveAttribute('href', /^https:\/\/github\.com\/statick88\//)
  }
  await expect(page.getByRole('complementary')).toHaveCount(0)
  await expect(page.getByRole('region')).toHaveCount(SECTION_COUNT)
  for (const selector of ['.cv-project-preview', '.cv-section-card']) {
    const boxes = await page.locator(selector).evaluateAll((elements) => elements.slice(0, 3).map((element) => element.getBoundingClientRect().y))
    const breakpoint = selector === '.cv-project-preview' ? 761 : 1200
    const expectedSameRow = page.viewportSize()!.width >= breakpoint
    expect(Math.max(...boxes) - Math.min(...boxes) < 1, `${selector} should follow its responsive catalog grid`).toBe(expectedSameRow)
  }
})

test('opens a section modal from the top bar', async ({ page }) => {
  const nav = page.getByRole('navigation')

  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(page.getByRole('dialog', { name: 'proyectos', exact: true })).toBeVisible()
})

test('marks the active section in the navigation', async ({ page }) => {
  const nav = page.getByRole('navigation')

  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(page.locator('nav button').filter({ hasText: 'proyectos' })).toHaveAttribute(
    'aria-current',
    'true',
  )
})

test('switches the whole interface to English', async ({ page }) => {
  await expect(page.getByRole('region', { name: 'proyectos' })).toBeVisible()

  await page.getByTestId('language-toggle').click()

  await expect(page.getByRole('region', { name: 'projects' })).toBeVisible()

  const nav = page.getByRole('navigation')
  await expect(nav.getByRole('button', { name: 'projects' })).toBeVisible()
})

test('switches the theme and keeps it after a reload', async ({ page }) => {
  // The document starts in the dark theme.
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('offers one CV download link from the top bar', async ({ page }) => {
  // The CV is a single document per language: no profile variant to choose from.
  await expect(page.getByRole('option', { name: /Hacker Ético/i })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /perfil activo|active profile/i })).toHaveCount(0)

  const cvLink = page.getByTestId('cv-download-link')

  await expect(cvLink).toBeVisible()
  await expect(cvLink).toHaveAttribute('href', '/cv-es.pdf')

  await page.getByTestId('language-toggle').click()

  await expect(cvLink).toHaveAttribute('href', '/cv-en.pdf')
})
