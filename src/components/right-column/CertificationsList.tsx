/**
 * src/components/right-column/CertificationsList.tsx — Certifications list
 *
 * Full certifications display: name, issuer, date, status badge, credential ID.
 * Sorted: active first, then by date.
 * Status badges: active=green, in-progress=yellow, expired=gray.
 * Print: full grouped list.
 *
 * @see T-020
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { CertificationEntry } from '@/lib/schemas/cv-data'

interface CertificationsListProps {
  /** Array of certification entries */
  certifications: CertificationEntry[]
}

/**
 * Status badge configuration.
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
 * Sort order for status badges: active first, then in-progress, then expired.
 */
const STATUS_ORDER: Record<string, number> = {
  active: 0,
  'in-progress': 1,
  expired: 2,
}

/**
 * CertificationsList — Full certifications display with status badges.
 *
 * - Sorted: active first, then in-progress, then expired.
 * - Each entry: name (bilingual), issuer, date, status badge, credential ID.
 * - Status badge: colored dot + text label.
 * - Print: full list, grouped by status.
 */
export default function CertificationsList({ certifications }: CertificationsListProps) {
  const { t } = useApp()

  const sorted = useMemo(() => {
    return [...certifications].sort((a, b) => {
      const aOrder = STATUS_ORDER[a.status ?? 'active'] ?? 3
      const bOrder = STATUS_ORDER[b.status ?? 'active'] ?? 3
      if (aOrder !== bOrder) return aOrder - bOrder
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [certifications])

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Certificaciones', 'Certifications')}
      </h3>

      <div className="space-y-2 print:space-y-1.5">
        {sorted.map((cert, index) => {
          const status = STATUS_CONFIG[cert.status ?? 'active'] ?? STATUS_CONFIG.active!
          return (
            <div
              key={`${cert.name.en}-${index}`}
              className="flex items-start gap-2 print:break-inside-avoid"
            >
              {/* Status dot */}
              <span
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${status.dot}`}
                aria-hidden="true"
              />

              <div className="flex-1 min-w-0">
                {/* Name + status badge row */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white print:text-black">
                    {t(cert.name.es, cert.name.en)}
                  </h4>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${status.text} ${
                    cert.status === 'active' ? 'border-green-500/30 bg-green-500/10' :
                    cert.status === 'in-progress' ? 'border-yellow-500/30 bg-yellow-500/10' :
                    'border-gray-400/30 bg-gray-400/10'
                  } print:bg-transparent print:border-gray-300 print:text-black`}>
                    {t(status.label.es, status.label.en)}
                  </span>
                </div>

                {/* Issuer + date */}
                <p className="text-xs text-gray-500 dark:text-gray-400 print:text-gray-600">
                  {cert.issuer} · {cert.date}
                </p>

                {/* Credential ID */}
                {cert.credentialId && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono print:text-gray-500">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
