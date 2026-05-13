import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const profiles = [
  { id: 'developer', icon: '💻', label: 'Developer', color: '#3b82f6', desc: 'Full Stack Engineer' },
  { id: 'hacker', icon: '🎯', label: 'Ethical Hacker', color: '#ef4444', desc: 'Pentester & Security' },
  { id: 'research', icon: '🔬', label: 'Research', color: '#f59e0b', desc: 'Academic Researcher' }
]

export default function ProfileSelector({ t, activeProfile, setActiveProfile }) {
  const [isOpen, setIsOpen] = useState(false)
  const [internalProfile, setInternalProfile] = useState(profiles[0])
  const dropdownRef = useRef(null)

  // Usar perfil interno si no se proporciona externo
  const currentProfile = activeProfile || internalProfile

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handler para seleccionar perfil
  const handleSelectProfile = (profile) => {
    if (setActiveProfile) {
      setActiveProfile(profile) // Actualizar en App
    } else {
      setInternalProfile(profile) // Actualizar internamente
    }
    setIsOpen(false)
  }

  return (
    <div className="fixed top-4 left-4 z-50" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Perfil activo: ${currentProfile.label}. Haga clic para cambiar.`}
          className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        >
          <span 
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg"
            style={{ backgroundColor: currentProfile.color + '30' }}
          >
            {currentProfile.icon}
          </span>
          <div className="text-left">
            <span className="text-white text-sm font-medium block">{currentProfile.label}</span>
            <span className="text-gray-500 text-xs">{currentProfile.desc}</span>
          </div>
          <motion.svg 
            className="w-4 h-4 text-gray-400"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-56 py-2 rounded-xl bg-[#050508]/98 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50"
              role="listbox"
              aria-label="Seleccionar perfil"
            >
              {profiles.map((profile, index) => (
                <button
                  key={profile.id}
                  onClick={() => handleSelectProfile(profile)}
                  role="option"
                  aria-selected={currentProfile.id === profile.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all cursor-pointer focus:outline-none focus:bg-white/10 ${
                    currentProfile.id === profile.id 
                      ? 'text-cyan-400 bg-cyan-400/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: profile.color + '30' }}
                  >
                    {profile.icon}
                  </span>
                  <div className="text-left flex-1">
                    <span className="font-medium block">{profile.label}</span>
                    <span className="text-gray-500 text-xs">{profile.desc}</span>
                  </div>
                  {currentProfile.id === profile.id && (
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}