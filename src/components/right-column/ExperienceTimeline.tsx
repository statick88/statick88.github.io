/**
 * src/components/right-column/ExperienceTimeline.tsx — Experience timeline
 *
 * Vertical timeline with dots/connectors for each experience entry.
 * Each entry: role, company, date range, location, metric chips,
 * tech stack pills, and achievements.
 * Current role indicator: green dot badge.
 * Print: compact, no animations, break-inside: avoid.
 *
 * @see T-017
 */

import { useApp } from '@/context/AppContext'
import type { ExperienceEntry, BilingualString } from '@/lib/schemas/cv-data'

interface ExperienceTimelineProps {
  /** Array of experience entries */
  experience: ExperienceEntry[]
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
 * ExperienceTimeline — Vertical timeline of professional experience.
 *
 * - Left border connector with dot at each entry.
 * - Each entry shows: role, company, date range, optional location.
 * - ≥2 metric chips per entry if metrics available.
 * - Tech stack as small pills.
 * - Achievements as bilingual bullet list.
 * - Current role: green dot indicator.
 * - Print: compact, no animations, prevent page breaks inside entries.
 */
export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  const { t, language } = useApp()

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Experiencia', 'Experience')}
      </h3>

      <div className="relative space-y-4">
        {/* Vertical connector line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700 print:bg-gray-300" aria-hidden="true" />

        {experience.map((entry, index) => (
          <div
            key={`${entry.company}-${index}`}
            className="relative pl-6 print:pl-5 print:break-inside-avoid"
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 ${
                entry.isCurrent
                  ? 'bg-green-500 border-green-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 print:border-gray-400'
              }`}
              aria-hidden="true"
            />

            {/* Entry content */}
            <div className="space-y-1.5">
              {/* Header: role + current badge */}
              <div className="flex items-start gap-2 flex-wrap">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white print:text-black">
                  {t(entry.position.es, entry.position.en)}
                </h4>
                {entry.isCurrent && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/30 rounded-full px-2 py-0.5 print:bg-transparent print:border-gray-300 print:text-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 print:bg-gray-500" aria-hidden="true" />
                    {t('Actual', 'Current')}
                  </span>
                )}
              </div>

              {/* Company */}
              <p className="text-sm text-gray-600 dark:text-gray-400 print:text-gray-700">
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {entry.company}
                  </a>
                ) : (
                  entry.company
                )}
              </p>

              {/* Date range */}
              <p className="text-xs text-gray-500 dark:text-gray-500 print:text-gray-600">
                {formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : t('Presente', 'Present')}
              </p>

              {/* Metrics chips */}
              {entry.metrics && entry.metrics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1 print:gap-1">
                  {entry.metrics.slice(0, 4).map((metric, mIndex) => (
                    <span
                      key={mIndex}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md print:bg-transparent print:border-gray-300 print:text-black"
                    >
                      <span className="font-bold">{metric.value}</span>
                      {metric.unit && <span className="opacity-60">{metric.unit}</span>}
                      <span className="opacity-60 hidden sm:inline">
                        {t(metric.label.es, metric.label.en)}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Tech stack pills */}
              {entry.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1 print:gap-0.5">
                  {entry.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded print:bg-transparent print:text-gray-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Achievements */}
              {entry.highlights.en.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-xs text-gray-600 dark:text-gray-300 print:text-gray-700">
                  {(language === 'es' ? entry.highlights.es : entry.highlights.en).map((highlight, hIndex) => (
                    <li key={hIndex} className="flex items-start gap-1.5">
                      <span className="text-blue-500 dark:text-blue-400 mt-0.5 shrink-0 print:text-black" aria-hidden="true">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
