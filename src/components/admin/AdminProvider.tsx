'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { portfolioConfig } from '@/config/portfolio.config'
import { toast } from 'sonner'
import { 
  Project, 
  Skill, 
  Experience, 
  SiteConfig,
  SocialLink,
  Microblog
} from '@/lib/types/portfolio'

const STORAGE_KEY = 'portfolio_data_v1'

function buildApiPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const normalizedBase = basePath.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}` || normalizedPath
}

interface PortfolioData {
  personal: SiteConfig
  about: typeof portfolioConfig.about
  stats: typeof portfolioConfig.stats
  projects: Project[]
  skills: Skill[]
  experiences: Experience[]
  education: typeof portfolioConfig.education
  socialLinks: SocialLink[]
  seo: typeof portfolioConfig.seo
  blog: typeof portfolioConfig.blog
  microblogs: Microblog[]
}

interface GitHubSyncProfile {
  name?: string | null
  avatar_url?: string | null
  bio?: string | null
  location?: string | null
  blog?: string | null
}

interface GitHubSyncRepo {
  name: string
  description: string | null
  url: string
  language: string | null
  updatedAt: string
  topics: string[]
}

interface GitHubSyncPayload {
  profile?: GitHubSyncProfile
  stats?: { totalRepos?: number }
  allRepos?: GitHubSyncRepo[]
}

interface LinkedInSyncPayload {
  status?: 'ok' | 'not_configured' | 'error'
  profile?: {
    name?: string | null
    picture?: string | null
    email?: string | null
    profileUrl?: string | null
  } | null
  experience?: {
    role?: string | null
    company?: string | null
    companyUrl?: string | null
    start?: string | null
  } | null
  education?: {
    institution?: string | null
    degree?: string | null
  } | null
}

type SourceStatus = 'loading' | 'ok' | 'not_configured' | 'error'

interface SourceSyncState {
  github: SourceStatus
  linkedIn: SourceStatus
  fetchedAt?: string
}

interface AdminContextType {
  isAdmin: boolean
  portfolioData: PortfolioData
  sourceSync: SourceSyncState
  activate: () => void
  deactivate: () => void
  updateSection: (section: keyof PortfolioData, data: unknown) => Promise<void>
  isSaving: boolean
  exportConfig: () => string
  verifyPin: (pin: string) => Promise<boolean>
  persistData: () => Promise<boolean>
  hasUnsavedChanges: boolean
}

export type { PortfolioData }

const defaultData: PortfolioData = {
  personal: portfolioConfig.personal as SiteConfig,
  about: portfolioConfig.about,
  stats: portfolioConfig.stats,
  projects: portfolioConfig.projects as Project[],
  skills: portfolioConfig.skills as Skill[],
  experiences: portfolioConfig.experiences as Experience[],
  education: portfolioConfig.education,
  socialLinks: portfolioConfig.socialLinks as unknown as SocialLink[],
  seo: portfolioConfig.seo,
  blog: portfolioConfig.blog,
  microblogs: portfolioConfig.microblogs as Microblog[],
}

function normalizeUrl(url?: string) {
  return url?.trim().replace(/\/$/, '').toLowerCase()
}

function mergeOnlineSources(
  current: PortfolioData,
  github: GitHubSyncPayload | null,
  linkedIn: LinkedInSyncPayload | null,
): PortfolioData {
  const githubProfile = github?.profile
  const linkedInProfile = linkedIn?.status === 'ok' ? linkedIn.profile : null
  const syncedName = linkedInProfile?.name || githubProfile?.name
  const syncedAvatar = linkedInProfile?.picture || githubProfile?.avatar_url
  const syncedProjects = github?.allRepos ?? []
  const reposByUrl = new Map(syncedProjects.map((repo) => [normalizeUrl(repo.url), repo]))

  const linkedInRole = linkedIn?.status === 'ok' ? linkedIn.experience : null
  let experiences = current.experiences
  if (linkedInRole?.role && linkedInRole.company) {
    const sameCompany = (experience: Experience) =>
      experience.company.trim().toLowerCase() === linkedInRole.company?.trim().toLowerCase()
    const hasMatchingExperience = current.experiences.some(sameCompany)
    experiences = current.experiences.map((experience) => {
      if (!sameCompany(experience)) return experience
      return {
        ...experience,
        role: linkedInRole.role || experience.role,
        period: {
          ...experience.period,
          start: linkedInRole.start || experience.period.start,
          present: true,
        },
      }
    })

    // LinkedIn's approved current-position scope may expose a role that is
    // newer than the curated list. Add it only when LinkedIn supplies a
    // usable start date; historical roles remain curated because the API does
    // not expose the complete work history.
    if (!hasMatchingExperience && linkedInRole.start) {
      const id = `linkedin-${linkedInRole.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      experiences = [
        {
          id,
          role: linkedInRole.role,
          company: linkedInRole.company,
          period: { start: linkedInRole.start, present: true },
          description: [],
          technologies: [],
        },
        ...experiences,
      ]
    }
  }

  const linkedInEducation = linkedIn?.status === 'ok' ? linkedIn.education : null
  const education = linkedInEducation?.institution
    ? current.education.map((item) => {
        const sameInstitution = item.institution.trim().toLowerCase() === linkedInEducation.institution?.trim().toLowerCase()
        if (!sameInstitution) return item
        return {
          ...item,
          degree: linkedInEducation.degree || item.degree,
        }
      })
    : current.education

  const projects = current.projects.map((project) => {
    const repo = reposByUrl.get(normalizeUrl(project.links.github))
    if (!repo) return project

    const detectedTech = [repo.language, ...repo.topics].filter((item): item is string => Boolean(item))
    return {
      ...project,
      description: repo.description || project.description,
      technologies: detectedTech.length > 0 ? detectedTech : project.technologies,
      date: project.date || repo.updatedAt,
    }
  })

  const stats = current.stats.map((stat) =>
    stat.label === 'GitHub Repos' && typeof github?.stats?.totalRepos === 'number'
      ? { ...stat, value: github.stats.totalRepos }
      : stat
  )

  return {
    ...current,
    personal: {
      ...current.personal,
      name: syncedName || current.personal.name,
      title: linkedInRole?.role || current.personal.title,
      // Keep an explicitly curated portrait. Remote profile images are useful
      // only as a fallback and can expire or be blocked by an image proxy.
      avatar: current.personal.avatar || syncedAvatar || undefined,
      bio: githubProfile?.bio || current.personal.bio,
      location: githubProfile?.location || current.personal.location,
      website: githubProfile?.blog || current.personal.website,
      email: linkedInProfile?.email || current.personal.email,
      linkedin: linkedInProfile?.profileUrl || current.personal.linkedin,
    },
    projects,
    stats,
    experiences,
    education,
  }
}



