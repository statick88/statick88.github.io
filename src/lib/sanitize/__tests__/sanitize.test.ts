/**
 * src/lib/sanitize/__tests__/sanitize.test.ts
 *
 * Unit tests for the sanitization & security library.
 * Covers: sensitivity gate, project filtering, exploitarium sanitization,
 * full CV sanitization, and type-level safety.
 */

import { describe, it, expect } from 'vitest'
import type {
  CVData,
  ProjectEntry,
  ExperienceEntry,
  EducationEntry,
  SkillEntry,
  LanguageEntry,
  CertificationEntry,
  ExecutiveProfile,
  MetricsSummary,
  ContactInfo,
} from '@/lib/schemas/cv-data'
import {
  sanitizeForPublic,
  sanitizeExploitarium,
  filterProjectsByVisibility,
} from '@/lib/sanitize'
import type {
  SensitivedProjectEntry,
  PublicProjectEntry,
  PublicExploitariumEntry,
  PublicCVData,
  RawExploitariumEntry,
} from '@/lib/sanitize'

// ── Fixtures ──────────────────────────────────────────────────────────────────

function makeProject(overrides: Partial<SensitivedProjectEntry> = {}): SensitivedProjectEntry {
  return {
    name: 'test-project',
    description: { es: 'Proyecto de prueba', en: 'Test project' },
    technologies: ['TypeScript', 'React'],
    securityRelevant: false,
    featured: false,
    sensitivity: 'public',
    ...overrides,
  }
}

function makeCvData(overrides: Partial<CVData> = {}): CVData {
  const profile: ExecutiveProfile = {
    name: 'Test User',
    role: { es: 'Dev', en: 'Dev' },
    summary: { es: 'Resumen', en: 'Summary' },
  }

  const contact: ContactInfo = {
    email: 'test@example.com',
    phone: '+593 999999999',
    location: 'Loja, Ecuador',
  }

  const experience: ExperienceEntry[] = [
    {
      company: 'ACME Corp',
      position: { es: 'Dev', en: 'Dev' },
      startDate: '2020-01-01',
      endDate: null,
      isCurrent: true,
      highlights: { es: ['H1'], en: ['H1'] },
      technologies: ['React'],
      hasCertificate: false,
    },
  ]

  const education: EducationEntry[] = [
    {
      institution: 'UTPL',
      program: { es: 'CS', en: 'CS' },
      degree: 'Master',
      startDate: '2018-01-01',
      endDate: '2021-01-01',
      isCurrent: false,
    },
  ]

  const skills: SkillEntry[] = [
    { name: 'TypeScript', level: 'advanced', category: 'frontend-frameworks' },
  ]

  const languages: LanguageEntry[] = [
    { language: 'Español', level: 'Nativo', code: 'es' },
  ]

  const certifications: CertificationEntry[] = [
    {
      name: { es: 'Cert', en: 'Cert' },
      issuer: 'UTPL',
      date: '2021',
      status: 'active',
    },
  ]

  const metrics: MetricsSummary = {
    yearsExperience: 10,
    yearsTeaching: 4,
    totalHoursTeaching: 2400,
    githubPublicRepos: 100,
    publicReposAudited: 10,
    averageCohortScore: 93.4,
    apcYearsService: 9,
    languagesSpoken: 4,
    totalProjectsAudited: 6,
  }

  const metadata = {
    schemaVersion: '1.0.0',
    lastVerified: '2026-06-01',
    dataSources: ['file1', 'file2'],
    auditTrail: ['audit1', 'audit2'],
  }

  return {
    profile,
    contact,
    experience,
    education,
    skills,
    languages,
    certifications,
    projects: [],
    metrics,
    metadata,
    ...overrides,
  }
}

// ── filterProjectsByVisibility ────────────────────────────────────────────────

describe('filterProjectsByVisibility', () => {
  it('returns all projects when visibility is "all" and none are classified', () => {
    const projects = [
      makeProject({ name: 'pub', sensitivity: 'public' }),
      makeProject({ name: 'rest', sensitivity: 'restricted' }),
    ]

    const result = filterProjectsByVisibility(projects, 'all')
    expect(result).toHaveLength(2)
    expect(result.map((p) => p.name)).toEqual(['pub', 'rest'])
  })

  it('excludes classified projects in "all" mode', () => {
    const projects = [
      makeProject({ name: 'pub', sensitivity: 'public' }),
      makeProject({ name: 'cls', sensitivity: 'classified' }),
    ]

    const result = filterProjectsByVisibility(projects, 'all')
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('pub')
  })

  it('returns only public projects when visibility is "public"', () => {
    const projects = [
      makeProject({ name: 'pub', sensitivity: 'public' }),
      makeProject({ name: 'rest', sensitivity: 'restricted' }),
      makeProject({ name: 'cls', sensitivity: 'classified' }),
    ]

    const result = filterProjectsByVisibility(projects, 'public')
    expect(result).toHaveLength(1)
    expect(result[0]!.name).toBe('pub')
  })

  it('treats undefined sensitivity as public', () => {
    const projects = [
      makeProject({ name: 'no-sens' }),
      makeProject({ name: 'pub', sensitivity: 'public' }),
    ]

    const result = filterProjectsByVisibility(projects, 'public')
    expect(result).toHaveLength(2)
  })

  it('returns empty array when all projects are classified', () => {
    const projects = [
      makeProject({ name: 'cls1', sensitivity: 'classified' }),
      makeProject({ name: 'cls2', sensitivity: 'classified' }),
    ]

    expect(filterProjectsByVisibility(projects, 'all')).toHaveLength(0)
    expect(filterProjectsByVisibility(projects, 'public')).toHaveLength(0)
  })
})

