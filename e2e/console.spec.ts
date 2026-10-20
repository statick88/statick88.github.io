import { test, expect, type Page } from '@playwright/test'
import { NAV_GROUPS } from '../src/config/navigation'

/**
 * E2E — the console shell as a user experiences it.
 *
 * These checks run in a real browser against the production build: the
 * sidebar, the language and theme switches, the profile switcher and the
 * mobile drawer are the controls that make the redesigned CV usable, so they
 * are the ones worth guarding end to end.
 */

/** Sections the scene renders — derived from the navigation config. */
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
  await expect(page.getByTestId('console-brand')).toHaveText('Diego Medardo Saavedra García')
  await expect(page.getByTestId('console-statusbar')).toBeVisible()

  const nav = await openNavigation(page, isMobile)
  await expect(nav).toBeVisible()

  await expect(page.getByRole('region')).toHaveCount(SECTION_COUNT)
})

test('navigates from the sidebar to a section', async ({ page, isMobile }) => {
  const nav = await openNavigation(page, isMobile)

  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(page.locator('#proyectos')).toBeInViewport()
})

test('marks the active section in the sidebar', async ({ page, isMobile }) => {
  // The sidebar is hidden below the lg breakpoint, so the marker only exists
  // on desktop. The skip is declared here instead of inside the assertion:
  // a conditional expectation can silently never run.
  test.skip(isMobile, 'the sidebar is hidden on small screens')

  const nav = page.getByRole('navigation')
  await nav.getByRole('button', { name: /proyectos/i }).click()

  await expect(nav.getByRole('button', { name: /proyectos/i })).toHaveAttribute(
    'aria-current',
    'true',
  )
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
