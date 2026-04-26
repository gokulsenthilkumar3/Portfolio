import { NextRequest, NextResponse } from 'next/server'

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
}

function validatePayload(body: unknown): body is ContactPayload {
  if (typeof body !== 'object' || body === null) return false
  const b = body as Record<string, unknown>
  return (
    typeof b.name === 'string'    && b.name.trim().length > 0 &&
    typeof b.email === 'string'   && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) &&
    typeof b.subject === 'string' && b.subject.trim().length > 0 &&
    typeof b.message === 'string' && b.message.trim().length >= 10
  )
}

export async function POST(req: NextRequest) {
  // Check env vars are configured
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
    console.warn('[contact] EmailJS env vars not configured — falling back to mailto')
    return NextResponse.json(
      { ok: false, fallback: true, message: 'Email service not configured. Please use the mailto link below.' },
      { status: 503 }
    )
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON body.' }, { status: 400 })
  }

  if (!validatePayload(body)) {
    return NextResponse.json({ ok: false, message: 'Missing or invalid fields.' }, { status: 422 })
  }

  const { name, email, subject, message } = body

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
          from_name:  name,
          from_email: email,
          subject,
          message,
          reply_to:   email,
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
