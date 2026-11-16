import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

const sections = [
  ['systems-inicio', 'Inicio', 'Home'],
  ['systems-trayectoria', 'Trayectoria', 'Experience'],
  ['systems-proyectos', 'Proyectos', 'Projects'],
  ['systems-exploitarium', 'Exploitarium', 'Exploitarium'],
  ['systems-academia', 'Academia', 'Learning'],
  ['systems-contacto', 'Contacto', 'Contact'],
] as const

beforeEach(() => localStorage.clear())
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('STATICK Cyber Systems primary navigation', () => {
  it('renders six Spanish anchor links to wrapper ids that do not collide with legacy modal sections', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Navegación principal' })

    expect(within(nav).getAllByRole('link')).toHaveLength(6)
    for (const [id, spanish] of sections) {
      expect(within(nav).getByRole('link', { name: spanish })).toHaveAttribute('href', `#${id}`)
      expect(screen.getAllByRole('group', { name: spanish })).toHaveLength(1)
      expect(screen.getByRole('group', { name: spanish })).toHaveAttribute('id', id)
    }
    expect(screen.getByRole('region', { name: 'proyectos' })).toHaveAttribute('id', 'proyectos')
    expect(screen.getByRole('region', { name: 'exploitarium' })).toHaveAttribute('id', 'exploitarium')
  })

  it('translates all six primary anchors to English without changing their destinations', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('language-toggle'))
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })

    for (const [id, , english] of sections) {
      expect(within(nav).getByRole('link', { name: english })).toHaveAttribute('href', `#${id}`)
    }
  })

  it('moves deliberately between section headings and disables pager boundaries', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollIntoView
    try {
      render(<App />)
      const start = screen.getByRole('group', { name: 'Inicio' })
      expect(within(start).getByRole('button', { name: 'Sección anterior no disponible' })).toBeDisabled()
      await user.click(within(start).getByRole('button', { name: 'Ir a Trayectoria' }))
      expect(screen.getByRole('heading', { name: 'Trayectoria', level: 2 })).toHaveFocus()
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

      const end = screen.getByRole('group', { name: 'Contacto' })
      expect(within(end).getByRole('button', { name: 'Sección siguiente no disponible' })).toBeDisabled()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('respects reduced motion while preserving deliberate focus movement', async () => {
    const user = userEvent.setup()
    const scrollIntoView = vi.fn()
    const original = Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = scrollIntoView
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
    try {
      render(<App />)
      const start = screen.getByRole('group', { name: 'Inicio' })
      await user.click(within(start).getByRole('button', { name: 'Ir a Trayectoria' }))
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
      expect(screen.getByRole('heading', { name: 'Trayectoria', level: 2 })).toHaveFocus()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('does not capture native arrow keys outside explicit pager buttons', async () => {
    const user = userEvent.setup()
    render(<App />)
    const navLink = screen.getByRole('link', { name: 'Inicio' })
    navLink.focus()
    await user.keyboard('{ArrowDown}{ArrowUp}')
    expect(navLink).toHaveFocus()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
