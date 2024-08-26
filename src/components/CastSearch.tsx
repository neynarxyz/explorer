'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NeynarCastCard } from '@neynar/react';
import { useRouter, useSearchParams } from 'next/navigation';

const CastSearch = ({ query }: any) => {
  const params = useSearchParams();
  const initialAuthorFid = params.get('authorFid');
  const initialChannelId = params.get('channelId');
  const router = useRouter();

  const [authorFid, setAuthorFid] = useState(
    (initialAuthorFid as string) || ''
  );
  const [channelId, setChannelId] = useState(
    (initialChannelId as string) || ''
  );
  const [casts, setCasts] = useState<any[]>([]);
  const [cursor, setCursor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthorFid((initialAuthorFid as string) || '');
    setChannelId((initialChannelId as string) || '');
  }, [initialAuthorFid, initialChannelId]);

  const fetchCasts = useCallback(async () => {
    setLoading(true);
    try {
      console.log('fetching casts');
      console.log('query', query);
      console.log('cursor', cursor);
      console.log('authorFid', authorFid);
      console.log('channelId', channelId);
      const url = new URL('https://api.neynar.com/v2/farcaster/cast/search');
      if (query) url.searchParams.append('q', query);
      url.searchParams.append('limit', '100');
      if (cursor) url.searchParams.append('cursor', cursor);
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
      console.log('data', data);
      setCasts((prevCasts) => [...prevCasts, ...data.result.casts]);
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
  }, [query, cursor, authorFid, channelId]);

  useEffect(() => {
    if (query || authorFid || channelId) fetchCasts();
  }, [query, authorFid, channelId, fetchCasts]);

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
    setCasts([]);
    setCursor('');
    fetchCasts();
    const params = new URLSearchParams();
    if (authorFid) params.append('authorFid', authorFid);
    if (channelId) params.append('channelId', channelId);
    router.push(`/${query}?${params.toString()}`);
  };

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
        {loading && !casts ? <p>Loading....</p> : null}
        {casts.map((cast, index) => (
          <NeynarCastCard key={index} type="hash" identifier={cast?.hash} />
        ))}
      </div>
    </div>
  );
};

export default CastSearch;
