import { NextRequest, NextResponse } from 'next/server'
import { getTokenFromCookie, verifyToken } from '@/lib/admin/auth'
import { readPortfolioData, updatePortfolioSection } from '@/lib/admin/storage'
import { portfolioConfig } from '@/config/portfolio.config'

function isAuthenticated(request: NextRequest): boolean {
  const cookieHeader = request.headers.get('cookie')
  const token = getTokenFromCookie(cookieHeader)
  return !!(token && verifyToken(token))
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const storedData = readPortfolioData()
  // Merge stored data over the static config
  const merged = {
    personal: storedData.personal || portfolioConfig.personal,
    stats: storedData.stats || portfolioConfig.stats,
    projects: storedData.projects || portfolioConfig.projects,
    skills: storedData.skills || portfolioConfig.skills,
    experiences: storedData.experiences || portfolioConfig.experiences,
    socialLinks: storedData.socialLinks || portfolioConfig.socialLinks,
    seo: storedData.seo || portfolioConfig.seo,
  }

  return NextResponse.json(merged)
}

export async function PUT(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json({ error: 'Missing section or data' }, { status: 400 })
    }

    const allowedSections = ['personal', 'stats', 'projects', 'skills', 'experiences', 'socialLinks', 'seo']
    if (!allowedSections.includes(section)) {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 })
    }

    updatePortfolioSection(section, data)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
