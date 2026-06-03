import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { courses } from '../data/courses'

function CourseModal({ course, onClose }) {
  if (!course) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={course.title}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-gradient-to-br from-gray-900 to-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 pb-4" style={{ borderBottom: `2px solid ${course.color}30` }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
            aria-label="Cerrar"
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <span
              className="text-4xl w-14 h-14 flex items-center justify-center rounded-xl shrink-0"
              style={{ backgroundColor: course.color + '20' }}
            >
              {course.icon}
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-white leading-tight">{course.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{course.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300 text-sm leading-relaxed">{course.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-medium rounded-full border"
                style={{
                  backgroundColor: course.color + '15',
                  borderColor: course.color + '40',
                  color: course.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500 text-xs block">Tipo</span>
              <span className="text-white font-medium">{course.type}</span>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <span className="text-gray-500 text-xs block">Herramienta</span>
              <span className="text-white font-medium">{course.tool}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200"
            style={{
              backgroundColor: course.color + '20',
              color: course.color,
              border: `1px solid ${course.color}40`,
            }}
          >
            🌐 Ver Curso
          </a>
          <a
            href={course.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 font-medium text-sm transition-all duration-200"
          >
            💻 Código
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Courses({ t }) {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [filter, setFilter] = useState('all')

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'Quarto', label: 'Quarto' },
    { id: 'book', label: 'Libros' },
    { id: 'labs', label: 'Labs' },
  ]

  const filteredCourses = courses.filter((c) => {
    if (filter === 'all') return true
    if (filter === 'book') return c.type === 'book'
    return c.tool === filter || c.type === filter
  })

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === f.id
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-500 self-center">
          {filteredCourses.length} cursos
        </span>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCourses.map((course, i) => (
          <motion.button
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedCourse(course)}
            className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <span
                className="text-2xl w-10 h-10 flex items-center justify-center rounded-lg shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: course.color + '20' }}
              >
                {course.icon}
              </span>
              <div className="min-w-0">
                <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors">
                  {course.title}
                </h4>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{course.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {course.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full border"
                      style={{
                        backgroundColor: course.color + '10',
                        borderColor: course.color + '30',
                        color: course.color,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
        )}
      </AnimatePresence>
    </>
  )
}
