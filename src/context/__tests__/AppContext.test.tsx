/**
 * AppContext.test.tsx — Tests for AppContext provider and useApp hook
 *
 * Covers:
 *   - Default values (language: 'es', theme: 'dark')
 *   - Language change updates global state
 *   - Theme change updates global state
 *   - Translation helper t() returns correct language
 *   - useApp throws outside provider
 *   - A11y: aria-live announcer on language change
 *   - localStorage persistence
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, act, cleanup } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { AppProvider, useApp, type Language, type Theme } from '../AppContext.js'

// ── Test Consumer Component ──────────────────────────────────────

function TestConsumer() {
  const { language, theme, isLoaded, setLanguage, setTheme, t } = useApp()
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isLoaded">{String(isLoaded)}</span>
      <span data-testid="translated">{t('Hola', 'Hello')}</span>
      <button onClick={() => setLanguage('en')}>Switch to EN</button>
      <button onClick={() => setLanguage('es')}>Switch to ES</button>
      <button onClick={() => setTheme('light')}>Light theme</button>
      <button onClick={() => setTheme('dark')}>Dark theme</button>
    </div>
  )
}

// ── Helpers ──────────────────────────────────────────────────────

function renderProvider(
  ui: React.ReactNode,
  opts?: { language?: Language; theme?: Theme },
) {
  const provider = opts ? (
    <AppProvider
      {...(opts.language != null ? { initialLanguage: opts.language } : {})}
      {...(opts.theme != null ? { initialTheme: opts.theme } : {})}
    >
      {ui}
    </AppProvider>
  ) : (
    <AppProvider>{ui}</AppProvider>
  )
  return render(provider)
}

// ── Tests ────────────────────────────────────────────────────────

describe('AppContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  // ── Default Values ───────────────────────────────────────────

  describe('default values', () => {
    it('defaults to Spanish language', () => {
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('language')).toHaveTextContent('es')
    })

    it('defaults to dark theme', () => {
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })

    it('isLoaded starts false and becomes true after mount', async () => {
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('isLoaded')).toHaveTextContent('false')
      // Wait for the 150ms loading timer
      await screen.findByText('true')
      expect(screen.getByTestId('isLoaded')).toHaveTextContent('true')
    })

    it('t() returns Spanish text by default', () => {
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('translated')).toHaveTextContent('Hola')
    })
  })

  // ── Language Changes ─────────────────────────────────────────

  describe('language changes', () => {
    it('switching to English updates global state', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Switch to EN'))
      expect(screen.getByTestId('language')).toHaveTextContent('en')
      expect(screen.getByTestId('translated')).toHaveTextContent('Hello')
    })

    it('switching back to Spanish restores state', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Switch to EN'))
      await user.click(screen.getByText('Switch to ES'))
      expect(screen.getByTestId('language')).toHaveTextContent('es')
      expect(screen.getByTestId('translated')).toHaveTextContent('Hola')
    })

    it('persists language to localStorage', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Switch to EN'))
      expect(localStorage.getItem('cv-language')).toBe('en')
    })
  })

  // ── Theme Changes ────────────────────────────────────────────

  describe('theme changes', () => {
    it('switching to light theme updates global state', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Light theme'))
      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('syncs dark theme to document.documentElement', () => {
      renderProvider(<TestConsumer />)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('syncs light theme to document.documentElement', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Light theme'))
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('persists theme to localStorage', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Light theme'))
      expect(localStorage.getItem('cv-theme')).toBe('light')
    })
  })

  // ── Initial Props Override ───────────────────────────────────

  describe('initial props override', () => {
    it('respects initialLanguage prop', () => {
      renderProvider(<TestConsumer />, { language: 'en' })
      expect(screen.getByTestId('language')).toHaveTextContent('en')
      expect(screen.getByTestId('translated')).toHaveTextContent('Hello')
    })

    it('respects initialTheme prop', () => {
      renderProvider(<TestConsumer />, { theme: 'light' })
      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })
  })

  // ── localStorage Hydration ───────────────────────────────────

  describe('localStorage hydration', () => {
    it('reads language from localStorage on mount', () => {
      localStorage.setItem('cv-language', 'en')
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('language')).toHaveTextContent('en')
    })

    it('reads theme from localStorage on mount', () => {
      localStorage.setItem('cv-theme', 'light')
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('theme')).toHaveTextContent('light')
    })

    it('ignores invalid language in localStorage', () => {
      localStorage.setItem('cv-language', 'fr')
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('language')).toHaveTextContent('es')
    })

    it('ignores invalid theme in localStorage', () => {
      localStorage.setItem('cv-theme', 'neon')
      renderProvider(<TestConsumer />)
      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    })
  })

  // ── A11y: Language Announcer ─────────────────────────────────

  describe('aria-live announcer', () => {
    it('announces language change via aria-live region', async () => {
      const user = userEvent.setup()
      renderProvider(<TestConsumer />)

      await user.click(screen.getByText('Switch to EN'))

      const announcers = screen.getAllByRole('status')
      const announcer = announcers[announcers.length - 1]!
      expect(announcer).toHaveAttribute('aria-live', 'polite')
      expect(announcer).toHaveAttribute('aria-atomic', 'true')
      expect(announcer).toHaveTextContent(/English/)
    })

    it('announcer has sr-only class', () => {
      renderProvider(<TestConsumer />)
      const announcers = screen.getAllByRole('status')
      const announcer = announcers[announcers.length - 1]!
      expect(announcer.className).toContain('sr-only')
    })
  })

  // ── Error Boundary ───────────────────────────────────────────

  describe('useApp error', () => {
    it('throws when used outside AppProvider', () => {
      // Suppress console.error for expected throw
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

      function BadConsumer() {
        useApp()
        return null
      }

      expect(() => render(<BadConsumer />)).toThrow(
        'useApp must be used within an <AppProvider>',
      )

      spy.mockRestore()
    })
  })

  // ── Provider Wraps Children ──────────────────────────────────

  describe('provider wraps children', () => {
    it('renders children correctly', () => {
      renderProvider(
        <div>
          <span data-testid="child">Child content</span>
        </div>,
      )
      expect(screen.getByTestId('child')).toHaveTextContent('Child content')
    })

    it('multiple children all receive context', async () => {
      const user = userEvent.setup()
      renderProvider(
        <>
          <TestConsumer />
          <TestConsumer />
        </>,
      )

      // Both consumers should show the same language
      const languages = screen.getAllByTestId('language')
      expect(languages).toHaveLength(2)
      expect(languages[0]).toHaveTextContent('es')
      expect(languages[1]).toHaveTextContent('es')

      // Changing language updates both — click first "Switch to EN" button
      const enButtons = screen.getAllByText('Switch to EN')
      await user.click(enButtons[0]!)
      const updatedLanguages = screen.getAllByTestId('language')
      expect(updatedLanguages[0]).toHaveTextContent('en')
      expect(updatedLanguages[1]).toHaveTextContent('en')
    })
  })
})
