'use client'
import dynamic from 'next/dynamic'

const AccentSwitcher = dynamic(
  () => import('@/components/shared/AccentSwitcher').then(m => ({ default: m.AccentSwitcher })),
  { ssr: false }
)

const CursorTrail = dynamic(
  () => import('@/components/effects/CursorTrail').then(m => ({ default: m.CursorTrail })),
  { ssr: false }
)

export function ClientEffects() {
  return (
    <>
      <AccentSwitcher />
      <CursorTrail />
    </>
  )
}
