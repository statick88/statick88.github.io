/**
 * src/components/LanguageToggle.tsx — Language switcher (top bar chip)
 *
 * Toggle between 'es' and 'en'. The chip shows the language you are about to
 * switch TO, which is the classic settings-app convention.
 *
 * A11y:
 *   - aria-label announces current state and target
 *   - Keyboard: Enter and Space trigger toggle
 *   - Screen reader sees "Cambiar a inglés" / "Switch to Spanish"
 */

import { m } from 'framer-motion'
import type { Language } from '@/context/AppContext'

interface LanguageToggleProps {
  language: Language
  setLanguage: (lang: Language) => void
}

export default function LanguageToggle({ language, setLanguage }: LanguageToggleProps) {
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  const nextLanguage = language === 'es' ? 'EN' : 'ES'

  return (
    <m.button
      type="button"
      data-testid="language-toggle"
      onClick={toggleLanguage}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleLanguage()}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      className="chip font-bold hover:border-ct-accent"
    >
      {nextLanguage}
    </m.button>
  )
}
