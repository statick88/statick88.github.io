/**
 * src/App.tsx — Thin orchestrator (new)
 *
 * Replaces the 571-line monolith. Now just composes layout components.
 * State lives in context, data lives in cv-data.ts, sections are lazy-loaded.
 */

import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import TwoColumnLayout from '@/components/layout/TwoColumnLayout'
import { useApp } from '@/context/AppContext'
import { ScrollNavBar } from '@/components/layout/ScrollNavBar'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { useProfileState } from '@/hooks/useProfile'
import ProfileSelector from '@/components/ProfileSelector'
import LanguageToggle from '@/components/LanguageToggle'

// Left column
import PhotoCard from '@/components/left-column/PhotoCard'
import ContactCard from '@/components/left-column/ContactCard'
import LinksCard from '@/components/left-column/LinksCard'
import SkillsCard from '@/components/left-column/SkillsCard'
import LanguagesCard from '@/components/left-column/LanguagesCard'
import CertificationsSummaryCard from '@/components/left-column/CertificationsSummaryCard'

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
  getDefaultMetrics,
} from '@/lib/adapter'

function AppInner() {
  const { t, language, setLanguage } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { activeProfile, setActiveProfile } = useProfileState()

  const contact = adaptContact()
  const linksProps = {
    ...(contact.linkedin && { linkedin: contact.linkedin }),
    ...(contact.github && { github: contact.github }),
    ...(contact.portfolio && { portfolio: contact.portfolio }),
  }

  const leftColumn = (
    <>
      <PhotoCard photoUrl="/statick.png" name="Diego Saavedra" />
      <ContactCard contact={contact} />
      <LinksCard {...linksProps} />
      <SkillsCard skills={adaptSkills()} />
      <LanguagesCard languages={adaptLanguages()} />
      <CertificationsSummaryCard certifications={adaptCertifications()} />
    </>
  )

  const rightColumn = (
    <>
      <ProfileCard
        profile={adaptProfile(activeProfile.id)}
        metrics={getDefaultMetrics()}
      />
      <ExperienceTimeline experience={adaptExperience()} />
      <EducationCard education={adaptEducation()} />
      <ProjectsGrid projects={adaptProjects()} />
      <CertificationsList certifications={adaptCertifications()} />
      <ExploitariumSummary metrics={getDefaultMetrics()} />
    </>
  )

  return (
    <>
      {/* Profile Selector */}
      <ProfileSelector
        t={t}
        activeProfile={activeProfile}
        setActiveProfile={setActiveProfile}
      />

      {/* Language Toggle */}
      <LanguageToggle language={language} setLanguage={setLanguage} />

      {/* Navigation */}
      <ScrollNavBar />
      <MobileMenuButton
        isOpen={mobileMenuOpen}
        onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Two-Column Layout */}
      <TwoColumnLayout left={leftColumn} right={rightColumn} />
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
