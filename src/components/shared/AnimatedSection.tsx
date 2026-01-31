'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'scaleIn' | 'slideLeft' | 'slideRight'
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
  duration = 0.6,
  threshold = 0.1,
  once = true
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setIsVisible(true)
          if (once) {
            setHasAnimated(true)
          }
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false)
        }
      },
      { threshold }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, once, hasAnimated])

  const getAnimationVariants = () => {
    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 }
        }
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'slideDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        }
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        }
      case 'scaleIn':
        return {
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1 }
        }
      default:
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        }
    }
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <AnimatePresence>
        <motion.div
          variants={getAnimationVariants()}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
          exit="hidden"
          transition={{
            duration,
            delay,
            ease: 'easeOut'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
