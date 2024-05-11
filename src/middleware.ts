
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {

    const url = req.nextUrl
    const { pathname } = url
    const scheme = process.env.VERCEL_ENV !== 'development' ? 'https://' : 'http://';
    const website = process.env.VERCEL_URL || 'localhost:3000';
    const allowedOrigin = scheme + website;

    if (pathname.startsWith(`/api/`)) {
        if (!req.headers.get("referer")?.includes(website)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
      }

     return NextResponse.next()

}


  