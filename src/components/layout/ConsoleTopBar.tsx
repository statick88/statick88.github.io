/**
 * src/components/layout/ConsoleTopBar.tsx — Console top bar
 *
 * The strip that runs above the scene: brand on the left, the controls that
 * change the context of the whole document on the right (profile, language,
 * theme), and the drawer trigger on small screens.
 */

import { useApp } from '@/context/AppContext'
import ProfileSelector from '@/components/ProfileSelector'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
import { MobileMenuButton } from '@/components/layout/MobileMenuButton'
import { useCVData } from '@/hooks/useCVData'

interface ConsoleTopBarProps {
  /** Opens the mobile navigation drawer. */
  onOpenMenu: () => void
  /** Whether the drawer is currently open. */
  isMenuOpen: boolean
}

export function ConsoleTopBar({ onOpenMenu, isMenuOpen }: ConsoleTopBarProps) {
  const { language, setLanguage, theme, setTheme } = useApp()
  const name = useCVData((data) => data.basics.name)
  const email = useCVData((data) => data.contact.email)

  return (
    <header className="console-tabbar no-print" data-testid="console-tabbar">
      <MobileMenuButton isOpen={isMenuOpen} onToggle={onOpenMenu} />

      <span className="tab is-active" data-testid="console-brand">
        {name}
      </span>

      <a
        href={`mailto:${email}`}
        className="hidden items-center text-[11px] text-ct-subtext-0 hover:text-ct-accent-bright sm:inline-flex"
      >
        {email}
      </a>

      <div className="ml-auto flex items-center gap-2">
        <ProfileSelector />
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  )
}
