/**
 * src/webmcp/__tests__/webmcp-tools.test.ts
 *
 * Covers the WebMCP contract that matters:
 *   - feature detection degrades to a silent no-op
 *   - six read-only tools with valid JSON Schemas
 *   - PRIVACY: no contact data in any tool output (the decisive test)
 *   - StrictMode-safe idempotent registration and symmetric cleanup
 *   - bilingual switching and result capping
 *
 * `globals: false` in vitest.config.js — every symbol is imported explicitly.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { webMcpTools } from '../tools.js'
import { registerWebMcpTools } from '../registerTools.js'
import type { WebMcpModelContext, WebMcpTool } from '../types.js'
import { work } from '../../data/cv-data.js'

// ── Host mock ────────────────────────────────────────────────────

interface MockHost {
  context: WebMcpModelContext
  registered: Map<string, WebMcpTool>
  registerTool: ReturnType<typeof vi.fn>
  unregisterTool: ReturnType<typeof vi.fn>
  getTools: ReturnType<typeof vi.fn>
}

function installHost(): MockHost {
  const registered = new Map<string, WebMcpTool>()
  const registerTool = vi.fn((tool: WebMcpTool) => {
    registered.set(tool.name, tool)
  })
  const unregisterTool = vi.fn((name: string) => {
    registered.delete(name)
  })
  const getTools = vi.fn(() => Array.from(registered.values()))

  const context: WebMcpModelContext = { registerTool, unregisterTool, getTools }

  Object.defineProperty(document, 'modelContext', {
    value: context,
    configurable: true,
    writable: true,
  })

  return { context, registered, registerTool, unregisterTool, getTools }
}

function removeHost(): void {
  Reflect.deleteProperty(document, 'modelContext')
}

function toolByName(name: string): WebMcpTool {
  const tool = webMcpTools.find((candidate) => candidate.name === name)
  if (!tool) throw new Error(`missing tool: ${name}`)
  return tool
}

interface Capped {
  results: unknown[]
  total: number
  truncated: boolean
}

async function run(name: string, input?: Record<string, unknown>): Promise<Capped> {
  const result = await toolByName(name).execute(input)
  return JSON.parse(String(result)) as Capped
}

beforeEach(removeHost)
afterEach(() => {
  removeHost()
  vi.restoreAllMocks()
})

// ── 1. Feature detection ─────────────────────────────────────────

describe('feature detection', () => {
  it('is a silent no-op when document.modelContext is absent', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})

    let cleanup = (): void => {}
    expect(() => {
      cleanup = registerWebMcpTools()
    }).not.toThrow()
    expect(() => cleanup()).not.toThrow()

    expect(warn).not.toHaveBeenCalled()
    expect(error).not.toHaveBeenCalled()
  })

  it('is a no-op when the host has no registerTool', () => {
    Object.defineProperty(document, 'modelContext', {
      value: { getTools: vi.fn(() => []) },
      configurable: true,
      writable: true,
    })

    let cleanup = (): void => {}
    expect(() => {
      cleanup = registerWebMcpTools()
    }).not.toThrow()
    expect(() => cleanup()).not.toThrow()
  })
})

// ── 2. Registration shape ────────────────────────────────────────

describe('registration', () => {
  it('registers exactly six read-only tools with usable descriptions and schemas', () => {
    const host = installHost()
    const cleanup = registerWebMcpTools()

    expect(host.registered.size).toBe(6)
    expect(webMcpTools).toHaveLength(6)

    for (const tool of webMcpTools) {
      expect(tool.description.trim().length).toBeGreaterThan(0)
      expect(tool.inputSchema.type).toBe('object')
      expect(tool.inputSchema.properties).toBeTypeOf('object')
      expect(tool.annotations?.readOnlyHint).toBe(true)
      expect(host.registered.has(tool.name)).toBe(true)
    }

    cleanup()
  })

  it('exposes enum values from the domain constants', () => {
    const skills = toolByName('search_skills')
    expect(skills.inputSchema.properties['category']?.enum).toContain('security')
    expect(skills.inputSchema.properties['level']?.enum).toContain('master')
    expect(skills.inputSchema.required).toEqual(['query'])

    const certs = toolByName('get_certifications')
    expect(certs.inputSchema.properties['status']?.enum).toContain('active')
  })
})

// ── 3. Privacy: the decisive test ────────────────────────────────

describe('privacy: contact data never leaks', () => {
  const FORBIDDEN = [
    'dsaavedra88@gmail.com',
    '+593',
    '980192790',
    'whatsapp',
    'whatsapp:',
    'linkedin',
    'portfolio',
    'location',
  ]

  it('emits no contact value for any tool, in any language', async () => {
    const violations: string[] = []

    for (const tool of webMcpTools) {
      for (const input of [{}, { lang: 'es' }, { lang: 'en' }, { query: 'react' }]) {
        const result = await tool.execute(input)
        const serialized = JSON.stringify(result ?? null)
        const haystack = `${String(result)}\n${serialized}`.toLowerCase()

        for (const secret of FORBIDDEN) {
          if (haystack.includes(secret.toLowerCase())) {
            violations.push(`${tool.name} leaked "${secret}"`)
          }
        }
      }
    }

    // One assertion, complete failure output.
    expect(violations).toEqual([])
  })

  it('exposes only textual identity from basics', async () => {
    const payload = (await run('get_cv_summary', { lang: 'en' })) as unknown as {
      name: string
      role: string
      counts: Record<string, number>
    }

    expect(typeof payload.name).toBe('string')
    expect(typeof payload.role).toBe('string')
    expect(payload.counts).toBeTypeOf('object')
    // No contact-shaped keys leak through the summary.
    expect(Object.keys(payload)).toEqual(['name', 'role', 'counts'])
  })

  it('omits repository URLs from project output', async () => {
    const raw = await toolByName('get_projects').execute({ lang: 'en' })
    expect(String(raw)).not.toContain('github.com')
    expect(String(raw)).not.toContain('statick88.github.io')
  })
})

// ── 4. Idempotency under StrictMode ─────────────────────────────

describe('idempotency', () => {
  it('does not duplicate tools when registered twice', () => {
    const host = installHost()

    const first = registerWebMcpTools()
    const second = registerWebMcpTools()

    expect(host.registered.size).toBe(6)
    expect(new Set(host.registered.keys()).size).toBe(6)
    expect(host.registerTool).toHaveBeenCalledTimes(6)

    first()
    second()
    expect(host.registered.size).toBe(0)
  })

  it('keeps working when the host cannot list its tools', () => {
    const registered = new Map<string, WebMcpTool>()
    Object.defineProperty(document, 'modelContext', {
      value: {
        registerTool: vi.fn((tool: WebMcpTool) => {
          registered.set(tool.name, tool)
        }),
        unregisterTool: vi.fn((name: string) => {
          registered.delete(name)
        }),
      },
      configurable: true,
      writable: true,
    })

    const cleanup = registerWebMcpTools()
    expect(registered.size).toBe(6)
    expect(() => cleanup()).not.toThrow()
  })

  it('survives a host whose getTools throws', () => {
    const registered = new Map<string, WebMcpTool>()
    Object.defineProperty(document, 'modelContext', {
      value: {
        registerTool: vi.fn((tool: WebMcpTool) => {
          registered.set(tool.name, tool)
        }),
        getTools: vi.fn(() => {
          throw new Error('not supported')
        }),
      },
      configurable: true,
      writable: true,
    })

    const cleanup = registerWebMcpTools()
    expect(registered.size).toBe(6)
    expect(() => cleanup()).not.toThrow()
  })
})

// ── 5. Cleanup symmetry ──────────────────────────────────────────

describe('cleanup', () => {
  it('deregisters every tool it registered and is safe to call twice', () => {
    const host = installHost()
    const cleanup = registerWebMcpTools()

    expect(host.registered.size).toBe(6)
    cleanup()

    expect(host.unregisterTool).toHaveBeenCalledTimes(6)
    for (const tool of webMcpTools) {
      expect(host.unregisterTool).toHaveBeenCalledWith(tool.name)
    }
    expect(host.registered.size).toBe(0)

    expect(() => cleanup()).not.toThrow()
    expect(host.unregisterTool).toHaveBeenCalledTimes(6)
  })

  it('does not throw when the host has no unregisterTool', () => {
    Object.defineProperty(document, 'modelContext', {
      value: { registerTool: vi.fn(), getTools: vi.fn(() => []) },
      configurable: true,
      writable: true,
    })

    const cleanup = registerWebMcpTools()
    expect(() => cleanup()).not.toThrow()
  })
})

// ── 6. Language switching ────────────────────────────────────────

describe('lang', () => {
  it('returns different text for es and en', async () => {
    const es = String(await toolByName('get_experience').execute({ lang: 'es' }))
    const en = String(await toolByName('get_experience').execute({ lang: 'en' }))
    expect(es).not.toEqual(en)

    const esProjects = String(await toolByName('get_projects').execute({ lang: 'es' }))
    const enProjects = String(await toolByName('get_projects').execute({ lang: 'en' }))
    expect(esProjects).not.toEqual(enProjects)
  })

  it('defaults to english when lang is missing or unknown', async () => {
    const fallback = String(await toolByName('get_experience').execute({}))
    const explicit = String(
      await toolByName('get_experience').execute({ lang: 'en' }),
    )
    const bogus = String(
      await toolByName('get_experience').execute({ lang: 'klingon' }),
    )
    expect(fallback).toEqual(explicit)
    expect(bogus).toEqual(explicit)
  })
})

// ── 7. search_skills filtering ──────────────────────────────────

describe('search_skills', () => {
  it('returns matches for a real query', async () => {
    const payload = await run('search_skills', { query: 'react' })
    expect(payload.results.length).toBeGreaterThan(0)
    expect(payload.total).toBe(payload.results.length)
  })

  it('returns an empty result set for a non-matching query', async () => {
    const payload = await run('search_skills', { query: 'zzzznotaskill' })
    expect(payload.results).toEqual([])
    expect(payload.total).toBe(0)
    expect(payload.truncated).toBe(false)
  })

  it('honours the category and level filters', async () => {
    const payload = (await run('search_skills', {
      query: '',
      category: 'security',
      level: 'advanced',
    })) as unknown as { results: Array<{ category: string; level: string }> }

    for (const skill of payload.results) {
      expect(skill.category).toBe('security')
      expect(skill.level).toBe('advanced')
    }
  })
})

// ── 8. Size capping ──────────────────────────────────────────────

describe('capping', () => {
  it('caps an oversized limit and flags the truncation', async () => {
    const payload = await run('get_experience', { limit: 9999 })
    expect(payload.results.length).toBeLessThanOrEqual(50)
    expect(payload.total).toBe(work.length)
    expect(payload.truncated).toBe(payload.total > payload.results.length)
  })

  it('caps every tool that returns an array', async () => {
    const violations: string[] = []

    for (const name of [
      'search_skills',
      'get_experience',
      'get_projects',
      'get_certifications',
      'get_education',
    ]) {
      const payload = await run(name, { query: '', limit: 9999 })
      if (payload.results.length > 50) violations.push(`${name}: ${payload.results.length} results`)
      if (typeof payload.total !== 'number') violations.push(`${name}: total is not a number`)
      if (typeof payload.truncated !== 'boolean') violations.push(`${name}: truncated is not a boolean`)
    }

    expect(violations).toEqual([])
  })

  it('respects an explicit smaller limit', async () => {
    const payload = await run('get_experience', { limit: 2 })
    expect(payload.results).toHaveLength(2)
    expect(payload.total).toBe(work.length)
    expect(payload.truncated).toBe(true)
  })
})