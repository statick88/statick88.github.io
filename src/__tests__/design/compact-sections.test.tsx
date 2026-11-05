import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'
import { SECTION_IDS } from '@/config/navigation'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('modal portfolio sections', () => {
  it('keeps every section in order, showing previews but no dialog by default', () => {
    render(<App />)
    const sections = screen.getAllByRole('region')
    expect(sections.map((section) => section.id)).toEqual(SECTION_IDS)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    for (const section of sections) {
      const label = section.getAttribute('aria-label')!
      expect(within(section).getByText(/./, { selector: '.cv-section-preview' })).toBeVisible()
      expect(within(section).getByRole('button', { name: `Abrir ${label}` })).toBeVisible()
    }
  })

  it.each(SECTION_IDS)('opens and closes the complete %s section as one named modal', async (id) => {
    const user = userEvent.setup()
    render(<App />)
    const section = screen.getAllByRole('region').find((region) => region.id === id)!
    const label = section.getAttribute('aria-label')!
    const trigger = within(section).getByRole('button', { name: `Abrir ${label}` })

    await user.click(trigger)
    const modal = screen.getByRole('dialog', { name: label })
    expect(modal).toHaveAttribute('open')
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    await user.click(within(modal).getByRole('button', { name: `Cerrar ${label}` }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens navigation and the hero CTA in modals without expanding the page', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(within(screen.getByRole('navigation')).getByRole('button', { name: /ir a proyectos/i }))
    expect(screen.getByRole('dialog', { name: 'proyectos' })).toBeVisible()
    expect(within(screen.getByRole('navigation')).getByRole('button', { name: /ir a proyectos/i })).toHaveAttribute('aria-current', 'true')
    await user.click(screen.getByRole('button', { name: 'Cerrar proyectos' }))
    await user.click(screen.getByRole('button', { name: /Explorar servicios/i }))
    expect(screen.getByRole('dialog', { name: 'servicios' })).toBeVisible()
  })

  it('handles native cancellation and restores the opener', async () => {
    const user = userEvent.setup()
    render(<App />)
    const trigger = screen.getByRole('button', { name: 'Abrir experiencia' })
    await user.click(trigger)
    fireEvent(screen.getByRole('dialog', { name: 'experiencia' }), new Event('cancel', { cancelable: true }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('temporarily closes the active modal for print, then restores it exactly once', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Abrir experiencia' }))
    window.dispatchEvent(new Event('beforeprint'))
    window.dispatchEvent(new Event('beforeprint'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    window.dispatchEvent(new Event('afterprint'))
    expect(screen.getAllByRole('dialog')).toHaveLength(1)
    expect(screen.getByRole('dialog', { name: 'experiencia' })).toBeVisible()
    expect(within(screen.getByRole('dialog')).getByText('Uteam')).toBeVisible()
  })

  it('translates previews, dialog labels and full content using the existing language control', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByTestId('language-toggle'))
    await user.click(screen.getByRole('button', { name: 'Open experience' }))
    const modal = screen.getByRole('dialog', { name: 'experience' })
    expect(within(modal).getByText('Software Engineer')).toBeVisible()
    expect(within(modal).getByRole('button', { name: 'Close experience' })).toBeVisible()
    expect(within(screen.getByRole('region', { name: 'experience' })).getByText(/^Roles, organizations/)).toBeVisible()
  })
})
