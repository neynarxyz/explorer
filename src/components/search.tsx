'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import { SearchIcon, X } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';
import useSearchParamsWithoutSuspense from '@/hooks/useSearchParamsWithoutSuspense';

export default function Search() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParamsWithoutSuspense();
  const [identifier, setIdentifier] = useState<string>('');

  useEffect(() => {
    const identifier = decodeURIComponent(path.slice(1));
    setIdentifier(identifier);
  }, [path]);

  const handleClearInput = () => {
    setIdentifier('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams) {
      const newParams = new URLSearchParams();
      const authorFid = searchParams.get('authorFid') || '';
      const channelId = searchParams.get('channelId') || '';
      if (authorFid) newParams.append('authorFid', authorFid);
      if (channelId) newParams.append('channelId', channelId);

      amplitude.track('Search made', {
        identifier,
        ...Object.fromEntries(newParams.entries()),
      });

      router.push(`/${encodeURIComponent(identifier)}?${newParams.toString()}`);
    }
  };

  return (
    <form
      className="flex flex-row items-start p-0 w-full h-[35px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row items-center pl-[7.5px] w-full h-[35px] bg-white border border-white relative">
        <input
          type="text"
          className="w-full font-jetbrains focus:outline-none text-[15px] text-black"
          placeholder="Enter FID, hash, warpcast url, or supercast url..."
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value)}
        />
        {identifier && (
          <button
            type="button"
            onClick={handleClearInput}
            className="flex flex-row justify-center h-[35px] bg-[#333333] items-center w-[40px] hover:bg-gray-600 border border-white"
          >
            <X className="w-16 h-7 text-white p-1 font-bold" />
          </button>
        )}
      </div>
      <button className="flex flex-row justify-center items-center w-[42px] h-[35px] bg-[#5F3AB8] border border-white">
        <SearchIcon className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}
