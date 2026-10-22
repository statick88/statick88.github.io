/**
 * src/components/panels/EngagementsPanel.tsx — Authorized security engagements
 *
 * The proof of the security service: the authorized pentests the practice
 * carried out. The block used to live only in the PDF; here it publishes
 * exactly what the data declares — period, sector, scope and outcome — so the
 * site cannot say more than the published CV does.
 *
 * Visual language is the site's own: `Panel` / `PanelRow` chrome and `ct-*`
 * semantic tokens, no hardcoded colours.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { practice } from '@/data/cv-data'

export function EngagementsPanel() {
  const { t } = useApp()

  return (
    <Panel title={t('encargos', 'engagements')} subtitle={`${practice.engagements.length}`}>
      {practice.engagements.map((engagement) => (
        <PanelRow key={engagement.period} label={engagement.period}>
          <div className="space-y-2">
            <p className="text-ct-text text-sm font-medium">
              {t(engagement.sector.es, engagement.sector.en)}
            </p>
            <p className="text-ct-subtext-1 text-xs">
              {t(engagement.scope.es, engagement.scope.en)}
            </p>
            <p className="text-ct-subtext-1 text-xs">
              {t(engagement.outcome.es, engagement.outcome.en)}
            </p>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
