/**
 * cv-data.test.ts — Build-time contract tests
 *
 * These tests verify the shape, types, and invariants of the CV data module.
 * They run at test time AND at build-time (validate() runs on import).
 *
 * Strategy:
 *   1. Import all named exports from cv-data
 *   2. Assert shape contracts (keys exist, types match)
 *   3. Assert data invariants (ISO dates, non-empty strings, enum values)
 *   4. Assert bilingual coverage (es + en present on all visible text)
 */

import { describe, it, expect } from 'vitest'
import type { WorkExperience, Education, Project, Metric, CategoryColor, Profile } from '../../types/cv.js'
import {
  basics,
  work,
  education,
  skills,
  softSkills,
  languages,
  projects,
  certifications,
  metrics,
  services,
  contact,
  categoryColors,
  profileData,
  cvData,
} from '../cv-data.js'

// ── Helpers ──────────────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function expectIsoDate(value: string, label: string) {
  expect(value, `${label} should match YYYY-MM-DD`).toMatch(ISO_DATE_RE)
}

function expectBilingual(obj: { es: string; en: string }, label: string) {
  expect(obj.es, `${label}.es should be non-empty string`).toBeTypeOf('string')
  expect(obj.es.trim().length, `${label}.es should not be empty`).toBeGreaterThan(0)
  expect(obj.en, `${label}.en should be non-empty string`).toBeTypeOf('string')
  expect(obj.en.trim().length, `${label}.en should not be empty`).toBeGreaterThan(0)
}

function expectNonEmptyString(value: unknown, label: string) {
  expect(value, `${label} should be a string`).toBeTypeOf('string')
  expect((value as string).trim().length, `${label} should not be empty`).toBeGreaterThan(0)
}

// ── Valid enum values ────────────────────────────────────────────

const VALID_SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'master']
const VALID_SKILL_CATEGORIES = [
  'frontend-fundamentals', 'frontend-frameworks', 'backend', 'mobile',
  'mobile-native', 'devops', 'databases', 'architecture', 'security',
  'ai', 'research', 'teaching', 'tools',
]
const VALID_CERT_STATUSES = ['active', 'expired', 'in-progress']
const VALID_STUDY_TYPES = ['Master', 'Bachelor', 'PhD', 'Diploma', 'Certificate']
const VALID_SERVICE_ICONS = ['code', 'shield', 'target', 'book']

// ── Tests ────────────────────────────────────────────────────────

describe('cv-data barrel export', () => {
  it('cvData contains all top-level keys', () => {
    const expectedKeys = [
      'basics', 'work', 'education', 'skills', 'softSkills',
      'languages', 'projects', 'certifications', 'metrics',
      'services', 'contact',
    ]
    for (const key of expectedKeys) {
      expect(cvData, `cvData should have key "${key}"`).toHaveProperty(key)
    }
  })

  it('cvData sections match named exports', () => {
    expect(cvData.basics).toBe(basics)
    expect(cvData.work).toBe(work)
    expect(cvData.education).toBe(education)
    expect(cvData.skills).toBe(skills)
    expect(cvData.softSkills).toBe(softSkills)
    expect(cvData.languages).toBe(languages)
    expect(cvData.projects).toBe(projects)
    expect(cvData.certifications).toBe(certifications)
    expect(cvData.metrics).toBe(metrics)
    expect(cvData.services).toBe(services)
    expect(cvData.contact).toBe(contact)
  })
})

