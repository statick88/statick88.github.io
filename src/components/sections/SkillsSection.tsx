/**
 * src/components/sections/SkillsSection.tsx — Technical skills
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Section from '@/components/Section'
import Skills from '@/components/Skills'

export function SkillsSection() {
  const { t } = useApp()
  const skills = useCVData((d) => d.skills)

  return (
    <div id="skills" className="mt-8">
      <Section title={t('Habilidades Técnicas', 'Technical Skills')}>
        <Skills skills={skills} />
      </Section>
    </div>
  )
}
