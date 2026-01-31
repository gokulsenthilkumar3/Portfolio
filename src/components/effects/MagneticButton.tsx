'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMousePosition } from '@/lib/hooks/use-mouse-position'
import { cn } from '@/lib/utils/cn'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  disabled?: boolean
}

export function MagneticButton({ 
  children, 
  className, 
  strength = 0.3,
  disabled = false 
}: MagneticButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mousePosition = useMousePosition()

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (mousePosition.x - centerX) * strength
    const deltaY = (mousePosition.y - centerY) * strength

    buttonRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
  }

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      buttonRef.current.style.transform = 'translate(0, 0)'
    }
    setIsHovered(false)
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        'relative transition-transform duration-300 ease-out',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
      {isHovered && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-primary/20 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.button>
  )
}