// ── sanitizeExploitarium ──────────────────────────────────────────────────────

describe('sanitizeExploitarium', () => {
  it('strips exploitCode, pocDetails, and references', () => {
    const entries: RawExploitariumEntry[] = [
      {
        name: 'CVE-2024-1234',
        category: 'RCE',
        severity: 'CRITICAL',
        count: 1,
        impact: 'Remote code execution on target',
        exploitCode: 'import socket; sock.connect(...)',
        pocDetails: 'Step 1: open connection to port 4444...',
        references: ['https://nvd.nist.gov/...'],
      },
    ]

    const result = sanitizeExploitarium(entries)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      name: 'CVE-2024-1234',
      category: 'RCE',
      severity: 'CRITICAL',
      count: 1,
      impact: 'Remote code execution on target',
    })
  })

  it('handles entries without exploit details', () => {
    const entries: RawExploitariumEntry[] = [
      {
        name: 'CVE-2024-5678',
        category: 'XSS',
        severity: 'MEDIUM',
        count: 3,
        impact: 'Cross-site scripting',
      },
    ]

    const result = sanitizeExploitarium(entries)
    expect(result[0]).toEqual({
      name: 'CVE-2024-5678',
      category: 'XSS',
      severity: 'MEDIUM',
      count: 3,
      impact: 'Cross-site scripting',
    })
  })

  it('returns empty array for empty input', () => {
    expect(sanitizeExploitarium([])).toEqual([])
  })

  it('preserves count and impact fields', () => {
    const entries: RawExploitariumEntry[] = [
      {
        name: 'Test',
        category: 'SQLi',
        severity: 'HIGH',
        count: 42,
        impact: 'Data exfiltration',
        exploitCode: 'should be removed',
        pocDetails: 'should be removed',
      },
    ]

    const result = sanitizeExploitarium(entries)
    expect(result[0]!.count).toBe(42)
    expect(result[0]!.impact).toBe('Data exfiltration')
  })
})

// ── sanitizeForPublic ─────────────────────────────────────────────────────────

describe('sanitizeForPublic', () => {
  it('returns a PublicCVData with stripped metadata', () => {
    const cv = makeCvData()
    const result = sanitizeForPublic(cv)

    expect(result.metadata).toEqual({
      schemaVersion: '1.0.0',
      lastVerified: '2026-06-01',
    })
    expect(result.metadata).not.toHaveProperty('auditTrail')
    expect(result.metadata).not.toHaveProperty('dataSources')
  })

  it('strips phone from contact', () => {
    const cv = makeCvData()
    const result = sanitizeForPublic(cv)

    expect(result.contact.phone).toBeUndefined()
    expect(result.contact.email).toBe('test@example.com')
  })

  it('preserves profile, experience, education, skills, languages, certifications', () => {
    const cv = makeCvData()
    const result = sanitizeForPublic(cv)

    expect(result.profile).toEqual(cv.profile)
    expect(result.experience).toEqual(cv.experience)
    expect(result.education).toEqual(cv.education)
    expect(result.skills).toEqual(cv.skills)
    expect(result.languages).toEqual(cv.languages)
    expect(result.certifications).toEqual(cv.certifications)
  })

  it('excludes classified projects', () => {
    const cv = makeCvData({
      projects: [
        makeProject({ name: 'pub', sensitivity: 'public' }),
        makeProject({ name: 'cls', sensitivity: 'classified' }),
      ],
    })

    const result = sanitizeForPublic(cv)
    expect(result.projects).toHaveLength(1)
    expect(result.projects[0]!.name).toBe('pub')
  })

  it('sanitizes restricted projects to summary only', () => {
    const cv = makeCvData({
      projects: [
        makeProject({
          name: 'rest',
          sensitivity: 'restricted',
          metrics: { stars: 100, forks: 50 },
          securityRelevant: true,
          featured: true,
        }),
      ],
    })

    const result = sanitizeForPublic(cv)
    expect(result.projects).toHaveLength(1)

    const p = result.projects[0] as PublicProjectEntry
    expect(p.name).toBe('rest')
    expect(p.technologies).toEqual([])
    expect(p).not.toHaveProperty('metrics')
    expect(p).not.toHaveProperty('securityRelevant')
    expect(p).not.toHaveProperty('featured')
  })

  it('keeps full public projects', () => {
    const cv = makeCvData({
      projects: [
        makeProject({
          name: 'pub',
          sensitivity: 'public',
          url: 'https://example.com',
          metrics: { stars: 10 },
        }),
      ],
    })

    const result = sanitizeForPublic(cv)
    const p = result.projects[0]!
    expect(p.name).toBe('pub')
    expect(p.url).toBe('https://example.com')
    expect(p.technologies).toEqual(['TypeScript', 'React'])
  })

  it('returns empty projects when all are classified', () => {
    const cv = makeCvData({
      projects: [
        makeProject({ name: 'c1', sensitivity: 'classified' }),
        makeProject({ name: 'c2', sensitivity: 'classified' }),
      ],
    })

    expect(sanitizeForPublic(cv).projects).toEqual([])
  })

  it('handles projects without sensitivity field (defaults to public)', () => {
    const cv = makeCvData({
      projects: [makeProject({ name: 'no-sens' })],
    })

    const result = sanitizeForPublic(cv)
    expect(result.projects).toHaveLength(1)
    expect(result.projects[0]!.name).toBe('no-sens')
  })

  it('preserves metrics unchanged', () => {
    const cv = makeCvData()
    const result = sanitizeForPublic(cv)
    expect(result.metrics).toEqual(cv.metrics)
  })
})
