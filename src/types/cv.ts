// src/types/cv.ts — Single Source of Truth para el contrato de datos
// Este archivo define TODOS los tipos del dominio CV.
// Regla: ningún componente importa datos sin pasar por estos tipos.

// ── Primitives ───────────────────────────────────────────────────

/** Texto bilingüe — toda cadena visible al usuario es bilingual */
export interface BilingualText {
  readonly es: string
  readonly en: string
}

/** Texto bilingüe con arrays (highlights, formats) */
export interface BilingualArray {
  readonly es: readonly string[]
  readonly en: readonly string[]
}

// ── Enums de dominio (string literals para serialización) ────────

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'master'] as const
export type SkillLevel = (typeof SKILL_LEVELS)[number]

export const SKILL_CATEGORIES = [
  'frontend-fundamentals',
  'frontend-frameworks',
  'backend',
  'mobile',
  'mobile-native',
  'devops',
  'databases',
  'architecture',
  'security',
  'ai',
  'research',
  'teaching',
  'tools',
] as const
export type SkillCategory = (typeof SKILL_CATEGORIES)[number]

export const STUDY_TYPES = ['Master', 'Bachelor', 'PhD', 'Diploma', 'Certificate'] as const
export type StudyType = (typeof STUDY_TYPES)[number]

export const CERT_STATUSES = ['active', 'expired', 'in-progress'] as const
export type CertificationStatus = (typeof CERT_STATUSES)[number]

export const SERVICE_ICONS = ['code', 'shield', 'target', 'book'] as const
export type ServiceIcon = (typeof SERVICE_ICONS)[number]

// ── Core Entities ────────────────────────────────────────────────

export interface Skill {
  readonly name: string
  readonly level: SkillLevel
  readonly category: SkillCategory
}

export interface Certification {
  readonly name: string
  readonly issuer: string
  readonly status: CertificationStatus
}

export interface WorkExperience {
  readonly name: string
  readonly position: BilingualText
  readonly url: string
  readonly startDate: string // ISO 8601: YYYY-MM-DD
  readonly endDate?: string  // Opcional = empleo actual
  readonly summary: BilingualText
}

export interface Education {
  readonly institution: string
  readonly area: BilingualText
  readonly url: string
  readonly startDate: string // ISO 8601: YYYY-MM-DD
  readonly endDate: string   // ISO 8601: YYYY-MM-DD
  readonly studyType: StudyType
  readonly score: string
}

export interface SoftSkill {
  readonly es: string
  readonly en: string
}

export interface Language {
  readonly language: string
  readonly fluency: BilingualText
}

export interface Project {
  readonly name: string
  readonly description: BilingualText
  readonly highlights: BilingualArray
  readonly github: string
  readonly url?: string
}

// ── Services & Contact ───────────────────────────────────────────

export interface Service {
  readonly id: string
  readonly icon: ServiceIcon
  readonly title: BilingualText
  readonly description: BilingualText
  readonly formats: BilingualArray
  readonly priceRange: string
  readonly color: string
}

export interface Contact {
  readonly email: string
  readonly phone: string
  readonly whatsapp: string
  readonly linkedin: string
  readonly github: string
  readonly calendar: string
  readonly tagline: BilingualText
  readonly cta: BilingualText
}

// ── Metrics ──────────────────────────────────────────────────────

export interface Metric {
  readonly value: string
  readonly unit: string
  readonly label_es: string
  readonly label_en: string
  readonly source: string
}

// ── Basics (Hero) ────────────────────────────────────────────────

export interface Location {
  readonly city: string
  readonly region: string
  readonly countryCode: string
}

export interface SocialProfile {
  readonly network: string
  readonly url: string
}

export interface Basics {
  readonly name: string
  readonly label: BilingualText
  readonly image: string
  readonly email: string
  readonly phone: string
  readonly location: Location
  readonly profiles: readonly SocialProfile[]
}

// ── Profile (selector de perfiles) ───────────────────────────────

export interface Profile {
  readonly id: string
  readonly label: BilingualText
  readonly color: string
  readonly icon: string
  readonly summary: BilingualText
  readonly skills: readonly Skill[]
  readonly certifications: readonly Certification[]
  readonly pdf: string
}

// ── Category Colors ──────────────────────────────────────────────

export interface CategoryColor {
  readonly bg: string
  readonly border: string
  readonly text: string
}

// ── CV Data (shape completo del archivo de datos) ────────────────

export interface CVData {
  readonly basics: Basics
  readonly work: readonly WorkExperience[]
  readonly education: readonly Education[]
  readonly skills: readonly Skill[]
  readonly softSkills: readonly SoftSkill[]
  readonly languages: readonly Language[]
  readonly projects: readonly Project[]
  readonly certifications: readonly Certification[]
  readonly metrics: Record<string, Metric>
  readonly services: readonly Service[]
  readonly contact: Contact
}
