import { NextRequest, NextResponse } from 'next/server'
export function proxy(request: NextRequest) {
 if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
  const origin = request.headers.get('origin')
  if (request.headers.get('sec-fetch-site') === 'cross-site' || (origin && origin !== request.nextUrl.origin)) {
   return NextResponse.json({ error: 'Cross-site admin requests are not allowed.' }, { status: 403 })
  }
 }
 return NextResponse.next()
}
export const config = { matcher: '/api/admin/:path*' }
