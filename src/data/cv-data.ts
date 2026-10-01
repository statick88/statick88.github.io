// src/data/cv-data.ts — Single Source of Truth (SSOT)
// Regenerated from cv-data.yaml via js-yaml at build time.
//
// Reglas de consumo:
//   import { basics, work, skills } from '@/data/cv-data'
//   import { cvData } from '@/data/cv-data'           // barrel (compat)
//   import type { CVData } from '@/types/cv'

import * as yaml from 'js-yaml'
import cvDataRaw from './cv-data.yaml?raw'

import type {
  Basics,
  WorkExperience,
  Education,
  Skill,
  SoftSkill,
  Language,
  Certification,
  Project,
  Service,
  Metric,
  Contact,
  Profile,
  CVData,
  CategoryColor,
  SkillCategory,
} from '../types/cv.js'

// ── Build-time Validators ────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function assertIsoDate(value: string, field: string): void {
  if (!ISO_DATE_RE.test(value)) {
    throw new Error(`[cv-data] Invalid ISO date in "${field}": "${value}" — expected YYYY-MM-DD`)
  }
}

function assertNonEmpty(value: string, field: string): void {
  if (value.trim().length === 0) {
    throw new Error(`[cv-data] Empty string in "${field}"`)
  }
}

function assertBilingual(value: { es: string; en: string }, field: string): void {
  assertNonEmpty(value.es, `${field}.es`)
  assertNonEmpty(value.en, `${field}.en`)
}

// ── Parse YAML at module level ───────────────────────────────────

const raw = yaml.load(cvDataRaw) as Record<string, any>

// ── Basics ───────────────────────────────────────────────────────

export const basics: Basics = {
  name: raw.profile.name,
  label: raw.profile.role,
  image: '/statick.png',
  email: raw.contact.email,
  phone: raw.contact.phone,
  location: { city: 'Loja', region: 'Loja', countryCode: 'EC' },
  profiles: [
    { network: 'LinkedIn', url: raw.contact.linkedin },
    { network: 'GitHub', url: raw.contact.github },
    { network: 'Portfolio', url: raw.contact.portfolio },
  ],
}

// ── Work Experience ──────────────────────────────────────────────

export const work: readonly WorkExperience[] = raw.experience.map((exp: any) => ({
  name: exp.company,
  position: exp.position,
  url: exp.url,
  startDate: exp.startDate,
  endDate: exp.endDate || undefined,
  summary: {
    es: (exp.highlights?.es || []).join('. '),
    en: (exp.highlights?.en || []).join('. '),
  },
}))

// ── Education ────────────────────────────────────────────────────

export const education: readonly Education[] = raw.education.map((edu: any) => ({
  institution: edu.institution,
  area: edu.program,
  url: '',
  startDate: edu.startDate,
  // An in-progress programme (UCM, started 2026-02) has no end date on record.
  endDate: edu.endDate || '',
  studyType: edu.degree,
  score: edu.gpa || '',
}))

// ── Skills ───────────────────────────────────────────────────────

export const skills: readonly Skill[] = raw.skills

// ── Soft Skills ──────────────────────────────────────────────────
// Mapped from the `softSkills` block of cv-data.yaml (migrated verbatim
// from cvData.js). Shape is identical to SoftSkill: a flat { es, en } pair.

export const softSkills: readonly SoftSkill[] = (raw.softSkills ?? []).map((s: any, i: number) => {
  assertBilingual(s, `softSkills[${i}]`)
  return { es: s.es, en: s.en }
})

// ── Languages ────────────────────────────────────────────────────

export const languages: readonly Language[] = raw.languages.map((lang: any) => ({
  language: lang.language,
  fluency: { es: lang.level, en: lang.level },
}))

// ── Certifications ───────────────────────────────────────────────

export const certifications: readonly Certification[] = raw.certifications.map((cert: any) => ({
  name: cert.name.en || cert.name.es,
  issuer: cert.issuer,
  status: cert.status,
}))

// ── Projects ─────────────────────────────────────────────────────

