import type { Metadata } from 'next'
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

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl || personal.website || 'https://portfolio-ten-plum-98.vercel.app'),
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
    images: [
      {
        url: `${seo.siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${seo.author} - SDET & Full-Stack Developer`,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
    creator: '@GokulKangeyanS',
    images: [`${seo.siteUrl}/og-image.png`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'github', label: 'GitHub' },
  { id: 'insights', label: 'Insights' },
  { id: 'contact', label: 'Contact' }
]

import { LiquidTransitionsWrapper } from '@/components/effects/LiquidTransitionsWrapper'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
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
            __html: `
              (function() {
                var link = document.getElementById('fontshare-css');
                if (link) {
                  link.addEventListener('load', function() { this.media = 'all'; });
                  if (link.sheet) link.media = 'all';
                }
              })();
            `
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
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
            <SectionIndicator sections={sections} />
          </AdminClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
