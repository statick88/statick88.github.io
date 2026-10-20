import { test, expect, type Page } from '@playwright/test'

/**
 * E2E — the console shell as a user experiences it.
 *
 * These checks run in a real browser against the production build: the
 * sidebar, the language and theme switches, the profile switcher and the
 * mobile drawer are the controls that make the redesigned CV usable, so they
 * are the ones worth guarding end to end.
 */

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

/**
 * The navigation surface for the current viewport: the sidebar on desktop, the
 * drawer on small screens (the sidebar is display:none below the lg breakpoint).
 */
async function openNavigation(page: Page, isMobile: boolean) {
  if (!isMobile) {
    return page.getByRole('navigation')
  }
  await page.getByRole('button', { name: /abrir menú|open menu/i }).click()
  return page.getByRole('dialog').getByRole('navigation')
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

test('renders the console shell with every section reachable', async ({ page, isMobile }) => {
  await expect(page.getByTestId('console-brand')).toHaveText('statick@cv')
  await expect(page.getByTestId('console-statusbar')).toBeVisible()

  const nav = await openNavigation(page, isMobile)
  await expect(nav).toBeVisible()

  await expect(page.getByRole('region')).toHaveCount(13)
})

test('navigates from the sidebar to a section and marks it active', async ({ page, isMobile }) => {
  const nav = await openNavigation(page, isMobile)

  await nav.getByRole('button', { name: /proyectos/i }).click()

  const proyectos = page.locator('#proyectos')
  await expect(proyectos).toBeInViewport()

  if (!isMobile) {
    await expect(nav.getByRole('button', { name: /proyectos/i })).toHaveAttribute(
      'aria-current',
      'true',
    )
  }
})

test('switches the whole interface to English', async ({ page, isMobile }) => {
  await expect(page.getByRole('region', { name: 'proyectos' })).toBeVisible()

  await page.getByTestId('language-toggle').click()

  await expect(page.getByRole('region', { name: 'projects' })).toBeVisible()

  const nav = await openNavigation(page, isMobile)
  await expect(nav.getByRole('button', { name: 'projects' })).toBeVisible()
})

test('switches the theme and keeps it after a reload', async ({ page }) => {
  await expect(page.locator('html')).toHaveClass(/dark/)

  await page.getByTestId('theme-toggle').click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)

  await page.reload()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('changes the professional profile from the top bar', async ({ page }) => {
  const role = page.locator('#perfil')
  await expect(role).toContainText('Full Stack')

  await page.getByRole('button', { name: /perfil activo|active profile/i }).click()
  await page.getByRole('option', { name: /Hacker Ético/i }).click()

  await expect(role).toContainText('Hacker Ético')
})

test('opens and closes the navigation drawer on small screens', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'the drawer only exists below the lg breakpoint')

  await page.getByRole('button', { name: /abrir menú|open menu/i }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('navigation')).toBeVisible()

  await drawer.getByRole('button', { name: /proyectos/i }).click()
  await expect(drawer).toBeHidden()
})
