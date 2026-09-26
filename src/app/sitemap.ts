import type { MetadataRoute } from 'next'
import { getPublishedPortfolio } from '@/lib/admin/published'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPublishedPortfolio()
  const base = process.env.NEXT_PUBLIC_SITE_URL || data.seo.siteUrl
  return [
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
