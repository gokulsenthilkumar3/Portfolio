import type { MetadataRoute } from 'next'
import { seo } from '@/lib/data/content'

const base = seo.siteUrl || 'https://portfolio-ten-plum-98.vercel.app'

export default function robots(): MetadataRoute.Robots {
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
