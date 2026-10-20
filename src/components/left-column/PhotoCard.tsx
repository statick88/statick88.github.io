/**
 * src/components/left-column/PhotoCard.tsx — Console avatar
 *
 * The avatar of the identity block: a square, hairline-bordered tile with the
 * initials as fallback. No glass, no glow — just a tile in the console grid.
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
 * PhotoCard — Square avatar tile with an initials fallback.
 *
 * - 1px hairline border in the console palette.
 * - On image error, shows initials in a mono tile.
 * - Print: drops the border for a cleaner document.
 */
export default function PhotoCard({ photoUrl, name }: PhotoCardProps) {
  const [imgError, setImgError] = useState(false)
  const showFallback = !photoUrl || imgError

  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded border border-ct-line bg-ct-surface-0 overflow-hidden print:border-0 print:bg-transparent">
      {showFallback ? (
        <div
          className="w-full h-full flex items-center justify-center text-ct-accent-bright text-2xl font-bold select-none"
          role="img"
          aria-label={name}
        >
          {getInitials(name)}
        </div>
      ) : (
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
          loading="eager"
        />
      )}
    </div>
  )
}
