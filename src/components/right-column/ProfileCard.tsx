/**
 * src/components/right-column/ProfileCard.tsx — Executive profile card
 *
 * Displays executive headline, role, summary, and key KPI metrics.
 * Bilingual support for role and summary text.
 * Metrics highlight row with large number + label per KPI.
 * Print: compact layout, no animations.
 *
 * @see T-016
 */

import { useApp } from '@/context/AppContext'
import type { ExecutiveProfile, MetricsSummary } from '@/lib/schemas/cv-data'

interface ProfileCardProps {
  /** Executive profile data */
  profile: ExecutiveProfile
  /** Metrics summary data */
  metrics: MetricsSummary
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
 * ProfileCard — Executive headline, role, summary, and KPI metrics.
 *
 * - Name as large heading.
 * - Role displayed bilingually via t().
 * - Summary paragraph bilingually.
 * - 4-column KPI row: each with large number + bilingual label.
 * - Print mode: compact, no background, no blur.
 */
export default function ProfileCard({ profile, metrics }: ProfileCardProps) {
  const { t } = useApp()

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      {/* Executive Headline */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-sans print:text-black print:text-lg">
        {profile.name}
      </h2>

      {/* Role */}
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400 print:text-black">
        {t(profile.role.es, profile.role.en)}
      </p>

      {/* Summary */}
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed print:text-gray-700">
        {t(profile.summary.es, profile.summary.en)}
      </p>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 print:gap-2">
        {KPI_CONFIG.map((kpi) => {
          const value = metrics[kpi.key]
          return (
            <div key={kpi.key} className="text-center print:text-left">
              <p className="text-xl font-bold text-gray-900 dark:text-white print:text-black print:text-base">
                {value}{kpi.suffix ?? ''}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 print:text-gray-600">
                {t(kpi.label.es, kpi.label.en)}
              </p>
            </div>
          )
        })}
      </div>

      <style>{`
        @media print {
          .print\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
          .print\\:text-base { font-size: 0.875rem; line-height: 1.25rem; }
        }
      `}</style>
    </div>
  )
}
