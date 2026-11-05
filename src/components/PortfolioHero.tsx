import PhotoCard from '@/components/left-column/PhotoCard'
import { useApp } from '@/context/AppContext'
import { useSectionModal } from '@/context/SectionModalContext'
import type { ContactInfo, ExecutiveProfile, SkillEntry } from '@/lib/schemas/cv-data'

interface PortfolioHeroProps {
  profile: ExecutiveProfile
  contact: ContactInfo
  skills: SkillEntry[]
}

const CORE_STACK = ['TypeScript', 'React', 'Node.js', 'Python', 'Docker']

export function PortfolioHero({ profile, contact, skills }: PortfolioHeroProps) {
  const { language, t } = useApp()
  const { openSection } = useSectionModal()
  const stack = CORE_STACK.filter((name) => skills.some((skill) => skill.name === name))
  const cvHref = language === 'es' ? '/cv-es.pdf' : '/cv-en.pdf'

  return (
    <header className="cv-portfolio-hero" data-testid="portfolio-hero">
      <p className="cv-hero-eyebrow">Statick <span>/</span> Developer</p>
      <div className="cv-photo-ring mx-auto mb-6 no-print">
        <PhotoCard photoUrl="/statick.png" name={profile.name} />
      </div>
      <h1 className="cv-document-name">{profile.name}</h1>
      <p className="cv-document-role">{t(profile.role.es, profile.role.en)}</p>
      <p className="cv-hero-intro">{t('Construyo software, investigo seguridad y comparto conocimiento.', 'I build software, research security and share knowledge.')}</p>
      <div className="cv-hero-contact">
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <span>{contact.location}</span>
        <span>{t('Disponible en remoto', 'Available remotely')}</span>
      </div>
      <div className="cv-hero-actions no-print">
        <button type="button" className="cv-primary-action" onClick={(event) => openSection('proyectos', event.currentTarget)}>
          {t('Explorar proyectos', 'Explore projects')} <span aria-hidden="true">↗</span>
        </button>
        <button type="button" className="cv-secondary-action" onClick={(event) => openSection('servicios', event.currentTarget)}>
          {t('Explorar servicios', 'Explore services')}
        </button>
        <a href={cvHref} download className="cv-secondary-action" aria-label={t('Descargar el CV en PDF', 'Download the CV as PDF')}>
          {t('Descargar CV', 'Download CV')}
        </a>
      </div>
      <div className="cv-core-stack" aria-label={t('Tecnologías principales', 'Core stack')}>
        {stack.map((name) => <span key={name}>{name}</span>)}
      </div>
    </header>
  )
}
