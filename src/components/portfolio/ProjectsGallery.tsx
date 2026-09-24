'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Github, Pause, Play, X } from 'lucide-react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import type { Project } from '@/lib/types/portfolio'
import { SectionHeading } from './SectionHeading'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'

function projectYear(project: Project) {
  if (!project.date) return '—'
  return new Date(project.date).getFullYear().toString()
}

function projectRole(project: Project) {
  if (project.status === 'planned') return 'Research and design'
  if (project.id === 'velo') return 'UI prototype'
  if (project.category === 'testing') return 'Test architecture'
  if (project.category === 'ai') return 'Machine learning'
  if (project.category === 'fullstack') return 'Full-stack build'
  return 'Product engineering'
}

interface ProjectCardProps {
  project: Project
  index: number
  selected: boolean
  clone?: boolean
  setRef: (element: HTMLElement | null) => void
  onOpen: (project: Project, trigger: HTMLButtonElement) => void
}

function ProjectCard({ project, index, selected, clone = false, setRef, onOpen }: ProjectCardProps) {
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
      className={`project-card ${index === 0 && !clone ? 'is-active is-featured' : ''} ${selected ? 'is-source-hidden' : ''}`}
      data-project-card={clone ? `${project.id}-loop` : project.id}
      data-loop-clone={clone ? '' : undefined}
      data-flip-id={selected || clone ? undefined : `project-${project.id}`}
      aria-hidden={selected || clone || undefined}
      inert={clone || undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="project-card__header">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span>
          {project.status === 'planned' ? 'Research phase' : index === 0 ? 'Featured' : projectRole(project)}
        </span>
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
          {project.images?.[0] ? (
            <Image src={project.images[0]} alt={project.images[0].includes('-concept.') ? `${project.title} conceptual cover artwork` : `${project.title} project artwork`} fill sizes="(max-width: 900px) 88vw, 62vw" />
          ) : (
            <div className="project-visual-placeholder" aria-hidden="true"><span>{project.status === 'planned' ? 'Research and design' : 'Project workspace'}</span><strong>{project.title}</strong></div>
          )}
          {project.images?.[0]?.includes('-concept.') && <span className="project-card__art-label">Concept artwork</span>}
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
      >
        <span className="project-card__open-label">
          View <ArrowUpRight aria-hidden="true" />
        </span>
      </button>

      <div className="project-card__links">
        {project.links?.github && (
          <a href={project.links.github} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`} data-no-transition>
            <Github aria-hidden="true" />
          </a>
        )}
        {project.links?.live && (
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
  const dialogRef = useRef<HTMLElement>(null)

  useFocusTrap(true, dialogRef, { initialFocusRef: closeRef, onClose })

  return (
    <div
      className="project-expanded__backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <article
        ref={dialogRef}
        className="project-expanded"
        role="dialog"
        aria-modal="true"
        aria-labelledby="expanded-project-title"
        aria-describedby="expanded-project-description"
        data-flip-id={`project-${project.id}`}
      >
        <button ref={closeRef} type="button" className="project-expanded__close" onClick={onClose} aria-label="Close project details">
          <X aria-hidden="true" />
          <span>Close</span>
        </button>

        <div className="project-expanded__visual">
          {project.images?.[0] ? (
            <Image src={project.images[0]} alt={project.images[0].includes('-concept.') ? `${project.title} conceptual cover artwork` : `${project.title} project artwork`} fill priority sizes="100vw" />
          ) : (
            <div className="project-visual-placeholder project-visual-placeholder--expanded" aria-hidden="true"><span>{project.status === 'planned' ? 'Research and design' : 'Project workspace'}</span><strong>{project.title}</strong></div>
          )}
          <div className="project-expanded__shade" />
          {project.images?.[0]?.includes('-concept.') && <span className="project-expanded__art-label">Concept artwork</span>}
          <div className="project-expanded__title">
            <span>{projectYear(project)} · {projectRole(project)}</span>
            <h2 id="expanded-project-title">{project.title}</h2>
          </div>
        </div>

        <div className="project-expanded__details">
          <p id="expanded-project-description" className="project-expanded__lede">{project.description}</p>

          <dl>
            {project.problem && <><dt>Problem</dt><dd>{project.problem}</dd></>}
            {project.responsibility && <><dt>My role</dt><dd>{project.responsibility}</dd></>}
            {project.evidence && <><dt>Outcome</dt><dd>{project.evidence}</dd></>}
          </dl>

          <div className="project-expanded__tags">
            {(project.technologies || project.tech || []).map((technology) => <span key={technology}>{technology}</span>)}
          </div>

          <div className="project-expanded__actions">
            {project.links?.github && (
              <a href={project.links.github} target="_blank" rel="noreferrer" data-no-transition>
                Source <Github aria-hidden="true" />
              </a>
            )}
            {project.links?.live && (
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
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cardRefs = useRef(new Map<string, HTMLElement>())
  const [selected, setSelected] = useState<Project | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const pendingFlip = useRef<{ state: ReturnType<typeof Flip.getState>; id: string; closing: boolean } | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastTrigger = useRef<HTMLButtonElement | null>(null)
  const research = projects.find((project) => project.id === 'forex-prediction')

  const displayedProjects = useMemo(() => {
    return projects.filter((project) => project.id !== 'forex-prediction')
  }, [projects])

  useGSAP(() => {
    gsap.registerPlugin(Flip)
  }, { scope: root })

  const updatePosition = () => {
    const element = track.current
    if (!element) return
    const maxScroll = element.scrollWidth - element.clientWidth
    if (maxScroll > 0 && element.scrollLeft >= maxScroll - 1) {
      element.scrollLeft = 0
      setActiveIndex(0)
      return
    }
    const cards = Array.from(element.querySelectorAll<HTMLElement>('.project-card'))
    const viewportCenter = element.scrollLeft + element.clientWidth / 2
    const closestIndex = cards.reduce((closest, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - viewportCenter)
      const previous = cards[closest]
      return distance < Math.abs(previous.offsetLeft + previous.offsetWidth / 2 - viewportCenter) ? index : closest
    }, 0)
    setActiveIndex(closestIndex % displayedProjects.length)
    cards.forEach((card, index) => card.classList.toggle('is-active', index === closestIndex))
  }

  const goToProject = (index: number) => {
    const element = track.current
    const card = element?.querySelectorAll<HTMLElement>('.project-card')[index]
    if (!element || !card) return
    setIsPlaying(false)
    const left = card.offsetLeft - (element.clientWidth - card.offsetWidth) / 2
    element.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  useLayoutEffect(() => {
    if (!isPlaying || selected) return
    let frame = 0
    let previous = 0
    const advance = (time: number) => {
      const delta = previous ? Math.min(time - previous, 50) : 0
      previous = time
      const element = track.current
      if (!element) return
      const next = element.scrollLeft + delta * 0.18
      element.scrollLeft = next >= element.scrollWidth - element.clientWidth - 1 ? 0 : next
      frame = requestAnimationFrame(advance)
    }
    frame = requestAnimationFrame(advance)
    return () => cancelAnimationFrame(frame)
  }, [isPlaying, selected])

  useEffect(() => {
    if (!isPlaying || !stage.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setIsPlaying(false)
    }, { threshold: 0.1 })
    const pauseWhenHidden = () => {
      if (document.hidden) setIsPlaying(false)
    }
    observer.observe(stage.current)
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', pauseWhenHidden)
    }
  }, [isPlaying])

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

    return () => {
      document.body.style.overflow = previousOverflow
      window.__portfolioLenis?.start()
    }
  }, [selected])

  const openProject = (project: Project, trigger: HTMLButtonElement) => {
    const source = cardRefs.current.get(project.id)
    if (!source) return
    lastTrigger.current = trigger
    setIsPlaying(false)
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
          index="01"
          eyebrow="All projects"
          title="Built and explored."
          description={`${displayedProjects.length} current public projects, from working products and prototypes to clearly labeled research. Explore them in the horizontal gallery below.`}
        />
        {research && (
          <p className="projects-gallery__publication">
            <span aria-hidden="true">★</span> Research archive · {research.links?.github
              ? <a href={research.links.github} target="_blank" rel="noreferrer">{research.title}</a>
              : research.title}
          </p>
        )}
        <a href="#profile" className="projects-gallery__skip" data-cursor="link">
          Skip to profile <ArrowDownRight aria-hidden="true" />
        </a>
      </div>

      <div ref={stage} className="projects-gallery__stage">
        <div className="projects-gallery__controls" aria-label="Project gallery controls">
          <span className="projects-gallery__position" aria-live="off">{String(activeIndex + 1).padStart(2, '0')} / {String(displayedProjects.length).padStart(2, '0')}</span>
          <button type="button" className="projects-gallery__arrow" onClick={() => goToProject(Math.max(0, activeIndex - 1))} aria-label="Previous project" disabled={activeIndex === 0}><ArrowLeft size={14} aria-hidden="true" /></button>
          <button type="button" className="projects-gallery__arrow" onClick={() => goToProject(activeIndex + 1)} aria-label="Next project"><ArrowRight size={14} aria-hidden="true" /></button>
          <button type="button" className="projects-gallery__autoplay" onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pause project tour' : 'Play project tour'} aria-pressed={isPlaying}>
            {isPlaying ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
            {isPlaying ? 'Pause' : 'Play tour'}
          </button>
          <span className="projects-gallery__hint">Swipe or use arrows · Loops after 10</span>
        </div>
        <div ref={track} className="projects-gallery__track" role="region" aria-label="Projects, horizontally scrollable and looping" tabIndex={0} data-playing={isPlaying} onScroll={updatePosition} onPointerDown={() => setIsPlaying(false)} onMouseEnter={() => setIsPlaying(false)} onFocusCapture={() => setIsPlaying(false)} onWheel={() => setIsPlaying(false)} onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
            event.preventDefault()
            goToProject(Math.max(0, Math.min(displayedProjects.length - 1, activeIndex + (event.key === 'ArrowRight' ? 1 : -1))))
          }
        }}>
          {displayedProjects.map((project, index) => (
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
          {displayedProjects[0] && <ProjectCard
            project={displayedProjects[0]}
            index={0}
            selected={false}
            clone
            setRef={() => {}}
            onOpen={() => {}}
          />}
        </div>
      </div>

      {selected && typeof document !== 'undefined' && createPortal(
        <ExpandedProject project={selected} onClose={closeProject} closeRef={closeRef} />,
        document.body
      )}
    </section>
  )
}
