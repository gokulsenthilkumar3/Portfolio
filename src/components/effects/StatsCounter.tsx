'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Stat {
  label: string
  value: number
  suffix?: string
  duration?: number
}

export function StatsCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  )
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  useEffect(() => {
    if (!isInView) return
    
    let startTime: number
    const duration = stat.duration || 2000
    
    const animate = (time: number) => {
      if (!startTime) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)
      
      // Easing function: easeOutQuart
      const ease = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * stat.value))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, stat.value, stat.duration])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="p-6 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm text-center flex flex-col items-center justify-center hover:bg-card/60 transition-colors shadow-sm"
    >
      <div className="text-3xl sm:text-4xl font-bold font-display text-foreground flex items-baseline">
        {count}
        {stat.suffix && <span className="text-primary ml-1">{stat.suffix}</span>}
      </div>
      <div className="text-xs sm:text-sm text-muted-foreground mt-2 uppercase tracking-widest font-medium">
        {stat.label}
      </div>
    </motion.div>
  )
}
