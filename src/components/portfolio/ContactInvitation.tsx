'use client'

import { ArrowUp, Check, Copy, Github, Linkedin, LoaderCircle, Send } from 'lucide-react'
import { FormEvent, useState } from 'react'

interface ContactInvitationProps {
  name: string
  email: string
  github?: string
  linkedin?: string
  twitter?: string
  heading: string
  description: string
}

export function ContactInvitation({ name, email, github, linkedin, twitter, heading, description }: ContactInvitationProps) {
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

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
      window.__portfolioLenis.scrollTo(0, { duration: 1 })
      return
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  const submitContactForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setStatusMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok || !result?.ok) {
        setStatus('error')
        setStatusMessage(result?.message || 'Something went wrong. Please email me directly.')
        return
      }

      form.reset()
      setStatus('success')
      setStatusMessage(result.message || 'Message sent! I’ll reply within 24h.')
    } catch {
      setStatus('error')
      setStatusMessage('Unable to send right now. Please email me directly.')
    }
  }

  const socialLinks = [
    github && { label: 'GitHub', href: github, icon: <Github aria-hidden="true" /> },
    linkedin && { label: 'LinkedIn', href: linkedin, icon: <Linkedin aria-hidden="true" /> },
    twitter && {
      label: 'X / Twitter',
      href: twitter,
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: React.ReactNode }>

  const firstName = name.split(' ')[0] || 'Gokul'

  return (
    <section id="contact" className="contact-invitation" aria-labelledby="contact-title">
      <div className="contact-invitation__content">
        <p className="contact-invitation__eyebrow">A note from {firstName}</p>
        <h2 id="contact-title">{heading}</h2>
        <p className="contact-invitation__description">{description}</p>

        <div className="contact-invitation__form-shell">
          <form className="contact-invitation__form" onSubmit={submitContactForm}>
            <div className="contact-invitation__form-fields">
              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" placeholder="Your name" maxLength={120} required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
              </label>
              <label className="contact-invitation__form-wide">
                <span>Subject</span>
                <input name="subject" type="text" placeholder="What would you like to talk about?" maxLength={180} required />
              </label>
              <label className="contact-invitation__form-wide">
                <span>Message</span>
                <textarea name="message" rows={5} placeholder="A little context goes a long way..." minLength={10} maxLength={5000} required />
              </label>
              <label className="contact-invitation__honeypot" aria-hidden="true">
                <span>Website</span>
                <input name="website" type="text" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="contact-invitation__form-actions">
              <button type="submit" disabled={status === 'sending'} data-cursor="link">
                {status === 'sending' ? <LoaderCircle aria-hidden="true" className="is-spinning" /> : <Send aria-hidden="true" />}
                {status === 'sending' ? 'Sending...' : 'Send message'}
              </button>
              <p className={`contact-invitation__form-status is-${status}`} role="status" aria-live="polite">
                {statusMessage}
              </p>
            </div>
          </form>

          <div className="contact-invitation__direct">
            <span className="contact-invitation__direct-label">Prefer email?</span>
            <div className="contact-invitation__email-row">
              <a href={`mailto:${email}`} className="contact-invitation__email" data-cursor="link" data-no-transition>
                {email}
              </a>
              <button type="button" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'} data-cursor="link">
                {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
              </button>
              <span className="sr-only" aria-live="polite">{copied ? 'Email copied to clipboard' : ''}</span>
            </div>
          </div>
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
