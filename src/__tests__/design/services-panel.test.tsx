/**
 * src/__tests__/design/services-panel.test.tsx
 *
 * The services block is the organization view of the sheet: it must render
 * every service declared in the data, with its modalities and its rate, so a
 * recruiter can see what the practice offers without opening the PDF.
 *
 * The test reads the same data the panel reads, so a service added to
 * `cv-data.ts` is covered automatically.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { ServicesPanel } from '@/components/panels/ServicesPanel'
import { services } from '@/data/cv-data'

describe('ServicesPanel', () => {
  afterEach(() => cleanup())

  it('renders the services block', () => {
    render(
      <AppProvider>
        <ServicesPanel />
      </AppProvider>,
    )
    expect(screen.getByText('servicios')).toBeTruthy()
  })

  it('renders every declared service with its modalities and rate', () => {
    render(
      <AppProvider>
        <ServicesPanel />
      </AppProvider>,
    )
    for (const service of services) {
      expect(screen.getByText(service.title.es)).toBeTruthy()
      expect(screen.getByText(service.priceRange)).toBeTruthy()
      expect(screen.getByText(service.formats.es.join(' · '))).toBeTruthy()
    }
  })

  it('renders one row per service, no more and no less', () => {
    render(
      <AppProvider>
        <ServicesPanel />
      </AppProvider>,
    )
    for (const service of services) {
      expect(screen.getAllByText(service.title.es).length).toBe(1)
    }
    expect(screen.getAllByText('servicios').length).toBe(1)
  })
})
