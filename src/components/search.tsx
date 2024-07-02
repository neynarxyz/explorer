'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';

export default function Search() {
  const router = useRouter();
  const path = usePathname();
  const [identifier, setIdentifier] = useState<string>(
    decodeURIComponent(path.slice(1))
  );

  useEffect(() => {
    const identifier = decodeURIComponent(path.slice(1));
    setIdentifier(identifier);
  }, [path]);

  return (
    <form
      className="flex gap-2 items-center w-full"
      onSubmit={(e) => {
        e.preventDefault();
        amplitude.track('Search made', {
          identifier,
        });
        router.push(`/${encodeURIComponent(identifier)}`);
      }}
    >
      <Input
        className="flex-auto min-w-[100px]"
        placeholder="Enter a FID, hash, or warpcast url..."
        value={identifier}
        onChange={(e) => setIdentifier(e.currentTarget.value)}
      />
      <Button>
        <SearchIcon className="w-5 h-5" />
      </Button>
    </form>
  );
}
