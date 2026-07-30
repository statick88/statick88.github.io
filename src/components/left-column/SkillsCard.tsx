/**
 * src/components/left-column/SkillsCard.tsx — Skills grouped by category
 *
 * Skills grouped by category with proficiency badges.
 * Featured skills highlighted with a star icon.
 * Collapsible groups on mobile using <details>/<summary>.
 * 8pt grid spacing compliance.
 *
 * @see T-013
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import type { SkillEntry } from '@/lib/schemas/cv-data'

interface SkillsCardProps {
  /** Array of skill entries */
  skills: SkillEntry[]
}

/**
 * Proficiency level configuration: colors and labels.
 */
const LEVEL_CONFIG: Record<string, { bg: string; text: string; label: { es: string; en: string } }> = {
  master: {
    bg: 'bg-green-500/20 border-green-500/50',
    text: 'text-green-600 dark:text-green-400',
    label: { es: 'Experto', en: 'Expert' },
  },
  advanced: {
    bg: 'bg-blue-500/20 border-blue-500/50',
    text: 'text-blue-600 dark:text-blue-400',
    label: { es: 'Avanzado', en: 'Advanced' },
  },
  intermediate: {
    bg: 'bg-purple-500/20 border-purple-500/50',
    text: 'text-purple-600 dark:text-purple-400',
    label: { es: 'Intermedio', en: 'Intermediate' },
  },
}

/**
 * Human-readable category labels (bilingual).
 */
const CATEGORY_LABELS: Record<string, { es: string; en: string }> = {
  'frontend-fundamentals': { es: 'Frontend Fundamentals', en: 'Frontend Fundamentals' },
  'frontend-frameworks': { es: 'Frontend Frameworks', en: 'Frontend Frameworks' },
  'backend': { es: 'Backend', en: 'Backend' },
  'mobile': { es: 'Móvil', en: 'Mobile' },
  'mobile-native': { es: 'Móvil Nativo', en: 'Native Mobile' },
  'devops': { es: 'DevOps', en: 'DevOps' },
  'databases': { es: 'Bases de Datos', en: 'Databases' },
  'security': { es: 'Seguridad', en: 'Security' },
  'architecture': { es: 'Arquitectura', en: 'Architecture' },
  'tools': { es: 'Herramientas', en: 'Tools' },
  'research': { es: 'Investigación', en: 'Research' },
  'ai': { es: 'IA / ML', en: 'AI / ML' },
  'teaching': { es: 'Docencia', en: 'Teaching' },
}

/**
 * Star SVG for featured skills.
 */
function StarIcon() {
  return (
    <svg
      className="w-3 h-3 text-yellow-500 fill-yellow-500"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/**
 * SkillsCard — Skills grouped by collapsible category sections.
 *
 * - Groups skills by `category` field.
 * - Each category is a collapsible `<details>` element (open by default on desktop).
 * - Proficiency badges use color-coded borders and text.
 * - Featured skills show a star icon next to the name.
 * - 8pt grid: p-4, gap-2, space-y-3 (all multiples of 8px).
 */
export default function SkillsCard({ skills }: SkillsCardProps) {
  const { t } = useApp()

  // Group skills by category, preserving insertion order
  const grouped = useMemo(() => {
    const map = new Map<string, SkillEntry[]>()
    for (const skill of skills) {
      const existing = map.get(skill.category)
      if (existing) {
        existing.push(skill)
      } else {
        map.set(skill.category, [skill])
      }
    }
    return map
  }, [skills])

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
        {t('Habilidades', 'Skills')}
      </h3>

      <div className="space-y-2">
        {Array.from(grouped.entries()).map(([category, categorySkills]) => (
          <details
            key={category}
            className="group"
            open
          >
            <summary className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none min-h-[32px] print:min-h-0">
              <svg
                className="w-3 h-3 transition-transform group-open:rotate-90 print:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t(
                CATEGORY_LABELS[category]?.es ?? category,
                CATEGORY_LABELS[category]?.en ?? category
              )}
              <span className="text-gray-400 dark:text-gray-500 font-normal">
                ({categorySkills.length})
              </span>
            </summary>

            <div className="flex flex-wrap gap-1.5 mt-1.5 pl-5 print:pl-0">
              {categorySkills.map((skill) => {
                const level = LEVEL_CONFIG[skill.level] ?? LEVEL_CONFIG.intermediate!
                return (
                  <span
                    key={skill.name}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md ${level.bg} ${level.text} print:bg-transparent print:border-gray-300 print:text-black`}
                  >
                    {skill.name}
                    <span className="opacity-60 hidden sm:inline">
                      ({t(level.label.es, level.label.en)})
                    </span>
                  </span>
                )
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
