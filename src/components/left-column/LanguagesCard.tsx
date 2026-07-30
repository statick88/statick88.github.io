/**
 * src/components/left-column/LanguagesCard.tsx — Languages card
 *
 * Displays languages with ISO 639-1 codes mapped to flag emoji.
 * Proficiency badges (Native/Fluent/Professional/Conversational/Basic).
 * Bilingual names (Español/Spanish).
 * Print: compact single line per language.
 *
 * @see T-014
 */

import { useApp } from '@/context/AppContext'
import type { LanguageEntry } from '@/lib/schemas/cv-data'

interface LanguagesCardProps {
  /** Array of language entries */
  languages: LanguageEntry[]
}

/**
 * Map ISO 639-1 language codes to country flags for emoji display.
 * Uses Unicode regional indicator symbols.
 */
const LANGUAGE_FLAGS: Record<string, string> = {
  es: '🇪🇸',
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  it: '🇮🇹',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦',
  ru: '🇷🇺',
  nl: '🇳🇱',
  sv: '🇸🇪',
  no: '🇳🇴',
  da: '🇩🇰',
  fi: '🇫🇮',
  pl: '🇵🇱',
  tr: '🇹🇷',
  hi: '🇮🇳',
  th: '🇹🇭',
  vi: '🇻🇳',
  id: '🇮🇩',
}

/**
 * Bilingual language names for display.
 */
const LANGUAGE_NAMES: Record<string, { es: string; en: string }> = {
  es: { es: 'Español', en: 'Spanish' },
  en: { es: 'Inglés', en: 'English' },
  fr: { es: 'Francés', en: 'French' },
  de: { es: 'Alemán', en: 'German' },
  pt: { es: 'Portugués', en: 'Portuguese' },
  it: { es: 'Italiano', en: 'Italian' },
  zh: { es: 'Chino', en: 'Chinese' },
  ja: { es: 'Japonés', en: 'Japanese' },
  ko: { es: 'Coreano', en: 'Korean' },
}

/**
 * Proficiency level badge colors.
 */
const LEVEL_BADGES: Record<string, { bg: string; text: string }> = {
  nativo: { bg: 'bg-green-500/20 border-green-500/50', text: 'text-green-600 dark:text-green-400' },
  native: { bg: 'bg-green-500/20 border-green-500/50', text: 'text-green-600 dark:text-green-400' },
  'c1+': { bg: 'bg-blue-500/20 border-blue-500/50', text: 'text-blue-600 dark:text-blue-400' },
  c1: { bg: 'bg-blue-500/20 border-blue-500/50', text: 'text-blue-600 dark:text-blue-400' },
  b2: { bg: 'bg-purple-500/20 border-purple-500/50', text: 'text-purple-600 dark:text-purple-400' },
  b1: { bg: 'bg-yellow-500/20 border-yellow-500/50', text: 'text-yellow-600 dark:text-yellow-400' },
  a2: { bg: 'bg-orange-500/20 border-orange-500/50', text: 'text-orange-600 dark:text-orange-400' },
  a1: { bg: 'bg-gray-500/20 border-gray-500/50', text: 'text-gray-600 dark:text-gray-400' },
}

/**
 * Get badge style for a proficiency level string.
 * Matches against known level keywords.
 */
function getLevelBadge(level: string): { bg: string; text: string } {
  const lower = level.toLowerCase()
  if (lower.includes('nativo') || lower.includes('native')) return LEVEL_BADGES.nativo!
  if (lower.includes('c1') || lower.includes('fluent') || lower.includes('avanzado')) return LEVEL_BADGES.c1!
  if (lower.includes('b2') || lower.includes('professional') || lower.includes('profesional')) return LEVEL_BADGES.b2!
  if (lower.includes('b1') || lower.includes('conversational') || lower.includes('intermedio')) return LEVEL_BADGES.b1!
  if (lower.includes('a2') || lower.includes('basic') || lower.includes('básico')) return LEVEL_BADGES.a2!
  if (lower.includes('a1')) return LEVEL_BADGES.a1!
  return LEVEL_BADGES.b1!
}

/**
 * LanguagesCard — Language proficiency display.
 *
 * - Each language shows a flag emoji, bilingual name, and proficiency badge.
 * - Flag derived from ISO 639-1 code via lookup table.
 * - Print mode: compact single line per language.
 */
export default function LanguagesCard({ languages }: LanguagesCardProps) {
  const { t } = useApp()

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Idiomas', 'Languages')}
      </h3>

      <ul className="space-y-2 text-sm">
        {languages.map((lang) => {
          const flag = LANGUAGE_FLAGS[lang.code] ?? '🌐'
          const names = LANGUAGE_NAMES[lang.code]
          const displayName = names ? t(names.es, names.en) : lang.language
          const badge = getLevelBadge(lang.level)

          return (
            <li
              key={lang.code}
              className="flex items-center justify-between gap-2 print:justify-start print:gap-3"
            >
              <span className="flex items-center gap-2">
                <span className="text-base" role="img" aria-label={displayName}>
                  {flag}
                </span>
                <span className="text-gray-700 dark:text-gray-300 font-medium print:text-black">
                  {displayName}
                </span>
              </span>
              <span
                className={`text-xs px-2 py-0.5 border rounded-full whitespace-nowrap ${badge.bg} ${badge.text} print:bg-transparent print:border-gray-300 print:text-black print:px-0`}
              >
                {lang.level}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
