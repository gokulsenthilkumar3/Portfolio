'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SectionHeading } from './SectionHeading'

interface StatLike {
  label?: string
  value?: number
  suffix?: string
}

function AnimatedStatNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState<number>(value)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) {
      setDisplayValue(value)
    }
  }, [value])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setDisplayValue(value)
      hasAnimated.current = true
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = 0
          const end = value
          const duration = 1400
          const startTime = performance.now()

          const step = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(start + (end - start) * easeOut)
            setDisplayValue(current)

            if (progress < 1) {
              requestAnimationFrame(step)
            } else {
              setDisplayValue(end)
            }
          }

          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={elementRef} data-stat-number data-value={value}>
      {displayValue}
    </span>
  )
}

interface AboutStoryProps {
  bio: string
  portrait: string
  name: string
  location: string
  stats: StatLike[]
  projectCount: number
  manifesto?: string
  repoCountSource?: 'live' | 'fallback'
  title: string
  subtitle: string
  children?: React.ReactNode
}

export function AboutStory({ bio, portrait, name, location, stats, projectCount, manifesto = '', repoCountSource = 'fallback', title, subtitle, children }: AboutStoryProps) {
  const root = useRef<HTMLElement>(null)
  const portraitFrame = useRef<HTMLElement>(null)
  const portraitImage = useRef<HTMLDivElement>(null)

  const yearsExp = Number(stats.find((stat) => stat.label === 'Years Experience')?.value ?? stats[0]?.value ?? 3)
  const githubRepos = Number(stats.find((stat) => stat.label === 'GitHub Repos')?.value ?? 14)

  const statItems = [
    { value: yearsExp > 0 ? yearsExp : 3, suffix: stats.find((stat) => stat.label === 'Years Experience')?.suffix ?? '', label: 'Years engineering quality' },
    { value: projectCount, suffix: '', label: 'Projects' },
    { value: githubRepos > 0 ? githubRepos : 14, suffix: stats.find((stat) => stat.label === 'GitHub Repos')?.suffix ?? '', label: 'Public repositories' },
  ]

  const place = location.split(',')[0]?.trim() || location

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const words = gsap.utils.toArray<HTMLElement>('[data-about-word]')

    if (reduced) {
      gsap.set(words, { color: '#f0ede8' })
      return
    }

    gsap.fromTo(
      words,
      { color: '#343330' },
      {
        color: '#f0ede8',
        stagger: 0.055,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-about-copy]',
          start: 'top 78%',
          end: 'bottom 44%',
          scrub: 0.8,
        },
      }
    )

    if (portraitImage.current) {
      gsap.fromTo(
        portraitImage.current,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: portraitFrame.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      )
    }
  }, { scope: root })

  const onPortraitMove = (event: React.PointerEvent<HTMLElement>) => {
    if (window.matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    gsap.to(event.currentTarget, {
      rotateX: y * -12,
      rotateY: x * 14,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 1000,
      overwrite: true,
    })
  }

  const resetPortrait = () => {
    if (!portraitFrame.current) return
    gsap.to(portraitFrame.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' })
  }

  return (
    <section ref={root} id="about" className="portfolio-section about-story" aria-labelledby="about-title">
      <SectionHeading id="about-title" index="02" eyebrow="About" title={title} description={subtitle} />

      <div className="about-story__grid">
        <div className="about-story__copy">
          <p className="sr-only">{manifesto}</p>
          <p data-about-copy aria-hidden="true" className="about-story__manifesto" data-cursor="text">
            {manifesto.split(' ').map((word, index) => (
              <span key={`${word}-${index}`} data-about-word>{word}{' '}</span>
            ))}
          </p>
          <p className="about-story__bio">{bio}</p>
        </div>

        <figure
          ref={portraitFrame}
          className="about-story__portrait"
          onPointerMove={onPortraitMove}
          onPointerLeave={resetPortrait}
          data-cursor="crosshair"
        >
          <div ref={portraitImage} className="about-story__portrait-image">
            <Image src={portrait} alt={`Portrait of ${name}`} fill sizes="(max-width: 900px) 90vw, 34vw" />
          </div>
          <figcaption>
            <span>Based in {place}</span>
            <span>Building for everywhere</span>
          </figcaption>
        </figure>
      </div>

      <div className="about-story__stats" data-about-stats>
        {statItems.map((stat) => (
          <div key={stat.label} className="about-story__stat">
            <p aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
              <AnimatedStatNumber value={stat.value} />
              <span>{stat.suffix}</span>
            </p>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
      <p className="about-story__stat-source">{repoCountSource === 'live' ? 'Repository count refreshed from GitHub' : 'Repository count from the published portfolio'} · Credentials listed below</p>
      {children}
    </section>
  )
}
