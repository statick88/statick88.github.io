/**
 * src/components/left-column/PhotoCard.tsx — Portrait
 *
 * The portrait of the identity column. The circular frame and its ring live in
 * the layout (`.cv-photo-ring`), so this component only renders the image or
 * the initials fallback.
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
 * PhotoCard — Square portrait with an initials fallback.
 *
 * - Fills the circular frame given by the layout.
 * - On image error, shows initials in a mono tile.
 */
export default function PhotoCard({ photoUrl, name }: PhotoCardProps) {
  const [imgError, setImgError] = useState(false)
  const showFallback = !photoUrl || imgError

  if (showFallback) {
    return (
      <div
        className="flex h-full w-full items-center justify-center text-xl font-bold text-ct-accent-bright"
        role="img"
        aria-label={name}
      >
        {getInitials(name)}
      </div>
    )
  }

  return (
    <img
      src={photoUrl}
      alt={name}
      className="h-full w-full object-cover"
      onError={() => setImgError(true)}
      loading="eager"
    />
  )
}
