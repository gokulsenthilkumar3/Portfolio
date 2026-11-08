'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/lib/types/portfolio'
import { ProjectsGallery } from './ProjectsGallery'

export function ProjectBrowser(props: { projects: Project[]; heading: string; intro: string }) {
  const [mode, setMode] = useState('tour')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const projects = props.projects.filter(p => p.kind !== 'research')
  const filtered = projects.filter(p => (category === 'all' || p.category === category) && [p.title, p.description, ...(p.technologies || p.tech || [])].join(' ').toLowerCase().includes(query.toLowerCase()))
  return <div>
    <div className="browse-controls" aria-label="Project view">
      <button aria-pressed={mode === 'tour'} onClick={() => setMode('tour')}>Tour</button>
      <button aria-pressed={mode === 'grid'} onClick={() => setMode('grid')}>Browse all</button>
    </div>
    {mode === 'tour' ? <ProjectsGallery {...props} /> : <section id="projects" className="portfolio-section" aria-labelledby="browse-title">
      <h2 id="browse-title">{props.heading}</h2><p>{props.intro}</p>
      <div className="browse-controls">
        <label>Search projects<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Title, stack or keyword" /></label>
        <label>Category<select value={category} onChange={e => setCategory(e.target.value)}><option value="all">All categories</option>{Array.from(new Set(projects.map(p => p.category))).map(c => <option key={c}>{c}</option>)}</select></label>
      </div>
      <p role="status">{filtered.length} projects</p>
      <div className="content-grid">{filtered.map(p => <article className="content-card" key={p.id}>
        {p.images[0] && <Image src={p.images[0]} width={640} height={360} sizes="(max-width: 720px) 100vw, 33vw" alt={p.title + ' — ' + (p.mediaType || 'project image')} />}
        <small>{p.category} · {p.mediaType || 'Project'}</small><h3><Link href={'/projects/' + p.id}>{p.title}</Link></h3><p>{p.description}</p>
        {p.evidence && <p>{p.evidence}</p>}<p>{(p.technologies || p.tech || []).join(' · ')}</p>
      </article>)}</div>
      {!filtered.length && <p>No projects match. Try a different keyword or category.</p>}
    </section>}
  </div>
}

