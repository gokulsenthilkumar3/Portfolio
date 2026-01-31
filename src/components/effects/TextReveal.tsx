'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface TextRevealProps {
  text: string
  className?: string
  delay?: number
  animation?: 'wave' | 'random' | 'sequential' | 'fade'
  duration?: number
  stagger?: number
  trigger?: boolean
}

export function TextReveal({
  text,
  className,
  delay = 0,
  animation = 'sequential',
  duration = 0.05,
  stagger = 0.03,
  trigger = true
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (trigger && !hasAnimated) {
      const timer = setTimeout(() => {
        setIsVisible(true)
        setHasAnimated(true)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [trigger, delay, hasAnimated])

  const getCharacterDelay = (index: number, total: number) => {
    switch (animation) {
      case 'wave':
        return Math.sin((index / total) * Math.PI) * stagger
      case 'random':
        return Math.random() * stagger * 2
      case 'sequential':
        return index * stagger
      case 'fade':
        return 0
      default:
        return index * stagger
    }
  }

  const getCharacterVariants = () => {
    return {
      hidden: {
        opacity: 0,
        y: animation === 'fade' ? 0 : 20,
        rotateX: animation === 'fade' ? 0 : 90
      },
      visible: {
        opacity: 1,
        y: 0,
        rotateX: 0
      }
    }
  }

  const words = text.split(' ')
  let charIndex = 0

  return (
    <span className={cn('inline-block', className)}>
      <AnimatePresence>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-1">
            {word.split('').map((char, charInWordIndex) => {
              const totalChars = text.replace(/\s/g, '').length
              const delay = getCharacterDelay(charIndex, totalChars)
              charIndex++

              return (
                <motion.span
                  key={`${wordIndex}-${charInWordIndex}`}
                  variants={getCharacterVariants()}
                  initial="hidden"
                  animate={isVisible ? 'visible' : 'hidden'}
                  exit="hidden"
                  transition={{ delay }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              )
            })}
          </span>
        ))}
      </AnimatePresence>
    </span>
  )
}
