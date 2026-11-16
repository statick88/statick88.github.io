import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useApp } from '@/context/AppContext'
import './LearningManual.css'
import { BookPageTurn, type BookTurnDirection } from '@/components/BookPageTurn'

interface ManualPage {
  id: string
  title: string
  content: ReactNode
}

interface LearningManualProps {
  title: string
  pages: ManualPage[]
  /** Opt-in decorative leaf; current record, focus and print state stay authoritative. */
  pageTurn?: boolean
}

interface TurnSnapshot {
  id: number
  from: number
  to: number
  direction: BookTurnDirection
}

/** A focused reader with a complete list/print view; no document-level key handlers. */
export function LearningManual({ title, pages, pageTurn = false }: LearningManualProps) {
  const { t } = useApp()
  const indexId = useId()
  const [page, setPage] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const [turn, setTurn] = useState<TurnSnapshot | null>(null)
  const turnId = useRef(0)
  const current = Math.min(page, Math.max(0, pages.length - 1))
  const finishTurn = (id: number) => setTurn(active => active?.id === id ? null : active)
  useEffect(() => {
    if (!turn) return
    // Closing a dialog can cancel its CSS animation without an animationend event.
    const timeout = window.setTimeout(() => finishTurn(turn.id), 750)
    return () => window.clearTimeout(timeout)
  }, [turn])
  const move = (next: number) => {
    const destination = Math.max(0, Math.min(next, pages.length - 1))
    if (destination === current) return
    const animate = pageTurn && !showAll && typeof window.matchMedia === 'function'
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setTurn(animate ? { id: ++turnId.current, from: current, to: destination, direction: destination > current ? 'forward' : 'backward' } : null)
    setPage(destination)
  }

  if (!pages.length) return <p>{t('No hay registros disponibles.', 'No records available.')}</p>

  const contents = <>
    <span className="manual-kicker">STATICK / {t('APRENDIZAJE', 'LEARNING')}</span>
    <h3>{title}</h3>
    <p>{t('Un registro por página. Explorá el índice o consultá la colección completa.', 'One record per page. Browse the index or read the complete collection.')}</p>
    <p className="manual-hint">{t('Con foco en el libro: ← → · Inicio · Fin', 'With focus on the book: ← → · Home · End')}</p>
  </>
  const snapshot = (index: number) => pages[index] ? <>
    <p className="manual-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</p>
    {pages[index]!.content}
  </> : null

  return (
    <div className={`learning-manual${showAll ? ' learning-manual-all' : ''}${pageTurn ? ' learning-manual-book' : ''}`} role="group" aria-label={title} tabIndex={0}
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
        <button type="button" className="cv-secondary-action" aria-pressed={showAll} onClick={() => { setTurn(null); setShowAll(!showAll) }}>
          {showAll ? t('Vista libro', 'Book view') : t('Ver todo', 'View all')}
        </button>
      </div>
      <div className="manual-spread">
        <div className="manual-contents no-print">{contents}</div>
        <div className="manual-pages">
          {pages.map((item, index) => (
            <article key={item.id} className="manual-page" aria-label={item.title} hidden={!showAll && index !== current}>
              <p className="manual-folio" aria-hidden="true">{String(index + 1).padStart(2, '0')} / {String(pages.length).padStart(2, '0')}</p>
              {item.content}
            </article>
          ))}
          {turn && !showAll && pages[turn.from] && pages[turn.to] ? <BookPageTurn
            key={turn.id}
            direction={turn.direction}
            front={snapshot(turn.direction === 'forward' ? turn.from : turn.to)}
            back={contents}
            underlay={turn.direction === 'backward' ? snapshot(turn.from) : null}
            onFinish={() => finishTurn(turn.id)}
          /> : null}
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
