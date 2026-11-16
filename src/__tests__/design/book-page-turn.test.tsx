import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/context/AppContext'
import { LearningManual } from '@/components/LearningManual'

const pages = ['Alpha', 'Beta', 'Gamma'].map(title => ({ id: title, title, content: <p>Detail {title}</p> }))
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function setup(book = false, reduced = false) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduced })))
  render(<AppProvider initialLanguage="es"><LearningManual title="Catalog" pages={pages} {...(book ? { pageTurn: true } : {})} /></AppProvider>)
  return userEvent.setup()
}

describe('two-sided book transition', () => {
  it('keeps generic manual callers static unless they opt in', async () => {
    const user = setup()
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    expect(screen.getByRole('article', { name: 'Beta' })).toBeVisible()
    expect(screen.queryByTestId('book-page-turn-layer')).not.toBeInTheDocument()
  })

  it('turns forward/backward with an inert visual snapshot, preserving index, keys and complete view', async () => {
    const user = setup(true)
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    expect(screen.getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('article', { name: 'Beta' })).toBeVisible()
    const layer = screen.getByTestId('book-page-turn-layer')
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer).toHaveAttribute('inert', '')
    expect(within(layer).getByText('Detail Alpha')).toBeInTheDocument()
    expect(screen.getByTestId('book-page-turn-sheet')).toHaveAttribute('data-direction', 'forward')
    // jsdom does not run CSS animations; exercise the bounded cleanup fallback.
    await waitFor(() => expect(screen.queryByTestId('book-page-turn-layer')).not.toBeInTheDocument(), { timeout: 1500 })
    await user.click(screen.getByRole('button', { name: 'Página anterior' }))
    expect(screen.getByRole('article', { name: 'Alpha' })).toBeVisible()
    expect(screen.getByTestId('book-page-turn-sheet')).toHaveAttribute('data-direction', 'backward')
    await user.click(screen.getByRole('button', { name: 'Ver todo' }))
    expect(screen.queryByTestId('book-page-turn-layer')).not.toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(3)
    await user.click(screen.getByRole('button', { name: 'Vista libro' }))
    await user.selectOptions(screen.getByLabelText('Ir a página'), '2')
    expect(screen.getByRole('article', { name: 'Gamma' })).toBeVisible()
    await waitFor(() => expect(screen.queryByTestId('book-page-turn-layer')).not.toBeInTheDocument(), { timeout: 1500 })
    const reader = screen.getByRole('group', { name: 'Catalog' })
    reader.focus()
    await user.keyboard('{Home}')
    expect(screen.getByRole('article', { name: 'Alpha' })).toBeVisible()
    expect(screen.getByTestId('book-page-turn-sheet')).toHaveAttribute('data-direction', 'backward')
    expect(reader).toHaveFocus()
  })

  it('bypasses the decorative overlay for reduced motion', async () => {
    const user = setup(true, true)
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    expect(screen.getByRole('article', { name: 'Beta' })).toBeVisible()
    expect(screen.queryByTestId('book-page-turn-layer')).not.toBeInTheDocument()
  })
})
