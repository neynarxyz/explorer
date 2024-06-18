'use client'
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import Search from "@/components/search";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";
import { seo } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";

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
      <body className="relative h-screen flex flex-col items-center justify-center min-h-screen">
        <Providers>
          <div className="absolute top-0 left-0 p-2">
            <Link href="https://www.neynar.com" target="_blank">
              <img className="w-16 md:w-32" src={"/neynar.png"} />
            </Link>
          </div>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 p-2">
            <Link href="/" className="text-black font-bold">
              <p className="text-md md:text-">Farcaster Explorer</p>
            </Link>
          </div>
          <div className="w-full absolute top-10 justify-center mt-9 max-h-32 max-w-sm md:max-w-md">
            <Search />
      </div>
      <div className="w-full px-4 md:px-8 mt-72 md:mb-64 flex flex-col ">
            {children}
            <div className="w-full flex justify-center items-center py-3 my-2">
            <Link target="_blank" href="https://warpcast.com/~/add-cast-action?url=https://explorer.neynar.com/frames/actions/view-on-explorer"  >
          

          <Card className="w-full hover:bg-slate-100 rounded-lg max-w-md md:min-w-24 md:min-h-12 flex items-center justify-center">
      <CardContent className="p-4 w-full font-bold flex flex-col justify-center items-center space-y-2">
          Download cast action
          </CardContent>
          </Card>
          </Link>
          </div>
          </div>
          {//open in new page
          }
         
        </Providers>
      </body>
    </html>
  );
}
