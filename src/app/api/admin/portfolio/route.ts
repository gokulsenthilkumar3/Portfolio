import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/admin/auth'
import { readPortfolioData, updatePortfolioSection } from '@/lib/admin/storage'
import { portfolioConfig } from '@/config/portfolio.config'
import { z } from 'zod'

const SectionSchema = z.enum([
  'personal', 'stats', 'projects', 'skills', 'experiences', 
  'socialLinks', 'seo', 'blog', 'microblogs', 'education', 'about'
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

  const storedData = await readPortfolioData()
  // Merge stored data over the static config
  const merged = {
    personal: storedData.personal || portfolioConfig.personal,
    stats: storedData.stats || portfolioConfig.stats,
    projects: storedData.projects || portfolioConfig.projects,
    skills: storedData.skills || portfolioConfig.skills,
    experiences: storedData.experiences || portfolioConfig.experiences,
    socialLinks: storedData.socialLinks || portfolioConfig.socialLinks,
    seo: storedData.seo || portfolioConfig.seo,
    blog: storedData.blog || portfolioConfig.blog,
    microblogs: storedData.microblogs || portfolioConfig.microblogs,
    education: storedData.education || portfolioConfig.education,
    about: storedData.about || portfolioConfig.about,
  }

  return NextResponse.json(merged)
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
