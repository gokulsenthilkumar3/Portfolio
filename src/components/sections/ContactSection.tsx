'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Send, ArrowUp, MapPin, MessageSquare, Copy, Check } from 'lucide-react'

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
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, text: string, label: string) => {
    e.preventDefault()
    navigator.clipboard.writeText(text)
    setCopiedLabel(label)
    setTimeout(() => setCopiedLabel(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await fetch(`mailto:${email}?subject=Portfolio Contact: ${form.name}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`)
      setStatus('sent')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const socials = [
    { icon: Mail, label: 'Email', href: `mailto:${email}`, color: 'text-red-400' },
    ...(emailZoho ? [{ icon: Mail, label: 'Zoho Mail', href: `mailto:${emailZoho}`, color: 'text-indigo-400' }] : []),
    { icon: Github, label: 'GitHub', href: github || 'https://github.com/gokulsenthilkumar3', color: 'text-gray-300' },
    { icon: Linkedin, label: 'LinkedIn', href: linkedin || '#', color: 'text-blue-400' },
    ...(twitter ? [{ icon: Twitter, label: 'Twitter', href: twitter, color: 'text-sky-400' }] : []),
  ]

  return (
    <div className="max-w-4xl mx-auto" id="contact">
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
          <form
            onSubmit={handleSubmit}
            action={`mailto:${email}`}
            method="get"
            className="space-y-4 relative z-10"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Gokul Senthilkumar"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Your Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="How can I help you?"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {status === 'idle' && <><Send className="w-4 h-4" /> Send Message</>}
              {status === 'sending' && <span className="animate-pulse">Sending...</span>}
              {status === 'sent' && <span>Sent Successfully!</span>}
              {status === 'error' && <span>Open Mail Client</span>}
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
              {socials.map(({ icon: Icon, label, href, color }) => (
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
                      <div className="text-xs text-muted-foreground">
                        {label === 'Email' ? email : label === 'Zoho Mail' ? emailZoho : `@gokulsenthilkumar3`}
                      </div>
                    </div>
                  </a>
                  <button
                    onClick={(e) => handleCopy(e, href.replace('mailto:', ''), label)}
                    className="absolute right-3 p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary opacity-0 group-hover/item:opacity-100 transition-all"
                    title={`Copy ${label}`}
                  >
                    {copiedLabel === label ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border/50 hover:border-primary/50 hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all group"
        >
          <ArrowUp className="h-4 w-4 group-hover:-translate-y-1 transition-transform" />
          Back to Top
        </button>
      </motion.div>
    </div>
  )
}
