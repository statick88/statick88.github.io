/**
 * src/components/panels/__tests__/EngagementsPanel.test.tsx
 *
 * The authorized security engagements are the proof of the security service:
 * the pentests the practice carried out. The block used to live only in the
 * PDF, so the panel must publish exactly what the data declares — period,
 * sector, scope and outcome — and nothing more.
 *
 * The test reads the same data the panel reads, so an engagement added to
 * `cv-data.ts` is covered automatically.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { EngagementsPanel } from '@/components/panels/EngagementsPanel'
import { practice } from '@/data/cv-data'

describe('EngagementsPanel', () => {
  afterEach(() => cleanup())

  it('renders the engagements block', () => {
    render(
      <AppProvider initialLanguage="es">
        <EngagementsPanel />
      </AppProvider>,
    )
    expect(screen.getByText('encargos')).toBeTruthy()
  })

  it('renders every engagement with its period, sector, scope and outcome', () => {
    render(
      <AppProvider initialLanguage="es">
        <EngagementsPanel />
      </AppProvider>,
    )
    for (const engagement of practice.engagements) {
      expect(screen.getByText(engagement.period)).toBeTruthy()
      expect(screen.getByText(engagement.sector.es)).toBeTruthy()
      expect(screen.getByText(engagement.scope.es)).toBeTruthy()
      expect(screen.getByText(engagement.outcome.es)).toBeTruthy()
    }
  })

  it('renders one row per engagement, no more and no less', () => {
    render(
      <AppProvider initialLanguage="es">
        <EngagementsPanel />
      </AppProvider>,
    )
    // One row label per engagement: the row is the label the panel draws.
    const rowLabels = screen.getAllByText((_content, element) =>
      element?.classList.contains('panel-label') === true,
    )

    expect(rowLabels).toHaveLength(practice.engagements.length)
    expect(rowLabels).toHaveLength(3)
  })

  it('publishes the engagements in English when the interface is English', () => {
    render(
      <AppProvider initialLanguage="en">
        <EngagementsPanel />
      </AppProvider>,
    )
    expect(screen.getByText('engagements')).toBeTruthy()
    for (const engagement of practice.engagements) {
      expect(screen.getByText(engagement.sector.en)).toBeTruthy()
      expect(screen.getByText(engagement.scope.en)).toBeTruthy()
      expect(screen.getByText(engagement.outcome.en)).toBeTruthy()
    }
  })
})
