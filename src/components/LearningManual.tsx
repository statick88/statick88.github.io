import { useId, useState, type ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import './LearningManual.css'

interface ManualPage {
  id: string
  title: string
  content: ReactNode
}

interface LearningManualProps {
  title: string
  pages: ManualPage[]
}

/** A focused reader with a complete list/print view; no document-level key handlers. */
export function LearningManual({ title, pages }: LearningManualProps) {
  const { t } = useApp()
  const indexId = useId()
  const [page, setPage] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const current = Math.min(page, Math.max(0, pages.length - 1))
  const move = (next: number) => setPage(Math.max(0, Math.min(next, pages.length - 1)))

  if (!pages.length) return <p>{t('No hay registros disponibles.', 'No records available.')}</p>

  return (
    <div className={`learning-manual${showAll ? ' learning-manual-all' : ''}`} role="group" aria-label={title} tabIndex={0}
      onKeyDown={(event) => {
        // Preserve native link, select and button behavior (including the dialog's Tab/Escape).
        if (event.target !== event.currentTarget || showAll || event.altKey || event.ctrlKey || event.metaKey) return
        const destination = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: pages.length - 1 }[event.key]
        if (destination === undefined) return
        event.preventDefault()
        move(destination)
      }}>
      <div className="manual-toolbar no-print">
        <div>
          <label htmlFor={indexId}>{t('Ir a página', 'Go to page')}</label>
          <select id={indexId} value={current} disabled={showAll} onChange={(event) => move(Number(event.target.value))}>
            {pages.map((item, index) => <option key={item.id} value={index}>{index + 1}. {item.title}</option>)}
          </select>
        </div>
        <button type="button" className="cv-secondary-action" aria-pressed={showAll} onClick={() => setShowAll(!showAll)}>
          {showAll ? t('Vista libro', 'Book view') : t('Ver todo', 'View all')}
        </button>
      </div>
      <div className="manual-spread">
        <div className="manual-contents no-print">
          <span className="manual-kicker">STATICK / {t('APRENDIZAJE', 'LEARNING')}</span>
          <h3>{title}</h3>
          <p>{t('Un registro por página. Explorá el índice o consultá la colección completa.', 'One record per page. Browse the index or read the complete collection.')}</p>
          <p className="manual-hint">{t('Con foco en el libro: ← → · Inicio · Fin', 'With focus on the book: ← → · Home · End')}</p>
        </div>
        <div className="manual-pages">
          {pages.map((item, index) => (
            <article key={item.id} className="manual-page" aria-label={item.title} hidden={!showAll && index !== current}>
              <p className="manual-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</p>
              {item.content}
            </article>
          ))}
        </div>
      </div>
      <div className="manual-pagination no-print">
        <button type="button" className="cv-secondary-action" aria-label={t('Página anterior', 'Previous page')} disabled={showAll || current === 0} onClick={() => move(current - 1)}>← {t('Anterior', 'Previous')}</button>
        <p aria-live="polite" aria-atomic="true">
          {showAll ? t(`Todos los registros: ${pages.length}`, `All records: ${pages.length}`) : t(`Página ${current + 1} de ${pages.length}`, `Page ${current + 1} of ${pages.length}`)}
        </p>
        <button type="button" className="cv-secondary-action" aria-label={t('Página siguiente', 'Next page')} disabled={showAll || current === pages.length - 1} onClick={() => move(current + 1)}>{t('Siguiente', 'Next')} →</button>
      </div>
    </div>
  )
}
