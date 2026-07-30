/**
 * src/components/sections/CertificationsSection.tsx — Certifications
 */

import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'
import Section from '@/components/Section'
import Certifications from '@/components/Certifications'

export function CertificationsSection() {
  const { t } = useApp()
  const certifications = useCVData((d) => d.certifications)

  return (
    <div id="certifications" className="mt-8">
      <Section title={t('Certificaciones', 'Certifications')}>
        <Certifications certifications={certifications} t={t} />
      </Section>
    </div>
  )
}
