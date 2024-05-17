"use client"
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetchHubData from "@/hooks/fetchHubData";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import { CodeBlock, dracula } from 'react-code-blocks';
import { defaultFID, defaultHash } from "@/constants";

import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { CastComponent } from '@/components/cast-component';

export default function Home() {
  const [fid, setFid] = useState<number | null>(null);
  const [hash, setHash] = useState<string>("");
  const router = useRouter()

  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages: any) => [message,...prevMessages]);
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <Input
        className="w-full max-w-xs h-10"
        placeholder={`Enter hash of cast... (${defaultHash.slice(0,5)}...)`}
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <Input
        className="w-full max-w-xs h-10"
        placeholder="Enter FID... (cast author if testing casts)"
        type="number"
        value={fid ?? ''}
        onChange={(e) => setFid(Number(e.target.value) || null)}
      />
      <Button onClick={() => router.push(`/${hash}/${fid}`)}>Fetch Data</Button>
    <div className='flex flex-col space-y-4 p-5 m-5'>
      {messages.map((message:any, index: any) => {
        return <CastComponent key={index} cast={message} />
      })
       }

</div>
    
    </div>
  );
}

