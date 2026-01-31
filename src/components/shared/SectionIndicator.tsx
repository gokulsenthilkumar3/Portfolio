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
    handleScroll() // Initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={cn('fixed right-8 top-1/2 transform -translate-y-1/2 z-40', className)}>
      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.id} className="group">
            <button
              onClick={() => scrollToSection(section.id)}
              className="relative flex items-center justify-center"
            >
              <motion.div
                className={cn(
                  'w-3 h-3 rounded-full border-2 border-primary bg-background transition-all duration-300',
                  activeSection === section.id && 'bg-primary scale-125'
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                  {section.label}
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
