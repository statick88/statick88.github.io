import { test, expect } from '@playwright/test'

for (const section of ['certificaciones', 'cursos']) {
  test(`${section} turns a two-faced leaf forward and backward without duplicating accessible records`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await page.goto('/')
    await page.getByRole('button', { name: `Abrir ${section}`, exact: true }).click()
    const reader = page.getByRole('group', { name: section, exact: true })
    const firstTitle = await reader.getByRole('article').getAttribute('aria-label')
    await reader.getByRole('button', { name: 'Página siguiente', exact: true }).click()
    const sheet = reader.getByTestId('book-page-turn-sheet')
    const forward = await sheet.evaluate(element => {
      const style = getComputedStyle(element)
      return {
        direction: element.getAttribute('data-direction'),
        animation: style.animationName,
        frames: element.getAnimations().flatMap(animation => animation.effect instanceof KeyframeEffect ? animation.effect.getKeyframes().map(frame => frame.transform) : []),
        origin: style.transformOrigin,
        faces: [...element.querySelectorAll('.book-turn-face')].map(face => ({ backface: getComputedStyle(face).backfaceVisibility, transform: getComputedStyle(face).transform })),
      }
    })
    expect(forward.direction).toBe('forward')
    expect(forward.animation).toBe('book-page-forward')
    expect(forward.frames.some(frame => typeof frame === 'string' && frame.includes('rotateY'))).toBe(true)
    expect(forward.origin).toMatch(/^0px /)
    expect(forward.faces).toHaveLength(2)
    expect(forward.faces.map(face => face.backface)).toEqual(['hidden', 'hidden'])
    expect(forward.faces[1]!.transform).not.toEqual(forward.faces[0]!.transform)
    await expect(reader.getByTestId('book-page-turn-layer')).toHaveAttribute('aria-hidden', 'true')
    await expect(reader.getByTestId('book-page-turn-layer')).toHaveAttribute('inert', '')
    await expect(reader.getByRole('article')).toHaveCount(1)
    await expect(reader.getByRole('article')).not.toHaveAttribute('aria-label', firstTitle!)
    await expect(sheet).toHaveCount(0)
    await reader.getByRole('button', { name: 'Página anterior', exact: true }).click()
    await expect(reader.getByTestId('book-page-turn-sheet')).toHaveAttribute('data-direction', 'backward')
    await expect(reader.getByTestId('book-page-turn-sheet')).toHaveCSS('animation-name', 'book-page-backward')
    await expect(reader.getByRole('article')).toHaveAttribute('aria-label', firstTitle!)
    await reader.getByRole('button', { name: 'Ver todo', exact: true }).click()
    await expect(sheet).toHaveCount(0)
    await expect(reader.locator('.manual-spread')).toHaveCSS('transform', 'none')
    expect(await reader.getByRole('article').count()).toBeGreaterThan(1)
    expect(await reader.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  })

  test(`${section} bypasses 3D motion when reduced motion is enabled`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    await page.getByRole('button', { name: `Abrir ${section}`, exact: true }).click()
    const reader = page.getByRole('group', { name: section, exact: true })
    await reader.getByRole('button', { name: 'Página siguiente', exact: true }).click()
    await expect(reader.getByTestId('book-page-turn-layer')).toHaveCount(0)
    await expect(reader.getByRole('article')).toHaveCSS('transform', 'none')
  })
}
