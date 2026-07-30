/**
 * src/components/left-column/LinksCard.tsx — External links card
 *
 * Displays GitHub, LinkedIn, and Portfolio links with icons.
 * External link indicators, rel="noopener noreferrer", bilingual labels.
 * Print: URLs in parentheses after labels.
 *
 * @see T-012
 */

import { useApp } from '@/context/AppContext'

interface LinksCardProps {
  /** LinkedIn URL */
  linkedin?: string
  /** GitHub URL */
  github?: string
  /** Portfolio URL */
  portfolio?: string
}

/**
 * SVG icon paths for each link type.
 */
const LINK_ICONS = {
  linkedin: (
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
  ),
  github: (
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  ),
  portfolio: (
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  ),
} as const

/**
 * Extracts a display label from a URL for print fallback.
 * e.g. "https://github.com/statick88" → "github.com/statick88"
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
 * LinksCard — GitHub, LinkedIn, Portfolio with icons and external indicators.
 *
 * - Each link opens in a new tab with `rel="noopener noreferrer"`.
 * - External link indicator (↗) visible on hover.
 * - Print mode: shows URL in parentheses after the label.
 */
export default function LinksCard({ linkedin, github, portfolio }: LinksCardProps) {
  const { t } = useApp()

  const links: Array<{
    key: string
    url: string
    label: { es: string; en: string }
    icon: JSX.Element
  }> = []

  if (linkedin) {
    links.push({
      key: 'linkedin',
      url: linkedin,
      label: { es: 'LinkedIn', en: 'LinkedIn' },
      icon: LINK_ICONS.linkedin,
    })
  }
  if (github) {
    links.push({
      key: 'github',
      url: github,
      label: { es: 'GitHub', en: 'GitHub' },
      icon: LINK_ICONS.github,
    })
  }
  if (portfolio) {
    links.push({
      key: 'portfolio',
      url: portfolio,
      label: { es: 'Portafolio', en: 'Portfolio' },
      icon: LINK_ICONS.portfolio,
    })
  }

  if (links.length === 0) return null

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Enlaces', 'Links')}
      </h3>

      <ul className="space-y-2 text-sm">
        {links.map(({ key, url, label, icon }) => (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors group"
            >
              <svg
                className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 hidden print:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {icon}
              </svg>
              <span>{t(label.es, label.en)}</span>
              <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity hidden print:hidden" aria-hidden="true">
                ↗
              </span>
              <span className="hidden print:inline text-gray-500 text-xs">
                ({getDisplayUrl(url)})
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
