/**
 * src/config/__tests__/security.test.ts
 *
 * CSP policy verification tests.
 * Validates that the centralized security module produces correct CSP
 * and that no forbidden patterns are present.
 *
 * These tests catch CSP drift between build targets.
 */

import { describe, it, expect } from 'vitest'
import {
  CSP_DIRECTIVES,
  buildCspString,
  getCspMetaTag,
  validateCsp,
  SECURITY_HEADERS,
  BLOCKED_DOMAINS,
  FORBIDDEN_PATTERNS,
} from '@/config/security'

describe('Security Module — CSP Policy', () => {
  describe('CSP_DIRECTIVES', () => {
    it('has all required directives', () => {
      expect(CSP_DIRECTIVES).toHaveProperty('default-src')
      expect(CSP_DIRECTIVES).toHaveProperty('script-src')
      expect(CSP_DIRECTIVES).toHaveProperty('style-src')
      expect(CSP_DIRECTIVES).toHaveProperty('img-src')
      expect(CSP_DIRECTIVES).toHaveProperty('font-src')
      expect(CSP_DIRECTIVES).toHaveProperty('connect-src')
      expect(CSP_DIRECTIVES).toHaveProperty('frame-src')
      expect(CSP_DIRECTIVES).toHaveProperty('frame-ancestors')
      expect(CSP_DIRECTIVES).toHaveProperty('base-uri')
      expect(CSP_DIRECTIVES).toHaveProperty('form-action')
      expect(CSP_DIRECTIVES).toHaveProperty('object-src')
    })

    it('does not have unsafe-eval anywhere', () => {
      for (const [directive, value] of Object.entries(CSP_DIRECTIVES)) {
        expect(value).not.toContain('unsafe-eval')
      }
    })

    it('frame-ancestors is none', () => {
      expect(CSP_DIRECTIVES['frame-ancestors']).toBe("'none'")
    })

    it('object-src is none', () => {
      expect(CSP_DIRECTIVES['object-src']).toBe("'none'")
    })

    it('base-uri is self', () => {
      expect(CSP_DIRECTIVES['base-uri']).toBe("'self'")
    })

    it('form-action is self', () => {
      expect(CSP_DIRECTIVES['form-action']).toBe("'self'")
    })
  })

  describe('buildCspString', () => {
    it('produces a valid CSP string with script hashes', () => {
      const hashes = ['sha256-abc123def456']
      const csp = buildCspString(hashes)

      expect(csp).toContain("script-src 'self' sha256-abc123def456")
      expect(csp).toContain("default-src 'self'")
    })

    it('includes multiple script hashes', () => {
      const hashes = ['sha256-aaa', 'sha256-bbb', 'sha256-ccc']
      const csp = buildCspString(hashes)

      expect(csp).toContain('sha256-aaa')
      expect(csp).toContain('sha256-bbb')
      expect(csp).toContain('sha256-ccc')
    })

    it('includes style hashes when provided', () => {
      const scriptHashes = ['sha256-abc']
      const styleHashes = ['sha256-style1']
      const csp = buildCspString(scriptHashes, styleHashes)

      expect(csp).toContain('sha256-style1')
    })

    it('allows unsafe-inline for styles (Tailwind CSS requirement)', () => {
      const csp = buildCspString(['sha256-abc'])

      expect(csp).toContain("style-src 'self' 'unsafe-inline'")
    })

    it('allows Google Fonts', () => {
      const csp = buildCspString(['sha256-abc'])

      expect(csp).toContain('https://fonts.googleapis.com')
      expect(csp).toContain('https://fonts.gstatic.com')
    })

    it('does NOT contain unsafe-inline for scripts', () => {
      const csp = buildCspString(['sha256-abc'])
      const scriptSection = csp.split(';').find((s) => s.trim().startsWith('script-src'))

      expect(scriptSection).toBeDefined()
      expect(scriptSection).not.toContain("'unsafe-inline'")
    })

    it('does NOT reference blocked domains', () => {
      const csp = buildCspString(['sha256-abc'])

      expect(csp).not.toContain('cdn.jsdelivr.net')
      expect(csp).not.toContain('google-analytics.com')
      expect(csp).not.toContain('googletagmanager.com')
    })

    it('all directives are semicolon-separated', () => {
      const csp = buildCspString(['sha256-abc'])
      const parts = csp.split(';')

      expect(parts.length).toBeGreaterThanOrEqual(10)
    })
  })

  describe('getCspMetaTag', () => {
    it('returns a valid <meta> tag string', () => {
      const tag = getCspMetaTag(['sha256-abc'])

      expect(tag).toContain('<meta http-equiv="Content-Security-Policy"')
      expect(tag).toContain('content="')
      expect(tag).toContain('" />')
    })

    it('contains the correct CSP in the content attribute', () => {
      const tag = getCspMetaTag(['sha256-abc'])
      const contentMatch = tag.match(/content="([^"]+)"/)

      expect(contentMatch).not.toBeNull()
      expect(contentMatch?.[1]).toContain("script-src 'self' sha256-abc")
    })
  })

  describe('validateCsp', () => {
    it('returns empty array for valid CSP', () => {
      const csp = buildCspString(['sha256-abc'])
      const violations = validateCsp(csp)

      expect(violations).toEqual([])
    })

    it('catches missing required directives', () => {
      const incompleteCsp = "default-src 'self'; script-src 'self'"
      const violations = validateCsp(incompleteCsp)

      expect(violations.length).toBeGreaterThan(0)
      expect(violations.some((v) => v.includes('Missing required directive'))).toBe(true)
    })

    it('catches frame-ancestors not set to none', () => {
      const badCsp = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'self'"
      const violations = validateCsp(badCsp)

      expect(violations.some((v) => v.includes('frame-ancestors'))).toBe(true)
    })
  })

  describe('BLOCKED_DOMAINS', () => {
    it('lists domains that must NOT appear in CSP', () => {
      expect(BLOCKED_DOMAINS).toContain('cdn.jsdelivr.net')
      expect(BLOCKED_DOMAINS).toContain('google-analytics.com')
      expect(BLOCKED_DOMAINS).toContain('region1.google-analytics.com')
    })
  })

  describe('FORBIDDEN_PATTERNS', () => {
    it('has patterns for unsafe-eval and blocked domains', () => {
      expect(FORBIDDEN_PATTERNS.length).toBeGreaterThanOrEqual(3)

      for (const entry of FORBIDDEN_PATTERNS) {
        expect(entry).toHaveProperty('pattern')
        expect(entry).toHaveProperty('message')
        expect(entry.pattern).toBeInstanceOf(RegExp)
      }
    })

    it('does NOT match legitimate CSP values', () => {
      const validCsp = buildCspString(['sha256-abc'])
      for (const { pattern } of FORBIDDEN_PATTERNS) {
        expect(pattern.test(validCsp)).toBe(false)
      }
    })
  })

  describe('Cross-file Consistency', () => {
    it('buildCspString produces CSP that passes validateCsp', () => {
      const csp = buildCspString(['sha256-test123'], ['sha256-style456'])
      const violations = validateCsp(csp)

      expect(violations).toEqual([])
    })

    it('getCspMetaTag content passes validateCsp', () => {
      const tag = getCspMetaTag(['sha256-test123'])
      const contentMatch = tag.match(/content="([^"]+)"/)
      expect(contentMatch).not.toBeNull()
      expect(contentMatch).toBeDefined()
      if (!contentMatch?.[1]) return // type guard

      const violations = validateCsp(contentMatch[1])
      expect(violations).toEqual([])
    })
  })
})

describe('Security Module — Headers', () => {
  it('has all standard security headers', () => {
    expect(SECURITY_HEADERS).toHaveProperty('X-Frame-Options')
    expect(SECURITY_HEADERS).toHaveProperty('X-Content-Type-Options')
    expect(SECURITY_HEADERS).toHaveProperty('Referrer-Policy')
    expect(SECURITY_HEADERS).toHaveProperty('Permissions-Policy')
    expect(SECURITY_HEADERS).toHaveProperty('Cross-Origin-Opener-Policy')
  })

  it('X-Frame-Options is DENY', () => {
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY')
  })

  it('X-Content-Type-Options is nosniff', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff')
  })
})
