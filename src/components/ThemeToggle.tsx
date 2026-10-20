/**
 * src/components/ThemeToggle.tsx — Theme switcher (top bar chip)
 *
 * The console ships with a real dark theme and a real light ("paper terminal")
 * theme: both are token flips in `src/index.css`, so this control changes the
 * whole interface instead of doing nothing.
 */

import { m } from 'framer-motion'
import type { Theme } from '@/context/AppContext'

interface ThemeToggleProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export default function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <m.button
      type="button"
      data-testid="theme-toggle"
      onClick={toggleTheme}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTheme()}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="chip hover:border-ct-accent"
    >
      <m.span
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="inline-block"
        aria-hidden="true"
      >
        {theme === 'dark' ? '☾' : '☀'}
      </m.span>
    </m.button>
  )
}
