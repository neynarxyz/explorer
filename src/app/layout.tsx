
'use client'
import "./globals.css";
import "react-farcaster-embed/dist/styles.css";
import Link from "next/link";
import Providers from "./providers";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next13-progressbar";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      router.push(`/${encodeURIComponent(identifier)}`);
    }
  };

  return ( 
    <html lang="en">
      <Providers>
        <body className="flex flex-col flex-1 items-center h-full">
          <div className="w-full flex items-center justify-between px-10 py-2">
            <Link href="/" className="text-black font-bold">
              <p className="text-lg md:text-xl">Farcaster Explorer</p>
            </Link>
       
            <Link href="https://www.neynar.com" target="_blank">
              <img className="w-16 md:w-32" src={"/neynar.png"} />
            </Link>
          </div>
          <div className="flex flex-col items-center w-full space-y-4">
                <Input
                  className="w-full h-10 md:w-96"
                  placeholder="Enter a FID, hash, or warpcast url..."
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value)}}
                  onKeyDown={handleKeyPress}
                />
                <Button className="" onClick={() => router.push(`/${encodeURIComponent(identifier)}`)}>
                  Fetch Identifier
                </Button>
              </div>
          <div className=" w-full px-4 md:px-8">
            {children}
          </div>
        </body>
      </Providers>
    </html>
);

}
