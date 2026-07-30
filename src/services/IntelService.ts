/**
 * src/services/IntelService.ts — Threat intelligence lookup service
 *
 * Checks file SHA-256 hashes against a configurable proxy endpoint.
 * NEVER sends file contents — only the hash. Includes built-in
 * rate limiting and error handling.
 */

import type { IntelResult } from '@/types/forensic'

// ── Types ───────────────────────────────────────────────────────

/** Configuration for IntelService */
export interface IntelServiceConfig {
  /** Proxy endpoint URL (default: '/api/intel') */
  endpoint?: string
  /** Maximum requests per minute (default: 30) */
  rateLimit?: number
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number
}

// ── Rate Limiter ────────────────────────────────────────────────

/**
 * Simple sliding-window rate limiter.
 * Tracks request timestamps and blocks when the limit is exceeded.
 */
class RateLimiter {
  private timestamps: number[] = []
  private readonly maxRequests: number
  private readonly windowMs: number

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
  }

  /**
   * Checks if a request is allowed under the current rate limit.
   * Prunes expired timestamps before checking.
   */
  canProceed(): boolean {
    const now = Date.now()
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs)
    return this.timestamps.length < this.maxRequests
  }

  /** Records a request timestamp. */
  record(): void {
    this.timestamps.push(Date.now())
  }

  /** Returns the number of requests remaining in the current window. */
  remaining(): number {
    const now = Date.now()
    this.timestamps = this.timestamps.filter((t) => now - t < this.windowMs)
    return Math.max(0, this.maxRequests - this.timestamps.length)
  }
}

// ── IntelService ────────────────────────────────────────────────

/**
 * Threat intelligence lookup service.
 *
 * @example
 * ```ts
 * const intel = new IntelService({ endpoint: '/api/intel' })
 * const result = await intel.checkHash('a1b2c3d4...')
 * if (result.malicious) {
 *   console.log(`Detected by ${result.detections}/${result.engines} engines`)
 * }
 * ```
 */
export class IntelService {
  private readonly endpoint: string
  private readonly timeout: number
  private readonly limiter: RateLimiter
  private cache = new Map<string, IntelResult>()

  constructor(config?: IntelServiceConfig) {
    this.endpoint = config?.endpoint ?? '/api/intel'
    this.timeout = config?.timeout ?? 10_000
    this.limiter = new RateLimiter(config?.rateLimit ?? 30, 60_000)
  }

  /**
   * Checks a SHA-256 hash against the threat intelligence backend.
   *
   * @param sha256 - The hex-encoded SHA-256 hash to look up
   * @returns IntelResult with detection details
   * @throws {IntelRateLimitError} When rate limit is exceeded
   * @throws {IntelNetworkError} When the request fails
   * @throws {IntelValidationError} When the hash format is invalid
   */
  async checkHash(sha256: string): Promise<IntelResult> {
    // Validate hash format
    if (!/^[a-fA-F0-9]{64}$/.test(sha256)) {
      throw new IntelValidationError(
        `Invalid SHA-256 hash: expected 64 hex characters, got ${sha256.length}`,
      )
    }

    const normalizedHash = sha256.toLowerCase()

    // Check cache first
    const cached = this.cache.get(normalizedHash)
    if (cached) {
      return { ...cached, cached: true }
    }

    // Check rate limit
    if (!this.limiter.canProceed()) {
      throw new IntelRateLimitError(
        `Rate limit exceeded. ${this.limiter.remaining()} requests remaining.`,
      )
    }

    this.limiter.record()

    // Make the request with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const url = `${this.endpoint}/${normalizedHash}`
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new IntelNetworkError(
          `Intel lookup failed: ${response.status} ${response.statusText}`,
        )
      }

      const data = (await response.json()) as Record<string, unknown>

      const result: IntelResult = {
        malicious: Boolean(data.malicious),
        detections: Number(data.detections) || 0,
        engines: Number(data.engines) || 0,
        cached: false,
      }
      
      if (typeof data.permalink === 'string') {
        result.permalink = data.permalink
      }

      // Cache successful results
      this.cache.set(normalizedHash, result)

      return result
    } catch (err) {
      if (err instanceof IntelValidationError || err instanceof IntelNetworkError) {
        throw err
      }

      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new IntelNetworkError(
          `Intel lookup timed out after ${this.timeout}ms`,
        )
      }

      throw new IntelNetworkError(
        `Intel lookup failed: ${err instanceof Error ? err.message : String(err)}`,
      )
    } finally {
      clearTimeout(timeoutId)
    }
  }

  /**
   * Returns the number of rate-limited requests remaining.
   */
  getRemainingRequests(): number {
    return this.limiter.remaining()
  }

  /**
   * Clears the local hash cache.
   */
  clearCache(): void {
    this.cache.clear()
  }
}

// ── Custom Errors ───────────────────────────────────────────────

/** Thrown when the hash format is invalid */
export class IntelValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IntelValidationError'
  }
}

/** Thrown when a network request fails or times out */
export class IntelNetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IntelNetworkError'
  }
}

/** Thrown when the rate limit is exceeded */
export class IntelRateLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'IntelRateLimitError'
  }
}
