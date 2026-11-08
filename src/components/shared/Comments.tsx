'use client'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { portfolioConfig } from '@/config/portfolio.config'
const Giscus = dynamic(() => import('@giscus/react'), { ssr: false })
const Scene = dynamic(() => import('@/components/3d/GuestbookScene').then(m => m.GuestbookScene), { ssr: false })
export function Comments({ scene = false }: { scene?: boolean }) {
 const [enabled, setEnabled] = useState(false)
 const [showScene, setShowScene] = useState(false)
 const config = portfolioConfig.giscus
 return <section className="comments">
 {scene && <><button onClick={() => setShowScene(v => !v)} aria-pressed={showScene}>{showScene ? 'Hide' : 'Explore'} 3D sculpture</button>{showScene && <Scene className="guestbook-scene" />}</>}
 <h2>{scene ? 'Leave a note' : 'Discussion'}</h2>
 <p>Comments are hosted on GitHub Discussions. Sign in with GitHub to write a note.</p>
 <a href={'https://github.com/' + config.repo + '/discussions'} target="_blank" rel="noreferrer">Open discussions on GitHub</a>
 {!enabled ? <button onClick={() => setEnabled(true)}>Load comments from GitHub</button> : <Giscus repo={config.repo as `${string}/${string}`} repoId={config.repoId} category={config.category} categoryId={config.categoryId} mapping="pathname" strict="1" reactionsEnabled="1" emitMetadata="0" inputPosition="top" theme="dark" lang="en" loading="lazy" />}
 </section>
}

