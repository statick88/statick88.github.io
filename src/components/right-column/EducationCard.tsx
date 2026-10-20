/**
 * src/components/right-column/EducationCard.tsx — Education panel
 *
 * One row per education entry, in the console idiom:
 *
 *   - the row label is the degree,
 *   - the row value carries the study programme, the institution, the period
 *     and the GPA / score.
 *
 * Every colour comes from the semantic tokens.
 *
 * @see T-019
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { EducationEntry } from '@/lib/schemas/cv-data'

interface EducationCardProps {
  /** Array of education entries */
  education: EducationEntry[]
}

/**
 * Format a date string as "MMM YYYY".
 */
function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[date.getMonth()]!} ${date.getFullYear()}`
}

/**
 * EducationCard — Education history, one panel row per entry.
 *
 * - Row label: the degree.
 * - Row value: programme, in-progress badge, institution, period and GPA.
 * - Print: compact, no page break inside a row.
 */
export default function EducationCard({ education }: EducationCardProps) {
  const { t } = useApp()

  return (
    <Panel title={t('educación', 'education')} subtitle={`${education.length}`}>
      {education.map((entry, index) => (
        <PanelRow key={`${entry.institution}-${index}`} label={entry.degree}>
          <div className="space-y-1.5">
            {/* Programme + in-progress badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ct-text print:text-black">
                {t(entry.program.es, entry.program.en)}
              </span>
              {entry.isCurrent && (
                <span className="chip chip-warn">
                  {t('En curso', 'In progress')}
                </span>
              )}
            </div>

            {/* Institution */}
            <p className="text-[11px] text-ct-subtext-1 print:text-gray-700">
              {entry.institution}
            </p>

            {/* Period + GPA */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-ct-subtext-0 print:text-gray-600">
                {formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : t('Presente', 'Present')}
              </span>
              {entry.gpa && (
                <span className="chip chip-muted">GPA: {entry.gpa}</span>
              )}
            </div>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
