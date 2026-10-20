/**
 * src/components/layout/AppLayout.tsx — Root layout wrapper (console shell)
 *
 * Wraps the entire app with:
 *   - AppProvider (language, theme, loading)
 *   - ProfileProvider (active CV profile)
 *   - LazyMotion (framer-motion)
 *   - Skip-to-content link (a11y)
 *   - The console shell: sidebar + main column (top bar, scene, status bar)
 */

import { useEffect, useState, type ReactNode } from 'react'
import { LazyMotion, domAnimation } from 'framer-motion'
import { AppProvider, useApp } from '@/context/AppContext'
import { ProfileProvider } from '@/context/ProfileContext'
import { ConsoleSidebar } from '@/components/layout/ConsoleSidebar'
import { ConsoleTopBar } from '@/components/layout/ConsoleTopBar'
import { StatusBar } from '@/components/layout/StatusBar'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { initWebVitalsForProject } from '@/lib/web-vitals'

interface AppLayoutProps {
  children: ReactNode
}

function AppLayoutInner({ children }: AppLayoutProps) {
  const { t, isLoaded } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)

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
      <div className="min-h-screen">
        {/* Skip to main content — a11y */}
        <a href="#main-content" className="skip-link">
          {t('Saltar al contenido principal', 'Skip to main content')}
        </a>

        <div className="console-shell">
          <ConsoleSidebar />

          <div className="console-main">
            <ConsoleTopBar isMenuOpen={menuOpen} onOpenMenu={() => setMenuOpen((open) => !open)} />

            <main
              id="main-content"
              className={`console-scene transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {children}
            </main>

            <StatusBar />
          </div>
        </div>

        <MobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </LazyMotion>
  )
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <AppProvider>
      <ProfileProvider>
        <AppLayoutInner>{children}</AppLayoutInner>
      </ProfileProvider>
    </AppProvider>
  )
}
