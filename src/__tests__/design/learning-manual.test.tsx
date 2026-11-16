import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/context/AppContext'
import { LearningManual } from '@/components/LearningManual'

const pages = ['Alpha', 'Beta', 'Gamma'].map((title) => ({
  id: title,
  title,
  content: <a href={`https://example.com/${title}`}>{title} material</a>,
}))

afterEach(cleanup)

function setup(items = pages, language: 'es' | 'en' = 'es') {
  const user = userEvent.setup()
  render(<AppProvider initialLanguage={language}><LearningManual title="Catalog" pages={items} /></AppProvider>)
  return user
}

describe('learning manual', () => {
  it('pages through every record and disables the first and last boundaries', async () => {
    const user = setup()
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Alpha material' })).toHaveAttribute('href', 'https://example.com/Alpha')
    expect(screen.queryByRole('link', { name: 'Beta material' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    expect(screen.getByRole('link', { name: 'Beta material' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Página siguiente' }))
    expect(screen.getByRole('link', { name: 'Gamma material' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Página siguiente' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Página anterior' }))
    expect(screen.getByRole('link', { name: 'Beta material' })).toBeVisible()
  })

  it('provides an index and an all-records view without changing any links', async () => {
    const user = setup()
    await user.selectOptions(screen.getByLabelText('Ir a página'), '2')
    expect(screen.getByRole('link', { name: 'Gamma material' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Ver todo' }))
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href')))
      .toEqual(pages.map((page) => `https://example.com/${page.title}`))
    await user.click(screen.getByRole('button', { name: 'Vista libro' }))
    expect(screen.getByRole('link', { name: 'Gamma material' })).toBeVisible()
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('uses scoped keyboard navigation without capturing keys on links or the index', async () => {
    const user = setup()
    const reader = screen.getByRole('group', { name: 'Catalog' })
    reader.focus()
    await user.keyboard('{End}')
    expect(screen.getByRole('link', { name: 'Gamma material' })).toBeVisible()
    await user.keyboard('{Home}{ArrowRight}')
    expect(screen.getByRole('link', { name: 'Beta material' })).toBeVisible()
    const link = screen.getByRole('link', { name: 'Beta material' })
    link.focus()
    await user.keyboard('{ArrowRight}')
    expect(link).toHaveFocus()
    expect(screen.getByRole('link', { name: 'Beta material' })).toBeVisible()
  })

  it('renders an honest empty state and single-page boundaries', () => {
    setup([])
    expect(screen.getByText('No hay registros disponibles.')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Página siguiente' })).not.toBeInTheDocument()
  })

  it('translates controls and keeps a single record accessible in English', () => {
    setup(pages.slice(0, 1), 'en')
    const reader = screen.getByRole('group', { name: 'Catalog' })
    expect(within(reader).getByRole('button', { name: 'Previous page' })).toBeDisabled()
    expect(within(reader).getByRole('button', { name: 'Next page' })).toBeDisabled()
    expect(within(reader).getByLabelText('Go to page')).toHaveValue('0')
    expect(within(reader).getByRole('link', { name: 'Alpha material' })).toBeVisible()
  })
})
