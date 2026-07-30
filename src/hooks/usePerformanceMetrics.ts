/**
 * src/hooks/usePerformanceMetrics.ts — React hook for Core Web Vitals
 *
 * Wraps the web-vitals library (LCP, INP, CLS) into a React hook
 * that provides real-time metrics and reporting.
 *
 * Usage:
 *   const { metrics, isReporting } = usePerformanceMetrics()
 *
 * Features:
 *   - Captures LCP, INP (replaced FID), CLS
 *   - Reports to configurable endpoint (fire-and-forget)
 *   - Respects do-not-track and sample rate
 *   - Returns current metric values for dashboard display
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals'

// ── Types ────────────────────────────────────────────────────────

export interface MetricValue {
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  id: string
  timestamp: number
}

export interface PerformanceMetrics {
  lcp: MetricValue | null
  inp: MetricValue | null
  cls: MetricValue | null
}

export interface UsePerformanceMetricsConfig {
  /** Endpoint to POST metrics to */
  endpoint?: string
  /** Sample rate (0-1) — defaults to 0.1 in production, 1 in dev */
  sampleRate?: number
  /** Force reporting even if DNT is enabled */
  forceReport?: boolean
  /** Callback when a metric is captured */
  onMetric?: (metric: MetricValue) => void
}

export interface UsePerformanceMetricsReturn {
  /** Current metric values */
  metrics: PerformanceMetrics
  /** Whether reporting is active */
  isReporting: boolean
  /** Manually trigger a report */
  flush: () => void
}

// ── Constants ────────────────────────────────────────────────────

const DNT = navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes'

// ── Helpers ──────────────────────────────────────────────────────

function metricToValue(metric: Metric): MetricValue {
  return {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    timestamp: Date.now(),
  }
}

async function sendPayload(endpoint: string, payload: unknown): Promise<void> {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Fire-and-forget — vitals must never break UX
  }
}

// ── Hook ─────────────────────────────────────────────────────────

export function usePerformanceMetrics(
  config: UsePerformanceMetricsConfig = {},
): UsePerformanceMetricsReturn {
  const { endpoint, sampleRate, forceReport = false, onMetric } = config

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    inp: null,
    cls: null,
  })
  const [isReporting, setIsReporting] = useState(false)

  // Use refs to avoid stale closures
  const configRef = useRef({ endpoint, sampleRate, forceReport, onMetric })
  configRef.current = { endpoint, sampleRate, forceReport, onMetric }

  // Determine if we should report
  const shouldReport = useCallback((): boolean => {
    const { forceReport, sampleRate } = configRef.current
    if (DNT && !forceReport) return false
    const rate = sampleRate ?? (import.meta.env.DEV ? 1 : 0.1)
    return Math.random() < rate
  }, [])

  // Handle metric capture
  const handleMetric = useCallback(
    (metric: Metric) => {
      const value = metricToValue(metric)

      setMetrics((prev) => ({
        ...prev,
        [metric.name.toLowerCase()]: value,
      }))

      // Callback
      configRef.current.onMetric?.(value)

      // Send to endpoint if configured and sampled
      if (configRef.current.endpoint && shouldReport()) {
        sendPayload(configRef.current.endpoint, {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          timestamp: value.timestamp,
          url: window.location.href,
          userAgent: navigator.userAgent,
        })
      }
    },
    [shouldReport],
  )

  // Register observers on mount
  useEffect(() => {
    setIsReporting(true)

    // web-vitals v5+ — these functions don't return unsubscribe
    onLCP(handleMetric)
    onINP(handleMetric)
    onCLS(handleMetric)

    return () => {
      setIsReporting(false)
    }
  }, [handleMetric])

  // Manual flush (for testing or batch reporting)
  const flush = useCallback(() => {
    if (configRef.current.endpoint && (metrics.lcp || metrics.inp || metrics.cls)) {
      sendPayload(configRef.current.endpoint, {
        type: 'flush',
        metrics,
        timestamp: Date.now(),
        url: window.location.href,
      })
    }
  }, [metrics])

  return { metrics, isReporting, flush }
}
