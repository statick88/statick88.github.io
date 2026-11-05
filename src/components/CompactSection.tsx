import type { ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import { SECTION_IDS, type SectionId } from '@/config/navigation'

/** Editorial previews, not replacement CV data. Full panels remain in the DOM. */
const PREVIEWS: Record<SectionId, { es: string; en: string }> = {
  resumen: { es: 'Desarrollo de software, ciberseguridad y docencia. Conocé mi enfoque.', en: 'Software development, cybersecurity and teaching. Discover my approach.' },
  servicios: { es: 'Consultoría, desarrollo y formación. Encontrá cómo podemos trabajar juntos.', en: 'Consulting, development and training. Find out how we can work together.' },
  encargos: { es: 'Proyectos y colaboraciones: contexto, alcance y resultados.', en: 'Projects and collaborations: context, scope and outcomes.' },
  referencias: { es: 'La experiencia de quienes han trabajado conmigo.', en: 'The experience of people who have worked with me.' },
  eventos: { es: 'Charlas, talleres y encuentros con la comunidad.', en: 'Talks, workshops and community events.' },
  experiencia: { es: 'Roles, organizaciones y logros de mi recorrido profesional.', en: 'Roles, organizations and achievements throughout my career.' },
  educacion: { es: 'Formación académica y especialización.', en: 'Academic background and specialization.' },
  habilidades: { es: 'Tecnologías y competencias, organizadas por área.', en: 'Technologies and skills, organized by field.' },
  proyectos: { es: 'Una mirada al trabajo construido: repositorios, tecnologías y detalles.', en: 'A look at what I have built: repositories, technologies and details.' },
  certificaciones: { es: 'Credenciales y formación continua, con sus enlaces de verificación.', en: 'Credentials and continuing education, with verification links.' },
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

/** Native disclosure supports keyboard, find-in-page and independent sections. */
export function CompactSection({ id, 'aria-label': label, className = '', children }: CompactSectionProps) {
  const { t } = useApp()
  const preview = PREVIEWS[id]
  return (
    <section id={id} aria-label={label} className={`cv-section-card ${className}`}>
      <header className="cv-section-heading">
        <span className="cv-section-number" aria-hidden="true">
          {String(SECTION_IDS.indexOf(id) + 1).padStart(2, '0')}
        </span>
        <h2>{label}</h2>
      </header>
      <p className="cv-section-preview">{t(preview.es, preview.en)}</p>
      <details className="cv-section-disclosure" aria-label={t(`Contenido completo de ${label}`, `Full ${label}`)}>
        <summary aria-label={t(`Ver contenido completo de ${label}`, `Read full ${label}`)}>
          <span className="cv-disclosure-closed"><span aria-hidden="true">+</span>{' '}<span className="cv-disclosure-label">{t('Más', 'More')}</span></span>
          <span className="cv-disclosure-open"><span aria-hidden="true">−</span>{' '}<span className="cv-disclosure-label">{t('Menos', 'Less')}</span></span>
        </summary>
        <div className="cv-section-content">{children}</div>
      </details>
    </section>
  )
}
