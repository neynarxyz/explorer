
import "./globals.css";
import "react-farcaster-embed/dist/styles.css";
import Link from "next/link";
import Providers from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return ( 
    <html lang="en">
      <Providers>
      <body className="relative flex flex-col flex-1 justify-center items-center h-full">
        <div className="absolute left-2 top-4 px-10 w-full flex items-center justify-between">
          <Link href="/" className="text-black font-bold">
            <p className="text-lg md:text-xl">Farcaster Explorer</p>
          </Link>
          <Link href="https://www.neynar.com" target="_blank">
            <img className="w-16 md:w-32" src={"/neynar.png"} />
          </Link>
        </div>

        <div className="mt-16 md:mt-20 w-full px-4 md:px-8">
          {children}
        </div>
      </body>
      </Providers>
    </html>

  );
}
