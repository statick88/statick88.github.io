/**
 * src/components/left-column/SkillsCard.tsx — Skills grouped by category
 *
 * Skills grouped by category. Each category is a collapsible `<details>`
 * group (open by default) and every skill is a chip whose colour encodes the
 * proficiency level.
 *
 * @see T-013
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { Panel } from '@/components/panels/Panel'
import type { SkillEntry } from '@/lib/schemas/cv-data'

interface SkillsCardProps {
  /** Array of skill entries */
  skills: SkillEntry[]
}

/**
 * Proficiency level configuration: chip variant and bilingual label.
 *
 * The chip variant carries the semantics (verified / strong / working), the
 * label carries the words, so the meaning survives a monochrome print.
 */
const LEVEL_CONFIG: Record<string, { chip: string; label: { es: string; en: string } }> = {
  master: {
    chip: 'chip-ok',
    label: { es: 'Experto', en: 'Expert' },
  },
  advanced: {
    chip: 'chip-accent',
    label: { es: 'Avanzado', en: 'Advanced' },
  },
  intermediate: {
    chip: 'chip-muted',
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
 * SkillsCard — Skills grouped by collapsible category sections.
 *
 * - Groups skills by `category` field, preserving insertion order.
 * - Each category is a `<details>` element (open by default).
 * - Proficiency is encoded in the chip variant and spelled out next to the
 *   skill name.
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
    <Panel title={t('habilidades', 'skills')} subtitle={`${skills.length}`}>
      <div>
        {Array.from(grouped.entries()).map(([category, categorySkills]) => (
          <details
            key={category}
            open
            className="group border-b border-ct-line last:border-b-0 print:border-black/10"
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-[11px] uppercase tracking-[0.08em] text-ct-subtext-0 transition-colors hover:text-ct-text">
              <svg
                className="h-3 w-3 shrink-0 transition-transform group-open:rotate-90 print:hidden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold">
                {t(
                  CATEGORY_LABELS[category]?.es ?? category,
                  CATEGORY_LABELS[category]?.en ?? category
                )}
              </span>
              <span className="font-normal">
                ({categorySkills.length})
              </span>
            </summary>

            <div className="flex flex-wrap gap-2 px-4 pb-4">
              {categorySkills.map((skill) => {
                const level = LEVEL_CONFIG[skill.level] ?? LEVEL_CONFIG.intermediate!
                return (
                  <span key={skill.name} className={`chip ${level.chip}`}>
                    {skill.name}
                    <span className="text-[10px]">{t(level.label.es, level.label.en)}</span>
                  </span>
                )
              })}
            </div>
          </details>
        ))}
      </div>
    </Panel>
  )
}
