/**
 * src/components/layout/TwoColumnLayout.tsx — Root 2-column executive CV layout
 *
 * CSS Grid layout: 30% left (aside) + 70% right (main).
 * Responsive: single column below 1024px, mobile stack below 640px.
 * Print: both columns visible, no break inside cards.
 *
 * @see T-009
 */

import type { ReactNode } from 'react'

interface TwoColumnLayoutProps {
  /** Left sidebar content (photo, contact, skills, etc.) */
  left: ReactNode
  /** Right main content (experience, education, etc.) */
  right: ReactNode
}

/**
 * Root 2-column layout for the executive CV.
 *
 * - `<aside>` holds the left sidebar (photo, contact, links, skills, languages, certs summary).
 * - `<main>` holds the right content area (profile, experience, education, projects, etc.).
 *
 * Print styles are injected via a `<style>` element to handle `@media print` rules
 * that Tailwind classes alone cannot express.
 */
export default function TwoColumnLayout({ left, right }: TwoColumnLayoutProps) {
  return (
    <>
      <style>{`
        @media print {
          .cv-two-column {
            grid-template-columns: 30% 70% !important;
          }
          .cv-two-column > * {
            break-inside: avoid;
          }
        }
      `}</style>

      <div
        className="cv-two-column grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[3fr_7fr] gap-6 lg:gap-8"
      >
        <aside className="space-y-4">
          {left}
        </aside>

        <main className="space-y-6">
          {right}
        </main>
      </div>
    </>
  )
}
