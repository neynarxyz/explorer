'use client';

import { CastComponent } from '@/components/cast-component';
import { ProfileComponent } from '@/components/profile-component';
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants';
import { NeynarProfileCard } from '@neynar/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-center">Example hash</p>
          <div>
            <CastComponent cast={exampleCast} />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-center">Example FID</p>
          <div>
            <Link href="/3">
              <NeynarProfileCard fid={3} />
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-center">Example Warpcast cast url</p>
          <div>
            <CastComponent
              cast={warpcastURLCast}
              warpcastUrl={warpcastURLCastURL}
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-center">Example Warpcast profile url</p>
          <div>
            {warpcastURLProfile ? (
              <Link href={`/${warpcastURLProfile}`}>
                <NeynarProfileCard fid={616} />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
