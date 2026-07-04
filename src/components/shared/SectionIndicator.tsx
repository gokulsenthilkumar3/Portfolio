'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useThemeStore } from '@/lib/hooks/use-theme'

interface Section { id: string; label: string }
interface SectionIndicatorProps { sections: Section[]; className?: string }

/**
 * Section dot navigator.
 * Uses a single IntersectionObserver instead of a scroll event listener
 * — zero scroll-handler overhead, no forced layout reads.
 */
export function SectionIndicator({ sections, className }: SectionIndicatorProps) {
  const [active, setActive] = useState('')
  const { layout } = useThemeStore()

  useEffect(() => {
    if (!sections.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length) {
          const best = visible.reduce((a, b) => a.intersectionRatio >= b.intersectionRatio ? a : b)
          setActive(best.target.id)
        }
      },
      { threshold: 0.35 }
    )
    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [sections])

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  if (!layout.showIndicators) return null

  return (
    <nav
      aria-label="Page sections"
      className={cn('fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:block', className)}
    >
      <ol className="flex flex-col gap-3">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id} className="group relative flex items-center justify-end">
              <button
                onClick={() => scrollTo(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={isActive ? 'true' : undefined}
                className="relative flex items-center justify-center w-5 h-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
              >
                <motion.span
                  className={cn(
                    'block rounded-full border-2 border-primary transition-all duration-300',
                    isActive
                      ? 'w-4 h-4 bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]'
                      : 'w-2.5 h-2.5 bg-transparent hover:bg-primary/40'
                  )}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                />
                {/* Tooltip label */}
                <span
                  className={cn(
                    'absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none',
                    'px-2 py-0.5 rounded text-xs shadow-sm transition-all duration-200',
                    'opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0',
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold opacity-100 translate-x-0'
                      : 'bg-background/80 text-foreground border border-border backdrop-blur-sm'
                  )}
                >
                  {s.label}
                </span>
                {/* Live dot for GitHub section */}
                {s.id === 'github' && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
