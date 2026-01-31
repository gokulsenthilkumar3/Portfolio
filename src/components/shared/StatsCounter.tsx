'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'

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

export function StatsCounter({ stats, className }: StatsCounterProps) {
  const [counters, setCounters] = useState<number[]>(stats.map(() => 0))
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('stats-counter')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    const intervals = stats.map((stat, index) => {
      const duration = stat.duration || 2000
      const increment = stat.value / (duration / 16) // 60fps
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= stat.value) {
          current = stat.value
          setCounters(prev => {
            const newCounters = [...prev]
            newCounters[index] = current
            return newCounters
          })
          clearInterval(intervals[index])
        } else {
          setCounters(prev => {
            const newCounters = [...prev]
            newCounters[index] = current
            return newCounters
          })
        }
      }, 16)
    })

    return () => {
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [hasStarted, stats])

  return (
    <div id="stats-counter" className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {Math.floor(counters[index])}{stat.suffix || ''}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
