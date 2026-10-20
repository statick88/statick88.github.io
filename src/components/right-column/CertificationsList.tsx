/**
 * src/components/right-column/CertificationsList.tsx — Certifications panel
 *
 * One row per certification, in the console idiom:
 *
 *   - the row label is the certification name,
 *   - the row value carries the status chip, the issuer, the date and the
 *     credential id.
 *
 * The panel also carries the counts the old summary card used to own: the
 * total lives in the panel subtitle and the per-status counts live in a
 * summary row, both computed from the same `certifications` prop.
 *
 * @see T-020
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { CertificationEntry } from '@/lib/schemas/cv-data'

interface CertificationsListProps {
  /** Array of certification entries */
  certifications: CertificationEntry[]
}

/** The three statuses the panel knows about. */
type CertificationStatus = 'active' | 'in-progress' | 'expired'

/**
 * Status configuration: the chip variant carries the semantics, the label
 * carries the words, so the meaning survives a monochrome print.
 */
const STATUS_CONFIG: Record<CertificationStatus, { chip: string; label: { es: string; en: string } }> = {
  active: {
    chip: 'chip-ok',
    label: { es: 'Activa', en: 'Active' },
  },
  'in-progress': {
    chip: 'chip-warn',
    label: { es: 'En progreso', en: 'In progress' },
  },
  expired: {
    chip: 'chip-muted',
    label: { es: 'Expirada', en: 'Expired' },
  },
}

/**
 * Sort order for status badges: active first, then in-progress, then expired.
 * Unknown statuses sort last.
 */
const STATUS_ORDER: Record<string, number> = {
  active: 0,
  'in-progress': 1,
  expired: 2,
}

/**
 * Resolve the effective status of a certification.
 * Unknown statuses fall back to "active", exactly like the badge does.
 */
function resolveStatus(status: string | undefined): CertificationStatus {
  if (status === 'active' || status === 'in-progress' || status === 'expired') {
    return status
  }
  return 'active'
}

/**
 * CertificationsList — Certifications with status chips and the per-status counts.
 *
 * - Sorted: active first, then in-progress, then expired.
 * - One row per certification: name as the label, details as the value.
 * - A summary row carries the total, active, in-progress and expired counts.
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

  const counts = useMemo(() => {
    const result: Record<CertificationStatus, number> = {
      active: 0,
      'in-progress': 0,
      expired: 0,
    }
    for (const cert of certifications) {
      result[resolveStatus(cert.status)] += 1
    }
    return result
  }, [certifications])

  return (
    <Panel title={t('certificaciones', 'certifications')} subtitle={`${certifications.length}`}>
      {/* Counts carried by the old summary card */}
      <PanelRow label={t('resumen', 'summary')}>
        <div className="flex flex-wrap gap-2">
          <span className="chip chip-accent">
            {t('total', 'total')}: {certifications.length}
          </span>
          <span className="chip chip-ok">
            {t('activas', 'active')}: {counts.active}
          </span>
          <span className="chip chip-warn">
            {t('en progreso', 'in progress')}: {counts['in-progress']}
          </span>
          <span className="chip chip-muted">
            {t('expiradas', 'expired')}: {counts.expired}
          </span>
        </div>
      </PanelRow>

      {sorted.map((cert, index) => {
        const status = STATUS_CONFIG[resolveStatus(cert.status)]
        return (
          <PanelRow key={`${cert.name.en}-${index}`} label={t(cert.name.es, cert.name.en)}>
            <div className="space-y-1.5">
              {/* Status + issuer + date */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip ${status.chip}`}>
                  {t(status.label.es, status.label.en)}
                </span>
                <span className="text-[11px] text-ct-subtext-1 print:text-gray-700">
                  {cert.issuer}
                </span>
                {cert.date && (
                  <span className="text-[11px] text-ct-subtext-0 print:text-gray-600">
                    {cert.date}
                  </span>
                )}
              </div>

              {/* Credential ID */}
              {cert.credentialId && (
                <p className="text-[10px] text-ct-subtext-0 print:text-gray-600">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>
          </PanelRow>
        )
      })}
    </Panel>
  )
}
