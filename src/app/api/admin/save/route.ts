import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/admin/auth'
import { writePortfolioData } from '@/lib/admin/storage'
import { z } from 'zod'

const PORTFOLIO_SECTIONS = new Set([
  'personal', 'about', 'stats', 'projects', 'skills', 'experiences',
  'education', 'certifications', 'socialLinks', 'seo', 'blog', 'microblogs',
])

const PortfolioPayloadSchema = z.record(z.string(), z.unknown()).superRefine((value, context) => {
  if (Object.keys(value).some((key) => !PORTFOLIO_SECTIONS.has(key))) {
    context.addIssue({ code: 'custom', message: 'Unknown portfolio section' })
  }
})

// SECURITY + RELIABILITY FIX
// -----------------------------------------------------------------------
// This route previously had NO authentication check at all — anyone who
// found the endpoint could POST to it. It also tried to overwrite
// `src/config/portfolio.config.ts` (your actual TypeScript source file)
// with a raw JSON dump at runtime via fs.writeFile. That:
//   1. Is a critical vulnerability (unauthenticated write endpoint)
//   2. Would fail on Vercel anyway (read-only production filesystem)
//   3. Would corrupt your source file's TypeScript types even in dev
// This now requires a valid admin session and persists through the same
// KV-backed storage layer as /api/admin/portfolio, instead of touching
// any source file.

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie')
  const token = getTokenFromCookie(cookieHeader)
  return !!(token && verifyToken(token))
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 1_500_000) {
      return NextResponse.json({ error: 'Payload is too large' }, { status: 413 })
    }
    const rawData = await request.json()
    const parsed = PortfolioPayloadSchema.safeParse(rawData)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid portfolio payload' }, { status: 400 })

    await writePortfolioData(parsed.data)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Error saving portfolio data:', err)
    const message = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
