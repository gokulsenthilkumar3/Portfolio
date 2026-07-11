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

interface AdminContextType {
  isAdmin: boolean
  portfolioData: PortfolioData
  activate: () => void
  deactivate: () => void
  updateSection: (section: keyof PortfolioData, data: unknown) => Promise<void>
  isSaving: boolean
  exportConfig: () => string
  verifyPin: (pin: string) => Promise<boolean>
  persistData: () => Promise<boolean>
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
  activate: () => {},
  deactivate: () => {},
  updateSection: async () => {},
  isSaving: false,
  exportConfig: () => '',
  verifyPin: async () => false,
  persistData: async () => false,
})

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultData)
  const [isSaving, setIsSaving] = useState(false)

  // Load saved data and check session on mount
  useEffect(() => {
    const stored = loadFromStorage()
    if (Object.keys(stored).length > 0) {
      setPortfolioData(prev => ({ ...prev, ...stored }))
    }

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/api/admin/portfolio`.replace(/\/+/g, '/'))
      .then(res => {
        if (res.ok) {
          setIsAdmin(true)
          return res.json()
        }
        return null
      })
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

  const verifyPinFunc = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const res = await fetch(`${basePath}/api/admin/auth`.replace(/\/+/g, '/'), {
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
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    fetch(`${basePath}/api/admin/portfolio`.replace(/\/+/g, '/'))
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
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      fetch(`${basePath}/api/admin/logout`.replace(/\/+/g, '/'), { method: 'POST' }).catch(console.error)
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
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const apiPath = `${basePath}/api/admin/save`.replace(/\/+/g, '/')
      
      console.log('DEBUG: Persisting data to', apiPath)
      
      const res = await fetch(apiPath, {
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
        activate,
        deactivate,
        updateSection,
        isSaving,
        exportConfig,
        verifyPin: verifyPinFunc,
        persistData,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
