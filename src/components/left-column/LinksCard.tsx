/**
 * src/components/left-column/LinksCard.tsx — External links panel
 *
 * One row per network: the network name is the row label, the link is the
 * value. The URL carries the accent colour so it reads as clickable, and
 * every link opens in a new tab with `rel="noopener noreferrer"`.
 *
 * @see T-012
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'

interface LinksCardProps {
  /** LinkedIn URL */
  linkedin?: string
  /** GitHub URL */
  github?: string
  /** Portfolio URL */
  portfolio?: string
}

/**
 * Extracts a display label from a URL.
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
 * LinksCard — GitHub, LinkedIn and Portfolio, one row each.
 *
 * - Rows without a URL are skipped entirely.
 * - Each link opens in a new tab with `rel="noopener noreferrer"`.
 */
export default function LinksCard({ linkedin, github, portfolio }: LinksCardProps) {
  const { t } = useApp()

  const links: Array<{
    key: string
    url: string
    label: { es: string; en: string }
  }> = []

  if (linkedin) {
    links.push({
      key: 'linkedin',
      url: linkedin,
      label: { es: 'LinkedIn', en: 'LinkedIn' },
    })
  }
  if (github) {
    links.push({
      key: 'github',
      url: github,
      label: { es: 'GitHub', en: 'GitHub' },
    })
  }
  if (portfolio) {
    links.push({
      key: 'portfolio',
      url: portfolio,
      label: { es: 'Portafolio', en: 'Portfolio' },
    })
  }

  if (links.length === 0) return null

  return (
    <Panel title={t('enlaces', 'links')} subtitle={`${links.length}`}>
      {links.map(({ key, url, label }) => (
        <PanelRow key={key} label={t(label.es, label.en)}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ct-accent-bright transition-colors hover:text-ct-accent-bright print:text-black"
          >
            {getDisplayUrl(url)}
          </a>
          <span className="ml-1 text-[11px] text-ct-subtext-0 print:hidden" aria-hidden="true">
            ↗
          </span>
        </PanelRow>
      ))}
    </Panel>
  )
}
