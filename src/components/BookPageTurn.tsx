import type { ReactNode } from 'react'
import './BookPageTurn.css'

export type BookTurnDirection = 'forward' | 'backward'

interface BookPageTurnProps {
  direction: BookTurnDirection
  front: ReactNode
  back: ReactNode
  underlay?: ReactNode
  onFinish: () => void
}

/** Decorative paper only: the manual's real record stays accessible underneath. */
export function BookPageTurn({ direction, front, back, underlay, onFinish }: BookPageTurnProps) {
  return (
    <div className="book-turn-layer no-print" data-testid="book-page-turn-layer" role="presentation" aria-hidden="true" {...{ inert: '' }}>
      {underlay ? <div className="manual-page book-turn-underlay">{underlay}</div> : null}
      <div
        className={`book-turn-sheet book-turn-${direction}`}
        data-testid="book-page-turn-sheet"
        data-direction={direction}
        onAnimationEnd={event => { if (event.target === event.currentTarget) onFinish() }}
      >
        <div className="manual-page book-turn-face book-turn-front">{front}</div>
        <div className="book-turn-face book-turn-back">{back}</div>
      </div>
    </div>
  )
}
