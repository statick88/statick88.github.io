import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppProvider } from '@/context/AppContext'
import CertificationsList from '@/components/right-column/CertificationsList'

afterEach(cleanup)

describe('certificate manual preservation', () => {
  it('retains issuer, date, status, optional ID, summary and existing sorting in the complete view', async () => {
    const user = userEvent.setup()
    render(<AppProvider initialLanguage="es"><CertificationsList certifications={[
      { name: { es: 'Anterior', en: 'Earlier' }, issuer: 'Issuer A', date: '2020-01-01', status: 'expired', credentialId: 'ABC-123' },
      { name: { es: 'Actual', en: 'Current' }, issuer: 'Issuer B', date: '2026-01-01', status: 'active', credentialId: null },
      { name: { es: 'En curso', en: 'Ongoing' }, issuer: 'Issuer C', date: '2026-02-01', status: 'in-progress', credentialId: null },
    ]} /></AppProvider>)
    expect(screen.getByText('total: 3')).toBeVisible()
    expect(screen.getByText('activas: 1')).toBeVisible()
    expect(screen.getByText('en progreso: 1')).toBeVisible()
    expect(screen.getByText('expiradas: 1')).toBeVisible()
    expect(screen.getByRole('article', { name: 'Actual' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Ver todo' }))
    const articles = screen.getAllByRole('article')
    expect(articles.map((article) => article.getAttribute('aria-label'))).toEqual(['Actual', 'En curso', 'Anterior'])
    for (const [index, issuer] of ['Issuer B', 'Issuer C', 'Issuer A'].entries()) {
      expect(within(articles[index]!).getByText(issuer)).toBeVisible()
    }
    expect(within(articles[0]!).getByText('2026-01-01')).toBeVisible()
    expect(within(articles[0]!).getByText('Activa')).toBeVisible()
    expect(within(articles[1]!).getByText('En progreso')).toBeVisible()
    expect(within(articles[2]!).getByText('Expirada')).toBeVisible()
    expect(within(articles[2]!).getByText('ID: ABC-123')).toBeVisible()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
