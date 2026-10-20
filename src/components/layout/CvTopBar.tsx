/**
 * src/components/layout/CvTopBar.tsx — Document top bar
 *
 * The only chrome the sheet has: the identity on the left, the section links
 * in the middle (they mark the section you are reading) and the controls that
 * change the context of the whole document on the right.
 */

import { useApp } from '@/context/AppContext'
import ProfileSelector from '@/components/ProfileSelector'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
import { useNavGroups, scrollToSection } from '@/hooks/useNavItems'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useCVData } from '@/hooks/useCVData'
import { SECTION_IDS } from '@/config/navigation'

export function CvTopBar() {
  const { t, language, setLanguage, theme, setTheme } = useApp()
  const groups = useNavGroups()
  const { activeSection } = useScrollSpy({ sectionIds: [...SECTION_IDS] })
  const name = useCVData((data) => data.basics.name)
  const email = useCVData((data) => data.contact.email)

  const items = groups.flatMap((group) => group.items)

  return (
    <header className="cv-topbar no-print" data-testid="console-tabbar">
      <span className="text-sm font-bold text-ct-text" data-testid="console-brand">
        {name}
      </span>

      <nav aria-label={t('Navegación principal', 'Main navigation')} className="cv-topbar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="cv-topbar-link"
            aria-current={activeSection === item.id ? 'true' : undefined}
            aria-label={item.aria}
            onClick={() => scrollToSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <a
          href={`mailto:${email}`}
          className="hidden text-[11px] text-ct-subtext-0 hover:text-ct-accent md:inline"
        >
          {email}
        </a>
        <ProfileSelector />
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  )
}
