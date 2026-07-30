/**
 * src/components/sections/ProjectsSection.tsx — Featured projects
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Section from '@/components/Section'
import Projects from '@/components/Projects'

export function ProjectsSection() {
  const { t } = useApp()
  const projects = useCVData((d) => d.projects)

  return (
    <div id="projects" className="mt-8">
      <Section title={t('Proyectos Destacados', 'Featured Projects')}>
        <Projects projects={projects} t={t} />
      </Section>
    </div>
  )
}
