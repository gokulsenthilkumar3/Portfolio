'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { baselineData, parsePortfolioData, type PortfolioData } from '@/lib/portfolio-content'
import { toast } from 'sonner'

const STORAGE_KEY = 'portfolio_data_v2'
const LEGACY_STORAGE_KEY = 'portfolio_data_v1'
const LEGACY_MIGRATED_KEY = 'portfolio_legacy_draft_migrated_v1'

function legacyBrowserDraft(): PortfolioData | null {
  try {
    if (localStorage.getItem(LEGACY_MIGRATED_KEY)) return null
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    return legacy ? parsePortfolioData(JSON.parse(legacy)) : null
  } catch {
    // Keep the original value untouched so it can still be recovered manually.
    return null
  }
}

function buildApiPath(path: string) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const normalizedBase = basePath.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}` || normalizedPath
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

function saveToStorage(data: PortfolioData) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  portfolioData: baselineData,
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

export function AdminProvider({ children, initialData }: { children: React.ReactNode; initialData: PortfolioData }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData)
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
            const serverHasDraft = serverResponse.headers.get('X-Portfolio-Has-Draft') === 'true'
            const legacy = serverHasDraft ? null : legacyBrowserDraft()
            const nextData = legacy ?? parsePortfolioData({ ...initialData, ...serverData })
            setPortfolioData(nextData)
            setHasUnsavedChanges(serverHasDraft || Boolean(legacy))
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
  }, [initialData])

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
      .then(async res => res.ok ? { data: await res.json() as Partial<PortfolioData>, hasDraft: res.headers.get('X-Portfolio-Has-Draft') === 'true' } : null)
      .then(result => {
        if (result) {
          const legacy = result.hasDraft ? null : legacyBrowserDraft()
          const updated = legacy ?? parsePortfolioData({ ...initialData, ...result.data })
          setPortfolioData(updated)
          setHasUnsavedChanges(result.hasDraft || Boolean(legacy))
          saveToStorage(updated)
        }
      })
      .catch(console.error)
  }, [initialData])

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
      const response = await fetch(buildApiPath('/api/admin/portfolio'), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, data }),
      })
      if (!response.ok) toast.error('Draft saved in this browser only; server draft could not be updated')
    } catch {
      toast.error('Draft saved in this browser only; server draft could not be updated')
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
      try { localStorage.setItem(LEGACY_MIGRATED_KEY, 'true') } catch {}
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
