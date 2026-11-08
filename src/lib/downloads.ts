export type DownloadAsset = { name: string; url: string; bytes: number; downloads: number; platform: string; checksum: string | null }
export type ReleaseResult = { state: 'available' | 'not-published' | 'unavailable'; version: string | null; releaseUrl: string; assets: DownloadAsset[] }
export const downloadableProjects = [
  { id: 'ultimate', repository: 'Ultimate' },
  { id: 'evergreen', repository: 'Evergreen' },
  { id: 'nexora', repository: 'Nexora' },
  { id: 'findthemnow', repository: 'FindThemNow' },
]

export function releaseAssets(repository: string, release: Record<string, unknown>): DownloadAsset[] {
  const expected = `/gokulsenthilkumar3/${repository}/releases/download/`
  return (Array.isArray(release.assets) ? release.assets : []).slice(0, 100).flatMap(asset => {
    if (!asset || typeof asset !== 'object') return []
    const item = asset as Record<string, unknown>
    if (typeof item.name !== 'string' || !/\.(exe|msi|msix|dmg|appimage|deb|rpm|zip)$/i.test(item.name) || typeof item.browser_download_url !== 'string') return []
    let url: URL
    try { url = new URL(item.browser_download_url) } catch { return [] }
    if (url.protocol !== 'https:' || url.hostname !== 'github.com' || !url.pathname.startsWith(expected) || url.username || url.password) return []
    const extension = item.name.toLowerCase().split('.').pop()
    const platform = ['exe', 'msi', 'msix'].includes(extension || '') ? 'Windows' : extension === 'dmg' ? 'macOS' : ['appimage', 'deb', 'rpm'].includes(extension || '') ? 'Linux' : 'Archive · check release notes'
    return [{ name: item.name, url: url.href, bytes: typeof item.size === 'number' && item.size >= 0 ? item.size : 0,
      downloads: typeof item.download_count === 'number' && item.download_count >= 0 ? item.download_count : 0, platform,
      checksum: typeof item.digest === 'string' && /^sha256:[a-f\d]{64}$/i.test(item.digest) ? item.digest : null }]
  })
}

export async function readPublicRelease(repository: string, fetchImpl: typeof fetch = fetch): Promise<ReleaseResult> {
  if (!downloadableProjects.some(project => project.repository === repository)) throw new Error('Unlisted product repository')
  const releaseUrl = `https://github.com/gokulsenthilkumar3/${repository}/releases`
  const empty = { version: null, releaseUrl, assets: [] }
  try {
    const response = await fetchImpl(`https://api.github.com/repos/gokulsenthilkumar3/${repository}/releases?per_page=10`, {
      headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      redirect: 'error', signal: AbortSignal.timeout(8000), next: { revalidate: 1800 },
    } as RequestInit)
    if (!response.ok) return { ...empty, state: 'unavailable' }
    const list: unknown = await response.json()
    if (!Array.isArray(list)) return { ...empty, state: 'unavailable' }
    for (const release of list.slice(0, 10)) {
      if (!release || release.draft || release.prerelease) continue
      const assets = releaseAssets(repository, release)
      if (assets.length) return { assets, releaseUrl, state: 'available', version: typeof release.tag_name === 'string' ? release.tag_name : 'Published release' }
    }
    return { ...empty, state: 'not-published' }
  } catch { return { ...empty, state: 'unavailable' } }
}
