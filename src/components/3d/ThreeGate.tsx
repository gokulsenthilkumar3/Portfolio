'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'

interface ThreeGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  rootMargin?: string
}

/**
 * ThreeGate — safety gate for heavy WebGL scenes.
 * 1. Intersection Observer: only mounts when scrolled into view.
 * 2. WebGL detection: falls back gracefully if WebGL is unavailable.
 * 3. Reduced motion: skips WebGL entirely for users who prefer reduced motion.
 * 4. Suspense: provides loading state while chunks stream in.
 */
export function ThreeGate({
  children,
  fallback = (
    <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-md rounded-2xl animate-pulse">
      <span className="text-muted-foreground/50 font-mono text-sm">Loading 3D Experience...</span>
    </div>
  ),
  className,
  rootMargin = '100px',
}: ThreeGateProps) {
  const [shouldRender, setShouldRender] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(true)
  const [prefersReduced, setPrefersReduced] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Prefers-reduced-motion check
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    // WebGL availability check
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [rootMargin])

  if (prefersReduced) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background/50 to-accent/5 rounded-2xl">
          <span className="text-muted-foreground/40 font-mono text-xs text-center px-4">
            3D scene hidden (reduced motion preference)
          </span>
        </div>
      </div>
    )
  }

  if (!hasWebGL) {
    return (
      <div className={className}>
        <div className="w-full h-full flex items-center justify-center bg-muted/20 border border-border/50 rounded-2xl">
          <span className="text-muted-foreground/50 font-mono text-xs text-center px-4">
            WebGL not supported
          </span>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : fallback}
    </div>
  )
}
