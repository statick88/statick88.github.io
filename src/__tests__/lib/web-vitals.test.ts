/**
 * src/__tests__/lib/web-vitals.test.ts
 *
 * Tests for Web Vitals reporting module.
 * Mocks the web-vitals package to verify callback wiring,
 * console logging, and optional endpoint POST behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock web-vitals package
const mockOnLCP = vi.fn()
const mockOnCLS = vi.fn()
const mockOnINP = vi.fn()

vi.mock('web-vitals', () => ({
  onLCP: (cb: Parameters<typeof mockOnLCP>[0]) => mockOnLCP(cb),
  onCLS: (cb: Parameters<typeof mockOnCLS>[0]) => mockOnCLS(cb),
  onINP: (cb: Parameters<typeof mockOnINP>[0]) => mockOnINP(cb),
}))

// Import after mock setup
const { initWebVitals } = await import('@/lib/web-vitals')

describe('web-vitals', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>
  let fetchSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response())
  })

  afterEach(() => {
    consoleSpy.mockRestore()
    fetchSpy.mockRestore()
  })

  describe('initWebVitals', () => {
    it('registers LCP, CLS, and INP callbacks', () => {
      initWebVitals()

      expect(mockOnLCP).toHaveBeenCalledOnce()
      expect(mockOnCLS).toHaveBeenCalledOnce()
      expect(mockOnINP).toHaveBeenCalledOnce()
    })

    it('logs metric to console when callback fires', () => {
      initWebVitals()

      // Get the callback that was passed to onLCP
      const lcpCallback = mockOnLCP.mock.calls[0]![0]
      const mockMetric = { name: 'LCP', value: 1200, rating: 'good', id: 'test-id', delta: 1200 }

      lcpCallback(mockMetric)

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('LCP'),
      )
    })

    it('POSTs to endpoint when configured', () => {
      initWebVitals({ endpoint: 'https://analytics.example.com/vitals' })

      const clsCallback = mockOnCLS.mock.calls[0]![0]
      const mockMetric = { name: 'CLS', value: 0.05, rating: 'good', id: 'cls-1', delta: 0.05, navigationType: 'navigate', entries: [] }

      clsCallback(mockMetric)

      expect(fetchSpy).toHaveBeenCalledWith(
        'https://analytics.example.com/vitals',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('"name":"CLS"'),
        })
      )
    })

    it('does not POST when no endpoint configured', () => {
      initWebVitals()

      const lcpCallback = mockOnLCP.mock.calls[0]![0]
      const mockMetric = { name: 'LCP', value: 1200, rating: 'good', id: 'test-id', delta: 1200 }

      lcpCallback(mockMetric)

      expect(fetchSpy).not.toHaveBeenCalled()
    })

    it('logs all three metrics (LCP, CLS, INP)', () => {
      initWebVitals()

      const lcpCb = mockOnLCP.mock.calls[0]![0]
      const clsCb = mockOnCLS.mock.calls[0]![0]
      const inpCb = mockOnINP.mock.calls[0]![0]

      lcpCb({ name: 'LCP', value: 1200, rating: 'good', id: 'lcp-1', delta: 1200 })
      clsCb({ name: 'CLS', value: 0.05, rating: 'good', id: 'cls-1', delta: 0.05 })
      inpCb({ name: 'INP', value: 150, rating: 'good', id: 'inp-1', delta: 150 })

      expect(consoleSpy).toHaveBeenCalledTimes(3)
    })

    it('forces debug mode when debug option is true', () => {
      initWebVitals({ debug: true })

      const lcpCallback = mockOnLCP.mock.calls[0]![0]
      const mockMetric = { name: 'LCP', value: 1200, rating: 'good', id: 'test-id', delta: 1200 }

      lcpCallback(mockMetric)

      // Should still log to console even without endpoint
      expect(consoleSpy).toHaveBeenCalled()
    })

    it('handles fetch failure gracefully when endpoint configured', async () => {
      fetchSpy.mockRejectedValueOnce(new Error('Network error'))

      initWebVitals({ endpoint: 'https://analytics.example.com/vitals' })

      const lcpCallback = mockOnLCP.mock.calls[0]![0]
      const mockMetric = { name: 'LCP', value: 1200, rating: 'good', id: 'test-id', delta: 1200 }

      // Should not throw
      expect(() => lcpCallback(mockMetric)).not.toThrow()

      // Console log should still work even if fetch fails
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
})
