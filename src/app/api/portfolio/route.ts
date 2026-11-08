import { NextResponse } from 'next/server'
import { getPublishedPortfolio } from '@/lib/server/portfolio'

export const dynamic = 'force-dynamic'

export async function GET() {
  const data = await getPublishedPortfolio()
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } })
}
