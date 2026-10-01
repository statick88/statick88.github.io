/**
 * src/webmcp/tools.ts — Six read-only CV tools
 *
 * Pure definitions: no DOM, no registration, no module state. Every tool reads
 * the runtime SSOT (`@/data/cv-data`) so agent results match rendered output.
 *
 * PRIVACY CONTRACT (non-negotiable)
 * No tool may emit contact data. Excluded everywhere: `email`, `phone`,
 * `whatsapp`, `calendar`, social profile URLs (`linkedin`, `github`,
 * `portfolio`) and `basics.location`. From `basics` we read *only* the textual
 * identity fields (`name`, `label`). URLs that happen to live on other entities
 * (work `url`, project `github`/`url`) are dropped as well — they are contact
 * surfaces, so they stay out by the same rule.
 */

import {
  basics,
  work,
  education,
  skills,
  languages,
  certifications,
  projects,
} from '@/data/cv-data'
import {
  CERT_STATUSES,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  type BilingualArray,
  type BilingualText,
  type CertificationStatus,
  type SkillCategory,
  type SkillLevel,
} from '@/types/cv'
import type {
  WebMcpJsonSchema,
  WebMcpJsonSchemaProperty,
  WebMcpLang,
  WebMcpTool,
  WebMcpToolAnnotations,
  WebMcpToolExecuteInput,
} from './types'

// ── Limits ───────────────────────────────────────────────────────

/**
 * Hard ceiling on any array a tool can return. An agent gets a bounded payload
 * plus an explicit `truncated` flag instead of an unbounded document.
 */
const MAX_RESULTS = 50

const DEFAULT_EXPERIENCE_LIMIT = 10
const DEFAULT_PROJECT_LIMIT = 20

// ── Input normalisation ──────────────────────────────────────────

function readLang(input: WebMcpToolExecuteInput | undefined): WebMcpLang {
  const raw = input?.['lang']
  return raw === 'es' ? 'es' : 'en'
}

/** Accepts a number or a numeric string; anything else falls back. */
function readLimit(
  input: WebMcpToolExecuteInput | undefined,
  fallback: number,
): number {
  const raw = input?.['limit']
  const parsed =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw) : NaN
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback
  return Math.min(Math.floor(parsed), MAX_RESULTS)
}

function readText(input: WebMcpToolExecuteInput | undefined): string | undefined {
  const raw = input?.['query']
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/**
 * Closed enums are validated; an unrecognised value is ignored (treated as "no
 * filter") rather than emptying the result set — a draft agent sending a stale
 * enum should still get useful data back.
 */
function readEnum<T extends string>(
  input: WebMcpToolExecuteInput | undefined,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const raw = input?.[key]
  if (typeof raw !== 'string') return undefined
  const match = allowed.find((candidate) => candidate === raw)
  return match
}

// ── Bilingual helpers ────────────────────────────────────────────

function text(value: BilingualText, lang: WebMcpLang): string {
  return value[lang]
}

function list(value: BilingualArray, lang: WebMcpLang): readonly string[] {
  return value[lang]
}

// ── Capped payload ───────────────────────────────────────────────

interface Capped<T> {
  readonly results: readonly T[]
  readonly total: number
  readonly truncated: boolean
}

function cap<T>(items: readonly T[], limit: number): Capped<T> {
  return {
    results: items.slice(0, limit),
    total: items.length,
    truncated: items.length > limit,
  }
}

// ── JSON Schema helpers ──────────────────────────────────────────

const LANG_PROPERTY: WebMcpJsonSchemaProperty = {
  type: 'string',
  description: "Output language. 'en' (default) or 'es'.",
  enum: ['es', 'en'],
  default: 'en',
}

function langOnlySchema(
  extra: Readonly<Record<string, WebMcpJsonSchemaProperty>> = {},
  required: readonly string[] = [],
): WebMcpJsonSchema {
  return {
    type: 'object',
    properties: { lang: LANG_PROPERTY, ...extra },
    ...(required.length > 0 ? { required } : {}),
    additionalProperties: false,
  }
}

function limitProperty(defaultValue: number): WebMcpJsonSchemaProperty {
  return {
    type: 'number',
    description: `Maximum number of entries to return (capped at ${MAX_RESULTS}).`,
    default: defaultValue,
  }
}

const READ_ONLY: WebMcpToolAnnotations = { readOnlyHint: true }

function json(payload: unknown): string {
  return JSON.stringify(payload)
}

// ── Tools ────────────────────────────────────────────────────────

const getCvSummary: WebMcpTool = {
  name: 'get_cv_summary',
  description:
    'Returns a high-level professional summary of the CV: the candidate name, ' +
    'their professional role, and counts of skills, work entries, education, ' +
    'projects, certifications and languages. Use this first to orient yourself, ' +
    'then call a more specific tool for details. Contains no contact data.',
  inputSchema: langOnlySchema(),
  annotations: READ_ONLY,
  execute(input) {
    const lang = readLang(input)
    return json({
      name: basics.name,
      role: text(basics.label, lang),
      counts: {
        skills: skills.length,
        work: work.length,
        education: education.length,
        projects: projects.length,
        certifications: certifications.length,
        languages: languages.length,
      },
    })
  },
}

const searchSkills: WebMcpTool = {
  name: 'search_skills',
  description:
    'Searches the technical skill inventory. Returns each matching skill with its ' +
    'category and proficiency level, optionally narrowed by category or level. ' +
    'Use this to answer questions about tools, technologies or expertise. ' +
    'Contains no contact data.',
  inputSchema: langOnlySchema(
    {
      query: {
        type: 'string',
        description:
          'Case-insensitive substring matched against skill name and category. Required.',
      },
      category: {
        type: 'string',
        description: 'Restrict results to one skill category.',
        enum: SKILL_CATEGORIES,
      },
      level: {
        type: 'string',
        description: 'Restrict results to one proficiency level.',
        enum: SKILL_LEVELS,
      },
    },
    ['query'],
  ),
  annotations: READ_ONLY,
  execute(input) {
    const query = (readText(input) ?? '').toLowerCase()
    const category = readEnum<SkillCategory>(input, 'category', SKILL_CATEGORIES)
    const level = readEnum<SkillLevel>(input, 'level', SKILL_LEVELS)

    const matches = skills.filter((skill) => {
      if (category !== undefined && skill.category !== category) return false
      if (level !== undefined && skill.level !== level) return false
      return (
        skill.name.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query)
      )
    })

    return json(
      cap(
        matches.map((skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.level,
        })),
        MAX_RESULTS,
      ),
    )
  },
}

