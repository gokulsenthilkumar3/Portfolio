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
  , Certification
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
  certifications: Certification[]
  socialLinks: SocialLink[]
  seo: typeof portfolioConfig.seo
  blog: typeof portfolioConfig.blog
  microblogs: Microblog[]
}

interface AdminContextType {
  isAdmin: boolean
  portfolioData: PortfolioData
  activate: () => void
  deactivate: () => void
  openAdminPanel: (tab?: string) => void
  closeAdminPanel: () => void
  adminPanelOpen: boolean
  adminPanelTab: string
  updateSection: (section: keyof PortfolioData, data: unknown) => Promise<void>
  isSaving: boolean
  isPublishing: boolean
  publishError: string | null
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
  certifications: portfolioConfig.certifications,
  socialLinks: portfolioConfig.socialLinks as unknown as SocialLink[],
  seo: portfolioConfig.seo,
  blog: portfolioConfig.blog,
  microblogs: portfolioConfig.microblogs as Microblog[],
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
  activate: () => {},
  deactivate: () => {},
  openAdminPanel: () => {},
  closeAdminPanel: () => {},
  adminPanelOpen: false,
  adminPanelTab: 'dashboard',
  updateSection: async () => {},
  isSaving: false,
  isPublishing: false,
  publishError: null,
  exportConfig: () => '',
  verifyPin: async () => false,
  persistData: async () => false,
  hasUnsavedChanges: false,
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData)
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [adminPanelOpen, setAdminPanelOpen] = useState(false)
  const [adminPanelTab, setAdminPanelTab] = useState('dashboard')

  // Curated content is authoritative for the public page. Only an authenticated
  // admin session may load the durable draft; this prevents stale local storage
  // or third-party profile data from rewriting the visitor experience.
  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const serverResponse = await fetch(buildApiPath('/api/admin/portfolio'))
        if (serverResponse.ok) {
          const serverData = await serverResponse.json() as Partial<PortfolioData>
          if (!cancelled) {
            setIsAdmin(true)
            const nextData = { ...defaultData, ...serverData }
            setPortfolioData(nextData)
            saveToStorage(nextData)
          }
        }
      } catch {
        // Unauthenticated visitors use the curated config baseline.
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
    setAdminPanelOpen(false)
    try {
      fetch(buildApiPath('/api/admin/logout'), { method: 'POST' }).catch(console.error)
    } catch (e) {
      console.error('Logout failed', e)
    }
  }, [])

  const openAdminPanel = useCallback((tab = 'dashboard') => {
    setAdminPanelTab(tab)
    setAdminPanelOpen(true)
  }, [])

  const closeAdminPanel = useCallback(() => {
    setAdminPanelOpen(false)
  }, [])

  const updateSection = useCallback(async (section: keyof PortfolioData, data: unknown) => {
    setIsSaving(true)
    try {
      setPortfolioData((current) => {
        const updated = { ...current, [section]: data }
        saveToStorage(updated)
        return updated
      })
      setHasUnsavedChanges(true)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }, [])

  const exportConfig = useCallback(() => {
    return JSON.stringify(portfolioData, null, 2)
  }, [portfolioData])

  const persistData = useCallback(async (): Promise<boolean> => {
    if (isPublishing) return false
    setIsPublishing(true)
    setPublishError(null)
    try {
      const res = await fetch(buildApiPath('/api/admin/save'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioData),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null) as { error?: string } | null
        const message = body?.error || 'Failed to save to server'
        setPublishError(message)
        toast.error(message)
        return false
      }
      toast.success('Portfolio changes published')
      setHasUnsavedChanges(false)
      return true
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Server error during save'
      setPublishError(message)
      toast.error(message)
      return false
    } finally {
      setIsPublishing(false)
    }
  }, [isPublishing, portfolioData])

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        portfolioData,
        activate,
        deactivate,
        openAdminPanel,
        closeAdminPanel,
        adminPanelOpen,
        adminPanelTab,
        updateSection,
        isSaving,
        isPublishing,
        publishError,
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
