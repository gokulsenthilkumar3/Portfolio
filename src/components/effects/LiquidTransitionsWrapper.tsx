'use client'

import dynamic from 'next/dynamic'

const LiquidTransitions = dynamic(
  () => import('./LiquidTransitions').then(mod => mod.LiquidTransitions),
  { ssr: false }
)

export function LiquidTransitionsWrapper() {
  return <LiquidTransitions />
}
