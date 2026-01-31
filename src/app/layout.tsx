import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { Navigation } from '@/components/shared/Navigation'
import { Footer } from '@/components/shared/Footer'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { SectionIndicator } from '@/components/shared/SectionIndicator'
import { CustomizationPanel } from '@/components/shared/CustomizationPanel'
import { seo } from '@/lib/data/content'

const inter = Inter({ subsets: ['latin'] })

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
  },
  twitter: {
    card: 'summary_large_image',
    title: seo.title,
    description: seo.description,
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
      <body className={inter.className}>
        <ThemeProvider>
          <ProgressBar />
          <Navigation />
          <main>{children}</main>
          <Footer />
          <ScrollToTop />
          <SectionIndicator sections={sections} />
          <CustomizationPanel />
        </ThemeProvider>
      </body>
    </html>
  )
}
