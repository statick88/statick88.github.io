/**
 * src/config/navigation.ts — Single source of truth for section IDs
 *
 * All navigation components (SectionRenderer, ScrollNavBar, MobileDrawer, useNavItems)
 * import SECTION_IDS from here. Adding/removing a section requires changes in ONE place.
 */

export const SECTION_IDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'courses',
  'research',
  'hire',
] as const

export type SectionId = (typeof SECTION_IDS)[number]
