import type { Metadata } from 'next'
import { portfolioConfig } from '@/config/portfolio.config'
import { ContactPageClient } from './ContactPageClient'

export const metadata: Metadata = {
  title: `Contact | ${portfolioConfig.personal.name}`,
  description: 'Get in touch with Gokul Senthilkumar — SDET & Full-Stack Developer.',
}

export default function ContactPage() {
  return <ContactPageClient />
}
