/**
 * src/components/layout/MobileMenuButton.tsx — Drawer trigger (top bar)
 *
 * On small screens the sidebar collapses into a drawer; this button lives in
 * the top bar instead of floating over the content.
 */

import { m } from 'framer-motion'
import { useApp } from '@/context/AppContext'

interface MobileMenuButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenuButton({ isOpen, onToggle }: MobileMenuButtonProps) {
  const { t } = useApp()

  return (
    <m.button
      type="button"
      className="chip mr-2 lg:hidden"
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      aria-label={isOpen ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
      aria-expanded={isOpen}
      whileTap={{ scale: 0.96 }}
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        {isOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </m.button>
  )
}
