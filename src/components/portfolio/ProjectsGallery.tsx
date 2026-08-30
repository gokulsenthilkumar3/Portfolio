'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Github, X } from 'lucide-react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Project } from '@/lib/types/portfolio'
import { SectionHeading } from './SectionHeading'

const projectVisuals: Record<string, string> = {
  oxfin: '/projects/oxfin.webp',
  'forex-prediction': '/projects/forex-prediction.webp',
  'weaver-book': '/projects/weaver-book.webp',
  'car-renovation-spa': '/projects/car-spa.webp',
  'yarn-management': '/projects/yarn-management.webp',
  'selenium-framework': '/projects/selenium-framework.webp',
  'portfolio-v4': '/projects/portfolio.webp',
}

const projectOrder = [
  'oxfin',
  'selenium-framework',
  'forex-prediction',
  'yarn-management',
  'weaver-book',
  'car-renovation-spa',
]

function projectYear(project: Project) {
  if (!project.date) return '—'
  return new Date(project.date).getFullYear().toString()
}

function projectRole(project: Project) {
  if (project.category === 'testing') return 'Test architecture'
  if (project.category === 'ai') return 'Machine learning'
  if (project.category === 'fullstack') return 'Full-stack build'
  return 'Product engineering'
}

interface ProjectCardProps {
  project: Project
  index: number
  selected: boolean
  setRef: (element: HTMLElement | null) => void
  onOpen: (project: Project, trigger: HTMLButtonElement) => void
}

