/**
 * src/components/layout/MobileDrawer.tsx — Mobile navigation drawer
 *
 * Slide-in drawer with section links. Uses useScrollSpy for active state.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useNavItems, scrollToSection } from '@/hooks/useNavItems'
import { useApp } from '@/context/AppContext'
import { SECTION_IDS } from '@/config/navigation'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { t } = useApp()
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })
  const navItems = useNavItems()

  const handleNav = (id: string) => {
    scrollToSection(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden bg-black/90 backdrop-blur-md"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('Menú de navegación', 'Navigation menu')}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 to-black border-r border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="pt-20 pb-6 px-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {t('Navegación', 'Navigation')}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {t('Selecciona una sección', 'Select a section')}
              </p>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-2" role="navigation">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-4 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-300 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="mobileActive"
                        className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
              <p className="text-gray-500 text-xs text-center">
                {t('Navegación rápida', 'Quick navigation')} • CV Diego
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
