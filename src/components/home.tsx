'use client';
import { CastComponent } from '@/components/cast-component';
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants';
import Link from 'next/link';
import HubsDataComponent from './hubs-data';
import { NeynarProfileCard } from '@neynar/react';

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center space-y-24">
      <div className="max-w-3xl w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-x-5">
        <div className="space-y-4">
          <p className="text-center">Example hash</p>
          <div className="h-30 w-full flex justify-center items-center">
            <CastComponent cast={exampleCast} />
          </div>

          <p className="text-center">Example FID</p>
          <div className="h-30 w-full flex justify-center items-center">
            <Link href="/3">
              <NeynarProfileCard fid={3} />
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-center">Example Warpcast cast url</p>
          <div className="h-30 w-full flex justify-center items-center">
            <CastComponent
              cast={warpcastURLCast}
              warpcastUrl={warpcastURLCastURL}
            />
          </div>

          <p className="text-center">Example Warpcast profile url</p>
          <div className="h-30 w-full flex justify-center items-center">
            <Link
              href={`/${encodeURIComponent(warpcastURLProfile)}`}
              className="w-full h-full flex justify-center items-center"
            >
              <NeynarProfileCard fid={616} />
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center mt-16">
        <HubsDataComponent />
      </div>
    </div>
  );
}
