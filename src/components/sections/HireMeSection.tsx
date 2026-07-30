/**
 * src/components/sections/HireMeSection.tsx — Services & contact
 */

import { useApp } from '@/context/AppContext'
import Section from '@/components/Section'
import HireMe from '@/components/HireMe'

export function HireMeSection() {
  const { t } = useApp()

  return (
    <div id="hire" className="mt-8">
      <Section title={t('Servicios & Contacto', 'Services & Contact')}>
        <HireMe t={t} />
      </Section>
    </div>
  )
}
