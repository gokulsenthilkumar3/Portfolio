import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPublishedPortfolio } from '@/lib/server/portfolio'
import { portfolioConfig } from '@/config/portfolio.config'
import { Comments } from '@/components/shared/Comments'
import { PrintButton } from '@/components/shared/PrintButton'

const titles: Record<string, string> = { now: 'Now', uses: 'Tools I use', resume: 'Resume', blog: 'Notes & articles', guestbook: 'Guestbook' }
type Props = { params: Promise<{ section: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
 const { section } = await params
 const data = await getPublishedPortfolio()
 return { title: (titles[section] || 'Not found') + ' | ' + data.personal.name, alternates: { canonical: '/' + section } }
}
export default async function ContentPage({ params }: Props) {
 const { section } = await params
 if (!titles[section]) notFound()
 const data = await getPublishedPortfolio()
 const { personal, extras } = data
 return <article className={'editorial-page ' + (section === 'resume' ? 'resume-page' : '')}>
 <nav aria-label="Breadcrumb" className="no-print"><Link href="/">Home</Link> / <span aria-current="page">{titles[section]}</span></nav>
 <h1>{section === 'resume' ? personal.name : titles[section]}</h1>
 {section === 'resume' && <>
 <Image className="resume-portrait" src={personal.avatar || '/profile-portrait.png'} width={144} height={144} alt={personal.name} />
 <p className="editorial-lead">{personal.title}</p><p>{personal.location} · <a href={'mailto:' + personal.email}>{personal.email}</a></p>
 <div className="browse-controls no-print"><PrintButton />{personal.resume && <a href={personal.resume} download>Download original PDF</a>}<Link href="/#contact">Contact</Link></div>
 <section><h2>Profile</h2><p>{personal.bio}</p></section>
 <section><h2>Experience</h2>{data.experiences.map(e => <div key={e.id} className="resume-entry"><h3>{e.role} · {e.company}</h3><p>{e.period.start} — {e.period.present ? 'Present' : e.period.end}</p>{(Array.isArray(e.description) ? e.description : [e.description]).map((p, i) => <p key={i}>{p}</p>)}<ul>{e.achievements?.map(a => <li key={a}>{a}</li>)}</ul><p>{e.technologies.join(' · ')}</p></div>)}</section>
 <section><h2>Skills</h2><p>{data.skills.map(s => s.name).join(' · ')}</p></section>
 <section><h2>Education</h2>{data.education.map(e => <div key={e.id}><h3>{e.degree}</h3><p>{e.institution} · {e.period.start} — {e.period.end}</p></div>)}</section>
 <section><h2>Certifications</h2><ul>{data.certifications.map(c => <li key={c.id}>{c.url ? <a href={c.url}>{c.name}</a> : c.name} — {c.issuer}{c.issued && ' · ' + c.issued}</li>)}</ul></section>
 <section><h2>Languages</h2><ul>{portfolioConfig.languages.map(l => <li key={l.id}>{l.name} — {l.proficiency}</li>)}</ul></section>
 </>}
 {(section === 'now' || section === 'uses') && <><p className="editorial-lead">{section === 'now' ? 'A snapshot of what has my attention.' : 'The tools behind my work.'}</p><p>Updated {extras.updated}</p><ul className="editorial-list">{extras[section].map(item => <li key={item}>{item}</li>)}</ul><Link href="/#projects">Explore the projects</Link></>}
 {section === 'guestbook' && <><p className="editorial-lead">A place for questions, ideas, and a hello.</p><Comments scene /></>}
 {section === 'blog' && <><p className="editorial-lead">Notes from testing and building software.</p><a href="/feed.xml">Subscribe via RSS</a>
 <div className="content-grid">{data.blog.map(post => <article className="content-card" key={post.id}><small>{post.date} · {post.readTime}</small><h2><Link href={'/blog/' + (post.slug || post.id)}>{post.title}</Link></h2><p>{post.excerpt}</p></article>)}</div>
 {!data.blog.length && <p>No articles published yet. Explore the project notes in the meantime.</p>}
 {data.microblogs.length > 0 && <section><h2>Short notes</h2>{data.microblogs.map(note => <article className="content-card" key={note.id}><time>{note.date}</time><p>{note.text}</p></article>)}</section>}</>}
 </article>
}
