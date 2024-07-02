/* eslint-disable @next/next/no-img-element */
'use client';
import './globals.css';
import Link from 'next/link';
import Providers from './providers';
import Search from '@/components/search';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { seo } from '@/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:url" content={seo.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.title} />
        <meta name="twitter:description" content={seo.description} />
        <meta name="twitter:image" content={seo.ogImage} />
      </head>
      <body className="relative h-screen min-h-screen">
        <div className="flex flex-col min-h-screen">
          <Providers>
            <div className="sticky top-0 z-10 w-full flex flex-col sm:flex-row justify-between items-center bg-white p-4 px-6">
              <div className="min-w-32">
                <Link
                  className="block flex-shrink-0"
                  href="https://www.neynar.com"
                  target="_blank"
                >
                  <img className="w-32" src={'/neynar.png'} alt="Neynar logo" />
                </Link>
              </div>

              <div className="flex flex-col items-center gap-2 sm:max-w-[350px] w-full">
                <Link href="/" className="text-black font-bold">
                  <p className="text-md">Farcaster Explorer</p>
                </Link>
                <Search />
              </div>
              <div className="flex items-center justify-end space-x-4">
                <Link
                  target="_blank"
                  className="hover:text-purple-900"
                  href={'https://blog.neynar.com/'}
                >
                  Blog
                </Link>
                <Link
                  target="_blank"
                  className="hover:text-purple-900"
                  href={'https://github.com/neynarxyz/explorer'}
                >
                  Github
                </Link>
                <Link
                  target="_blank"
                  className="hover:text-purple-900"
                  href={'https://docs.neynar.com/'}
                >
                  Docs
                </Link>
              </div>
            </div>

            <div className="flex-auto w-full p-4 md:p-8 bg-gray-50">
              {children}
            </div>

            <div className="sticky bottom-0 p-4 text-center bg-white">
              <Button asChild variant={'secondary'}>
                <Link
                  target="_blank"
                  href="https://warpcast.com/~/add-cast-action?url=https://explorer.neynar.com/frames/actions/view-on-explorer"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Install Cast Action
                </Link>
              </Button>
            </div>
          </Providers>
        </div>
      </body>
    </html>
  );
}
