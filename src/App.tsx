/**
 * src/App.tsx — Scene composition
 *
 * The console shell (sidebar, top bar, status bar) lives in `AppLayout`.
 * This module owns the scene: the ordered stack of panels that make up the
 * curriculum, each one anchored with the section id the navigation points at.
 *
 * State lives in context, data lives in cv-data.ts, the shell lives in
 * layout components.
 */

import { useApp } from '@/context/AppContext'
import { useProfileContext } from '@/context/ProfileContext'
import { SECTION } from '@/config/navigation'
import { AppLayout } from '@/components/layout/AppLayout'

import ProfileHeader from '@/components/ProfileHeader'
import { CoursesPanel } from '@/components/panels/CoursesPanel'
import { ResearchPanel } from '@/components/panels/ResearchPanel'

// Left column
import ContactCard from '@/components/left-column/ContactCard'
import LinksCard from '@/components/left-column/LinksCard'
import SkillsCard from '@/components/left-column/SkillsCard'
import LanguagesCard from '@/components/left-column/LanguagesCard'

// Right column
import ProfileCard from '@/components/right-column/ProfileCard'
import ExperienceTimeline from '@/components/right-column/ExperienceTimeline'
import EducationCard from '@/components/right-column/EducationCard'
import ProjectsGrid from '@/components/right-column/ProjectsGrid'
import CertificationsList from '@/components/right-column/CertificationsList'
import ExploitariumSummary from '@/components/right-column/ExploitariumSummary'

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

  const linksProps = {
    ...(contact.linkedin && { linkedin: contact.linkedin }),
    ...(contact.github && { github: contact.github }),
    ...(contact.portfolio && { portfolio: contact.portfolio }),
  }

  return (
    <>
      <section id={SECTION.perfil} aria-label={t('perfil', 'profile')} className="scroll-mt-16">
        <ProfileHeader
          profile={profile}
          contact={contact}
          languagesSpoken={metrics.languagesSpoken}
        />
      </section>

      <section id={SECTION.resumen} aria-label={t('resumen', 'summary')} className="scroll-mt-16">
        <ProfileCard profile={profile} metrics={metrics} headline={adaptHeadline()} />
      </section>

      <section id={SECTION.contacto} aria-label={t('contacto', 'contact')} className="scroll-mt-16">
        <ContactCard contact={contact} />
      </section>

      <section id={SECTION.enlaces} aria-label={t('enlaces', 'links')} className="scroll-mt-16">
        <LinksCard {...linksProps} />
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
        <SkillsCard skills={adaptSkills()} />
      </section>

      <section id={SECTION.idiomas} aria-label={t('idiomas', 'languages')} className="scroll-mt-16">
        <LanguagesCard languages={adaptLanguages()} />
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

      <p className="sr-only">{t('Currículum de Diego Saavedra', 'Diego Saavedra curriculum')}</p>
    </>
  )
}

export default function App() {
  return (
    <AppLayout>
      <AppInner />
    </AppLayout>
  )
}
