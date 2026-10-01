// src/data/cv-data.ts — Single Source of Truth (SSOT)
// Migrated from cvData.js — Tipado estricto, validación en build-time.
//
// Reglas de consumo:
//   import { basics, work, skills } from '@/data/cv-data'
//   import { cvData } from '@/data/cv-data'           // barrel (compat)
//   import type { CVData } from '@/types/cv'
//
// NO importar desde cvData.js — será eliminado en Fase 7.

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
// Se ejecutan al importar el módulo (una vez, en build-time).
// Si falla, el build de TypeScript o Vitest se rompe inmediatamente.

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

// ── Basics ───────────────────────────────────────────────────────

export const basics: Basics = {
  name: 'Diego Medardo Saavedra García',
  label: {
    es: 'Magíster en Cs. y Tec. de la Computación (UTPL). MSc Ciberseguridad en curso (UCM). 10+ años en desarrollo full-stack y 6+ como docente universitario. Especializado en React, Node.js, Python, pentesting, ingeniería inversa y diseño curricular ABP.',
    en: "Master's in Computer Science (UTPL). MSc Cybersecurity in progress (UCM). 10+ years in full-stack development, 6+ as university instructor. Specialized in React, Node.js, Python, pentesting, reverse engineering, and PBL curriculum design.",
  },
  image: '/statick.png',
  email: 'dsaavedra88@gmail.com',
  phone: '+593 980192790',
  location: { city: 'Loja', region: 'Loja', countryCode: 'EC' },
  profiles: [
    { network: 'LinkedIn', url: 'https://www.linkedin.com/in/diego-saavedra-developer/' },
    { network: 'GitHub', url: 'https://github.com/statick88' },
    { network: 'Portfolio', url: 'https://statick88.github.io' },
  ],
}

// ── Work Experience ──────────────────────────────────────────────

export const work: readonly WorkExperience[] = [
  {
    name: 'ABACOM',
    position: { es: 'Docente, Facilitador y Curriculista', en: 'Instructor, Facilitator and Curriculum Designer' },
    url: 'https://abacom.edu.ec/',
    startDate: '2021-12-01',
    summary: {
      es: 'Diseño curricular y facilitación de cursos de Python, Flutter, R, Linux, Ethical Hacking, Fundamentos de Ciberseguridad e IA. 200+ horas docentes verificadas con cohorte Python 2026 promedio 93.4/100. Ref: Ing. Kelbi Ramírez Macas.',
      en: 'Curriculum design and facilitation of Python, Flutter, R, Linux, Ethical Hacking, Cybersecurity Fundamentals, and AI courses. 200+ verified teaching hours with 2026 cohort averaging 93.4/100. Ref: Kelbi Ramírez Macas, Eng.',
    },
  },
  {
    name: 'ESPE - Universidad de las Fuerzas Armadas',
    position: { es: 'Docente Ocasional Tiempo Completo - DCC', en: 'Full-time Professor - Computer Science Dept.' },
    url: 'https://www.espe.edu.ec',
    startDate: '2023-04-01',
    endDate: '2024-10-31',
    summary: {
      es: 'Docente del Departamento de Ciencias de la Computación. Asignaturas: Programación, Bases de Datos, Ingeniería de Software. (Sin certificado laboral PDF disponible).',
      en: 'Professor in the Computer Science Department. Courses: Programming, Databases, Software Engineering. (No PDF employment certificate available).',
    },
  },
  {
    name: 'APC - Antonio Peña Celi',
    position: { es: 'Profesor de Computación', en: 'Computer Science Teacher' },
    url: 'https://apc.edu.ec/',
    startDate: '2013-09-01',
    endDate: '2022-12-31',
    summary: {
      es: 'Profesor de Computación durante 9 años (2013-2022). Formación en programación, ofimática avanzada y soporte técnico. Ref: Ing. Rolando Marcelo Rojas Merchán.',
      en: 'Computer Science Teacher for 9 years (2013-2022). Training in programming, advanced office tools, and technical support. Ref: Rolando Marcelo Rojas Merchán, Eng.',
    },
  },
  {
    name: 'Codings Academy',
    position: { es: 'Facilitador de Bootcamps (Django + React)', en: 'Bootcamp Facilitator (Django + React)' },
    url: 'https://codingsacademy.com',
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    summary: {
      es: 'Facilitador de Bootcamps de Desarrollo Web Full Stack con Django y React. Ref: Ing. Jyron Isai Cedeño Chavez, MSc.',
      en: 'Facilitator of Full-stack Web Development Bootcamps with Django and React. Ref: Jyron Isai Cedeño Chavez, MSc Eng.',
    },
  },
  {
    name: 'Instituto Superior Tecnológico Juan Montalvo',
    position: {
      es: 'Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo',
      en: 'Associate Professor - Computer Assembly & Maintenance Career',
    },
    url: 'https://istjm.edu.ec/',
    startDate: '2020-10-01',
    endDate: '2022-03-31',
    summary: {
      es: 'Docente Titular en la carrera técnica de Ensamblaje y Mantenimiento. Asignaturas: Hardware, Redes, Sistemas Operativos. Puente directo con skill de Hardware Hacking (OpenWrt, firmware). Ref: Ing. Ana Gabriela Montalván Salcedo, Mba (Coord. Talento Humano, CI 1103882955).',
      en: 'Associate Professor in the Computer Assembly & Maintenance technical career. Courses: Hardware, Networking, Operating Systems. Direct bridge to Hardware Hacking skill (OpenWrt, firmware). Ref: Ana Gabriela Montalván Salcedo, Mba Eng. (HR Coordinator, ID 1103882955).',
    },
  },
  {
    name: 'UIDE - Universidad Internacional del Ecuador (Ext. Loja)',
    position: { es: 'Docente Ocasional - TTI', en: 'Adjunct Professor - IT Career' },
    url: 'https://www.uide.edu.ec/',
    startDate: '2022-10-01',
    endDate: '2022-12-31',
    summary: {
      es: 'Docente de la carrera de Tecnologías de la Información. (Sin certificado laboral PDF disponible).',
      en: 'Professor of Information Technologies career. (No PDF employment certificate available).',
    },
  },
]

