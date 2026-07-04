'use client'
import { useEffect, useRef } from 'react'
import { useDeviceTier } from '@/hooks/use-device-tier'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

/**
 * GeometricGrid — animated dot/line grid for Skills section background
 *
 * Perf contract:
 *  • Offscreen canvas, composited as section background
 *  • Ripple effect driven by mouse position (not scroll)
 *  • Tier 1: Static CSS dot grid (background-image only, no canvas)
 *  • Tier 2: Canvas grid, no ripple
 *  • Tier 3: Canvas grid + mouse ripple waves
 */

export function GeometricGrid({ className }: { className?: string }) {
  const tier = useDeviceTier()
  const palette = useCurrentPalette()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef<number>(0)
  const paletteRef = useRef(palette)

  useEffect(() => { paletteRef.current = palette }, [palette])

  useEffect(() => {
    if (tier < 2) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const GRID = tier >= 3 ? 36 : 52
    let W = 0, H = 0

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    if (tier >= 3) canvas.addEventListener('mousemove', onMouse, { passive: true })

    let t = 0
    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      const p = paletteRef.current
      const mx = mouse.current.x
      const my = mouse.current.y
      const rippleRadius = 180

      const cols = Math.ceil(W / GRID) + 1
      const rows = Math.ceil(H / GRID) + 1

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * GRID
          const y = r * GRID

          // Distance from mouse for ripple
          const dx = x - mx
          const dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ripple = tier >= 3 && dist < rippleRadius
            ? Math.sin((dist / rippleRadius) * Math.PI * 2 - t * 3) * 0.5 + 0.5
            : 0

          const alpha = 0.12 + ripple * 0.3
          const dotR = 1.2 + ripple * 2.5

          ctx.beginPath()
          ctx.arc(x, y, dotR, 0, Math.PI * 2)
          ctx.fillStyle = p.threeA + Math.round(alpha * 255).toString(16).padStart(2, '0')
          ctx.fill()

          // Draw connecting lines to right and bottom neighbors
          if (c < cols - 1) {
            const lineAlpha = 0.06 + ripple * 0.12
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x + GRID, y)
            ctx.strokeStyle = p.threeA + Math.round(lineAlpha * 255).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
          if (r < rows - 1) {
            const lineAlpha = 0.06 + ripple * 0.12
            ctx.beginPath()
            ctx.moveTo(x, y)
            ctx.lineTo(x, y + GRID)
            ctx.strokeStyle = p.threeA + Math.round(lineAlpha * 255).toString(16).padStart(2, '0')
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      if (tier >= 3) canvas.removeEventListener('mousemove', onMouse)
    }
  }, [tier])

  // Tier 1: Pure CSS static grid
  if (tier < 2) {
    return (
      <div
        className={className ?? 'absolute inset-0 pointer-events-none'}
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--accent-primary) / 0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
        aria-hidden
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'absolute inset-0 w-full h-full pointer-events-none'}
      aria-hidden="true"
    />
  )
}
