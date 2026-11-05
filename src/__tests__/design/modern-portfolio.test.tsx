import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import App from '@/App'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('modern editorial portfolio', () => {
  it('keeps the role, contact, download and curated core stack visible in the hero', () => {
    render(<App />)

    const hero = screen.getByTestId('portfolio-hero')
    expect(within(hero).getByRole('heading', { level: 1 })).toBeVisible()
    expect(within(hero).getByText(/Desarrollador Full Stack/)).toBeVisible()
    expect(within(hero).getByRole('link', { name: 'dsaavedra88@gmail.com' })).toHaveAttribute('href', 'mailto:dsaavedra88@gmail.com')
    expect(within(hero).getByRole('link', { name: /Descargar el CV en PDF/ })).toHaveAttribute('href', '/cv-es.pdf')
    expect(within(hero).getByText('TypeScript')).toBeVisible()
    expect(within(hero).getByText('React')).toBeVisible()
  })

  it('shows three evidence-based project previews without adding CV regions or a permanent sidebar', () => {
    render(<App />)

    const catalog = screen.getByTestId('featured-projects')
    expect(within(catalog).getByText('course-of-cybersecurity')).toBeVisible()
    expect(within(catalog).getByText('Course_of_python')).toBeVisible()
    expect(within(catalog).getByText('MindLedger')).toBeVisible()
    expect(within(catalog).getAllByRole('article')).toHaveLength(3)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
