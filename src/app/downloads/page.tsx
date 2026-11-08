import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowDownToLine, ArrowUpRight, Monitor, Leaf } from 'lucide-react'
import { getPublishedPortfolio } from '@/lib/server/portfolio'
import { downloadableProjects, readPublicRelease } from '@/lib/downloads'

export const metadata: Metadata = { title: 'Apps & downloads · Gokul Senthilkumar', description: 'Explore my software, see its current release status, and download published desktop builds.' }

export default async function DownloadsPage() {
  const data = await getPublishedPortfolio()
  const products = await Promise.all(downloadableProjects.map(async entry => ({ ...entry, project: data.projects.find(item => item.id === entry.id), release: await readPublicRelease(entry.repository) })))
  return <article className="case-study product-library"><div className="case-study__shell">
    <Link className="case-study__back" href="/#projects">← Back to the work</Link>
    <p className="case-study__eyebrow">INDEPENDENT SOFTWARE / BUILT IN THE OPEN</p>
    <h1>Small tools.<br />A little more life.</h1>
    <p className="case-study__intro">Apps for the things I care about: everyday routines, meaningful work and ideas worth keeping. Explore the projects, then download a build when it is ready.</p>
    <div className="case-study__links"><a href="#apps">Explore the apps <ArrowDownToLine /></a><a href="#install">How to install <ArrowUpRight /></a></div>
    <section id="apps" className="product-library__grid" aria-label="Apps and release downloads">{products.filter(item => item.project).map(({ id, repository, project, release }) => <article key={id} className="product-library__card">
      <p className="case-study__label">{release.state === 'available' ? `PUBLISHED BUILD / ${release.version}` : release.state === 'not-published' ? 'IN DEVELOPMENT / NO INSTALLER PUBLISHED' : 'RELEASE INFORMATION TEMPORARILY UNAVAILABLE'}</p>
      <h2>{project!.title}</h2><p>{project!.description}</p>
      {release.assets.length ? <div className="product-library__assets">{release.assets.map(asset => <div key={asset.url}><span><Monitor aria-hidden="true" />{asset.platform} · {(asset.bytes / 1024 / 1024).toFixed(1)} MB</span><a href={asset.url} data-no-transition><ArrowDownToLine aria-hidden="true" /> Download {asset.name}</a><small>{asset.downloads.toLocaleString('en-IN')} downloads of this asset · version {release.version}</small>{asset.checksum ? <code>{asset.checksum}</code> : <small>Checksum not supplied by the release. Review the release notes before installing.</small>}</div>)}</div> : <p className="product-library__status">{release.state === 'not-published' ? 'The repository is available to explore. A working source project is not automatically a packaged desktop app.' : 'GitHub could not confirm release assets right now. Check the release page for the current status.'}</p>}
      <div className="case-study__links"><Link href={`/projects/${id}/`}>Project & current evidence <ArrowUpRight /></Link><a href={release.releaseUrl} target="_blank" rel="noopener noreferrer">{repository} releases <ArrowUpRight /></a></div>
    </article>)}</section>
    <section id="install" className="product-library__install"><p className="case-study__label">YOUR FIRST INSTALL / ONE STEP AT A TIME</p><h2>From a release to your desktop.</h2><ol><li><strong>Choose a published build.</strong> Match the operating system and architecture listed in its release notes. A source-code ZIP is not a Windows installer.</li><li><strong>Check what you downloaded.</strong> Compare the filename, version and supplied SHA-256 checksum. Review the publisher and signing information.</li><li><strong>Run the installer you chose.</strong> Follow its prompts. If Windows reports an unknown publisher, stop and verify the release rather than bypassing the warning.</li><li><strong>Set up your own workspace.</strong> Follow the app’s setup instructions. Your passwords, records and API keys are not included in my releases.</li><li><strong>Keep it current.</strong> Read the release notes before updating and back up your local records. Automatic updating is only available when that app explicitly supports it.</li></ol></section>
    <aside className="product-library__nature"><Leaf aria-hidden="true" /><div><h2>Built with everyday life in mind.</h2><p>I’m interested in tools that make room for people, useful work and the natural world. Nature-focused concepts will get their own product page with clear evidence and release status when their scope is ready.</p><Link href="/#contact">Talk about a nature-focused idea →</Link></div></aside>
  </div></article>
}
