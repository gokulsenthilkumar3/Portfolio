'use client'

import React from 'react'
import { AdminProvider } from '@/components/admin/AdminProvider'
import { SecretActivator } from '@/components/admin/SecretActivator'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { useAdmin } from '@/components/admin/AdminProvider'
import { usePathname } from 'next/navigation'

function AdminLayer() {
  const pathname = usePathname()
  const { isAdmin, adminPanelOpen, adminPanelTab, closeAdminPanel, openAdminPanel } = useAdmin()

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <SecretActivator />
      <AdminToolbar onOpenPanel={isAdmin ? () => openAdminPanel('dashboard') : undefined} />
      {isAdmin && (
        <AdminPanel
          isOpen={adminPanelOpen}
          onClose={closeAdminPanel}
          initialTab={adminPanelTab}
        />
      )}
    </>
  )
}

export function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <AdminLayer />
      {children}
    </AdminProvider>
  )
}
