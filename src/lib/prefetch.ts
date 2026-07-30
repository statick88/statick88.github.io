/**
 * src/lib/prefetch.ts — Section prefetching on hover/scroll
 *
 * Strategy:
 * - Hero + Summary: prefetched immediately (above-the-fold critical path)
 * - Other sections: prefetched on nav item hover (user intent signal)
 * - Heavy sections (HireMe, Research): prefetched only on scroll proximity
 *
 * Uses <link rel="prefetch"> for speculative loading + React.lazy() pre-resolution.
 */

// Map section IDs to their lazy import functions (same as SectionRenderer.tsx)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionImporters: Record<string, () => Promise<{ default: React.ComponentType<any> }>> = {
  summary: () => import('@/components/sections/SummarySection').then((m) => ({ default: m.SummarySection })),
  experience: () => import('@/components/sections/ExperienceSection').then((m) => ({ default: m.ExperienceSection })),
  education: () => import('@/components/sections/EducationSection').then((m) => ({ default: m.EducationSection })),
  skills: () => import('@/components/sections/SkillsSection').then((m) => ({ default: m.SkillsSection })),
  projects: () => import('@/components/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
  certifications: () => import('@/components/sections/CertificationsSection').then((m) => ({ default: m.CertificationsSection })),
  courses: () => import('@/components/sections/CoursesSection').then((m) => ({ default: m.CoursesSection })),
  research: () => import('@/components/sections/ResearchSection').then((m) => ({ default: m.ResearchSection })),
  hire: () => import('@/components/sections/HireMeSection').then((m) => ({ default: m.HireMeSection })),
}

/** Track which sections have already been prefetched to avoid duplicates */
const prefetched = new Set<string>()

/**
 * Prefetch a section by triggering its lazy import.
 * This resolves the dynamic import so the chunk is downloaded and cached.
 */
export function prefetchSection(sectionId: string): void {
  if (prefetched.has(sectionId)) return

  const importer = sectionImporters[sectionId]
  if (!importer) return

  prefetched.add(sectionId)

  // Trigger the import — browser downloads and caches the chunk
  importer().catch(() => {
    // Silently ignore — prefetch failure is non-critical
    prefetched.delete(sectionId)
  })
}

/**
 * Prefetch multiple sections at once.
 */
export function prefetchSections(sectionIds: string[]): void {
  sectionIds.forEach(prefetchSection)
}

/**
 * Prefetch critical above-the-fold sections immediately.
 * Call this once on app mount.
 */
export function prefetchCriticalSections(): void {
  // Summary is the first section users scroll to
  prefetchSections(['summary'])
}

/**
 * Prefetch adjacent sections based on current scroll position.
 * Sections near the current one are likely to be viewed next.
 */
export function prefetchAdjacentSections(currentSectionId: string): void {
  const sectionOrder = [
    'summary', 'experience', 'education', 'skills',
    'projects', 'certifications', 'courses', 'research', 'hire',
  ]

  const currentIdx = sectionOrder.indexOf(currentSectionId)
  if (currentIdx === -1) return

  // Prefetch next section (most likely to be viewed)
  if (currentIdx + 1 < sectionOrder.length) {
    const next = sectionOrder[currentIdx + 1]
    if (next !== undefined) prefetchSection(next)
  }

  // Prefetch previous section (user might scroll back)
  if (currentIdx - 1 >= 0) {
    const prev = sectionOrder[currentIdx - 1]
    if (prev !== undefined) prefetchSection(prev)
  }
}

/**
 * Prefetch heavy sections that are far from the current position.
 * These are the largest chunks — only prefetch when user is likely
 * to navigate there (e.g., on scroll near the bottom).
 */
export function prefetchHeavySectionsIfNear(): void {
  // If user has scrolled past 70% of the page, prefetch the heavy sections
  const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)

  if (scrollPercent > 0.7) {
    prefetchSections(['research', 'hire'])
  }
}

/**
 * Get a link rel="prefetch" URL for a section chunk.
 * Used for <link rel="prefetch"> injection in HTML.
 */
export function getPrefetchLink(sectionId: string): HTMLLinkElement | null {
  // We can't know the exact chunk URL at runtime without Vite's manifest,
  // but we can use Speculation Rules API for modern browsers
  if (!('HTMLScriptElement' in window) || !document.querySelector('link[rel="modulepreload"]')) {
    return null
  }

  // For modulepreload, we'd need the build manifest — skip for now
  return null
}

/**
 * Initialize prefetching: critical sections + scroll listener for heavy sections.
 * Call this once on app mount.
 */
export function initPrefetching(): () => void {
  // Prefetch critical sections immediately
  prefetchCriticalSections()

  // Listen for scroll to prefetch heavy sections when near bottom
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null
  const handleScroll = () => {
    if (scrollTimeout) return
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null
      prefetchHeavySectionsIfNear()
    }, 200) // Debounce 200ms
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  // Cleanup function
  return () => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout) clearTimeout(scrollTimeout)
  }
}
