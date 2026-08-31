'use client'

import { useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, LayoutDashboard, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PinModal } from '@/components/admin/PinModal'
import { useAdmin } from '@/components/admin/AdminProvider'

const ADMIN_INERT_SELECTORS = ['#main-content > *', '.minimal-nav']

/** Small authentication gate. Editing happens in the single drawer on the public page. */
export default function AdminPage() {
  const router = useRouter()
  const { isAdmin } = useAdmin()
  const closeModal = useCallback(() => router.push('/'), [router])
  const completeLogin = useCallback(() => router.replace('/'), [router])

  useEffect(() => {
    if (isAdmin) router.replace('/')
  }, [isAdmin, router])

  if (isAdmin) return null

  return (
    <div className="min-h-[100dvh] bg-[#080808] text-white flex items-center justify-center p-4">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-[#121212] p-8 text-center shadow-2xl"
        aria-labelledby="admin-gate-title"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d4af37]/10">
          <LayoutDashboard className="text-[#d4af37]" size={30} aria-hidden="true" />
        </div>
        <h1 id="admin-gate-title" className="mb-2 text-2xl font-bold">Admin access</h1>
        <p className="mb-8 text-sm leading-relaxed text-white/60">
          Verify your access code to edit the curated portfolio and publish a new draft.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-white/45">
          <ShieldCheck size={14} aria-hidden="true" />
          Protected editor · changes are private until published
        </div>
        <div className="mt-8 border-t border-white/10 pt-6">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4af37]"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Return to portfolio
          </Link>
        </div>
      </motion.section>
      <PinModal
        onClose={closeModal}
        onSuccess={completeLogin}
        inertSelectors={ADMIN_INERT_SELECTORS}
      />
    </div>
  )
}
