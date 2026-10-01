import { z } from 'zod';

/**
 * Core Zod Schemas for Bilingual CV Data
 * Single source of truth for validation, TypeScript types, and export generation
 * 
 * Schema matches cv-data.yaml structure exactly.
 */

// ============================================================================
// Bilingual String Schema
// ============================================================================

export const BilingualStringSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export type BilingualString = z.infer<typeof BilingualStringSchema>;

// ============================================================================
// Contact Information
// ============================================================================

export const ContactInfoSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().min(1),
  linkedin: z.string().url().optional(),
  github: z.string().url().optional(),
  portfolio: z.string().url().optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;

// ============================================================================
// Language Entry
// ============================================================================

export const LanguageEntrySchema = z.object({
  language: z.string().min(1),
  level: z.string().min(1),
  code: z.string().length(2), // ISO 639-1
});

export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;

// ============================================================================
// Executive Profile
// ============================================================================

export const ExecutiveProfileSchema = z.object({
  name: z.string().min(1),
  role: BilingualStringSchema,
  summary: BilingualStringSchema,
});

export type ExecutiveProfile = z.infer<typeof ExecutiveProfileSchema>;

// ============================================================================
// Experience Metrics
// ============================================================================

export const ExperienceMetricSchema = z.object({
  label: BilingualStringSchema,
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
});

export type ExperienceMetric = z.infer<typeof ExperienceMetricSchema>;

// ============================================================================
// Experience Entry
// ============================================================================

export const ExperienceEntrySchema = z.object({
  company: z.string().min(1),
  url: z.string().url().optional(),
  position: BilingualStringSchema,
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  metrics: z.array(ExperienceMetricSchema).optional(),
  highlights: z.object({
    es: z.array(z.string()),
    en: z.array(z.string()),
  }),
  technologies: z.array(z.string()),
  reference: z
    .object({
      name: z.string(),
      role: z.string().optional(),
      id: z.string().optional(),
    })
    .optional(),
  hasCertificate: z.boolean().default(false),
  note: BilingualStringSchema.optional(),
});

export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

// ============================================================================
// Education Entry
// ============================================================================

export const EducationEntrySchema = z.object({
  institution: z.string().min(1),
  program: BilingualStringSchema,
  degree: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().nullable(),
  isCurrent: z.boolean(),
  gpa: z.string().nullable().optional(),
  status: BilingualStringSchema.optional(),
});

export type EducationEntry = z.infer<typeof EducationEntrySchema>;

// ============================================================================
// Skill Entry
// ============================================================================

export const SkillEntrySchema = z.object({
  name: z.string().min(1),
  level: z.string().min(1),
  category: z.string().min(1),
});

export type SkillEntry = z.infer<typeof SkillEntrySchema>;

// ============================================================================
// Soft Skill Entry
// ============================================================================

export const SoftSkillEntrySchema = BilingualStringSchema;

export type SoftSkillEntry = z.infer<typeof SoftSkillEntrySchema>;

// ============================================================================
// Service Entry
// ============================================================================

export const ServiceEntrySchema = z.object({
  id: z.string().min(1),
  icon: z.enum(['code', 'shield', 'target', 'book']),
  title: BilingualStringSchema,
  description: BilingualStringSchema,
  formats: z.object({
    es: z.array(z.string()),
    en: z.array(z.string()),
  }),
  priceRange: z.string().min(1),
  color: z.string().min(1),
});

export type ServiceEntry = z.infer<typeof ServiceEntrySchema>;

// ============================================================================
// Certification Entry
// ============================================================================

export const CertificationEntrySchema = z.object({
  name: BilingualStringSchema,
  issuer: z.string().min(1),
  date: z.string().min(1),
  status: z.string().default('active'),
  credentialId: z.string().nullable().optional(),
});

export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;

// ============================================================================
// Project Entry
// ============================================================================

export const ProjectEntrySchema = z.object({
  name: z.string().min(1),
  url: z.string().url().optional(),
  description: BilingualStringSchema,
  metrics: z
    .object({
      stars: z.number().optional(),
      forks: z.number().optional(),
      issues: z.number().optional(),
    })
    .optional(),
  technologies: z.array(z.string()),
  securityRelevant: z.boolean().default(false),
  featured: z.boolean().default(false),
  sensitivity: z.enum(['public', 'restricted', 'classified']).default('public'),
});

export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

// ============================================================================
// Metrics Summary
// ============================================================================

export const MetricsSummarySchema = z.object({
  yearsExperience: z.number(),
  yearsTeaching: z.number(),
  totalHoursTeaching: z.number(),
  githubPublicRepos: z.number(),
  averageCohortScore: z.number(),
  apcYearsService: z.number(),
  languagesSpoken: z.number(),
  // `publicReposAudited` and `totalProjectsAudited` were removed on 2026-10-01:
  // no traceable source backed the 130 / 64 values they carried.
});

export type MetricsSummary = z.infer<typeof MetricsSummarySchema>;

// ============================================================================
// Root CV Data Schema
// ============================================================================

export const CVDataSchema = z.object({
  profile: ExecutiveProfileSchema,
  contact: ContactInfoSchema,
  experience: z.array(ExperienceEntrySchema).min(1),
  education: z.array(EducationEntrySchema).min(1),
  skills: z.array(SkillEntrySchema),
  // Optional: these blocks were added after the initial schema, so they
  // stay optional to remain backwards compatible with payloads that omit
  // them. When present they are validated rather than silently stripped.
  softSkills: z.array(SoftSkillEntrySchema).optional(),
  services: z.array(ServiceEntrySchema).optional(),
  languages: z.array(LanguageEntrySchema).min(1),
  certifications: z.array(CertificationEntrySchema),
  projects: z.array(ProjectEntrySchema),
  metrics: MetricsSummarySchema,
  metadata: z.object({
    schemaVersion: z.string(),
    lastVerified: z.string(),
    dataSources: z.array(z.string()),
    auditTrail: z.array(z.string()),
  }),
});

export type CVData = z.infer<typeof CVDataSchema>;

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates CV data against the schema
 * @param data - Unknown data to validate
 * @returns Typed CVData on success
 * @throws ZodError with formatted message on failure
 */
export function validateCVData(data: unknown): CVData {
  return CVDataSchema.parse(data);
}

/**
 * Validates CV data without throwing
 * @param data - Unknown data to validate
 * @returns { success, data, error }
 */
export function validateCVDataSafe(data: unknown) {
  return CVDataSchema.safeParse(data);
}

/**
 * Formats ZodError into human-readable messages
 */
export function formatValidationErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.');
    return `${path}: ${issue.message}`;
  });
}
