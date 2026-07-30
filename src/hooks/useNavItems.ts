/**
 * src/hooks/useNavItems.ts — Navigation items with translations
 *
 * Pure hook: accepts language from context, returns translated nav items.
 * Used by ScrollNavBar and MobileDrawer.
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { type SectionId } from '@/config/navigation'

export type { SectionId }

export interface NavItem {
  id: string
  label: string
  aria: string
}

export function useNavItems(): NavItem[] {
  const { t } = useApp()

  return useMemo(
    () => [
      { id: 'summary', label: t('Resumen', 'Summary'), aria: t('Ir a Resumen', 'Go to Summary') },
      { id: 'experience', label: t('Experiencia', 'Experience'), aria: t('Ir a Experiencia', 'Go to Experience') },
      { id: 'education', label: t('Educación', 'Education'), aria: t('Ir a Educación', 'Go to Education') },
      { id: 'skills', label: t('Habilidades', 'Skills'), aria: t('Ir a Habilidades', 'Go to Skills') },
      { id: 'projects', label: t('Proyectos', 'Projects'), aria: t('Ir a Proyectos', 'Go to Projects') },
      { id: 'certifications', label: t('Certificaciones', 'Certifications'), aria: t('Ir a Certificaciones', 'Go to Certifications') },
      { id: 'courses', label: t('Cursos', 'Courses'), aria: t('Ir a Cursos', 'Go to Courses') },
      { id: 'research', label: t('Investigación', 'Research'), aria: t('Ir a Investigación', 'Go to Research') },
      { id: 'hire', label: t('Contáctame', 'Contact Me'), aria: t('Ir a Servicios', 'Go to Services') },
    ],
    [t],
  )
}

export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