function ProjectCard({ project, index, selected, setRef, onOpen }: ProjectCardProps) {
  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 24
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 24
    event.currentTarget.style.setProperty('--project-x', `${x}px`)
    event.currentTarget.style.setProperty('--project-y', `${y}px`)
  }

  const resetPointer = (event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--project-x', '0px')
    event.currentTarget.style.setProperty('--project-y', '0px')
  }

  return (
    <article
      ref={setRef}
      className={`project-card ${index === 0 ? 'is-active is-featured' : ''} ${selected ? 'is-source-hidden' : ''}`}
      data-project-card={project.id}
      data-flip-id={selected ? undefined : `project-${project.id}`}
      aria-hidden={selected || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="project-card__header">
        <span>0{index + 1}</span>
        <span>{index === 0 ? 'Featured' : projectRole(project)}</span>
      </div>

      <div className="project-card__body">
        <div className="project-card__copy">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="project-card__tags">
            {(project.technologies || project.tech || []).slice(0, 5).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </div>

        <div className="project-card__image">
          <Image
            src={projectVisuals[project.id] || '/projects/portfolio.webp'}
            alt={`${project.title} project preview`}
            fill
            sizes="(max-width: 900px) 88vw, 62vw"
          />
        </div>
      </div>

      <div className="project-card__footer">
        <span>{projectYear(project)}</span>
        <span>{projectRole(project)}</span>
      </div>

      <button
        type="button"
        className="project-card__open"
        onClick={(event) => onOpen(project, event.currentTarget)}
        aria-label={`View details for ${project.title}`}
        data-cursor="view"
      />

      <div className="project-card__links">
        {project.links.github && (
          <a href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`} data-no-transition>
            <Github aria-hidden="true" />
          </a>
        )}
        {project.links.live && (
          <a href={project.links.live} target="_blank" rel="noreferrer" aria-label={`${project.title} live site`} data-no-transition>
            <ArrowUpRight aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  )
}

interface ExpandedProjectProps {
  project: Project
  onClose: () => void
  closeRef: React.RefObject<HTMLButtonElement | null>
}

function ExpandedProject({ project, onClose, closeRef }: ExpandedProjectProps) {
  return (
    <div className="project-expanded__backdrop" role="presentation">
      <article
        className="project-expanded"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expanded-project-title"
        data-flip-id={`project-${project.id}`}
      >
        <button ref={closeRef} type="button" className="project-expanded__close" onClick={onClose} aria-label="Close project details">
          <X aria-hidden="true" />
          <span>Close</span>
        </button>

        <div className="project-expanded__visual">
          <Image
            src={projectVisuals[project.id] || '/projects/portfolio.webp'}
            alt={`${project.title} project preview`}
            fill
            priority
            sizes="100vw"
          />
          <div className="project-expanded__shade" />
          <div className="project-expanded__title">
            <span>{projectYear(project)} · {projectRole(project)}</span>
            <h2 id="expanded-project-title">{project.title}</h2>
          </div>
        </div>

        <div className="project-expanded__details">
          <p className="project-expanded__lede">{project.description}</p>

          <dl>
            {project.problem && <><dt>Problem</dt><dd>{project.problem}</dd></>}
            {project.responsibility && <><dt>My role</dt><dd>{project.responsibility}</dd></>}
            {project.evidence && <><dt>Outcome</dt><dd>{project.evidence}</dd></>}
          </dl>

          <div className="project-expanded__tags">
            {(project.technologies || project.tech || []).map((technology) => <span key={technology}>{technology}</span>)}
          </div>

          <div className="project-expanded__actions">
            {project.links.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" data-no-transition>
                Source <Github aria-hidden="true" />
              </a>
            )}
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer" data-no-transition>
                Live project <ArrowUpRight aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  )
}

export function ProjectsGallery({ projects }: { projects: Project[] }) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLElement>())
  const [selected, setSelected] = useState<Project | null>(null)
  const pendingFlip = useRef<{ state: ReturnType<typeof Flip.getState>; id: string; closing: boolean } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)

  const featuredProjects = useMemo(() => {
    const ordered = projectOrder
      .map((id) => projects.find((project) => project.id === id))
      .filter((project): project is Project => Boolean(project))
    return ordered.length >= 4 ? ordered.slice(0, 6) : projects.filter((project) => project.featured).slice(0, 6)
  }, [projects])

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, Flip)
    const rootElement = root.current
    const trackElement = track.current
    if (!rootElement || !trackElement) return

    const media = gsap.matchMedia()
    media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = Array.from(trackElement.querySelectorAll<HTMLElement>('.project-card'))
      const distance = () => Math.max(0, trackElement.scrollWidth - window.innerWidth + window.innerWidth * 0.08)

      const tween = gsap.to(trackElement, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rootElement,
          start: 'top top',
          end: () => `+=${distance() + window.innerWidth * 0.72}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const activeIndex = Math.round(self.progress * Math.max(0, cards.length - 1))
            cards.forEach((card, index) => card.classList.toggle('is-active', index === activeIndex))
          },
        },
      })

      return () => tween.kill()
    })

    return () => media.revert()
  }, { scope: root, dependencies: [featuredProjects.length] })

  useLayoutEffect(() => {
    const pending = pendingFlip.current
    if (!pending) return
    const target = document.querySelector<HTMLElement>(`[data-flip-id="project-${pending.id}"]`)
    pendingFlip.current = null
    if (!target) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      if (pending.closing) lastTrigger.current?.focus()
      else closeRef.current?.focus()
      return
    }

    Flip.from(pending.state, {
      targets: target,
      duration: 0.85,
      ease: 'power4.inOut',
      absolute: true,
      scale: true,
      onComplete: () => {
        if (pending.closing) lastTrigger.current?.focus()
        else closeRef.current?.focus()
      },
    })
  }, [selected])

  useLayoutEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.__portfolioLenis?.stop()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProject()
    }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      window.__portfolioLenis?.start()
    }
  }, [selected])

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    const source = cardRefs.current.get(project.id)
    if (!source) return
    lastTrigger.current = trigger
    pendingFlip.current = { state: Flip.getState(source), id: project.id, closing: false }
    setSelected(project)
  }

  const closeProject = () => {
    if (!selected) return
    const expanded = document.querySelector<HTMLElement>(`[data-flip-id="project-${selected.id}"]`)
    if (expanded) {
      pendingFlip.current = { state: Flip.getState(expanded), id: selected.id, closing: true }
    }
    setSelected(null)
  }

  return (
    <section ref={root} id="projects" className="projects-gallery" aria-labelledby="projects-title">
      <div className="projects-gallery__header">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Selected work"
          title="Proof, not promises."
          description="A curated set of products, automation systems, and research built to solve real problems."
        />
      </div>

      <div ref={track} className="projects-gallery__track">
        {featuredProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            selected={selected?.id === project.id}
            setRef={(element) => {
              if (element) cardRefs.current.set(project.id, element)
              else cardRefs.current.delete(project.id)
            }}
            onOpen={openProject}
          />
        ))}
        <div className="projects-gallery__end" aria-hidden="true">
          <span>{String(featuredProjects.length).padStart(2, '0')}</span>
          <p>Built with care.<br />Tested with intent.</p>
        </div>
      </div>

      {selected && typeof document !== 'undefined' && createPortal(
        <ExpandedProject project={selected} onClose={closeProject} closeRef={closeRef} />,
        document.body
      )}
    </section>
  )
}
