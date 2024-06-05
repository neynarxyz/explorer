/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import Search from "@/components/search";
import { Card } from "@/components/ui/card";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content="Farcaster Explorer" />
        <meta property="og:description" content="Explore event propagation on farcaster." />
        <meta property="og:image" content="/neynar.png" />
        <meta property="og:url" content="https://www.neynar.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Farcaster Explorer" />
        <meta name="twitter:description" content="Explore event propagation on farcaster." />
        <meta name="twitter:image" content="/neynar.png" />
      </head>
      <body className="relative h-screen flex flex-col items-center min-h-screen">
        <Providers>
          <div className="absolute top-0 left-0 p-2">
            <Link href="https://www.neynar.com" target="_blank">
              <img className="w-16 md:w-32" src="/neynar.png" />
            </Link>
          </div>
          <Card className="min-w-[55%] md:min-w-[40%] fixed top-5 left-1/2 transform -translate-x-1/2 p-4 mb-5 z-10">
            <Link href="/" className="text-black font-bold">
              <p className="mb-4 text-lg md:text-">Farcaster Explorer</p>
            </Link>
            <Search />
          </Card>
          <div className="w-full mt-20 px-4 md:px-8 flex flex-col items-center">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}