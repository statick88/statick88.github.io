/**
 * src/context/ProfileContext.tsx — Active CV profile, shared across the shell
 *
 * The profile selector lives in the top bar while the scene content lives
 * below it: both need the same selection, so the state is provided once and
 * consumed through context instead of being duplicated per component.
 */

import { createContext, useContext, type ReactNode } from 'react'
import { useProfileState, type ActiveProfile } from '@/hooks/useProfile'

interface ProfileContextValue {
  activeProfile: ActiveProfile
  setActiveProfile: (profile: ActiveProfile) => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { activeProfile, setActiveProfile } = useProfileState()

  return (
    <ProfileContext.Provider value={{ activeProfile, setActiveProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfileContext(): ProfileContextValue {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfileContext must be used inside a ProfileProvider')
  }
  return context
}

export type { ActiveProfile }
