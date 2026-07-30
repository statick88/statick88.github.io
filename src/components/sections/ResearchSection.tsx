/**
 * src/components/sections/ResearchSection.tsx — Scientific research
 */

import Section from '@/components/Section'
import Research from '@/components/Research'
import { useApp } from '@/context/AppContext'

export function ResearchSection() {
  const { t } = useApp()

  return (
    <div id="research" className="mt-8">
      <Section title={t('Investigación Científica', 'Scientific Research')}>
        <Research />
      </Section>
    </div>
  )
}
