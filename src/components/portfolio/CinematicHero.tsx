'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowDownRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { use3DGate } from '@/hooks/use3DGate'

const HeroBlob = dynamic(
  () => import('./HeroBlob').then((module) => module.HeroBlob),
  { ssr: false }
)

interface CinematicHeroProps {
  name: string
  role: string
  available: boolean
  heroHeading?: string
}

export function CinematicHero({ name, role, available, heroHeading = 'I build software that earns <em>trust.</em>' }: CinematicHeroProps) {
  const root = useRef<HTMLElement>(null)
  const [showBlob, setShowBlob] = useState(false)
  const canRenderBlob = use3DGate()
  const headingParts = heroHeading.match(/^([\s\S]*?)<em>([\s\S]*?)<\/em>([\s\S]*)$/)

  useEffect(() => {
    const hero = root.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 820px), (pointer: coarse)').matches
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
    if (!hero || !canRenderBlob || reduced || compact || saveData) return

    let ready = false
    let inView = true
    const update = () => setShowBlob(ready && inView)
    const timer = window.setTimeout(() => {
      ready = true
      update()
    }, 220)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    }, { rootMargin: '12% 0px' })
    observer.observe(hero)

    return () => {
      window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [canRenderBlob])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      gsap.set('[data-hero-reveal]', { clearProps: 'all' })
      return
    }

    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
    intro
      .from('[data-hero-kicker]', { opacity: 0, y: 12, duration: 0.55 }, 0.2)
      .from('[data-hero-line="one"]', { opacity: 0, x: -70, duration: 0.95 }, 0.48)
      .from('[data-hero-line="two"]', { opacity: 0, x: 70, duration: 0.95 }, 0.56)
      .from('[data-hero-meta]', { opacity: 0, y: 18, duration: 0.7 }, 1.05)
      .from('[data-hero-cta]', { opacity: 0, y: 14, duration: 0.65 }, 1.28)
      .from('[data-hero-scroll]', { opacity: 0, duration: 0.6 }, 1.48)

    const exit = gsap.timeline({
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
    })
    exit
      .to('[data-hero-content]', { yPercent: -22, opacity: 0.18, ease: 'none' }, 0)
      .to('.cinematic-hero__blob', { scale: 1.15, opacity: 0, ease: 'none' }, 0)
      .to('[data-hero-scroll]', { opacity: 0, ease: 'none' }, 0)

    return () => {
      intro.kill()
      exit.kill()
    }
  }, { scope: root })

  return (
    <section ref={root} id="home" className="cinematic-hero" aria-labelledby="hero-heading">
      <div className="cinematic-hero__glow" aria-hidden="true" />
      <div className="cinematic-hero__blob" data-cursor="crosshair">
        {showBlob && <HeroBlob />}
      </div>

      <div className="cinematic-hero__topline" data-hero-kicker data-hero-reveal>
        <p>
          <span>{name}</span>
          <span className="cinematic-hero__slash" aria-hidden="true">/</span>
          <span>{role}</span>
        </p>
        <p className="cinematic-hero__status">
          <span className={available ? 'is-available' : ''} aria-hidden="true" />
          {available ? 'Open to meaningful work' : 'Currently building'}
        </p>
      </div>

      <div className="cinematic-hero__content" data-hero-content>
        <h1 id="hero-heading" className="cinematic-hero__title">
          {headingParts ? (
            <>
              <span data-hero-line="one" data-hero-reveal>{headingParts[1]}</span>
              <span data-hero-line="two" data-hero-reveal><em>{headingParts[2]}</em>{headingParts[3]}</span>
            </>
          ) : <span data-hero-line="one" data-hero-reveal>{heroHeading}</span>}
        </h1>

        <div className="cinematic-hero__meta" data-hero-meta data-hero-reveal>
          <p>
            I&apos;m an SDET and full-stack builder who makes quality part of the architecture,
            not a checkpoint at the end.
          </p>
          <Link href="#projects" className="cinematic-hero__cta" data-hero-cta data-cursor="link">
            View all projects
            <ArrowDownRight aria-hidden="true" />
          </Link>
        </div>
      </div>

      <a className="cinematic-hero__scroll" href="#projects" data-hero-scroll aria-label="Scroll to all projects">
        <span />
      </a>
    </section>
  )
}
