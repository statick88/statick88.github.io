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

  // Collect JS hashes
  const jsFiles = getFilesByExt(ASSETS_DIR, '.js')
  if (jsFiles.length === 0) {
    console.error('[CSP] ERROR: No JS files found in dist/assets/.')
    process.exit(1)
  }
  const scriptHashes = jsFiles.map((f) => sha256Hash(f.content))
  console.log(`[CSP] Hashed ${scriptHashes.length} JS files:`)
  jsFiles.forEach((f, i) => console.log(`  ${f.name} → ${scriptHashes[i]}`))

  // Collect CSS hashes
  const cssFiles = getFilesByExt(ASSETS_DIR, '.css')
  const styleHashes = cssFiles.map((f) => sha256Hash(f.content))
  if (styleHashes.length > 0) {
    console.log(`[CSP] Hashed ${styleHashes.length} CSS files:`)
    cssFiles.forEach((f, i) => console.log(`  ${f.name} → ${styleHashes[i]}`))
  }

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
  let html = readFileSync(INDEX_PATH, 'utf-8')

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
