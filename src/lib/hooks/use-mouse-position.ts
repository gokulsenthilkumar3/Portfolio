import { useState, useEffect } from 'react'

interface MousePosition {
  x: number
  y: number
}

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const throttledUpdate = throttle(updateMousePosition, 16) // ~60fps

    window.addEventListener('mousemove', throttledUpdate)
    
    return () => {
      window.removeEventListener('mousemove', throttledUpdate)
    }
  }, [])

  return mousePosition
}

function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}
