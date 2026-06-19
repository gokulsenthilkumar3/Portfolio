'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Twitter, Send, ArrowUp, MapPin, MessageSquare } from 'lucide-react'

export function ContactSection({
  heading = 'Get In Touch',
  desc = 'Open to interesting conversations and opportunities.',
  email = 'gokulsenthilkumar3@gmail.com',
  linkedin = 'https://linkedin.com/in/gokulsenthilkumar3',
  github = 'https://github.com/gokulsenthilkumar3',
  twitter,
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
          className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
          <form
            onSubmit={handleSubmit}
            action={`mailto:${email}`}
            method="get"
            className="space-y-4"
          >
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Your Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Gokul Senthilkumar"
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                placeholder="Hey Gokul, I'd love to work with you on..."
                className="w-full bg-background/60 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-primary/25 disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Connect With Me</h3>
            <div className="space-y-3">
              {socials.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
                >
                  <div className={`p-2 rounded-lg bg-background/60 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium group-hover:text-primary transition-colors">{label}</div>
                    <div className="text-xs text-muted-foreground">
                      {label === 'Email' ? email : `@gokulsenthilkumar3`}
                    </div>
                  </div>
                </a>
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
