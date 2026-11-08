'use client'
import { useEffect, useState } from 'react'
export function ReadingProgress() {
 const [progress, setProgress] = useState(0)
 useEffect(() => {
  const update = () => { const remaining = document.documentElement.scrollHeight - window.innerHeight; setProgress(remaining > 0 ? Math.min(100, window.scrollY / remaining * 100) : 100) }
  update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
  return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
 }, [])
 return <div className="reading-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: progress + '%' }} /></div>
}

