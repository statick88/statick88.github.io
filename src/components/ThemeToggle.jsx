import { motion } from 'framer-motion'

export default function ThemeToggle({ theme, setTheme }) {
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <motion.button
      onClick={toggleTheme}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleTheme()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Switch to dark mode'}
      className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-200 overflow-hidden group"
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <motion.span
        animate={{ rotate: theme === 'dark' ? 0 : 180, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="inline-block text-lg"
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </motion.span>
      
      {/* Hover effect */}
      <span className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-colors duration-200" />
    </motion.button>
  )
}