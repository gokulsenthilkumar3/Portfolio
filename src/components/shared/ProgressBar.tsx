'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Scroll progress bar.
 * Uses a rAF-ticking passive scroll listener instead of calling setState
 * on every scroll event — eliminates unnecessary React re-renders.
 */
export function ProgressBar() {
  const [progress, setProgress] = useState(0)
  const pending = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (pending.current) return
      pending.current = true
      requestAnimationFrame(() => {
        const scrolled  = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setProgress(docHeight > 0 ? (scrolled / docHeight) * 100 : 0)
        pending.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 w-full h-[3px] bg-transparent z-[60] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary/70 origin-left"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left',
          // Use transform instead of width change — avoids layout reflow entirely
          willChange: 'transform',
          transition: 'transform 80ms linear',
        }}
      />
    </div>
  )
}