export const projects: readonly Project[] = raw.projects.map((proj: any) => ({
  name: proj.name,
  description: proj.description,
  highlights: { es: proj.technologies || [], en: proj.technologies || [] },
  github: proj.url || '',
}))

// ── Metrics ──────────────────────────────────────────────────────

const m = raw.metrics

export const metrics: Record<string, Metric> = {
  yearsExperience: {
    value: String(m.yearsExperience),
    unit: 'years',
    label_es: 'Años de experiencia',
    label_en: 'Years of experience',
    source: 'cv-data.yaml',
  },
  yearsTeaching: {
    value: String(m.yearsTeaching),
    unit: 'years',
    label_es: 'Años de docencia',
    label_en: 'Years of teaching',
    source: 'cv-data.yaml',
  },
  totalHoursTeaching: {
    value: String(m.totalHoursTeaching),
    unit: 'hours',
    label_es: 'Horas totales de docencia',
    label_en: 'Total teaching hours',
    source: 'cv-data.yaml',
  },
  githubPublicRepos: {
    value: String(m.githubPublicRepos),
    unit: 'repos',
    label_es: 'Repositorios públicos en GitHub',
    label_en: 'Public GitHub repos',
    source: 'github.com/statick88',
  },
  // `publicReposAudited` and `totalProjectsAudited` were removed on 2026-10-01:
  // no source backed the 130 / 64 values. Do not reintroduce them without one.
  averageCohortScore: {
    value: String(m.averageCohortScore),
    unit: '/100',
    label_es: 'Promedio cohorte Python 2026',
    label_en: 'Python 2026 cohort avg',
    source: 'cv-data.yaml',
  },
  apcYearsService: {
    value: String(m.apcYearsService),
    unit: 'years',
    label_es: 'Años de servicio en APC',
    label_en: 'Years of service at APC',
    source: 'cv-data.yaml',
  },
  languagesSpoken: {
    value: String(m.languagesSpoken),
    unit: 'languages',
    label_es: 'Idiomas hablados',
    label_en: 'Languages spoken',
    source: 'cv-data.yaml',
  },
}

// ── Services ─────────────────────────────────────────────────────
// Mapped from the `services` block of cv-data.yaml (migrated verbatim
// from cvData.js). The YAML shape already matches the Service interface,
// so this is an identity mapping plus the usual bilingual validation.

export const services: readonly Service[] = (raw.services ?? []).map((svc: any, i: number) => {
  const field = `services[${i}]`
  assertNonEmpty(svc.id, `${field}.id`)
  assertNonEmpty(svc.priceRange, `${field}.priceRange`)
  assertNonEmpty(svc.color, `${field}.color`)
  assertBilingual(svc.title, `${field}.title`)
  assertBilingual(svc.description, `${field}.description`)
  return {
    id: svc.id,
    icon: svc.icon as Service['icon'],
    title: { es: svc.title.es, en: svc.title.en },
    description: { es: svc.description.es, en: svc.description.en },
    formats: {
      es: (svc.formats?.es || []) as readonly string[],
      en: (svc.formats?.en || []) as readonly string[],
    },
    priceRange: svc.priceRange,
    color: svc.color,
  }
})

// ── Contact ──────────────────────────────────────────────────────

export const contact: Contact = {
  email: raw.contact.email,
  phone: raw.contact.phone,
  whatsapp: `https://wa.me/${raw.contact.phone.replace(/[^0-9]/g, '')}`,
  linkedin: raw.contact.linkedin,
  github: raw.contact.github,
  calendar: '',
  tagline: {
    es: '¿Listo para llevar tu proyecto al siguiente nivel? Hablemos.',
    en: "Ready to take your project to the next level? Let's talk.",
  },
  cta: { es: 'Agendar Llamada Gratuita', en: 'Schedule Free Call' },
}

// ── Category Colors ──────────────────────────────────────────────

