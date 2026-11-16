import type { ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import { SYSTEM_SECTIONS } from '@/config/system-navigation'
export type { SystemSectionId } from '@/config/system-navigation'

interface SectionPagerProps {
  current: number
}

/** Explicit controls preserve normal scroll, wheel and native key behavior. */
export function SectionPager({ current }: SectionPagerProps) {
  const { t } = useApp()
  const section = SYSTEM_SECTIONS[current]
  const previous = SYSTEM_SECTIONS[current - 1]
  const next = SYSTEM_SECTIONS[current + 1]
  if (!section) return null

  const goTo = (destination: (typeof SYSTEM_SECTIONS)[number]) => {
    const target = document.getElementById(destination.id)
    const heading = document.getElementById(`systems-title-${destination.id}`)
    if (!target || !heading) return
    target.scrollIntoView({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth',
      block: 'start',
    })
    heading.focus({ preventScroll: true })
  }

  return (
    <div className="systems-pager no-print" aria-label={t('Controles de sección', 'Section controls')}>
      <span className="systems-pager-label">{t(section.label.es, section.label.en)}</span>
      <div className="systems-pager-controls">
        <button
          type="button"
          disabled={!previous}
          aria-label={previous ? t(`Ir a ${previous.label.es}`, `Go to ${previous.label.en}`) : t('Sección anterior no disponible', 'Previous section unavailable')}
          onClick={() => previous && goTo(previous)}
        >
          <span aria-hidden="true">↑</span>
        </button>
        <button
          type="button"
          disabled={!next}
          aria-label={next ? t(`Ir a ${next.label.es}`, `Go to ${next.label.en}`) : t('Sección siguiente no disponible', 'Next section unavailable')}
          onClick={() => next && goTo(next)}
        >
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  )
}

/** A named group, not another region: the 15 modal regions keep their identities. */
export function SystemSection({ current, children }: SectionPagerProps & { children: ReactNode }) {
  const { t } = useApp()
  const section = SYSTEM_SECTIONS[current]
  if (!section) return null
  const titleId = `systems-title-${section.id}`
  return (
    <div id={section.id} role="group" className="systems-section" aria-labelledby={titleId}>
      <header className={current === 0 ? 'sr-only no-print' : 'systems-section-heading no-print'}>
        <span aria-hidden="true">{String(current + 1).padStart(2, '0')}</span>
        <h2 id={titleId} tabIndex={-1}>{t(section.label.es, section.label.en)}</h2>
      </header>
      {children}
      <SectionPager current={current} />
    </div>
  )
}
