/**
 * src/components/right-column/ProfileCard.tsx — Summary panel (reference design)
 *
 * This component is the reference implementation of the console panel idiom:
 *
 *   - the panel chrome comes from `Panel` / `PanelRow`,
 *   - long prose opts back into the humanist sans (`.prose-sans`),
 *   - the KPI block is a hairline grid, exactly like a settings summary,
 *   - every colour comes from the semantic tokens (never hardcoded hex).
 *
 * @see T-016
 */

import { useApp } from '@/context/AppContext'
import { Panel } from '@/components/panels/Panel'
import type { ExecutiveProfile, MetricsSummary } from '@/lib/schemas/cv-data'

interface ProfileCardProps {
  /** Executive profile data */
  profile: ExecutiveProfile
  /** Metrics summary data */
  metrics: MetricsSummary
  /** Long professional headline (degrees, experience, specialisations) */
  headline?: { es: string; en: string }
}

/**
 * KPI configuration: metric key, label, and format.
 */
const KPI_CONFIG: Array<{
  key: keyof MetricsSummary
  label: { es: string; en: string }
  suffix?: string
}> = [
  { key: 'yearsExperience', label: { es: 'Años de Experiencia', en: 'Years Experience' }, suffix: '+' },
  { key: 'githubPublicRepos', label: { es: 'Repos Públicos', en: 'Public Repos' } },
  { key: 'averageCohortScore', label: { es: 'Promedio Cohorte', en: 'Avg Cohort Score' }, suffix: '%' },
  { key: 'languagesSpoken', label: { es: 'Idiomas', en: 'Languages' } },
]

/**
 * ProfileCard — Summary prose plus the KPI grid.
 *
 * The name lives in the identity block, so this panel carries the summary and
 * the numbers, not the headline.
 */
export default function ProfileCard({ profile, metrics, headline }: ProfileCardProps) {
  const { t } = useApp()

  return (
    <Panel title={t('resumen', 'summary')}>
      <div className="cv-summary px-4 py-4 space-y-3">
        {headline ? (
          <p className="prose-sans text-ct-subtext-1 max-w-[70ch]">
            {t(headline.es, headline.en)}
          </p>
        ) : null}
        <p className="prose-sans max-w-[70ch]">{t(profile.summary.es, profile.summary.en)}</p>
      </div>

      <div className="cv-metrics grid grid-cols-2 gap-px bg-ct-line border-t border-ct-line sm:grid-cols-4 print:bg-white print:gap-0">
        {KPI_CONFIG.map((kpi) => {
          const value = metrics[kpi.key]
          return (
            <div key={kpi.key} className="bg-ct-surface-0 px-4 py-3 print:bg-white">
              <p className="text-lg font-bold text-ct-accent-bright print:text-black">
                {value}
                {kpi.suffix ?? ''}
              </p>
              <p className="text-[11px] uppercase tracking-[0.06em] text-ct-subtext-0 print:text-gray-700">
                {t(kpi.label.es, kpi.label.en)}
              </p>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
