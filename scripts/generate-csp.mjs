#!/usr/bin/env node
/**
 * scripts/generate-csp.mjs — Build-time CSP hash generation
 *
 * Runs after `vite build` to:
 *   1. Read all JS/CSS files from dist/assets/
 *   2. Calculate SHA-256 hashes
 *   3. Inject the <meta> CSP tag into dist/index.html
 *   4. Print the CSP for verification
 *
 * Usage:
 *   node scripts/generate-csp.mjs
 *   (or as part of "build" script in package.json)
 *
 * Replaces the inline CSP plugin in vite.config.js.
 */

import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── Config ───────────────────────────────────────────────────────

const DIST_DIR = resolve(process.cwd(), 'dist')
const INDEX_PATH = join(DIST_DIR, 'index.html')
const ASSETS_DIR = join(DIST_DIR, 'assets')

// ── Hash Generation ──────────────────────────────────────────────

/**
 * Calculate SHA-256 hash of a buffer, prefixed with 'sha256-'.
 * Format: sha256-<base64> (CSP Level 3 spec)
 */
function sha256Hash(content) {
  return 'sha256-' + createHash('sha256').update(content).digest('base64')
}

/**
 * Read all files matching an extension from a directory.
 */
function getFilesByExt(dir, ext) {
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext))
    .map((f) => ({ name: f, content: readFileSync(join(dir, f)) }))
}

/**
 * Hash only the INLINE scripts and styles that CSP hash-sources actually govern.
 *
 * External files loaded with <script src> / <link rel=stylesheet> are already
 * covered by 'self', so hashing them is meaningless: Chrome discards most of
 * those hashes as invalid sources and logs "It will be ignored" for each.
 * Hash-sources exist solely to whitelist inline <script> and <style> blocks.
 *
 * Data blocks such as <script type="application/ld+json"> are not executed and
 * are therefore not subject to script-src, so they are excluded.
 */
function getInlineHashes(html, tag) {
  const hashes = []
  const re =
    tag === 'script'
      ? /<script(?![^>]*\bsrc=)(?![^>]*type\s*=\s*["']?(?!text\/javascript|module)[^"'\s>]*)[^>]*>([\s\S]*?)<\/script>/gi
      : /<style[^>]*>([\s\S]*?)<\/style>/gi

  let m
  while ((m = re.exec(html)) !== null) {
    const body = m[1]
    if (!body || !body.trim()) continue
    hashes.push(sha256Hash(body))
  }
  return hashes
}

// ── CSP Directives ───────────────────────────────────────────────
//
// This is the CANONICAL CSP policy.
// It must match src/config/security.ts exactly.
// If you change one, change the other.

function buildCsp(scriptHashes, styleHashes = []) {
  const directives = [
    "default-src 'self'",
    `script-src 'self' ${scriptHashes.join(' ')}`,
    `style-src 'self' 'unsafe-inline' ${styleHashes.join(' ')} https://fonts.googleapis.com`,
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ]

  return directives.join('; ')
}

// ── Main ─────────────────────────────────────────────────────────

function main() {
  console.log('[CSP] Starting CSP generation...')

  // Validate dist directory exists
  if (!existsSync(DIST_DIR)) {
    console.error('[CSP] ERROR: dist/ directory not found. Run "vite build" first.')
    process.exit(1)
  }

  // Validate index.html exists
  if (!existsSync(INDEX_PATH)) {
    console.error('[CSP] ERROR: dist/index.html not found.')
    process.exit(1)
  }

  // Read the built index once - the inline hash scan and the later meta
  // injection must both work from the same source.
  let html = readFileSync(INDEX_PATH, 'utf-8')

  // Collect hashes for INLINE scripts only - see getInlineHashes().
  const scriptHashes = getInlineHashes(html, 'script')
  console.log(`[CSP] Hashed ${scriptHashes.length} inline script(s)`)
  scriptHashes.forEach((h, i) => console.log(`  inline script ${i + 1} → ${h}`))

  const styleHashes = getInlineHashes(html, 'style')
  console.log(`[CSP] Hashed ${styleHashes.length} inline style block(s)`)

  // Build CSP string
  const csp = buildCsp(scriptHashes, styleHashes)
  console.log(`\n[CSP] Final CSP:\n${csp}\n`)

  // Validate CSP
  const violations = validateCsp(csp)
  if (violations.length > 0) {
    console.error('[CSP] VALIDATION FAILED:')
    violations.forEach((v) => console.error(`  ✗ ${v}`))
    process.exit(1)
  }
  console.log('[CSP] Validation passed ✓')

  // Inject into index.html
  if (!html.includes('<head>')) {
    console.error('[CSP] ERROR: <head> tag not found in index.html.')
    process.exit(1)
  }

  // Remove any existing CSP meta tag (idempotent)
  html = html.replace(
    /<meta http-equiv="Content-Security-Policy"[^>]*>\s*\n?/g,
    '',
  )

  // Inject fresh CSP meta tag
  const metaTag = `<meta http-equiv="Content-Security-Policy" content="${csp}" />`
  html = html.replace('<head>', `<head>\n    ${metaTag}`)

  writeFileSync(INDEX_PATH, html)
  console.log('[CSP] Injected into dist/index.html ✓')

  // Emit dist/_headers from the SAME policy object, so the two can never drift.
  // Previously dist/_headers was copied from public/_headers, a stale duplicate
  // that still allowed script-src 'unsafe-inline'. GitHub Pages ignores _headers
  // entirely (it is a Netlify/Cloudflare Pages convention), but the file is kept
  // in sync for platforms that do honour it, and for the CI gate to assert on.
  const HEADERS_PATH = join(DIST_DIR, '_headers')
  const headersBody = [
    '/*',
    `  Content-Security-Policy: ${csp}`,
    '  X-Frame-Options: DENY',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: geolocation=(), microphone=(), camera=()',
    '',
  ].join('\n')
  writeFileSync(HEADERS_PATH, headersBody)
  console.log('[CSP] Wrote dist/_headers from the same policy ✓')

  console.log('[CSP] Done.')
}

// ── Validation (mirrors security.ts) ─────────────────────────────

function parseCsp(cspString) {
  const map = new Map()
  const parts = cspString.split(';').map(s => s.trim())
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

function validateCsp(cspString) {
  const violations = []

  // Globally forbidden patterns
  const forbidden = [
    { pattern: /unsafe-eval/, message: "Contains 'unsafe-eval'" },
    { pattern: /https?:\/\/cdn\.jsdelivr\.net/, message: "References cdn.jsdelivr.net (not needed)" },
    { pattern: /https?:\/\/.*google-analytics\.com/, message: "References google-analytics.com (not used)" },
  ]

  for (const { pattern, message } of forbidden) {
    if (pattern.test(cspString)) {
      violations.push(message)
    }
  }

  // Check required directives
  const required = ['default-src', 'script-src', 'style-src', 'img-src', 'frame-ancestors', 'base-uri', 'form-action', 'object-src']
  for (const dir of required) {
    if (!cspString.includes(dir)) {
      violations.push(`Missing required directive: ${dir}`)
    }
  }

  // Directive-specific forbidden values
  const parsed = parseCsp(cspString)
  const scriptSrc = parsed.get('script-src') || []
  if (scriptSrc.includes("'unsafe-inline'")) {
    violations.push("script-src contains 'unsafe-inline'")
  }
  if (scriptSrc.includes("'unsafe-eval'")) {
    violations.push("script-src contains 'unsafe-eval'")
  }

  return violations
}

main()
