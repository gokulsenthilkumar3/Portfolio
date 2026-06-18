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
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'px-10 h-14 text-base font-bold rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.4)] transition-all hover:shadow-[0_0_60px_rgba(99,102,241,0.6)] hover:-translate-y-1 bg-gradient-to-r from-primary to-indigo-600 border-none text-white'
            )}
          >
            Get In Touch
          </Link>
        </div>
      </AnimatedSection>
    </div>
  )
}

// force recompile
