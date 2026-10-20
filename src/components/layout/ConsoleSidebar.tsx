/**
 * src/components/layout/ConsoleSidebar.tsx — Console navigation sidebar
 *
 * Mirrors the navigation pane of a system settings app:
 *   - a brand block at the top,
 *   - labelled groups of sections (lowercase, letterspaced group titles),
 *   - the active section marked with a 2px accent bar on the left edge,
 *   - a status footer.
 *
 * The item that is active is driven by the scroll spy, so the sidebar always
 * tells the reader where they are in the document.
 */

import { useApp } from '@/context/AppContext'
import { useNavGroups, scrollToSection } from '@/hooks/useNavItems'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/config/navigation'

interface ConsoleSidebarProps {
  /** Called after a navigation click (used to close the mobile drawer). */
  onNavigate?: () => void
}

export function ConsoleSidebar({ onNavigate }: ConsoleSidebarProps) {
  const { t } = useApp()
  const groups = useNavGroups()
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })

  const handleNavigate = (id: string) => {
    scrollToSection(id)
    onNavigate?.()
  }

  return (
    <aside className="console-sidebar no-print">
      {/* Brand block */}
      <div className="border-b border-ct-line px-4 py-4">
        <p className="text-[11px] uppercase tracking-[0.12em] text-ct-subtext-0">
          {t('currículum', 'curriculum')}
        </p>
        <p className="text-sm font-bold text-ct-accent-bright">statick@cv</p>
      </div>

      {/* Navigation */}
      <nav
        aria-label={t('Navegación principal', 'Main navigation')}
        className="flex-1 overflow-y-auto py-2"
      >
        {groups.map((group) => (
          <div key={group.id}>
            <p className="nav-group-title">{group.title}</p>
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="nav-item"
                aria-current={activeSection === item.id ? 'true' : undefined}
                aria-label={item.aria}
                onClick={() => handleNavigate(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Status footer */}
      <div className="mt-auto border-t border-ct-line px-4 py-3 text-[11px] text-ct-subtext-0">
        <p>{t('Loja, Ecuador', 'Loja, Ecuador')}</p>
        <p>{t('100% remoto', '100% remote')}</p>
      </div>
    </aside>
  )
}
