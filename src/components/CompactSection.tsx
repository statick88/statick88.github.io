import { useEffect, useRef, type ReactNode } from 'react'
import { useSectionModal } from '@/context/SectionModalContext'
import { useApp } from '@/context/AppContext'
import { SECTION_IDS, type SectionId } from '@/config/navigation'

/** Editorial previews, not replacement CV data. Full panels remain in the DOM. */
const PREVIEWS: Record<SectionId, { es: string; en: string }> = {
  resumen: { es: 'Desarrollo de software, ciberseguridad y docencia; datos de contacto y perfil completo.', en: 'Software development, cybersecurity and teaching; contact details and full profile.' },
  servicios: { es: 'Consultoría, desarrollo y formación. Encontrá cómo podemos trabajar juntos.', en: 'Consulting, development and training. Find out how we can work together.' },
  encargos: { es: 'Proyectos y colaboraciones: contexto, alcance y resultados.', en: 'Projects and collaborations: context, scope and outcomes.' },
  referencias: { es: 'La experiencia de quienes han trabajado conmigo.', en: 'The experience of people who have worked with me.' },
  eventos: { es: 'Charlas, talleres y encuentros con la comunidad.', en: 'Talks, workshops and community events.' },
  experiencia: { es: 'Experiencia en Uteam, ESPE, ABACOM y formación técnica.', en: 'Experience across Uteam, ESPE, ABACOM and technical education.' },
  educacion: { es: 'Formación académica y especialización.', en: 'Academic background and specialization.' },
  habilidades: { es: 'TypeScript, React, Python, Docker y seguridad, organizados por área.', en: 'TypeScript, React, Python, Docker and security, organized by field.' },
  proyectos: { es: 'Cursos abiertos de Python y ciberseguridad, más aplicaciones publicadas.', en: 'Open Python and cybersecurity courses, plus published applications.' },
  certificaciones: { es: 'Formación de UNIR, ESPE, KodeKloud y Platzi con enlaces de verificación.', en: 'UNIR, ESPE, KodeKloud and Platzi education with verification links.' },
  cursos: { es: 'Recursos y cursos para aprender haciendo.', en: 'Resources and courses for hands-on learning.' },
  investigacion: { es: 'Publicaciones y líneas de investigación.', en: 'Publications and research interests.' },
  exploitarium: { es: 'Investigación de seguridad y documentación técnica.', en: 'Security research and technical documentation.' },
  aportes: { es: 'Contribuciones y participación en proyectos abiertos.', en: 'Contributions and participation in open projects.' },
  plugins: { es: 'Herramientas y extensiones para el entorno de desarrollo.', en: 'Tools and extensions for the development environment.' },
}

interface CompactSectionProps {
  id: SectionId
  'aria-label': string
  className?: string
  children: ReactNode
}

/** Native dialogs supply top-layer inertness and keyboard focus containment. */
export function CompactSection({ id, 'aria-label': label, className = '', children }: CompactSectionProps) {
  const { t } = useApp()
  const preview = PREVIEWS[id]
  const { activeSectionId, openSection, closeSection, printing } = useSectionModal()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (activeSectionId === id && !dialog.open) {
      dialog.showModal()
      closeRef.current?.focus()
    } else if (activeSectionId !== id && dialog.open) dialog.close()
  }, [activeSectionId, id])
  return (
    <section id={id} aria-label={label} className={`cv-section-card ${className}`}>
      <header className="cv-section-heading">
        <span className="cv-section-number" aria-hidden="true">
          {String(SECTION_IDS.indexOf(id) + 1).padStart(2, '0')}
        </span>
        <h2>{label}</h2>
      </header>
      <p className="cv-section-preview">{t(preview.es, preview.en)}</p>
      <button type="button" className="cv-section-trigger" aria-label={t(`Abrir ${label}`, `Open ${label}`)} aria-haspopup="dialog" aria-controls={`modal-${id}`} onClick={(event) => openSection(id, event.currentTarget)}>
        <span aria-hidden="true">+</span> <span className="cv-disclosure-label">{t('Más', 'More')}</span>
      </button>
      <dialog id={`modal-${id}`} className="cv-section-modal" ref={dialogRef} aria-labelledby={`modal-title-${id}`}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter((element) => element.getClientRects().length > 0)
          const first = controls[0]
          const last = controls[controls.length - 1]
          if (first && last && ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last))) {
            event.preventDefault()
            ;(event.shiftKey ? last : first).focus()
          }
        }}
        onCancel={(event) => { event.preventDefault(); closeSection() }}
        onClose={() => { if (!printing.current && !dialogRef.current?.open && activeSectionId === id) closeSection() }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect()
          if (event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeSection()
        }}>
        <header className="cv-modal-header">
          <div><span className="cv-modal-eyebrow">{t('Perfil profesional', 'Professional profile')}</span><h2 id={`modal-title-${id}`}>{label}</h2></div>
          <button ref={closeRef} type="button" className="cv-modal-close" aria-label={t(`Cerrar ${label}`, `Close ${label}`)} onClick={closeSection}><span aria-hidden="true">−</span></button>
        </header>
        <div className="cv-modal-body cv-section-content">{children}</div>
      </dialog>
    </section>
  )
}
