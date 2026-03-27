import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'portfolio-data.json')

// Ensure data directory exists
function ensureDataDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function readPortfolioData(): Record<string, unknown> {
  ensureDataDir()
  if (!fs.existsSync(DATA_FILE)) {
    // Fall back to static config
    return {}
  }
  try {
    const content = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(content)
  } catch {
    return {}
  }
}

export function writePortfolioData(data: Record<string, unknown>): void {
  ensureDataDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export function updatePortfolioSection(
  section: string,
  data: unknown
): void {
  const current = readPortfolioData()
  current[section] = data
  writePortfolioData(current)
}
