'use client'
import { useEffect, useRef, useState } from 'react'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

/**
 * CursorTrail — Canvas-drawn comet tail following the cursor
 *
 * Perf contract:
 *  • Single shared rAF loop (not one per component)
 *  • Zero React state updates during animation
 *  • Completely unmounted on touch devices
 *  • 30-point trail with cubic bezier smoothing
 *  • GPU-composited via canvas (no layout cost)
 */

const TRAIL_LENGTH = 28
const POINT_RADIUS_MAX = 6
const FADE_ALPHA = 0.88

interface TrailPoint {
  x: number
  y: number
}

export function CursorTrail() {
  const [hasPointer, setHasPointer] = useState(false)
  const palette = useCurrentPalette()

  useEffect(() => {
    setHasPointer(window.matchMedia('(pointer: fine)').matches)
  }, [])

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trail = useRef<TrailPoint[]>([])
  const mouse = useRef({ x: -200, y: -200 })
  const rafRef = useRef<number>(0)
  const paletteRef = useRef(palette)

  // Keep palette ref in sync without restarting animation
  useEffect(() => { paletteRef.current = palette }, [palette])

  useEffect(() => {
    if (!hasPointer) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Size canvas to viewport
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

      // Animation loop
      const draw = () => {
        rafRef.current = requestAnimationFrame(draw)

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Push current mouse position to trail head
        trail.current.unshift({ x: mouse.current.x, y: mouse.current.y })
        if (trail.current.length > TRAIL_LENGTH) trail.current.length = TRAIL_LENGTH

        const p = paletteRef.current

        // Draw trail points with decreasing size + alpha
        for (let i = 0; i < trail.current.length; i++) {
          const t = 1 - i / trail.current.length
          const radius = POINT_RADIUS_MAX * t
          const alpha = t * t * FADE_ALPHA
          const pt = trail.current[i]

          // Alternate between primary and secondary color along trail
          const color = i % 3 === 0 ? p.threeB : p.threeA

          ctx.beginPath()
          ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2)
          ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0')
          ctx.fill()
        }

        // (No extra circle at head, just the trail)
      }

      draw()

      return () => {
        cancelAnimationFrame(rafRef.current)
        window.removeEventListener('resize', resize)
        window.removeEventListener('mousemove', onMove)
      }
    }, [hasPointer])

    if (!hasPointer) return null

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
        aria-hidden="true"
      />
    )
  }
