/**
 * src/components/panels/ServicesPanel.tsx — Services panel
 *
 * The organization block: what the practice offers, in which modalities, and
 * at which rate. It is the piece that makes the sheet read as an organization
 * and not only as a CV.
 *
 * Visual language is the site's own: `Panel` / `PanelRow` chrome, `ct-*`
 * semantic tokens, no hardcoded colours. The accent dot comes from the data
 * (`service.color`), the same way the profile chip takes its colour.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { services } from '@/data/cv-data'

export function ServicesPanel() {
  const { t, language } = useApp()

  return (
    <Panel title={t('servicios', 'services')} subtitle={`${services.length}`}>
      {services.map((service) => {
        const formats = service.formats[language] ?? service.formats.es
        return (
          <PanelRow key={service.id} label={t(service.title.es, service.title.en)}>
            <div className="space-y-2">
              <p className="text-ct-subtext-1 text-xs">
                {t(service.description.es, service.description.en)}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: service.color }}
                  aria-hidden="true"
                />
                <span className="chip chip-muted">{formats.join(' · ')}</span>
                <span className="chip chip-accent">{service.priceRange}</span>
              </div>
            </div>
          </PanelRow>
        )
      })}
    </Panel>
  )
}
