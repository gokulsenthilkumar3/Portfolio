'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true only when:
 * - Browser supports WebGL
 * - No prefers-reduced-motion
 * - Viewport > 768 px (no heavy 3D on mobile)
 * - Not a Lighthouse / headless bot
 * - Device GPU tier is not obviously low (< 4 hardware concurrency = low-end mobile)
 */
export function use3DGate(): boolean {
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    if (isMobile) return

    const isBot = /Lighthouse|HeadlessChrome|bot|googlebot|crawler|spider|robot|crawling/i.test(
      navigator.userAgent
    )
    if (isBot) return

    // Skip 3D on clearly low-end devices (< 4 CPU cores — proxy for GPU tier)
    const cores = navigator.hardwareConcurrency ?? 4
    if (cores < 4) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (ctx) setAllowed(true)
    } catch {
      // WebGL unavailable
    }
  }, [])

  return allowed
}
