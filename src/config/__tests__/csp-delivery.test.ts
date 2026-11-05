import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'

const GENERATOR_PATH = resolve(process.cwd(), 'scripts/generate-csp.mjs')
const scratchDirectories: string[] = []

afterEach(() => {
  for (const directory of scratchDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

describe('CSP delivery artifacts', () => {
  it('does not advertise nosniff through an unsupported HTML meta element', () => {
    const sourceHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')

    expect(sourceHtml).not.toContain('http-equiv="X-Content-Type-Options"')
    expect(sourceHtml).toContain('<meta name="referrer" content="strict-origin-when-cross-origin"')
  })

  it('generates a browser-valid meta policy and a stricter portable HTTP policy', () => {
    const projectDirectory = mkdtempSync(resolve(tmpdir(), 'cv-csp-delivery-'))
    scratchDirectories.push(projectDirectory)
    const distDirectory = resolve(projectDirectory, 'dist')
    mkdirSync(resolve(distDirectory, 'assets'), { recursive: true })
    writeFileSync(
      resolve(distDirectory, 'index.html'),
      '<!doctype html><html><head></head><body><script type="module" src="/assets/app.js"></script></body></html>',
    )

    const stdout = execFileSync(process.execPath, [GENERATOR_PATH], {
      cwd: projectDirectory,
      encoding: 'utf8',
    })
    const html = readFileSync(resolve(distDirectory, 'index.html'), 'utf8')
    const headers = readFileSync(resolve(distDirectory, '_headers'), 'utf8')
    const metaPolicy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]

    expect(stdout).toContain('[CSP] Validation passed ✓')
    expect(metaPolicy).toBeDefined()
    expect(metaPolicy).not.toContain('frame-ancestors')
    expect(metaPolicy).toContain("object-src 'none'")
    expect(metaPolicy).toContain("base-uri 'self'")
    expect(metaPolicy).toContain("form-action 'self'")
    expect(headers).toContain("Content-Security-Policy: default-src 'self'")
    expect(headers).toContain("frame-ancestors 'none'")
    expect(headers).toContain('X-Content-Type-Options: nosniff')
  })
})
