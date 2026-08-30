'use client'

import { ArrowUpRight } from 'lucide-react'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Experience } from '@/lib/types/portfolio'
import { SectionHeading } from './SectionHeading'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(date))
}

function formatPeriod(experience: Experience) {
  const start = formatDate(experience.period.start)
  const end = experience.period.present ? 'Present' : experience.period.end ? formatDate(experience.period.end) : 'Present'
  return `${start} — ${end}`
}

export function ExperienceTimeline({ experiences, resume }: { experiences: Experience[]; resume: string }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.fromTo(
      '[data-timeline-line]',
      { scaleY: 0, transformOrigin: 'top center' },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '[data-timeline-list]',
          start: 'top 72%',
          end: 'bottom 62%',
          scrub: 0.75,
        },
      }
    )

    gsap.from('[data-timeline-item]', {
      opacity: 0,
      x: (index) => index % 2 === 0 ? -60 : 60,
      duration: 0.75,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-timeline-list]', start: 'top 76%', once: true },
    })

    gsap.from('[data-timeline-node]', {
      scale: 0,
      duration: 0.5,
      stagger: 0.18,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: '[data-timeline-list]', start: 'top 76%', once: true },
    })
  }, { scope: root })

  return (
    <section ref={root} id="experience" className="portfolio-section experience-timeline" aria-labelledby="experience-title">
      <SectionHeading
        id="experience-title"
        index="04"
        eyebrow="Journey"
        title="Learning through shipping."
        description="A progression from frontend craft to quality engineering and dependable product systems."
      />

      <div className="experience-timeline__list" data-timeline-list>
        <span className="experience-timeline__line" data-timeline-line aria-hidden="true" />
        {experiences.map((experience, index) => (
          <article key={experience.id} className="experience-timeline__item" data-timeline-item data-side={index % 2 === 0 ? 'left' : 'right'}>
            <span className="experience-timeline__node" data-timeline-node aria-hidden="true" />
            <p className="experience-timeline__period">{formatPeriod(experience)}</p>
            <h3>{experience.role}</h3>
            <p className="experience-timeline__company">{experience.company} · {experience.location}</p>
            <p className="experience-timeline__description">
              {Array.isArray(experience.description) ? experience.description.join(' ') : experience.description}
            </p>
            <div className="experience-timeline__tags">
              {experience.technologies.map((technology) => <span key={technology}>{technology}</span>)}
            </div>
          </article>
        ))}
      </div>

      <a href={resume} target="_blank" rel="noreferrer" className="experience-timeline__resume" data-no-transition data-cursor="link">
        Read the full résumé <ArrowUpRight aria-hidden="true" />
      </a>
    </section>
  )
}
