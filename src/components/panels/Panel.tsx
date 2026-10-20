/**
 * src/components/panels/Panel.tsx — Console panel primitives
 *
 * The two building blocks every block of the CV is rendered with:
 *
 *   <Panel title="experiencia">        → a bordered "settings" pane
 *     <PanelRow label="empresa">…</PanelRow>
 *   </Panel>
 *
 * Both are plain presentational components: no data fetching, no ids. The
 * scene owns the section ids so a panel can never point at a missing anchor.
 */

import type { ReactNode } from 'react'

interface PanelProps {
  /** Panel title — rendered in the accent colour, uppercase, letterspaced. */
  title: string
  /** Optional right-aligned subtitle in the header. */
  subtitle?: string
  /** Extra classes for the panel container. */
  className?: string
  children: ReactNode
}

export function Panel({ title, subtitle, className = '', children }: PanelProps) {
  return (
    <div className={`panel ${className}`.trim()}>
      <div className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
      </div>
      <div className="panel-body">{children}</div>
    </div>
  )
}

interface PanelRowProps {
  /** Row label — muted, uppercase, mono. */
  label: string
  /** Extra classes for the row (e.g. a wide row for long labels). */
  className?: string
  /** Row value — primary text colour. */
  children: ReactNode
}

export function PanelRow({ label, className = '', children }: PanelRowProps) {
  return (
    <div className={`panel-row ${className}`.trim()}>
      <div className="panel-label">{label}</div>
      <div className="panel-value">{children}</div>
    </div>
  )
}
