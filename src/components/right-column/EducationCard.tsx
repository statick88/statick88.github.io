/**
 * src/components/right-column/EducationCard.tsx — Education entries
 *
 * Displays education history: degree, institution, program, dates.
 * Current/in-progress badge when isCurrent is true.
 * GPA display if available.
 * Print: compact list.
 *
 * @see T-019
 */

import { useApp } from '@/context/AppContext'
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
 * EducationCard — Education history display.
 *
 * - Each entry: degree, institution, bilingual program, date range.
 * - Current/in-progress badge if isCurrent is true.
 * - GPA display if available.
 * - Print: compact list with break-inside: avoid.
 */
export default function EducationCard({ education }: EducationCardProps) {
  const { t } = useApp()

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Formación Académica', 'Education')}
      </h3>

      <div className="space-y-3 print:space-y-2">
        {education.map((entry, index) => (
          <div
            key={`${entry.institution}-${index}`}
            className="print:break-inside-avoid"
          >
            {/* Degree */}
            <div className="flex items-start gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white print:text-black">
                {t(entry.program.es, entry.program.en)}
              </h4>
              {entry.isCurrent && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2 py-0.5 print:bg-transparent print:border-gray-300 print:text-black">
                  {t('En curso', 'In progress')}
                </span>
              )}
            </div>

            {/* Institution */}
            <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700">
              {entry.institution}
            </p>

            {/* Degree type */}
            <p className="text-xs text-gray-500 dark:text-gray-500 print:text-gray-600">
              {entry.degree}
            </p>

            {/* Date range + GPA row */}
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-500 print:text-gray-600">
              <span>
                {formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : t('Presente', 'Present')}
              </span>
              {entry.gpa && (
                <span className="font-medium text-gray-700 dark:text-gray-300 print:text-black">
                  GPA: {entry.gpa}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
