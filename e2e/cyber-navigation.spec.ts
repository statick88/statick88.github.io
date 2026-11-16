import { test, expect } from '@playwright/test'
import { SYSTEM_SECTIONS } from '../src/config/system-navigation'
import { SECTION_IDS } from '../src/config/navigation'

test('six primary anchors coexist with every modal shortcut and deliberate section controls', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Navegación principal' })
  expect(await nav.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
    .toEqual(SYSTEM_SECTIONS.map((section) => `#${section.id}`))
  await expect(nav.getByRole('button')).toHaveCount(SECTION_IDS.length)
  const start = page.getByRole('group', { name: 'Inicio', exact: true })
  await expect(start.getByRole('button', { name: 'Sección anterior no disponible' })).toBeDisabled()
  await nav.getByRole('link', { name: 'Proyectos', exact: true }).click()
  await expect(page).toHaveURL(/#systems-proyectos$/)
  await expect(page.getByRole('dialog')).toHaveCount(0)
  const projects = page.getByRole('group', { name: 'Proyectos', exact: true })
  await projects.getByRole('button', { name: 'Ir a Exploitarium' }).click()
  await expect(page.getByRole('heading', { name: 'Exploitarium', exact: true, level: 2 })).toBeFocused()
  const last = page.getByRole('group', { name: 'Contacto', exact: true })
  await expect(last.getByRole('button', { name: 'Sección siguiente no disponible' })).toBeDisabled()
  await nav.getByRole('button', { name: /ir a proyectos/i }).click()
  await expect(page.getByRole('dialog', { name: 'proyectos', exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('translated anchors and reduced-motion pager preserve their destinations and focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByTestId('language-toggle').click()
  const nav = page.getByRole('navigation', { name: 'Main navigation' })
  for (const section of SYSTEM_SECTIONS) {
    await expect(nav.getByRole('link', { name: section.label.en, exact: true })).toHaveAttribute('href', `#${section.id}`)
  }
  const home = page.getByRole('group', { name: 'Home', exact: true })
  await home.getByRole('button', { name: 'Go to Experience' }).click()
  await expect(page.getByRole('heading', { name: 'Experience', exact: true, level: 2 })).toBeFocused()
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto')
  await expect(page.getByRole('dialog')).toHaveCount(0)
})
