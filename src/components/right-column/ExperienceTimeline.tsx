/**
 * src/components/right-column/ExperienceTimeline.tsx — Experience panel
 *
 * One row per experience entry, in the console idiom:
 *
 *   - the row label is the company,
 *   - the row value carries the role, the period, the company site, the
 *     metric chips, the technology stack and the achievement bullets.
 *
 * Every colour comes from the semantic tokens; the achievement bullets are
 * the only prose block, so they opt back into the humanist sans
 * (`.prose-sans`).
 *
 * @see T-017
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { ExperienceEntry } from '@/lib/schemas/cv-data'

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
 * Extracts a compact display label from a URL.
 * e.g. "https://abacom.edu.ec/" → "abacom.edu.ec"
 */
function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname + parsed.pathname.replace(/\/+$/, '')
  } catch {
    return url
  }
}

/**
 * ExperienceTimeline — Professional experience, one panel row per entry.
 *
 * - Row label: the company.
 * - Row value: role, current badge, company site, date range, metric chips,
 *   technology stack and the achievement bullets.
 * - The bullets follow the active language.
 * - Print: compact, no page break inside a row.
 */
export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  const { t, language } = useApp()

  return (
    <Panel title={t('experiencia', 'experience')} subtitle={`${experience.length}`}>
      {experience.map((entry, index) => (
        <PanelRow key={`${entry.company}-${index}`} label={entry.company}>
          <div className="space-y-2">
            {/* Role + current badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ct-text print:text-black">
                {t(entry.position.es, entry.position.en)}
              </span>
              {entry.isCurrent && (
                <span className="chip chip-ok">
                  <span className="h-1.5 w-1.5 rounded-full bg-ct-ok print:bg-black" aria-hidden="true" />
                  {t('Actual', 'Current')}
                </span>
              )}
            </div>

            {/* Company site */}
            {entry.url && (
              <p className="text-[11px] text-ct-subtext-1 print:text-gray-700">
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ct-accent-bright transition-colors hover:text-ct-accent-bright print:text-black"
                >
                  {getDisplayUrl(entry.url)}
                </a>
              </p>
            )}

            {/* Date range */}
            <p className="text-[11px] text-ct-subtext-0 print:text-gray-600">
              {formatDate(entry.startDate)} – {entry.endDate ? formatDate(entry.endDate) : t('Presente', 'Present')}
            </p>

            {/* Metric chips */}
            {entry.metrics && entry.metrics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.metrics.slice(0, 4).map((metric, mIndex) => (
                  <span key={mIndex} className="chip chip-accent">
                    <span className="font-bold">{metric.value}</span>
                    {metric.unit && <span className="text-[10px] text-ct-subtext-1 print:text-black">{metric.unit}</span>}
                    <span className="text-[10px] text-ct-subtext-1 print:text-black">
                      {t(metric.label.es, metric.label.en)}
                    </span>
                  </span>
                ))}
              </div>
            )}

            {/* Tech stack */}
            {entry.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entry.technologies.map((tech) => (
                  <span key={tech} className="chip chip-muted">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Achievements */}
            {entry.highlights.en.length > 0 && (
              <ul className="prose-sans max-w-[70ch] space-y-1 print:text-black">
                {(language === 'es' ? entry.highlights.es : entry.highlights.en).map((highlight, hIndex) => (
                  <li key={hIndex} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 bg-ct-accent-bright print:bg-black" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
