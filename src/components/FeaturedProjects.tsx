import { courses } from '@/data/courses'
import { useApp } from '@/context/AppContext'
import { useSectionModal } from '@/context/SectionModalContext'
import type { ProjectEntry } from '@/lib/schemas/cv-data'

interface FeaturedProjectsProps { projects: ProjectEntry[] }

const CURATED_PROJECTS = ['course-of-cybersecurity', 'Course_of_python', 'MindLedger']

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const { t } = useApp()
  const { openSection } = useSectionModal()
  const curated = CURATED_PROJECTS.map((name) => projects.find((project) => project.name === name)).filter((project): project is ProjectEntry => Boolean(project))

  return (
    <div className="cv-featured-projects no-print" data-testid="featured-projects">
      <div className="cv-catalog-heading">
        <p>{t('Trabajo seleccionado', 'Selected work')}</p>
        <h2>{t('Evidencia antes que promesas.', 'Evidence before promises.')}</h2>
      </div>
      <div className="cv-project-catalog">
        {curated.map((project) => {
          const course = courses.find((entry) => entry.id === project.name)
          return (
            <article key={project.name} className="cv-project-preview">
              <p className="cv-project-kicker">{t('Proyecto público', 'Public project')}</p>
              <h3>{project.name}</h3>
              <p>{t(project.description.es, project.description.en)}</p>
              <div className="cv-project-tags">{project.technologies.slice(0, 4).map((technology) => <span key={technology}>{technology}</span>)}</div>
              {course ? (
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a href={course.url} target="_blank" rel="noopener noreferrer" className="cv-primary-action text-sm">
                    {t('Ver curso', 'View course')} <span aria-hidden="true">↗</span>
                  </a>
                  <a href={course.repo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-sm font-semibold">
                    {t('Código', 'Code')} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              ) : project.url ? <a href={project.url} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a> : null}
            </article>
          )
        })}
      </div>
      <button type="button" className="cv-catalog-more" onClick={(event) => openSection('proyectos', event.currentTarget)}>
        {t('Ver todos los proyectos', 'View all projects')} <span aria-hidden="true">↗</span>
      </button>
    </div>
  )
}
