/**
 * src/components/sections/HeroSection.tsx — Hero section with basics
 *
 * Displays: avatar, name, title, location, email, phone, social profiles.
 * Consumes data directly via useCVData — zero props needed.
 */

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { useCVData } from '@/hooks/useCVData'

export function HeroSection() {
  const { t } = useApp()
  const basics = useCVData((d) => d.basics)

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center mb-12"
      id="hero"
    >
      {/* Avatar */}
      <div className="relative inline-block mb-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-cyan-500/30 neon-border"
        >
          <img src={basics.image} alt={basics.name} className="w-full h-full object-cover" fetchPriority="high" loading="eager" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900"
        />
      </div>

      {/* Name */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-white mb-3 gradient-text"
      >
        {basics.name}
      </motion.h1>

      {/* Title */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-400 mb-4"
      >
        {t(basics.label.es, basics.label.en)}
      </motion.p>

      {/* Contact info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-wrap justify-center gap-4 text-gray-500 mb-6"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {basics.location.city}, {basics.location.region}
        </span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {basics.email}
        </span>
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.716 3 6a11.04 11.04 0 015.516-5.516L10.283 3.79a1 1 0 01.502-1.21L15.121 2.05a1 1 0 01.949.684H19a2 2 0 012 2v1" />
          </svg>
          {basics.phone}
        </span>
      </motion.div>

      {/* Social links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center gap-3"
      >
        {basics.profiles.map((profile) => (
          <motion.a
            key={profile.network}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="min-h-[44px] px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 text-cyan-400 font-medium"
          >
            {profile.network}
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  )
}
