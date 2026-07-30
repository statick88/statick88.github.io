/**
 * src/components/layout/SectionRenderer.tsx — Lazy section mapping
 *
 * Maps section IDs to their React components using React.lazy()
 * for code-splitting. Each section is loaded on demand.
 */

import React, { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS, type SectionId } from '@/config/navigation'

// Lazy-loaded section components — each becomes its own chunk
const HeroSection = React.lazy(() =>
  import('@/components/sections/HeroSection').then((m) => ({ default: m.HeroSection }))
)
const SummarySection = React.lazy(() =>
  import('@/components/sections/SummarySection').then((m) => ({ default: m.SummarySection }))
)
const ExperienceSection = React.lazy(() =>
  import('@/components/sections/ExperienceSection').then((m) => ({ default: m.ExperienceSection }))
)
const EducationSection = React.lazy(() =>
  import('@/components/sections/EducationSection').then((m) => ({ default: m.EducationSection }))
)
const SkillsSection = React.lazy(() =>
  import('@/components/sections/SkillsSection').then((m) => ({ default: m.SkillsSection }))
)
const ProjectsSection = React.lazy(() =>
  import('@/components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection }))
)
const CertificationsSection = React.lazy(() =>
  import('@/components/sections/CertificationsSection').then((m) => ({ default: m.CertificationsSection }))
)
const CoursesSection = React.lazy(() =>
  import('@/components/sections/CoursesSection').then((m) => ({ default: m.CoursesSection }))
)
const ResearchSection = React.lazy(() =>
  import('@/components/sections/ResearchSection').then((m) => ({ default: m.ResearchSection }))
)
const HireMeSection = React.lazy(() =>
  import('@/components/sections/HireMeSection').then((m) => ({ default: m.HireMeSection }))
)

/** Section loading fallback */
function SectionFallback() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="h-8 bg-white/10 rounded w-48 mb-4" />
      <div className="h-4 bg-white/5 rounded w-full mb-2" />
      <div className="h-4 bg-white/5 rounded w-3/4" />
    </div>
  )
}

interface SectionRendererProps {
  activeProfile: { id: string; label: string; color: string; icon?: string }
}

export function SectionRenderer({ activeProfile }: SectionRendererProps) {
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Suspense fallback={<SectionFallback />}>
          <SectionContent sectionId={activeSection as SectionId} activeProfile={activeProfile} />
        </Suspense>
      </motion.div>
    </AnimatePresence>
  )
}

function SectionContent({
  sectionId,
  activeProfile,
}: {
  sectionId: SectionId
  activeProfile: { id: string; label: string; color: string; icon?: string }
}) {
  switch (sectionId) {
    case 'summary':
      return <SummarySection activeProfile={activeProfile} />
    case 'experience':
      return <ExperienceSection />
    case 'education':
      return <EducationSection />
    case 'skills':
      return <SkillsSection />
    case 'projects':
      return <ProjectsSection />
    case 'certifications':
      return <CertificationsSection />
    case 'courses':
      return <CoursesSection />
    case 'research':
      return <ResearchSection />
    case 'hire':
      return <HireMeSection />
    default:
      return <SummarySection activeProfile={activeProfile} />
  }
}

/** Hero is always visible (not inside the scroll-spy switcher) */
export { HeroSection }
