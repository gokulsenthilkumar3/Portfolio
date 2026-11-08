'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAdmin } from '@/components/admin/AdminProvider'
import { useFocusTrap } from '@/lib/hooks/use-focus-trap'
const pages = [['Home', '/'], ['About', '/#about'], ['Projects', '/#projects'], ['Contact', '/#contact'], ['Resume', '/resume'], ['Blog', '/blog'], ['Now', '/now'], ['Uses', '/uses'], ['Guestbook', '/guestbook'], ['Downloads', '/downloads']]
export function ExploreTools() {
 const pathname = usePathname()
 const { portfolioData } = useAdmin()
 const [open, setOpen] = useState(false)
 const [query, setQuery] = useState('')
 const panel = useRef<HTMLDivElement>(null)
 const input = useRef<HTMLInputElement>(null)
 useFocusTrap(open, panel, { initialFocusRef: input, onClose: () => setOpen(false) })
 useEffect(() => {
 const key = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(v => !v) } }
 window.addEventListener('keydown', key)
 return () => window.removeEventListener('keydown', key)
 }, [])
 const matches = [...pages, ...portfolioData.projects.filter(p => p.kind !== 'research').map(p => [p.title, '/projects/' + p.id])].filter(([label]) => label.toLowerCase().includes(query.toLowerCase()))
 if (pathname.startsWith('/admin')) return null
 return <><footer className="explore-footer no-print"><nav aria-label="Explore portfolio">{pages.slice(4).map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}<a href="/feed.xml">RSS</a><a href="/sitemap.xml">Sitemap</a></nav>
 <div>{portfolioData.socialLinks.filter(s => s.platform !== 'zohomail').map(s => <a key={s.platform} href={s.url}>{s.platform}</a>)}</div>
 <button onClick={() => { setQuery(''); setOpen(true) }}>Find a page <kbd>⌘ / Ctrl K</kbd></button></footer>
 {open && <div className="command-backdrop" onClick={() => setOpen(false)}><div ref={panel} role="dialog" aria-modal="true" aria-labelledby="command-title" className="command-panel" onClick={e => e.stopPropagation()}><h2 id="command-title">Find a page or project</h2><button onClick={() => setOpen(false)}>Close</button><label htmlFor="command-query" className="sr-only">Search</label><input ref={input} id="command-query" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search pages and projects…" /><nav aria-label="Search results">{matches.map(([label, href]) => <a key={href} href={href} data-no-transition onClick={e => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); window.location.assign(href) }}>{label}</a>)}{!matches.length && <p>No results.</p>}</nav></div></div>}
 </>
}
