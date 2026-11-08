'use client'
import { useState } from 'react'
import { useAdmin } from '../AdminProvider'
import { parsePortfolioData } from '@/lib/portfolio-content'
export function ExtrasEditor() {
 const { portfolioData, updateSection } = useAdmin()
 const [value, setValue] = useState(JSON.stringify(portfolioData.extras, null, 2))
 const [message, setMessage] = useState('')
 return <div><label htmlFor="extras-content">Now, uses, scheduling and recommendations (JSON)</label>
 <p className="text-sm text-gray-400">Add genuine quotes with permission. Use an HTTPS scheduling URL. Empty testimonials and scheduling links stay hidden.</p>
 <textarea id="extras-content" rows={24} className="w-full bg-black text-white p-3 font-mono text-xs" value={value} onChange={e => setValue(e.target.value)} />
 <button onClick={async () => { try { const extras = parsePortfolioData({ ...portfolioData, extras: JSON.parse(value) }).extras; await updateSection('extras', extras); setMessage('Draft updated. Publish changes to make it public.') } catch { setMessage('Invalid content. Check the JSON, field lengths and HTTPS links.') } }}>Save page content</button><p role="status">{message}</p></div>
}

