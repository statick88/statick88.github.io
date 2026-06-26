// src/config/urls.ts — Centralized URL configuration
// Single source of truth for all external links to prevent drift across 4 consumers

export const URLS = {
  // Social & Profile
  linkedin: 'https://www.linkedin.com/in/diego-saavedra-developer/',
  github: 'https://github.com/statick88',
  portfolio: 'https://statick88.github.io',
  whatsapp: 'https://wa.me/593980192790',

  // Email & Contact
  email: 'dsaavedra88@gmail.com',
  phone: '+593 980192790',

  // Organization URLs
  abacom: 'https://abacom.edu.ec/',
  espe: 'https://www.espe.edu.ec',
  apc: 'https://apc.edu.ec/',
  codingsAcademy: 'https://codingsacademy.com',
  istjm: 'https://istjm.edu.ec/',
  uide: 'https://www.uide.edu.ec/',
  utpl: 'https://www.utpl.edu.ec/',
  unl: 'https://unl.edu.ec/',
  ucm: 'https://www.ucm.es/',

  // Project Repositories
  projects: {
    openApiFacturacionSri: 'https://github.com/statick88/open-api-facturacion-sri',
    multiAgentSystem: 'https://github.com/statick88/multi-agent-system',
    materialEducativoUnl: 'https://github.com/statick88/material-educativo-unl',
    ucmMoodlePentest: 'https://github.com/statick88/ucm-moodle-pentest',
    openwrtHardwareHacking: 'https://github.com/statick88/openwrt-hardware-hacking',
    ms08_067MetasploitDemo: 'https://github.com/statick88/ms08-067-metasploit-demo'
  },

  // Course URLs (from courses.js)
  courses: {
    darkWebCourse: 'https://statick88.github.io/dark-web-course/',
    courseOfCybersecurity: 'https://statick88.github.io/course-of-cybersecurity/',
    courseOfPython: 'https://statick88.github.io/Course_of_python/',
    courseOfFlutter: 'https://statick88.github.io/course-of-flutter/',
    ethicalHacking2026: 'https://statick88.github.io/ethical-hacking-2026/',
    micropythonCurso: 'https://statick88.github.io/micropython-curso/',
    administracionServidoresLinux: 'https://statick88.github.io/administracion-servidores-linux/',
    desarrolloSoftwareSeguro: 'https://statick88.github.io/desarrollo-software-seguro/',
    ironManEvolution: 'https://statick88.github.io/iron-man-evolution/',
    bootcampFullstack: 'https://statick88.github.io/bootcamp_fullstack/',
    bootcampDesarrolloMovilFlutter: 'https://statick88.github.io/bootcamp_desarrollo_movil_flutter/',
    diplomadoIa: 'https://statick88.github.io/diplomado_ia/',
    cursoNvim: 'https://statick88.github.io/curso_nvim/',
    tallerIaNoInformaticos: 'https://statick88.github.io/taller-ia-no-informaticos/',
    tallerIaPresentation: 'https://statick88.github.io/taller-ia-presentation/',
    charlaDrDoom: 'https://statick88.github.io/charla-dr-doom/',
    showroomDigitalInmobiliario: 'https://statick88.github.io/showroom-digital-inmobiliario/',
    nurburgringPredictor: 'https://statick88.github.io/nurburgring-predictor/',
    abacomGestion: 'https://statick88.github.io/abacom-gestion/',
    ethicalHackingLabs: 'https://statick88.github.io/ethical-hacking-labs/',
    challenges: 'https://statick88.github.io/challenges/',
    ebooks: 'https://statick88.github.io/ebooks/'
  },

  // Course Repositories
  courseRepos: {
    darkWebCourse: 'https://github.com/statick88/dark-web-course',
    courseOfCybersecurity: 'https://github.com/statick88/course-of-cybersecurity',
    courseOfPython: 'https://github.com/statick88/Course_of_python',
    courseOfFlutter: 'https://github.com/statick88/course-of-flutter',
    ethicalHacking2026: 'https://github.com/statick88/ethical-hacking-2026',
    micropythonCurso: 'https://github.com/statick88/micropython-curso',
    administracionServidoresLinux: 'https://github.com/statick88/administracion-servidores-linux',
    desarrolloSoftwareSeguro: 'https://github.com/statick88/desarrollo-software-seguro',
    ironManEvolution: 'https://github.com/statick88/iron-man-evolution',
    bootcampFullstack: 'https://github.com/statick88/bootcamp_fullstack',
    bootcampDesarrolloMovilFlutter: 'https://github.com/statick88/bootcamp_desarrollo_movil_flutter',
    diplomadoIa: 'https://github.com/statick88/diplomado_ia',
    cursoNvim: 'https://github.com/statick88/curso_nvim',
    tallerIaNoInformaticos: 'https://github.com/statick88/taller-ia-no-informaticos',
    tallerIaPresentation: 'https://github.com/statick88/taller-ia-presentation',
    charlaDrDoom: 'https://github.com/statick88/charla-dr-doom',
    showroomDigitalInmobiliario: 'https://github.com/statick88/showroom-digital-inmobiliario',
    nurburgringPredictor: 'https://github.com/statick88/nurburgring-predictor',
    abacomGestion: 'https://github.com/statick88/abacom-gestion',
    ethicalHackingLabs: 'https://github.com/statick88/ethical-hacking-labs',
    challenges: 'https://github.com/statick88/challenges',
    ebooks: 'https://github.com/statick88/ebooks'
  },

  // Assets
  assets: {
    profileImage: '/me.webp',
    favicon: '/assets/me-3BGiiQdZ-3BGiiQdZ.webp'
  },

  // Fonts
  fonts: {
    googleFonts: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap',
    fontsGstatic: 'https://fonts.gstatic.com'
  }
} as const

// Type helpers for URL validation
// Only include keys that have string values (exclude nested objects)
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

export type UrlKey = StringKeys<typeof URLS>
export type ProjectUrlKey = keyof typeof URLS.projects
export type CourseUrlKey = keyof typeof URLS.courses
export type CourseRepoKey = keyof typeof URLS.courseRepos

// Helper to get full URL with validation
export function getUrl(key: UrlKey): string {
  return URLS[key]
}

export function getProjectUrl(key: ProjectUrlKey): string {
  return URLS.projects[key]
}

export function getCourseUrl(key: CourseUrlKey): string {
  return URLS.courses[key]
}

export function getCourseRepo(key: CourseRepoKey): string {
  return URLS.courseRepos[key]
}