// ── Education ────────────────────────────────────────────────────

export const education: readonly Education[] = [
  {
    institution: 'Universidad Complutense de Madrid',
    area: { es: 'Máster en Ciberseguridad Defensiva y Ofensiva', en: "Master's in Defensive and Offensive Cybersecurity" },
    url: 'https://www.ucm.es/',
    startDate: '2026-02-01',
    endDate: '2027-12-31',
    studyType: 'Master',
    score: 'En curso',
  },
  {
    institution: 'Universidad Técnica Particular de Loja',
    area: { es: 'Maestría en Ciencias y Tecnologías de la Computación', en: "Master's in Computer Science and Technologies" },
    url: 'https://www.utpl.edu.ec/',
    startDate: '2018-09-01',
    endDate: '2021-02-28',
    studyType: 'Master',
    score: '4.0',
  },
  {
    institution: 'Universidad Nacional de Loja',
    area: { es: 'Licenciatura en Informática Educativa', en: "Bachelor's in Educational Computing" },
    url: 'https://unl.edu.ec/',
    startDate: '2007-09-01',
    endDate: '2011-02-28',
    studyType: 'Bachelor',
    score: '4.0',
  },
]

// ── Skills ───────────────────────────────────────────────────────

export const skills: readonly Skill[] = [
  { name: 'HTML', level: 'master', category: 'frontend-fundamentals' },
  { name: 'CSS', level: 'master', category: 'frontend-fundamentals' },
  { name: 'JavaScript', level: 'master', category: 'frontend-fundamentals' },
  { name: 'TypeScript', level: 'advanced', category: 'frontend-frameworks' },
  { name: 'React', level: 'advanced', category: 'frontend-frameworks' },
  { name: 'Next.js', level: 'advanced', category: 'frontend-frameworks' },
  { name: 'Vue', level: 'intermediate', category: 'frontend-frameworks' },
  { name: 'Svelte', level: 'intermediate', category: 'frontend-frameworks' },
  { name: 'Angular', level: 'intermediate', category: 'frontend-frameworks' },
  { name: 'Node.js', level: 'advanced', category: 'backend' },
  { name: 'Python', level: 'advanced', category: 'backend' },
  { name: 'Django', level: 'advanced', category: 'backend' },
  { name: 'FastAPI', level: 'advanced', category: 'backend' },
  { name: 'NestJS', level: 'advanced', category: 'backend' },
  { name: 'SRI / XAdES', level: 'advanced', category: 'backend' },
  { name: 'Flutter', level: 'advanced', category: 'mobile' },
  { name: 'React Native', level: 'advanced', category: 'mobile' },
  { name: 'Expo SDK 53+', level: 'advanced', category: 'mobile' },
  { name: 'Swift (iOS)', level: 'intermediate', category: 'mobile-native' },
  { name: 'Kotlin (Android)', level: 'intermediate', category: 'mobile-native' },
  { name: 'Docker', level: 'advanced', category: 'devops' },
  { name: 'Kubernetes', level: 'intermediate', category: 'devops' },
  { name: 'AWS', level: 'intermediate', category: 'devops' },
  { name: 'Azure', level: 'intermediate', category: 'devops' },
  { name: 'GitHub Actions', level: 'intermediate', category: 'devops' },
  { name: 'MySQL', level: 'advanced', category: 'databases' },
  { name: 'MongoDB', level: 'advanced', category: 'databases' },
  { name: 'PostgreSQL', level: 'advanced', category: 'databases' },
  { name: 'Clean Architecture', level: 'advanced', category: 'architecture' },
  { name: 'SOLID', level: 'advanced', category: 'architecture' },
  { name: 'TDD', level: 'advanced', category: 'architecture' },
  { name: 'Ethical Hacking', level: 'advanced', category: 'security' },
  { name: 'Penetration Testing', level: 'advanced', category: 'security' },
  { name: 'OWASP Top 10', level: 'advanced', category: 'security' },
  { name: 'Auditoría de Pentesting', level: 'advanced', category: 'security' },
  { name: 'Ingeniería Inversa y Explotación', level: 'advanced', category: 'security' },
  { name: 'Hardware Hacking (OpenWrt)', level: 'advanced', category: 'security' },
  { name: 'Bash Scripting', level: 'advanced', category: 'security' },
  { name: 'Linux', level: 'master', category: 'security' },
  { name: 'Kali Linux', level: 'advanced', category: 'security' },
  { name: 'Metasploit', level: 'intermediate', category: 'security' },
  { name: 'Burp Suite', level: 'intermediate', category: 'security' },
  { name: 'Nmap', level: 'advanced', category: 'security' },
  { name: 'Wireshark', level: 'intermediate', category: 'security' },
  { name: 'Machine Learning', level: 'intermediate', category: 'ai' },
  { name: 'TensorFlow', level: 'intermediate', category: 'ai' },
  { name: 'R Language', level: 'intermediate', category: 'ai' },
  { name: 'Git', level: 'advanced', category: 'tools' },
  { name: 'NotebookLM Power-User', level: 'master', category: 'tools' },
  { name: 'OpenCode + MCP', level: 'advanced', category: 'tools' },
  { name: 'Quarto', level: 'advanced', category: 'tools' },
  { name: 'Jupyter', level: 'advanced', category: 'tools' },
  { name: 'LaTeX', level: 'advanced', category: 'tools' },
  { name: 'Diseño Curricular (ABP / ADDIE)', level: 'master', category: 'teaching' },
]

