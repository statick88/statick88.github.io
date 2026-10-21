/**
 * src/components/layout/CvTopBar.tsx — Document top bar
 *
 * The only chrome the sheet has: the identity on the left, the section links
 * in the middle (they mark the section you are reading) and the controls that
 * change the context of the whole document on the right, plus the link that
 * downloads the published CV.
 */

import { useApp } from '@/context/AppContext'
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

  // The CV is one document per language: the link points to the published PDF
  // of the language the interface is showing, never to a profile variant.
  const cvHref = language === 'es' ? '/cv-es.pdf' : '/cv-en.pdf'

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
        <a
          href={cvHref}
          download
          data-testid="cv-download-link"
          aria-label={t('Descargar el CV en PDF', 'Download the CV as PDF')}
          className="chip chip-accent hover:border-ct-accent"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            />
          </svg>
          <span className="font-bold">CV</span>
        </a>
        <LanguageToggle language={language} setLanguage={setLanguage} />
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
    </header>
  )
}
