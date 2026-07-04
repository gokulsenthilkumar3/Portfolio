import { useState, useEffect, useRef } from 'react'

interface MousePosition {
  x: number
  y: number
}

/**
 * Tracks global mouse position using a requestAnimationFrame loop
 * instead of per-event setState — eliminates React render-per-mousemove
 * and keeps the UI thread free during fast cursor movement.
 */
export const useMousePosition = (): MousePosition => {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0 })
  const pending = useRef<MousePosition | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pending.current = { x: e.clientX, y: e.clientY }
    }

    const flush = () => {
      if (pending.current) {
        setPos(pending.current)
        pending.current = null
      }
      rafId.current = requestAnimationFrame(flush)
    }

    rafId.current = requestAnimationFrame(flush)
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return pos
}
