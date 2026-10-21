/**
 * src/__tests__/design/cv-ats-proof.test.ts
 *
 * The published PDF is what an applicant tracking system parses. "ATS
 * friendly" is a claim; this file turns it into a contract that runs in every
 * environment, without poppler and without a browser.
 *
 * It pins the contract on the two sources the artifact is built from — the
 * generated markdown and the published PDFs:
 *
 *   - the literal contact (email + phone) is in the text
 *   - the standard ATS headers are present, in the order an ATS reads them
 *   - the date ranges use the ASCII hyphen a parser can split on
 *   - the own-tools section lists every tool once
 *   - the CV is ONE document per language: exactly two published PDFs
 *   - the published PDF is not older than the markdown it is rendered from
 *
 * The PDF side of the contract (text layer, fonts, geometry) needs poppler
 * and lives in `scripts/verify-cv-ats.mjs`, which the CI runs.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { basics } from '@/data/cv-data'

const ROOT = resolve(__dirname, '../../..')

const LANGUAGES = ['es', 'en'] as const

/**
 * The ATS sections, per language, with the wording the generator emits.
 * The summary and the practice block are two possible anchors of the same
 * slot in the reading order: whichever of them sits between the contact block
 * and the experience block is the one an ATS reads as the introduction.
 */
const SECTIONS: Record<'es' | 'en', Record<string, string>> = {
  es: {
    contact: '## Contacto',
    summary: '## Resumen Profesional',
    practice: '## Mi Práctica',
    experience: '## Experiencia Laboral',
    education: '## Educación',
    skills: '## Habilidades Técnicas',
    certifications: '## Certificaciones',
  },
  en: {
    contact: '## Contact',
    summary: '## Professional Summary',
    practice: '## My Practice',
    experience: '## Work Experience',
    education: '## Education',
    skills: '## Technical Skills',
    certifications: '## Certifications',
  },
}

/** The headers an ATS looks for, in the order it reads them. */
const REQUIRED_HEADERS = ['contact', 'experience', 'education', 'skills', 'certifications'] as const

/** The heading that opens the own-tools section, per language. */
const OWN_TOOLS_HEADING: Record<'es' | 'en', string> = {
  es: '### Herramientas Propias',
  en: '### Own Tools',
}

/** Typographic dashes: a parser cannot split a date range on them. */
const TYPOGRAPHIC_DASH = /[–—−]/

/** A date range: <date> <separator> <date | Presente>. */
const DATE_RANGE = /(\d{4}(?:-\d{2}){0,2})(\s*)([–—−-])(\s*)(\d{4}(?:-\d{2}){0,2}|Presente|Present)\b/g

function readMarkdown(lang: 'es' | 'en'): string {
  return readFileSync(resolve(ROOT, `cv-${lang}.md`), 'utf8')
}

/** Index of a heading line, or -1 when the heading is missing. */
function headingIndex(lines: string[], heading: string): number {
  return lines.findIndex((line) => line.trim() === heading)
}

/**
 * The reading order an ATS must see:
 *
 *   Contacto → Resumen/Práctica → Experiencia → Educación → Habilidades → Certificaciones
 *
 * "Resumen/Práctica" is one slot with two possible blocks: whichever of them
 * sits between the contact block and the experience block anchors the chain.
 * An inverted order breaks the chain.
 */
function readingOrder(lang: 'es' | 'en', lines: string[]): { ok: boolean; reason: string } {
  const sections = SECTIONS[lang]
  const missing = REQUIRED_HEADERS.filter((key) => headingIndex(lines, sections[key] ?? '') === -1)
  if (missing.length > 0) {
    return { ok: false, reason: `missing headers: ${missing.join(', ')}` }
  }

  const contact = headingIndex(lines, sections.contact ?? '')
  const experience = headingIndex(lines, sections.experience ?? '')
  const intro = ['summary', 'practice']
    .map((key) => headingIndex(lines, sections[key] ?? ''))
    .filter((index) => index > contact && index < experience)

  if (intro.length === 0) {
    return { ok: false, reason: 'no Resumen/Práctica block between Contacto and Experiencia' }
  }

  const chain = [
    contact,
    ...intro,
    experience,
    headingIndex(lines, sections.education ?? ''),
    headingIndex(lines, sections.skills ?? ''),
    headingIndex(lines, sections.certifications ?? ''),
  ]

  for (let index = 1; index < chain.length; index += 1) {
    const previous = chain[index - 1]
    const current = chain[index]
    if (previous === undefined || current === undefined || previous >= current) {
      return { ok: false, reason: `the section order is inverted at index ${index}` }
    }
  }

  return { ok: true, reason: '' }
}

