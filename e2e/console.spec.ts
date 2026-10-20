import { test, expect } from '@playwright/test'
import { NAV_GROUPS } from '../src/config/navigation'

/**
 * E2E — the CV sheet as a user experiences it.
 *
 * These checks run in a real browser against the production build: the
 * document, the section navigation, the language and theme switches and the
 * profile switcher are the controls that make the CV usable, so they are the
 * ones worth guarding end to end.
 */

/** Sections the document renders — derived from the navigation config. */
const SECTION_COUNT = NAV_GROUPS.flatMap((group) => group.items).length

const consoleErrors: string[] = []

/**
 * Chromium logs one unavoidable notice for the deployment policy: `frame-ancestors`
 * is ignored when a CSP is delivered through a <meta> element. The real header
 * carries it (see dist/_headers); the notice is informational, not a failure.
 */
const ALLOWED_CONSOLE_NOTICES = [
  /frame-ancestors' is ignored when delivered via a <meta> element/i,
]

function unexpectedConsoleErrors(errors: string[]): string[] {
  return errors.filter((error) => !ALLOWED_CONSOLE_NOTICES.some((pattern) => pattern.test(error)))
}

test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  await page.goto('/')
})

test.afterEach(async () => {
  expect(unexpectedConsoleErrors(consoleErrors), 'the page logged console errors').toEqual([])
})

test('renders the CV sheet with every section reachable', async ({ page }) => {
  await expect(page.getByTestId('console-brand')).toHaveText('Diego Medardo Saavedra García')
  await expect(page.getByRole('navigation')).toBeVisible()
  await expect(page.getByRole('complementary')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('region')).toHaveCount(SECTION_COUNT)
})

test('navigates from the top bar to a section', async ({ page }) => {
  const nav = page.getByRole('navigation')

  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(page.locator('#proyectos')).toBeInViewport()
})

test('marks the active section in the navigation', async ({ page }) => {
  const nav = page.getByRole('navigation')

  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(nav.getByRole('button', { name: /proyectos/i })).toHaveAttribute(
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

test('changes the professional profile from the top bar', async ({ page }) => {
  const role = page.locator('#main-content')
  await expect(role).toContainText('Full Stack')

  await page.getByRole('button', { name: /perfil activo|active profile/i }).click()
  await page.getByRole('option', { name: /Hacker Ético/i }).click()

  await expect(role).toContainText('Hacker Ético')
})
