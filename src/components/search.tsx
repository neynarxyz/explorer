'use client'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next13-progressbar";
import { usePathname } from "next/navigation";

export default function Search({
}: Readonly<{

}>) {  
    const searchParams = usePathname()

  
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      router.push(`/${encodeURIComponent(identifier)}`);
    }
  };

  useEffect(() => {
    if(searchParams === "/") {
        setIdentifier("")
    } 
    else {
        setIdentifier(decodeURIComponent(searchParams.split("/")[1]))
    }
  }, [searchParams])

  return (
          <div className="flex flex-col items-center w-full space-y-4">
            <Input
              className="w-full h-10 md:w-96"
              placeholder="Enter a FID, hash, or warpcast url..."
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
              }}
              onKeyDown={handleKeyPress}
            />
            <Button onClick={() => router.push(`/${encodeURIComponent(identifier)}`)}>
              Fetch Identifier
            </Button>
          </div>
  );
}