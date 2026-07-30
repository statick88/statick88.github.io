/**
 * src/components/left-column/ContactCard.tsx — Contact information card
 *
 * Displays email, phone, and location with icons and bilingual labels.
 * Includes copy-to-clipboard for email and phone.
 * Print: plain text, no icons.
 *
 * @see T-011
 */

import { useState, useCallback } from 'react'
import { useApp } from '@/context/AppContext'
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
 * ContactCard — Email, phone, and location with copy-to-clipboard.
 *
 * - Email wrapped in `mailto:`, phone in `tel:`.
 * - Each actionable item has a copy button with transient "Copied!" feedback.
 * - Print mode: plain text without icons or copy buttons.
 */
export default function ContactCard({ contact }: ContactCardProps) {
  const { t } = useApp()
  const { copied, copy } = useCopyToClipboard()

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Contacto', 'Contact')}
      </h3>

      <ul className="space-y-2 text-sm">
        {/* Email */}
        <li className="flex items-center gap-2 group">
          <svg
            className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 hidden print:hidden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <a
            href={`mailto:${contact.email}`}
            className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors truncate"
          >
            {contact.email}
          </a>
          <button
            type="button"
            onClick={() => copy(contact.email, 'email')}
            className="ml-auto text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden print:hidden"
            aria-label={t('Copiar correo', 'Copy email')}
          >
            {copied === 'email' ? t('¡Copiado!', 'Copied!') : t('Copiar', 'Copy')}
          </button>
          <span className="hidden print:inline text-gray-500 text-xs ml-1">
            ({contact.email})
          </span>
        </li>

        {/* Phone */}
        {contact.phone && (
          <li className="flex items-center gap-2 group">
            <svg
              className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 hidden print:hidden"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.716 3 6a11.04 11.04 0 015.516-5.516L10.283 3.79a1 1 0 01.502-1.21L15.121 2.05a1 1 0 01.949.684H19a2 2 0 012 2v1"
              />
            </svg>
            <a
              href={`tel:${contact.phone}`}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {contact.phone}
            </a>
            <button
              type="button"
              onClick={() => copy(contact.phone!, 'phone')}
              className="ml-auto text-xs text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden print:hidden"
              aria-label={t('Copiar teléfono', 'Copy phone')}
            >
              {copied === 'phone' ? t('¡Copiado!', 'Copied!') : t('Copiar', 'Copy')}
            </button>
            <span className="hidden print:inline text-gray-500 text-xs ml-1">
              ({contact.phone})
            </span>
          </li>
        )}

        {/* Location */}
        <li className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 hidden print:hidden"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">
            {contact.location}
          </span>
        </li>
      </ul>
    </div>
  )
}
