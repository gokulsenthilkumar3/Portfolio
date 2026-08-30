import { NextResponse } from 'next/server'

interface LinkedInUserInfo {
  name?: string
  given_name?: string
  family_name?: string
  picture?: string
  email?: string
  locale?: string
}

interface LinkedInIdentityResponse {
  basicInfo?: {
    firstName?: LinkedInLocalizedValue
    lastName?: LinkedInLocalizedValue
    primaryEmailAddress?: string
    profileUrl?: string
    profilePicture?: {
      croppedImage?: { downloadUrl?: string }
    }
  }
  primaryCurrentPosition?: {
    title?: LinkedInLocalizedValue
    companyName?: LinkedInLocalizedValue
    companyPageUrl?: string
    startedOn?: { month?: number; year?: number }
  }
  mostRecentEducation?: {
    schoolName?: LinkedInLocalizedValue
    degreeName?: LinkedInLocalizedValue
  }
}

interface LinkedInLocalizedValue {
  localized?: Record<string, string>
  preferredLocale?: { language?: string; country?: string }
}

function localized(value?: LinkedInLocalizedValue) {
  if (!value) return null
  const preferred = value.preferredLocale
    ? `${value.preferredLocale.language ?? ''}_${value.preferredLocale.country ?? ''}`
    : ''
  return value.localized?.[preferred]
    || Object.values(value.localized ?? {})[0]
    || null
}

function noStoreHeaders() {
  return { 'Cache-Control': 'private, no-store' }
}

/**
 * LinkedIn's public profile page is not a supported data API. This endpoint
 * only reads the authenticated member's profile when an access token is
 * explicitly configured on the server. The optional identityMe fields are
 * returned only when the LinkedIn app has the matching approved scopes.
 */
export async function GET() {
  const token = process.env.LINKEDIN_ACCESS_TOKEN

  if (!token) {
    return NextResponse.json({
      source: 'linkedin',
      status: 'not_configured',
      profile: null,
      experience: null,
      education: null,
      message: 'Set LINKEDIN_ACCESS_TOKEN to sync the authenticated LinkedIn profile.',
    }, { headers: noStoreHeaders() })
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }

  // identityMe can include the current role and most-recent education for
  // apps with LinkedIn's approved r_primary_current_experience and
  // r_most_recent_education scopes. Basic tokens are handled by the fallback.
  let identity: LinkedInIdentityResponse | null = null
  try {
    const response = await fetch('https://api.linkedin.com/rest/identityMe', {
      headers: {
        ...headers,
        'LinkedIn-Version': process.env.LINKEDIN_API_VERSION ?? '202510.03',
      },
      cache: 'no-store',
    })
    if (response.ok) identity = await response.json() as LinkedInIdentityResponse
  } catch {
    // Fall through to the broadly available OpenID profile endpoint.
  }

  if (identity?.basicInfo) {
    const firstName = localized(identity.basicInfo.firstName)
    const lastName = localized(identity.basicInfo.lastName)
    const position = identity.primaryCurrentPosition
    const education = identity.mostRecentEducation

    return NextResponse.json({
      source: 'linkedin',
      status: 'ok',
      profile: {
        name: [firstName, lastName].filter(Boolean).join(' ') || null,
        picture: identity.basicInfo.profilePicture?.croppedImage?.downloadUrl || null,
        email: identity.basicInfo.primaryEmailAddress || null,
        profileUrl: identity.basicInfo.profileUrl || null,
      },
      experience: position?.title && position.companyName ? {
        role: localized(position.title),
        company: localized(position.companyName),
        companyUrl: position.companyPageUrl || null,
        start: position.startedOn?.year
          ? `${position.startedOn.year}-${String(position.startedOn.month ?? 1).padStart(2, '0')}-01`
          : null,
      } : null,
      education: education?.schoolName ? {
        institution: localized(education.schoolName),
        degree: localized(education.degreeName) || '',
      } : null,
    }, { headers: noStoreHeaders() })
  }

  try {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({
        source: 'linkedin',
        status: 'error',
        profile: null,
        experience: null,
        education: null,
        message: `LinkedIn returned ${response.status}. Check the token and permissions.`,
      }, { status: 502, headers: noStoreHeaders() })
    }

    const data = await response.json() as LinkedInUserInfo
    return NextResponse.json({
      source: 'linkedin',
      status: 'ok',
      profile: {
        name: data.name || [data.given_name, data.family_name].filter(Boolean).join(' ') || null,
        picture: data.picture || null,
        email: data.email || null,
        profileUrl: null,
      },
      experience: null,
      education: null,
    }, { headers: noStoreHeaders() })
  } catch {
    return NextResponse.json({
      source: 'linkedin',
      status: 'error',
      profile: null,
      experience: null,
      education: null,
      message: 'LinkedIn could not be reached.',
    }, { status: 502, headers: noStoreHeaders() })
  }
}
