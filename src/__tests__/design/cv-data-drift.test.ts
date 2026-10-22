/**
 * src/__tests__/design/cv-data-drift.test.ts
 *
 * The CV lives in three files — the TypeScript source, the legacy JavaScript
 * source and the YAML the ATS exports read. They drifted before (the site said
 * 400 repositories while the export said 379, the PDFs shipped a language
 * level the data had already changed, and the projects the site published were
 * not the projects the PDF published), so this test pins them together.
 *
 * What the three mirrors must agree on, and what they cannot:
 *
 * - projects       the same set of names, the same `description.es`/`description.en`
 *                  and the same repository URL. The YAML form calls the
 *                  repository URL `url` and the TS/JS form calls it `github`,
 *                  so the comparison reads the YAML `url` against the TS/JS
 *                  `github`. The YAML form has no `highlights` (it calls the
 *                  same list `technologies`) and no `github` field, and the
 *                  TS/JS form has no `metrics`: the `metrics` block
 *                  (stars/forks/issues) only exists in the YAML form, it is a
 *                  point-in-time GitHub measurement with no counterpart in the
 *                  other two mirrors, so it is NOT comparable.
 * - services       the same ids, titles, descriptions, formats and prices. The
 *                  YAML form does not carry the `icon`/`color` presentation
 *                  fields, so those are not compared either.
 * - skills         the same names and levels. The YAML form carries the same
 *                  three fields the TS/JS form does.
 * - certifications the same names and issuers. The YAML form carries the name
 *                  as a bilingual object and a `date` the TS/JS form does not
 *                  have, so the comparison reads the YAML `name.es` — the
 *                  display name the other two mirrors carry — and leaves the
 *                  translation and the date out of the comparison.
 * - events         the same participations, with the same period, role, result
 *                  and repository URL, in both languages. The block is never
 *                  empty: an empty block would be a claim with no evidence.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { load as loadYaml, dump as dumpYaml } from 'js-yaml'
import { work, practice, profileData, projects, skills, certifications, services, events } from '@/data/cv-data'
import { cvData, profileData as jsProfileData } from '@/data/cvData.js'
import { ATSSchema } from '@/lib/schemas/ats-schema'
import {
  toATS,
  toCareerOps,
  toAIJobSearch,
  toMarkdown,
  type RawCVData,
} from '../../../scripts/export-structured'

const ROOT = resolve(__dirname, '../../..')

interface YamlWorkEntry {
  company: string
  startDate: string
  highlights?: { es?: string[]; en?: string[] }
}

interface YamlProjectEntry {
  name: string
  url?: string
  description: { es: string; en: string }
  metrics?: { stars?: number; forks?: number; issues?: number }
  technologies?: string[]
  securityRelevant?: boolean
  featured?: boolean
}

interface YamlSkillEntry {
  name: string
  level: string
  category: string
}

interface YamlCertificationEntry {
  name: { es: string; en: string }
  issuer: string
  date: string
  status?: string
  credentialId?: string | null
}

interface YamlServiceEntry {
  id: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  formats: { es: string[]; en: string[] }
  priceRange: string
}

interface YamlEventEntry {
  name: string
  period: string
  role: { es: string; en: string }
  result: { es: string; en: string }
  url: string
}

interface YamlDocument {
  experience?: YamlWorkEntry[]
  practice?: unknown
  projects?: YamlProjectEntry[]
  skills?: YamlSkillEntry[]
  certifications?: YamlCertificationEntry[]
  services?: YamlServiceEntry[]
  events?: YamlEventEntry[]
}

/** The YAML mirror, read once. */
function readYaml(): YamlDocument {
  const raw = readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8')
  return loadYaml(raw) as YamlDocument
}

function readYamlWork(): YamlWorkEntry[] {
  return readYaml().experience ?? []
}


function readYamlPractice(): unknown {
  return readYaml().practice ?? {}
}

/**
 * The whole YAML mirror, parsed the way the export parses it: the ATS
 * export reads this same document, so the export contract is checked
 * against the document the mirrors publish.
 */
function readYamlDocument(): RawCVData {
  const raw = readFileSync(resolve(ROOT, 'src/data/cv-data.yaml'), 'utf8')
  return loadYaml(raw) as RawCVData
}

