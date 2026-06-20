'use client'

import { useEffect, useRef, useCallback } from 'react'

interface SnakeHeatmapProps {
  contributions: Record<string, number>
  cols: number
  rows: number
  cellSize: number
  gap: number
}

interface SnakeSegment {
  col: number
  row: number
}

export function SnakeHeatmap({ contributions, cols, rows, cellSize, gap }: SnakeHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snakeRef = useRef<SnakeSegment[]>([])
  const dirRef = useRef<{ dc: number; dr: number }>({ dc: 1, dr: 0 })
  const frameRef = useRef<number>(0)
  const tickRef = useRef<number>(0)

  const getContribLevel = useCallback((col: number, row: number) => {
    const keys = Object.keys(contributions).sort()
    const idx = col * rows + row
    if (idx >= keys.length) return 0
    const val = contributions[keys[idx]]
    if (!val) return 0
    if (val >= 10) return 4
    if (val >= 5) return 3
    if (val >= 2) return 2
    return 1
  }, [contributions, rows])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = cols * (cellSize + gap) - gap
    const h = rows * (cellSize + gap) - gap
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    // Initialize snake in center
    snakeRef.current = [
      { col: Math.floor(cols / 2), row: Math.floor(rows / 2) },
      { col: Math.floor(cols / 2) - 1, row: Math.floor(rows / 2) },
      { col: Math.floor(cols / 2) - 2, row: Math.floor(rows / 2) },
    ]

    const SPEED = 8 // frames per tick
    const HEAD_COLOR = '#22c55e'
    const BODY_COLOR = '#16a34a'
    const TAIL_COLOR = '#15803d'

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw snake
      snakeRef.current.forEach((seg, i) => {
        const x = seg.col * (cellSize + gap)
        const y = seg.row * (cellSize + gap)
        const color = i === 0 ? HEAD_COLOR : i < 2 ? BODY_COLOR : TAIL_COLOR
        const alpha = i === 0 ? 0.95 : Math.max(0.2, 1 - i * 0.15)

        ctx.globalAlpha = alpha
        ctx.fillStyle = color
        ctx.shadowColor = color
        ctx.shadowBlur = i === 0 ? 8 : 3
        const r = i === 0 ? cellSize / 2 : cellSize / 2 - 1
        ctx.beginPath()
        ctx.roundRect(x, y, cellSize, cellSize, [r])
        ctx.fill()
      })

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    const move = () => {
      const head = snakeRef.current[0]
      const { dc, dr } = dirRef.current
      let newCol = head.col + dc
      let newRow = head.row + dr

      // Wrap around
      if (newCol >= cols) newCol = 0
      if (newCol < 0) newCol = cols - 1
      if (newRow >= rows) newRow = 0
      if (newRow < 0) newRow = rows - 1

      // Steer toward high contribution cells
      const level = getContribLevel(newCol, newRow)
      if (level === 0 && Math.random() < 0.4) {
        // Try to turn toward a cell with contributions
        const options = [
          { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
          { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
        ].filter(o => !(o.dc === -dc && o.dr === -dr))
        const best = options.find(o => {
          const nc = head.col + o.dc
          const nr = head.row + o.dr
          return getContribLevel(nc, nr) > 0
        })
        if (best) {
          dirRef.current = best
          newCol = head.col + best.dc
          newRow = head.row + best.dr
          if (newCol >= cols) newCol = 0
          if (newCol < 0) newCol = cols - 1
          if (newRow >= rows) newRow = 0
          if (newRow < 0) newRow = rows - 1
        }
      }

      // Random direction change occasionally
      if (Math.random() < 0.05) {
        const options = [
          { dc: 1, dr: 0 }, { dc: -1, dr: 0 },
          { dc: 0, dr: 1 }, { dc: 0, dr: -1 },
        ].filter(o => !(o.dc === -dc && o.dr === -dr))
        dirRef.current = options[Math.floor(Math.random() * options.length)]
      }

      snakeRef.current = [
        { col: newCol, row: newRow },
        ...snakeRef.current.slice(0, 4), // keep tail length 5
      ]
    }

    const animate = () => {
      tickRef.current++
      if (tickRef.current % SPEED === 0) {
        move()
        draw()
      }
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [cols, rows, cellSize, gap, getContribLevel])

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none z-10"
    />
  )
}
