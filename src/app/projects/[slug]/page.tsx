import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react'
import { getPublishedPortfolio } from '@/lib/admin/published'

type Props = { params: Promise<{ slug: string }> }

async function getProject(slug: string) {
  const data = await getPublishedPortfolio()
  return data.projects.find((project) => project.id === slug && project.kind !== 'research')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) return { title: 'Project not found' }
  return { title: `${project.title} | Gokul Senthilkumar`, description: project.description }
}

export default async function ProjectCaseStudy({ params }: Props) {
  const { slug } = await params
  const project = await getProject(slug)
  if (!project) notFound()

  const status = project.status === 'planned' ? 'Research / design' : project.status === 'completed' ? 'Completed' : 'In progress'
  const isConcept = project.mediaType === 'concept'

  return (
    <article className="case-study">
      <div className="case-study__shell">
        <Link href="/#projects" className="case-study__back" data-no-transition><ArrowLeft aria-hidden="true" /> All projects</Link>
        <p className="case-study__eyebrow">Project note / {status}</p>
        <h1>{project.title}</h1>
        <p className="case-study__intro">{project.description}</p>
        <div className="case-study__links">
          {project.links.github && <a href={project.links.github} target="_blank" rel="noreferrer" data-no-transition><Github aria-hidden="true" /> View repository <ArrowUpRight aria-hidden="true" /></a>}
          {project.links.live && <a href={project.links.live} target="_blank" rel="noreferrer" data-no-transition>Open live project <ArrowUpRight aria-hidden="true" /></a>}
        </div>

        {project.images[0] && (
          <figure className="case-study__media">
            <Image src={project.images[0]} alt={isConcept ? `${project.title} conceptual illustration` : project.mediaType === 'prototype' ? `${project.title} prototype interface` : `${project.title} project image`} width={1600} height={900} sizes="(max-width: 900px) 100vw, 80vw" priority />
            <figcaption>{project.mediaCaption || (isConcept ? 'Concept artwork. This is not a screenshot of a finished product.' : project.mediaType === 'prototype' ? 'Prototype interface with sample data, not a live service.' : 'Project image.')}</figcaption>
          </figure>
        )}

        <div className="case-study__grid">
          <div className="case-study__body">
            <section><p className="case-study__label">The problem</p><h2>Why this exists</h2><p>{project.problem || project.description}</p></section>
            <section><p className="case-study__label">My contribution</p><h2>What I worked on</h2><p>{project.responsibility || 'See the repository for the current implementation and project history.'}</p></section>
            <section><p className="case-study__label">Current evidence</p><h2>What is there today</h2><p>{project.evidence || 'The linked repository is the source of truth for the current state of this project.'}</p></section>
            {project.nextSteps && <section><p className="case-study__label">Still to do</p><h2>Where it goes next</h2><p>{project.nextSteps}</p></section>}
          </div>
          <aside className="case-study__aside" aria-label="Project facts">
            <div><span>Status</span><strong>{status}</strong></div>
            {project.sourceReviewedAt && <div><span>Source reviewed</span><strong>{project.sourceReviewedAt}</strong></div>}
            <div><span>Stack and methods</span><div className="case-study__tags">{(project.technologies || project.tech || []).map((item) => <span key={item}>{item}</span>)}</div></div>
            <p>Descriptions reflect the repository state at the review date. Roadmap items are not presented as shipped features.</p>
          </aside>
        </div>
      </div>
    </article>
  )
}
