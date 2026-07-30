/**
 * src/components/layout/AppLayout.tsx — Root layout wrapper
 *
 * Wraps the entire app with:
 *   - AppProvider (language, theme, loading)
 *   - LazyMotion (framer-motion)
 *   - Skip-to-content link (a11y)
 *   - Particles background
 *   - Theme toggle + Language toggle
 *   - Main content area with opacity transition
 *   - Footer
 */

import { useEffect } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { AppProvider } from '@/context/AppContext'
import { useApp } from '@/context/AppContext'
import Particles from '@/components/Particles'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
import { Footer } from '@/components/layout/Footer'
import { initPrefetching } from '@/lib/prefetch'
import { initWebVitalsForProject } from '@/lib/web-vitals'

interface AppLayoutProps {
  children: React.ReactNode
}

function AppLayoutInner({ children }: AppLayoutProps) {
  const { language, setLanguage, theme, setTheme, isLoaded, t } = useApp()

  useEffect(() => {
    const cleanupPrefetch = initPrefetching()
    const vitalsEndpoint = import.meta.env.VITE_VITALS_ENDPOINT
    if (vitalsEndpoint) {
      initWebVitalsForProject(vitalsEndpoint)
    } else {
      initWebVitalsForProject()
    }
    return () => cleanupPrefetch()
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="min-h-screen relative">
        {/* Skip to main content — a11y */}
        <a href="#main-content" className="skip-link">
          {t('Saltar al contenido principal', 'Skip to main content')}
        </a>

        <Particles />

        {/* Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        {/* Main Content */}
        <main
          id="main-content"
          className={`relative z-10 max-w-4xl mx-auto px-4 py-8 transition-opacity duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {children}
        </main>

        <Footer />
      </div>
    </LazyMotion>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </AppProvider>
  )
}
