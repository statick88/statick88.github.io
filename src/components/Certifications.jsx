import { motion } from 'framer-motion'

export default function Certifications({ certifications, t }) {
  const getStatusColor = (status) => {
    if (status === 'active') return 'border-green-500/50 text-green-400'
    if (status === 'in-progress') return 'border-yellow-500/50 text-yellow-400'
    return 'border-gray-500/50 text-gray-400'
  }

  const getStatusLabel = (status) => {
    if (status === 'active') return t('Activa', 'Active')
    if (status === 'in-progress') return t('En Progreso', 'In Progress')
    return ''
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {certifications.map((cert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`glass rounded-xl p-4 border ${getStatusColor(cert.status)} hover-glow transition-all duration-300`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-white">{cert.name}</h3>
            {cert.status === 'in-progress' && (
              <span className="text-xs px-2 py-1 bg-yellow-500/20 rounded text-yellow-400">
                {getStatusLabel(cert.status)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">{cert.issuer}</p>
          {cert.status === 'active' && (
            <div className="mt-2 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-green-400">{getStatusLabel(cert.status)}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}