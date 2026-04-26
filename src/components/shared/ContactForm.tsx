'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error' | 'fallback'

const FALLBACK_EMAIL = 'gokulsenthilkumar3@gmail.com'

export function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const formRef = useRef<HTMLFormElement>(null)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim())                          e.name    = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.subject.trim())                       e.subject = 'Subject is required'
    if (form.message.trim().length < 10)            e.message = 'Message must be at least 10 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')
    setStatusMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (data.ok) {
        setStatus('success')
        setStatusMsg(data.message)
        setForm({ name: '', email: '', subject: '', message: '' })
        setErrors({})
      } else if (data.fallback) {
        setStatus('fallback')
        setStatusMsg(data.message)
      } else {
        setStatus('error')
        setStatusMsg(data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setStatusMsg('Network error. Please email me directly.')
    }
  }

  const inputClass = (field: keyof FormState) =>
    `w-full px-3 py-2 text-sm rounded-md border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
      errors[field] ? 'border-destructive' : 'border-border'
    }`

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'var(--font-display)' }}>Send Me a Message</CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'success' ? (
          <div className="flex flex-col items-center text-center py-10 gap-4">
            <span className="text-4xl">✅</span>
            <p className="text-base font-medium">{statusMsg}</p>
            <Button variant="outline" size="sm" onClick={() => setStatus('idle')}>
              Send Another
            </Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name</label>
                <input
                  id="name" type="text" autoComplete="name" required
                  placeholder="Gokul S"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  id="email" type="email" autoComplete="email" required
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-1.5">Subject</label>
              <input
                id="subject" type="text" required
                placeholder="Project collaboration, feedback…"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                className={inputClass('subject')}
              />
              {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5">Message</label>
              <textarea
                id="message" rows={5} required
                placeholder="Hi Gokul, I wanted to reach out about…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className={`${inputClass('message')} resize-none`}
              />
              {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
            </div>

            {/* Status messages */}
            {status === 'error' && (
              <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {statusMsg}{' '}
                <a
                  href={`mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(form.subject)}`}
                  className="underline font-medium"
                >
                  Email directly instead
                </a>
              </div>
            )}
            {status === 'fallback' && (
              <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                {statusMsg}{' '}
                <a
                  href={`mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(form.message)}`}
                  className="underline font-medium"
                >
                  Open email client
                </a>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Or email me at{' '}
              <a href={`mailto:${FALLBACK_EMAIL}`} className="underline">
                {FALLBACK_EMAIL}
              </a>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
