'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { portfolioConfig } from '@/config/portfolio.config'
import { toast } from 'sonner'

const STORAGE_KEY = 'portfolio_data_v1'
const SESSION_KEY = 'portfolio_admin_session'
// SHA-256 hash of your chosen PIN/passphrase
// To regenerate: node -e "const crypto=require('crypto'); console.log(crypto.createHash('sha256').update('YOUR_PASSPHRASE').digest('hex'))"
const PIN_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'

interface PortfolioData {
  personal: typeof portfolioConfig.personal
  stats: typeof portfolioConfig.stats
  projects: typeof portfolioConfig.projects
  skills: typeof portfolioConfig.skills
  experiences: typeof portfolioConfig.experiences
  education: typeof portfolioConfig.education
  socialLinks: typeof portfolioConfig.socialLinks
  seo: typeof portfolioConfig.seo
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
  personal: portfolioConfig.personal,
  stats: portfolioConfig.stats,
  projects: portfolioConfig.projects as typeof portfolioConfig.projects,
  skills: portfolioConfig.skills,
  experiences: portfolioConfig.experiences,
  education: portfolioConfig.education,
  socialLinks: portfolioConfig.socialLinks,
  seo: portfolioConfig.seo,
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
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

  // Load saved data and session on mount
  useEffect(() => {
    const stored = loadFromStorage()
    if (Object.keys(stored).length > 0) {
      setPortfolioData(prev => ({ ...prev, ...stored }))
    }
    // Check session
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'active') {
      setIsAdmin(true)
    }
  }, [])

  const verifyPinFunc = useCallback(async (pin: string): Promise<boolean> => {
    const hash = await sha256(pin)
    console.log('DEBUG: Comparing', { input: pin, hash, target: PIN_HASH })
    return hash.toLowerCase() === PIN_HASH.toLowerCase()
  }, [])

  const activate = useCallback(() => {
    setIsAdmin(true)
    sessionStorage.setItem(SESSION_KEY, 'active')
  }, [])

  const deactivate = useCallback(() => {
    setIsAdmin(false)
    sessionStorage.removeItem(SESSION_KEY)
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
      const res = await fetch('/api/admin/save', {
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
