/**
 * src/config/navigation.ts — Single source of truth for the console navigation
 *
 * The CONSOLE shell groups every section of the CV the same way an OS settings
 * app groups its panes: a few labelled groups, each holding the sections that
 * belong to it. Sidebar, mobile drawer and scroll-spy all read from here, so
 * adding a section is a one-line change.
 *
 * Section ids are also the DOM ids of the panels rendered in the scene, so the
 * navigation can never point at a target that does not exist.
 */

export interface NavLabel {
  es: string
  en: string
}

export interface NavItemDef {
  id: string
  label: NavLabel
}

export interface NavGroupDef {
  id: string
  title: NavLabel
  items: NavItemDef[]
}

/** Canonical section ids — the DOM ids of the panels rendered in the scene. */
export const SECTION = {
  perfil: 'perfil',
  resumen: 'resumen',
  contacto: 'contacto',
  enlaces: 'enlaces',
  experiencia: 'experiencia',
  educacion: 'educacion',
  habilidades: 'habilidades',
  idiomas: 'idiomas',
  proyectos: 'proyectos',
  certificaciones: 'certificaciones',
  cursos: 'cursos',
  investigacion: 'investigacion',
  exploitarium: 'exploitarium',
  portes: 'portes',
  plugins: 'plugins',
} as const

export const NAV_GROUPS = [
  {
    id: 'identidad',
    title: { es: 'identidad', en: 'identity' },
    items: [
      { id: SECTION.perfil, label: { es: 'perfil', en: 'profile' } },
      { id: SECTION.resumen, label: { es: 'resumen', en: 'summary' } },
      { id: SECTION.contacto, label: { es: 'contacto', en: 'contact' } },
      { id: SECTION.enlaces, label: { es: 'enlaces', en: 'links' } },
    ],
  },
  {
    id: 'trayectoria',
    title: { es: 'trayectoria', en: 'career' },
    items: [
      { id: SECTION.experiencia, label: { es: 'experiencia', en: 'experience' } },
      { id: SECTION.educacion, label: { es: 'educación', en: 'education' } },
    ],
  },
  {
    id: 'stack',
    title: { es: 'stack', en: 'stack' },
    items: [
      { id: SECTION.habilidades, label: { es: 'habilidades', en: 'skills' } },
      { id: SECTION.idiomas, label: { es: 'idiomas', en: 'languages' } },
    ],
  },
  {
    id: 'portafolio',
    title: { es: 'portafolio', en: 'portfolio' },
    items: [
      { id: SECTION.proyectos, label: { es: 'proyectos', en: 'projects' } },
      { id: SECTION.certificaciones, label: { es: 'certificaciones', en: 'certifications' } },
      { id: SECTION.cursos, label: { es: 'cursos', en: 'courses' } },
      { id: SECTION.investigacion, label: { es: 'investigación', en: 'research' } },
      { id: SECTION.exploitarium, label: { es: 'exploitarium', en: 'exploitarium' } },
    ],
  },
  {
    id: 'contribuciones',
    title: { es: 'contribuciones', en: 'contributions' },
    items: [
      { id: SECTION.portes, label: { es: 'portes', en: 'ports' } },
      { id: SECTION.plugins, label: { es: 'plugins', en: 'plugins' } },
    ],
  },
] as const satisfies readonly NavGroupDef[]

export type NavGroup = (typeof NAV_GROUPS)[number]
export type NavItem = NavGroup['items'][number]
export type SectionId = NavItem['id']

/** Flat list of every section id, in navigation order. */
export const SECTION_IDS: SectionId[] = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => item.id),
)
