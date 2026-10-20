/**
 * src/components/IdentityColumn.tsx — The navy identity column
 *
 * Everything a reader needs before the document itself: who this is, how to
 * reach him, the facts that matter, and the levels that describe him — the
 * left column of a printed corporate CV.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { LevelBar } from '@/components/panels/LevelBar'
import PhotoCard from '@/components/left-column/PhotoCard'
import type {
  ContactInfo,
  ExecutiveProfile,
  LanguageEntry,
  MetricsSummary,
  SkillEntry,
} from '@/lib/schemas/cv-data'

/** Percentage for a proficiency level name. */
const LEVEL_PERCENT: Record<string, number> = {
  master: 95,
  advanced: 80,
  intermediate: 60,
  native: 100,
  avanzado: 80,
  intermedio: 60,
  basico: 35,
  básico: 35,
  a2: 35,
  b1: 50,
  b2: 65,
  c1: 85,
  c2: 95,
}

function percentFor(level: string): number {
  return LEVEL_PERCENT[level.trim().toLowerCase()] ?? 60
}

interface IdentityColumnProps {
  profile: ExecutiveProfile
  contact: ContactInfo
  metrics: MetricsSummary
  languages: LanguageEntry[]
  skills: SkillEntry[]
}

export default function IdentityColumn({
  profile,
  contact,
  metrics,
  languages,
  skills,
}: IdentityColumnProps) {
  const { t } = useApp()

  const keySkills = [...skills]
    .sort((a, b) => percentFor(b.level) - percentFor(a.level))
    .filter((skill, index, list) => list.findIndex((s) => s.name === skill.name) === index)
    .slice(0, 6)

  return (
    <>
      {/* Identity */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="cv-photo-ring">
          <PhotoCard photoUrl="/statick.png" name={profile.name} />
        </div>
        <div>
          <p className="cv-identity-name">{profile.name}</p>
          <p className="cv-identity-role">{t(profile.role.es, profile.role.en)}</p>
        </div>
      </div>

      {/* Contact */}
      <Panel title={t('contacto', 'contact')}>
        <div className="space-y-2">
          <a href={`mailto:${contact.email}`} className="block text-sm hover:underline">
            {contact.email}
          </a>
          {contact.phone ? (
            <a href={`tel:${contact.phone}`} className="block text-sm hover:underline">
              {contact.phone}
            </a>
          ) : null}
          <p className="text-sm">{contact.location}</p>
          {contact.linkedin ? (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm hover:underline"
            >
              LinkedIn
            </a>
          ) : null}
          {contact.github ? (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm hover:underline"
            >
              GitHub
            </a>
          ) : null}
        </div>
      </Panel>

      {/* Facts */}
      <Panel title={t('información', 'information')}>
        <ul className="space-y-1.5 text-sm">
          <li>• {metrics.yearsExperience}+ {t('años de experiencia', 'years of experience')}</li>
          <li>• {metrics.githubPublicRepos}+ {t('repos públicos', 'public repos')}</li>
          <li>• {metrics.totalProjectsAudited} {t('proyectos auditados', 'projects audited')}</li>
          <li>• {metrics.totalHoursTeaching}+ {t('horas docentes', 'teaching hours')}</li>
          <li>• {t('100% remoto', '100% remote')}</li>
        </ul>
      </Panel>

      {/* Languages */}
      <Panel title={t('idiomas', 'languages')}>
        <div className="space-y-3">
          {languages.map((language) => (
            <LevelBar
              key={language.code}
              label={language.language}
              level={language.level}
              value={percentFor(language.level)}
              trailing={language.code.toUpperCase()}
            />
          ))}
        </div>
      </Panel>

      {/* Key skills */}
      <Panel title={t('habilidades clave', 'key skills')}>
        <div className="space-y-3">
          {keySkills.map((skill) => (
            <LevelBar
              key={skill.name}
              label={skill.name}
              level={t(skill.level, skill.level)}
              value={percentFor(skill.level)}
            />
          ))}
        </div>
      </Panel>

      {/* Availability */}
      <Panel title={t('disponibilidad', 'availability')}>
        <PanelRow label={t('modalidad', 'engagement')}>
          <p className="text-sm">
            {t(
              'Contratación flexible: fijo, medio tiempo, por horas o por proyecto.',
              'Flexible engagement: full-time, part-time, hourly or per project.',
            )}
          </p>
        </PanelRow>
      </Panel>
    </>
  )
}