/** A collection keyed by name, so the comparison does not depend on the order. */
function byName<T extends { name: string }>(entries: readonly T[]): Map<string, T> {
  return new Map(entries.map((entry) => [entry.name, entry]))
}

/** The sorted names of a keyed collection, to compare two sets of records. */
function names(entries: Map<string, unknown>): string[] {
  return [...entries.keys()].sort()
}

/** The names a collection repeats: a record declared twice in one mirror. */
function repeated(names: readonly string[]): string[] {
  const seen = new Set<string>()
  const duplicates: string[] = []
  for (const name of names) {
    if (seen.has(name)) duplicates.push(name)
    seen.add(name)
  }
  return duplicates
}

describe('CV data sources stay in sync', () => {
  const tsEntries = work
  const jsEntries = cvData.work
  const yamlEntries = readYamlWork()

  it('declares the same number of roles everywhere', () => {
    expect(jsEntries.length).toBe(tsEntries.length)
    expect(yamlEntries.length).toBe(tsEntries.length)
  })

  it('declares the same roles in the same order', () => {
    const ts = tsEntries.map((entry) => entry.name)
    const js = jsEntries.map((entry) => entry.name)
    const yml = yamlEntries.map((entry) => entry.company)

    expect(js).toEqual(ts)
    expect(yml).toEqual(ts)
  })

  it('declares the same start dates everywhere', () => {
    const ts = tsEntries.map((entry) => entry.startDate)
    const js = jsEntries.map((entry) => entry.startDate)
    const yml = yamlEntries.map((entry) => entry.startDate)

    expect(js).toEqual(ts)
    expect(yml).toEqual(ts)
  })

  it('carries the same achievements everywhere', () => {
    tsEntries.forEach((entry, index) => {
      const jsHighlights = jsEntries[index]?.highlights?.es ?? []
      const yamlHighlights = yamlEntries[index]?.highlights?.es ?? []

      expect(jsHighlights, `highlights of ${entry.name} in cvData.js`).toEqual(
        entry.highlights?.es ?? [],
      )
      expect(yamlHighlights, `highlights of ${entry.name} in cv-data.yaml`).toEqual(
        entry.highlights?.es ?? [],
      )
      expect(entry.highlights?.es?.length ?? 0).toBeGreaterThan(0)
    })
  })

  it('never advertises a certificate it cannot show', () => {
    const redFlag = /sin certificado|no pdf employment certificate/i

    for (const entry of tsEntries) {
      expect(entry.summary.es, `summary of ${entry.name}`).not.toMatch(redFlag)
      expect(entry.summary.en, `summary of ${entry.name}`).not.toMatch(redFlag)
    }
  })

  it('carries the same practice block everywhere', () => {
    const ts = JSON.parse(JSON.stringify(practice))
    const js = JSON.parse(JSON.stringify((cvData as unknown as { practice?: unknown }).practice))
    const yaml = JSON.parse(JSON.stringify(readYamlPractice()))
    expect(js, 'practice in cvData.js').toEqual(ts)
    expect(yaml, 'practice in cv-data.yaml').toEqual(ts)
  })

  it('carries the same events everywhere', () => {
    const ts = JSON.parse(JSON.stringify(events))
    const js = JSON.parse(JSON.stringify((cvData as unknown as { events?: unknown }).events))
    const yaml = JSON.parse(JSON.stringify(readYaml().events ?? []))

    expect(js, 'events in cvData.js').toEqual(ts)
    expect(yaml, 'events in cv-data.yaml').toEqual(ts)
    // The block is never empty: an empty block would be a claim with no evidence.
    expect(ts.length, 'the events must not be an empty block').toBeGreaterThan(0)
  })

  it('declares every event with its period, role, result and repository', () => {
    for (const event of JSON.parse(JSON.stringify(events))) {
      expect(event.name, 'the event name').toBeTruthy()
      expect(event.period, `the period of ${event.name}`).toBeTruthy()
      expect(event.role?.es, `the role of ${event.name} in Spanish`).toBeTruthy()
      expect(event.role?.en, `the role of ${event.name} in English`).toBeTruthy()
      expect(event.result?.es, `the result of ${event.name} in Spanish`).toBeTruthy()
      expect(event.result?.en, `the result of ${event.name} in English`).toBeTruthy()
      expect(event.url, `the repository of ${event.name}`).toMatch(/^https:\/\//)
    }
  })

  it('carries the same consultant profile record everywhere', () => {
    const ts = JSON.parse(JSON.stringify((profileData as Record<string, { id?: string; pdf?: string; label?: unknown }>).consultor))
    const js = JSON.parse(
      JSON.stringify(
        (jsProfileData as Record<string, { id?: string; pdf?: string; label?: unknown }>).consultor,
      ),
    )
    expect(ts.id, 'consultor id in cv-data.ts').toBe('consultor')
    expect(js.id, 'consultor id in cvData.js').toBe(ts.id)
    expect(js.pdf, 'consultor pdf in cvData.js').toBe(ts.pdf)
    expect(js.label, 'consultor label in cvData.js').toEqual(ts.label)
  })
})

describe('the projects, services, skills and certifications match in the three mirrors', () => {
  const yaml = readYaml()
  const yamlProjects = yaml.projects ?? []
  const yamlSkills = yaml.skills ?? []
  const yamlCertifications = yaml.certifications ?? []
  const yamlServices = yaml.services ?? []

  it('never declares the same record twice in a mirror', () => {
    expect(repeated(projects.map((project) => project.name)), 'the projects in cv-data.ts').toEqual([])
    expect(repeated(cvData.projects.map((project) => project.name)), 'the projects in cvData.js').toEqual([])
    expect(repeated(yamlProjects.map((project) => project.name)), 'the projects in cv-data.yaml').toEqual([])

    expect(repeated(skills.map((skill) => skill.name)), 'the skills in cv-data.ts').toEqual([])
    expect(repeated(cvData.skills.map((skill) => skill.name)), 'the skills in cvData.js').toEqual([])
    expect(repeated(yamlSkills.map((skill) => skill.name)), 'the skills in cv-data.yaml').toEqual([])

    expect(repeated(certifications.map((cert) => cert.name)), 'the certifications in cv-data.ts').toEqual([])
    expect(repeated(cvData.certifications.map((cert) => cert.name)), 'the certifications in cvData.js').toEqual([])
    expect(repeated(yamlCertifications.map((cert) => cert.name.es)), 'the certifications in cv-data.yaml').toEqual([])
  })

  it('declares the same projects everywhere', () => {
    const ts = byName(projects)
    const js = byName(cvData.projects)
    const yml = byName(yamlProjects)

    expect(names(js), 'the projects in cvData.js').toEqual(names(ts))
    expect(names(yml), 'the projects in cv-data.yaml').toEqual(names(ts))
    expect(ts.size).toBeGreaterThan(0)
  })

  it('carries the same project description everywhere', () => {
    const ts = byName(projects)
    const js = byName(cvData.projects)
    const yml = byName(yamlProjects)

    for (const [name, project] of ts) {
      expect(js.get(name)?.description, `the description of ${name} in cvData.js`).toEqual(
        project.description,
      )
      expect(yml.get(name)?.description, `the description of ${name} in cv-data.yaml`).toEqual(
        project.description,
      )
    }
  })

  it('points every project at the same repository everywhere', () => {
    const ts = byName(projects)
    const js = byName(cvData.projects)
    const yml = byName(yamlProjects)

    for (const [name, project] of ts) {
      expect(js.get(name)?.github, `the repository of ${name} in cvData.js`).toBe(project.github)
      expect(yml.get(name)?.url, `the repository of ${name} in cv-data.yaml`).toBe(project.github)
    }
  })

  it('declares the same services everywhere', () => {
    const ts = services.map((service) => service.id)
    const js = cvData.services.map((service) => service.id)
    const yml = yamlServices.map((service) => service.id)

    expect(js, 'the services in cvData.js').toEqual(ts)
    expect(yml, 'the services in cv-data.yaml').toEqual(ts)
    expect(ts.length).toBeGreaterThan(0)
  })

  it('carries the same service offer everywhere', () => {
    const ts = new Map(services.map((service) => [service.id, service]))
    const js = new Map(cvData.services.map((service) => [service.id, service]))
    const yml = new Map(yamlServices.map((service) => [service.id, service]))

    for (const [id, service] of ts) {
      const jsService = js.get(id)
      const yamlService = yml.get(id)

      expect(jsService?.title, `the title of ${id} in cvData.js`).toEqual(service.title)
      expect(jsService?.description, `the description of ${id} in cvData.js`).toEqual(
        service.description,
      )
      expect(jsService?.formats, `the formats of ${id} in cvData.js`).toEqual(service.formats)
      expect(jsService?.priceRange, `the price of ${id} in cvData.js`).toBe(service.priceRange)

      expect(yamlService?.title, `the title of ${id} in cv-data.yaml`).toEqual(service.title)
      expect(yamlService?.description, `the description of ${id} in cv-data.yaml`).toEqual(
        service.description,
      )
      expect(yamlService?.formats, `the formats of ${id} in cv-data.yaml`).toEqual(service.formats)
      expect(yamlService?.priceRange, `the price of ${id} in cv-data.yaml`).toBe(service.priceRange)
    }
  })

  it('declares the same skills and levels everywhere', () => {
    const ts = new Map(skills.map((skill) => [skill.name, skill.level]))
    const js = new Map(cvData.skills.map((skill) => [skill.name, skill.level]))
    const yml = new Map(yamlSkills.map((skill) => [skill.name, skill.level]))

    expect(names(js), 'the skills in cvData.js').toEqual(names(ts))
    expect(names(yml), 'the skills in cv-data.yaml').toEqual(names(ts))
    expect(ts.size).toBeGreaterThan(0)

    for (const [name, level] of ts) {
      expect(js.get(name), `the level of ${name} in cvData.js`).toBe(level)
      expect(yml.get(name), `the level of ${name} in cv-data.yaml`).toBe(level)
    }
  })

  it('declares the same certifications and issuers everywhere', () => {
    const ts = new Map(certifications.map((cert) => [cert.name, cert.issuer]))
    const js = new Map(cvData.certifications.map((cert) => [cert.name, cert.issuer]))
    // The YAML form carries the name as a bilingual object: `name.es` is the
    // display name the other two mirrors carry.
    const yml = new Map(yamlCertifications.map((cert) => [cert.name.es, cert.issuer]))

    expect(names(js), 'the certifications in cvData.js').toEqual(names(ts))
    expect(names(yml), 'the certifications in cv-data.yaml').toEqual(names(ts))
    expect(ts.size).toBeGreaterThan(0)

    for (const [name, issuer] of ts) {
      expect(js.get(name), `the issuer of ${name} in cvData.js`).toBe(issuer)
      expect(yml.get(name), `the issuer of ${name} in cv-data.yaml`).toBe(issuer)
    }
  })
})

/**
 * The keywords the ATS audit asks for, in the wording each language uses.
 *
 * A keyword enters the CV only when the teaching experience backs it: the
 * instructor pack (rubrics plus accreditation plan) IS formative assessment
 * and academic management, so both belong to the teaching roles.
 */
const SUPPORTED_KEYWORDS = [
  { es: 'evaluación formativa', en: 'formative assessment' },
  { es: 'gestión académica', en: 'academic management' },
] as const

/**
 * The keywords the audit asks for that the teaching experience cannot back.
 * They stay out until the CV makes them true.
 */
const UNSUPPORTED_KEYWORDS = ['scrum', 'agil'] as const

describe('the ATS keywords enter the CV only where they are true', () => {
  /** The highlights of every role, per language, of one mirror. */
  function highlights(
    entries: readonly { highlights?: { es?: readonly string[]; en?: readonly string[] } }[],
  ): { es: string; en: string } {
    return {
      es: entries.flatMap((entry) => entry.highlights?.es ?? []).join(' '),
      en: entries.flatMap((entry) => entry.highlights?.en ?? []).join(' '),
    }
  }

  it('declares the supported keywords in the three mirrors', () => {
    const mirrors = [highlights(work), highlights(cvData.work), highlights(readYamlWork())]

    for (const mirror of mirrors) {
      for (const keyword of SUPPORTED_KEYWORDS) {
        expect(mirror.es, `the Spanish highlights must declare "${keyword.es}"`).toContain(
          keyword.es,
        )
        expect(mirror.en, `the English highlights must declare "${keyword.en}"`).toContain(
          keyword.en,
        )
      }
    }
  })

  it('declares the supported keywords as teaching skills', () => {
    const mirrors = [
      skills.map((skill) => skill.name),
      cvData.skills.map((skill) => skill.name),
      (readYaml().skills ?? []).map((skill) => skill.name),
    ].map((names) => names.map((name) => name.toLowerCase()))

    for (const mirror of mirrors) {
      for (const keyword of SUPPORTED_KEYWORDS) {
        expect(mirror, `the skills must declare "${keyword.es}"`).toContain(keyword.es)
      }
    }
  })

  it('never declares a keyword the teaching experience cannot back', () => {
    const files = ['src/data/cv-data.ts', 'src/data/cvData.js', 'src/data/cv-data.yaml']

    for (const file of files) {
      const text = readFileSync(resolve(ROOT, file), 'utf8')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

      for (const keyword of UNSUPPORTED_KEYWORDS) {
        expect(
          new RegExp(`\\b${keyword}\\b`).test(text),
          `${file} must not declare "${keyword}"`,
        ).toBe(false)
      }
    }
  })
})

describe('the ATS export publishes the offer and no date markers', () => {
  const document = readYamlDocument()
  const ats = toATS(document)

  it('carries every service through the ATS schema', () => {
    const published = ATSSchema.parse(ats)

    expect(published.services?.map((service) => service.id)).toEqual(
      services.map((service) => service.id),
    )

    for (const service of services) {
      const exported = published.services?.find((entry) => entry.id === service.id)

      expect(exported?.title, `the title of ${service.id} in the ATS export`).toBe(
        service.title.en,
      )
      expect(exported?.description, `the description of ${service.id} in the ATS export`).toBe(
        service.description.en,
      )
      expect(exported?.formats, `the formats of ${service.id} in the ATS export`).toEqual(
        service.formats.en,
      )
      expect(exported?.price, `the price of ${service.id} in the ATS export`).toBe(
        service.priceRange,
      )
    }
  })

  it('carries every service in the career-ops and AI-job-search exports', () => {
    const careerOps = toCareerOps(ats) as unknown as { services: Array<{ id: string }> }
    const jobSearch = toAIJobSearch(ats) as unknown as {
      service_offer: Array<{ service_id: string }>
    }

    expect(careerOps.services.map((service) => service.id)).toEqual(
      services.map((service) => service.id),
    )
    expect(jobSearch.service_offer.map((service) => service.service_id)).toEqual(
      services.map((service) => service.id),
    )
  })

  it('publishes every service in the structured markdown', () => {
    const markdown = toMarkdown(ats)

    expect(markdown).toContain('## Servicios / Services')
    for (const service of services) {
      expect(markdown).toContain(`**${service.title.en}**`)
      expect(markdown).toContain(service.priceRange)
    }
  })

  it('never publishes a date marker', () => {
    const artifacts = [
      JSON.stringify(ats),
      JSON.stringify(toCareerOps(ats)),
      dumpYaml(toAIJobSearch(ats)),
      toMarkdown(ats),
    ]

    for (const artifact of artifacts) {
      expect(artifact).not.toMatch(/s\/f/i)
    }
  })

  it('omits the date of the credentials that have none', () => {
    const undated = document.certifications.filter(
      (cert) => !/^\d{4}/.test(cert.date ?? ''),
    )
    expect(undated.length).toBeGreaterThan(0)

    const careerOps = JSON.parse(JSON.stringify(toCareerOps(ats))) as {
      certifications: Array<{ name: string }>
    }
    const jobSearch = loadYaml(dumpYaml(toAIJobSearch(ats))) as {
      professional_development: Array<{ credential: string }>
    }
    const markdown = toMarkdown(ats)
    const section =
      markdown.split('## Certificaciones / Certifications')[1]?.split('\n## ')[0] ?? ''

    for (const cert of undated) {
      const name = cert.name.en

      expect(
        ats.certifications.find((entry) => entry.name === name)?.date,
        `the date of ${name} in the ATS export`,
      ).toBeUndefined()
      expect(
        careerOps.certifications.find((entry) => entry.name === name),
        `the issue_date of ${name} in the career-ops export`,
      ).not.toHaveProperty('issue_date')
      expect(
        jobSearch.professional_development.find((entry) => entry.credential === name),
        `the obtained of ${name} in the AI-job-search export`,
      ).not.toHaveProperty('obtained')

      const line = section.split('\n').find((entry) => entry.startsWith(`- **${name}**`))
      expect(line, `the markdown line of ${name}`).toBeDefined()
      // A dated credential reads "(2021)"; one without a date reads nothing.
      expect(line, `the markdown line of ${name}`).not.toMatch(/\(\d{4}/)
    }
  })
})
