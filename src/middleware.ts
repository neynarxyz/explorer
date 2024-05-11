
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
    const url = req.nextUrl
    const scheme = process.env.VERCEL_ENV !== 'development' ? 'https://' : 'http://';
    const website = process.env.VERCEL_URL || 'localhost:3000';
    const allowedOrigin = scheme + website;
        if (url.origin !== allowedOrigin) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

     return NextResponse.next()

}

export const config = {
  matcher: '/api/:path*',
}
