'use client'
/* eslint-disable react/forbid-dom-props */
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useDeviceTier } from '@/hooks/use-device-tier'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

/**
 * CommitGraph3D — Commits rendered as glowing orbs on a slowly rotating 3D sphere.
 *
 * Perf contract:
 *  • Single rAF loop, zero React state updates during animation
 *  • Tier-gated: hidden on tier < 2, reduced sphere count on tier 2
 *  • Pauses on visibilitychange
 *  • Canvas composited — no DOM thrash
 */

interface CommitGraph3DProps {
  contributions: Record<string, number>
  className?: string
  size?: number
}

function sphereProject(
  ax: number, ay: number, az: number,
  rot: number, tilt: number,
): { sx: number; sy: number; scale: number } {
  // Rotate around Y axis
  const cosR = Math.cos(rot)
  const sinR = Math.sin(rot)
  const rx = ax * cosR + az * sinR
  const rz = -ax * sinR + az * cosR

  // Tilt around X axis
  const cosT = Math.cos(tilt)
  const sinT = Math.sin(tilt)
  const ry = ay * cosT - rz * sinT
  const rz2 = ay * sinT + rz * cosT

  const fov = 2.8
  const scale = fov / (fov + rz2)
  return { sx: rx * scale, sy: ry * scale, scale }
}

export function CommitGraph3D({ contributions, className, size = 280 }: CommitGraph3DProps) {
  const tier = useDeviceTier()
  const palette = useCurrentPalette()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const paletteRef = useRef(palette)
  const rotRef = useRef(0)

  useEffect(() => { paletteRef.current = palette }, [palette])

  useEffect(() => {
    if (tier < 2) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Build commit point list from contributions map
    const entries = Object.entries(contributions)
    const maxCount = Math.max(1, ...entries.map(([, v]) => v))
    const limit = tier >= 3 ? 180 : 80

    // Distribute points using Fibonacci sphere algorithm for even coverage
    const points: { x: number; y: number; z: number; intensity: number }[] = []
    const n = Math.min(entries.filter(([, v]) => v > 0).length, limit)
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))

    const commitDays = entries.filter(([, v]) => v > 0).slice(-limit)
    commitDays.forEach(([, count], i) => {
      const t = i / Math.max(1, n - 1)
      const inclination = Math.acos(1 - 2 * t)
      const azimuth = goldenAngle * i
      points.push({
        x: Math.sin(inclination) * Math.cos(azimuth),
        y: Math.sin(inclination) * Math.sin(azimuth),
        z: Math.cos(inclination),
        intensity: count / maxCount,
      })
    })

    // Also add a wireframe ring around the equator for visual richness
    const RING_SEGMENTS = 48
    const ringPoints: { x: number; y: number; z: number }[] = []
    for (let i = 0; i < RING_SEGMENTS; i++) {
      const a = (i / RING_SEGMENTS) * Math.PI * 2
      ringPoints.push({ x: Math.cos(a), y: 0, z: Math.sin(a) })
    }

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const cx = size / 2
    const cy = size / 2
    const r = size * 0.36

    const tilt = 0.42 // ~24° tilt so the sphere looks natural

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      rotRef.current += 0.003

      ctx.clearRect(0, 0, size, size)
      const p = paletteRef.current
      const rot = rotRef.current

      // Draw wireframe equator ring
      ctx.beginPath()
      let started = false
      for (const rp of ringPoints) {
        const { sx, sy, scale } = sphereProject(rp.x, rp.y, rp.z, rot, tilt)
        const px = cx + sx * r
        const py = cy + sy * r
        if (!started) { ctx.moveTo(px, py); started = true }
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.strokeStyle = p.threeA + '20'
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Sort points by z depth (painter's algorithm)
      const projected = points.map(pt => {
        const { sx, sy, scale } = sphereProject(pt.x, pt.y, pt.z, rot, tilt)
        return { sx, sy, scale, intensity: pt.intensity, z: pt.z }
      }).sort((a, b) => a.scale - b.scale) // back → front

      // Draw commit orbs
      for (const { sx, sy, scale, intensity } of projected) {
        const px = cx + sx * r
        const py = cy + sy * r
        const baseRadius = (2 + intensity * 5) * scale
        const alpha = (0.3 + intensity * 0.7) * scale

        // Glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, baseRadius * 2.5)
        const col = intensity > 0.6 ? p.threeC : intensity > 0.3 ? p.threeA : p.threeB
        const alphaHex = Math.min(255, Math.max(0, Math.round(alpha * 220))).toString(16).padStart(2, '0')
        grd.addColorStop(0, col + alphaHex)
        grd.addColorStop(1, col + '00')
        ctx.beginPath()
        ctx.arc(px, py, baseRadius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(px, py, baseRadius, 0, Math.PI * 2)
        ctx.fillStyle = col + 'ee'
        ctx.fill()
      }

      // Subtle outer sphere outline
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.strokeStyle = p.threeA + '14'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    draw()

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current)
      else draw()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [tier, size, contributions])

  if (tier < 2) return null

  return (
    <motion.canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
    />
  )
}
