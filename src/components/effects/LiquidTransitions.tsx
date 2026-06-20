'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function LiquidTransitions() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dimensions, setDimensions] = useState({ height: 0 })

  useEffect(() => {
    // Disable transition on small screen sizes to prevent layout thrashing on load
    if (window.innerWidth <= 768) return

    setDimensions({ height: window.innerHeight })
    setIsTransitioning(true)
    const timeout = setTimeout(() => setIsTransitioning(false), 1500)
    return () => clearTimeout(timeout)
  }, [])

  if (dimensions.height === 0 || window.innerWidth <= 768) return null

  const initialPath = `M0 0 L100 0 L100 ${dimensions.height} Q50 ${dimensions.height + 200} 0 ${dimensions.height} Z`
  const targetPath = `M0 0 L100 0 L100 0 Q50 0 0 0 Z`

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <motion.svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox={`0 0 100 ${dimensions.height}`}
        preserveAspectRatio="none"
        initial={{ y: 0 }}
        animate={{ y: isTransitioning ? 0 : '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <motion.path
          fill="url(#liquid-gradient)"
          initial={{ d: initialPath }}
          animate={{ d: targetPath }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
        <defs>
          <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  )
}
