// UserSearch.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NeynarProfileCard } from '@neynar/react';
import { Loader2 } from 'lucide-react';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

const UserSearch = ({ searchQuery }: { searchQuery: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchUsers();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchUsers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const userUrl = new URL(
        'https://api.neynar.com/v2/farcaster/user/search'
      );
      userUrl.searchParams.append('q', searchQuery);
      userUrl.searchParams.append('limit', '10');
      if (cursor) {
        userUrl.searchParams.append('cursor', cursor);
      }

      const userResponse = await fetch(userUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!userResponse.ok)
        throw new Error('User search network response was not ok');
      const userData = await userResponse.json();
      const newUsers = userData.result.users;
      const newCursor = userData.result.next?.cursor || null;

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setCursor(newCursor);
      setHasMore(!!newCursor);
    } catch (error) {
      console.error('Error fetching search users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUsers([]);
    setCursor(null);
    setHasMore(true);
    fetchUsers();
  }, [searchQuery]);

  const handleShowMore = (identifier: string) => {
    window.open(`/${identifier}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      {users.map((user, index) => (
        <div
          key={user.fid}
          ref={index === users.length - 1 ? lastUserElementRef : null}
          className="border border-gray-200 rounded-none bg-[#333333]"
        >
          <NeynarProfileCard
            customStyles={{
              color: 'white',
              maxWidth: '100%',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              background: '#333333',
              border: 'none',
            }}
            fid={user.fid}
          />
          <div className="p-2">
            <button
              className="w-full py-1 bg-[#4C376C] text-white text-sm rounded hover:bg-purple-800 font-jetbrains"
              onClick={() => handleShowMore(user.fid.toString())}
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
            Loading more users...
          </span>
        </div>
      )}
      {!hasMore && users.length > 0 && (
        <p className="text-center text-white font-jetbrains mt-4">
          No more users to load
        </p>
      )}
      {!loading && users.length === 0 && (
        <p className="text-center text-white font-jetbrains">No users found</p>
      )}
    </div>
  );
};

export default UserSearch;
