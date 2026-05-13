import { motion } from 'framer-motion'

export default function Timeline({ items, t, type }) {
  // Verificar si es estudio actual (fecha fin es futura o no existe)
  const isCurrentStudy = (endDate) => {
    if (!endDate) return false
    const end = new Date(endDate)
    const now = new Date()
    return end >= now
  }

  const formatDate = (start, end) => {
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : null
    
    const startYear = startDate.getFullYear()
    
    // Verificar si es estudio actual
    if (endDate && isCurrentStudy(end)) {
      return `${startYear} - ${t('Actual', 'Current')}`
    }
    
    const endYear = endDate ? endDate.getFullYear() : t('Actual', 'Current')
    return `${startYear} - ${endYear}`
  }

  // Helper para obtener el título según el tipo
  const getTitle = (item) => {
    if (type === 'work') {
      return t(item.position?.es, item.position?.en)
    } else {
      // Education puede tener area como string o objeto
      const areaValue = item.area?.es || item.area?.en || item.area || ''
      return areaValue
    }
  }

  // Helper para obtener el nombre (institution para education, name para work)
  const getName = (item) => {
    return item.institution || item.name || ''
  }

  // Helper para obtener la URL
  const getUrl = (item) => {
    return item.url || '#'
  }

  // Badge para tipo de estudio (Master, Bachelor, etc.)
  const getStudyBadge = (item) => {
    if (type !== 'work' && item.studyType) {
      const badges = {
        Master: { bg: 'bg-purple-500/20', border: 'border-purple-500/40', text: 'text-purple-400', label: 'Máster' },
        Bachelor: { bg: 'bg-blue-500/20', border: 'border-blue-500/40', text: 'text-blue-400', label: 'Licenciatura' },
        Doctor: { bg: 'bg-red-500/20', border: 'border-red-500/40', text: 'text-red-400', label: 'Doctorado' },
        Diploma: { bg: 'bg-green-500/20', border: 'border-green-500/40', text: 'text-green-400', label: 'Diplomado' },
        Certificate: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-400', label: 'Certificado' }
      }
      
      const badge = badges[item.studyType] || badges.Diploma
      return (
        <span className={`inline-block px-2.5 py-1 ${badge.bg} ${badge.border} border rounded-full text-xs font-medium ${badge.text}`}>
          {t(badge.label, item.studyType)}
        </span>
      )
    }
    return null
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 to-transparent"></div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative pl-12"
          >
            {/* Timeline dot */}
            <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-cyan-500/30 border-2 border-cyan-500"></div>

            <div className="glass rounded-xl p-4 hover-glow transition-all duration-300">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {getTitle(item)}
                </h3>
                <span className="text-sm text-cyan-400 font-mono whitespace-nowrap">
                  {formatDate(item.startDate, item.endDate)}
                </span>
              </div>

              <a 
                href={getUrl(item)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 transition-colors block truncate"
              >
                {getName(item)}
              </a>

              {/* Badge de tipo de estudio */}
              {getStudyBadge(item)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}