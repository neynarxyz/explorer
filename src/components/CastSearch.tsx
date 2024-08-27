'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NeynarCastCard } from '@neynar/react';
import { useRouter } from 'next/navigation';
import useSearchParamsWithoutSuspense from '@/hooks/useSearchParamsWithoutSuspense';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

const CastSearch = ({ query }: { query: string }) => {
  const params = useSearchParamsWithoutSuspense();
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [authorFid, setAuthorFid] = useState('');
  const [channelId, setChannelId] = useState('');
  const [casts, setCasts] = useState<any[]>([]);
  const [cursor, setCursor] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showUserPopover, setShowUserPopover] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Initialize filters from URL params
  useEffect(() => {
    if (params) {
      setAuthorFid(params.get('authorFid') || '');
      setChannelId(params.get('channelId') || '');
    }
  }, [params]);

  const fetchUsers = useCallback(async (username: string) => {
    if (username.length < 1) {
      setUsers([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/search?q=${username}`,
        {
          headers: {
            Accept: 'application/json',
            api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
          },
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      setUsers(data.result.users);
      setShowUserPopover(true);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUsername = e.target.value;
      setUsername(newUsername);
      fetchUsers(newUsername);
    },
    [fetchUsers]
  );

  const handleUserSelect = useCallback((user: User) => {
    setAuthorFid(user.fid.toString());
    setUsername(user.username);
    setShowUserPopover(false);
    const newParams = new URLSearchParams();
    if (channelId) newParams.append('channelId', channelId);
    newParams.append('authorFid', user.fid.toString());
    router.push(`/${query}?${newParams.toString()}`);
  }, []);

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

  const handleSearch = useCallback(
    (e: any) => {
      e.preventDefault();
      const newParams = new URLSearchParams();

      if (authorFid) newParams.append('authorFid', authorFid);
      if (channelId) newParams.append('channelId', channelId);
      router.push(`/${query}?${newParams.toString()}`);
      setCasts([]);
      setCursor('');
      fetchCasts(true);
    },
    [authorFid, channelId, query, router, fetchCasts]
  );

  // Initial fetch when component mounts
  useEffect(() => {
    if (query || authorFid || channelId) {
      fetchCasts(true);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Handle click outside of popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowUserPopover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex-1 items-center flex flex-col justify-center">
      <form onSubmit={handleSearch} className="w-full max-w-4xl space-y-4 mb-8">
        <div className="flex flex-row space-x-2">
          <div className="relative w-full">
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="author username (optional)"
              className="w-full"
              ref={usernameInputRef}
              onFocus={() => setShowUserPopover(true)}
            />
            {showUserPopover && (
              <div
                ref={popoverRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
              >
                <ul className="max-h-[300px] overflow-auto">
                  {users.map((user) => (
                    <li
                      key={user.fid}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.pfp_url}
                        alt={user.display_name}
                        className="w-8 h-8 rounded-full inline-block mr-2"
                      />
                      {user.display_name} (@{user.username})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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

      <div className="space-y-4 p-4 w-full max-w-4xl items-center justify-center flex flex-col">
        {loading && casts.length === 0 ? (
          <p className="text-center text-white font-jetbrains">Loading....</p>
        ) : casts && casts.length ? (
          casts.map((cast, index) => (
            <NeynarCastCard
              className="text-center text-white font-jetbrains"
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
