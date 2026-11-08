import type { MetadataRoute } from 'next'
import { getPublishedPortfolio } from '@/lib/server/portfolio'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPublishedPortfolio()
  const base = process.env.NEXT_PUBLIC_SITE_URL || data.seo.siteUrl
  return [
    ...['now', 'uses', 'resume', 'blog', 'guestbook'].map(path => ({ url: base + '/' + path, changeFrequency: 'monthly' as const, priority: 0.6 })),
    ...data.blog.map(post => ({ url: base + '/blog/' + (post.slug || post.id), changeFrequency: 'monthly' as const, priority: 0.6 })),
    { url: `${base}/downloads/`, changeFrequency: 'weekly', priority: 0.8 },
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...data.projects.filter((project) => project.kind !== 'research').map((project) => ({
      url: `${base}/projects/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
