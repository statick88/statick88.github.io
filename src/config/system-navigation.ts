import { SECTION } from './navigation'

/** Primary reading groups; legacy modal IDs and shortcuts remain unchanged. */
export const SYSTEM_SECTIONS = [
  { id: 'systems-inicio', label: { es: 'Inicio', en: 'Home' }, items: [SECTION.resumen, SECTION.servicios, SECTION.encargos] },
  { id: 'systems-trayectoria', label: { es: 'Trayectoria', en: 'Experience' }, items: [SECTION.experiencia, SECTION.referencias, SECTION.eventos] },
  { id: 'systems-proyectos', label: { es: 'Proyectos', en: 'Projects' }, items: [SECTION.proyectos, SECTION.habilidades, SECTION.aportes, SECTION.plugins] },
  { id: 'systems-exploitarium', label: { es: 'Exploitarium', en: 'Exploitarium' }, items: [SECTION.exploitarium] },
  { id: 'systems-academia', label: { es: 'Academia', en: 'Learning' }, items: [SECTION.educacion, SECTION.certificaciones, SECTION.cursos, SECTION.investigacion] },
  { id: 'systems-contacto', label: { es: 'Contacto', en: 'Contact' }, items: [] },
] as const

export type SystemSectionId = (typeof SYSTEM_SECTIONS)[number]['id']
