import { baselineData, parsePortfolioData, type PortfolioData } from '@/lib/portfolio-content'
import { readPublishedData } from './storage'

export async function getPublishedPortfolio(): Promise<PortfolioData> {
  try {
    const stored = await readPublishedData()
    return stored ? parsePortfolioData(stored) : baselineData
  } catch (error) {
    console.error('[portfolio] Published content unavailable; using checked-in baseline', error)
    return baselineData
  }
}
