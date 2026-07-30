/**
 * src/hooks/useProfile.ts — Active profile state management
 *
 * Manages the selected CV profile with localStorage persistence.
 */

import { useState, useCallback, useEffect } from 'react'

export interface ActiveProfile {
  id: string
  label: string
  color: string
  icon?: string
}

const PROFILE_KEY = 'cv-active-profile'

const DEFAULT_PROFILE: ActiveProfile = {
  id: 'developer',
  label: 'Full Stack',
  color: '#3b82f6',
}

function readPersistedProfile(): ActiveProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as ActiveProfile
      if (parsed.id && parsed.label && parsed.color) {
        return parsed
      }
    }
  } catch {
    // Fall through to default
  }
  return DEFAULT_PROFILE
}

export function useProfileState() {
  const [activeProfile, setActiveProfileState] = useState<ActiveProfile>(
    readPersistedProfile,
  )

  const setActiveProfile = useCallback((profile: ActiveProfile) => {
    setActiveProfileState(profile)
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(activeProfile))
    } catch {
      // Silent fail
    }
  }, [activeProfile])

  return { activeProfile, setActiveProfile }
}