// ── Soft Skills ──────────────────────────────────────────────────

export const softSkills: readonly SoftSkill[] = [
  { es: 'Resolución de Problemas', en: 'Problem Solving' },
  { es: 'Trabajo en Equipo', en: 'Teamwork' },
  { es: 'Comunicación', en: 'Communication' },
  { es: 'Adaptabilidad', en: 'Adaptability' },
  { es: 'Gestión del Tiempo', en: 'Time Management' },
  { es: 'Liderazgo', en: 'Leadership' },
  { es: 'Mentoría', en: 'Mentoring' },
]

// ── Languages ────────────────────────────────────────────────────

export const languages: readonly Language[] = [
  { language: 'Español', fluency: { es: 'Nativo', en: 'Native' } },
  { language: 'Inglés', fluency: { es: 'Avanzado', en: 'Advanced' } },
  { language: 'Italiano', fluency: { es: 'Básico', en: 'Basic' } },
  { language: 'Portugués', fluency: { es: 'Básico', en: 'Basic' } },
]

// ── Projects ─────────────────────────────────────────────────────

export const projects: readonly Project[] = [
  {
    name: 'course-of-cybersecurity',
    description: {
      es: 'Libro de curso completo de ciberseguridad: 42 horas, 5 unidades, más de 40 retos, más de 10 laboratorios y 7 cuestionarios. Incluye el pack docente completo: guía del instructor, manual del estudiante, rúbricas de evaluación, plan de acreditación y manual de despliegue con Docker.',
      en: 'Complete published cybersecurity course book: 42 hours, 5 units, 40+ challenges, 10+ labs and 7 quizzes. Ships with a full instructor resource pack: teacher guide, student manual, evaluation rubrics, accreditation plan and Docker deployment manual.',
    },
    highlights: {
      es: ['Diseño Curricular', '42 horas', 'Retos', 'Laboratorios', 'Docker'],
      en: ['Curriculum Design', '42 hours', 'Challenges', 'Labs', 'Docker'],
    },
    github: 'https://github.com/statick88/course-of-cybersecurity',
  },
  {
    name: 'cyber-guardians',
    description: {
      es: 'Plataforma de mediador pedagógico con IA que aplica el método socrático sin revelar nunca la respuesta. Ofrece andamiaje en cuatro niveles (explícito, guiado, implícito, retirado) fundamentado en la Zona de Desarrollo Próximo de Vygotsky, además de un panel de metacognición.',
      en: 'AI pedagogical mediator platform that applies the Socratic method without ever revealing the answer. Offers four-level scaffolding (explicit, guided, implicit, withdrawn) grounded in Vygotsky’s Zone of Proximal Development, plus a metacognition panel.',
    },
    highlights: {
      es: ['TypeScript', 'Método Socrático', 'Andamiaje', 'Vygotsky', 'Metacognición'],
      en: ['TypeScript', 'Socratic Method', 'Scaffolding', 'Vygotsky', 'Metacognition'],
    },
    github: 'https://github.com/statick88/cyber-guardians',
  },
  {
    name: 'desarrollo-software-seguro',
    description: {
      es: 'Material de desarrollo de software seguro publicado como material abierto, con el único repositorio del conjunto que cuenta con una estrella en GitHub.',
      en: 'Secure software development material published as open material, and the only repository in this set with a star on GitHub.',
    },
    highlights: {
      es: ['JavaScript', 'Desarrollo Seguro', 'Open Educational Resources'],
      en: ['JavaScript', 'Secure Development', 'Open Educational Resources'],
    },
    github: 'https://github.com/statick88/desarrollo-software-seguro',
  },
  {
    name: 'Course_of_python',
    description: {
      es: 'Curso propio de Python de 11 módulos con más de 70 retos prácticos, publicado como material abierto.',
      en: 'Own Python course of 11 modules with 70+ practical challenges, published as open material.',
    },
    highlights: {
      es: ['JavaScript', 'Python', '11 módulos', '70+ retos', 'Material Abierto'],
      en: ['JavaScript', 'Python', '11 modules', '70+ challenges', 'Open Material'],
    },
    github: 'https://github.com/statick88/Course_of_python',
  },
  {
    name: 'MindLedger',
    description: {
      es: 'Sistema multi-tenant de gestión clínica y contable: arquitectura limpia, aislamiento multi-tenant, cifrado de base de datos local y validación de entrada tipada.',
      en: 'Multi-tenant clinical and accounting system: clean architecture, multi-tenant isolation, local database encryption and typed input validation.',
    },
    highlights: {
      es: ['Rust', 'Clean Architecture', 'Multi-Tenant', 'Cifrado', 'Validación Tipada'],
      en: ['Rust', 'Clean Architecture', 'Multi-Tenant', 'Encryption', 'Typed Validation'],
    },
    github: 'https://github.com/statick88/MindLedger',
  },
  {
    name: 'jarvis-os',
    description: {
      es: 'Capa de servicios en Python.',
      en: 'Python service layer.',
    },
    highlights: {
      es: ['Python'],
      en: ['Python'],
    },
    github: 'https://github.com/statick88/jarvis-os',
  },
]

