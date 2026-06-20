'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface Section {
  id: string
  label: string
}

interface SectionIndicatorProps {
  sections: Section[]
  className?: string
}

export function SectionIndicator({ sections, className }: SectionIndicatorProps) {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={cn('fixed right-4 top-1/2 transform -translate-y-1/2 z-40', className)}>
      <div className="flex flex-col gap-3">
        {sections.map((section) => (
          <div key={section.id} className="group relative flex items-center justify-end">
            {/* Tooltip label */}
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="absolute right-8 bg-background/90 backdrop-blur-sm border border-border/60 text-xs px-2 py-1 rounded-md text-foreground whitespace-nowrap pointer-events-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {section.label}
            </motion.span>
            {/* Dot */}
            <button
              onClick={() => scrollToSection(section.id)}
              className="relative flex items-center justify-center w-5 h-5"
              aria-label={`Go to ${section.label}`}
            >
              <motion.div
                className={cn(
                  'rounded-full border-2 border-primary transition-all duration-300',
                  activeSection === section.id
                    ? 'w-4 h-4 bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]'
                    : 'w-2.5 h-2.5 bg-transparent hover:bg-primary/40'
                )}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
              />
              <div className={cn(
                "absolute right-6 top-1/2 transform -translate-y-1/2 transition-opacity duration-300 whitespace-nowrap pointer-events-none",
                activeSection === section.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}>
                <span className={cn(
                  "px-2 py-1 rounded text-xs transition-colors",
                  activeSection === section.id 
                    ? "bg-primary text-primary-foreground font-semibold" 
                    : "bg-background/80 text-foreground border border-border backdrop-blur-sm"
                )}>
                  {section.label}
                </span>
              </div>
              {/* GitHub specific - pulsing green dot */}
              {section.id === 'github' && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
