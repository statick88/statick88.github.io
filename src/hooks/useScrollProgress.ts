/**
 * src/hooks/useScrollProgress.ts — Pure hook: scroll progress as percentage
 *
 * Returns a value between 0 and 100 representing how far the user has scrolled.
 * Uses requestAnimationFrame throttling to sync with browser repaint cycle.
 * Passive event listener for optimal scroll performance.
 */

import { useState, useEffect, useRef, useCallback } from 'react'

export interface ScrollProgress {
  /** Scroll percentage 0–100 */
  progress: number
}

export function useScrollProgress(): ScrollProgress {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastScrollRef = useRef<number>(-1)

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY
    // Skip if scroll position hasn't changed
    if (scrollTop === lastScrollRef.current) {
      rafRef.current = null
      return
    }
    lastScrollRef.current = scrollTop

    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const raw = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
    setProgress(Math.min(100, Math.max(0, raw)))
    rafRef.current = null
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // Throttle with rAF — only one update per frame
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    // Run once on mount to capture initial position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [updateProgress])

  return { progress }
}
