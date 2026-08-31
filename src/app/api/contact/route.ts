import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/admin/rate-limit'

// ─────────────────────────────────────────────────────────────────────────────
// Contact Form API route using EmailJS REST API
// ─────────────────────────────────────────────────────────────────────────────
// Setup:
//   1. Create account at https://www.emailjs.com
//   2. Add Gmail service (connect gokulsenthilkumar3@gmail.com)
//   3. Create an Email Template with variables:
//        {{from_name}}, {{from_email}}, {{subject}}, {{message}}
//   4. Copy Service ID, Template ID, Public Key, Private Key
//   5. Add to .env.local:
//        EMAILJS_SERVICE_ID=your_service_id
//        EMAILJS_TEMPLATE_ID=your_template_id
//        EMAILJS_PUBLIC_KEY=your_public_key
//        EMAILJS_PRIVATE_KEY=your_private_key
// ─────────────────────────────────────────────────────────────────────────────

const EMAILJS_SERVICE_ID  = process.env.EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = process.env.EMAILJS_PUBLIC_KEY
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
  website?: string
}

function validatePayload(body: unknown): body is ContactPayload {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  const email = typeof b.email === 'string' ? b.email.trim() : ''
  const subject = typeof b.subject === 'string' ? b.subject.trim() : ''
  const message = typeof b.message === 'string' ? b.message.trim() : ''
  return (
    name.length > 0 && name.length <= 120 &&
    email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    subject.length > 0 && subject.length <= 180 &&
    message.length >= 10 && message.length <= 5000
  )
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get('content-length') || 0)
  if (contentLength > 12000) {
    return NextResponse.json({ ok: false, message: 'Message is too large.' }, { status: 413 })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!validatePayload(body)) {
    return NextResponse.json({ ok: false, message: 'Missing or invalid fields.' }, { status: 422 })
  }

  // Honeypot: quietly accept bot submissions without sending mail or exposing
  // whether the endpoint is configured.
  if (typeof body.website === 'string' && body.website.trim()) {
    return NextResponse.json({ ok: true, message: 'Message received.' })
  }

  const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown').split(',')[0].trim().slice(0, 128)
  const { success } = await rateLimit(`contact:${ip}`, 3, 3600000) // 3 emails per hour
  if (!success) {
    return NextResponse.json({ ok: false, message: 'Too many messages sent. Please try again later.' }, { status: 429 })
  }

  // Check env vars are configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.warn('[contact] EmailJS env vars not configured — falling back to mailto')
    return NextResponse.json(
      { ok: false, fallback: true, message: 'Email service not configured. Please use the mailto link below.' },
      { status: 503 }
    )
  }

  const { name, email, subject, message } = body
  const normalizedName = name.trim()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedSubject = subject.trim()
  const normalizedMessage = message.trim()

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:  EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id:     EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name:  normalizedName,
          from_email: normalizedEmail,
          subject: normalizedSubject,
          message: normalizedMessage,
          reply_to:   normalizedEmail,
        },
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('[contact] EmailJS error:', errText)
      return NextResponse.json({ ok: false, message: 'Failed to send. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true, message: 'Message sent! I\'ll reply within 24h.' })
  } catch (err) {
    console.error('[contact] Unexpected error:', err)
    return NextResponse.json({ ok: false, message: 'Server error. Please email me directly.' }, { status: 500 })
  }
}