// ── Certifications ───────────────────────────────────────────────

export const certifications: readonly Certification[] = [
  { name: 'Magíster en Cs. y Tec. de la Computación', issuer: 'UTPL', status: 'active' },
  { name: 'Licenciado en Informática Educativa', issuer: 'UNL', status: 'active' },
  { name: 'Reverse Engineering & Exploit Development', issuer: 'UCM', status: 'active' },
  { name: 'Ethical Hacking & Penetration Testing', issuer: 'ABACOM', status: 'active' },
  { name: 'Linux Server Administration', issuer: 'ABACOM', status: 'active' },
  { name: 'Python for Data Science', issuer: 'ABACOM', status: 'active' },
  { name: 'R para Análisis Estadístico', issuer: 'ABACOM', status: 'active' },
  { name: 'Flutter Mobile Development (3 niveles)', issuer: 'ABACOM', status: 'active' },
  { name: 'Fundamentos de Ciberseguridad', issuer: 'ABACOM', status: 'active' },
  { name: 'Imagen de Marca (Branding)', issuer: 'ABACOM', status: 'active' },
  { name: 'Estrategia de Transformación Digital en Marketing Educativo (Fases I, II, III)', issuer: 'ABACOM', status: 'active' },
  { name: 'MSc Ciberseguridad (en curso, 2026-2027)', issuer: 'Universidad Complutense de Madrid', status: 'in-progress' },
]

// ── Metrics ──────────────────────────────────────────────────────

