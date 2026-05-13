import { useMemo } from 'react'

export default function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 15}s`,
      animationDuration: `${15 + Math.random() * 10}s`,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.5 + 0.1
    }))
  }, [])

  return (
    <div className="particles">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            width: p.size,
            height: p.size,
            opacity: p.opacity
          }}
        />
      ))}
    </div>
  )
}