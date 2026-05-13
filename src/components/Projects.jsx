import { motion } from 'framer-motion'

export default function Projects({ projects, t }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((project, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass rounded-xl p-5 hover-glow transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              {project.name}
            </h3>
            <span className="text-xs text-green-400">★</span>
          </div>

          <p className="text-gray-400 text-sm mb-3">
            {t(project.description.es, project.description.en)}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {project.highlights.es.map((tech, i) => (
              <span 
                key={i}
                className="px-2 py-1 bg-white/5 rounded text-xs text-gray-500"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            {project.url && (
              <a 
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Demo →
              </a>
            )}
            {project.github && (
              <a 
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                GitHub →
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}