/**
 * src/hooks/useScrollSpy.ts — Pure hook: tracks which section is currently visible
 *
 * Uses IntersectionObserver to determine the active section.
 * No dependency on context — accepts section IDs as input.
 */

import { useState, useEffect } from 'react'

export interface ScrollSpyOptions {
  /** Section IDs to observe */
  sectionIds: string[]
  /** IntersectionObserver threshold (default: 0.3) */
  threshold?: number
  /** IntersectionObserver rootMargin (default: '-100px 0px -50% 0px') */
  rootMargin?: string
  /** Whether the observer should be active (default: true) */
  enabled?: boolean
}

export interface ScrollSpyResult {
  /** Currently active section ID */
  activeSection: string
}

const DEFAULT_THRESHOLD = 0.3
const DEFAULT_ROOT_MARGIN = '-100px 0px -50% 0px'

export function useScrollSpy({
  sectionIds,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
  enabled = true,
}: ScrollSpyOptions): ScrollSpyResult {
  const [activeSection, setActiveSection] = useState<string>(
    sectionIds[0] ?? '',
  )

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { threshold, rootMargin },
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds, threshold, rootMargin, enabled])

  return { activeSection }
}
