/**
 * src/__tests__/design/references-panel.test.tsx
 *
 * The references block is the trust block of the organization: it says where
 * the practice was carried out. It must render every institution declared in
 * the data, and for the ones with a recorded role, that role and its period.
 *
 * The test reads the same data the panel reads, so an institution added to
 * `cv-data.ts` is covered automatically.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { ReferencesPanel } from '@/components/panels/ReferencesPanel'
import { practice, work } from '@/data/cv-data'

describe('ReferencesPanel', () => {
  afterEach(() => cleanup())

  it('renders the references block', () => {
    render(
      <AppProvider>
        <ReferencesPanel />
      </AppProvider>,
    )
    expect(screen.getByText('referencias')).toBeTruthy()
  })

  it('renders every reference declared in the data', () => {
    render(
      <AppProvider>
        <ReferencesPanel />
      </AppProvider>,
    )
    for (const name of practice.referenceNames) {
      expect(screen.getByText(name)).toBeTruthy()
    }
  })

  it('renders one row per reference, no more and no less', () => {
    render(
      <AppProvider>
        <ReferencesPanel />
      </AppProvider>,
    )
    for (const name of practice.referenceNames) {
      expect(screen.getAllByText(name).length).toBe(1)
    }
    expect(screen.getAllByText('referencias').length).toBe(1)
  })

  it('shows the recorded role and period for every institution with one', () => {
    render(
      <AppProvider>
        <ReferencesPanel />
      </AppProvider>,
    )
    for (const job of work) {
      if (!(practice.referenceNames as readonly string[]).includes(job.name)) continue
      expect(
        screen.getAllByText((_content, element) => element?.textContent?.includes(job.position.es) === true)
          .length,
      ).toBeGreaterThan(0)
      expect(screen.getAllByText(new RegExp(job.startDate)).length).toBeGreaterThan(0)
    }
  })
})
