import { motion } from 'framer-motion'

const levelColors = {
  master: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', label: 'Master' },
  advanced: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50', text: 'text-cyan-400', label: 'Advanced' },
  intermediate: { bg: 'bg-purple-500/20', border: 'border-purple-500/50', text: 'text-purple-400', label: 'Intermediate' }
}

export default function Skills({ skills }) {
  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill, index) => {
        const colors = levelColors[skill.level] || levelColors.intermediate
        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03 }}
            className={`px-4 py-2 ${colors.bg} ${colors.border} border rounded-lg text-sm font-medium ${colors.text} hover-glow cursor-default`}
          >
            {skill.name}
            <span className="ml-2 text-xs opacity-60">({colors.label})</span>
          </motion.span>
        )
      })}
    </div>
  )
}