const getExperience: WebMcpTool = {
  name: 'get_experience',
  description:
    'Returns the work experience timeline: employer, role, start and end dates ' +
    '(endDate is null for a current position) and a summary of responsibilities. ' +
    'Use this to answer questions about employment history, roles held or tenure. ' +
    'Contains no contact data.',
  inputSchema: langOnlySchema({
    limit: limitProperty(DEFAULT_EXPERIENCE_LIMIT),
  }),
  annotations: READ_ONLY,
  execute(input) {
    const lang = readLang(input)
    const limit = readLimit(input, DEFAULT_EXPERIENCE_LIMIT)

    return json(
      cap(
        work.map((entry) => ({
          employer: entry.name,
          role: text(entry.position, lang),
          startDate: entry.startDate,
          endDate: entry.endDate ?? null,
          summary: text(entry.summary, lang),
        })),
        limit,
      ),
    )
  },
}

const getProjects: WebMcpTool = {
  name: 'get_projects',
  description:
    'Returns portfolio projects with a description and the technologies each one ' +
    'uses, optionally filtered by a case-insensitive query over the project ' +
    'name. Use this to answer questions about concrete work samples or the ' +
    'technology stack. Contains no contact data or repository URLs.',
  inputSchema: langOnlySchema({
    query: {
      type: 'string',
      description:
        'Optional case-insensitive substring matched against the project name.',
    },
    limit: limitProperty(DEFAULT_PROJECT_LIMIT),
  }),
  annotations: READ_ONLY,
  execute(input) {
    const lang = readLang(input)
    const limit = readLimit(input, DEFAULT_PROJECT_LIMIT)
    const query = readText(input)?.toLowerCase()

    const matches =
      query === undefined
        ? projects
        : projects.filter((project) => project.name.toLowerCase().includes(query))

    return json(
      cap(
        matches.map((project) => ({
          name: project.name,
          description: text(project.description, lang),
          technologies: list(project.highlights, lang),
        })),
        limit,
      ),
    )
  },
}

const getCertifications: WebMcpTool = {
  name: 'get_certifications',
  description:
    'Returns professional certifications with their issuing organisation and ' +
    'status (active, expired or in-progress), optionally filtered by status. ' +
    'Use this to answer questions about certifications or credentials. ' +
    'Contains no contact data.',
  inputSchema: langOnlySchema({
    status: {
      type: 'string',
      description: 'Restrict results to one certification status.',
      enum: CERT_STATUSES,
    },
  }),
  annotations: READ_ONLY,
  execute(input) {
    const status = readEnum<CertificationStatus>(input, 'status', CERT_STATUSES)

    // Certification names arrive from the SSOT already flattened to a single
    // string, so `lang` does not alter them.
    const matches =
      status === undefined
        ? certifications
        : certifications.filter((cert) => cert.status === status)

    return json(
      cap(
        matches.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer,
          status: cert.status,
        })),
        MAX_RESULTS,
      ),
    )
  },
}

const getEducation: WebMcpTool = {
  name: 'get_education',
  description:
    'Returns the education history: institution, area of study, degree type, ' +
    'start and end dates and any recorded score. Use this to answer questions ' +
    'about degrees, universities or academic background. Contains no contact data.',
  inputSchema: langOnlySchema(),
  annotations: READ_ONLY,
  execute(input) {
    const lang = readLang(input)

    return json(
      cap(
        education.map((entry) => ({
          institution: entry.institution,
          area: text(entry.area, lang),
          studyType: entry.studyType,
          startDate: entry.startDate,
          endDate: entry.endDate,
          score: entry.score,
        })),
        MAX_RESULTS,
      ),
    )
  },
}

// ── Registry ─────────────────────────────────────────────────────

export const webMcpTools: readonly WebMcpTool[] = [
  getCvSummary,
  searchSkills,
  getExperience,
  getProjects,
  getCertifications,
  getEducation,
]