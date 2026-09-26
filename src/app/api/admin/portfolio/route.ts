import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/admin/auth'
import { readPortfolioData, updatePortfolioSection } from '@/lib/admin/storage'
import { getPublishedPortfolio } from '@/lib/admin/published'
import { z } from 'zod'

const SectionSchema = z.enum([
  'personal', 'stats', 'projects', 'skills', 'experiences', 
  'socialLinks', 'seo', 'blog', 'microblogs', 'education', 'certifications', 'about'
])

const PayloadSchema = z.object({
  section: SectionSchema,
  data: z.unknown()
})

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie')
  const token = getTokenFromCookie(cookieHeader)
  return !!(token && verifyToken(token))
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [storedData, published] = await Promise.all([readPortfolioData(), getPublishedPortfolio()])
  const merged = { ...published, ...storedData }
  const hasUnpublishedDraft = Object.entries(storedData).some(([key, value]) =>
    JSON.stringify((published as unknown as Record<string, unknown>)[key]) !== JSON.stringify(value)
  )

  return NextResponse.json(merged, { headers: { 'X-Portfolio-Has-Draft': String(hasUnpublishedDraft) } })
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > 1_500_000) {
      return NextResponse.json({ error: 'Payload is too large' }, { status: 413 })
    }
    const body = await request.json()
    const parsed = PayloadSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid payload schema' }, { status: 400 })
    }

    const { section, data } = parsed.data

    if (data === null || data === undefined) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    await updatePortfolioSection(section, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error'
    // Surface the real reason (e.g. "no KV configured") instead of a generic
    // 500 — this is what would have made the original silent-failure bug
    // visible immediately instead of looking like a successful save.
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
