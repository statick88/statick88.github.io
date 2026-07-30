/**
 * src/components/layout/MobileMenuButton.tsx — Floating action button for mobile nav
 *
 * Fixed position FAB that toggles the mobile drawer.
 */

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'

interface MobileMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  const { t } = useApp()

  return (
    <motion.button
      className="fixed bottom-6 right-6 z-50 lg:hidden w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-full text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all no-print flex items-center justify-center"
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      aria-label={isOpen ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
      aria-expanded={isOpen}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      tabIndex={0}
    >
      <motion.svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </motion.svg>
    </motion.button>
  )
}
