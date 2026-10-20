/**
 * src/__tests__/components/AppLayout.test.tsx
 *
 * Integration tests for the AppLayout component.
 *
 * The layout changed shape with the console redesign: the old scroll-spy
 * prefetch mechanism is gone (sections are no longer lazy chunks), so those
 * assertions were replaced by the new contract — the shell renders its three
 * zones, the skip link points at the main content, and web-vitals still boots.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'
import { ProfileProvider } from '@/context/ProfileContext'

const mockInitWebVitals = vi.fn()

vi.mock('@/lib/web-vitals', () => ({
  initWebVitalsForProject: (...args: []) => mockInitWebVitals(...args),
}))

vi.mock('@/components/Particles', () => ({
  default: () => <div data-testid="particles" />,
}))

vi.mock('@/components/LanguageToggle', () => ({
  default: () => <div data-testid="lang-toggle" />,
}))

vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))

// Import after mocks
const { AppLayout } = await import('@/components/layout/AppLayout')

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it('calls initWebVitalsForProject on mount', () => {
    render(
      <AppProvider>
        <ProfileProvider>
        <AppLayout aside={<div>identity column</div>}>
          <div>child content</div>
        </AppLayout>
        </ProfileProvider>
      </AppProvider>
    )

    expect(mockInitWebVitals).toHaveBeenCalledOnce()
  })

  it('renders children inside the layout', () => {
    const { getByText } = render(
      <AppProvider>
        <ProfileProvider>
        <AppLayout aside={<div>identity column</div>}>
          <div>My child content</div>
        </AppLayout>
        </ProfileProvider>
      </AppProvider>
    )

    expect(getByText('My child content')).toBeInTheDocument()
  })

  it('renders the console shell zones', () => {
    const { getByTestId, getByRole } = render(
      <AppProvider>
        <ProfileProvider>
        <AppLayout aside={<div>identity column</div>}>
          <div>child content</div>
        </AppLayout>
        </ProfileProvider>
      </AppProvider>
    )

    expect(getByTestId('console-tabbar')).toBeInTheDocument()
    expect(getByRole('navigation')).toBeInTheDocument()
    expect(getByRole('complementary')).toBeInTheDocument()
    expect(getByRole('main')).toBeInTheDocument()
  })

  it('exposes a skip link to the main content', () => {
    const { getByRole } = render(
      <AppProvider>
        <ProfileProvider>
        <AppLayout aside={<div>identity column</div>}>
          <div>child content</div>
        </AppLayout>
        </ProfileProvider>
      </AppProvider>
    )

    const skipLink = getByRole('link', { name: /saltar al contenido|skip to main content/i })
    expect(skipLink).toHaveAttribute('href', '#main-content')
  })
})