function loadFromStorage(): Partial<PortfolioData> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveToStorage(data: PortfolioData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  portfolioData: defaultData,
  sourceSync: { github: 'loading', linkedIn: 'loading' },
  activate: () => {},
  deactivate: () => {},
  updateSection: async () => {},
  isSaving: false,
  exportConfig: () => '',
  verifyPin: async () => false,
  persistData: async () => false,
  hasUnsavedChanges: false,
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData)
  const [sourceSync, setSourceSync] = useState<SourceSyncState>({ github: 'loading', linkedIn: 'loading' })
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load local/admin data first, then enrich it from public online sources.
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      const stored = loadFromStorage()
      let nextData: PortfolioData = Object.keys(stored).length > 0
        ? { ...defaultData, ...stored }
        : defaultData

      if (!cancelled && nextData !== defaultData) setPortfolioData(nextData)

      try {
        const serverResponse = await fetch(buildApiPath('/api/admin/portfolio'))
        if (serverResponse.ok) {
          setIsAdmin(true)
          const serverData = await serverResponse.json() as Partial<PortfolioData>
          nextData = { ...nextData, ...serverData }
          if (!cancelled) {
            setPortfolioData(nextData)
            saveToStorage(nextData)
          }
        }
      } catch {
        // Unauthenticated visitors should continue with config/local data.
      }

      const [githubResponse, linkedInResponse] = await Promise.all([
        fetch(buildApiPath('/api/github')).catch(() => null),
        fetch(buildApiPath('/api/linkedin')).catch(() => null),
      ])
      let github: GitHubSyncPayload | null = null
      let linkedIn: LinkedInSyncPayload | null = null

      if (githubResponse?.ok) {
        try { github = await githubResponse.json() as GitHubSyncPayload } catch { github = null }
      }
      if (linkedInResponse?.ok) {
        try { linkedIn = await linkedInResponse.json() as LinkedInSyncPayload } catch { linkedIn = null }
      }

      if (!cancelled) {
        setSourceSync({
          github: github ? 'ok' : 'error',
          linkedIn: linkedIn?.status === 'ok' ? 'ok' : linkedIn?.status === 'not_configured' ? 'not_configured' : 'error',
          fetchedAt: new Date().toISOString(),
        })
      }

      if (!cancelled && (github || linkedIn)) {
        setPortfolioData((current) => mergeOnlineSources(current, github, linkedIn))
      }
    }

    load().catch(() => {
      // Keep the local/config baseline when an external source is unavailable.
    })

    return () => {
      cancelled = true
    }
  }, [])

  const verifyPinFunc = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const res = await fetch(buildApiPath('/api/admin/auth'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      return res.ok
    } catch {
      return false
    }
  }, [])

  const activate = useCallback(() => {
    setIsAdmin(true)
    fetch(buildApiPath('/api/admin/portfolio'))
      .then(res => res.ok ? res.json() : null)
      .then(serverData => {
        if (serverData) {
          setPortfolioData(prev => {
            const updated = { ...prev, ...serverData }
            saveToStorage(updated)
            return updated
          })
        }
      })
      .catch(console.error)
  }, [])

  const deactivate = useCallback(() => {
    setIsAdmin(false)
    try {
      fetch(buildApiPath('/api/admin/logout'), { method: 'POST' }).catch(console.error)
    } catch (e) {
      console.error('Logout failed', e)
    }
  }, [])

  const updateSection = useCallback(async (section: keyof PortfolioData, data: unknown) => {
    setIsSaving(true)
    try {
      const updated = { ...portfolioData, [section]: data }
      setPortfolioData(updated)
      saveToStorage(updated)
      setHasUnsavedChanges(true)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }, [portfolioData])

  const exportConfig = useCallback(() => {
    return JSON.stringify(portfolioData, null, 2)
  }, [portfolioData])

  // Persist data to server (development only)
  const persistData = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch(buildApiPath('/api/admin/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      })
      if (!res.ok) {
        console.error('Failed to persist data', await res.text())
        toast.error('Failed to save to server')
        return false
      }
      toast.success('Saved to server successfully!')
      setHasUnsavedChanges(false)
      return true
    } catch (e) {
      console.error('Error persisting data', e)
      toast.error('Server error during save')
      return false
    }
  }, [portfolioData])

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        portfolioData,
        sourceSync,
        activate,
        deactivate,
        updateSection,
        isSaving,
        exportConfig,
        verifyPin: verifyPinFunc,
        persistData,
        hasUnsavedChanges,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
