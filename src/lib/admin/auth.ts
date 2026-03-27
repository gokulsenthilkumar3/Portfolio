import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const PIN_HASH = process.env.ADMIN_PIN_HASH || ''
const TOKEN_EXPIRY = '8h'
const COOKIE_NAME = 'portfolio_admin_token'

export async function verifyPin(pin: string): Promise<boolean> {
  if (!PIN_HASH) return false
  return bcrypt.compare(pin, PIN_HASH)
}

export function generateToken(): string {
  return jwt.sign(
    { role: 'admin', iat: Date.now() },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  )
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export function getCookieName(): string {
  return COOKIE_NAME
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  return cookies[COOKIE_NAME] || null
}
