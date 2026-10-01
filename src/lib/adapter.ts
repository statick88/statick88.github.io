/**
 * src/lib/adapter.ts — Data adapter: old CV types → new Zod schema types
 *
 * Bridges src/data/cv-data.ts (old) to src/lib/schemas/cv-data.ts (new).
 */

import {
  basics,
  work,
  education,
  skills,
  languages,
  certifications,
  projects,
  contact,
  profileData,
  metrics,
} from '@/data/cv-data'

import type {
  ContactInfo,
  SkillEntry,
  LanguageEntry,
  ExperienceEntry,
  EducationEntry,
  CertificationEntry,
  ProjectEntry,
  ExecutiveProfile,
  MetricsSummary,
} from '@/lib/schemas/cv-data'

// ─── Language code mapping ──────────────────────────────────────────────────────

const LANGUAGE_CODES: Record<string, string> = {
  Español: 'es',
  Inglés: 'en',
  Italiano: 'it',
  Portugués: 'pt',
}

// ─── Contact ───────────────────────────────────────────────────────────────────

export function adaptContact(): ContactInfo {
  const linkedinProfile = basics.profiles.find((p) => p.network === 'LinkedIn')
  const githubProfile = basics.profiles.find((p) => p.network === 'GitHub')
  const portfolioProfile = basics.profiles.find((p) => p.network === 'Portfolio')

  return {
    email: contact.email,
    phone: contact.phone || undefined,
    location: `${basics.location.city}, ${basics.location.region}`,
    linkedin: linkedinProfile?.url || undefined,
    github: githubProfile?.url || undefined,
    portfolio: portfolioProfile?.url || undefined,
  }
}

// ─── Skills ────────────────────────────────────────────────────────────────────

export function adaptSkills(): SkillEntry[] {
  return skills.map((s) => ({
    name: s.name,
    level: s.level,
    category: s.category,
  }))
}

// ─── Languages ─────────────────────────────────────────────────────────────────

export function adaptLanguages(): LanguageEntry[] {
  return languages.map((l) => ({
    language: l.language,
    level: l.fluency.es,
    code: LANGUAGE_CODES[l.language] || 'xx',
  }))
}

// ─── Experience ────────────────────────────────────────────────────────────────

export function adaptExperience(): ExperienceEntry[] {
  return work.map((w) => ({
    company: w.name,
    url: w.url || undefined,
    position: w.position,
    startDate: w.startDate,
    endDate: w.endDate || null,
    isCurrent: !w.endDate,
    highlights: { es: [], en: [] },
    technologies: [],
    hasCertificate: false,
  }))
}

// ─── Education ─────────────────────────────────────────────────────────────────

export function adaptEducation(): EducationEntry[] {
  return education.map((e) => ({
    institution: e.institution,
    program: e.area,
    degree: e.studyType,
    startDate: e.startDate,
    endDate: e.endDate || null,
    isCurrent: false,
    gpa: e.score || null,
  }))
}

// ─── Certifications ────────────────────────────────────────────────────────────

export function adaptCertifications(): CertificationEntry[] {
  return certifications.map((c) => ({
    name: { es: c.name, en: c.name },
    issuer: c.issuer,
    date: '',
    status: c.status,
    credentialId: null,
  }))
}

// ─── Projects ──────────────────────────────────────────────────────────────────

export function adaptProjects(): ProjectEntry[] {
  return projects.map((p) => ({
    name: p.name,
    url: p.github || p.url || undefined,
    description: p.description,
    technologies: [...p.highlights.es],
    securityRelevant: false,
    featured: false,
    sensitivity: 'public' as const,
  }))
}

// ─── Profile ───────────────────────────────────────────────────────────────────

export function adaptProfile(activeProfileId: string = 'developer'): ExecutiveProfile {
  const profile = profileData[activeProfileId]
  return {
    name: basics.name,
    role: basics.label,
    summary: profile?.summary || basics.label,
  }
}

// ─── Metrics (sourced from cv-data.yaml — no hardcoded numbers) ────────────────

/**
 * Reads a numeric metric from the YAML-backed `metrics` record.
 *
 * The record is `Record<string, Metric>` with a string `value`, so this is the
 * single place where the YAML shape is converted to the numeric shape the
 * components expect. `noUncheckedIndexedAccess` makes the lookup return
 * `Metric | undefined`; a missing or non-numeric entry resolves to 0 rather
 * than to a fabricated figure.
 */
function metricValue(key: string): number {
  const parsed = Number(metrics[key]?.value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function getDefaultMetrics(): MetricsSummary {
  return {
    yearsExperience: metricValue('yearsExperience'),
    yearsTeaching: metricValue('yearsTeaching'),
    totalHoursTeaching: metricValue('totalHoursTeaching'),
    githubPublicRepos: metricValue('githubPublicRepos'),
    averageCohortScore: metricValue('averageCohortScore'),
    apcYearsService: metricValue('apcYearsService'),
    languagesSpoken: metricValue('languagesSpoken'),
  }
}
