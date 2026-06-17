'use client'

/**
 * FloatingModelsSection
 *
 * This wrapper solves three layered problems for 3D components in Next.js:
 *
 * 1. SSR CRASH (the root cause of "Application error")
 *    FloatingModels imports Three.js / @react-three/fiber, which reference
 *    browser globals (WebGLRenderingContext, HTMLCanvasElement) that don't
 *    exist in Node.js. The FIX is that this entire module is only ever loaded
 *    via dynamic({ ssr: false }) in page.tsx — so Next.js never attempts to
 *    server-render any Three.js code.
 *
 * 2. CANVAS STARTUP COST
 *    Even client-side, creating a WebGL context for a decorative background
 *    that's already in the hero is wasteful on slow devices. We use
 *    IntersectionObserver with rootMargin="300px 0px" so the canvas mounts
 *    ~300px before the section enters the viewport, not immediately on page
 *    load.
 *
 * 3. GRACEFUL DEGRADATION
 *    If the user has prefers-reduced-motion or the browser lacks WebGL support
 *    (older devices, privacy-hardened browsers), the canvas never mounts and
 *    the component returns null silently — the page still looks correct.
 */

import { useEffect, useRef, useState } from 'react'
import { FloatingModels } from '@/components/3d/FloatingModels'

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

interface Props {
  className?: string
  heightClass?: string
  theme?: 'dark' | 'light' | 'neon' | 'pastel' | 'cyberpunk'
}

export function FloatingModelsSection({
  className,
  heightClass = 'h-64',
  theme = 'dark',
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [allow3D, setAllow3D] = useState(false)

  // Gate 1: reduced-motion + WebGL availability check (runs once on mount)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setAllow3D(!reduced && canUseWebGL())
  }, [])

  // Gate 2: only mount the canvas when the section is near the viewport
  useEffect(() => {
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      // 300px pre-load margin so the canvas is ready before the user sees it
      { rootMargin: '300px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  if (!allow3D) return null

  return (
    <div ref={containerRef} className={`${heightClass} ${className ?? ''}`}>
      {nearViewport && (
        <FloatingModels className="w-full h-full" theme={theme} />
      )}
    </div>
  )
}
