/**
 * src/__tests__/design/cv-contact-block.test.ts
 *
 * The published PDF is the artifact a recruiter and an ATS read. If the
 * contact block is missing from the generated markdown, every profile CV
 * ships without a literal email or phone: nothing in the text layer, nobody
 * can reach him.
 *
 * That exact defect happened once: the commit that added the contact block
 * never reached the default branch, and all twelve PDFs were published
 * without contact data. This test pins the block on the artifacts that are
 * actually shipped, so a generator change cannot drop it silently.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(__dirname, '../../..')

const PROFILES = ['developer', 'hacker', 'research', 'docente-facilitador', 'consultor'] as const
const LANGUAGES = ['es', 'en'] as const

const EMAIL = 'dsaavedra88@gmail.com'
const PHONE = '980192790'

describe('the generated CVs carry the contact block', () => {
  it('every profile variant has the email and the phone in its markdown', () => {
    for (const profile of PROFILES) {
      for (const lang of LANGUAGES) {
        const path = resolve(ROOT, `cv-${profile}-${lang}.md`)
        expect(existsSync(path), `${path} should exist`).toBe(true)
        const text = readFileSync(path, 'utf8')
        expect(text, `cv-${profile}-${lang}.md must carry the email`).toContain(EMAIL)
        expect(text, `cv-${profile}-${lang}.md must carry the phone`).toContain(PHONE)
      }
    }
  })

  it('the general CV has the email and the phone too', () => {
    for (const lang of LANGUAGES) {
      const text = readFileSync(resolve(ROOT, `cv-${lang}.md`), 'utf8')
      expect(text, `cv-${lang}.md must carry the email`).toContain(EMAIL)
      expect(text, `cv-${lang}.md must carry the phone`).toContain(PHONE)
    }
  })

  it('the generator writes the contact block', () => {
    const generator = readFileSync(resolve(ROOT, 'generate-profile-cvs.js'), 'utf8')
    expect(generator).toContain('Contact block')
    expect(generator).toContain('basics.email')
    expect(generator).toContain('basics.phone')
  })
})