export const metrics: Record<string, Metric> = {
  abacomCohorte2026: {
    value: '93.4',
    unit: '/100',
    label_es: 'Promedio cohorte Python 2026',
    label_en: 'Python 2026 cohort avg',
    source: 'Docente Cuantitativa Evaluation.pdf',
  },
  githubRepos: {
    value: '400',
    unit: 'repos',
    label_es: 'Repositorios públicos en GitHub',
    label_en: 'Public GitHub repos',
    source: 'github.com/statick88',
  },
  nlmNotebooks: {
    value: '55 / 898',
    unit: 'notebooks',
    label_es: 'Notebooks / sources en NotebookLM',
    label_en: 'Notebooks / sources in NotebookLM',
    source: 'nlm --version (v0.6.8)',
  },
  certificationsCount: {
    value: '134+',
    unit: 'certs',
    label_es: 'Certificaciones categorizadas',
    label_en: 'Categorized certifications',
    source: '~/Documents/Certificados/',
  },
}

// ── Services ─────────────────────────────────────────────────────

export const services: readonly Service[] = [
  {
    id: 'fullstack',
    icon: 'code',
    title: { es: 'Desarrollo FullStack', en: 'FullStack Development' },
    description: {
      es: 'Aplicaciones web y móviles de producción con arquitectura sólida, tests, y documentación. React, Next.js, Flutter, Node.js, Python, PostgreSQL.',
      en: 'Production-grade web and mobile applications with solid architecture, tests, and documentation. React, Next.js, Flutter, Node.js, Python, PostgreSQL.',
    },
    formats: { es: ['Por proyecto', 'Por horas', 'Medio tiempo'], en: ['Per project', 'Hourly', 'Part-time'] },
    priceRange: '$25-50/hora',
    color: '#3b82f6',
  },
  {
    id: 'security',
    icon: 'shield',
    title: { es: 'Auditoría de Seguridad', en: 'Security Audit' },
    description: {
      es: 'Pentesting de aplicaciones web y móviles. Identificación de vulnerabilidades OWASP Top 10, reportes con CVSS scoring, y recomendaciones de remediación.',
      en: 'Web and mobile application pentesting. OWASP Top 10 vulnerability identification, CVSS-scored reports, and remediation recommendations.',
    },
    formats: { es: ['Por proyecto', 'Retainer mensual'], en: ['Per project', 'Monthly retainer'] },
    priceRange: '$500-3000/proyecto',
    color: '#ef4444',
  },
  {
    id: 'consulting',
    icon: 'target',
    title: { es: 'Consultoría Técnica', en: 'Technical Consulting' },
    description: {
      es: 'CTO Fractional: arquitectura de software, code review, mentoring de equipos, y toma de decisiones técnicas estratégicas.',
      en: 'Fractional CTO: software architecture, code review, team mentoring, and strategic technical decision-making.',
    },
    formats: { es: ['Medio tiempo', 'Por horas', 'Retainer'], en: ['Part-time', 'Hourly', 'Retainer'] },
    priceRange: '$20-40/hora',
    color: '#8b5cf6',
  },
  {
    id: 'training',
    icon: 'book',
    title: { es: 'Capacitación & Cursos', en: 'Training & Courses' },
    description: {
      es: 'Cursos personalizados de Python, Ética Hacking, Ciberseguridad, y desarrollo de software. Trece años de docencia continua desde 2013 en seis instituciones, entre ellas ESPE, UIDE y ABACOM.',
      en: 'Custom courses in Python, Ethical Hacking, Cybersecurity, and software development. Thirteen continuous years of teaching since 2013 across six institutions, including ESPE, UIDE and ABACOM.',
    },
    formats: { es: ['Por hora', 'Por curso', 'Workshop'], en: ['Hourly', 'Per course', 'Workshop'] },
    priceRange: '$30-60/hora',
    color: '#10b981',
  },
]

// ── Contact ──────────────────────────────────────────────────────

