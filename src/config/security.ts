/**
 * src/config/security.ts — Centralized CSP and security headers
 *
 * Single Source of Truth for all Content Security Policy directives.
 * Eliminates the "triple drift" by defining CSP once and exporting
 * formats for: <meta> tags, HTTP headers, and verification.
 *
 * Usage:
 *   import { getCspMetaContent, CSP_DIRECTIVES } from '@/config/security'
 *
 * Design:
 *   - Hashes are injected at build time by scripts/generate-csp.mjs
 *   - This module defines the POLICY, not the hashes
 *   - The build script combines policy + hashes → final CSP string
 */

// ── CSP Directive Types ──────────────────────────────────────────

export type CspDirectiveName =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'font-src'
  | 'connect-src'
  | 'frame-src'
  | 'frame-ancestors'
  | 'base-uri'
  | 'form-action'
  | 'object-src'
  | 'upgrade-insecure-requests'
  | 'report-uri'

export type CspDirectiveValue = string

// All keys optional at construction; required after buildCspString
export type CspDirectives = Partial<Record<CspDirectiveName, CspDirectiveValue>>

// ── Policy Definition ────────────────────────────────────────────
//
// This is the canonical CSP policy. Every deployment target
// (GitHub Pages meta tag, Cloudflare header, Netlify header)
// derives from this single definition.
//
// PLACEHOLDER_SCRIPT_SRC and PLACEHOLDER_STYLE_SRC are replaced
// at build time with the actual hashes.

const SCRIPT_HASH_PLACEHOLDER = "'self' /* __SCRIPT_HASHES__ */"
const STYLE_HASH_PLACEHOLDER = "'self' 'unsafe-inline' /* __STYLE_HASHES__ */ https://fonts.googleapis.com"

export const CSP_DIRECTIVES: CspDirectives = {
  // Fallback for any resource type not explicitly listed
  'default-src': "'self'",

  // Scripts: only hashed bundles + self. No 'unsafe-inline'.
  // The build script replaces the placeholder with sha256-... hashes.
  'script-src': SCRIPT_HASH_PLACEHOLDER,

  // Styles: 'unsafe-inline' required for Tailwind CSS injection + Google Fonts
  // Hashes for CSS files are added by the build script.
  'style-src': STYLE_HASH_PLACEHOLDER,

  // Images: self, data URIs (for inline SVGs/avatars), and HTTPS (external images)
  'img-src': "'self' data: https:",

  // Fonts: self, Google Fonts CDN, data URIs (for font-face)
  'font-src': "'self' https://fonts.gstatic.com data:",

  // AJAX/Fetch: only self (no analytics, no external APIs)
  'connect-src': "'self'",

  // iframes: none (no embedded content)
  'frame-src': "'none'",

  // Prevent embedding in iframes from any origin
  'frame-ancestors': "'none'",

  // Restrict <base> tag to self
  'base-uri': "'self'",

  // Restrict form submissions to self
  'form-action': "'self'",

  // Block plugins (Flash, Java, etc.)
  'object-src': "'none'",

  // Upgrade HTTP → HTTPS automatically
  'upgrade-insecure-requests': '',
}

// ── Domains (for documentation and verification) ─────────────────

/** Allowed external domains referenced in the CSP */
export const ALLOWED_DOMAINS = {
  fonts: ['fonts.googleapis.com', 'fonts.gstatic.com'],
  images: ['https:'], // Allow any HTTPS image source
} as const

/** Domains that are explicitly NOT allowed (from old wrangler.toml drift) */
export const BLOCKED_DOMAINS = [
  'cdn.jsdelivr.net',       // Was in old wrangler.toml, not needed
  'google-analytics.com',   // Was in old wrangler.toml, not used
  'region1.google-analytics.com', // Was in old wrangler.toml, not used
] as const

// ── Build-time CSP Generation ────────────────────────────────────

/**
 * Build the CSP string from directives and hashes.
 *
 * @param scriptHashes - SHA-256 hashes of JS files (e.g., ['sha256-abc123...'])
 * @param styleHashes - SHA-256 hashes of CSS files (optional)
 * @returns The complete CSP string for use in <meta> or HTTP header
 */
