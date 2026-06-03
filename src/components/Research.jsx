import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const publications = [
  {
    id: 'paper-tdah',
    title: 'Evaluación de Deep Learning para detectar TDAH y síndrome de Asperger en estudiantes universitarios',
    journal: 'Revista de Investigación Multidisiplinaria, Iberoamericana',
    year: '2024',
    author: 'Diego Medardo Saavedra García',
    pages: '1-10',
    citations: 1,
    type: 'article',
    url: 'https://scholar.google.com/citations?user=getKs_4AAAAJ&hl=es',
    tags: ['Deep Learning', 'TDAH', 'Asperger', 'Educación'],
    color: '#8b5cf6',
    description: 'Revisión de literatura sobre el uso de modelos de Deep Learning para la detección de TDAH y síndrome de Asperger en entornos educativos universitarios. Analiza metodologías, enfoques teóricos y resultados de estudios previos.'
  },
  {
    id: 'thesis-atencion',
    title: 'Modelo para detectar la atención de los estudiantes en un salón de clases basado en redes neuronales convolucionales',
    journal: 'Trabajo de Titulación — Magíster en Cs. y Tec. de la Computación, UTPL',
    year: '2021',
    author: 'Diego Medardo Saavedra García',
    pages: '',
    citations: 0,
    type: 'thesis',
    url: 'https://dspace.utpl.edu.ec/handle/20.500.11962/27635',
    tags: ['RNC', 'Visión Artificial', 'Atención', 'Educación'],
    color: '#06b6d4',
    description: 'Sistema de monitoreo de atención estudiantil usando Redes Neuronales Convolucionales (RNC) y visión artificial. Aprendizaje >90%, precisión de detección de atención 99.64%. Metodología SCRUM, 3000+ secuencias de video.'
  }
]

function PublicationCard({ pub, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ backgroundColor: `${pub.color}30`, color: pub.color }}
        >
          {pub.type === 'article' ? '📄' : '🎓'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight line-clamp-2">{pub.title}</h3>
          <p className="text-gray-400 text-xs mt-1">{pub.journal} · {pub.year}</p>
          {pub.citations > 0 && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] rounded-full">
              {pub.citations} citation{pub.citations !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function PublicationModal({ pub, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4" style={{ borderBottom: `2px solid ${pub.color}30` }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
              style={{ backgroundColor: `${pub.color}30`, color: pub.color }}
            >
              {pub.type === 'article' ? '📄' : '🎓'}
            </div>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: `${pub.color}50`, color: pub.color, backgroundColor: `${pub.color}10` }}>
                {pub.type === 'article' ? 'Artículo' : 'Tesis de Maestría'}
              </span>
            </div>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight">{pub.title}</h2>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">{pub.description}</p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <span>📰</span>
              <span>{pub.journal}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <span>📅</span>
              <span>{pub.year}</span>
            </div>
            {pub.pages && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>📖</span>
                <span>pp. {pub.pages}</span>
              </div>
            )}
            {pub.citations > 0 && (
              <div className="flex items-center gap-2 text-gray-400">
                <span>🔗</span>
                <span>{pub.citations} citation{pub.citations !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {pub.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 pt-2 flex gap-3">
          <a
            href={pub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2.5 rounded-lg font-medium text-sm transition-all"
            style={{ backgroundColor: `${pub.color}20`, color: pub.color, border: `1px solid ${pub.color}40` }}
          >
            {pub.type === 'article' ? 'Google Scholar' : 'Ver Repositorio'}
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-lg text-sm hover:text-white transition-all"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Research() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {publications.map((pub) => (
          <PublicationCard key={pub.id} pub={pub} onClick={() => setSelected(pub)} />
        ))}
      </div>

      <AnimatePresence>
        {selected && <PublicationModal pub={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  )
}
