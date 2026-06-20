'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true only when:
 * - The browser supports WebGL
 * - The user has NOT requested reduced motion
 * - The viewport is larger than typical mobile devices (> 768px)
 *
 * Use this to conditionally mount React Three Fiber canvases
 * so users on low-capability devices or with accessibility
 * preferences never receive a broken or laggy 3D experience.
 */
export function use3DGate(): boolean {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    // Check reduced-motion preference
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reducedMotion) return

    // Check for mobile devices (disable heavy 3D on small screens)
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    // Check WebGL availability without throwing
    try {
      const canvas = document.createElement('canvas')
      const ctx =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
      if (ctx) setAllowed(true)
    } catch {
      // WebGL unavailable – leave allowed as false
    }
  }, [])

  return allowed
}
