/**
 * src/components/left-column/ContactCard.tsx — Contact information panel
 *
 * One row per contact field: email, phone, location. The actionable fields
 * stay actionable (`mailto:` / `tel:`), and each one keeps the
 * copy-to-clipboard affordance with its transient "copiado" feedback.
 *
 * The panel chrome comes from `Panel` / `PanelRow`; every colour comes from
 * the semantic tokens.
 *
 * @see T-011
 */

import { useState, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { ContactInfo } from '@/lib/schemas/cv-data'

interface ContactCardProps {
  /** Contact information data */
  contact: ContactInfo
}

/**
 * Copy text to clipboard and show confirmation.
 */
function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(label)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // Clipboard API unavailable — silent fail
    }
  }, [])

  return { copied, copy }
}

/**
 * ContactCard — Email, phone and location, one row each.
 *
 * - Email wrapped in `mailto:`, phone in `tel:`.
 * - Each actionable item has a copy button with transient "¡Copiado!" feedback.
 * - Print mode: plain text without the copy affordance.
 */
export default function ContactCard({ contact }: ContactCardProps) {
  const { t } = useApp()
  const { copied, copy } = useCopyToClipboard()
  const phone = contact.phone

  return (
    <Panel title={t('contacto', 'contact')}>
      {/* Email */}
      <PanelRow label={t('correo', 'email')}>
        <div className="space-y-1">
          <a
            href={`mailto:${contact.email}`}
            className="text-ct-text transition-colors hover:text-ct-accent-bright print:text-black"
          >
            {contact.email}
          </a>
          <div className="print:hidden">
            <button
              type="button"
              onClick={() => copy(contact.email, 'email')}
              className="text-[11px] text-ct-subtext-0 transition-colors hover:text-ct-accent-bright"
              aria-label={t('Copiar correo', 'Copy email')}
            >
              <span aria-live="polite">
                {copied === 'email' ? t('¡Copiado!', 'Copied!') : t('Copiar', 'Copy')}
              </span>
            </button>
          </div>
        </div>
      </PanelRow>

      {/* Phone */}
      {phone && (
        <PanelRow label={t('teléfono', 'phone')}>
          <div className="space-y-1">
            <a
              href={`tel:${phone}`}
              className="text-ct-text transition-colors hover:text-ct-accent-bright print:text-black"
            >
              {phone}
            </a>
            <div className="print:hidden">
              <button
                type="button"
                onClick={() => copy(phone, 'phone')}
                className="text-[11px] text-ct-subtext-0 transition-colors hover:text-ct-accent-bright"
                aria-label={t('Copiar teléfono', 'Copy phone')}
              >
                <span aria-live="polite">
                  {copied === 'phone' ? t('¡Copiado!', 'Copied!') : t('Copiar', 'Copy')}
                </span>
              </button>
            </div>
          </div>
        </PanelRow>
      )}

      {/* Location */}
      <PanelRow label={t('ubicación', 'location')}>
        <span className="text-ct-text print:text-black">{contact.location}</span>
      </PanelRow>
    </Panel>
  )
}
