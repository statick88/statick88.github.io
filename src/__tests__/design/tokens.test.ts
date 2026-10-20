/**
 * src/__tests__/design/tokens.test.ts
 *
 * Unit tests for the CONSOLE design-token contract.
 *
 * These tests read the real `src/index.css` and assert the properties the
 * design depends on:
 *   - every semantic token the UI uses exists,
 *   - the light theme is a real theme (it redefines the same tokens),
 *   - text/background pairs clear WCAG AA (4.5:1 for body text, 3:1 for large
 *     text and UI boundaries) in BOTH themes.
 *
 * They are the cheapest possible guard against a palette regression: a palette
 * that "looks fine" but fails contrast is a bug, not a taste question.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CSS_PATH = resolve(__dirname, '../../index.css')
const css = readFileSync(CSS_PATH, 'utf8')

/**
 * The light palette is the default (`:root`); the night variant lives in
 * `html.dark`. Both blocks are read straight from the stylesheet.
 */
function blockOf(selector: RegExp): string {
  const start = css.search(selector)
  if (start < 0) return ''
  return css.slice(start, css.indexOf('}', start) + 1)
}

const lightBlock = blockOf(/:root\s*\{/)
const darkBlock = blockOf(/html\.dark\s*\{/)

/** Parse `--ct-<name>: r g b;` declarations out of a CSS block. */
function tokens(source: string): Record<string, [number, number, number] | undefined> {
  const found: Record<string, [number, number, number] | undefined> = {}
  const pattern = /--ct-([a-z0-9-]+):\s*(\d+)\s+(\d+)\s+(\d+)\s*;/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source)) !== null) {
    const name = match[1]
    if (!name) continue
    found[name] = [Number(match[2]), Number(match[3]), Number(match[4])]
  }
  return found
}

const dark = tokens(darkBlock)
const light = tokens(lightBlock)

/** Read a token, failing loudly when it is missing. */
function read(source: Record<string, [number, number, number] | undefined>, name: string) {
  const value = source[name]
  if (!value) throw new Error(`missing --ct-${name}`)
  return value
}

/** Relative luminance per WCAG 2.1. */
function luminance([r, g, b]: [number, number, number]): number {
  const channel = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** WCAG contrast ratio between two tokens. */
function contrast(a: [number, number, number], b: [number, number, number]): number {
  const sorted = [luminance(a), luminance(b)].sort((x, y) => y - x)
  const high = sorted[0] as number
  const low = sorted[1] as number
  return (high + 0.05) / (low + 0.05)
}

const REQUIRED_TOKENS = [
  'base',
  'panel',
  'surface-0',
  'surface-1',
  'surface-2',
  'line',
  'line-strong',
  'text',
  'subtext-0',
  'subtext-1',
  'accent',
  'accent-bright',
  'accent-dim',
  'accent-contrast',
  'ok',
  'warn',
  'danger',
  'info',
] as const

describe('design tokens', () => {
  it('defines every semantic token in the dark palette', () => {
    for (const name of REQUIRED_TOKENS) {
      expect(dark[name], `missing --ct-${name} in the dark palette`).toBeDefined()
    }
  })

  it('redefines the semantic tokens for the light theme', () => {
    for (const name of REQUIRED_TOKENS) {
      expect(light[name], `missing --ct-${name} in the light palette`).toBeDefined()
    }
  })

  it('keeps the light theme visually distinct from the dark one', () => {
    expect(read(light, 'base')).not.toEqual(read(dark, 'base'))
    expect(read(light, 'panel')).not.toEqual(read(dark, 'panel'))
    expect(read(light, 'text')).not.toEqual(read(dark, 'text'))
  })

  describe('WCAG AA contrast (dark theme)', () => {
    const pairs: Array<[string, string, number]> = [
      ['text', 'base', 4.5],
      ['text', 'panel', 4.5],
      ['subtext-1', 'panel', 4.5],
      ['subtext-0', 'panel', 4.5],
      ['accent-bright', 'base', 4.5],
      ['accent-bright', 'panel', 4.5],
      ['ok', 'panel', 3],
      ['warn', 'panel', 3],
      ['danger', 'panel', 3],
      ['info', 'panel', 3],
      ['accent-contrast', 'accent', 4.5],
      ['text', 'surface-1', 4.5],
    ]

    it.each(pairs)('%s on %s keeps at least %s:1', (fg, bg, min) => {
      const ratio = contrast(read(dark, fg), read(dark, bg))
      expect(ratio, `--ct-${fg} on --ct-${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
    })
  })

  describe('WCAG AA contrast (light theme)', () => {
    const pairs: Array<[string, string, number]> = [
      ['text', 'base', 4.5],
      ['text', 'panel', 4.5],
      ['subtext-1', 'panel', 4.5],
      ['subtext-0', 'panel', 4.5],
      ['accent-bright', 'panel', 4.5],
      ['accent-contrast', 'accent', 4.5],
    ]

    it.each(pairs)('%s on %s keeps at least %s:1', (fg, bg, min) => {
      const ratio = contrast(read(light, fg), read(light, bg))
      expect(ratio, `--ct-${fg} on --ct-${bg} = ${ratio.toFixed(2)}:1`).toBeGreaterThanOrEqual(min)
    })
  })

  it('keeps the accent inside the dark-blue family (hue between 205 and 235 degrees)', () => {
    const [r, g, b] = read(dark, 'accent')
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    let hue = 0
    if (delta !== 0) {
      if (max === r) hue = 60 * (((g - b) / delta) % 6)
      else if (max === g) hue = 60 * ((b - r) / delta + 2)
      else hue = 60 * ((r - g) / delta + 4)
    }
    if (hue < 0) hue += 360
    expect(hue).toBeGreaterThanOrEqual(205)
    expect(hue).toBeLessThanOrEqual(235)
  })
})
