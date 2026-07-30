/**
 * src/components/right-column/ProjectsGrid.tsx — Projects grid
 *
 * Responsive grid of project cards with filtering by type.
 * Cards: name, description, type badge, tech stack, GitHub metrics.
 * Featured projects highlighted with star icon or border accent.
 * Print: compact list format.
 *
 * @see T-018
 */

import { useState, useMemo } from 'react'
import { useApp } from '@/context/AppContext'
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
      className="w-3 h-3 text-yellow-500 fill-yellow-500"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/**
 * ProjectsGrid — Responsive grid of project cards.
 *
 * - Filterable by "all" or "featured" toggle.
 * - Cards show name, description (bilingual), tech stack pills.
 * - Featured cards have a star icon and border accent.
 * - GitHub metrics (stars, forks) if available.
 * - Responsive: 1 col mobile, 2 tablet, 3 desktop.
 * - Print: compact single-column list, no grid.
 */
export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const { t } = useApp()
  const [showFeatured, setShowFeatured] = useState(false)

  const filtered = useMemo(() => {
    if (!showFeatured) return projects
    return projects.filter((p) => p.featured)
  }, [projects, showFeatured])

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-3 print:bg-transparent print:border-0 print:p-0">
      <div className="flex items-center justify-between gap-2 print:block">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider print:text-black">
          {t('Proyectos', 'Projects')}
        </h3>
        <button
          type="button"
          onClick={() => setShowFeatured((prev) => !prev)}
          className={`text-xs px-2 py-1 rounded-md border transition-colors print:hidden ${
            showFeatured
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-600 dark:text-yellow-400'
              : 'bg-white/5 border-white/20 text-gray-500 dark:text-gray-400 hover:bg-white/10'
          }`}
        >
          {showFeatured ? t('Destacados', 'Featured') : t('Mostrar todos', 'Show all')}
        </button>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 print:grid-cols-1 print:gap-2">
        {filtered.map((project) => (
          <div
            key={project.name}
            className={`relative p-3 rounded-lg border transition-colors ${
              project.featured
                ? 'border-yellow-500/30 bg-yellow-500/5 dark:bg-yellow-500/5 print:border-yellow-400'
                : 'border-white/10 bg-white/5 dark:bg-white/5 print:border-gray-300'
            } print:bg-transparent print:break-inside-avoid`}
          >
            {/* Featured star */}
            {project.featured && (
              <div className="absolute top-2 right-2 print:hidden">
                <StarIcon />
              </div>
            )}

            {/* Project name */}
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white print:text-black pr-6">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  {project.name}
                </a>
              ) : (
                project.name
              )}
            </h4>

            {/* Description */}
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-3 print:text-gray-700">
              {t(project.description.es, project.description.en)}
            </p>

            {/* GitHub metrics */}
            {project.metrics && (project.metrics.stars != null || project.metrics.forks != null) && (
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 print:text-gray-600">
                {project.metrics.stars != null && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {project.metrics.stars}
                  </span>
                )}
                {project.metrics.forks != null && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {project.metrics.forks}
                  </span>
                )}
              </div>
            )}

            {/* Tech stack pills */}
            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2 print:gap-0.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-block px-1.5 py-0.5 text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded print:bg-transparent print:text-gray-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 print:text-gray-600">
          {t('No hay proyectos para mostrar.', 'No projects to display.')}
        </p>
      )}
    </div>
  )
}
