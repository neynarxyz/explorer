
'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import "react-farcaster-embed/dist/styles.css";

const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-1 justify-center items-center h-full">{children}</body>
    </html>
  );
}