describe('basics', () => {
  it('has required fields', () => {
    expectNonEmptyString(basics.name, 'basics.name')
    expectBilingual(basics.label, 'basics.label')
    expectNonEmptyString(basics.image, 'basics.image')
    expectNonEmptyString(basics.email, 'basics.email')
    expectNonEmptyString(basics.phone, 'basics.phone')
  })

  it('has valid location', () => {
    expectNonEmptyString(basics.location.city, 'basics.location.city')
    expectNonEmptyString(basics.location.region, 'basics.location.region')
    expectNonEmptyString(basics.location.countryCode, 'basics.location.countryCode')
    expect(basics.location.countryCode).toHaveLength(2) // ISO 3166-1 alpha-2
  })

  it('has at least one social profile', () => {
    expect(basics.profiles.length).toBeGreaterThan(0)
    for (const profile of basics.profiles) {
      expectNonEmptyString(profile.network, 'profile.network')
      expectNonEmptyString(profile.url, 'profile.url')
    }
  })
})

describe('work entries', () => {
  it('has at least one entry', () => {
    expect(work.length).toBeGreaterThan(0)
  })

  it.each<WorkExperience>(work)('$name has valid dates and bilingual fields', (entry) => {
    expectNonEmptyString(entry.name, `work[${entry.name}].name`)
    expectIsoDate(entry.startDate, `work[${entry.name}].startDate`)
    if (entry.endDate) {
      expectIsoDate(entry.endDate, `work[${entry.name}].endDate`)
    }
    expectBilingual(entry.position, `work[${entry.name}].position`)
    expectBilingual(entry.summary, `work[${entry.name}].summary`)
  })
})

describe('education entries', () => {
  it('has at least one entry', () => {
    expect(education.length).toBeGreaterThan(0)
  })

  it.each<Education>(education)('$institution has valid dates and bilingual fields', (entry) => {
    expectNonEmptyString(entry.institution, `education[${entry.institution}].institution`)
    expectIsoDate(entry.startDate, `education[${entry.institution}].startDate`)
    // An in-progress programme (UCM, started 2026-02) has no end date on
    // record, so endDate must be either a valid ISO date or empty. This mirrors
    // the `work` block above. The previous unconditional assertion encoded an
    // invented end date and was wrong, not merely strict.
    if (entry.endDate) {
      expectIsoDate(entry.endDate, `education[${entry.institution}].endDate`)
    }
    expectBilingual(entry.area, `education[${entry.institution}].area`)
  })

  it('all studyTypes are valid', () => {
    for (const entry of education) {
      expect(VALID_STUDY_TYPES, `education[${entry.institution}].studyType invalid`).toContain(entry.studyType)
    }
  })
})

describe('skills', () => {
  it('has at least 10 skills', () => {
    expect(skills.length).toBeGreaterThanOrEqual(10)
  })

  it('all skills have valid levels', () => {
    for (const skill of skills) {
      expectNonEmptyString(skill.name, `skill.name`)
      expect(VALID_SKILL_LEVELS, `skill "${skill.name}" has invalid level`).toContain(skill.level)
    }
  })

  it('all skills have valid categories', () => {
    for (const skill of skills) {
      expect(VALID_SKILL_CATEGORIES, `skill "${skill.name}" has invalid category`).toContain(skill.category)
    }
  })
})

describe('softSkills', () => {
  it('has at least 5 soft skills', () => {
    expect(softSkills.length).toBeGreaterThanOrEqual(5)
  })

  it('all softSkills are bilingual', () => {
    for (const [i, ss] of softSkills.entries()) {
      expectNonEmptyString(ss.es, `softSkills[${i}].es`)
      expectNonEmptyString(ss.en, `softSkills[${i}].en`)
    }
  })
})

describe('languages', () => {
  it('has at least one language', () => {
    expect(languages.length).toBeGreaterThan(0)
  })

  it('all languages have bilingual fluency', () => {
    for (const lang of languages) {
      expectNonEmptyString(lang.language, 'lang.language')
      expectBilingual(lang.fluency, `lang[${lang.language}].fluency`)
    }
  })
})

describe('projects', () => {
  it('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0)
  })

  it.each<Project>(projects)('$name has bilingual description', (project) => {
    expectNonEmptyString(project.name, `project.name`)
    expectBilingual(project.description, `project[${project.name}].description`)
    expect(Array.isArray(project.highlights.es), `project[${project.name}].highlights.es should be array`).toBe(true)
    expect(Array.isArray(project.highlights.en), `project[${project.name}].highlights.en should be array`).toBe(true)
  })
})

