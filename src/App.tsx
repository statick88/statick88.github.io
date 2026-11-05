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
import { CompactSection } from '@/components/CompactSection'
import { useSectionModal } from '@/context/SectionModalContext'

import { CoursesPanel } from '@/components/panels/CoursesPanel'
import { ServicesPanel } from '@/components/panels/ServicesPanel'
import { EngagementsPanel } from '@/components/panels/EngagementsPanel'
import { ReferencesPanel } from '@/components/panels/ReferencesPanel'
import { EventsPanel } from '@/components/panels/EventsPanel'
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

function ServiceExplorer() {
  const { t } = useApp()
  const { openSection } = useSectionModal()

  return (
    <button type="button" className="cv-primary-action" onClick={(event) => openSection(SECTION.servicios, event.currentTarget)}>
      {t('Explorar servicios', 'Explore services')} <span aria-hidden="true">↗</span>
    </button>
  )
}

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
      <header className="cv-portfolio-hero mb-8">
        <p className="cv-hero-eyebrow">Statick <span>/</span> Developer</p>
        <h1 className="cv-document-name">{profile.name}</h1>
        <p className="cv-document-role">{t(profile.role.es, profile.role.en)}</p>
        <p className="cv-hero-intro">
          {t('Construyo software. Investigo seguridad. Comparto conocimiento.', 'I build software. Research security. Share knowledge.')}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a href={`mailto:${contact.email}`} className="chip chip-accent">
            {contact.email}
          </a>
          <span className="chip chip-muted">{contact.location}</span>
          <span className="chip chip-muted">{t('100% remoto', '100% remote')}</span>
        </div>
        <div className="cv-hero-actions no-print">
          <ServiceExplorer />
          <a href="https://hub.docker.com/r/statick/my_site" target="_blank" rel="noopener noreferrer" className="cv-legacy-link">
            {t('Archivo · mi sitio en 2023', 'Archive · my site in 2023')} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      <CompactSection id={SECTION.resumen} aria-label={t('resumen', 'summary')} className="scroll-mt-16">
        <ProfileCard profile={profile} metrics={metrics} headline={adaptHeadline()} />
      </CompactSection>

      <CompactSection
        id={SECTION.servicios}
        aria-label={t('servicios', 'services')}
        className="scroll-mt-16"
      >
        <ServicesPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.encargos}
        aria-label={t('encargos', 'engagements')}
        className="scroll-mt-16"
      >
        <EngagementsPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.referencias}
        aria-label={t('referencias', 'references')}
        className="scroll-mt-16"
      >
        <ReferencesPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.eventos}
        aria-label={t('eventos', 'events')}
        className="scroll-mt-16"
      >
        <EventsPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.experiencia}
        aria-label={t('experiencia', 'experience')}
        className="scroll-mt-16"
      >
        <ExperienceTimeline experience={adaptExperience()} />
      </CompactSection>

      <CompactSection
        id={SECTION.educacion}
        aria-label={t('educación', 'education')}
        className="scroll-mt-16"
      >
        <EducationCard education={adaptEducation()} />
      </CompactSection>

      <CompactSection
        id={SECTION.habilidades}
        aria-label={t('habilidades', 'skills')}
        className="scroll-mt-16"
      >
        <SkillsCard skills={skills} />
      </CompactSection>

      <CompactSection id={SECTION.proyectos} aria-label={t('proyectos', 'projects')} className="scroll-mt-16">
        <ProjectsGrid projects={adaptProjects()} />
      </CompactSection>

      <CompactSection
        id={SECTION.certificaciones}
        aria-label={t('certificaciones', 'certifications')}
        className="scroll-mt-16"
      >
        <CertificationsList certifications={adaptCertifications()} />
      </CompactSection>

      <CompactSection id={SECTION.cursos} aria-label={t('cursos', 'courses')} className="scroll-mt-16">
        <CoursesPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.investigacion}
        aria-label={t('investigación', 'research')}
        className="scroll-mt-16"
      >
        <ResearchPanel />
      </CompactSection>

      <CompactSection
        id={SECTION.exploitarium}
        aria-label={t('exploitarium', 'exploitarium')}
        className="scroll-mt-16"
      >
        <ExploitariumSummary metrics={metrics} />
      </CompactSection>

      <CompactSection id={SECTION.aportes} aria-label={t('aportes', 'contributions')} className="scroll-mt-16">
        <ContributionsPanel />
      </CompactSection>

      <CompactSection id={SECTION.plugins} aria-label={t('plugins', 'plugins')} className="scroll-mt-16">
        <PluginsPanel />
      </CompactSection>

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
