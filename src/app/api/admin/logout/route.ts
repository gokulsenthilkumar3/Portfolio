import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/admin/auth'
import { getCookieName } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set(getCookieName(), '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie')
  const token = getTokenFromCookie(cookieHeader)
  
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
  
  return NextResponse.json({ authenticated: true })
}
