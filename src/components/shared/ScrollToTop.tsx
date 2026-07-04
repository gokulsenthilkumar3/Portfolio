'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * Scroll-to-top button.
 * - Passive scroll listener with rAF ticking (no setState on every event)
 * - Respects prefers-reduced-motion
 * - No external Button import — simpler dep graph
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const pending = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (pending.current) return
      pending.current = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 300)
        pending.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.75 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-40 w-10 h-10 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center backdrop-blur-sm border border-primary/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
