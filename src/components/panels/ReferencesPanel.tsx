/**
 * src/components/panels/ReferencesPanel.tsx — References panel
 *
 * The reference block of the organization: the institutions where the practice
 * was carried out, with the role held and the period at each one.
 *
 * The names come from `practice.referenceNames` — the same list the CV
 * publishes — and the detail from `work`, so the panel cannot say anything the
 * data does not. Visual language is the site's own: `Panel` / `PanelRow` chrome
 * and `ct-*` semantic tokens.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { practice, work } from '@/data/cv-data'

export function ReferencesPanel() {
  const { t } = useApp()

  const byInstitution = new Map<string, Array<(typeof work)[number]>>()
  for (const job of work) {
    const roles = byInstitution.get(job.name) ?? []
    roles.push(job)
    byInstitution.set(job.name, roles)
  }

  return (
    <Panel title={t('referencias', 'references')} subtitle={`${practice.referenceNames.length}`}>
      {practice.referenceNames.map((name) => {
        const roles = byInstitution.get(name) ?? []
        return (
          <PanelRow key={name} label={name}>
            <div className="space-y-1">
              {roles.length === 0 ? (
                <p className="text-ct-subtext-1 text-xs">
                  {t('Institución de referencia', 'Reference institution')}
                </p>
              ) : (
                roles.map((role) => (
                  <p
                    key={`${role.name}-${role.startDate}`}
                    className="text-ct-subtext-1 text-xs"
                  >
                    {t(role.position.es, role.position.en)} · {role.startDate} -{' '}
                    {role.endDate ?? t('Presente', 'Present')}
                  </p>
                ))
              )}
            </div>
          </PanelRow>
        )
      })}
    </Panel>
  )
}
