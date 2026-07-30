/**
 * src/context/AppContext.tsx — Global application context
 *
 * Manages: language (persisted), theme (persisted), loading state.
 * Provides useApp() hook for typed access.
 *
 * Persistence strategy:
 *   - Read from localStorage SYNCHRONOUSLY during useState initializer.
 *   - Write to localStorage in a separate useEffect (fire-and-forget).
 *   - This prevents the "flash" because the first render already has the correct value.
 *
 * A11y:
 *   - Language changes are announced via an aria-live region.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

// ── Types ────────────────────────────────────────────────────────

export type Language = 'es' | 'en'
export type Theme = 'dark' | 'light'

export interface AppState {
  language: Language
  theme: Theme
  isLoaded: boolean
}

export interface AppActions {
  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  /** Translation helper: t(esText, enText) → current language text */
  t: <T extends string>(es: T, en: T) => T
}

export type AppContextValue = AppState & AppActions

// ── Constants ────────────────────────────────────────────────────

const LANGUAGE_KEY = 'cv-language'
const THEME_KEY = 'cv-theme'
const VALID_LANGUAGES: readonly Language[] = ['es', 'en']
const VALID_THEMES: readonly Theme[] = ['dark', 'light']

// ── localStorage Helpers ─────────────────────────────────────────

function readPersistedLanguage(): Language {
  try {
    const stored = localStorage.getItem(LANGUAGE_KEY)
    if (stored && (VALID_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as Language
    }
  } catch {
    // SSR or localStorage unavailable — fall through to default
  }
  return 'es'
}

function readPersistedTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored && (VALID_THEMES as readonly string[]).includes(stored)) {
      return stored as Theme
    }
  } catch {
    // Fall through to default
  }
  return 'dark'
}

function persistLanguage(lang: Language): void {
  try {
    localStorage.setItem(LANGUAGE_KEY, lang)
  } catch {
    // Quota exceeded or private browsing — silent fail
  }
}

function persistTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Silent fail
  }
}

// ── Context ──────────────────────────────────────────────────────

const AppContext = createContext<AppContextValue | null>(null)

// ── Provider ─────────────────────────────────────────────────────

export interface AppProviderProps {
  children: ReactNode
  /** Override initial language (for testing) */
  initialLanguage?: Language
  /** Override initial theme (for testing) */
  initialTheme?: Theme
}

export function AppProvider({
  children,
  initialLanguage,
  initialTheme,
}: AppProviderProps) {
  // Initialize from props (testing) or localStorage (production)
  const [language, setLanguageState] = useState<Language>(
    initialLanguage ?? readPersistedLanguage,
  )
  const [theme, setThemeState] = useState<Theme>(
    initialTheme ?? readPersistedTheme,
  )
  const [isLoaded, setIsLoaded] = useState(false)

  // ── Language ───────────────────────────────────────────────────

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  // Persist language changes
  useEffect(() => {
    persistLanguage(language)
  }, [language])

  // ── Theme ──────────────────────────────────────────────────────

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  // Sync theme to <html> classList (runs on mount + theme change)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  // Persist theme changes
  useEffect(() => {
    persistTheme(theme)
  }, [theme])

  // ── Loading ────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150)
    return () => clearTimeout(timer)
  }, [])

  // ── Translation helper ─────────────────────────────────────────

  const t = useCallback(
    <T extends string>(es: T, en: T): T => {
      return language === 'es' ? es : en
    },
    [language],
  )

  // ── Memoized value ─────────────────────────────────────────────

  const value = useMemo<AppContextValue>(
    () => ({
      language,
      theme,
      isLoaded,
      setLanguage,
      setTheme,
      t,
    }),
    [language, theme, isLoaded, setLanguage, setTheme, t],
  )

  return (
    <AppContext.Provider value={value}>
      {children}
      {/* A11y: Announce language changes to screen readers */}
      <LanguageAnnouncer language={language} />
    </AppContext.Provider>
  )
}

// ── A11y: Language Change Announcer ──────────────────────────────

function LanguageAnnouncer({ language }: { language: Language }) {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const label = language === 'es' ? 'Español' : 'English'
    setAnnouncement(`Idioma cambiado a ${label}`)
    // Clear after screen reader has time to read it
    const timer = setTimeout(() => setAnnouncement(''), 1000)
    return () => clearTimeout(timer)
  }, [language])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}

// ── Hook ─────────────────────────────────────────────────────────

/**
 * useApp — Primary hook to consume AppContext.
 *
 * @throws Error if used outside <AppProvider>
 */
export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an <AppProvider>')
  }
  return context
}
