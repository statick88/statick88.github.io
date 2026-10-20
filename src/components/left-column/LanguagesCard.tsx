/**
 * src/components/left-column/LanguagesCard.tsx — Languages panel
 *
 * One row per language: the language name is the row label, the proficiency
 * is a chip whose variant encodes the level, and the ISO 639-1 code rides
 * along as the muted detail.
 *
 * @see T-014
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { LanguageEntry } from '@/lib/schemas/cv-data'

interface LanguagesCardProps {
  /** Array of language entries */
  languages: LanguageEntry[]
}

/**
 * Bilingual language names for display, keyed by ISO 639-1 code.
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
 * Bilingual proficiency labels, keyed by the lowercased raw level.
 */
const LEVEL_LABELS: Record<string, { es: string; en: string }> = {
  nativo: { es: 'Nativo', en: 'Native' },
  avanzado: { es: 'Avanzado', en: 'Advanced' },
  basico: { es: 'Básico', en: 'Basic' },
  'básico': { es: 'Básico', en: 'Basic' },
  intermedio: { es: 'Intermedio', en: 'Intermediate' },
  profesional: { es: 'Profesional', en: 'Professional' },
  conversacional: { es: 'Conversacional', en: 'Conversational' },
}

/**
 * Get the chip variant for a proficiency level string.
 * The ladder is semantic: verified → strong → working → basic.
 */
function getLevelChip(level: string): string {
  const lower = level.toLowerCase()
  if (
    lower.includes('nativo') ||
    lower.includes('native') ||
    lower.includes('c1') ||
    lower.includes('fluent') ||
    lower.includes('avanzado') ||
    lower.includes('advanced')
  ) {
    return 'chip-ok'
  }
  if (
    lower.includes('b2') ||
    lower.includes('professional') ||
    lower.includes('profesional')
  ) {
    return 'chip-accent'
  }
  if (
    lower.includes('b1') ||
    lower.includes('conversational') ||
    lower.includes('intermedio') ||
    lower.includes('a2') ||
    lower.includes('basic') ||
    lower.includes('básico')
  ) {
    return 'chip-warn'
  }
  return 'chip-muted'
}

/**
 * LanguagesCard — Language proficiency display.
 *
 * - Each row: bilingual language name as the label, proficiency chip and ISO
 *   code as the value.
 * - Print mode: compact single line per language.
 */
export default function LanguagesCard({ languages }: LanguagesCardProps) {
  const { t } = useApp()

  return (
    <Panel title={t('idiomas', 'languages')} subtitle={`${languages.length}`}>
      {languages.map((lang) => {
        const names = LANGUAGE_NAMES[lang.code]
        const displayName = names ? t(names.es, names.en) : lang.language
        const levelLabel = LEVEL_LABELS[lang.level.toLowerCase()]
        const levelText = levelLabel ? t(levelLabel.es, levelLabel.en) : lang.level

        return (
          <PanelRow key={lang.code} label={displayName}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`chip ${getLevelChip(lang.level)}`}>{levelText}</span>
              <span className="text-[11px] uppercase tracking-[0.06em] text-ct-subtext-0 print:text-gray-700">
                {lang.code}
              </span>
            </div>
          </PanelRow>
        )
      })}
    </Panel>
  )
}
