import { NeynarCastCard } from '@neynar/react';
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.
import Link from 'next/link';

export function CastComponent({ cast, warpcastUrl }: any) {
  if (!cast) return null;
  return (
    <Link
      href={`/${warpcastUrl ? encodeURIComponent(warpcastUrl) : cast.hash}`}
    >
      <NeynarCastCard
        type={warpcastUrl ? 'url' : 'hash'}
        identifier={warpcastUrl ? warpcastUrl : cast.hash}
      />
    </Link>
  );
}
