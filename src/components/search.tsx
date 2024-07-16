'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import { SearchIcon } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';
import { RxCross1 } from 'react-icons/rx';
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
      className="flex flex-row items-start p-0 w-full h-[35px]"
      onSubmit={(e) => {
        e.preventDefault();
        amplitude.track('Search made', {
          identifier,
        });
        router.push(`/${encodeURIComponent(identifier)}`);
      }}
    >
      <div className="flex flex-row items-center pl-[7.5px] w-full h-[35px] bg-white border border-white">
        <input
          type="text"
          className="w-full h-[20px] font-pixelify focus:outline-none text-[15px] text-black flex-none order-0 flex-grow-0"
          placeholder="Enter FID, hash, warpcast url, or supercast url..."
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value)}
        />
      </div>
      <button className="flex flex-row justify-center items-center w-[42px] h-[35px] bg-[#5F3AB8] border border-white flex-none order-1 align-stretch flex-grow-0">
        <SearchIcon className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}
