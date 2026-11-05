import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { courses } from '@/data/courses'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('modern editorial portfolio', () => {
  it('shows the existing portrait in the hero before opening any modal', () => {
    render(<App />)

    const portrait = within(screen.getByTestId('portfolio-hero')).getByRole('img', { name: 'Diego Medardo Saavedra García' })
    expect(portrait).toBeVisible()
    expect(portrait).toHaveAttribute('src', '/statick.png')
    expect(portrait).toHaveAttribute('loading', 'eager')
  })

  it('shows key skills as text chips without changing language level bars', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Abrir resumen' }))
    const summary = screen.getByRole('dialog', { name: 'resumen' })
    const skills = within(summary).getByRole('list', { name: 'habilidades clave' })
    expect(within(skills).getAllByRole('listitem')).toHaveLength(6)
    expect(within(skills).getByText('HTML')).toBeVisible()
    expect(within(skills).queryByRole('progressbar')).not.toBeInTheDocument()
    expect(within(summary).getAllByRole('progressbar')).toHaveLength(4)
  })

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

  it('prioritizes published course sites in featured projects and preserves non-course links', () => {
    render(<App />)
    const cards = within(screen.getByTestId('featured-projects')).getAllByRole('article')
    for (const [index, id] of ['course-of-cybersecurity', 'Course_of_python'].entries()) {
      const course = courses.find((entry) => entry.id === id)!
      const links = within(cards[index]!).getAllByRole('link')
      expect(links.map((link) => link.getAttribute('href'))).toEqual([course.url, course.repo])
      expect(within(cards[index]!).getByRole('link', { name: /Ver curso/ })).toHaveAttribute('href', course.url)
      expect(within(cards[index]!).getByRole('link', { name: /Código/ })).toHaveAttribute('href', course.repo)
    }
    expect(within(cards[2]!).getAllByRole('link')).toHaveLength(1)
    expect(within(cards[2]!).getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', expect.stringContaining('github.com/'))
  })

  it('keeps published course links before repository links throughout the full catalog', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Abrir cursos' }))
    const catalog = screen.getByRole('dialog', { name: 'cursos' })
    expect(within(catalog).getAllByRole('link').map((link) => link.getAttribute('href')))
      .toEqual(courses.flatMap((course) => [course.url, course.repo]))
    expect(within(catalog).getAllByRole('link', { name: /Ver curso/ })).toHaveLength(courses.length)
    expect(within(catalog).getAllByRole('link', { name: /Código/ })).toHaveLength(courses.length)
    await user.click(within(catalog).getByRole('button', { name: 'Cerrar cursos' }))
    await user.click(screen.getByTestId('language-toggle'))
    expect(within(screen.getByTestId('featured-projects')).getAllByRole('link', { name: 'View course' })).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Open courses' }))
    const englishCatalog = screen.getByRole('dialog', { name: 'courses' })
    expect(within(englishCatalog).getAllByRole('link', { name: /View course/ })).toHaveLength(courses.length)
    expect(within(englishCatalog).getAllByRole('link', { name: /Code/ })).toHaveLength(courses.length)
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
