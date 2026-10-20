/**
 * src/components/panels/LevelBar.tsx — Proficiency bar
 *
 * The signature element of a printed curriculum: a label, its level and a bar
 * that shows where the level sits. Percentages are a reading of the level
 * names, not measurements.
 */

interface LevelBarProps {
  /** What the bar measures (skill name, language). */
  label: string
  /** Level as written in the data (e.g. "Experto", "C1"). */
  level: string
  /** Fill percentage, 0–100. */
  value: number
  /** Optional trailing element (ISO code, extra note). */
  trailing?: React.ReactNode
}

export function LevelBar({ label, level, value, trailing }: LevelBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))

  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-ct-text">{label}</span>
        <span className="mono text-[11px] text-ct-subtext-0">
          {level}
          {trailing ? ` · ${trailing}` : ''}
        </span>
      </div>
      <div
        className="cv-bar"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${level}`}
      >
        <span style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}
