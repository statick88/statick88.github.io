/**
 * src/__tests__/components/AppLayout.test.tsx
 *
 * Integration tests for AppLayout component.
 * Verifies initWebVitalsForProject is wired on mount.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { AppProvider } from '@/context/AppContext'

// Mock web-vitals module
const mockInitWebVitalsForProject = vi.fn()

vi.mock('@/lib/web-vitals', () => ({
  initWebVitalsForProject: (...args: []) => mockInitWebVitalsForProject(...args),
}))

// Mock heavy component imports to avoid real lazy loading in tests
vi.mock('@/components/Particles', () => ({
  default: () => <div data-testid="particles" />,
}))
vi.mock('@/components/LanguageToggle', () => ({
  default: () => <div data-testid="lang-toggle" />,
}))
vi.mock('@/components/ThemeToggle', () => ({
  default: () => <div data-testid="theme-toggle" />,
}))
vi.mock('@/components/layout/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
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
        <AppLayout>
          <div>child content</div>
        </AppLayout>
      </AppProvider>
    )

    expect(mockInitWebVitalsForProject).toHaveBeenCalledOnce()
  })

  it('renders children inside the layout', () => {
    const { getByText } = render(
      <AppProvider>
        <AppLayout>
          <div>My child content</div>
        </AppLayout>
      </AppProvider>
    )

    expect(getByText('My child content')).toBeInTheDocument()
  })
})
