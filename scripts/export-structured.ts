/**
 * scripts/export-structured.ts — Structured Data Export
 *
 * Reads validated cv-data.yaml, applies sanitization, and outputs to
 * dist/exports/: cv-data.json, cv-data.yaml, cv-structured.md,
 * cv-career-ops.json, cv-ai-job-search.yaml
 *
 * @see T-025
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as yaml from 'js-yaml'
import { ATSSchema, type ATSData, extractKeywords } from '../src/lib/schemas/ats-schema'

const ROOT = resolve(import.meta.dirname, '..')
const YAML_PATH = resolve(ROOT, 'src/data/cv-data.yaml')
const DIST_DIR = resolve(ROOT, 'dist/exports')

// ============================================================================
// Types (matching YAML structure)
// ============================================================================

interface BilingualText {
  es: string
  en: string
}

interface MetricEntry {
  label: BilingualText
  value: string
  unit?: string
}

interface ExperienceEntry {
  company: string
  url?: string
  position: BilingualText
  startDate: string
  endDate: string | null
  isCurrent?: boolean
  metrics?: MetricEntry[]
  highlights: { es: string[]; en: string[] }
  technologies: string[]
  reference?: { name: string }
  hasCertificate?: boolean
}

interface EducationEntry {
  institution: string
  program: BilingualText
  degree: string
  field?: BilingualText
  startDate: string
  endDate: string | null
  thesis?: BilingualText
  honors?: string[]
  gpa?: string
  status?: string
}

interface CertificationEntry {
  name: BilingualText
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string | null
  url?: string
  status?: string
}

interface SkillEntry {
  name: string
  level?: string
  category: string
  tools?: string[]
}

interface ProjectEntry {
  name: string
  url?: string
  description: BilingualText
  technologies: string[]
  sensitivity?: 'public' | 'restricted' | 'classified'
  impact?: string
  featured?: boolean
  metrics?: { stars?: number; forks?: number; issues?: number } | { label: BilingualText; value: string }[]
  securityRelevant?: boolean
}

interface LanguageEntry {
  language: string
  level: string
  code: string
}

interface RawCVData {
  profile: {
    name: string
    role: BilingualText
    summary: BilingualText
  }
  contact: {
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
  experience: ExperienceEntry[]
  education: EducationEntry[]
  certifications: CertificationEntry[]
  skills: SkillEntry[]
  projects: ProjectEntry[]
  languages: LanguageEntry[]
  metrics: {
    yearsExperience: number
    yearsTeaching: number
    totalHoursTeaching: number
    githubPublicRepos: number
    publicReposAudited: number
    averageCohortScore: number
    apcYearsService: number
    languagesSpoken: number
    totalProjectsAudited: number
  }
}

// ============================================================================
// Transform to ATS Format
// ============================================================================

// ============================================================================
// Mapping Helpers
// ============================================================================

const SKILL_CATEGORY_MAP: Record<string, ATSData['skills'][number]['category']> = {
  'frontend-fundamentals': 'framework',
  'frontend-frameworks': 'framework',
  'backend-frameworks': 'framework',
  'mobile-frameworks': 'framework',
  'backend': 'programming',
  'devops': 'tool',
  'architecture': 'methodology',
  'security': 'tool',
  'databases': 'tool',
}

const SKILL_LEVEL_MAP: Record<string, ATSData['skills'][number]['proficiency']> = {
  'master': 'expert',
  'advanced': 'advanced',
  'intermediate': 'intermediate',
  'beginner': 'beginner',
}

const LANGUAGE_LEVEL_MAP: Record<string, ATSData['languages'][number]['proficiency']> = {
  'Nativo': 'native',
  'nativo': 'native',
  'Native': 'native',
  'Intermediate (B1+)': 'conversational',
  'Básico': 'basic',
  'basic': 'basic',
}

const CERT_STATUS_MAP: Record<string, 'active' | 'expired' | 'revoked'> = {
  'active': 'active',
  'in-progress': 'active',
  'expired': 'expired',
  'revoked': 'revoked',
}

function toATS(data: RawCVData): ATSData {
  return {
    personal: {
      name: data.profile.name,
      email: data.contact.email,
      phone: data.contact.phone,
      location: data.contact.location,
      linkedin: data.contact.linkedin,
      github: data.contact.github,
      website: data.contact.portfolio,
    },
    summary: data.profile.summary.en,
    experience: data.experience.map((exp) => ({
      company: exp.company,
      title: exp.position.en,
      startDate: exp.startDate,
      endDate: exp.endDate || null,
      bullets: exp.highlights.en,
      metrics: (exp.metrics || []).map(m => `${m.value}${m.unit || ''} ${m.label.en}`),
      skills: exp.technologies,
    })),
    education: data.education.map((edu) => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field?.en || edu.program?.en,
      startDate: edu.startDate,
      endDate: edu.endDate || null,
      honors: edu.honors,
      gpa: edu.gpa ? parseFloat(edu.gpa) : undefined,
    })),
    certifications: data.certifications.map((cert) => ({
      name: typeof cert.name === 'object' ? cert.name.en : cert.name,
      issuer: cert.issuer,
      date: cert.date,
      expiryDate: cert.expiryDate || undefined,
      status: CERT_STATUS_MAP[cert.status || 'active'] || 'active',
      credentialId: cert.credentialId || undefined,
      url: cert.url || undefined,
    })),
    skills: data.skills.map((skill) => ({
      name: skill.name,
      category: SKILL_CATEGORY_MAP[skill.category] || 'tool',
      proficiency: SKILL_LEVEL_MAP[skill.level || ''] || undefined,
    })),
    projects: data.projects.map((proj) => ({
      name: proj.name,
      description: proj.description.en,
      technologies: proj.technologies,
      impact: proj.impact,
      url: proj.url,
      featured: proj.featured,
    })),
    languages: data.languages.map((lang) => ({
      language: lang.language,
      proficiency: LANGUAGE_LEVEL_MAP[lang.level] || 'conversational',
    })),
    keywords: [],
    generatedAt: new Date().toISOString(),
    schemaVersion: '1.0.0',
  }
}

// ============================================================================
// Generate Markdown
// ============================================================================

function toMarkdown(ats: ATSData): string {
  const lines: string[] = []

  lines.push(`# ${ats.personal.name} — CV`)
  lines.push('')
  lines.push(`**${ats.summary}**`)
  lines.push('')
  lines.push('---')
  lines.push('')

  // Experience
  lines.push('## Experiencia / Experience')
  lines.push('')
  for (const exp of ats.experience) {
    lines.push(`### ${exp.title} — ${exp.company}`)
    lines.push(`*${exp.startDate} – ${exp.endDate || 'Present'}*`)
    lines.push('')
    for (const bullet of exp.bullets) {
      lines.push(`- ${bullet}`)
    }
    if (exp.metrics.length > 0) {
      lines.push('')
      lines.push(`**Métricas:** ${exp.metrics.join(' | ')}`)
    }
    if (exp.skills.length > 0) {
      lines.push(`**Tecnologías:** ${exp.skills.join(', ')}`)
    }
    lines.push('')
  }

  // Education
  lines.push('## Educación / Education')
  lines.push('')
  for (const edu of ats.education) {
    lines.push(`### ${edu.degree}`)
    lines.push(`*${edu.institution}* — ${edu.startDate} – ${edu.endDate || 'Present'}`)
    if (edu.honors && edu.honors.length > 0) {
      lines.push(`**Honores:** ${edu.honors.join(', ')}`)
    }
    lines.push('')
  }

  // Certifications
  if (ats.certifications.length > 0) {
    lines.push('## Certificaciones / Certifications')
    lines.push('')
    for (const cert of ats.certifications) {
      lines.push(`- **${cert.name}** — ${cert.issuer} (${cert.date}) [${cert.status}]`)
    }
    lines.push('')
  }

  // Skills
  if (ats.skills.length > 0) {
    lines.push('## Habilidades / Skills')
    lines.push('')
    const byCategory = ats.skills.reduce((acc, s) => {
      ;(acc[s.category] ??= []).push(s)
      return acc
    }, {} as Record<string, typeof ats.skills>)
    for (const [cat, skills] of Object.entries(byCategory)) {
      lines.push(`**${cat}:** ${skills.map(s => s.name).join(', ')}`)
    }
    lines.push('')
  }

  // Projects
  if (ats.projects.length > 0) {
    lines.push('## Proyectos / Projects')
    lines.push('')
    for (const proj of ats.projects) {
      lines.push(`- **${proj.name}** — ${proj.description}`)
      if (proj.technologies.length > 0) {
        lines.push(`  *Tech:* ${proj.technologies.join(', ')}`)
      }
    }
    lines.push('')
  }

  // Languages
  if (ats.languages.length > 0) {
    lines.push('## Idiomas / Languages')
    lines.push('')
    for (const lang of ats.languages) {
      lines.push(`- **${lang.language}:** ${lang.proficiency}`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

// ============================================================================
// Generate Career-Ops JSON
// ============================================================================

function toCareerOps(ats: ATSData): Record<string, unknown> {
  return {
    version: '1.0',
    candidate: {
      name: ats.personal.name,
      email: ats.personal.email,
      phone: ats.personal.phone,
      location: ats.personal.location,
      urls: {
        linkedin: ats.personal.linkedin,
        github: ats.personal.github,
        website: ats.personal.website,
      },
    },
    summary: ats.summary,
    work_history: ats.experience.map(exp => ({
      organization: exp.company,
      title: exp.title,
      start_date: exp.startDate,
      end_date: exp.endDate,
      achievements: exp.bullets,
      metrics: exp.metrics,
      technologies: exp.skills,
    })),
    education_history: ats.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_date: edu.startDate,
      end_date: edu.endDate,
      honors: edu.honors,
    })),
    certifications: ats.certifications.map(cert => ({
      name: cert.name,
      issuing_organization: cert.issuer,
      issue_date: cert.date,
      expiry_date: cert.expiryDate,
      status: cert.status,
      credential_id: cert.credentialId,
    })),
    skills: ats.skills.map(s => ({
      name: s.name,
      category: s.category,
      proficiency: s.proficiency,
    })),
    projects: ats.projects.map(p => ({
      name: p.name,
      description: p.description,
      technologies: p.technologies,
      impact: p.impact,
      url: p.url,
    })),
    languages: ats.languages.map(l => ({
      language: l.language,
      proficiency: l.proficiency,
    })),
    keywords: ats.keywords,
  }
}

// ============================================================================
// Generate AI-Job-Search YAML
// ============================================================================

function toAIJobSearch(ats: ATSData): Record<string, unknown> {
  return {
    schema: 'ai-job-search/v1',
    generated_at: ats.generatedAt,
    profile: {
      full_name: ats.personal.name,
      email: ats.personal.email,
      phone: ats.personal.phone,
      location: ats.personal.location,
      links: {
        github: ats.personal.github,
        linkedin: ats.personal.linkedin,
        website: ats.personal.website,
      },
    },
    professional_summary: ats.summary,
    work_experience: ats.experience.map(exp => ({
      company: exp.company,
      role: exp.title,
      period: { from: exp.startDate, to: exp.endDate },
      responsibilities: exp.bullets,
      quantified_results: exp.metrics,
      tech_stack: exp.skills,
    })),
    academic_background: ats.education.map(edu => ({
      institution: edu.institution,
      program: edu.degree,
      specialization: edu.field,
      period: { from: edu.startDate, to: edu.endDate },
      distinctions: edu.honors,
    })),
    professional_development: ats.certifications.map(cert => ({
      credential: cert.name,
      provider: cert.issuer,
      obtained: cert.date,
      valid_until: cert.expiryDate,
      state: cert.status,
    })),
    competency_matrix: ats.skills.reduce((acc, s) => {
      ;(acc[s.category] ??= []).push({ skill: s.name, level: s.proficiency })
      return acc
    }, {} as Record<string, Array<{ skill: string; level: string | undefined }>>),
    portfolio: ats.projects.map(p => ({
      project_name: p.name,
      overview: p.description,
      tools_used: p.technologies,
      outcomes: p.impact,
      repository: p.url,
    })),
    linguistic_competencies: ats.languages.map(l => ({
      language: l.language,
      capability: l.proficiency,
    })),
    search_keywords: ats.keywords,
  }
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log('📄 Loading CV data from YAML...')
  const raw = readFileSync(YAML_PATH, 'utf-8')
  const data = yaml.load(raw) as RawCVData

  console.log('🔄 Transforming to ATS format...')
  const ats = toATS(data)

  // Validate ATS output
  const validation = ATSSchema.safeParse(ats)
  if (!validation.success) {
    console.error('❌ ATS validation failed:', validation.error.format())
    process.exit(1)
  }

  // Extract keywords
  ats.keywords = extractKeywords(ats)

  // Ensure dist directory exists
  mkdirSync(DIST_DIR, { recursive: true })

  // Write outputs
  console.log('📝 Writing cv-data.json...')
  writeFileSync(
    resolve(DIST_DIR, 'cv-data.json'),
    JSON.stringify(ats, null, 2),
    'utf-8'
  )

  console.log('📝 Writing cv-data.yaml...')
  writeFileSync(
    resolve(DIST_DIR, 'cv-data.yaml'),
    yaml.dump(ats, { lineWidth: 120 }),
    'utf-8'
  )

  console.log('📝 Writing cv-structured.md...')
  writeFileSync(
    resolve(DIST_DIR, 'cv-structured.md'),
    toMarkdown(ats),
    'utf-8'
  )

  console.log('📝 Writing cv-career-ops.json...')
  writeFileSync(
    resolve(DIST_DIR, 'cv-career-ops.json'),
    JSON.stringify(toCareerOps(ats), null, 2),
    'utf-8'
  )

  console.log('📝 Writing cv-ai-job-search.yaml...')
  writeFileSync(
    resolve(DIST_DIR, 'cv-ai-job-search.yaml'),
    yaml.dump(toAIJobSearch(ats), { lineWidth: 120 }),
    'utf-8'
  )

  console.log(`✅ All exports written to ${DIST_DIR}`)
  console.log(`   - cv-data.json (${ats.keywords.length} keywords)`)
  console.log('   - cv-data.yaml')
  console.log('   - cv-structured.md')
  console.log('   - cv-career-ops.json')
  console.log('   - cv-ai-job-search.yaml')
}

main()