export const categoryColors: Record<SkillCategory, CategoryColor> = {
  'frontend-fundamentals': { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
  'frontend-frameworks': { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400' },
  backend: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  mobile: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  'mobile-native': { bg: 'bg-rose-500/20', border: 'border-rose-500/50', text: 'text-rose-400' },
  devops: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  databases: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400' },
  security: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400' },
  architecture: { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
  teaching: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
  tools: { bg: 'bg-slate-500/20', border: 'border-slate-500/50', text: 'text-slate-400' },
  ai: { bg: 'bg-indigo-500/20', border: 'border-indigo-500/50', text: 'text-indigo-400' },
  research: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
}

// ── Profile Data (Selector de perfiles) ──────────────────────────

export const profileData: Record<string, Profile> = {
  developer: {
    id: 'developer',
    label: { es: 'Desarrollador Full Stack | Full Stack Engineer', en: 'Full Stack Developer | Full Stack Engineer' },
    color: '#3b82f6',
    icon: '💻',
    summary: raw.profile.summary,
    skills: skills.filter((s) =>
      ['frontend-fundamentals', 'frontend-frameworks', 'backend', 'mobile', 'mobile-native', 'devops', 'databases', 'architecture'].includes(s.category),
    ),
    certifications: certifications.filter((c) => c.status === 'active'),
    pdf: 'cv-developer.pdf',
  },

  hacker: {
    id: 'hacker',
    label: { es: 'Hacker Ético | Pentester & Security Researcher', en: 'Ethical Hacker | Pentester & Security Researcher' },
    color: '#ef4444',
    icon: '🎯',
    summary: {
      // Client engagements are described as verifiable capability only. Signed
      // authorization letters may carry confidentiality terms, so the client is
      // not named and no link is published — that attribution is the user's call.
      // Source: ~/Security engagement reports and authorization letters,
      // verified 2026-10-01.
      es: 'Hacker Ético y Security Researcher. Pentesting, IDOR/CVSS, RE/Explotación (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). Auditoría Moodle UCM: 5 hallazgos (1 CRIT CVSS 9.1, 2 MED, 2 LOW). Red team sobre API vLLM 0.19.0: 10 hallazgos confirmados, CVSS medio 8.2, con PoC ejecutable. Pentest + red team sobre plataforma web: 9 vulnerabilidades (2 críticas, 2 altas), 205 registros exfiltrados, 0 falsos positivos. Tercer encargo con carta de autorización firmada, informe entregable y bundle de PoC con manifiesto SHA-256. Metodología propia: 116 hallazgos mapeados a MITRE ATT&CK (28/53 técnicas), NIST CSF 2.0 y OWASP Top 10. MSc Ciberseguridad UCM en curso.',
      en: 'Ethical Hacker and Security Researcher. Pentesting, IDOR/CVSS, RE/Exploitation (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). UCM Moodle audit: 5 findings (1 CRIT CVSS 9.1, 2 MED, 2 LOW). Red team on a vLLM 0.19.0 API: 10 confirmed findings, mean CVSS 8.2, with executable PoCs. Pentest + red team on a web platform: 9 vulnerabilities (2 critical, 2 high), 205 records exfiltrated, 0 false positives. A third engagement under a signed authorization letter, with a deliverable report and a PoC bundle carrying a SHA-256 manifest. Own methodology: 116 findings mapped to MITRE ATT&CK (28/53 techniques), NIST CSF 2.0, and OWASP Top 10. MSc Cybersecurity UCM in progress.',
    },
    skills: skills.filter((s) => s.category === 'security'),
    certifications: certifications.filter((c) =>
      c.issuer === 'ABACOM' || c.issuer === 'Universidad Complutense de Madrid',
    ),
    pdf: 'cv-hacker.pdf',
  },

  research: {
    id: 'research',
    label: { es: 'Investigador | MSc Ciberseguridad UCM', en: 'Researcher | MSc Cybersecurity UCM' },
    color: '#f59e0b',
    icon: '🔬',
    summary: {
      // The UCM programme has no completion date on record: in progress since
      // 2026-02 (user-confirmed 2026-10-01). The previous "2026-2027" range
      // carried the invented end date.
      es: 'Investigador en ciberseguridad y machine learning. MSc en Ciberseguridad UCM (en curso, desde 2026-02). Magíster en Cs. y Tec. de la Computación (UTPL 2021). Interesado en threat modeling, pentesting y AI security.',
      en: 'Researcher in cybersecurity and machine learning. MSc in Cybersecurity UCM (in progress, since 2026-02). Master\'s in Computer Science (UTPL 2021). Interested in threat modeling, pentesting, and AI security.',
    },
    skills: skills.filter((s) => ['ai', 'research', 'tools'].includes(s.category)),
    certifications: certifications.filter((c) =>
      c.issuer === 'UTPL' || c.issuer === 'Universidad Complutense de Madrid',
    ),
    pdf: 'cv-research.pdf',
  },

  'docente-facilitador': {
    id: 'docente-facilitador',
    label: { es: 'Docente Facilitador | Generador de Currículos ABP', en: 'Teaching Facilitator | ABP Curriculum Generator' },
    color: '#10b981',
    icon: '📚',
    summary: {
      // 13 years is the user-confirmed figure; it must agree with
      // metrics.yearsTeaching in cv-data.yaml.
      es: 'Docente Facilitador que genera currículos ABP/ADDIE para cursos de Python, Flutter, R, Linux, Ethical Hacking e IA. 13+ años de experiencia continua en educación superior (9 años como Profesor de Computación en APC). 200+ horas docentes en ABACOM, cohorte Python 2026 promedio 93.4/100.',
      en: 'Teaching Facilitator generating ABP/ADDIE curricula for Python, Flutter, R, Linux, Ethical Hacking, and AI courses. 13+ years continuous experience in higher education (9 years as Computer Science Teacher at APC). 200+ teaching hours at ABACOM, Python 2026 cohort averaging 93.4/100.',
    },
    skills: skills.filter((s) => s.category === 'teaching' || s.name === 'Python' || s.name === 'R Language' || s.name === 'Flutter' || s.name === 'Linux' || s.name === 'Ethical Hacking' || s.name === 'Hardware Hacking (OpenWrt)'),
    certifications: certifications.filter((c) => c.status === 'active'),
    pdf: 'cv-docente-facilitador.pdf',
  },
}

// ── Barrel Export (Backwards Compatibility) ──────────────────────

export const cvData: CVData = {
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
}

// ── Build-time Validation ────────────────────────────────────────

function validate(): void {
  assertNonEmpty(basics.name, 'basics.name')
  assertBilingual(basics.label, 'basics.label')

  for (const [i, entry] of work.entries()) {
    assertIsoDate(entry.startDate, `work[${i}].startDate`)
    if (entry.endDate) assertIsoDate(entry.endDate, `work[${i}].endDate`)
    assertNonEmpty(entry.name, `work[${i}].name`)
    assertBilingual(entry.position, `work[${i}].position`)
    assertBilingual(entry.summary, `work[${i}].summary`)
  }

  for (const [i, entry] of education.entries()) {
    assertIsoDate(entry.startDate, `education[${i}].startDate`)
    if (entry.endDate) assertIsoDate(entry.endDate, `education[${i}].endDate`)
    assertNonEmpty(entry.institution, `education[${i}].institution`)
    assertBilingual(entry.area, `education[${i}].area`)
  }

  for (const [i, skill] of skills.entries()) {
    assertNonEmpty(skill.name, `skills[${i}].name`)
  }

  for (const [i, project] of projects.entries()) {
    assertNonEmpty(project.name, `projects[${i}].name`)
    assertBilingual(project.description, `projects[${i}].description`)
  }

  for (const [key, profile] of Object.entries(profileData)) {
    assertNonEmpty(profile.id, `profileData[${key}].id`)
    assertBilingual(profile.label, `profileData[${key}].label`)
    assertBilingual(profile.summary, `profileData[${key}].summary`)
  }

  console.log(`[cv-data] ✅ Validation passed: ${skills.length} skills, ${work.length} work entries, ${Object.keys(profileData).length} profiles`)
}

validate()
