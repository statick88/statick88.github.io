/**
 * src/components/sections/SummarySection.tsx — Professional summary
 *
 * Displays: profile badge, summary text, soft skills, languages.
 * Consumes data directly via useCVData.
 */

import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { useCVData, useProfileSummary } from '@/hooks/useCVData'
import type { ActiveProfile } from '@/hooks/useProfile'
import Section from '@/components/Section'

interface SummarySectionProps {
  activeProfile: ActiveProfile
}

export function SummarySection({ activeProfile }: SummarySectionProps) {
  const { language, t } = useApp()
  const softSkills = useCVData((d) => d.softSkills)
  const languages = useCVData((d) => d.languages)
  const summary = useProfileSummary(activeProfile.id)

  return (
    <div id="summary">
      <Section title={t('Resumen Profesional', 'Professional Summary')}>
        {/* Profile badge + PDF download */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: activeProfile.color + '20', color: activeProfile.color }}
          >
            {activeProfile.icon} {activeProfile.label}
          </span>
          <div className="flex gap-2">
            <a
              href={`/cv-${language === 'es' ? 'es' : 'en'}.pdf`}
              download={`CV_Diego_Saavedra_${language === 'es' ? 'ES' : 'EN'}.pdf`}
              className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-medium hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-200 flex items-center gap-1"
              aria-label={`Descargar CV en ${language === 'es' ? 'español' : 'english'}`}
            >
              📄 {language === 'es' ? 'Descargar CV' : 'Download CV'}
            </a>
          </div>
        </div>

        {/* Summary text */}
        <p className="text-gray-300 leading-relaxed text-lg">
          {t(summary.es, summary.en)}
        </p>

        {/* Soft Skills */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('Habilidades Blandas', 'Soft Skills')}
          </h3>
          <div className="flex flex-wrap gap-3">
            {softSkills.map((skill, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300"
              >
                {t(skill.es, skill.en)}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('Idiomas', 'Languages')}
          </h3>
          <div className="flex flex-wrap gap-6">
            {languages.map((lang, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-2xl">🌐</span>
                <div>
                  <p className="text-white font-medium">{lang.language}</p>
                  <p className="text-cyan-400 text-sm">{t(lang.fluency.es, lang.fluency.en)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
