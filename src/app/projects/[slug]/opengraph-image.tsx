import { ImageResponse } from 'next/og'
import { getPublishedPortfolio } from '@/lib/server/portfolio'
export const alt = 'Portfolio project'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params
 const data = await getPublishedPortfolio()
 const project = data.projects.find(p => p.id === slug)
 return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: '#080808', color: '#f0ede8', width: '100%', height: '100%', padding: 80 }}><div style={{ display: 'flex', color: '#d4a853', fontSize: 24 }}>{data.personal.name + ' · Project notes'}</div><div style={{ display: 'flex', fontSize: 76, marginTop: 40 }}>{project?.title || 'Project'}</div><div style={{ display: 'flex', fontSize: 26, marginTop: 35 }}>{(project?.technologies || project?.tech || []).slice(0, 5).join(' · ')}</div></div>, size)
}
