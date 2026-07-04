'use client'
import { useEffect, useRef } from 'react'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { useAccentStore } from '@/lib/stores/theme-accent'

// Pure CSS fallback blob path keyframes are defined in globals.css
// For Tier2+ we animate SVG filter turbulence via rAF — GPU-friendly
export function MorphingBlob({
  className = '',
  size = 420,
  opacity = 0.18,
}: {
  className?: string
  size?: number
  opacity?: number
}) {
  const tier = useDeviceTier()
  const { accent } = useAccentStore()
  const filterRef = useRef<SVGFETurbulenceElement>(null)
  const rafRef = useRef<number>(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || tier === 1) return

    const animate = () => {
      phaseRef.current += 0.004
      if (filterRef.current) {
        filterRef.current.setAttribute(
          'baseFrequency',
          `${0.012 + Math.sin(phaseRef.current) * 0.003} ${0.012 + Math.cos(phaseRef.current * 0.7) * 0.003}`
        )
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [tier])

  // Tier 1: pure CSS animated blob
  if (tier === 1) {
    return (
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: `radial-gradient(ellipse at 40% 40%, var(--accent-primary), var(--accent-secondary))`,
          opacity,
          animation: 'morphBlob 8s ease-in-out infinite',
          willChange: 'border-radius',
          filter: 'blur(40px)',
        }}
      />
    )
  }

  // Tier 2/3: SVG turbulence displacement for organic liquid look
  const filterId = `blob-filter-${accent}`
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, opacity }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              ref={filterRef}
              type="fractalNoise"
              baseFrequency="0.012 0.012"
              numOctaves={4}
              seed={2}
              stitchTiles="stitch"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={size * 0.15}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.38}
          filter={`url(#${filterId})`}
          style={{
            fill: 'none',
            stroke: 'url(#blobGrad)',
            strokeWidth: 2.5,
          }}
        />
        <defs>
          <radialGradient id="blobGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="var(--accent-secondary)" />
          </radialGradient>
        </defs>
        {/* Filled interior */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.34}
          filter={`url(#${filterId})`}
          style={{
            fill: 'url(#blobGradFill)',
            filter: `blur(${size * 0.07}px)`,
          }}
        />
        <defs>
          <radialGradient id="blobGradFill" cx="40%" cy="35%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity={0.15} />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
