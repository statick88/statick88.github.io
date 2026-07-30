/**
 * src/components/left-column/PhotoCard.tsx — Avatar photo card
 *
 * Displays the profile photo with a rounded border and shadow.
 * Falls back to initials in a circle if the image fails to load.
 * Responsive sizing with max-w-xs on mobile.
 *
 * @see T-010
 */

import { useState } from 'react'

interface PhotoCardProps {
  /** Profile photo URL */
  photoUrl?: string
  /** Full name for alt text and initials fallback */
  name: string
}

/**
 * Get initials from a full name (max 2 characters).
 * e.g. "Diego Saavedra" → "DS"
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/**
 * PhotoCard — Avatar with border, shadow, and initials fallback.
 *
 * - Rounded avatar with `border-white/20` for WCAG AA contrast on dark backgrounds.
 * - On image error, shows initials in a styled circle.
 * - Print: hides the card border/shadow for cleaner output.
 */
export default function PhotoCard({ photoUrl, name }: PhotoCardProps) {
  const [imgError, setImgError] = useState(false)
  const showFallback = !photoUrl || imgError

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4 flex justify-center print:bg-transparent print:border-0 print:p-0">
      {showFallback ? (
        <div
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-blue-500/40 dark:border-blue-400/40 flex items-center justify-center bg-blue-500/10 dark:bg-blue-400/10"
          role="img"
          aria-label={name}
        >
          <span className="text-2xl sm:text-3xl font-bold text-blue-500 dark:text-blue-400 select-none">
            {getInitials(name)}
          </span>
        </div>
      ) : (
        <img
          src={photoUrl}
          alt={`Foto de ${name} / Photo of ${name}`}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 dark:border-white/20 object-cover shadow-lg"
          onError={() => setImgError(true)}
          loading="eager"
          fetchPriority="high"
        />
      )}
    </div>
  )
}
