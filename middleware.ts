import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const scheme = process.env.VERCEL_ENV !== 'development' ? 'https://' : 'http://';
  const website = process.env.VERCEL_URL || 'localhost:3000';
  const allowedOrigin = scheme + website;
  const requestOrigin = request.headers.get('origin');
  if (requestOrigin && requestOrigin === allowedOrigin) {
    return NextResponse.next()
  }
  return Response.json({
    status: 403,
    body: 'Unauthorized',
  })
}
 
export const config = {
  matcher: '/api/:path*',
}

  