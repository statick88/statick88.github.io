/**
 * src/__tests__/design/events-panel.test.tsx
 *
 * The events block publishes the participations that have evidence. Today
 * there is exactly one — the EvilSec CTF (Ekoparty 2026) — so the block must
 * publish that one with its period, role, result and public repository, and
 * nothing the data does not declare.
 *
 * The test reads the same data the panel reads, so an event added to
 * `cv-data.ts` is covered automatically.
 */

import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { EventsPanel } from '@/components/panels/EventsPanel'
import { events } from '@/data/cv-data'

describe('EventsPanel', () => {
  afterEach(() => cleanup())

  it('renders the events block', () => {
    render(
      <AppProvider initialLanguage="es">
        <EventsPanel />
      </AppProvider>,
    )
    expect(screen.getByText('eventos')).toBeTruthy()
  })

  it('renders every event with its period, role, result and repository', () => {
    render(
      <AppProvider initialLanguage="es">
        <EventsPanel />
      </AppProvider>,
    )
    for (const event of events) {
      expect(screen.getByText(event.name)).toBeTruthy()
      expect(screen.getByText(event.period)).toBeTruthy()
      expect(screen.getByText(event.role.es)).toBeTruthy()
      expect(screen.getByText(event.result.es)).toBeTruthy()
      expect(screen.getByRole('link', { name: event.url }).getAttribute('href')).toBe(event.url)
    }
  })

  it('renders one row per event, no more and no less', () => {
    render(
      <AppProvider initialLanguage="es">
        <EventsPanel />
      </AppProvider>,
    )
    // One row label per event: the row is the label the panel draws.
    const rowLabels = screen.getAllByText((_content, element) =>
      element?.classList.contains('panel-label') === true,
    )

    expect(rowLabels).toHaveLength(events.length)
    // The only participation with evidence: the EvilSec CTF (Ekoparty 2026).
    expect(rowLabels).toHaveLength(1)
  })

  it('publishes the events in English when the interface is English', () => {
    render(
      <AppProvider initialLanguage="en">
        <EventsPanel />
      </AppProvider>,
    )
    expect(screen.getByText('events')).toBeTruthy()
    for (const event of events) {
      expect(screen.getByText(event.role.en)).toBeTruthy()
      expect(screen.getByText(event.result.en)).toBeTruthy()
    }
  })
})
