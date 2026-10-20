/**
 * src/components/panels/CoursesPanel.tsx — Authored courses panel
 *
 * Each course is a row: what it is on the left, what it covers on the right.
 * The console idiom keeps the list scannable — no cards, no gradients.
 */

import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import { courses } from '@/data/courses'

export function CoursesPanel() {
  const { t } = useApp()

  return (
    <Panel title={t('cursos', 'courses')} subtitle={`${courses.length}`}>
      {courses.map((course) => (
        <PanelRow key={course.id} label={course.title}>
          <div className="space-y-2">
            <p className="text-ct-subtext-1 text-xs">{course.subtitle}</p>
            <p className="prose-sans text-sm">{course.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-muted">{course.date}</span>
              <span className="chip chip-muted">{course.tool}</span>
              {course.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="chip">
                  {tag}
                </span>
              ))}
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="chip chip-accent hover:border-ct-accent"
              >
                {t('abrir →', 'open →')}
              </a>
            </div>
          </div>
        </PanelRow>
      ))}
    </Panel>
  )
}
