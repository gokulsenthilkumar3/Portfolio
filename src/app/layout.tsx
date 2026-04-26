import type { Metadata } from 'next'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Navigation } from '@/components/shared/Navigation'
import { Footer } from '@/components/shared/Footer'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { SectionIndicator } from '@/components/shared/SectionIndicator'
import { CustomizationPanel } from '@/components/shared/CustomizationPanel'
import { AdminClientWrapper } from '@/components/admin/AdminClientWrapper'
import { seo, personal } from '@/lib/data/content'

export const metadata: Metadata = {
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
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' }
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Boska (display) + Satoshi (body) via Fontshare */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=boska@400,500,700&f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body>
        <ThemeProvider>
          <AdminClientWrapper>
            <ProgressBar />
            <Navigation />
            <main>{children}</main>
            <Footer />
            <ScrollToTop />
            <SectionIndicator sections={sections} />
            <CustomizationPanel />
          </AdminClientWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
