'use client'

import Lenis from 'lenis'
import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AmbientNoise } from './AmbientNoise'

declare global {
  interface Window {
    __portfolioLenis?: Lenis
  }
}

function SmoothScrollRuntime() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (reduced || coarse) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    })

    window.__portfolioLenis = lenis

    const onLenisScroll = (event: { velocity: number; direction: number }) => {
      const velocity = Math.max(-12, Math.min(12, event.velocity))
      document.documentElement.style.setProperty('--scroll-velocity', velocity.toFixed(3))
      document.documentElement.dataset.scrollDirection = event.direction >= 0 ? 'down' : 'up'
      ScrollTrigger.update()
    }

    const update = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', onLenisScroll)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      if (!anchor || event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return
      const target = document.querySelector<HTMLElement>(url.hash)
      if (!target) return

      event.preventDefault()
      lenis.scrollTo(target, { duration: 1.35, offset: 0 })
      history.replaceState(history.state, '', `${url.pathname}${url.hash}`)
    }

    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(update)
      lenis.off('scroll', onLenisScroll)
      lenis.destroy()
      delete window.__portfolioLenis
      document.documentElement.style.removeProperty('--scroll-velocity')
    }
  }, [])

  return null
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const forcedColors = window.matchMedia('(forced-colors: active)').matches
    if (!dot || !ring || !fine || reduced || forcedColors) return

    document.documentElement.classList.add('custom-cursor-ready')
    document.documentElement.dataset.cursorReady = 'true'
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.24, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.24, ease: 'power3.out' })
    // Keep opacity at 0 until first pointermove — prevents cursor flashing at
    // center screen on page load. The CSS parks elements at -9999px as a fallback.


    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null
      const context = target?.closest<HTMLElement>('[data-cursor], a, button, input, textarea')
      const explicitMode = context?.dataset.cursor
      const mode = explicitMode || (context?.matches('input, textarea') ? 'text' : context ? 'link' : 'default')
      const magnetic = context?.hasAttribute('data-magnetic')
      const rect = magnetic && context ? context.getBoundingClientRect() : null
      const x = rect ? rect.left + rect.width / 2 : event.clientX
      const y = rect ? rect.top + rect.height / 2 : event.clientY

      dotX(event.clientX)
      dotY(event.clientY)
      ringX(x)
      ringY(y)
      ring.dataset.mode = mode
      ring.dataset.label = mode === 'view' ? 'View' : ''
      gsap.to([dot, ring], { opacity: 1, duration: 0.18, overwrite: true })
    }

    const onEnter = (event: PointerEvent) => onMove(event)
    const onLeave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.18, overwrite: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerenter', onEnter, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerenter', onEnter)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove('custom-cursor-ready')
      delete document.documentElement.dataset.cursorReady
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

function PageTransition() {
  const orbRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const covering = useRef(false)

  useEffect(() => {
    const orb = orbRef.current
    if (!orb || !covering.current) return

    gsap.to(orb, {
      opacity: 0,
      duration: 0.42,
      delay: 0.08,
      ease: 'power2.out',
      onComplete: () => {
        covering.current = false
        gsap.set(orb, { display: 'none', scale: 0, opacity: 1 })
      },
    })
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]')
      const orb = orbRef.current
      if (!anchor || !orb || anchor.target || anchor.download || anchor.dataset.noTransition !== undefined) return

      const url = new URL(anchor.href, window.location.href)
      const current = new URL(window.location.href)
      if (url.origin !== current.origin || (url.pathname === current.pathname && url.hash)) return
      if (url.pathname === current.pathname && url.search === current.search) return

      event.preventDefault()
      const farX = Math.max(event.clientX, window.innerWidth - event.clientX)
      const farY = Math.max(event.clientY, window.innerHeight - event.clientY)
      const scale = Math.hypot(farX, farY) / 50 + 0.5
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      covering.current = true
      gsap.set(orb, { display: 'block', x: event.clientX, y: event.clientY, scale: 0, opacity: 1 })
      gsap.to(orb, {
        scale,
        duration: reduced ? 0.16 : 0.62,
        ease: 'power4.inOut',
        onComplete: () => router.push(`${url.pathname}${url.search}${url.hash}`),
      })
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [router])

  return <div ref={orbRef} className="page-transition-orb" aria-hidden="true" />
}

export function ExperienceShell() {
  return (
    <>
      <AmbientNoise />
      <SmoothScrollRuntime />
      <CustomCursor />
      <PageTransition />
    </>
  )
}
