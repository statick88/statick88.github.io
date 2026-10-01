/**
 * src/components/Reveal.tsx — scroll reveal with stagger.
 *
 * Timing constants mirror the CSS `[data-reveal]` pattern in src/index.css
 * (0.64s, cubic-bezier(0.2, 0.7, 0.2, 1), 90ms stagger) so both reveal paths
 * behave identically.
 *
 * Accessibility: `useReducedMotion()` is the contract. When the user has asked
 * for reduced motion the component renders a plain, static wrapper — no opacity
 * animation, no transform, no transition, no `whileInView` observer work. The
 * content is fully visible on first paint. This is a full collapse, not a
 * shortened animation.
 */

import { useReducedMotion } from 'framer-motion'
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/** Travel distance in px before reveal. */
const DISTANCE = 18
/** Reveal duration in seconds. */
const DURATION = 0.64
/** Delay between consecutive reveals, in seconds. */
const STAGGER = 0.09
/** cubic-bezier(0.2, 0.7, 0.2, 1) as a framer-motion easing tuple. */
const EASE: [number, number, number, number] = [0.2, 0.7, 0.2, 1]

interface RevealProps {
  children: ReactNode
  /** Stagger index. Each step adds 90ms. */
  step?: number
  className?: string
  /** Fraction of the element that must be visible before revealing. */
  amount?: number
}

export function Reveal({
  children,
  step = 0,
  className,
  amount = 0.2,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()

  // Collapse completely: render the content as-is, with nothing to animate.
  // `useReducedMotion` returns null before the media query resolves, so only an
  // explicit `true` takes this branch.
  if (prefersReducedMotion === true) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: DISTANCE }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION, ease: EASE, delay: step * STAGGER }}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
