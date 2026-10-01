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

// ─── Metrics (hardcoded defaults — no source in cv-data) ───────────────────────

export function getDefaultMetrics(): MetricsSummary {
  return {
    yearsExperience: 10,
    yearsTeaching: 13,
    totalHoursTeaching: 200,
    githubPublicRepos: 400,
    publicReposAudited: 10,
    averageCohortScore: 93.4,
    apcYearsService: 9,
    languagesSpoken: 4,
    totalProjectsAudited: 6,
  }
}
