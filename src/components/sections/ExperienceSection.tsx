/**
 * src/components/sections/ExperienceSection.tsx — Work experience timeline
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'

export function ExperienceSection() {
  const { t } = useApp()
  const work = useCVData((d) => d.work)

  return (
    <div id="experience" className="mt-8">
      <Section title={t('Experiencia Laboral', 'Work Experience')}>
        <Timeline items={work} t={t} type="work" />
      </Section>
    </div>
  )
}
