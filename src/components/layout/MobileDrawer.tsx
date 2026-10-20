/**
 * src/components/layout/MobileDrawer.tsx — Mobile navigation drawer
 *
 * Below 1024px the sidebar becomes a drawer. It reuses the same navigation
 * config and the same scroll spy as the desktop sidebar, so both stay in sync.
 */

import { AnimatePresence, m } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { useNavGroups, scrollToSection } from '@/hooks/useNavItems'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { SECTION_IDS } from '@/config/navigation'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useApp()
  const groups = useNavGroups()
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })

  const handleNav = (id: string) => {
    scrollToSection(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 lg:hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('Menú de navegación', 'Navigation menu')}
        >
          <m.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-ct-surface-0 border-r border-ct-line flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-ct-line px-4 py-4">
              <p className="text-sm font-bold text-ct-accent-bright">statick@cv</p>
              <p className="text-[11px] text-ct-subtext-0">
                {t('Secciones', 'Sections')}
              </p>
            </div>

            <nav aria-label={t('Navegación principal', 'Main navigation')} className="flex-1 overflow-y-auto py-2">
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
                      onClick={() => handleNav(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ))}
            </nav>

            <div className="border-t border-ct-line px-4 py-3 text-[11px] text-ct-subtext-0">
              {t('100% remoto', '100% remote')} · {t('Loja, Ecuador', 'Loja, Ecuador')}
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
