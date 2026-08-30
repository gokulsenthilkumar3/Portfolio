'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SectionHeading } from './SectionHeading'

interface StatLike {
  label?: string
  value?: number
  suffix?: string
}

interface AboutStoryProps {
  bio: string
  portrait: string
  name: string
  location: string
  stats: StatLike[]
  projectCount: number
}

const manifesto = 'I obsess over the 1% of details users never consciously notice — but always feel.'

export function AboutStory({ bio, portrait, name, location, stats, projectCount }: AboutStoryProps) {
  const root = useRef<HTMLElement>(null)
  const portraitFrame = useRef<HTMLElement>(null)
  const portraitImage = useRef<HTMLDivElement>(null)

  const statItems = [
    { value: Number(stats.find((stat) => stat.label === 'Years Experience')?.value ?? stats[0]?.value ?? 0), suffix: stats.find((stat) => stat.label === 'Years Experience')?.suffix ?? '+', label: 'Years engineering quality' },
    { value: projectCount, suffix: stats.find((stat) => stat.label === 'Projects Built')?.suffix ?? '+', label: 'Products and systems built' },
    { value: Number(stats.find((stat) => stat.label === 'Tests Written')?.value ?? 0), suffix: stats.find((stat) => stat.label === 'Tests Written')?.suffix ?? '+', label: 'Automated test cases' },
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

    gsap.fromTo(
      '[data-stat-number]',
      { innerText: 0 },
      {
        innerText: (_index: number, element: HTMLElement) => Number(element.dataset.value || 0),
        duration: 1.6,
        stagger: 0.12,
        snap: { innerText: 1 },
        ease: 'power2.out',
        scrollTrigger: { trigger: '[data-about-stats]', start: 'top 82%', once: true },
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
      <SectionHeading id="about-title" index="01" eyebrow="About" title="The details are the product." />

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
              <span data-stat-number data-value={stat.value}>{stat.value}</span>
              <span>{stat.suffix}</span>
            </p>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
