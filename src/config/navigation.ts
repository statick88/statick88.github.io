/**
 * src/config/navigation.ts — Single source of truth for the document sections
 *
 * The CV is one document: the identity column holds the profile, the contact
 * details, the facts and the levels; everything else is a section of the
 * document column. This config lists those document sections, and each id is
 * also the DOM id of its section, so a link can never point at a missing
 * anchor.
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

/** Canonical section ids — the DOM ids of the document sections. */
export const SECTION = {
  resumen: 'resumen',
  servicios: 'servicios',
  encargos: 'encargos',
  referencias: 'referencias',
  experiencia: 'experiencia',
  educacion: 'educacion',
  habilidades: 'habilidades',
  proyectos: 'proyectos',
  certificaciones: 'certificaciones',
  cursos: 'cursos',
  investigacion: 'investigacion',
  exploitarium: 'exploitarium',
  aportes: 'aportes',
  plugins: 'plugins',
} as const

export const NAV_GROUPS = [
  {
    id: 'curriculum',
    title: { es: 'currículum', en: 'curriculum' },
    items: [
      { id: SECTION.resumen, label: { es: 'resumen', en: 'summary' } },
      { id: SECTION.servicios, label: { es: 'servicios', en: 'services' } },
      { id: SECTION.encargos, label: { es: 'encargos', en: 'engagements' } },
      { id: SECTION.referencias, label: { es: 'referencias', en: 'references' } },
      { id: SECTION.experiencia, label: { es: 'experiencia', en: 'experience' } },
      { id: SECTION.educacion, label: { es: 'educación', en: 'education' } },
      { id: SECTION.habilidades, label: { es: 'habilidades', en: 'skills' } },
      { id: SECTION.proyectos, label: { es: 'proyectos', en: 'projects' } },
      { id: SECTION.certificaciones, label: { es: 'certificaciones', en: 'certifications' } },
      { id: SECTION.cursos, label: { es: 'cursos', en: 'courses' } },
      { id: SECTION.investigacion, label: { es: 'investigación', en: 'research' } },
      { id: SECTION.exploitarium, label: { es: 'exploitarium', en: 'exploitarium' } },
      { id: SECTION.aportes, label: { es: 'aportes', en: 'contributions' } },
      { id: SECTION.plugins, label: { es: 'plugins', en: 'plugins' } },
    ],
  },
] as const satisfies readonly NavGroupDef[]

export type NavGroup = (typeof NAV_GROUPS)[number]
export type NavItem = NavGroup['items'][number]
export type SectionId = NavItem['id']

/** Flat list of every section id, in document order. */
export const SECTION_IDS: SectionId[] = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => item.id),
)
