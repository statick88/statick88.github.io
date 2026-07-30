/**
 * src/lib/schemas/ats-schema.ts — ATS-Optimized JSON Schema
 *
 * Flat structure for Applicant Tracking System parsers.
 * No nested objects beyond one level. Dates as ISO strings.
 * Keywords extracted from all fields for matching.
 *
 * @see T-026
 */

import { z } from 'zod'

// ============================================================================
// ATS Sub-schemas (all flat, no nesting beyond one level)
// ============================================================================

export const ATSPersonalSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string(),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional(),
})

export const ATSExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string(), // ISO date
  endDate: z.string().nullable(), // null = current
  location: z.string().optional(),
  bullets: z.array(z.string()),
  metrics: z.array(z.string()), // extracted quantified metrics
  skills: z.array(z.string()), // technologies used
})

export const ATSEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  honors: z.array(z.string()).optional(),
  gpa: z.number().optional(),
})

export const ATSCertificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  date: z.string(), // ISO date
  expiryDate: z.string().optional(),
  status: z.enum(['active', 'expired', 'revoked']),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
})

export const ATSSkillSchema = z.object({
  name: z.string(),
  category: z.enum([
    'programming',
    'framework',
    'tool',
    'platform',
    'methodology',
    'language',
    'soft-skill',
  ]),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
})

export const ATSProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  impact: z.string().optional(),
  url: z.string().url().optional(),
  featured: z.boolean().optional(),
})

export const ATSLanguageSchema = z.object({
  language: z.string(),
  proficiency: z.enum(['basic', 'conversational', 'professional', 'native']),
})

// ============================================================================
// Root ATS Schema
// ============================================================================

export const ATSSchema = z.object({
  personal: ATSPersonalSchema,
  summary: z.string(),
  experience: z.array(ATSExperienceSchema),
  education: z.array(ATSEducationSchema),
  certifications: z.array(ATSCertificationSchema),
  skills: z.array(ATSSkillSchema),
  projects: z.array(ATSProjectSchema),
  languages: z.array(ATSLanguageSchema),
  keywords: z.array(z.string()), // extracted from all fields for matching
  generatedAt: z.string(), // ISO datetime
  schemaVersion: z.string(),
})

export type ATSPersonal = z.infer<typeof ATSPersonalSchema>
export type ATSExperience = z.infer<typeof ATSExperienceSchema>
export type ATSEducation = z.infer<typeof ATSEducationSchema>
export type ATSCertification = z.infer<typeof ATSCertificationSchema>
export type ATSSkill = z.infer<typeof ATSSkillSchema>
export type ATSProject = z.infer<typeof ATSProjectSchema>
export type ATSLanguage = z.infer<typeof ATSLanguageSchema>
export type ATSData = z.infer<typeof ATSSchema>

// ============================================================================
// Keyword Extraction
// ============================================================================

/**
 * Extracts keywords from all ATS fields for ATS matching.
 * Deduplicates, lowercases, and filters short words.
 */
export function extractKeywords(ats: ATSData): string[] {
  const words = new Set<string>()

  // Personal
  ats.personal.name.split(/\s+/).forEach(w => {
    if (w.length > 1) words.add(w.toLowerCase())
  })
  if (ats.personal.location) {
    ats.personal.location.split(/[,\s]+/).forEach(w => {
      if (w.length > 2) words.add(w.toLowerCase())
    })
  }

  // Summary
  extractWordsFromText(ats.summary).forEach(w => words.add(w))

  // Experience
  for (const exp of ats.experience) {
    words.add(exp.title.toLowerCase())
    words.add(exp.company.toLowerCase())
    exp.bullets.forEach(b => extractWordsFromText(b).forEach(w => words.add(w)))
    exp.skills.forEach(s => words.add(s.toLowerCase()))
    exp.metrics.forEach(m => extractWordsFromText(m).forEach(w => words.add(w)))
  }

  // Education
  for (const edu of ats.education) {
    words.add(edu.institution.toLowerCase())
    words.add(edu.degree.toLowerCase())
    if (edu.field) words.add(edu.field.toLowerCase())
  }

  // Certifications
  for (const cert of ats.certifications) {
    words.add(cert.name.toLowerCase())
    words.add(cert.issuer.toLowerCase())
  }

  // Skills
  for (const skill of ats.skills) {
    words.add(skill.name.toLowerCase())
  }

  // Projects
  for (const proj of ats.projects) {
    words.add(proj.name.toLowerCase())
    extractWordsFromText(proj.description).forEach(w => words.add(w))
    proj.technologies.forEach(t => words.add(t.toLowerCase()))
  }

  // Languages
  for (const lang of ats.languages) {
    words.add(lang.language.toLowerCase())
  }

  // Filter out very short words and numbers
  return [...words].filter(w => w.length > 2 && !/^\d+$/.test(w)).sort()
}

/**
 * Extracts meaningful words from free text.
 */
function extractWordsFromText(text: string): string[] {
  return text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !/^\d+$/.test(w))
    .map(w => w.toLowerCase())
}
