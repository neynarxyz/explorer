'use client'
import "./globals.css";
import Link from "next/link";
import Providers from "./providers";
import Search from "@/components/search";
import { usePathname } from 'next/navigation'
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className="relative h-full pt-10"> {/* Added pt-20 for padding-top */}
        <Providers>
          <div className="absolute top-0 left-0 p-2">
            <Link href="https://www.neynar.com" target="_blank">
              <img className="w-16 md:w-32" src={"/neynar.png"} />
            </Link>
          </div>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 p-2">
            <Link href="/" className="text-black font-bold">
              <p className="text-lg md:text-xl">Farcaster Explorer</p>
            </Link>
          </div>
          <div className="w-full flex justify-center mt-16"> {/* Added mt-16 for margin-top */}
            <Search />
          </div>
          <div className="w-full px-4 md:px-8">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}  