describe('certifications', () => {
  it('has at least one certification', () => {
    expect(certifications.length).toBeGreaterThan(0)
  })

  it('all certifications have valid status', () => {
    for (const cert of certifications) {
      expectNonEmptyString(cert.name, 'cert.name')
      expectNonEmptyString(cert.issuer, 'cert.issuer')
      expect(VALID_CERT_STATUSES, `cert "${cert.name}" has invalid status`).toContain(cert.status)
    }
  })
})

describe('metrics', () => {
  it('has at least one metric', () => {
    const keys = Object.keys(metrics)
    expect(keys.length).toBeGreaterThan(0)
  })

  it('all metrics have required fields', () => {
    for (const [key, metric] of Object.entries(metrics) as [string, Metric][]) {
      expectNonEmptyString(metric.value, `metrics[${key}].value`)
      expectNonEmptyString(metric.unit, `metrics[${key}].unit`)
      expectNonEmptyString(metric.label_es, `metrics[${key}].label_es`)
      expectNonEmptyString(metric.label_en, `metrics[${key}].label_en`)
      expectNonEmptyString(metric.source, `metrics[${key}].source`)
    }
  })
})

describe('services', () => {
  it('has at least one service', () => {
    expect(services.length).toBeGreaterThan(0)
  })

  it('all services have valid structure', () => {
    for (const svc of services) {
      expectNonEmptyString(svc.id, `service[${svc.id}].id`)
      expect(VALID_SERVICE_ICONS, `service "${svc.id}" has invalid icon`).toContain(svc.icon)
      expectBilingual(svc.title, `service[${svc.id}].title`)
      expectBilingual(svc.description, `service[${svc.id}].description`)
      expect(Array.isArray(svc.formats.es), `service[${svc.id}].formats.es should be array`).toBe(true)
      expect(Array.isArray(svc.formats.en), `service[${svc.id}].formats.en should be array`).toBe(true)
    }
  })
})

describe('contact', () => {
  it('has all required fields', () => {
    expectNonEmptyString(contact.email, 'contact.email')
    expectNonEmptyString(contact.phone, 'contact.phone')
    expectNonEmptyString(contact.linkedin, 'contact.linkedin')
    expectNonEmptyString(contact.github, 'contact.github')
    expectBilingual(contact.tagline, 'contact.tagline')
    expectBilingual(contact.cta, 'contact.cta')
  })
})

describe('categoryColors', () => {
  it('has at least one color mapping', () => {
    const keys = Object.keys(categoryColors)
    expect(keys.length).toBeGreaterThan(0)
  })

  it('all color entries have bg/border/text', () => {
    for (const [key, color] of Object.entries(categoryColors) as [string, CategoryColor][]) {
      expectNonEmptyString(color.bg, `categoryColors[${key}].bg`)
      expectNonEmptyString(color.border, `categoryColors[${key}].border`)
      expectNonEmptyString(color.text, `categoryColors[${key}].text`)
    }
  })
})

describe('profileData', () => {
  it('has at least one profile', () => {
    const keys = Object.keys(profileData)
    expect(keys.length).toBeGreaterThan(0)
  })

  it('all profiles have valid structure', () => {
    for (const [key, profile] of Object.entries(profileData) as [string, Profile][]) {
      expectNonEmptyString(profile.id, `profileData[${key}].id`)
      expectBilingual(profile.label, `profileData[${key}].label`)
      expectBilingual(profile.summary, `profileData[${key}].summary`)
      expectNonEmptyString(profile.color, `profileData[${key}].color`)
      expect(Array.isArray(profile.skills), `profileData[${key}].skills should be array`).toBe(true)
      expect(Array.isArray(profile.certifications), `profileData[${key}].certifications should be array`).toBe(true)
    }
  })
})
