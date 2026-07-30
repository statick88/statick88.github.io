/**
 * src/components/left-column/CertificationsSummaryCard.tsx — Certifications summary
 *
 * Compact sidebar display of certifications:
 * - Count by category with category badges
 * - Active/expired/renewing status indicators
 * - Link to full certifications section (anchor)
 *
 * @see T-015
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { CertificationEntry } from '@/lib/schemas/cv-data'

interface CertificationsSummaryCardProps {
  /** Array of certification entries */
  certifications: CertificationEntry[]
}

/**
 * Status indicator configuration.
 */
const STATUS_CONFIG: Record<string, { dot: string; text: string; label: { es: string; en: string } }> = {
  active: {
    dot: 'bg-green-500',
    text: 'text-green-600 dark:text-green-400',
    label: { es: 'Activa', en: 'Active' },
  },
  'in-progress': {
    dot: 'bg-yellow-500',
    text: 'text-yellow-600 dark:text-yellow-400',
    label: { es: 'En progreso', en: 'In progress' },
  },
  expired: {
    dot: 'bg-gray-400',
    text: 'text-gray-500 dark:text-gray-400',
    label: { es: 'Expirada', en: 'Expired' },
  },
}

/**
 * CertificationsSummaryCard — Compact cert count with status and anchor link.
 *
 * - Groups certifications by status (active, in-progress, expired).
 * - Shows total count and per-status breakdown.
 * - "Ver todas" links to the full certifications section via anchor.
 * - Print: shows all details in compact form.
 */
export default function CertificationsSummaryCard({ certifications }: CertificationsSummaryCardProps) {
  const { t } = useApp()

  const statusGroups = useMemo(() => {
    const groups: Record<string, CertificationEntry[]> = {
      active: [],
      'in-progress': [],
      expired: [],
    }
    for (const cert of certifications) {
      const status = cert.status ?? 'active'
      if (groups[status]) {
        groups[status].push(cert)
      } else {
        groups.active!.push(cert)
      }
    }
    return groups
  }, [certifications])

  const totalActive = statusGroups.active!.length
  const totalInProgress = statusGroups['in-progress']!.length
  const totalExpired = statusGroups.expired!.length

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Certificaciones', 'Certifications')}
      </h3>

      {/* Total count */}
      <p className="text-2xl font-bold text-gray-900 dark:text-white print:text-black">
        {certifications.length}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
          {t('total', 'total')}
        </span>
      </p>

      {/* Status breakdown */}
      <ul className="space-y-1.5 text-sm">
        {totalActive > 0 && (
          <li className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG.active!.dot}`} aria-hidden="true" />
            <span className={STATUS_CONFIG.active!.text}>
              {totalActive} {t(STATUS_CONFIG.active!.label.es, STATUS_CONFIG.active!.label.en)}
            </span>
          </li>
        )}
        {totalInProgress > 0 && (
          <li className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG['in-progress']!.dot}`} aria-hidden="true" />
            <span className={STATUS_CONFIG['in-progress']!.text}>
              {totalInProgress} {t(STATUS_CONFIG['in-progress']!.label.es, STATUS_CONFIG['in-progress']!.label.en)}
            </span>
          </li>
        )}
        {totalExpired > 0 && (
          <li className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG.expired!.dot}`} aria-hidden="true" />
            <span className={STATUS_CONFIG.expired!.text}>
              {totalExpired} {t(STATUS_CONFIG.expired!.label.es, STATUS_CONFIG.expired!.label.en)}
            </span>
          </li>
        )}
      </ul>

      {/* Anchor link to full section */}
      <a
        href="#certifications"
        className="inline-flex items-center gap-1 text-xs text-blue-500 dark:text-blue-400 hover:underline transition-colors print:text-black print:underline"
      >
        {t('Ver todas →', 'View all →')}
      </a>
    </div>
  )
}
