"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next13-progressbar";
import { CastComponent } from '@/components/cast-component';

export default function Home() {

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

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <div className='flex flex-col items-center space-y-4 p-5 m-5'>
        {messages.map((message: any, index: number) => {
          return <CastComponent key={index} cast={message} />;
        })}
      </div>
    </div>
  );
  
}
