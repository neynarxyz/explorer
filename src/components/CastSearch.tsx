'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { NeynarCastCard, NeynarProfileCard } from '@neynar/react';
import { Loader2 } from 'lucide-react';
import debounce from 'lodash/debounce';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface Cast {
  hash: string;
  text: string;
  author: {
    username: string;
    display_name: string;
    pfp_url: string;
  };
}

interface SearchParams {
  query: string;
  authorFid: string;
  channelId: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const CastSearch = ({ initialQuery }: { initialQuery: string }) => {
  const [username, setUsername] = useState('');
  const [channelId, setChannelId] = useState('');

  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: initialQuery,
    authorFid: '',
    channelId: '',
  });
  const [casts, setCasts] = useState<Cast[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [inputUsers, setInputUsers] = useState<User[]>([]);
  const [inputChannels, setInputChannels] = useState<Channel[]>([]);
  const [userCursor, setUserCursor] = useState('');
  const [castCursor, setCastCursor] = useState('');
  const [loading, setLoading] = useState({
    users: false,
    casts: false,
    inputUsers: false,
    inputChannels: false,
  });
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userObserverRef = useRef<IntersectionObserver | null>(null);
  const castObserverRef = useRef<IntersectionObserver | null>(null);
  const lastUserRef = useRef<HTMLDivElement>(null);
  const lastCastRef = useRef<HTMLDivElement>(null);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const handleShowMore = (identifier: string) => {
    window.open(`/${identifier}`, '_blank', 'noopener,noreferrer');
  };

  const fetchSearchUsers = useCallback(async (newSearch: boolean = false) => {
    if (loading.users || (!newSearch && !userCursor)) return;

    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const userUrl = new URL(
        'https://api.neynar.com/v2/farcaster/user/search'
      );
      userUrl.searchParams.append('q', searchParams.query);
      userUrl.searchParams.append('limit', '10');
      if (userCursor && !newSearch)
        userUrl.searchParams.append('cursor', userCursor);

      const userResponse = await fetch(userUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!userResponse.ok)
        throw new Error('User search network response was not ok');
      const userData = await userResponse.json();
      setSearchUsers((prevUsers) =>
        newSearch
          ? userData.result.users
          : [...prevUsers, ...userData.result.users]
      );
      if (userData.result.next) {
        setUserCursor(userData.result.next.cursor);
      } else {
        setUserCursor('');
      }
    } catch (error) {
      console.error('Error fetching search users:', error);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  }, []);

  const fetchCasts = useCallback(
    async (newSearch: boolean = false) => {
      if (loading.casts || (!newSearch && !castCursor)) return;

      setLoading((prev) => ({ ...prev, casts: true }));
      try {
        let castUrl = 'https://api.neynar.com/v2/farcaster/cast/search?';

        // Append query parameters
        castUrl += `q=${encodeURIComponent(initialQuery)}&limit=20`;

        if (castCursor && !newSearch) {
          castUrl += `&cursor=${encodeURIComponent(castCursor)}`;
        }

        if (searchParams.authorFid) {
          castUrl += `&author_fid=${encodeURIComponent(searchParams.authorFid)}`;
        }

        if (searchParams.channelId) {
          castUrl += `&channel_id=${encodeURIComponent(searchParams.channelId)}`;
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
        setCasts((prevCasts) =>
          newSearch
            ? castData.result.casts
            : [...prevCasts, ...castData.result.casts]
        );
        if (castData.result.next) {
          setCastCursor(castData.result.next.cursor);
        } else {
          setCastCursor('');
        }
      } catch (error) {
        console.error('Error fetching casts:', error);
      } finally {
        setLoading((prev) => ({ ...prev, casts: false }));
      }
    },
    [searchParams]
  );

  const performSearch = useCallback(() => {
    setSearchUsers([]);
    setCasts([]);
    setUserCursor('');
    setCastCursor('');
    fetchSearchUsers(true);
    fetchCasts(true);
  }, [fetchSearchUsers, fetchCasts]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(() => {
      performSearch();
    }, 300),
    [performSearch]
  );

  const fetchInputUsers = useCallback(async (inputUsername: string) => {
    if (loading.inputUsers || inputUsername.length < 1) return;

    setLoading((prev) => ({ ...prev, inputUsers: true }));
    try {
      const userUrl = new URL(
        'https://api.neynar.com/v2/farcaster/user/search'
      );
      userUrl.searchParams.append('q', inputUsername);
      userUrl.searchParams.append('limit', '5');

      const userResponse = await fetch(userUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!userResponse.ok)
        throw new Error('User search network response was not ok');
      const userData = await userResponse.json();
      setInputUsers(userData.result.users);
    } catch (error) {
      console.error('Error fetching input users:', error);
    } finally {
      setLoading((prev) => ({ ...prev, inputUsers: false }));
    }
  }, []);

  const fetchInputChannels = useCallback(async (inputChannelId: string) => {
    if (loading.inputChannels || inputChannelId.length < 1) return;

    setLoading((prev) => ({ ...prev, inputChannels: true }));
    try {
      const channelUrl = new URL(
        'https://api.neynar.com/v2/farcaster/channel/search'
      );
      channelUrl.searchParams.append('q', inputChannelId);
      channelUrl.searchParams.append('limit', '5');

      const channelResponse = await fetch(channelUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!channelResponse.ok)
        throw new Error('Channel search network response was not ok');
      const channelData = await channelResponse.json();
      setInputChannels(channelData.channels);
    } catch (error) {
      console.error('Error fetching input channels:', error);
    } finally {
      setLoading((prev) => ({ ...prev, inputChannels: false }));
    }
  }, []);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newUsername = e.target.value;
      setUsername(newUsername);
      if (newUsername.length > 0) {
        setShowUserDropdown(true);
      } else {
        setShowUserDropdown(false);
        setSearchParams((prev) => ({ ...prev, authorFid: '' }));
      }
      fetchInputUsers(newUsername);
    },
    [fetchInputUsers]
  );

  const handleUserSelect = useCallback((user: User) => {
    setUsername(user.username);
    setSearchParams((prev) => ({ ...prev, authorFid: user.fid.toString() }));
    setShowUserDropdown(false);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      debouncedSearch();
    },
    [debouncedSearch]
  );

  // Set up Intersection Observers
  useEffect(() => {
    const userObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    const castObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    userObserverRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchSearchUsers(false);
      }
    }, userObserverOptions);

    castObserverRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchCasts(false);
      }
    }, castObserverOptions);

    return () => {
      if (userObserverRef.current) userObserverRef.current.disconnect();
      if (castObserverRef.current) castObserverRef.current.disconnect();
    };
  }, [fetchSearchUsers, fetchCasts]);

  // Observe last user and cast elements
  useEffect(() => {
    if (lastUserRef.current && userObserverRef.current) {
      userObserverRef.current.observe(lastUserRef.current);
    }
    if (lastCastRef.current && castObserverRef.current) {
      castObserverRef.current.observe(lastCastRef.current);
    }
  }, [searchUsers, casts]);

  // Trigger search when searchParams change
  useEffect(() => {
    debouncedSearch();
  }, [searchParams, debouncedSearch]);

  // Handle click outside of dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleUsernameKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (inputUsers.length > 0) {
          handleUserSelect(inputUsers[0]);
        } else {
          handleSearch(e as any);
        }
      }
    },
    [inputUsers, handleUserSelect, handleSearch]
  );

  const handleChannelIdKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch(e as any);
      }
    },
    [handleSearch]
  );

  // ... (rest of the existing functions)

  const handleChannelIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChannelId = e.target.value;
      setChannelId(newChannelId);
      if (newChannelId.length > 0) {
        setShowChannelDropdown(true);
      } else {
        setShowChannelDropdown(false);
        setSearchParams((prev) => ({ ...prev, channelId: '' }));
      }
      fetchInputChannels(newChannelId);
    },
    [fetchInputChannels]
  );

  const handleChannelSelect = useCallback((channel: Channel) => {
    setChannelId(channel.name);
    setSearchParams((prev) => ({ ...prev, channelId: channel.id }));
    setShowChannelDropdown(false);
  }, []);

  // ... (rest of the existing useEffects)

  // Add a new useEffect for handling clicks outside the channel dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowChannelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto pb-8">
      <form onSubmit={handleSearch} className="space-y-2 mb-4">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-4 w-full justify-between md:space-x-4">
          <div className="relative w-1/2">
            <Input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onKeyDown={handleUsernameKeyDown}
              placeholder="Username (optional)"
              className="w-full rounded-none"
              ref={usernameInputRef}
              onFocus={() => {
                if (username && username.length > 0) {
                  setShowUserDropdown(true);
                }
              }}
            />
            {showUserDropdown && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
              >
                <ul className="max-h-[300px] overflow-auto">
                  {inputUsers.map((user) => (
                    <li
                      key={user.fid}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.pfp_url}
                        alt={user.display_name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="truncate">
                        {user.display_name} (@{user.username})
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="w-1/2">
            <Input
              type="text"
              value={channelId}
              onChange={handleChannelIdChange}
              onKeyDown={handleChannelIdKeyDown}
              placeholder="Channel ID (optional)"
              className="w-full sm:w-auto rounded-none sm:min-w-96"
            />
            {showChannelDropdown && (
              <div
                ref={channelDropdownRef}
                className="absolute z-10 w-full max-w-sm mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
              >
                <ul className="max-h-[300px] overflow-auto">
                  {inputChannels.map((channel) => (
                    <li
                      key={channel.id}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                      onClick={() => handleChannelSelect(channel)}
                    >
                      <img
                        src={channel.image_url}
                        alt={channel.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="truncate">{channel.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </form>

      {loading.users &&
      loading.casts &&
      searchUsers.length === 0 &&
      casts.length === 0 ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          <span className="ml-2 text-white font-jetbrains">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {searchUsers.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Users</h2>
              <div className="space-y-4 h-full overflow-y-auto pr-2">
                {searchUsers.map((user, index) => (
                  <div
                    key={user.fid}
                    ref={index === searchUsers.length - 1 ? lastUserRef : null}
                    className=" border items-center flex flex-col border-gray-200 rounded-none bg-[#333333] p-4"
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
                    <button
                      className="mt-1 flex px-2 py-1 bg-[#4C376C] text-white items-center rounded-none hover:bg-purple-800 font-jetbrains"
                      onClick={() => handleShowMore(user.fid.toString())}
                    >
                      Show Network Response
                    </button>
                  </div>
                ))}
                {loading.users && (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-white font-jetbrains">
                      Loading more users
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {casts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Casts</h2>
              <div className="space-y-4 h-full overflow-y-auto pr-2">
                {casts.map((cast, index) => (
                  <div
                    key={`${cast.hash}-${index}`}
                    ref={index === casts.length - 1 ? lastCastRef : null}
                    className=" border items-center flex flex-col border-gray-200 rounded-none bg-[#333333]"
                  >
                    <NeynarCastCard
                      customStyles={{
                        color: 'white',
                        maxWidth: '100%',
                        overflowX: 'hidden',
                        display: 'flex',
                        flexDirection: 'row',
                        border: 'none',
                        alignItems: 'center',
                        background: '#333333',
                      }}
                      type="hash"
                      identifier={cast.hash}
                    />
                    <button
                      className="mt-1 flex px-2 py-1 bg-[#4C376C] text-white items-center rounded hover:bg-purple-800 font-jetbrains"
                      onClick={() => handleShowMore(cast?.hash)}
                    >
                      Show Network Response
                    </button>
                  </div>
                ))}
                {loading.casts && (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                    <span className="ml-2 text-white font-jetbrains">
                      Loading more casts...
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {searchUsers.length === 0 &&
        casts.length === 0 &&
        !loading.users &&
        !loading.casts && (
          <p className="text-center text-white font-jetbrains">
            No results found
          </p>
        )}
    </div>
  );
};

export default CastSearch;
