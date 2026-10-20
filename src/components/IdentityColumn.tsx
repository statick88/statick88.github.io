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

/* Line icons for the contact block — 1.5px stroke, monochrome. */
function MailIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9Zm1.5 0 7.5 5.25L18 7.5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5.5A1.5 1.5 0 0 1 5.5 4h2L9 8.5 7 10a11 11 0 0 0 7 7l1.5-2L20 11.5v2A1.5 1.5 0 0 1 18.5 15 10.5 10.5 0 0 1 4 5.5Z" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s6.5-5.5 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.5 12 21 12 21Zm0-8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66L11.5 7M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66L12.5 17" />
    </svg>
  )
}

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
        <div className="space-y-2.5">
          <a
            href={`mailto:${contact.email}`}
            className="cv-contact-item hover:underline"
          >
            <MailIcon />
            <span className="break-all">{contact.email}</span>
          </a>
          {contact.phone ? (
            <a href={`tel:${contact.phone}`} className="cv-contact-item hover:underline">
              <PhoneIcon />
              <span>{contact.phone}</span>
            </a>
          ) : null}
          <p className="cv-contact-item">
            <PinIcon />
            <span>{contact.location}</span>
          </p>
          {contact.github ? (
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item hover:underline"
            >
              <LinkIcon />
              <span>GitHub</span>
            </a>
          ) : null}
          {contact.linkedin ? (
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-contact-item hover:underline"
            >
              <LinkIcon />
              <span>LinkedIn</span>
            </a>
          ) : null}
        </div>
      </Panel>

      {/* Facts */}
      <Panel title={t('información', 'information')}>
        <ul className="space-y-1.5 text-sm">
          <li>• {metrics.yearsExperience}+ {t('años de experiencia', 'years of experience')}</li>
          <li>• {metrics.githubPublicRepos}+ {t('repos públicos', 'public repos')}</li>
          <li>• {metrics.exploitariumEntries} {t('entradas de investigación', 'research entries')}</li>
          <li>• {metrics.auditedProjects} {t('proyecto auditado', 'audited project')}</li>
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
