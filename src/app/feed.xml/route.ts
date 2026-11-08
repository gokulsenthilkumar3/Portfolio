import { getPublishedPortfolio } from '@/lib/server/portfolio'
const xml = (value: string) => value.replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]!)
export async function GET() {
 const data = await getPublishedPortfolio()
 const base = (process.env.NEXT_PUBLIC_SITE_URL || data.seo.siteUrl).replace(/\/$/, '')
 const items = data.blog.map(p => {
 const url = base + '/blog/' + encodeURIComponent(p.slug || p.id)
 const date = new Date(p.date)
 return '<item><title>' + xml(p.title) + '</title><link>' + xml(url) + '</link><guid>' + xml(url) + '</guid><description>' + xml(p.excerpt) + '</description>' + (Number.isNaN(date.valueOf()) ? '' : '<pubDate>' + date.toUTCString() + '</pubDate>') + '</item>'
 }).join('')
 return new Response('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>' + xml(data.personal.name + ' — Notes') + '</title><link>' + xml(base + '/blog') + '</link><description>' + xml(data.seo.description) + '</description>' + items + '</channel></rss>', { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
