import { motion } from 'framer-motion'

export default function LanguageToggle({ language, setLanguage }) {
  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  // Mostrar el idioma al que se va a cambiar (inverso del actual)
  const nextLanguage = language === 'es' ? 'EN' : 'ES'

  return (
    <motion.button
      onClick={toggleLanguage}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleLanguage()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
      className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200 overflow-hidden group"
      title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
    >
      <motion.span
        className="text-sm font-bold text-white font-mono relative z-10"
        animate={{ opacity: 1 }}
      >
        {nextLanguage}
      </motion.span>
      
      {/* Hover glow effect */}
      <span className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-200" />
    </motion.button>
  )
}