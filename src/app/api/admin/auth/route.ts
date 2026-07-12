import { NextRequest, NextResponse } from 'next/server'
import { verifyPin, generateToken, getCookieName } from '@/lib/admin/auth'
import { rateLimit } from '@/lib/admin/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const { success } = await rateLimit(`admin-auth:${ip}`, 5, 60000) // 5 attempts per minute
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
    }

    const { pin } = await request.json()

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const isValid = await verifyPin(pin)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 })
    }

    const token = generateToken()
    const response = NextResponse.json({ success: true })

    response.cookies.set(getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    })

    return response
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
