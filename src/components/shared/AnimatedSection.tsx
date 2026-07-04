'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

type AnimationType = 'fadeIn' | 'slideUp' | 'slideDown' | 'scaleIn' | 'slideLeft' | 'slideRight'

const VARIANTS: Record<AnimationType, { hidden: object; visible: object }> = {
  fadeIn:     { hidden: { opacity: 0 },                 visible: { opacity: 1 } },
  slideUp:    { hidden: { opacity: 0, y: 40 },          visible: { opacity: 1, y: 0 } },
  slideDown:  { hidden: { opacity: 0, y: -40 },         visible: { opacity: 1, y: 0 } },
  slideLeft:  { hidden: { opacity: 0, x: 40 },          visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: -40 },         visible: { opacity: 1, x: 0 } },
  scaleIn:    { hidden: { opacity: 0, scale: 0.92 },    visible: { opacity: 1, scale: 1 } },
}

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
}

export function AnimatedSection({
  children,
  className,
  animation = 'slideUp',
  delay = 0,
  duration = 0.5,
  threshold = 0.08,
  once = true,
}: AnimatedSectionProps) {
  const [visible, setVisible] = useState(false)
  const [done, setDone]       = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Respect prefers-reduced-motion: skip animation, show immediately
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      setDone(true)
      return
    }

    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !done)) {
          setVisible(true)
          if (once) setDone(true)
        } else if (!once && !entry.isIntersecting) {
          setVisible(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once, done])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        variants={VARIANTS[animation]}
        initial="hidden"
        animate={visible ? 'visible' : 'hidden'}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        // Promote to GPU layer only while animating, then release
        style={{ willChange: visible && !done ? 'transform, opacity' : 'auto' }}
      >
        {children}
      </motion.div>
    </div>
  )
}