/** The own tools listed in the markdown section, in order. */
function ownTools(lang: 'es' | 'en', lines: string[]): string[] {
  const start = lines.findIndex((line) => line.trim() === OWN_TOOLS_HEADING[lang])
  if (start === -1) return []

  const names: string[] = []
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('## ') || line.startsWith('### ')) break
    const match = /^-\s+\*\*(.+?)\*\*/.exec(line.trim())
    if (match?.[1]) names.push(match[1])
  }
  return names
}

describe('the CV is ATS-proof', () => {
  it('carries the literal contact in both languages', () => {
    for (const lang of LANGUAGES) {
      const text = readMarkdown(lang)
      expect(text, `cv-${lang}.md must carry the email`).toContain(basics.email)
      expect(text, `cv-${lang}.md must carry the phone`).toContain(basics.phone)
    }
  })

  it('carries the standard ATS headers', () => {
    for (const lang of LANGUAGES) {
      const lines = readMarkdown(lang).split('\n')
      for (const key of REQUIRED_HEADERS) {
        const heading = SECTIONS[lang][key] ?? ''
        expect(
          headingIndex(lines, heading),
          `cv-${lang}.md must carry the "${heading}" header`,
        ).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('reads in the order an ATS expects', () => {
    for (const lang of LANGUAGES) {
      const lines = readMarkdown(lang).split('\n')
      const order = readingOrder(lang, lines)
      expect(order.ok, `cv-${lang}.md reading order: ${order.reason}`).toBe(true)
    }
  })

  it('writes every date range with the ASCII hyphen', () => {
    for (const lang of LANGUAGES) {
      const text = readMarkdown(lang)
      const ranges = [...text.matchAll(DATE_RANGE)]
      for (const range of ranges) {
        const separator = range[3] ?? ''
        expect(
          TYPOGRAPHIC_DASH.test(separator),
          `cv-${lang}.md writes the date range "${range[0]}" with a typographic dash`,
        ).toBe(false)
      }
    }
  })

  it('lists every own tool once', () => {
    for (const lang of LANGUAGES) {
      const lines = readMarkdown(lang).split('\n')
      const names = ownTools(lang, lines)
      expect(names.length, `cv-${lang}.md must list the own tools`).toBeGreaterThan(0)

      const seen = new Set<string>()
      const duplicates: string[] = []
      for (const name of names) {
        const key = name.trim().toLowerCase()
        if (seen.has(key)) duplicates.push(name)
        seen.add(key)
      }
      expect(duplicates, `cv-${lang}.md repeats these own tools`).toEqual([])
    }
  })

  it('publishes exactly one CV per language', () => {
    const pdfs = readdirSync(resolve(ROOT, 'public'))
      .filter((name) => /^cv-.*\.pdf$/.test(name))
      .sort()
    expect(pdfs).toEqual(['cv-en.pdf', 'cv-es.pdf'])

    for (const lang of LANGUAGES) {
      expect(existsSync(resolve(ROOT, `public/cv-${lang}.pdf`))).toBe(true)
    }
  })

  it('publishes a PDF that is not older than the markdown it comes from', () => {
    for (const lang of LANGUAGES) {
      const markdown = statSync(resolve(ROOT, `cv-${lang}.md`)).mtimeMs
      const pdf = statSync(resolve(ROOT, `public/cv-${lang}.pdf`)).mtimeMs
      // Second granularity: a fresh checkout writes every file in the same
      // second, so the published PDF is never older than its source. A hand
      // edit to the markdown moves its timestamp forward and breaks this.
      expect(
        Math.floor(pdf / 1000),
        `public/cv-${lang}.pdf is older than cv-${lang}.md: the PDF was not regenerated`,
      ).toBeGreaterThanOrEqual(Math.floor(markdown / 1000))
    }
  })
})
