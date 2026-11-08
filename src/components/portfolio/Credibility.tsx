'use client'
import Link from 'next/link'
import { useAdmin } from '@/components/admin/AdminProvider'
import { portfolioConfig } from '@/config/portfolio.config'
export function Credibility() {
 const { portfolioData } = useAdmin()
 return <section className="portfolio-section credibility" aria-labelledby="beyond-title"><h2 id="beyond-title">Beyond the projects</h2><p><Link href="/now">What I’m doing now</Link> · <Link href="/uses">Tools I use</Link> · <Link href="/resume">Full resume</Link></p><h3>Languages</h3><ul>{portfolioConfig.languages.map(l => <li key={l.id}>{l.name} — {l.proficiency}</li>)}</ul>
 {portfolioData.extras.testimonials.length > 0 && <><h3>From people I’ve worked with</h3><div className="content-grid">{portfolioData.extras.testimonials.map(t => <figure className="content-card" key={t.name + t.quote}><blockquote>{t.quote}</blockquote><figcaption>{t.name} · {t.role}{t.url && <> · <a href={t.url}>Source</a></>}</figcaption></figure>)}</div></>}
 {portfolioData.extras.schedulingUrl && <a className="schedule-link" href={portfolioData.extras.schedulingUrl} target="_blank" rel="noreferrer">Schedule a conversation</a>}
 </section>
}
