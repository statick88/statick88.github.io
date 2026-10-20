/**
 * src/components/layout/AppLayout.tsx — Root layout (corporate CV sheet)
 *
 * The page is a document, not an app:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ top bar: identity · section links · controls │
 *   ├───────────────┬──────────────────────────────┤
 *   │ navy identity │ white document column         │
 *   │ column        │ (name, experience, projects…) │
 *   └───────────────┴──────────────────────────────┘
 *
 * The sheet is one page: it scrolls as a whole, prints as a CV and stays
 * linear for the ATS exports.
 */

import { useEffect, type ReactNode } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { CvTopBar } from '@/components/layout/CvTopBar'
import { initWebVitalsForProject } from '@/lib/web-vitals'

interface AppLayoutProps {
  /** Identity column content (photo, contact, facts, languages). */
  aside: ReactNode
  /** Document column content. */
  children: ReactNode
}

function AppLayoutInner({ aside, children }: AppLayoutProps) {
  const { t } = useApp()

  useEffect(() => {
    const vitalsEndpoint = import.meta.env.VITE_VITALS_ENDPOINT
    if (vitalsEndpoint) {
      initWebVitalsForProject(vitalsEndpoint)
    } else {
      initWebVitalsForProject()
    }
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Skip to main content — a11y */}
      <a href="#main-content" className="skip-link">
        {t('Saltar al contenido principal', 'Skip to main content')}
      </a>

      <CvTopBar />

      <div className="cv-page">
        <div className="cv-sheet">
          <aside className="cv-aside no-print" aria-label={t('Perfil', 'Profile')}>
            {aside}
          </aside>

          <main id="main-content" className="cv-main">
            {children}
          </main>
        </div>
      </div>
    </LazyMotion>
  )
}

export function AppLayout({ aside, children }: AppLayoutProps) {
  return <AppLayoutInner aside={aside}>{children}</AppLayoutInner>
}
