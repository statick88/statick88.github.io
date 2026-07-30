/**
 * src/components/sections/CoursesSection.tsx — Published courses
 */

import { useApp } from '@/context/AppContext'
import Section from '@/components/Section'
import Courses from '@/components/Courses'

export function CoursesSection() {
  const { t } = useApp()

  return (
    <div id="courses" className="mt-8">
      <Section title={t('Cursos Publicados', 'Published Courses')}>
        <Courses t={t} />
      </Section>
    </div>
  )
}
