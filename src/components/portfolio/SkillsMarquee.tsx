'use client'

import { useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Skill } from '@/lib/types/portfolio'
import { SectionHeading } from './SectionHeading'

type FilterKey = 'all' | 'testing' | 'frontend' | 'backend' | 'delivery'

const filters: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'testing', label: 'Test engineering' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'delivery', label: 'DevOps & tools' },
]

function matchesFilter(skill: Skill, filter: FilterKey) {
  if (filter === 'all') return true
  if (filter === 'delivery') return ['devops', 'tools', 'design', 'soft-skills'].includes(skill.category)
  return skill.category === filter
}

export function SkillsMarquee({ skills }: { skills: Skill[] }) {
  const root = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<FilterKey>('all')

  const rows = useMemo(() => {
    const quality = skills.filter((skill) => skill.category === 'testing')
    const frontend = skills.filter((skill) => skill.category === 'frontend')
    const backend = skills.filter((skill) => skill.category === 'backend')
    const delivery = skills.filter((skill) => ['devops', 'tools', 'design', 'soft-skills'].includes(skill.category))
    return [
      { label: 'Quality', skills: quality, reverse: false, duration: 25 },
      { label: 'Interface', skills: frontend, reverse: true, duration: 29 },
      { label: 'Systems', skills: backend, reverse: false, duration: 23 },
      { label: 'Delivery', skills: delivery, reverse: true, duration: 32 },
    ].filter((row) => row.skills.length > 0)
  }, [skills])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.from('[data-skills-heading]', {
      clipPath: 'inset(0 100% 0 0)',
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: { trigger: root.current, start: 'top 72%', once: true },
    })

    gsap.from('[data-marquee-row]', {
      y: 40,
      opacity: 0,
      stagger: 0.08,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: { trigger: '[data-marquee-stack]', start: 'top 82%', once: true },
    })
  }, { scope: root })

  return (
    <section ref={root} id="skills" className="portfolio-section skills-marquee" aria-labelledby="skills-title">
      <div data-skills-heading>
        <SectionHeading
          id="skills-title"
          index="02"
          eyebrow="Capabilities"
          title="What I know."
          description="A working set of tools for making software reliable, fast, and quietly intuitive."
        />
      </div>

      <div className="skills-marquee__filters" role="group" aria-label="Filter skills by category">
        {filters.map((item) => (
          <button
            key={item.key}
            type="button"
            aria-pressed={filter === item.key}
            onClick={() => setFilter(item.key)}
            data-cursor="link"
            data-magnetic
          >
            {item.label}
          </button>
        ))}
      </div>

      <ul className="sr-only">
        {skills.map((skill) => <li key={skill.id}>{skill.name}, {skill.category}</li>)}
      </ul>

      <div className="skills-marquee__stack" data-marquee-stack aria-hidden="true">
        {rows.map((row) => (
          <div
            key={row.label}
            className="skills-marquee__row"
            data-marquee-row
            data-reverse={row.reverse}
            style={{ '--marquee-duration': `${row.duration}s` } as React.CSSProperties}
          >
            <span className="skills-marquee__row-label">{row.label}</span>
            <div className="skills-marquee__viewport">
              <div className="skills-marquee__track">
                {[0, 1].map((copy) => (
                  <div key={copy} className="skills-marquee__sequence">
                    {row.skills.map((skill) => (
                      <span
                        key={`${copy}-${skill.id}`}
                        className={matchesFilter(skill, filter) ? 'is-match' : 'is-muted'}
                      >
                        {skill.name}
                        <i aria-hidden="true">·</i>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
