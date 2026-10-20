/**
 * src/components/ProfileHeader.tsx — Identity block (scene header)
 *
 * The first thing the reader sees: avatar, name, role and the two facts that
 * matter for a remote engagement (location, availability). It behaves like the
 * title block of an application window, not like a marketing hero.
 */

import { useApp } from '@/context/AppContext'
import PhotoCard from '@/components/left-column/PhotoCard'
import type { ContactInfo, ExecutiveProfile } from '@/lib/schemas/cv-data'

interface ProfileHeaderProps {
  profile: ExecutiveProfile
  contact: ContactInfo
  languagesSpoken: number
}

export default function ProfileHeader({
  profile,
  contact,
  languagesSpoken,
}: ProfileHeaderProps) {
  const { t } = useApp()

  return (
    <header className="flex items-start gap-4 print:gap-3">
      <PhotoCard photoUrl="/statick.png" name={profile.name} />

      <div className="min-w-0 flex-1">
        <h1 className="text-xl font-bold text-ct-text print:text-black">{profile.name}</h1>
        <p className="text-sm text-ct-accent-bright print:text-black">
          {t(profile.role.es, profile.role.en)}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <a href={`mailto:${contact.email}`} className="chip chip-accent hover:border-ct-accent">
            {contact.email}
          </a>
          <span className="chip chip-muted">{contact.location}</span>
          <span className="chip chip-muted">{t('100% remoto', '100% remote')}</span>
          <span className="chip chip-muted">
            {languagesSpoken} {t('idiomas', 'languages')}
          </span>
        </div>
      </div>
    </header>
  )
}
