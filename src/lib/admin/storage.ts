import fs from 'fs'
import path from 'path'

// Curated defaults live in portfolio.config.ts. Keep admin drafts separate so
// the older JSON snapshot cannot silently replace current public content.
const DATA_FILE = path.join(process.cwd(), '.portfolio-admin-data.json')
const KV_KEY = 'portfolio:data'

// PERSISTENCE FIX
// -----------------------------------------------------------------------
// The previous implementation wrote to a local JSON file with fs.writeFileSync.
// That works in `next dev` but silently fails (or is wiped on the next deploy/
// cold start) on Vercel, because production serverless functions get a
// read-only filesystem outside of /tmp, and /tmp itself is not shared or
// persistent across invocations. Every "Save to Server" click in the admin
// panel was at risk of doing nothing.
//
// Fix: use Vercel KV / Upstash Redis (REST API, no extra SDK needed) when
// configured — this is the standard durable store for Vercel serverless apps.
// Falls back to the local file ONLY in local development. In production
// without KV configured, it throws instead of pretending to succeed.
//
// Setup (one-time): add the free "Upstash Redis" or "Vercel KV" integration
// from your Vercel project's Storage tab. It auto-populates these two
// env vars — no code changes needed beyond this file.
const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN
const isProd = process.env.NODE_ENV === 'production'

async function kvGet(): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${KV_URL}/get/${KV_KEY}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`KV read failed: ${res.status}`)
  const { result } = await res.json()
  return result ? JSON.parse(result) : null
}

async function kvSet(data: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${KV_URL}/set/${KV_KEY}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(data)),
  })
  if (!res.ok) throw new Error(`KV write failed: ${res.status}`)
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function readLocalFile(): Record<string, unknown> {
  if (!fs.existsSync(DATA_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function writeLocalFile(data: Record<string, unknown>): void {
  ensureDataDir()
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

export async function readPortfolioData(): Promise<Record<string, unknown>> {
  if (KV_URL && KV_TOKEN) {
    return (await kvGet()) ?? {}
  }
  if (isProd) {
    // No KV configured in production: return empty rather than reading a
    // filesystem snapshot that may be stale, missing, or unwritable.
    return {}
  }
  return readLocalFile()
}

export async function writePortfolioData(data: Record<string, unknown>): Promise<void> {
  if (KV_URL && KV_TOKEN) {
    await kvSet(data)
    return
  }
  if (isProd) {
    throw new Error(
      "No persistent storage configured. Add the Vercel KV (or Upstash Redis) integration in your Vercel project's Storage tab so admin edits survive deploys — see KV_REST_API_URL / KV_REST_API_TOKEN."
    )
  }
  writeLocalFile(data)
}

export async function updatePortfolioSection(
  section: string,
  data: unknown
): Promise<void> {
  const current = await readPortfolioData()
  current[section] = data
  await writePortfolioData(current)
}
