/**
 * src/App.tsx — Document composition
 *
 * The shell (top bar, sheet, columns) lives in `AppLayout`. This module owns
 * the two columns:
 *
 *   identity column → photo, contact, facts, languages, key skills
 *   document column → the CV sections, in reading order
 *
 * State lives in context, data lives in cv-data.ts.
 */

import { AppProvider, useApp } from '@/context/AppContext'
import { ProfileProvider, useProfileContext } from '@/context/ProfileContext'
import { SECTION } from '@/config/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import IdentityColumn from '@/components/IdentityColumn'

import { CoursesPanel } from '@/components/panels/CoursesPanel'
import { ServicesPanel } from '@/components/panels/ServicesPanel'
import { ResearchPanel } from '@/components/panels/ResearchPanel'
import { ContributionsPanel } from '@/components/panels/ContributionsPanel'
import { PluginsPanel } from '@/components/panels/PluginsPanel'

// Document column
import ProfileCard from '@/components/right-column/ProfileCard'
import ExperienceTimeline from '@/components/right-column/ExperienceTimeline'
import EducationCard from '@/components/right-column/EducationCard'
import ProjectsGrid from '@/components/right-column/ProjectsGrid'
import CertificationsList from '@/components/right-column/CertificationsList'
import ExploitariumSummary from '@/components/right-column/ExploitariumSummary'
import SkillsCard from '@/components/left-column/SkillsCard'

// Adapters
import {
  adaptContact,
  adaptSkills,
  adaptLanguages,
  adaptExperience,
  adaptEducation,
  adaptCertifications,
  adaptProjects,
  adaptProfile,
  adaptHeadline,
  getDefaultMetrics,
} from '@/lib/adapter'

function AppInner() {
  const { t } = useApp()
  const { activeProfile } = useProfileContext()

  const contact = adaptContact()
  const metrics = getDefaultMetrics()
  const profile = adaptProfile(activeProfile.id)
  const languages = adaptLanguages()
  const skills = adaptSkills()

  const aside = (
    <IdentityColumn
      profile={profile}
      contact={contact}
      metrics={metrics}
      languages={languages}
      skills={skills}
    />
  )

  return (
    <AppLayout aside={aside}>
      {/* Document header */}
      <header className="mb-8">
        <h1 className="cv-document-name">{profile.name}</h1>
        <p className="cv-document-role">{t(profile.role.es, profile.role.en)}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a href={`mailto:${contact.email}`} className="chip chip-accent">
            {contact.email}
          </a>
          <span className="chip chip-muted">{contact.location}</span>
          <span className="chip chip-muted">{t('100% remoto', '100% remote')}</span>
        </div>
      </header>

      <section id={SECTION.resumen} aria-label={t('resumen', 'summary')} className="scroll-mt-16">
        <ProfileCard profile={profile} metrics={metrics} headline={adaptHeadline()} />
      </section>

      <section
        id={SECTION.servicios}
        aria-label={t('servicios', 'services')}
        className="scroll-mt-16"
      >
        <ServicesPanel />
      </section>

      <section
        id={SECTION.experiencia}
        aria-label={t('experiencia', 'experience')}
        className="scroll-mt-16"
      >
        <ExperienceTimeline experience={adaptExperience()} />
      </section>

      <section
        id={SECTION.educacion}
        aria-label={t('educación', 'education')}
        className="scroll-mt-16"
      >
        <EducationCard education={adaptEducation()} />
      </section>

      <section
        id={SECTION.habilidades}
        aria-label={t('habilidades', 'skills')}
        className="scroll-mt-16"
      >
        <SkillsCard skills={skills} />
      </section>

      <section id={SECTION.proyectos} aria-label={t('proyectos', 'projects')} className="scroll-mt-16">
        <ProjectsGrid projects={adaptProjects()} />
      </section>

      <section
        id={SECTION.certificaciones}
        aria-label={t('certificaciones', 'certifications')}
        className="scroll-mt-16"
      >
        <CertificationsList certifications={adaptCertifications()} />
      </section>

      <section id={SECTION.cursos} aria-label={t('cursos', 'courses')} className="scroll-mt-16">
        <CoursesPanel />
      </section>

      <section
        id={SECTION.investigacion}
        aria-label={t('investigación', 'research')}
        className="scroll-mt-16"
      >
        <ResearchPanel />
      </section>

      <section
        id={SECTION.exploitarium}
        aria-label={t('exploitarium', 'exploitarium')}
        className="scroll-mt-16"
      >
        <ExploitariumSummary metrics={metrics} />
      </section>

      <section id={SECTION.aportes} aria-label={t('aportes', 'contributions')} className="scroll-mt-16">
        <ContributionsPanel />
      </section>

      <section id={SECTION.plugins} aria-label={t('plugins', 'plugins')} className="scroll-mt-16">
        <PluginsPanel />
      </section>

      {/* Document footer */}
      <footer className="cv-footer">
        <span>
          © {new Date().getFullYear()} {profile.name} · {t('Loja, Ecuador', 'Loja, Ecuador')}
        </span>
        <span className="flex items-center gap-3">
          {contact.github ? (
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              github
            </a>
          ) : null}
          {contact.linkedin ? (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin
            </a>
          ) : null}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </span>
      </footer>
    </AppLayout>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ProfileProvider>
        <AppInner />
      </ProfileProvider>
    </AppProvider>
  )
}
