'use client'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDeviceTier } from '@/hooks/use-device-tier'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

/**
 * CodeRain — Matrix-style falling code rain for GitHub section background
 *
 * Perf contract:
 *  • Drawn on offscreen canvas, composited as CSS background
 *  • Single rAF loop, pauses when tab is hidden (visibilitychange)
 *  • Tier 1: Not rendered (hidden on low-end)
 *  • Tier 2: Reduced column count (every 24px)
 *  • Tier 3: Full density (every 16px)
 *  • Fade trail uses fillRect with low alpha (no clearRect = persistent glow)
 */

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01234567890{}[]<>/\\|+-*&%$#@!'

export function CodeRain({
  className,
  opacity = 0.18,
}: {
  className?: string
  opacity?: number
}) {
  const tier = useDeviceTier()
  const palette = useCurrentPalette()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const paletteRef = useRef(palette)

  useEffect(() => { paletteRef.current = palette }, [palette])

  useEffect(() => {
    if (tier < 2) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colSize = tier >= 3 ? 16 : 24
    let cols = Math.floor(canvas.offsetWidth / colSize) || 80
    let drops = Array.from({ length: cols }, () => Math.random() * -100)

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      cols = Math.floor(canvas.width / colSize)
      drops = Array.from({ length: cols }, () => Math.random() * -100)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const draw = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(0,0,0,0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const p = paletteRef.current
      const fontSize = colSize - 2
      ctx.font = `${fontSize}px monospace`

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)]
        const x = i * colSize

        // Head char — bright
        ctx.fillStyle = p.threeC + 'ff'
        ctx.fillText(char, x, y * fontSize)

        // Trail char — dim
        if (y > 1) {
          ctx.fillStyle = p.threeA + '88'
          ctx.fillText(
            CHARS[Math.floor(Math.random() * CHARS.length)],
            x,
            (y - 1) * fontSize
          )
        }

        // Reset column randomly after it passes bottom
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    // Pause when tab hidden to save battery
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current)
      else draw()
    }
    document.addEventListener('visibilitychange', onVisibility)

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [tier])

  if (tier < 2) return null

  return (
    <motion.canvas
      ref={canvasRef}
      className={className ?? 'absolute inset-0 w-full h-full pointer-events-none'}
      initial={{ opacity: 0 }}
      whileInView={{ opacity }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 2.5, ease: 'easeOut' }}
      aria-hidden="true"
    />
  )
}