export const contact: Contact = {
  email: 'dsaavedra88@gmail.com',
  phone: '+593 98 019 2790',
  whatsapp: 'https://wa.me/593980192790',
  linkedin: 'https://linkedin.com/in/dsaavedra88',
  github: 'https://github.com/statick88',
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
    summary: {
      es: 'Desarrollador Full Stack con 10+ años de experiencia en aplicaciones web, móviles y APIs. Dominio de React, Next.js, Python/Django, Node.js, Flutter. 400 repos públicos en GitHub. Apasionado por Clean Architecture, SOLID y TDD.',
      en: 'Full Stack Developer with 10+ years building web, mobile, and API applications. Mastery of React, Next.js, Python/Django, Node.js, Flutter. 400 public repos on GitHub. Passionate about Clean Architecture, SOLID, and TDD.',
    },
    skills: [
      { name: 'HTML', level: 'master', category: 'frontend-fundamentals' },
      { name: 'CSS', level: 'master', category: 'frontend-fundamentals' },
      { name: 'JavaScript', level: 'master', category: 'frontend-fundamentals' },
      { name: 'TypeScript', level: 'advanced', category: 'frontend-frameworks' },
      { name: 'React', level: 'advanced', category: 'frontend-frameworks' },
      { name: 'Next.js', level: 'advanced', category: 'frontend-frameworks' },
      { name: 'Node.js', level: 'advanced', category: 'backend' },
      { name: 'Python', level: 'advanced', category: 'backend' },
      { name: 'Django', level: 'advanced', category: 'backend' },
      { name: 'FastAPI', level: 'advanced', category: 'backend' },
      { name: 'NestJS', level: 'advanced', category: 'backend' },
      { name: 'SRI / XAdES', level: 'advanced', category: 'backend' },
      { name: 'Flutter', level: 'advanced', category: 'mobile' },
      { name: 'React Native', level: 'advanced', category: 'mobile' },
      { name: 'Expo SDK 53+', level: 'advanced', category: 'mobile' },
      { name: 'Swift (iOS)', level: 'intermediate', category: 'mobile-native' },
      { name: 'Kotlin (Android)', level: 'intermediate', category: 'mobile-native' },
      { name: 'Docker', level: 'advanced', category: 'devops' },
      { name: 'Kubernetes', level: 'intermediate', category: 'devops' },
      { name: 'MySQL', level: 'advanced', category: 'databases' },
      { name: 'MongoDB', level: 'advanced', category: 'databases' },
      { name: 'PostgreSQL', level: 'advanced', category: 'databases' },
      { name: 'AWS', level: 'intermediate', category: 'devops' },
      { name: 'Azure', level: 'intermediate', category: 'devops' },
      { name: 'Vue', level: 'intermediate', category: 'frontend-frameworks' },
      { name: 'Svelte', level: 'intermediate', category: 'frontend-frameworks' },
      { name: 'Angular', level: 'intermediate', category: 'frontend-frameworks' },
      { name: 'Clean Architecture', level: 'advanced', category: 'architecture' },
      { name: 'SOLID', level: 'advanced', category: 'architecture' },
      { name: 'TDD', level: 'advanced', category: 'architecture' },
    ],
    certifications: [
      { name: 'Magíster en Cs. y Tec. de la Computación', issuer: 'UTPL', status: 'active' },
      { name: 'Python for Data Science', issuer: 'ABACOM', status: 'active' },
      { name: 'Flutter Mobile Development', issuer: 'ABACOM', status: 'active' },
      { name: 'Linux Server Administration', issuer: 'ABACOM', status: 'active' },
    ],
    pdf: 'cv-developer.pdf',
  },

  hacker: {
    id: 'hacker',
    label: { es: 'Hacker Ético | Pentester & Security Researcher', en: 'Ethical Hacker | Pentester & Security Researcher' },
    color: '#ef4444',
    icon: '🎯',
    summary: {
      es: 'Hacker Ético y Security Researcher. Pentesting, IDOR/CVSS, RE/Explotación (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). Auditoría Moodle UCM: 5 hallazgos (1 CRIT CVSS 9.1, 2 MED, 2 LOW). MSc Ciberseguridad UCM en curso.',
      en: 'Ethical Hacker and Security Researcher. Pentesting, IDOR/CVSS, RE/Exploitation (ms08_067, ms17_010), Hardware Hacking (OpenWrt ramips-mt76x8). UCM Moodle audit: 5 findings (1 CRIT CVSS 9.1, 2 MED, 2 LOW). MSc Cybersecurity UCM in progress.',
    },
    skills: [
      { name: 'Ethical Hacking', level: 'advanced', category: 'security' },
      { name: 'Penetration Testing', level: 'advanced', category: 'security' },
      { name: 'OWASP Top 10', level: 'advanced', category: 'security' },
      { name: 'Auditoría de Pentesting', level: 'advanced', category: 'security' },
      { name: 'Ingeniería Inversa y Explotación', level: 'advanced', category: 'security' },
      { name: 'Hardware Hacking (OpenWrt)', level: 'advanced', category: 'security' },
      { name: 'Nmap', level: 'advanced', category: 'security' },
      { name: 'Metasploit', level: 'intermediate', category: 'security' },
      { name: 'Burp Suite', level: 'intermediate', category: 'security' },
      { name: 'Wireshark', level: 'intermediate', category: 'security' },
      { name: 'SQL Injection', level: 'advanced', category: 'security' },
      { name: 'XSS/CSRF', level: 'advanced', category: 'security' },
      { name: 'Bash Scripting', level: 'advanced', category: 'security' },
      { name: 'Linux', level: 'master', category: 'security' },
      { name: 'Kali Linux', level: 'advanced', category: 'security' },
      { name: 'CTF', level: 'intermediate', category: 'security' },
      { name: 'Network Security', level: 'advanced', category: 'security' },
      { name: 'Web Security', level: 'advanced', category: 'security' },
      { name: 'Cloud Security', level: 'intermediate', category: 'security' },
      { name: 'Python', level: 'advanced', category: 'backend' },
      { name: 'Docker', level: 'advanced', category: 'devops' },
      { name: 'Git', level: 'advanced', category: 'tools' },
      { name: 'OpenCode + MCP', level: 'advanced', category: 'tools' },
    ],
    certifications: [
      { name: 'Reverse Engineering & Exploit Development', issuer: 'UCM', status: 'active' },
      { name: 'Ethical Hacking & Penetration Testing', issuer: 'ABACOM', status: 'active' },
      { name: 'Fundamentos de Ciberseguridad', issuer: 'ABACOM', status: 'active' },
      { name: 'MSc Ciberseguridad (en curso)', issuer: 'Universidad Complutense de Madrid', status: 'in-progress' },
    ],
    pdf: 'cv-hacker.pdf',
  },

  research: {
    id: 'research',
    label: { es: 'Investigador | MSc Ciberseguridad UCM', en: 'Researcher | MSc Cybersecurity UCM' },
    color: '#f59e0b',
    icon: '🔬',
    summary: {
      es: 'Investigador en ciberseguridad y machine learning. MSc en Ciberseguridad UCM (en curso, 2026-2027). Magíster en Cs. y Tec. de la Computación (UTPL 2021). 55 notebooks y 898 sources en NotebookLM. Interesado en threat modeling, pentesting y AI security.',
      en: 'Researcher in cybersecurity and machine learning. MSc in Cybersecurity UCM (in progress, 2026-2027). Master\'s in Computer Science (UTPL 2021). 55 notebooks and 898 sources in NotebookLM. Interested in threat modeling, pentesting, and AI security.',
    },
    skills: [
      { name: 'Machine Learning', level: 'intermediate', category: 'ai' },
      { name: 'Statistical Analysis', level: 'intermediate', category: 'ai' },
      { name: 'LaTeX', level: 'advanced', category: 'tools' },
      { name: 'Quarto', level: 'advanced', category: 'tools' },
      { name: 'Jupyter', level: 'advanced', category: 'tools' },
      { name: 'NotebookLM Power-User', level: 'master', category: 'tools' },
      { name: 'Research Methodology', level: 'advanced', category: 'research' },
      { name: 'Scientific Writing', level: 'advanced', category: 'research' },
      { name: 'Academic Publishing', level: 'intermediate', category: 'research' },
      { name: 'Ethical Hacking', level: 'advanced', category: 'security' },
      { name: 'Penetration Testing', level: 'advanced', category: 'security' },
      { name: 'Network Security', level: 'advanced', category: 'security' },
      { name: 'Threat Modeling', level: 'advanced', category: 'security' },
      { name: 'Vulnerability Assessment', level: 'advanced', category: 'security' },
      { name: 'Python', level: 'advanced', category: 'backend' },
      { name: 'R Language', level: 'intermediate', category: 'ai' },
      { name: 'TensorFlow', level: 'intermediate', category: 'ai' },
      { name: 'Git', level: 'advanced', category: 'tools' },
    ],
    certifications: [
      { name: 'Magíster en Cs. y Tec. de la Computación', issuer: 'UTPL', status: 'active' },
      { name: 'MSc Ciberseguridad (en curso)', issuer: 'Universidad Complutense de Madrid', status: 'in-progress' },
    ],
    pdf: 'cv-research.pdf',
  },

  'docente-facilitador': {
    id: 'docente-facilitador',
    label: { es: 'Docente Facilitador | Generador de Currículos ABP', en: 'Teaching Facilitator | ABP Curriculum Generator' },
    color: '#10b981',
    icon: '📚',
    summary: {
      es: 'Docente Facilitador que genera currículos ABP/ADDIE para cursos de Python, Flutter, R, Linux, Ethical Hacking e IA. 6+ años de experiencia continua en educación superior (9 años como Profesor de Computación en APC). 200+ horas docentes en ABACOM, cohorte Python 2026 promedio 93.4/100.',
      en: 'Teaching Facilitator generating ABP/ADDIE curricula for Python, Flutter, R, Linux, Ethical Hacking, and AI courses. 6+ years continuous experience in higher education (9 years as Computer Science Teacher at APC). 200+ teaching hours at ABACOM, Python 2026 cohort averaging 93.4/100.',
    },
    skills: [
      { name: 'Diseño Curricular (ABP / ADDIE)', level: 'master', category: 'teaching' },
      { name: 'Python', level: 'advanced', category: 'backend' },
      { name: 'R Language', level: 'intermediate', category: 'ai' },
      { name: 'Flutter', level: 'advanced', category: 'mobile' },
      { name: 'Linux', level: 'master', category: 'security' },
      { name: 'Ethical Hacking', level: 'advanced', category: 'security' },
      { name: 'Quarto', level: 'advanced', category: 'tools' },
      { name: 'LaTeX', level: 'advanced', category: 'tools' },
      { name: 'NotebookLM Power-User', level: 'master', category: 'tools' },
      { name: 'Jupyter', level: 'advanced', category: 'tools' },
      { name: 'OpenCode + MCP', level: 'advanced', category: 'tools' },
      { name: 'Hardware Hacking (OpenWrt)', level: 'advanced', category: 'security' },
    ],
    certifications: [
      { name: 'Magíster en Cs. y Tec. de la Computación', issuer: 'UTPL', status: 'active' },
      { name: 'Licenciado en Informática Educativa', issuer: 'UNL', status: 'active' },
      { name: 'Estrategia de Transformación Digital en Marketing Educativo (Fases I, II, III)', issuer: 'ABACOM', status: 'active' },
      { name: 'Imagen de Marca (Branding)', issuer: 'ABACOM', status: 'active' },
      { name: 'Ethical Hacking & Penetration Testing', issuer: 'ABACOM', status: 'active' },
      { name: 'Fundamentos de Ciberseguridad', issuer: 'ABACOM', status: 'active' },
      { name: 'Python for Data Science', issuer: 'ABACOM', status: 'active' },
      { name: 'R para Análisis Estadístico', issuer: 'ABACOM', status: 'active' },
      { name: 'Flutter Mobile Development (3 niveles)', issuer: 'ABACOM', status: 'active' },
      { name: 'Linux Server Administration', issuer: 'ABACOM', status: 'active' },
    ],
    pdf: 'cv-docente-facilitador.pdf',
  },
}

