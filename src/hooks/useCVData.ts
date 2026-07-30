/**
 * src/hooks/useCVData.ts — Selection hook for CV data
 *
 * Each section imports only the data it needs via a selector function.
 * This eliminates prop drilling: data comes from the module, not from parent props.
 *
 * Pattern:
 *   const skills = useCVData(d => d.skills)
 *   const work = useCVData(d => d.work)
 */

import { cvData, profileData } from '@/data/cv-data'
import type { CVData, Profile } from '@/types/cv'

/**
 * Select a slice of CV data. The selector runs synchronously on every render,
 * but since cvData is a static module export, there's zero overhead.
 */
export function useCVData<T>(selector: (data: CVData) => T): T {
  return selector(cvData)
}

/**
 * Get a profile by ID from profileData.
 * Returns undefined if the profile doesn't exist.
 */
export function useProfile(profileId: string): Profile | undefined {
  return profileData[profileId]
}

/**
 * Get the summary for a given profile, falling back to basics.label.
 */
export function useProfileSummary(profileId: string): { es: string; en: string } {
  const profile = profileData[profileId]
  if (profile) {
    return { es: profile.summary.es, en: profile.summary.en }
  }
  return { es: cvData.basics.label.es, en: cvData.basics.label.en }
}
