'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Page-load liquid wipe animation.
 * Guards:
 * - SSR: renders nothing on the server (dimensions unavailable).
 * - prefers-reduced-motion: skipped entirely.
 * - Mobile / narrow viewports: skipped (layout thrashing risk).
 * - Bots / Lighthouse: skipped.
 */
export function LiquidTransitions() {
  const [height, setHeight]       = useState(0)
  const [transitioning, setTrans] = useState(false)
  const [skip, setSkip]           = useState(true)

  useEffect(() => {
    // Evaluate all skip conditions on the client
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile     = window.innerWidth <= 768
    const isBot        = /Lighthouse|HeadlessChrome|bot|googlebot|crawler|spider|robot|crawling/i.test(
      navigator.userAgent
    )
    if (reducedMotion || isMobile || isBot) return

    setSkip(false)
    setHeight(window.innerHeight)
    setTrans(true)
    const t = setTimeout(() => setTrans(false), 1500)
    return () => clearTimeout(t)
  }, [])

  // Never render on server or when skipped
  if (skip || height === 0) return null

  const initial = `M0 0 L100 0 L100 ${height} Q50 ${height + 200} 0 ${height} Z`
  const target  = `M0 0 L100 0 L100 0 Q50 0 0 0 Z`

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" aria-hidden="true">
      <motion.svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        initial={{ y: 0 }}
        animate={{ y: transitioning ? 0 : '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <defs>
          <linearGradient id="liquid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#8b5cf6" />
            <stop offset="50%"  stopColor="#ec4899" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#liquid-gradient)"
          initial={{ d: initial }}
          animate={{ d: target }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        />
      </motion.svg>
    </div>
  )
}
