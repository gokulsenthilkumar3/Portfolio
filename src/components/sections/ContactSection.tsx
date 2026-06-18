'use client'

/**
 * ContactSection
 *
 * Updated:
 * - Two email buttons: Gmail + Zoho Mail
 * - LinkedIn CTA
 * - Optional: extensible for more social links
 */

import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { cn } from '@/lib/utils/cn'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/Button'

interface Props {
  heading?: string
  desc?: string
  email: string
  emailZoho?: string
  linkedin?: string
  github?: string
  twitter?: string
}

export function ContactSection({
  heading = 'Get In Touch',
  desc = "Open to interesting conversations and opportunities.",
  email,
  emailZoho,
  linkedin,
  github,
  twitter,
}: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <AnimatedSection animation="slideDown">
        <h2 className="text-3xl font-bold mb-2 font-display">{heading}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{desc}</p>
      </AnimatedSection>

      <AnimatedSection animation="scaleIn" delay={0.2}>
        {/* Primary email actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {/* Gmail */}
          <Link
            href={`mailto:${email}`}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'px-6 h-12 rounded-xl gap-2'
            )}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
            </svg>
            Gmail
          </Link>

          {/* Zoho Mail */}
          {emailZoho && (
            <Link
              href={`mailto:${emailZoho}`}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'px-6 h-12 rounded-xl gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
              Zoho Mail
            </Link>
          )}
        </div>

        {/* Secondary: social links */}
        <div className="flex flex-wrap justify-center gap-2">
          {linkedin && (
            <Link
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'rounded-xl gap-1.5 text-muted-foreground hover:text-foreground'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </Link>
          )}
          {github && (
            <Link
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'rounded-xl gap-1.5 text-muted-foreground hover:text-foreground'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </Link>
          )}
          {twitter && (
            <Link
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'sm' }),
                'rounded-xl gap-1.5 text-muted-foreground hover:text-foreground'
              )}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.626L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
              X / Twitter
            </Link>
          )}
        </div>

        {/* Email display chips */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <a
            href={`mailto:${email}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono bg-muted/40 px-3 py-1.5 rounded-full border border-border/50"
          >
            {email}
          </a>
          {emailZoho && (
            <a
              href={`mailto:${emailZoho}`}
              className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono bg-muted/40 px-3 py-1.5 rounded-full border border-border/50"
            >
              {emailZoho}
            </a>
          )}
        </div>
      </AnimatedSection>
    </div>
  )
}
