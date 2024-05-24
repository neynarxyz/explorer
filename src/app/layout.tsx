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
      <body className="flex flex-col flex-1 items-center h-full">
        <Providers>
          <div className="w-full flex items-center justify-between px-10 py-2">
            <Link href="/" className="text-black font-bold">
              <p className="text-lg md:text-xl">Farcaster Explorer</p>
            </Link>
            <Link href="https://www.neynar.com" target="_blank">
              <img className="w-16 md:w-32" src={"/neynar.png"} />
            </Link>
          </div>
          <Search />
          <div className="w-full px-4 md:px-8">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

