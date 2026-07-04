import type { Metadata, Viewport } from 'next'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Navigation } from '@/components/shared/Navigation'
import { Footer } from '@/components/shared/Footer'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { SectionIndicator } from '@/components/shared/SectionIndicator'
import { AdminClientWrapper } from '@/components/admin/AdminClientWrapper'
import { Toaster } from 'sonner'
import { seo, personal } from '@/lib/data/content'
import { LiquidTransitionsWrapper } from '@/components/effects/LiquidTransitionsWrapper'

const BASE_URL = seo.siteUrl || personal.website || 'https://portfolio-ten-plum-98.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: seo.author }],
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: 'website',
    url: seo.siteUrl,
    siteName: seo.author,
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: `${seo.author} — SDET & Full-Stack Developer` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    creator: '@GokulKangeyanS',
    images: [`${BASE_URL}/og-image.png`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

// Separate viewport export — avoids Next.js metadata warning
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#09090b' },
  ],
}

const sections = [
  { id: 'home',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'skills',   label: 'Skills'   },
  { id: 'projects', label: 'Projects' },
  { id: 'github',   label: 'GitHub'   },
  { id: 'insights', label: 'Insights' },
  { id: 'contact',  label: 'Contact'  },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to font provider — speeds up first font fetch */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        {/* dns-prefetch as fallback for browsers that ignore preconnect */}
        <link rel="dns-prefetch" href="//api.fontshare.com" />
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
          href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=satoshi@300,400,500,700&display=swap"
        />
        <link
          id="fontshare-css"
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=satoshi@300,400,500,700&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.getElementById('fontshare-css');if(l){l.onload=function(){l.media='all'};if(l.sheet)l.media='all';}})();`,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=satoshi@300,400,500,700&display=swap"
          />
        </noscript>
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AdminClientWrapper>
            <LiquidTransitionsWrapper />
            <ProgressBar />
            <Navigation />
            <main id="main-content">{children}</main>
            <Footer />
            <ScrollToTop />
            <SectionIndicator sections={sections} />
            {/* Toaster lives here so it's available to all sections */}
            <Toaster position="bottom-right" richColors closeButton />
          </AdminClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
