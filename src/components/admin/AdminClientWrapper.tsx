'use client'

import React, { useState } from 'react'
import { AdminProvider } from '@/components/admin/AdminProvider'
import { SecretActivator } from '@/components/admin/SecretActivator'
import { AdminToolbar } from '@/components/admin/AdminToolbar'
import { AdminPanel } from '@/components/admin/AdminPanel'
import { useAdmin } from '@/components/admin/AdminProvider'

function AdminLayer() {
  const { isAdmin } = useAdmin()
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelTab] = useState('personal')

  return (
    <>
      <SecretActivator />
      <AdminToolbar onOpenPanel={isAdmin ? () => setPanelOpen(true) : undefined} />
      {isAdmin && (
        <AdminPanel
          isOpen={panelOpen}
          onClose={() => setPanelOpen(false)}
          initialTab={panelTab}
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
