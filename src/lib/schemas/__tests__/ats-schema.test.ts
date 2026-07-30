/**
 * src/lib/schemas/__tests__/ats-schema.test.ts — ATS Schema tests
 *
 * Validates ATS schema structure and keyword extraction.
 *
 * @see T-026
 */

import { describe, it, expect } from 'vitest'
import {
  ATSSchema,
  extractKeywords,
  type ATSData,
} from '../ats-schema'

describe('ATS Schema', () => {
  const sampleATS: ATSData = {
    personal: {
      name: 'Diego Saavedra',
      email: 'diego@example.com',
      phone: '+593999999999',
      location: 'Quito, Ecuador',
      github: 'https://github.com/statick88',
    },
    summary: 'Senior cybersecurity expert with 10+ years experience in penetration testing and secure architecture.',
    experience: [
      {
        company: 'Universidad Internacional del Ecuador',
        title: 'Catedrático de Ciberseguridad',
        startDate: '2019-01-01',
        endDate: null,
        bullets: [
          'Impartición de clases de seguridad ofensiva y defensiva',
          'Diseño de laboratorios prácticos con más de 20 escenarios de ataque',
        ],
        metrics: ['6 años de docencia', 'Promedio de cohortes: 93.4'],
        skills: ['Python', 'Burp Suite', 'Metasploit'],
      },
    ],
    education: [
      {
        institution: 'Universidad Internacional del Ecuador',
        degree: 'Ingeniería en Software',
        field: 'Cybersecurity',
        startDate: '2015-01-01',
        endDate: '2019-12-31',
        honors: ['Summa Cum Laude'],
      },
    ],
    certifications: [
      {
        name: 'Certified Ethical Hacker',
        issuer: 'EC-Council',
        date: '2020-06-15',
        status: 'active',
        credentialId: 'ECC12345',
      },
    ],
    skills: [
      { name: 'Penetration Testing', category: 'methodology', proficiency: 'expert' },
      { name: 'Python', category: 'programming', proficiency: 'advanced' },
      { name: 'Burp Suite', category: 'tool', proficiency: 'expert' },
    ],
    projects: [
      {
        name: 'Exploitarium',
        description: 'Colección de 64 PoCs de vulnerabilidades documentadas',
        technologies: ['Python', 'Bash', 'Docker'],
        impact: '130+ repos auditados públicamente',
        url: 'https://github.com/statick88/exploitarium',
        featured: true,
      },
    ],
    languages: [
      { language: 'Español', proficiency: 'native' },
      { language: 'Inglés', proficiency: 'professional' },
    ],
    keywords: [],
    generatedAt: '2026-06-01T00:00:00.000Z',
    schemaVersion: '1.0.0',
  }

  it('validates a complete ATS object', () => {
    const result = ATSSchema.safeParse(sampleATS)
    expect(result.success).toBe(true)
  })

  it('rejects ATS without required fields', () => {
    const incomplete = { personal: { name: 'Test' } }
    const result = ATSSchema.safeParse(incomplete)
    expect(result.success).toBe(false)
  })

  it('extracts keywords from all fields', () => {
    const keywords = extractKeywords(sampleATS)
    expect(keywords.length).toBeGreaterThan(0)
    expect(keywords).toContain('diego')
    expect(keywords).toContain('saavedra')
    expect(keywords).toContain('quito')
    expect(keywords).toContain('python')
    expect(keywords).toContain('penetration')
    expect(keywords).toContain('testing')
    expect(keywords).toContain('ec-council')
  })

  it('deduplicates keywords', () => {
    const keywords = extractKeywords(sampleATS)
    const uniqueKeywords = [...new Set(keywords)]
    expect(keywords.length).toBe(uniqueKeywords.length)
  })

  it('filters out short words', () => {
    const keywords = extractKeywords(sampleATS)
    for (const kw of keywords) {
      expect(kw.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('handles null endDate (current position)', () => {
    const result = ATSSchema.safeParse(sampleATS)
    expect(result.success).toBe(true)
    if (result.success) {
      const exp = result.data.experience[0]
      expect(exp?.endDate).toBeNull()
    }
  })

  it('handles optional fields', () => {
    const minimal: ATSData = {
      personal: {
        name: 'Test User',
        email: 'test@example.com',
        location: 'Test City',
      },
      summary: 'Test summary',
      experience: [],
      education: [],
      certifications: [],
      skills: [],
      projects: [],
      languages: [],
      keywords: [],
      generatedAt: '2026-01-01T00:00:00.000Z',
      schemaVersion: '1.0.0',
    }
    const result = ATSSchema.safeParse(minimal)
    expect(result.success).toBe(true)
  })
})
