'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { portfolioConfig } from '@/config/portfolio.config'
import Link from 'next/link'

const { personal, socialLinks: configSocials } = portfolioConfig
const emailZoho = (personal as any).emailZoho || 'gokulsenthilkumar3@zohomail.in'

const CONTACT_CHANNELS = [
  {
    id: 'gmail',
    label: 'Gmail',
    value: personal.email,
    href: `mailto:${personal.email}`,
    description: 'Best for professional inquiries',
    color: '#EA4335',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
  {
    id: 'zoho',
    label: 'Zoho Mail',
    value: emailZoho,
    href: `mailto:${emailZoho}`,
    description: 'Alternative contact',
    color: '#F15A29',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'gokulsenthilkumar3',
    href: personal.linkedin || 'https://www.linkedin.com/in/gokulsenthilkumar3/',
    description: 'Connect professionally',
    color: '#0A66C2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'gokulsenthilkumar3',
    href: personal.github || 'https://github.com/gokulsenthilkumar3',
    description: 'Check out my code',
    color: '#ffffff',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    value: '@GokulKangeyanS',
    href: personal.twitter || 'https://x.com/GokulKangeyanS',
    description: 'Follow for updates',
    color: '#1DA1F2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
      aria-label="Copy to clipboard"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export function ContactPageClient() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <AnimatedSection animation="slideDown">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Open to opportunities
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-display mb-4 tracking-tight">Get In Touch</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Whether it&apos;s a job opportunity, collaboration, or just a hello — I&apos;d love to hear from you.
            </p>
          </div>
        </AnimatedSection>

        {/* Contact cards */}
        <div className="space-y-3">
          {CONTACT_CHANNELS.map((channel, i) => (
            <AnimatedSection key={channel.id} animation="slideUp" delay={i * 0.07}>
              <div className="group flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-border transition-all duration-300 hover:bg-card/60">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10 bg-white/5 transition-all duration-300 group-hover:scale-105"
                  style={{ color: channel.color }}
                >
                  {channel.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold">{channel.label}</span>
                    <span className="text-xs text-muted-foreground">· {channel.description}</span>
                  </div>
                  <span className="text-sm text-muted-foreground truncate block">{channel.value}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {(channel.id === 'gmail' || channel.id === 'zoho') && (
                    <CopyButton text={channel.value} />
                  )}
                  <Link
                    href={channel.href}
                    target={channel.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    {channel.href.startsWith('mailto') ? 'Send Mail' : 'Open'}
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Availability note */}
        <AnimatedSection animation="fadeIn" delay={0.5}>
          <div className="mt-10 p-5 rounded-2xl border border-primary/20 bg-primary/5 text-center">
            <p className="text-sm text-muted-foreground">
              💬 Usually responds within <span className="text-foreground font-medium">24 hours</span> on Gmail or LinkedIn.
            </p>
          </div>
        </AnimatedSection>

        {/* Back home */}
        <AnimatedSection animation="fadeIn" delay={0.6}>
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to home
            </Link>
          </div>
        </AnimatedSection>

      </div>
    </main>
  )
}
