import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { SECTION_IDS } from '@/config/navigation'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

const fullSection = (name: string) => screen.getByRole('group', { name: `Contenido completo de ${name}` })

describe('compact portfolio sections', () => {
  it('keeps every section in order with a short visible preview and closed full content', () => {
    render(<App />)
    const sections = screen.getAllByRole('region')
    expect(sections.map((section) => section.id)).toEqual(SECTION_IDS)
    for (const section of sections) {
      const label = section.getAttribute('aria-label')!
      const disclosure = fullSection(label)
      expect(within(section).getByText(/./, { selector: '.cv-section-preview' })).toBeVisible()
      expect(disclosure).not.toHaveAttribute('open')
      expect(within(disclosure).getByText(label, { selector: 'h2' })).not.toBeVisible()
      expect(within(section).getByLabelText(`Ver contenido completo de ${label}`)).toBeVisible()
    }
  })

  it('reveals and closes full content independently', async () => {
    const user = userEvent.setup()
    render(<App />)
    const control = screen.getByLabelText('Ver contenido completo de experiencia')
    await user.click(control)
    expect(fullSection('experiencia')).toHaveAttribute('open')
    expect(within(fullSection('experiencia')).getByText('experiencia', { selector: 'h2' })).toBeVisible()
    expect(fullSection('proyectos')).not.toHaveAttribute('open')
    await user.click(control)
    expect(fullSection('experiencia')).not.toHaveAttribute('open')
  })

  it('opens a destination from navigation while preserving the existing scroll behavior', async () => {
    const user = userEvent.setup()
    const original = Element.prototype.scrollIntoView
    const scroll = vi.fn()
    Element.prototype.scrollIntoView = scroll
    try {
      render(<App />)
      await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: /ir a proyectos/i }))
      expect(fullSection('proyectos')).toHaveAttribute('open')
      expect(scroll).toHaveBeenCalled()
    } finally {
      Element.prototype.scrollIntoView = original
    }
  })

  it('prints all details then restores the reader’s expanded sections', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByLabelText('Ver contenido completo de experiencia'))
    window.dispatchEvent(new Event('beforeprint'))
    const disclosures = screen.getAllByRole('group', { name: /^Contenido completo de / })
    expect(disclosures).toHaveLength(SECTION_IDS.length)
    disclosures.forEach((disclosure) => expect(disclosure).toHaveAttribute('open'))
    // Repeated print notifications must not overwrite the original state.
    window.dispatchEvent(new Event('beforeprint'))
    window.dispatchEvent(new Event('afterprint'))
    expect(disclosures.filter((disclosure) => disclosure.hasAttribute('open'))).toHaveLength(1)
    expect(fullSection('experiencia')).toHaveAttribute('open')
  })

  it('translates previews and disclosure labels without discarding full content', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(within(fullSection('experiencia')).getByText('experiencia', { selector: 'h2' })).toBeInTheDocument()
    await user.click(screen.getByTestId('language-toggle'))
    expect(screen.getByLabelText('Read full experience')).toBeInTheDocument()
    expect(within(screen.getByRole('region', { name: 'experience' })).getByText(/^Roles, organizations/)).toBeVisible()
    expect(within(screen.getByRole('group', { name: 'Full experience' })).getByText('experience', { selector: 'h2' })).toBeInTheDocument()
  })
})
