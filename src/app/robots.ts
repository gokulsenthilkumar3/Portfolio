import type { MetadataRoute } from 'next'
import { getPublishedPortfolio } from '@/lib/server/portfolio'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const data = await getPublishedPortfolio()
  const base = process.env.NEXT_PUBLIC_SITE_URL || data.seo.siteUrl
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
