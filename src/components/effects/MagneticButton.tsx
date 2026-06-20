'use client'

import React, { useState, useRef } from 'react'
import { motion, useSpring } from 'framer-motion'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()

  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative inline-block z-10 group',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="relative z-20">
        {children}
      </div>
      <motion.div
        className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-primary to-accent blur-md pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered && !disabled ? 0.5 : 0, 
          scale: isHovered && !disabled ? 1.1 : 0.8 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.div>
  )
}
