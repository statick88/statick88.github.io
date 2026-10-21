// src/data/cv-data.ts — Single Source of Truth (SSOT)
// Migrated from cvData.js — Tipado estricto, validación en build-time.
//
// Reglas de consumo:
//   import { basics, work, skills } from '@/data/cv-data'
//   import { cvData } from '@/data/cv-data'           // barrel (compat)
//   import type { CVData } from '@/types/cv'
//
// NO importar desde cvData.js — será eliminado en Fase 7.
//
// El CV vive en tres espejos: este fichero, el espejo legacy en
// src/data/cvData.js (el que genera los PDF) y el YAML src/data/cv-data.yaml
// (el que alimenta el export ATS). Los tres declaran el mismo conjunto de
// proyectos, servicios, habilidades y certificaciones; el test de deriva
// (src/__tests__/design/cv-data-drift.test.ts) los mantiene juntos.

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
    name: "Meeting Planner AI System",
    position: { es: "Diseñador y arquitecto de software (proyecto propio)", en: "Software Designer and Architect (own project)" },
    startDate: "2026-01-01",
    summary: {
      es: "Sistema propio de transcripción y análisis de contenido audiovisual con IA generativa. Arquitectura limpia, SDD y despliegue reproducible con Docker Compose.",
      en: "Own transcription and AI-assisted audiovisual content analysis system. Clean architecture, SDD and reproducible Docker Compose deployments.",
    },
    highlights: {
      es: [
        "Arquitecté un sistema modular de transcripción y análisis con arquitectura limpia, integrando Whisper/MLX para speech-to-text, LLMs (Groq/xAI) para análisis y resumen, y Docker Compose para entornos reproducibles.",
        "Reduje 80% el tiempo dedicado a la transcripción manual, procesando horas de contenido audiovisual cada semana sin intervención humana.",
        "Mejoré la accesibilidad educativa con transcripciones precisas y buscables, con un diseño extensible que permitió sumar servicios de análisis sin reestructurar el núcleo.",
      ],
      en: [
        "Architected a modular transcription and analysis system with clean architecture, integrating Whisper/MLX for speech-to-text, LLMs (Groq/xAI) for contextual analysis and summarisation, and Docker Compose for reproducible environments.",
        "Cut 80% of the time spent on manual transcription, processing hours of audiovisual content every week without human intervention.",
        "Improved educational accessibility with precise, searchable transcripts, on an extensible design that added analysis services without restructuring the core.",
      ],
    },
    technologies: ["Python", "FastAPI", "React 19", "Zustand", "Whisper/MLX", "LLM (Groq, xAI)", "Docker Compose", "SDD", "Clean Architecture"],
  },
  {
    name: "ABACOM",
    position: { es: "Docente, Facilitador y Curriculista", en: "Instructor, Facilitator and Curriculum Designer" },
    url: "https://abacom.edu.ec/",
    startDate: "2021-12-01",
    summary: {
      es: "Diseño curricular y facilitación de cursos de Python, Flutter, R, Linux, Ethical Hacking, Fundamentos de Ciberseguridad e IA. 200+ horas docentes verificadas con la cohorte de Python 2026 (promedio 93.4/100). Ref: Ing. Kelbi Ramírez Macas.",
      en: "Curriculum design and facilitation of Python, Flutter, R, Linux, Ethical Hacking, Cybersecurity Fundamentals, and AI courses. 200+ verified teaching hours with the 2026 Python cohort averaging 93.4/100. Ref: Kelbi Ramírez Macas, Eng.",
    },
    highlights: {
      es: [
        "Diseñé y dicté 8 cursos de Ethical Hacking, Python, Flutter, MicroPython, servidores Linux y software seguro, con 200+ horas docentes verificadas y 92+ estudiantes.",
        "Logré un promedio de evaluación de 93.4/100 en la cohorte de Python 2026, publicando el material como 8 libros Quarto abiertos en GitHub Pages.",
        "Construí el pack docente de cada curso (guía del instructor, manual del estudiante, rúbricas de evaluación y plan de acreditación) con metodología ABP.",
      ],
      en: [
        "Designed and taught 8 courses on Ethical Hacking, Python, Flutter, MicroPython, Linux servers and secure software, covering 200+ verified teaching hours and 92+ students.",
        "Achieved a 93.4/100 average evaluation with the 2026 Python cohort, publishing the material as 8 open Quarto books on GitHub Pages.",
        "Built the instructor pack for every course (teaching guide, student manual, assessment rubrics and accreditation plan) with ABP methodology.",
      ],
    },
    technologies: ["Ethical Hacking", "Python", "Flutter", "R", "Linux", "Quarto", "ABP", "OWASP", "Docker"],
  },
  {
    name: "Codings Academy",
    position: { es: "Facilitador de Bootcamps (Django + React)", en: "Bootcamp Facilitator (Django + React)" },
    url: "https://codingsacademy.com",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    summary: {
      es: "Facilitación de bootcamps de desarrollo web full stack con Django y React, con evaluación por rúbricas y seguimiento individual del avance de cada estudiante.",
      en: "Facilitated full-stack web development bootcamps with Django and React, using rubric-based assessment and individual progress tracking for every student.",
    },
    highlights: {
      es: [
        "Facilité bootcamps de desarrollo web full stack con Django y React, con evaluación por rúbricas y seguimiento individual del avance de cada estudiante.",
        "Acompañé a los grupos en el ciclo completo de desarrollo (diseño, implementación, testing y despliegue) de sus proyectos finales.",
      ],
      en: [
        "Facilitated full-stack web development bootcamps with Django and React, using rubric-based assessment and individual progress tracking for every student.",
        "Guided teams through the full development cycle (design, implementation, testing and deployment) of their final projects.",
      ],
    },
    technologies: ["Django", "React", "Python", "JavaScript", "Full Stack"],
  },
  {
    name: "ESPE - Universidad de las Fuerzas Armadas",
    position: { es: "Docente Ocasional Tiempo Completo - DCC", en: "Full-time Professor - Computer Science Dept." },
    url: "https://www.espe.edu.ec",
    startDate: "2023-04-01",
    endDate: "2024-10-31",
    summary: {
      es: "Docente del Departamento de Ciencias de la Computación. Asignaturas: Programación, Bases de Datos, Ingeniería de Software. Certificación laboral disponible bajo solicitud.",
      en: "Professor in the Computer Science Department. Courses: Programming, Databases, Software Engineering. Employment certificate available on request.",
    },
    highlights: {
      es: [
        "Dicté las asignaturas de Programación, Bases de Datos e Ingeniería de Software dentro del Departamento de Ciencias de la Computación.",
        "Trabajo con foco en arquitectura de software, modelado de datos relacionales y prácticas de ingeniería aplicadas a casos reales.",
      ],
      en: [
        "Taught Programming, Databases and Software Engineering within the Computer Science Department.",
        "Worked on software architecture, relational data modelling and engineering practices applied to real cases.",
      ],
    },
    technologies: ["Programación", "Bases de Datos", "Ingeniería de Software", "SQL", "Python"],
  },
  {
    name: "UIDE - Universidad Internacional del Ecuador (Ext. Loja)",
    position: { es: "Docente Ocasional - TTI", en: "Adjunct Professor - IT Career" },
    url: "https://www.uide.edu.ec/",
    startDate: "2022-10-01",
    endDate: "2022-12-31",
    summary: {
      es: "Docente de la carrera de Tecnologías de la Información en la extensión de Loja. Certificación laboral disponible bajo solicitud.",
      en: "Professor for the Information Technologies career at the Loja campus. Employment certificate available on request.",
    },
    highlights: {
      es: [
        "Docente de la carrera de Tecnologías de la Información en la extensión de Loja durante el período académico 2022.",
        "Planifiqué las sesiones y los materiales de la asignatura en coordinación con el resto del claustro de la carrera.",
      ],
      en: [
        "Professor for the Information Technologies career at the Loja campus during the 2022 academic term.",
        "Planned sessions and course materials in coordination with the rest of the career's teaching staff.",
      ],
    },
    technologies: ["Tecnologías de la Información", "Redes", "Hardware"],
  },
  {
    name: "Instituto Superior Tecnológico Juan Montalvo",
    position: { es: "Docente Titular Auxiliar - Carrera de Ensamblaje y Mantenimiento de Equipos de Cómputo", en: "Associate Professor - Computer Assembly & Maintenance Career" },
    url: "https://istjm.edu.ec/",
    startDate: "2020-10-01",
    endDate: "2022-03-31",
    summary: {
      es: "Docente Titular en la carrera técnica de Ensamblaje y Mantenimiento. Asignaturas: Hardware, Redes, Sistemas Operativos. Puente directo con la habilidad de Hardware Hacking (OpenWrt, firmware). Ref: Ing. Ana Gabriela Montalván Salcedo, MBA (Coord. Talento Humano, CI 1103882955).",
      en: "Associate Professor in the Computer Assembly & Maintenance technical career. Courses: Hardware, Networking, Operating Systems. Direct bridge to the Hardware Hacking skill (OpenWrt, firmware). Ref: Ana Gabriela Montalván Salcedo, MBA Eng. (HR Coordinator, ID 1103882955).",
    },
    highlights: {
      es: [
        "Dicté Hardware, Redes y Sistemas Operativos en la carrera técnica de Ensamblaje y Mantenimiento, conectando la cátedra con hardware hacking sobre OpenWrt y firmware.",
        "Monté laboratorios prácticos de redes, instalación de sistemas y configuración de dispositivos embebidos con OpenWrt.",
      ],
      en: [
        "Taught Hardware, Networking and Operating Systems in the Computer Assembly & Maintenance technical career, connecting the course to hardware hacking on OpenWrt and firmware.",
        "Set up practical labs in networking, OS installation and embedded device configuration with OpenWrt.",
      ],
    },
    technologies: ["Hardware", "Redes", "Sistemas Operativos", "OpenWrt", "Firmware", "Kali"],
  },
  {
    name: "APC - Antonio Peña Celi",
    position: { es: "Profesor de Computación", en: "Computer Science Teacher" },
    url: "https://apc.edu.ec/",
    startDate: "2013-09-01",
    endDate: "2022-12-31",
    summary: {
      es: "Profesor de Computación durante 9 años (2013-2022). Formación en programación, ofimática avanzada y soporte técnico. Ref: Ing. Rolando Marcelo Rojas Merchán.",
      en: "Computer Science Teacher for 9 years (2013-2022). Training in programming, advanced office tools, and technical support. Ref: Rolando Marcelo Rojas Merchán, Eng.",
    },
    highlights: {
      es: [
        "Impartí programación, ofimática avanzada y soporte técnico a más de 400 alumnos durante 9 años consecutivos (2013-2022).",
        "Acompañé a los estudiantes en la transición de la ofimática a la programación estructurada y al soporte de hardware en el aula.",
      ],
      en: [
        "Taught programming, advanced office tooling and technical support to more than 400 students over 9 consecutive years (2013-2022).",
        "Guided students through the shift from office tooling to structured programming and classroom hardware support.",
      ],
    },
    technologies: ["Programación", "Ofimática avanzada", "Soporte técnico", "Hardware", "Redes"],
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
  { name: 'SQL Injection', level: 'advanced', category: 'security' },
  { name: 'XSS/CSRF', level: 'advanced', category: 'security' },
  { name: 'CTF', level: 'intermediate', category: 'security' },
  { name: 'Network Security', level: 'advanced', category: 'security' },
  { name: 'Web Security', level: 'advanced', category: 'security' },
  { name: 'Cloud Security', level: 'intermediate', category: 'security' },
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
      es: 'Plataforma de mediador pedagógico con IA que aplica el método socrático sin revelar la respuesta. Ofrece andamiaje en cuatro niveles (explícito, guiado, implícito, retirado) fundamentado en la Zona de Desarrollo Próximo de Vygotsky, además de un panel de metacognición.',
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
      es: 'Sistema de gestión clínica y contable multi-tenant con encriptación de grado médico. Tauri v2 (Rust) + React + SQLCipher. Clean Architecture, patrón Repository, migraciones SQLCipher, datos de prueba interactivos, tema oscuro.',
      en: 'Multi-tenant clinic and accounting management system with medical-grade encryption. Tauri v2 (Rust) + React + SQLCipher. Clean Architecture, Repository pattern, SQLCipher migrations, interactive sample data, dark theme.',
    },
    highlights: {
      es: ['Tauri v2', 'Rust', 'React', 'SQLCipher', 'Clean Architecture', 'Multi-Tenant'],
      en: ['Tauri v2', 'Rust', 'React', 'SQLCipher', 'Clean Architecture', 'Multi-Tenant'],
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
  {
    name: 'open-api-facturacion-sri',
    description: {
      es: 'API REST para facturación electrónica SRI Ecuador con firma XAdES-BES, validación contra esquemas XSD del SRI y emisión de comprobantes electrónicos.',
      en: 'REST API for SRI Ecuador electronic invoicing with XAdES-BES signing, XSD schema validation, and electronic receipt emission.',
    },
    highlights: {
      es: ['Node.js', 'TypeScript', 'XAdES-BES', 'SRI Ecuador'],
      en: ['Node.js', 'TypeScript', 'XAdES-BES', 'SRI Ecuador'],
    },
    github: 'https://github.com/statick88/open-api-facturacion-sri',
  },
  {
    name: 'exploitarium',
    description: {
      es: 'Colección de PoCs de explotación para CVEs',
      en: 'Exploitation PoC collection for CVEs',
    },
    highlights: {
      es: ['Python', 'Exploit Development', 'CVE'],
      en: ['Python', 'Exploit Development', 'CVE'],
    },
    github: 'https://github.com/statick88/exploitarium',
  },
  {
    name: 'cybervault',
    description: {
      es: 'Repositorio de seguridad y auditoría',
      en: 'Security and audit repository',
    },
    highlights: {
      es: ['Python', 'Security'],
      en: ['Python', 'Security'],
    },
    github: 'https://github.com/statick88/cybervault',
  },
  {
    name: 'cv-diego',
    description: {
      es: 'CV digital interactivo',
      en: 'Interactive digital CV',
    },
    highlights: {
      es: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
      en: ['React', 'Vite', 'TypeScript', 'Tailwind CSS'],
    },
    github: 'https://github.com/statick88/statick88.github.io',
  },
  {
    name: 'ctf-evilsec-2026',
    description: {
      es: 'Writeups reproducibles del CTF de EvilSec (Ekoparty 2026): 15 de 22 retos resueltos y 3550 puntos, con un script por reto que devuelve la flag y una auditoria contra el scoreboard del evento. Tercer puesto.',
      en: 'Reproducible writeups from the EvilSec CTF (Ekoparty 2026): 15 of 22 challenges solved and 3,550 points, with a script per challenge that returns the flag and an audit against the event scoreboard. Third place in the event.',
    },
    highlights: {
      es: ['CTF', 'Writeups', '15/22 retos', '3550 puntos', '3.er puesto'],
      en: ['CTF', 'Writeups', '15/22 challenges', '3,550 points', '3rd place'],
    },
    github: 'https://github.com/statick88/ctf-evilsec-2026',
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
  { name: 'Introduction to Cybersecurity', issuer: 'Cisco Networking Academy', status: 'active' },
  { name: 'Introduction to IoT', issuer: 'Cisco Networking Academy', status: 'active' },
  { name: 'Hack The Box Certificate', issuer: 'Hack The Box', status: 'active' },
  { name: 'Course of Cybersecurity (NIST CSF 2.0)', issuer: 'Self-published', status: 'active' },
  { name: 'Ethical Hacking 2026 (Ebook + Labs)', issuer: 'Self-published', status: 'active' },
  { name: 'Dark Web Course', issuer: 'Self-published', status: 'active' },
  { name: 'Docker Fundamentals + Docker Course', issuer: 'Platzi', status: 'active' },
  { name: 'Flutter Course + Flutter Avanzado', issuer: 'Platzi', status: 'active' },
  { name: 'Python Course + Python Practico + Python CS', issuer: 'Platzi', status: 'active' },
  { name: 'Django Course', issuer: 'Platzi', status: 'active' },
  { name: 'AWS Fundamentals', issuer: 'Platzi', status: 'active' },
  { name: 'AI for Developers + AI Course', issuer: 'Platzi', status: 'active' },
  { name: 'Git & GitHub Course', issuer: 'Platzi', status: 'active' },
  { name: 'Linux Fundamentals + Linux Course', issuer: 'Platzi', status: 'active' },
  { name: 'Backend con Node.js', issuer: 'Platzi', status: 'active' },
  { name: 'React Native Course', issuer: 'Codigo Facilito', status: 'active' },
  { name: 'Curso Profesional de Python', issuer: 'Codigo Facilito', status: 'active' },
  { name: 'Curso de Machine Learning', issuer: 'Codigo Facilito', status: 'active' },
  { name: 'Curso de CSS', issuer: 'Codigo Facilito', status: 'active' },
  { name: 'Taller de Next.js', issuer: 'Codigo Facilito', status: 'active' },
  { name: 'Ciberseguridad Defensiva', issuer: 'ABACOM', status: 'active' },
  { name: 'Ingeniería Inversa', issuer: 'ABACOM', status: 'active' },
  { name: 'Redes y Servidores Linux', issuer: 'ABACOM', status: 'active' },
  { name: 'Desarrollo Web Full Stack (Django + React)', issuer: 'Codings Academy', status: 'active' },
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
    value: '410',
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
  ctfEvilsecRetos: {
    value: '15 / 22',
    unit: 'retos',
    label_es: 'Retos resueltos en el CTF de EvilSec (Ekoparty 2026)',
    label_en: 'Challenges solved at the EvilSec CTF (Ekoparty 2026)',
    source: 'github.com/statick88/ctf-evilsec-2026 (auditado contra el scoreboard)',
  },
  ctfEvilsecPuesto: {
    value: '3.er',
    unit: 'puesto',
    label_es: 'CTF de EvilSec (Ekoparty 2026), 3550 puntos',
    label_en: 'EvilSec CTF (Ekoparty 2026), 3,550 points',
    source: 'Correo de la organizacion del evento, 2026-10-19',
  },
}

// ── Services ─────────────────────────────────────────────────────

export const services: readonly Service[] = [
  {
    id: 'fullstack',
    icon: 'code',
    title: { es: 'Desarrollo FullStack', en: 'FullStack Development' },
    description: {
      es: 'Aplicaciones web y móviles de producción con arquitectura sólida, pruebas y documentación. React, Next.js, Flutter, Node.js, Python, PostgreSQL.',
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
      es: 'Pentesting de aplicaciones web y móviles. Identificación de vulnerabilidades OWASP Top 10, reportes con CVSS scoring y recomendaciones de remediación.',
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
      es: 'CTO Fractional: arquitectura de software, revisión de código, mentoría de equipos y toma de decisiones técnicas estratégicas.',
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
      es: 'Cursos personalizados de Python, Hacking Ético, Ciberseguridad y desarrollo de software. Trece años de docencia continua desde 2013 en seis instituciones, entre ellas ESPE, UIDE y ABACOM.',
      en: 'Custom courses in Python, Ethical Hacking, Cybersecurity, and software development. Thirteen continuous years of teaching since 2013 across six institutions, including ESPE, UIDE and ABACOM.',
    },
    formats: { es: ['Por hora', 'Por curso', 'Workshop'], en: ['Hourly', 'Per course', 'Workshop'] },
    priceRange: '$30-60/hora',
    color: '#10b981',
  },
]

// ── Practice (organization) ────────────────────────────────────────────
// Un bloque, tres espejos (TS/JS/YAML): lo emite patch_practice_cv.py.
export const practice = {
  "title": {
    "es": "Consultoría de Seguridad y Software",
    "en": "Security & Software Consulting"
  },
  "positioning": {
    "es": "Práctica independiente de seguridad y software: auditoría autorizada de aplicaciones, desarrollo de productos y formación técnica. 13 años de docencia continua en seis instituciones, 22 cursos propios publicados, 134+ certificaciones activas y 400+ repositorios públicos.",
    "en": "Independent security and software practice: authorized application auditing, product development, and technical training. 13 continuous years of teaching across six institutions, 22 published own courses, 134+ active certifications, and 400+ public repositories."
  },
  "serviceIds": [
    "fullstack",
    "security",
    "consulting",
    "training"
  ],
  "toolNames": [
    "MindLedger",
    "course-of-cybersecurity",
    "desarrollo-software-seguro",
    "cyber-guardians",
    "Course_of_python",
    "jarvis-os"
  ],
  "training": {
    "courses": 22,
    "hours": 200,
    "students": 92,
    "averageScore": 93.4,
    "institutions": 6
  },
  "engagements": [
    {
      "period": "Oct 2026",
      "sector": {
        "es": "E-commerce con cliente 3D (nombre bajo acuerdo de confidencialidad)",
        "en": "E-commerce with a 3D client (name withheld under a confidentiality agreement)"
      },
      "scope": {
        "es": "Pentest autorizado en producción, con carta de autorización firmada y ventana de 2 días",
        "en": "Authorized production pentest, with a signed authorization letter and a 2-day window"
      },
      "outcome": {
        "es": "109 subdominios inventariados, matriz de 15 CVE verificadas, 6 cadenas de adversario y plan de remediación",
        "en": "109 subdomains inventoried, a matrix of 15 verified CVEs, 6 adversary chains, and a remediation plan"
      }
    },
    {
      "period": "Jul 2026",
      "sector": {
        "es": "Aplicación web con gestión de agendas",
        "en": "Web application with scheduling management"
      },
      "scope": {
        "es": "Prueba de seguridad sobre hallazgos funcionales, previa autorización del cliente",
        "en": "Security test over functional findings, with the client's prior authorization"
      },
      "outcome": {
        "es": "Hallazgos adjuntos y priorizados con severidad y remediación",
        "en": "Findings attached and prioritized with severity and remediation"
      }
    },
    {
      "period": "Sep 2025",
      "sector": {
        "es": "Proyecto web (nombre bajo acuerdo de confidencialidad)",
        "en": "Web project (name withheld under a confidentiality agreement)"
      },
      "scope": {
        "es": "Carta de autorización previa, con alcance y ventana acordados antes de ejecutar",
        "en": "Prior authorization letter, with scope and window agreed before execution"
      },
      "outcome": {
        "es": "Ejecución dentro del alcance firmado, sin tocar activos de terceros",
        "en": "Execution within the signed scope, without touching third-party assets"
      }
    }
  ],
  "referenceNames": [
    "ESPE - Universidad de las Fuerzas Armadas",
    "UIDE - Universidad Internacional del Ecuador (Ext. Loja)",
    "ABACOM",
    "Codings Academy",
    "Instituto Superior Tecnológico Juan Montalvo",
    "APC - Antonio Peña Celi"
  ]
} as const

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
      es: 'Desarrollador Full Stack con 10+ años de experiencia en aplicaciones web, móviles y APIs. Dominio de React, Next.js, Python/Django, Node.js, Flutter. Más de 400 repos públicos en GitHub. Apasionado por Clean Architecture, SOLID y TDD.',
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
    pdf: '/cv-developer-es.pdf',
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
    pdf: '/cv-hacker-es.pdf',
  },

  research: {
    id: 'research',
    label: { es: 'Investigador | MSc Ciberseguridad UCM', en: 'Researcher | MSc Cybersecurity UCM' },
    color: '#f59e0b',
    icon: '🔬',
    summary: {
      es: 'Investigador en ciberseguridad y machine learning. MSc en Ciberseguridad UCM (en curso, 2026-2027). Magíster en Cs. y Tec. de la Computación (UTPL 2021). 55 notebooks y 898 fuentes en NotebookLM. Interesado en threat modeling, pentesting y AI security.',
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
    pdf: '/cv-research-es.pdf',
  },

  'docente-facilitador': {
    id: 'docente-facilitador',
    label: { es: 'Docente Facilitador | Generador de Currículos ABP', en: 'Teaching Facilitator | ABP Curriculum Generator' },
    color: '#10b981',
    icon: '📚',
    summary: {
      es: 'Docente Facilitador que genera currículos ABP/ADDIE para cursos de Python, Flutter, R, Linux, Ethical Hacking e IA. 6+ años de experiencia continua en educación superior (9 años como Profesor de Computación en APC). 200+ horas docentes en ABACOM, con la cohorte de Python 2026 (promedio 93.4/100).',
      en: 'Teaching Facilitator generating ABP/ADDIE curricula for Python, Flutter, R, Linux, Ethical Hacking, and AI courses. 6+ years continuous experience in higher education (9 years as Computer Science Teacher at APC). 200+ teaching hours at ABACOM, with the 2026 Python cohort averaging 93.4/100.',
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
    pdf: '/cv-docente-facilitador-es.pdf',
  },
}

// ── Barrel Export (Backwards Compatibility) ──────────────────────
// Permite: import { cvData } from '@/data/cv-data'
// Temporal — se eliminará cuando todos los consumidores migren a named imports.

// ── Variante de práctica (organización) ────────────────────────────────
// Hereda de 'hacker' (perfil de seguridad) y añade el bloque de práctica.
profileData.consultor = {
  ...profileData.hacker,
  id: 'consultor',
  label: {"es": "Consultor de Seguridad y Software | Security & Software Consultant", "en": "Security & Software Consultant | Consultor de Seguridad y Software"},
  summary: {"es": "Consultor independiente de seguridad y software. Auditorías autorizadas con carta firmada, productos propios de software y formación técnica en ciberseguridad. 22 cursos publicados, 134+ certificaciones y 3 encargos de pentest documentados.", "en": "Independent security and software consultant. Authorized audits with a signed letter, own software products, and technical training in cybersecurity. 22 published courses, 134+ certifications, and 3 documented pentest engagements."},
  pdf: '/cv-consultor-es.pdf',
  practice: true,
} as Profile

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
