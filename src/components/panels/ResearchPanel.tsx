/**
 * src/components/panels/ResearchPanel.tsx — Academic production panel
 *
 * Articles and theses, listed as rows: the citation on the left, the work on
 * the right. Citations are the only number in the panel, so it carries the
 * accent colour.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { publications } from '@/data/publications'

export function ResearchPanel() {
  const { t } = useApp()

  return (
    <Panel title={t('investigación', 'research')} subtitle={`${publications.length}`}>
      {publications.map((publication) => (
        <PanelRow
          key={publication.id}
          label={
            publication.type === 'thesis'
              ? t('tesis', 'thesis')
              : t('artículo', 'article')
          }
        >
          <div className="space-y-2">
            <p className="text-ct-text text-sm font-medium">{publication.title}</p>
            <p className="text-ct-subtext-1 text-xs">{publication.journal}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-muted">{publication.year}</span>
              <span className="chip chip-accent">
                {publication.citations} {t('citas', 'citations')}
              </span>
              {publication.tags.map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
              <a
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-accent hover:border-ct-accent"
              >
                {t('ver →', 'view →')}
              </a>
            </div>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
