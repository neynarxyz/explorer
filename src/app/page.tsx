"use client";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next13-progressbar";
import { CastComponent } from '@/components/cast-component';

export default function Home() {
  const [identifier, setIdentifier] = useState<string>("");
  const router = useRouter();

  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_STREAM_SERVER}/stream`);

    eventSource.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages: any) => [message, ...prevMessages]);
    };

    eventSource.onerror = (error) => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      router.push(`/${encodeURIComponent(identifier)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <Input
        className="w-full h-10 md:w-96"
        placeholder="Enter a FID, hash, or warpcast url..."
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.target.value)}}
       onKeyDown={handleKeyPress}
      />

      <Button onClick={() => router.push(`/${encodeURIComponent(identifier)}`)}>Fetch Identifier</Button>
      <div className='flex flex-col space-y-4 p-5 m-5'>
        {messages.map((message: any, index: number) => {
          return <CastComponent key={index} cast={message} />;
        })}
      </div>
    </div>
  );
}
