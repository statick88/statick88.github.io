/**
 * src/__tests__/design/cv-contact-block.test.ts
 *
 * The published PDF is the artifact a recruiter and an ATS read. If the
 * contact block is missing from the generated markdown, every CV ships
 * without a literal email or phone: nothing in the text layer, nobody can
 * reach him.
 *
 * That exact defect happened once: the commit that added the contact block
 * never reached the default branch, and all twelve PDFs were published
 * without contact data. This test pins the block on the artifacts that are
 * actually shipped, so a generator change cannot drop it silently.
 *
 * The CV is ONE document per language now (`cv-es.md`, `cv-en.md` and their
 * PDFs). There are no profile variants any more, so the test also pins that
 * no per-profile artifact comes back, and that the general CV carries the
 * organization block (services, own tools, own training, authorized security
 * engagements and references) that used to live only in the consultant
 * variant.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '../../..')

const LANGUAGES = ['es', 'en'] as const

const EMAIL = 'dsaavedra88@gmail.com'
const PHONE = '+593 980192790'

/** The profile variants that used to be published. None of them may return. */
const RETIRED_PROFILES = [
  'developer',
  'hacker',
  'research',
  'docente-facilitador',
  'consultor',
] as const

/**
 * The organization block, per language, in the order the generator emits it.
 * The generator is the single source of the wording: these strings are the
 * labels it writes, not a copy of the rendered prose.
 */
const PRACTICE_SECTIONS: Record<'es' | 'en', readonly string[]> = {
  es: [
    '## Mi Práctica',
    '### Servicios',
    '### Herramientas Propias',
    '### Formación Propia',
    '### Encargos de Seguridad Autorizados',
    '### Referencias',
  ],
  en: [
    '## My Practice',
    '### Services',
    '### Own Tools',
    '### Own Training',
    '### Authorized Security Engagements',
    '### References',
  ],
}

describe('the unified CV carries the contact block', () => {
  it('has the email and the phone in the general markdown', () => {
    for (const lang of LANGUAGES) {
      const path = resolve(ROOT, `cv-${lang}.md`)
      expect(existsSync(path), `${path} should exist`).toBe(true)
      const text = readFileSync(path, 'utf8')
      expect(text, `cv-${lang}.md must carry the email`).toContain(EMAIL)
      expect(text, `cv-${lang}.md must carry the phone`).toContain(PHONE)
    }
  })

  it('has the organization block in the general markdown', () => {
    for (const lang of LANGUAGES) {
      const text = readFileSync(resolve(ROOT, `cv-${lang}.md`), 'utf8')
      for (const section of PRACTICE_SECTIONS[lang]) {
        expect(text, `cv-${lang}.md must carry "${section}"`).toContain(section)
      }
    }
  })

  it('publishes exactly one CV per language', () => {
    const markdowns = readdirSync(ROOT)
      .filter((name) => /^cv-.*\.md$/.test(name))
      .sort()
    expect(markdowns).toEqual(['cv-en.md', 'cv-es.md'])

    const pdfs = readdirSync(resolve(ROOT, 'public'))
      .filter((name) => /^cv-.*\.pdf$/.test(name))
      .sort()
    expect(pdfs).toEqual(['cv-en.pdf', 'cv-es.pdf'])
  })

  it('has no per-profile artifact left', () => {
    const retired = RETIRED_PROFILES.flatMap((profile) => [
      ...LANGUAGES.map((lang) => `cv-${profile}-${lang}.md`),
      ...LANGUAGES.map((lang) => `public/cv-${profile}-${lang}.pdf`),
    ])

    for (const artifact of retired) {
      expect(existsSync(resolve(ROOT, artifact)), `${artifact} must not exist`).toBe(false)
    }
  })

  it('the generator writes the contact block and the organization block', () => {
    const generator = readFileSync(resolve(ROOT, 'generate-cv-markdown.js'), 'utf8')
    expect(generator).toContain('basics.email')
    expect(generator).toContain('basics.phone')
    expect(generator).toContain('Mi Práctica')
    expect(generator).toContain('practice.toolNames')
  })
})
