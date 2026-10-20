/**
 * src/components/ProfileSelector.tsx — Active profile switcher (top bar chip)
 *
 * The CV is published under four profiles (Full Stack, Ethical Hacker,
 * Researcher, Facilitator Teacher). In the console shell the switcher lives in
 * the top bar as a chip that opens a menu, the same way a settings app lets
 * you pick a context.
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { useProfileContext } from '@/context/ProfileContext'

export interface ProfileOption {
  id: string
  label: string
  color: string
  desc: string
}

export const PROFILES: ProfileOption[] = [
  { id: 'developer', label: 'Full Stack', color: '#3575ea', desc: 'React / Node.js / Python' },
  { id: 'hacker', label: 'Hacker Ético', color: '#f2555a', desc: 'Pentest & RE' },
  { id: 'research', label: 'Investigador', color: '#e3b341', desc: 'MSc Ciberseguridad UCM' },
  {
    id: 'docente-facilitador',
    label: 'Docente Facilitador',
    color: '#3ecf8e',
    desc: 'ABP + ADDIE + cursos',
  },
]

export default function ProfileSelector() {
  const { t } = useApp()
  const { activeProfile, setActiveProfile } = useProfileContext()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const current = PROFILES.find((profile) => profile.id === activeProfile.id) ?? PROFILES[0]!

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t(
          `Perfil activo: ${current.label}. Cambiar de perfil.`,
          `Active profile: ${current.label}. Change profile.`,
        )}
        className="chip hover:border-ct-accent"
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: current.color }}
          aria-hidden="true"
        />
        <span className="text-ct-text">{current.label}</span>
        <svg
          className="w-3 h-3 text-ct-subtext-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1 w-64 rounded border border-ct-line bg-ct-panel shadow-lg shadow-black/40 z-50 overflow-hidden"
            role="listbox"
            aria-label={t('Seleccionar perfil', 'Select profile')}
          >
            {PROFILES.map((profile) => {
              const isSelected = current.id === profile.id
              return (
                <button
                  key={profile.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setActiveProfile({
                      id: profile.id,
                      label: profile.label,
                      color: profile.color,
                    })
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 flex items-start gap-3 text-xs transition-colors ${
                    isSelected
                      ? 'bg-ct-surface-1 text-ct-accent-bright'
                      : 'text-ct-text hover:bg-ct-surface-0'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full mt-1 shrink-0"
                    style={{ backgroundColor: profile.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block">{profile.label}</span>
                    <span className="block text-[11px] text-ct-subtext-0">{profile.desc}</span>
                  </span>
                  {isSelected && (
                    <span className="text-ct-accent-bright" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