// ── Barrel Export (Backwards Compatibility) ──────────────────────
// Permite: import { cvData } from '@/data/cv-data'
// Temporal — se eliminará cuando todos los consumidores migren a named imports.

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
// Se ejecuta una vez al cargar el módulo.
// En Vitest: se ejecuta al importar los datos en los tests.
// En Vite build: se ejecuta al compilar.

function validate(): void {
  // Basics
  assertNonEmpty(basics.name, 'basics.name')
  assertBilingual(basics.label, 'basics.label')

  // Work
  for (const [i, entry] of work.entries()) {
    assertIsoDate(entry.startDate, `work[${i}].startDate`)
    if (entry.endDate) assertIsoDate(entry.endDate, `work[${i}].endDate`)
    assertNonEmpty(entry.name, `work[${i}].name`)
    assertBilingual(entry.position, `work[${i}].position`)
    assertBilingual(entry.summary, `work[${i}].summary`)
  }

  // Education
  for (const [i, entry] of education.entries()) {
    assertIsoDate(entry.startDate, `education[${i}].startDate`)
    assertIsoDate(entry.endDate, `education[${i}].endDate`)
    assertNonEmpty(entry.institution, `education[${i}].institution`)
    assertBilingual(entry.area, `education[${i}].area`)
  }

  // Skills
  for (const [i, skill] of skills.entries()) {
    assertNonEmpty(skill.name, `skills[${i}].name`)
  }

  // Projects
  for (const [i, project] of projects.entries()) {
    assertNonEmpty(project.name, `projects[${i}].name`)
    assertBilingual(project.description, `projects[${i}].description`)
  }

  // Profiles
  for (const [key, profile] of Object.entries(profileData)) {
    assertNonEmpty(profile.id, `profileData[${key}].id`)
    assertBilingual(profile.label, `profileData[${key}].label`)
    assertBilingual(profile.summary, `profileData[${key}].summary`)
  }

  console.log(`[cv-data] ✅ Validation passed: ${skills.length} skills, ${work.length} work entries, ${Object.keys(profileData).length} profiles`)
}

validate()