export function buildCspString(
  scriptHashes: string[],
  styleHashes: string[] = [],
): string {
  const directives = { ...CSP_DIRECTIVES }

  // Replace script-src placeholder with actual hashes
  const scriptSources = ["'self'", ...scriptHashes]
  directives['script-src'] = scriptSources.join(' ')

  // Replace style-src placeholder with actual hashes
  const styleSources = ["'self'", "'unsafe-inline'", ...styleHashes, 'https://fonts.googleapis.com']
  directives['style-src'] = styleSources.join(' ')

  // Build the final CSP string
  return Object.entries(directives)
    .map(([key, value]) => (value ? `${key} ${value}` : key))
    .join('; ')
}

/**
 * Generate the <meta> tag for CSP.
 * Used for GitHub Pages (no HTTP header access).
 */
export function getCspMetaTag(
  scriptHashes: string[],
  styleHashes: string[] = [],
): string {
  const csp = buildCspString(scriptHashes, styleHashes)
  return `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
}

/**
 * Get the CSP value for HTTP headers.
 * Used for Cloudflare Pages, Netlify, Vercel, etc.
 */
export function getCspHeaderValue(
  scriptHashes: string[],
  styleHashes: string[] = [],
): string {
  return buildCspString(scriptHashes, styleHashes)
}

// ── Security Headers (non-CSP) ───────────────────────────────────

/** Standard security headers applied to all responses */
export const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
}

// ── Verification Helpers ─────────────────────────────────────────

/** Globally forbidden patterns — never allowed anywhere in CSP */
export const FORBIDDEN_PATTERNS = [
  { pattern: /unsafe-eval/, message: "Contains 'unsafe-eval'" },
  { pattern: /https?:\/\/cdn\.jsdelivr\.net/, message: 'References cdn.jsdelivr.net (not needed)' },
  { pattern: /https?:\/\/.*google-analytics\.com/, message: 'References google-analytics.com (not used)' },
  { pattern: /https?:\/\/.*googletagmanager\.com/, message: 'References googletagmanager.com (not used)' },
] as const

/** Directive-specific forbidden values */
const DIRECTIVE_FORBIDDEN: Record<string, string[]> = {
  'script-src': ["'unsafe-inline'", "'unsafe-eval'"],
  'default-src': ["'unsafe-inline'", "'unsafe-eval'"],
  'object-src': ['*'],
}

/**
 * Parse a CSP string into a map of directive → values.
 */
function parseCsp(cspString: string): Map<string, string[]> {
  const map = new Map<string, string[]>()
  const parts = cspString.split(';').map((s) => s.trim())
  for (const part of parts) {
    const spaceIdx = part.indexOf(' ')
    if (spaceIdx === -1) {
      map.set(part, [])
    } else {
      const name = part.substring(0, spaceIdx)
      const values = part.substring(spaceIdx + 1).split(/\s+/)
      map.set(name, values)
    }
  }
  return map
}

/**
 * Validate a CSP string against security rules.
 * Returns an array of violations (empty = valid).
 */
export function validateCsp(cspString: string): string[] {
  const violations: string[] = []

  // Check globally forbidden patterns
  for (const { pattern, message } of FORBIDDEN_PATTERNS) {
    if (pattern.test(cspString)) {
      violations.push(message)
    }
  }

  // Check required directives exist
  const requiredDirectives = [
    'default-src',
    'script-src',
    'style-src',
    'img-src',
    'frame-ancestors',
    'base-uri',
    'form-action',
    'object-src',
  ] as const

  for (const directive of requiredDirectives) {
    if (!cspString.includes(directive)) {
      violations.push(`Missing required directive: ${directive}`)
    }
  }

  // Directive-aware validation
  const parsed = parseCsp(cspString)
  for (const [directive, forbiddenValues] of Object.entries(DIRECTIVE_FORBIDDEN)) {
    const values = parsed.get(directive) ?? []
    for (const fv of forbiddenValues) {
      if (values.includes(fv)) {
        violations.push(`${directive} contains forbidden value: ${fv}`)
      }
    }
  }

  // Check frame-ancestors is 'none'
  const frameAncestors = parsed.get('frame-ancestors')
  if (frameAncestors && !frameAncestors.includes("'none'")) {
    violations.push("frame-ancestors should be 'none'")
  }

  return violations
}
