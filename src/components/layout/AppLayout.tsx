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
import { SectionModalProvider, useSectionModal } from '@/context/SectionModalContext'

interface AppLayoutProps {
  /** Identity column content (photo, contact, facts, languages). */
  aside: ReactNode
  /** Document column content. */
  children: ReactNode
}

function AppLayoutInner({ aside, children }: AppLayoutProps) {
  const { t } = useApp()
  const { printing } = useSectionModal()

  useEffect(() => {
    // Native top-layer dialogs must close for the complete document to print.
    let openDialogs: HTMLDialogElement[] = []
    let closedBeforePrint: HTMLDetailsElement[] | null = null
    const expandForPrint = () => {
      if (closedBeforePrint) return
      printing.current = true
      openDialogs = [...document.querySelectorAll<HTMLDialogElement>('.cv-section-modal[open]')]
      closedBeforePrint = [...document.querySelectorAll<HTMLDetailsElement>('.cv-main details:not([open])')]
      openDialogs.forEach((dialog) => dialog.close())
      closedBeforePrint.forEach((details) => { details.open = true })
    }
    const restoreAfterPrint = () => {
      closedBeforePrint?.forEach((details) => { details.open = false })
      closedBeforePrint = null
      openDialogs.forEach((dialog) => { if (dialog.isConnected && !dialog.open) dialog.showModal() })
      openDialogs = []
      printing.current = false
    }
    window.addEventListener('beforeprint', expandForPrint)
    window.addEventListener('afterprint', restoreAfterPrint)
    return () => {
      window.removeEventListener('beforeprint', expandForPrint)
      window.removeEventListener('afterprint', restoreAfterPrint)
      restoreAfterPrint()
    }
  }, [printing])

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
          <aside className="cv-aside" aria-label={t('Perfil', 'Profile')}>
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

/**
 * Keeps the layout usable by existing standalone consumers while ensuring all
 * navigation and section controls share one modal state.
 */
export function AppLayout({ aside, children }: AppLayoutProps) {
  return (
    <SectionModalProvider>
      <AppLayoutInner aside={aside}>{children}</AppLayoutInner>
    </SectionModalProvider>
  )
}
