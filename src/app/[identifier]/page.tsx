'use client';
import CastSearch from '@/components/CastSearch';
import NetworkResponse from '@/components/NetworkResponse';
import Search from '@/components/search';

interface ResponseProps {
  params: { identifier: string };
}

const isNetworkResponse = (identifier: string): boolean => {
  const patterns = [
    /^https:\/\/www\.supercast\.xyz\/[a-zA-Z0-9]+$/,
    /^https:\/\/www\.supercast\.xyz\/c\/0x[a-fA-F0-9]{40}$/,
    /^https:\/\/warpcast\.com\/[a-zA-Z0-9]+$/,
    /^https:\/\/warpcast\.com\/[a-zA-Z0-9]+\/0x[a-fA-F0-9]{8}$/,
    /^0x[a-fA-F0-9]{40}$/,
    /^\d+$/, // This pattern matches any string consisting only of digits
  ];

  return patterns.some((pattern) => pattern.test(identifier));
};

export default function Page({ params }: ResponseProps) {
  let identifier = decodeURIComponent(params.identifier);

  const isSearch = !isNetworkResponse(identifier);

  return (
    <div className="w-full flex-1 items-center flex flex-row justify-center">
      <div className="flex flex-col max-w-3xl space-y-0">
        <div className="">
          <div className="p-1 text-center bg-black border border-white w-[40%]">
            <p className="text-white  text-[15px] font-jetbrains">
              showing results for:
            </p>
          </div>
        </div>

        <div className="flex pb-4">
          <Search />
        </div>
        {isSearch ? (
          <CastSearch query={encodeURIComponent(identifier)} />
        ) : (
          <NetworkResponse identifier={identifier} />
        )}
      </div>
    </div>
  );
}
