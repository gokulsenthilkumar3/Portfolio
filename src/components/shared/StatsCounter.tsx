'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: number
  suffix?: string
  duration?: number
}

interface StatsCounterProps {
  stats: Stat[]
  className?: string
}

/**
 * Animated stats counter.
 * - Replaces setInterval (16ms) with requestAnimationFrame — frame-perfect,
 *   no timer drift, auto-pauses in background tabs.
 * - Single IntersectionObserver per mount, disconnected after trigger.
 * - Respects prefers-reduced-motion (shows final values immediately).
 */
export const StatsCounter = memo(function StatsCounter({ stats, className }: StatsCounterProps) {
  const [counters, setCounters]   = useState<number[]>(stats.map(() => 0))
  const [started, setStarted]     = useState(false)
  const containerRef              = useRef<HTMLDivElement>(null)
  const rafIds                    = useRef<number[]>([])

  // Kick off when the element enters viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setCounters(stats.map(s => s.value))
      return
    }

    rafIds.current = stats.map((stat, i) => {
      const duration  = stat.duration ?? 2000
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed  = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease-out cubic
        const eased    = 1 - Math.pow(1 - progress, 3)
        const current  = eased * stat.value

        setCounters(prev => {
          const next = [...prev]
          next[i] = current
          return next
        })

        if (progress < 1) rafIds.current[i] = requestAnimationFrame(animate)
      }

      return requestAnimationFrame(animate)
    })

    return () => rafIds.current.forEach(id => cancelAnimationFrame(id))
  }, [started, stats])

  return (
    <div ref={containerRef} className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-center rounded-2xl border border-white/8 bg-white/3 backdrop-blur-xl p-6"
          >
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2 tabular-nums">
              {Math.floor(counters[i])}{stat.suffix ?? ''}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
})
