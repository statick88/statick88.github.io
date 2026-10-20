/**
 * src/hooks/useNavItems.ts — Navigation items derived from the nav config
 *
 * Pure hook: reads the language from context and returns the grouped
 * navigation used by the sidebar and the mobile drawer.
 */

import { useMemo } from 'react'
import { useApp } from '@/context/AppContext'
import { NAV_GROUPS } from '@/config/navigation'

export interface NavItem {
  id: string
  label: string
  aria: string
}

export interface NavGroup {
  id: string
  title: string
  items: NavItem[]
}

export function useNavGroups(): NavGroup[] {
  const { t } = useApp()

  return useMemo(
    () =>
      NAV_GROUPS.map((group) => ({
        id: group.id,
        title: t(group.title.es, group.title.en),
        items: group.items.map((item) => ({
          id: item.id,
          label: t(item.label.es, item.label.en),
          aria: t(`Ir a ${item.label.es}`, `Go to ${item.label.en}`),
        })),
      })),
    [t],
  )
}

export function useNavItems(): NavItem[] {
  const groups = useNavGroups()
  return useMemo(() => groups.flatMap((group) => group.items), [groups])
}

export function scrollToSection(sectionId: string): void {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
