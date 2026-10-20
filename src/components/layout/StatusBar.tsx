/**
 * src/components/layout/StatusBar.tsx — Console status bar
 *
 * The strip at the bottom of the shell. It carries the same information an OS
 * status bar carries: where you are, what the document is, and the shortest
 * paths to the outside (mail, GitHub, LinkedIn).
 */

import { useApp } from '@/context/AppContext'
import { URLS } from '@/config/urls'

export function StatusBar() {
  const { t } = useApp()

  return (
    <footer className="console-statusbar no-print" data-testid="console-statusbar">
      <div className="flex items-center gap-3">
        <span className="text-ct-subtext-1">
          {t('Desarrollador Full Stack & Facilitador', 'Full Stack Developer & Facilitator')}
        </span>
        <span className="text-ct-subtext-0">·</span>
        <span>{t('Loja, Ecuador', 'Loja, Ecuador')}</span>
      </div>

      <div className="flex items-center gap-3">
        <a href={`mailto:${URLS.email}`} className="hover:text-ct-accent-bright">
          {URLS.email}
        </a>
        <span className="text-ct-subtext-0">·</span>
        <a
          href={URLS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ct-accent-bright"
        >
          github
        </a>
        <a
          href={URLS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-ct-accent-bright"
        >
          linkedin
        </a>
      </div>
    </footer>
  )
}
