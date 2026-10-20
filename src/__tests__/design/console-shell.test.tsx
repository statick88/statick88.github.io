/**
 * src/__tests__/design/console-shell.test.tsx
 *
 * Integration + functional tests for the CONSOLE shell.
 *
 * These mount the real `<App />` (providers, adapters, data) and assert the
 * structural contract of the new layout:
 *
 *   - a sidebar that groups every section,
 *   - a top bar with the brand and the language / theme controls,
 *   - a status bar,
 *   - every navigation target actually exists in the page (no dead links),
 *   - clicking a navigation item scrolls to its section,
 *   - the language switch translates the navigation,
 *   - the theme switch really flips the document theme.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { NAV_GROUPS, type NavItemDef } from '@/config/navigation'

const NAV_ITEMS: NavItemDef[] = NAV_GROUPS.flatMap((group) => [...group.items])
const SECTION_IDS = NAV_ITEMS.map((item) => item.id)

/** Spanish label of a section, matching the `aria-label` of its scene region. */
function sectionLabel(id: string): string {
  const item = NAV_ITEMS.find((entry) => entry.id === id)
  if (!item) throw new Error(`unknown section ${id}`)
  return item.label.es
}

describe('console shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    cleanup()
  })

  it('renders the sidebar, the top bar and the status bar', () => {
    render(<App />)

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByTestId('console-tabbar')).toBeInTheDocument()
    expect(screen.getByTestId('console-statusbar')).toBeInTheDocument()
    expect(screen.getByTestId('console-brand')).toBeInTheDocument()
  })

  it('groups the navigation sections', () => {
    render(<App />)

    const nav = screen.getByRole('navigation')

    for (const group of NAV_GROUPS) {
      expect(within(nav).getByText(group.title.es)).toBeInTheDocument()
    }

    for (const id of SECTION_IDS) {
      expect(
        screen.getByRole('region', { name: sectionLabel(id) }),
        `missing section target #${id}`,
      ).toBeInTheDocument()
    }
  })

  it('scrolls to the section when a navigation item is clicked', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollIntoView

    try {
      render(<App />)

      const nav = screen.getByRole('navigation')
      const target = within(nav).getByRole('button', { name: /proyectos/i })

      await user.click(target)

      expect(scrollIntoView).toHaveBeenCalled()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('marks the active navigation item with aria-current', () => {
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

    expect(document.documentElement.classList.contains('dark')).toBe(true)

    await user.click(screen.getByTestId('theme-toggle'))

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
