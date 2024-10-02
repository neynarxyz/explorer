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
        allowReactions={true}
        containerStyles={{
          color: 'white',
          maxWidth: '100%',
          minWidth: '400px',
          minHeight: '400px',
          maxHeight: '100%',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'row',
          border: 'none',
          alignItems: 'center',
          background: '#333333',
        }}
        textStyles={{
          color: 'white',
          fontFamily: 'JetBrains Mono',
        }}
      />
    </Link>
  );
}
