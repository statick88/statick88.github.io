/**
 * src/lib/web-vitals.ts — Web Vitals reporting
 *
 * Reports LCP, CLS, INP to console + optional endpoint.
 * Uses web-vitals library (v5+) with attribution.
 *
 * Config:
 *   - endpoint: URL to POST metrics to (e.g., Cloudflare Analytics)
 *   - debug: force console logging even in production
 *
 * Integration:
 *   import { initWebVitals } from '@/lib/web-vitals'
 *   initWebVitals({ endpoint: '/api/vitals', debug: true })
 */

import { onCLS, onINP, onLCP, type Metric } from 'web-vitals'

export interface WebVitalsConfig {
  /** Endpoint to POST metrics to (optional) */
  endpoint?: string
  /** Force console logging even in production */
  debug?: boolean
  /** Sample rate (0-1) for endpoint reporting */
  sampleRate?: number
}

interface VitalsPayload {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  entries: PerformanceEntry[]
  navigationType?: string
  timestamp: number
  url: string
  userAgent: string
}

/**
 * Send metric to configured endpoint.
 * Fire-and-forget — errors are silently ignored.
 */
async function sendToEndpoint(endpoint: string, payload: VitalsPayload): Promise<void> {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      // Don't block page unload
      keepalive: true,
    })
  } catch {
    // Silently ignore — vitals reporting must never break UX
  }
}

/**
 * Format metric for console output.
 */
function formatMetric(metric: Metric): string {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
  return `${emoji} [${metric.name}] ${metric.value.toFixed(2)} ${metric.rating} (delta: ${metric.delta.toFixed(2)})`
}

/**
 * Initialize Web Vitals reporting.
 * Call once at app startup (e.g., in AppLayout useEffect).
 */
export function initWebVitals(config: WebVitalsConfig = {}): void {
  const { endpoint, debug = false, sampleRate = 1 } = config

  // Only sample if not in debug mode
  const shouldReport = debug || Math.random() < sampleRate

  const handler = (metric: Metric) => {
    // Always log to console in development or if debug=true
    const isDev = import.meta.env.DEV
    if (isDev || debug) {
      console.log(formatMetric(metric))
    }

    // Report to endpoint if configured and sampled
    if (endpoint && shouldReport) {
      const payload: VitalsPayload = {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        entries: metric.entries,
        navigationType: metric.navigationType,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }
      sendToEndpoint(endpoint, payload)
    }
  }

  // Register metric observers
  onLCP(handler)
  onINP(handler)
  onCLS(handler)
}

/**
 * Helper to init with sensible defaults for this project.
 * In production: logs to console + sends to endpoint (if configured)
 * In development: always logs to console, no endpoint
 */
export function initWebVitalsForProject(endpoint?: string): void {
  const isDev = import.meta.env.DEV
  const config: WebVitalsConfig = {
    debug: isDev,
    sampleRate: isDev ? 1 : 0.1,
  }
  if (endpoint) {
    config.endpoint = endpoint
  }
  initWebVitals(config)
}