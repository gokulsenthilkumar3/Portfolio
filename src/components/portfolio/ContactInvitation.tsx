'use client'

import { ArrowUp, ArrowUpRight, Check, Copy, Github, Linkedin } from 'lucide-react'
import { useState } from 'react'

interface ContactInvitationProps {
  name: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
}

export function ContactInvitation({ name, email, github, linkedin, twitter }: ContactInvitationProps) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  const backToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (window.__portfolioLenis && !reduced) {
      window.__portfolioLenis.scrollTo(0, { duration: 2 })
      return
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const socialLinks = [
    github && { label: 'GitHub', href: github, icon: <Github aria-hidden="true" /> },
    linkedin && { label: 'LinkedIn', href: linkedin, icon: <Linkedin aria-hidden="true" /> },
    twitter && { label: 'X / Twitter', href: twitter, icon: <ArrowUpRight aria-hidden="true" /> },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: React.ReactNode }>

  return (
    <section id="contact" className="contact-invitation" aria-labelledby="contact-title">
      <div className="contact-invitation__content">
        <p className="contact-invitation__eyebrow">Have a problem worth solving?</p>
        <h2 id="contact-title">Let&apos;s build<br />something worth using.</h2>

        <div className="contact-invitation__email-row">
          <a href={`mailto:${email}`} className="contact-invitation__email" data-cursor="link">
            {email}
          </a>
          <button type="button" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'} data-cursor="link">
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          </button>
          <span className="sr-only" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</span>
        </div>

        <div className="contact-invitation__socials" aria-label="Social profiles">
          {socialLinks.map(({ label, href, icon }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" data-no-transition data-cursor="link">
              {icon}
              <span>{label}</span>
            </a>
          ))}
        </div>
      </div>

      <footer className="contact-invitation__footer">
        <p>{name} © {new Date().getFullYear()}</p>
        <button type="button" onClick={backToTop} data-cursor="link">
          Back to top <ArrowUp aria-hidden="true" />
        </button>
      </footer>
    </section>
  )
}
