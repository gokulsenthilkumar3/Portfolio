import type { Metadata, Viewport } from 'next'
import 'lenis/dist/lenis.css'
import '../styles/globals.css'
import '../styles/cinematic.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { AdminClientWrapper } from '@/components/admin/AdminClientWrapper'
import { Toaster } from 'sonner'
import { getPublishedPortfolio } from '@/lib/admin/published'
import { Analytics } from '@vercel/analytics/react'
import { PublicChrome } from '@/components/shared/PublicChrome'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedPortfolio()
  const base = process.env.NEXT_PUBLIC_SITE_URL || seo.siteUrl
  return {
    metadataBase: new URL(base),
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: seo.author }],
    alternates: { canonical: base },
    openGraph: {
      title: seo.title, description: seo.description, type: 'website', url: base,
      siteName: seo.author,
      images: [{ url: seo.ogImage, width: 1200, height: 630, alt: `${seo.author} portfolio` }],
    },
    twitter: { card: 'summary_large_image', title: seo.title, description: seo.description, images: [seo.ogImage] },
    icons: { icon: '/favicon.ico' },
  }
}

// Separate viewport export — avoids Next.js metadata warning
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#080808' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialData = await getPublishedPortfolio()
  const { personal, seo } = initialData
  const base = process.env.NEXT_PUBLIC_SITE_URL || seo.siteUrl
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: personal.name,
    url: base, sameAs: [personal.github, personal.linkedin, personal.twitter].filter(Boolean),
    jobTitle: personal.title,
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to font provider — speeds up first font fetch */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        {/* dns-prefetch as fallback for browsers that ignore preconnect */}
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        {/*
          Load fonts as non-blocking:
          1. Preload the stylesheet so the browser discovers it early.
          2. Set media="print" so it does not block render.
          3. Inline script swaps media to "all" once loaded (FOUC prevention).
          4. <noscript> fallback for JS-disabled environments.
        */}
        <link
          rel="preload"
          as="style"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700&display=swap"
        />
        {/* JSON-LD structured data for Google Search rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Skip-to-content — standard a11y pattern for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <AdminClientWrapper initialData={initialData}>
            <PublicChrome />
            <main id="main-content">{children}</main>
            {/* Toaster lives here so it's available to all sections */}
            <Toaster position="bottom-right" richColors closeButton />
          </AdminClientWrapper>
        </ThemeProvider>
        {/* Vercel Analytics — privacy-first, no cookies */}
        <Analytics />
      </body>
    </html>
  )
}
