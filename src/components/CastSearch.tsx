'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NeynarCastCard } from '@neynar/react';
import { useRouter } from 'next/navigation';
import useSearchParamsWithoutSuspense from '@/hooks/useSearchParamsWithoutSuspense';

const CastSearch = ({ query }: { query: string }) => {
  const params = useSearchParamsWithoutSuspense();
  const router = useRouter();

  const [authorFid, setAuthorFid] = useState('');
  const [channelId, setChannelId] = useState('');
  const [casts, setCasts] = useState<any[]>([]);
  const [cursor, setCursor] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    if (params) {
      setAuthorFid(params.get('authorFid') || '');
      setChannelId(params.get('channelId') || '');
    }
  }, [params]);

  const fetchCasts = useCallback(
    async (newSearch: boolean = false) => {
      setLoading(true);
      try {
        const url = new URL('https://api.neynar.com/v2/farcaster/cast/search');
        if (query) url.searchParams.append('q', query);
        url.searchParams.append('limit', '100');
        if (cursor && !newSearch) url.searchParams.append('cursor', cursor);
        if (authorFid) url.searchParams.append('author_fid', authorFid);
        if (channelId) url.searchParams.append('channel_id', channelId);

        const headers = new Headers();
        headers.append('Accept', 'application/json');
        headers.append('api_key', process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '');
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setCasts((prevCasts) =>
          newSearch ? data.result.casts : [...prevCasts, ...data.result.casts]
        );
        if (data.result.next) {
          setCursor(data.result.next.cursor);
        } else {
          setCursor('');
        }
      } catch (error) {
        console.error('Error fetching casts:', error);
      } finally {
        setLoading(false);
      }
    },
    [query, cursor, authorFid, channelId]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading
    ) {
      return;
    }
    fetchCasts();
  }, [fetchCasts, loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (authorFid) newParams.append('authorFid', authorFid);
    if (channelId) newParams.append('channelId', channelId);
    router.push(`/${query}?${newParams.toString()}`);
    setCasts([]);
    setCursor('');
    fetchCasts(true);
  };

  // Initial fetch when component mounts
  useEffect(() => {
    if (query || authorFid || channelId) {
      fetchCasts(true);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <div className="w-full flex-1 items-center flex flex-col justify-center">
      <form onSubmit={handleSearch} className="w-full max-w-4xl space-y-4 mb-8">
        <div className="flex flex-row space-x-2">
          <Input
            type="number"
            value={authorFid}
            onChange={(e) => setAuthorFid(e.target.value)}
            placeholder="Author FID (optional)"
            className="w-full"
          />
          <Input
            type="text"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
            placeholder="Channel ID (optional)"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Apply Filters
        </Button>
      </form>

      <div className="space-y-4 p-4 w-full max-w-4xl">
        {loading && casts.length === 0 ? (
          <p className="text-center text-white font-jetbrains">Loading....</p>
        ) : casts && casts.length ? (
          casts.map((cast, index) => (
            <NeynarCastCard
              key={`${cast.hash}-${index}`}
              type="hash"
              identifier={cast?.hash}
            />
          ))
        ) : (
          <p className="text-center text-white font-jetbrains">
            No casts found
          </p>
        )}
      </div>
    </div>
  );
};

export default CastSearch;
