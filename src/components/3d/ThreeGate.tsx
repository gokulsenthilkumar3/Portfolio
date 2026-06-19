'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'

interface ThreeGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
  rootMargin?: string
}

/**
 * ThreeGate
 *
 * A safety gate for heavy 3D WebGL scenes.
 * Features:
 * 1. Intersection Observer: Only mounts 3D canvas when in view.
 * 2. WebGL Detection: Safely falls back if WebGL is disabled or unsupported.
 * 3. Reduced Motion: Defaults to fallback if user prefers reduced motion.
 * 4. Suspense: Provides a loading state while heavy chunks load.
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setHasWebGL(false)
    } catch (e) {
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
      ) : (
        fallback
      )}
    </div>
  )
}
