'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Send, ArrowUp, MapPin, MessageSquare, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export function ContactSection({
  heading = 'Get In Touch',
  desc = 'Open to interesting conversations and opportunities.',
  email = 'gokulsenthilkumar3@gmail.com',
  linkedin = 'https://linkedin.com/in/gokulsenthilkumar3',
  github = 'https://github.com/gokulsenthilkumar3',
  twitter,
  emailZoho,
}: {
  heading?: string
  desc?: string
  email?: string
  emailZoho?: string
  linkedin?: string
  github?: string
  twitter?: string
}) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault()
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {})
    }
    setCopiedLabel(label)
    setTimeout(() => setCopiedLabel(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    
    // Honeypot check: If the hidden field is filled, silently ignore it
    if (form.honeypot) {
      toast.success('Message sent! I\'ll reply within 24h. 🎉')
      setForm({ name: '', email: '', subject: '', message: '', honeypot: '' })
      return
    }

    setStatus('sending')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok && data.ok) {
        setStatus('sent')
        setForm({ name: '', email: '', subject: '', message: '', honeypot: '' })
        toast.success(data.message || 'Message sent! I\'ll reply within 24h. 🎉')
        setTimeout(() => setStatus('idle'), 4000)
      } else if (data.fallback) {
        // EmailJS not configured — open native mail client as fallback
        setStatus('idle')
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(form.subject || 'Portfolio Contact: ' + form.name)}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`
        toast.info('Opening your mail client as fallback.')
      } else {
        setStatus('error')
        toast.error(data.message || 'Failed to send. Please try again.')
        setTimeout(() => setStatus('idle'), 3000)
      }
    } catch {
      setStatus('error')
      toast.error('Network error. Please email me directly.')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const socials = [
    { icon: Mail, label: 'Email', href: `mailto:${email}`, copyText: email, color: 'text-red-400' },
    ...(emailZoho ? [{ icon: Mail, label: 'Zoho Mail', href: `mailto:${emailZoho}`, copyText: emailZoho, color: 'text-indigo-400' }] : []),
    {
      icon: Github,
      label: 'GitHub',
      href: github || 'https://github.com/gokulsenthilkumar3',
      copyText: github || 'https://github.com/gokulsenthilkumar3',
      color: 'text-gray-300',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: linkedin || '#',
      copyText: linkedin || '#',
      color: 'text-blue-400',
    },
    ...(twitter ? [{ icon: Twitter, label: 'Twitter', href: twitter, copyText: twitter, color: 'text-sky-400' }] : []),
  ]

  const subLabel = (label: string) => {
    if (label === 'Email') return email
    if (label === 'Zoho Mail') return emailZoho
    if (label === 'GitHub') return github?.replace('https://github.com/', '@')
    if (label === 'LinkedIn') return linkedin?.replace('https://linkedin.com/in/', '@')
    if (label === 'Twitter') return twitter?.replace('https://x.com/', '@') || twitter?.replace('https://twitter.com/', '@')
    return ''
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm text-primary font-medium">Contact</span>
        </div>
        <h2 className="text-4xl font-bold mb-4 font-display">{heading}</h2>
        <p className="text-muted-foreground max-w-md mx-auto">{desc}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <h3 className="text-lg font-semibold mb-4 relative z-10">Send a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div aria-live="polite" className="sr-only">
              {status === 'sending' && 'Sending message...'}
              {status === 'sent' && 'Message sent successfully!'}
              {status === 'error' && 'Failed to send message. Please try again.'}
            </div>
            <div>
              <label htmlFor="contact-name" className="text-sm text-muted-foreground mb-1 block">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Gokul Senthilkumar"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="text-sm text-muted-foreground mb-1 block">Your Email</label>
              <input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="text-sm text-muted-foreground mb-1 block">Subject</label>
              <input
                id="contact-subject"
                type="text"
                required
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                placeholder="Project inquiry, collaboration..."
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                id="contact-message"
                required
                rows={4}
                minLength={10}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="How can I help you?"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-inner"
              />
            </div>
            {/* Honeypot hidden field */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={form.honeypot}
                onChange={e => setForm(f => ({ ...f, honeypot: e.target.value }))}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {status === 'idle'    && <><Send className="w-4 h-4" /> Send Message</>}
              {status === 'sending' && <span className="animate-pulse">Sending...</span>}
              {status === 'sent'    && <span>✓ Sent Successfully!</span>}
              {status === 'error'   && <><Send className="w-4 h-4" /> Try Again</>}
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/20 backdrop-blur-xl p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_20px_40px_-10px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="space-y-3">
              {socials.map(({ icon: Icon, label, href, copyText, color }) => (
                <div key={label} className="relative flex items-center group/item">
                  <a
                    href={href}
                    target={href.startsWith('mailto') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
                  >
                    <div className={`p-2 rounded-lg bg-background/60 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium group-hover/item:text-primary transition-colors">{label}</div>
                      <div className="text-xs text-muted-foreground">{subLabel(label)}</div>
                    </div>
                  </a>
                  <button
                    onClick={(e) => handleCopy(e, copyText, label)}
                    className="absolute right-3 p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary opacity-0 group-hover/item:opacity-100 transition-all"
                    title={`Copy ${label}`}
                    aria-label={`Copy ${label}`}
                    type="button"
                  >
                    {copiedLabel === label
                      ? <Check className="h-4 w-4 text-green-500" />
                      : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm mt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-muted-foreground text-sm">Sivanmalai, Tamil Nadu, India</p>
            <p className="text-muted-foreground text-sm mt-1">Available for remote opportunities worldwide</p>
          </div>
        </motion.div>
      </div>

      {/* Back to Top */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <button
          onClick={scrollToTop}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all group"
        >
          <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          Back to Top
        </button>
      </motion.div>
    </div>
  )
}
