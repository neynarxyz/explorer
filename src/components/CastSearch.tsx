// CastSearch.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NeynarCastCard } from '@neynar/react';
import { Loader2 } from 'lucide-react';

interface Cast {
  hash: string;
  text: string;
  author: {
    username: string;
    display_name: string;
    pfp_url: string;
  };
}

const CastSearch = ({
  searchQuery,
  username,
  channelId,
}: {
  searchQuery: string;
  username: string;
  channelId: string;
}) => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchCasts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchCasts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const castUrl = new URL(
        'https://api.neynar.com/v2/farcaster/cast/search'
      );
      castUrl.searchParams.append('q', searchQuery);
      castUrl.searchParams.append('limit', '20');

      if (cursor) {
        castUrl.searchParams.append('cursor', cursor);
      }

      if (username) {
        castUrl.searchParams.append('author_fid', username);
      }

      if (channelId) {
        castUrl.searchParams.append('channel_id', channelId);
      }

      const castResponse = await fetch(castUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!castResponse.ok)
        throw new Error('Cast search network response was not ok');
      const castData = await castResponse.json();
      const newCasts = castData.result.casts;

      setCasts((prevCasts) => [...prevCasts, ...newCasts]);
      setCursor(castData.result.next?.cursor || null);
      setHasMore(!!castData.result.next?.cursor);
    } catch (error) {
      console.error('Error fetching casts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCasts([]);
    setCursor(null);
    setHasMore(true);
    fetchCasts();
  }, [searchQuery, username, channelId]);

  const handleShowMore = (identifier: string) => {
    window.open(`/${identifier}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      {casts.map((cast, index) => (
        <div
          key={`${cast.hash}-${index}`}
          ref={index === casts.length - 1 ? lastCastElementRef : null}
          className="border border-gray-200 rounded-none  w-full h-full"
        >
          <NeynarCastCard
            containerStyles={{
              color: 'white',
              maxWidth: '100%',
              minWidth: '400px',
              maxHeight: '1000px',
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
            type="hash"
            identifier={cast.hash}
          />
          <div className="p-2">
            <button
              className="w-full py-1 bg-[#4C376C] text-white text-sm rounded hover:bg-purple-800 font-jetbrains"
              onClick={() => handleShowMore(cast.hash)}
            >
              Show Network Response
            </button>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-white font-jetbrains">
            Loading more casts...
          </span>
        </div>
      )}

      {!loading && casts.length === 0 && (
        <p className="text-center text-white font-jetbrains">No casts found</p>
      )}
    </div>
  );
};

export default CastSearch;
