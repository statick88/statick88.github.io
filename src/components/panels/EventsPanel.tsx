/**
 * src/components/panels/EventsPanel.tsx — Events panel
 *
 * The participations that have evidence: the events the practice took part
 * in, with the period, the role, the result and the public repository that
 * backs them. The block only publishes what the data declares, so it can
 * never show an event without evidence.
 *
 * Visual language is the site's own: `Panel` / `PanelRow` chrome, `ct-*`
 * semantic tokens, no hardcoded colours.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { events } from '@/data/cv-data'

export function EventsPanel() {
  const { t } = useApp()

  return (
    <Panel title={t('eventos', 'events')} subtitle={`${events.length}`}>
      {events.map((event) => (
        <PanelRow key={event.name} label={event.name}>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-muted">{event.period}</span>
              <span className="chip chip-accent">{t(event.role.es, event.role.en)}</span>
            </div>
            <p className="text-ct-subtext-1 text-xs">{t(event.result.es, event.result.en)}</p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-ct-accent-bright transition-colors hover:text-ct-accent-bright print:text-black"
            >
              {event.url}
            </a>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
