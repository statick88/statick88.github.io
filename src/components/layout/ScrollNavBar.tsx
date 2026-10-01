/**
 * src/components/layout/ScrollNavBar.tsx — Progress bar + section dots
 *
 * Consumes useScrollProgress and useScrollSpy from hooks.
 * Desktop: dots navigation. Mobile: hidden.
 */

import { motion } from 'framer-motion'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useNavItems, scrollToSection } from '@/hooks/useNavItems'
import { SECTION_IDS } from '@/config/navigation'

export function ScrollNavBar() {
  const { progress } = useScrollProgress()
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })
  const navItems = useNavItems()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 no-print"
      role="navigation"
      aria-label="Progreso de lectura"
    >
      {/* Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/30"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: 'easeOut' }}
        />
      </div>

      {/* Section Indicators — Desktop dots */}
      <motion.div className="hidden lg:flex justify-center gap-1.5 px-4 py-2 bg-black/50 backdrop-blur-md border-b border-white/5">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id
          const isScrolledPast = navItems
            .slice(0, index + 1)
            .some((nav) => activeSection === nav.id)

          return (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && scrollToSection(item.id)}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.8 }}
              aria-label={item.aria}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
              className={`relative w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                isActive
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] ring-2 ring-cyan-400/30'
                  : isScrolledPast
                    ? 'bg-cyan-500/60 hover:bg-cyan-400'
                    : 'bg-white/20 hover:bg-white/40'
              }`}
            >
              <motion.span
                className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded bg-gray-900 border border-white/10 text-white opacity-0 pointer-events-none"
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? -4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
