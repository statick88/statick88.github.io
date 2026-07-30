/**
 * Sanitization Library (T-007)
 *
 * Filters CV data for public consumption based on project sensitivity levels.
 * - 'public' → full details included
 * - 'restricted' → summary only (name, description, technologies)
 * - 'classified' → excluded entirely
 */

import type {
  CVData,
  ProjectEntry,
  ExperienceEntry,
  CertificationEntry,
  SkillEntry,
  LanguageEntry,
  BilingualString,
  ExperienceMetric,
  MetricsSummary,
  ExecutiveProfile,
  ContactInfo,
} from '@/lib/schemas/cv-data';

// ── Type Aliases ────────────────────────────────────────────────────

/** Alias for ProjectEntry with sensitivity field */
export type SensitivedProjectEntry = ProjectEntry;

/** Project with only public-safe fields */
export interface PublicProject {
  readonly name: string;
  readonly url: string | undefined;
  readonly description: BilingualString;
  readonly technologies: readonly string[];
}

/** Public project entry type alias */
export type PublicProjectEntry = PublicProject;

/** Experience with only public-safe fields */
export interface PublicExperience {
  readonly company: string;
  readonly url: string | undefined;
  readonly position: BilingualString;
  readonly startDate: string;
  readonly endDate: string | null;
  readonly isCurrent: boolean;
  readonly highlights: { readonly es: readonly string[]; readonly en: readonly string[] };
  readonly technologies: readonly string[];
  readonly hasCertificate: boolean;
}

/** Certification with only public-safe fields */
export interface PublicCertification {
  readonly name: BilingualString;
  readonly issuer: string;
  readonly date: string;
  readonly status: string;
}

/** Raw exploitarium entry with exploit details (input) */
export interface RawExploitariumEntry {
  readonly name: string;
  readonly category: string;
  readonly severity: string;
  readonly count: number;
  readonly impact: string;
  readonly exploitCode?: string;
  readonly pocDetails?: string;
  readonly references?: readonly string[];
}

/** Public exploitarium entry (output: stripped of exploit details) */
export interface PublicExploitariumEntry {
  readonly name: string;
  readonly category: string;
  readonly severity: string;
  readonly count: number;
  readonly impact: string;
}

/** Public-safe metadata (stripped of dataSources and auditTrail) */
export interface PublicMetadata {
  readonly schemaVersion: string;
  readonly lastVerified: string;
}

/** Fully sanitized CV data — no restricted/classified content */
export interface PublicCVData {
  readonly profile: ExecutiveProfile;
  readonly contact: ContactInfo;
  readonly experience: readonly PublicExperience[];
  readonly education: CVData['education'];
  readonly skills: readonly SkillEntry[];
  readonly languages: readonly LanguageEntry[];
  readonly certifications: readonly PublicCertification[];
  readonly projects: readonly PublicProject[];
  readonly metrics: MetricsSummary;
  readonly metadata: PublicMetadata;
}

// ── Sensitivity Helpers ───────────────────────────────────────────

/**
 * Determines whether a project should be included in public output.
 */
export function isPublicSafe(project: ProjectEntry): boolean {
  return project.sensitivity !== 'classified';
}

/**
 * Determines whether a project requires summary-only treatment.
 */
export function isSummaryOnly(project: ProjectEntry): boolean {
  return project.sensitivity === 'restricted';
}

// ── Core Sanitization Functions ───────────────────────────────────

/**
 * Filters projects by visibility level.
 * - 'public': only public projects (no restricted or classified)
 * - 'all': all non-classified projects (public + restricted)
 *
 * Classified projects are NEVER returned — they must never appear in any public context.
 */
export function filterProjectsByVisibility(
  projects: readonly ProjectEntry[],
  visibility: 'public' | 'all' = 'public',
): ProjectEntry[] {
  if (visibility === 'all') {
    return projects.filter((p) => p.sensitivity !== 'classified');
  }
  return projects.filter((p) => p.sensitivity === 'public');
}

/**
 * Sanitizes a project entry for public display.
 * - 'public': full details
 * - 'restricted': summary only (name, description, featured)
 */
export function sanitizeProject(project: ProjectEntry): PublicProject {
  if (project.sensitivity === 'classified') {
    throw new Error(`Cannot sanitize classified project: ${project.name}`);
  }

  if (project.sensitivity === 'restricted') {
    return {
      name: project.name,
      url: undefined,
      description: project.description,
      technologies: [],
    };
  }

  // public
  return {
    name: project.name,
    url: project.url,
    description: project.description,
    technologies: [...project.technologies],
  };
}

/**
 * Sanitizes experience entries — strips metrics and references for public view.
 */
function sanitizeExperience(experience: readonly ExperienceEntry[]): PublicExperience[] {
  return experience.map((exp) => ({
    company: exp.company,
    url: exp.url,
    position: exp.position,
    startDate: exp.startDate,
    endDate: exp.endDate,
    isCurrent: exp.isCurrent,
    highlights: {
      es: [...exp.highlights.es],
      en: [...exp.highlights.en],
    },
    technologies: [...exp.technologies],
    hasCertificate: exp.hasCertificate,
  }));
}

/**
 * Sanitizes certifications — strips credential IDs for public view.
 */
function sanitizeCertifications(
  certifications: readonly CertificationEntry[],
): PublicCertification[] {
  return certifications.map((cert) => ({
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
    status: cert.status,
  }));
}

/**
 * Sanitizes exploitarium entries — keeps name, category, severity, count, impact;
 * removes exploit code, PoC details, and references.
 */
export function sanitizeExploitarium<T extends RawExploitariumEntry>(
  entries: readonly T[],
): PublicExploitariumEntry[] {
  return entries.map((entry) => ({
    name: entry.name,
    category: entry.category,
    severity: entry.severity,
    count: entry.count,
    impact: entry.impact,
  }));
}

// ── Main Sanitization Entry Point ─────────────────────────────────

/**
 * Sanitizes full CV data for public consumption.
 * Removes classified projects, summarizes restricted ones,
 * strips sensitive fields from experience and certifications.
 */
export function sanitizeForPublic(cvData: CVData): PublicCVData {
  const publicProjects = filterProjectsByVisibility(cvData.projects, 'all').map(sanitizeProject);

  // Strip phone from contact
  const { phone: _phone, ...contactWithoutPhone } = cvData.contact;

  // Strip dataSources and auditTrail from metadata
  const { dataSources: _ds, auditTrail: _at, ...safeMetadata } = cvData.metadata;

  return {
    profile: cvData.profile,
    contact: contactWithoutPhone,
    experience: sanitizeExperience(cvData.experience),
    education: cvData.education,
    skills: [...cvData.skills],
    languages: [...cvData.languages],
    certifications: sanitizeCertifications(cvData.certifications),
    projects: publicProjects,
    metrics: cvData.metrics,
    metadata: safeMetadata,
  };
}
