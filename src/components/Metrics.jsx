import { motion } from 'framer-motion'

const metricVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' }
  })
}

export default function Metrics({ metrics, t }) {
  if (!metrics) return null

  const items = [
    metrics.abacomCohorte2026,
    metrics.githubRepos,
    metrics.nlmNotebooks,
    metrics.certificationsCount
  ].filter(Boolean)

  return (
    <section
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      aria-label={t('Métricas verificadas', 'Verified metrics')}
    >
      {items.map((m, i) => (
        <motion.div
          key={i}
          custom={i}
          initial="hidden"
          animate="visible"
          variants={metricVariants}
          whileHover={{ scale: 1.03, y: -2 }}
          className="glass rounded-xl p-4 text-center hover-glow cursor-default"
          title={t('Fuente', 'Source') + ': ' + m.source}
        >
          <div className="text-2xl md:text-3xl font-bold gradient-text">
            {m.value}
            {m.unit && <span className="text-base opacity-60">{m.unit}</span>}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {t(m.label_es, m.label_en)}
          </div>
        </motion.div>
      ))}
    </section>
  )
}
