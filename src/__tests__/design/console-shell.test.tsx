/**
 * src/__tests__/design/console-shell.test.tsx
 *
 * Integration + functional tests for the CV sheet.
 *
 * These mount the real `<App />` (providers, adapters, data) and assert the
 * structural contract of the document layout:
 *
 *   - the top bar with the identity, the section links and the controls,
 *   - the navy identity column,
 *   - every document section exists and is reachable from the navigation,
 *   - the language switch translates the navigation,
 *   - the theme switch flips the document theme.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { NAV_GROUPS, type NavItemDef } from '@/config/navigation'

const NAV_ITEMS: NavItemDef[] = NAV_GROUPS.flatMap((group) => [...group.items])
const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

/** Spanish label of a section, matching the `aria-label` of its region. */
function sectionLabel(id: string): string {
  const item = NAV_ITEMS.find((entry) => entry.id === id)
  if (!item) throw new Error(`unknown section ${id}`)
  return item.label.es
}

describe('cv sheet', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the top bar, the identity column and the document', () => {
    render(<App />)

    expect(screen.getByTestId('console-tabbar')).toBeInTheDocument()
    expect(screen.getByTestId('console-brand')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('complementary', { name: /perfil|profile/i })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders every document section', () => {
    render(<App />)

    for (const id of SECTION_IDS) {
      expect(
        screen.getByRole('region', { name: sectionLabel(id) }),
        `missing section #${id}`,
      ).toBeInTheDocument()
    }
  })

  it('scrolls to the section when a navigation link is clicked', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollIntoView

    try {
      render(<App />)

      const nav = screen.getByRole('navigation')
      await user.click(within(nav).getByRole('button', { name: /proyectos/i }))

      expect(scrollIntoView).toHaveBeenCalled()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('marks the active navigation link with aria-current', () => {
    render(<App />)

    const nav = screen.getByRole('navigation')
    const current = within(nav).getAllByRole('button').filter((el) => el.getAttribute('aria-current'))

    expect(current.length).toBeGreaterThan(0)
  })

  it('translates the navigation when the language is switched', async () => {
    const user = userEvent.setup()
    render(<App />)

    const nav = screen.getByRole('navigation')
    expect(within(nav).getByText('proyectos')).toBeInTheDocument()

    await user.click(screen.getByTestId('language-toggle'))

    expect(within(nav).getByText('projects')).toBeInTheDocument()
  })

  it('flips the document theme when the theme control is used', async () => {
    const user = userEvent.setup()
    render(<App />)

    // The document starts in the dark theme.
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByTestId('theme-toggle'))

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
