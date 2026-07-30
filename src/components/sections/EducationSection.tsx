/**
 * src/components/sections/EducationSection.tsx — Education timeline
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Section from '@/components/Section'
import Timeline from '@/components/Timeline'

export function EducationSection() {
  const { t } = useApp()
  const education = useCVData((d) => d.education)

  return (
    <div id="education" className="mt-8">
      <Section title={t('Educación', 'Education')}>
        <Timeline items={education} t={t} type="education" />
      </Section>
    </div>
  )
}
