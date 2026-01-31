import { useState, useEffect } from 'react'

interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const parallax = scrolled * speed

      switch (direction) {
        case 'up':
          setOffset({ x: 0, y: -parallax })
          break
        case 'down':
          setOffset({ x: 0, y: parallax })
          break
        case 'left':
          setOffset({ x: -parallax, y: 0 })
          break
        case 'right':
          setOffset({ x: parallax, y: 0 })
          break
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return offset
}
