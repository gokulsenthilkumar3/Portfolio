import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// SECURITY FIX: no fallback secret. A hardcoded default that ships in a public
// GitHub repo lets anyone forge a valid admin JWT. If JWT_SECRET is missing,
// admin auth is disabled outright rather than silently insecure.
const JWT_SECRET = process.env.JWT_SECRET
const PIN_HASH = process.env.ADMIN_PIN_HASH || ''
const TOKEN_EXPIRY = '8h'
const COOKIE_NAME = 'portfolio_admin_token'

function requireSecret(): string {
  if (!JWT_SECRET) {
    // Fails loudly in logs instead of quietly issuing forgeable tokens.
    throw new Error(
      'JWT_SECRET is not set. Admin login is disabled until you set JWT_SECRET in your environment (e.g. Vercel Project Settings > Environment Variables).'
    )
  }
  return JWT_SECRET
}

export async function verifyPin(pin: string): Promise<boolean> {
  if (!PIN_HASH) return false
  return bcrypt.compare(pin, PIN_HASH)
}

export function generateToken(): string {
  return jwt.sign(
    { role: 'admin' },
    requireSecret(),
    { 
      expiresIn: TOKEN_EXPIRY,
      issuer: 'gokul-portfolio',
      audience: 'admin-panel'
    }
  )
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, requireSecret(), {
      issuer: 'gokul-portfolio',
      audience: 'admin-panel'
    })
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
  for (const rawCookie of cookieHeader.split(';')) {
    const separator = rawCookie.indexOf('=')
    if (separator < 0) continue
    const key = rawCookie.slice(0, separator).trim()
    if (key !== COOKIE_NAME) continue
    return rawCookie.slice(separator + 1).trim() || null
  }
  return null
}
