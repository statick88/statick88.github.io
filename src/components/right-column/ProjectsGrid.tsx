/**
 * src/components/right-column/ProjectsGrid.tsx — Projects panel
 *
 * One row per project, in the console idiom:
 *
 *   - the row label is the project name,
 *   - the row value carries the repository link, the featured marker, the
 *     description (prose), the GitHub metrics and the technology chips.
 *
 * The grid becomes a settings list, but the "featured" filter survives as a
 * toolbar button in the panel body.
 *
 * @see T-018
 */

import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { Panel, PanelRow } from '@/components/panels/Panel'
import type { ProjectEntry } from '@/lib/schemas/cv-data'

interface ProjectsGridProps {
  /** Array of project entries */
  projects: ProjectEntry[]
}

/**
 * Star SVG icon for featured projects.
 */
function StarIcon() {
  return (
    <svg
      className="h-3 w-3 fill-current text-ct-warn print:text-black"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/**
 * Extracts a compact display label from a URL.
 * e.g. "https://github.com/statick88/course-of-cybersecurity"
 *      → "github.com/statick88/course-of-cybersecurity"
 */
function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.hostname + parsed.pathname.replace(/\/+$/, '')
  } catch {
    return url
  }
}

/**
 * ProjectsGrid — Project list with a featured filter.
 *
 * - Toggle between every project and the featured ones only.
 * - One row per project: name as the label, details as the value.
 * - Description in the humanist sans (`.prose-sans`), chips in mono.
 * - Print: every project listed, no toolbar.
 */
export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { t } = useApp()
  const [showFeatured, setShowFeatured] = useState(false)

  const filtered = useMemo(() => {
    if (!showFeatured) return projects
    return projects.filter((p) => p.featured)
  }, [projects, showFeatured])

  return (
    <Panel title={t('proyectos', 'projects')} subtitle={`${filtered.length}`}>
      {/* Featured filter */}
      <div className="flex items-center justify-end border-b border-ct-line px-4 py-2 print:hidden">
        <button
          type="button"
          onClick={() => setShowFeatured((prev) => !prev)}
          aria-pressed={showFeatured}
          className={`chip transition-colors ${showFeatured ? 'chip-accent' : 'chip'}`}
        >
          {showFeatured ? t('Destacados', 'Featured') : t('Mostrar todos', 'Show all')}
        </button>
      </div>

      {filtered.map((project) => (
        <PanelRow key={project.name} label={project.name}>
          <div className="space-y-2">
            {/* Featured marker + repository link */}
            <div className="flex flex-wrap items-center gap-2">
              {project.featured && (
                <span className="chip chip-accent">
                  <StarIcon />
                  {t('Destacado', 'Featured')}
                </span>
              )}
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-ct-accent-bright transition-colors hover:text-ct-accent-bright print:text-black"
                >
                  {getDisplayUrl(project.url)}
                </a>
              )}
            </div>

            {/* Description */}
            <p className="prose-sans max-w-[70ch] print:text-black">
              {t(project.description.es, project.description.en)}
            </p>

            {/* GitHub metrics */}
            {project.metrics && (project.metrics.stars != null || project.metrics.forks != null) && (
              <div className="flex items-center gap-3 text-[11px] text-ct-subtext-1 print:text-gray-700">
                {project.metrics.stars != null && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {project.metrics.stars}
                  </span>
                )}
                {project.metrics.forks != null && (
                  <span className="flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {project.metrics.forks}
                  </span>
                )}
              </div>
            )}

            {/* Tech stack */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="chip chip-muted">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </PanelRow>
      ))}

      {filtered.length === 0 && (
        <p className="px-4 py-4 text-center text-[11px] text-ct-subtext-0 print:text-gray-600">
          {t('No hay proyectos para mostrar.', 'No projects to display.')}
        </p>
      )}
    </Panel>
  )
}
