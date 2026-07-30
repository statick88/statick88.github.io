import { motion } from 'framer-motion'

export default function Section({ title, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 mb-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6 pb-2 border-b border-white/10">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}