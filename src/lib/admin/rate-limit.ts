const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

const inMemoryStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const now = Date.now()
  const reset = now + windowMs

  // Fallback to in-memory if no KV configured
  if (!KV_URL || !KV_TOKEN) {
    const record = inMemoryStore.get(identifier)
    if (!record || record.resetTime < now) {
      inMemoryStore.set(identifier, { count: 1, resetTime: reset })
      return { success: true, limit, remaining: limit - 1, reset }
    }
    
    if (record.count >= limit) {
      return { success: false, limit, remaining: 0, reset: record.resetTime }
    }
    
    record.count += 1
    return { success: true, limit, remaining: limit - record.count, reset: record.resetTime }
  }

  try {
    // Basic Rate Limiting using KV
    const key = `rate-limit:${identifier}`
    
    // Increment the key
    const incRes = await fetch(`${KV_URL}/incr/${key}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    })
    
    if (!incRes.ok) throw new Error('KV incr failed')
    
    const incData = await incRes.json()
    const currentCount = parseInt(incData.result, 10)
    
    // If it's the first request, set expiry
    if (currentCount === 1) {
      await fetch(`${KV_URL}/pexpire/${key}/${windowMs}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${KV_TOKEN}` }
      })
    }
    
    const remaining = Math.max(0, limit - currentCount)
    
    return {
      success: currentCount <= limit,
      limit,
      remaining,
      reset
    }
  } catch (error) {
    // If KV fails, allow the request but log the error
    console.error('Rate limiting error:', error)
    return { success: true, limit, remaining: 1, reset }
  }
}
