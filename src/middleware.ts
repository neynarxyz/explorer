
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const env = process.env.VERCEL_ENV ?? 'development'
  console.log("auth",req.headers.get('Authorization'))
  if(env === 'development') {
    return NextResponse.next()
  }

    //check if url has Authentication header passed in
    if (!req.headers.get('Authorization')) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      //get authorization header
      const authHeader = req.headers.get('Authorization');
      console.log(authHeader)
      //Add better token flow
  if(authHeader !== process.env.NEXT_PUBLIC_TOKEN_SECRET) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

     return NextResponse.next()

}

export const config = {
  matcher: '/api/:path*',
}
