'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useDeviceTier } from '@/hooks/use-device-tier'
import { useCurrentPalette } from '@/lib/stores/theme-accent'

interface IsometricProps {
  contributions: Record<string, number>
  className?: string
  size?: number
}

export function IsometricCommitGraph({ contributions, className = '', size = 300 }: IsometricProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const tier = useDeviceTier()
  const palette = useCurrentPalette()
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const paletteRef = useRef(palette)

  useEffect(() => {
    paletteRef.current = palette
  }, [palette])

  // Extract values and pad to a 14x14 grid
  const gridData = useMemo(() => {
    const vals = Object.values(contributions)
    const gridSize = 14
    const grid: number[][] = []
    
    // Normalize values
    const maxVal = Math.max(...vals, 1)
    let idx = 0
    
    for (let i = 0; i < gridSize; i++) {
      const row: number[] = []
      for (let j = 0; j < gridSize; j++) {
        // Reverse reading so latest is at the front or back
        const val = vals[vals.length - 1 - idx] || 0
        row.push(val / maxVal)
        idx++
      }
      grid.push(row)
    }
    return grid
  }, [contributions])

  useEffect(() => {
    if (tier < 2) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = size * 2 // High DPI
    let H = size * 2
    canvas.width = W
    canvas.height = H
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`

    const gridSize = 14
    const blockSize = W / (gridSize * 2.5)
    let time = 0

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mouseRef.current = { x: (x - 0.5) * 2, y: (y - 0.5) * 2 }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    const drawCube = (x: number, y: number, w: number, h: number, intensity: number, p: any, tPhase: number) => {
      const topColor = p.threeA
      const leftColor = p.threeB
      const rightColor = p.threeB

      // Mouse distance interaction for extreme height bounce
      const dx = (x - (W / 2 + mouseRef.current.x * W))
      const dy = (y - (H / 2 + mouseRef.current.y * H))
      const dist = Math.sqrt(dx * dx + dy * dy)
      const hoverEffect = Math.max(0, 1 - dist / 150) // Proximity multiplier

      // Dramatic bounce and breathe animation
      const bounce = Math.sin(tPhase)
      const bounceAbs = Math.abs(bounce)
      
      // Make high intensity blocks jump higher and faster, plus react to mouse proximity
      const animHeight = h * (0.1 + 0.9 * bounceAbs) * 150 * intensity + (hoverEffect * 80) + (intensity > 0 ? 15 : 4)
      
      // Add a slight vertical float to the whole cube
      const floatY = Math.sin(tPhase * 1.5) * 8 * intensity - (hoverEffect * 20)

      ctx.save()
      ctx.translate(x, y + floatY)

      // Right face
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(w, w * 0.5)
      ctx.lineTo(w, w * 0.5 - animHeight)
      ctx.lineTo(0, -animHeight)
      ctx.closePath()
      ctx.fillStyle = rightColor + Math.floor(50 + 100 * intensity).toString(16).padStart(2, '0')
      ctx.fill()
      ctx.strokeStyle = rightColor + '30'
      ctx.stroke()

      // Left face
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-w, w * 0.5)
      ctx.lineTo(-w, w * 0.5 - animHeight)
      ctx.lineTo(0, -animHeight)
      ctx.closePath()
      ctx.fillStyle = leftColor + Math.floor(40 + 90 * intensity).toString(16).padStart(2, '0')
      ctx.fill()
      ctx.strokeStyle = leftColor + '30'
      ctx.stroke()

      // Top face
      ctx.beginPath()
      ctx.moveTo(0, -animHeight)
      ctx.lineTo(w, w * 0.5 - animHeight)
      ctx.lineTo(0, w - animHeight)
      ctx.lineTo(-w, w * 0.5 - animHeight)
      ctx.closePath()
      // Pulse top color alpha based on bounce
      const topAlpha = Math.floor((0.4 + 0.6 * bounceAbs * intensity) * 255).toString(16).padStart(2, '0')
      ctx.fillStyle = topColor + topAlpha
      ctx.fill()
      ctx.strokeStyle = topColor + '90'
      ctx.stroke()

      ctx.restore()
    }

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, W, H)
      
      // Increase global time speed for more dynamic movement
      time += 0.08

      const p = paletteRef.current
      // Increase mouse parallax effect
      const originX = W / 2 + mouseRef.current.x * 40
      const originY = H / 4 + mouseRef.current.y * 40 + Math.sin(time * 0.5) * 15 // Global floating

      // Draw subtle base grid
      ctx.beginPath()
      for(let i = 0; i <= gridSize; i++) {
        const x1 = originX + (i - 0) * blockSize
        const y1 = originY + (i + 0) * (blockSize * 0.5)
        const x2 = originX + (i - gridSize) * blockSize
        const y2 = originY + (i + gridSize) * (blockSize * 0.5)
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)

        const x3 = originX + (0 - i) * blockSize
        const y3 = originY + (0 + i) * (blockSize * 0.5)
        const x4 = originX + (gridSize - i) * blockSize
        const y4 = originY + (gridSize + i) * (blockSize * 0.5)
        ctx.moveTo(x3, y3)
        ctx.lineTo(x4, y4)
      }
      ctx.strokeStyle = p.threeA + '20'
      ctx.stroke()

      // Sort drawing order (back to front)
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const intensity = gridData[i][j]
          
          // Isometric projection mapping with slight gap between blocks (0.9 multiplier)
          const isoX = (i - j) * blockSize
          const isoY = (i + j) * (blockSize * 0.5)
          
          // Create a rapid wave that ripples from the center
          const distToCenter = Math.sqrt(Math.pow(i - gridSize/2, 2) + Math.pow(j - gridSize/2, 2))
          const phase = time - (distToCenter * 0.8)

          drawCube(
            originX + isoX,
            originY + isoY,
            blockSize * 0.85, // Scale down block to create gap
            blockSize * 0.85,
            intensity,
            p,
            phase
          )
        }
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [gridData, tier, size])

  if (tier < 2) {
    return <div className={`w-[${size}px] h-[${size}px] ${className}`} />
  }

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}
