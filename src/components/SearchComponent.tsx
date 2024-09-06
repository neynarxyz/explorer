// Search.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import UserSearch from './UserSearch';
import CastSearch from './CastSearch';
import { debounce } from 'lodash';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const SearchComponent = ({ initialQuery }: { initialQuery: string }) => {
  const [activeTab, setActiveTab] = useState('casts');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [username, setUsername] = useState('');
  const [channelId, setChannelId] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [submittedChannelId, setSubmittedChannelId] = useState('');
  const [inputUsers, setInputUsers] = useState<User[]>([]);
  const [inputChannels, setInputChannels] = useState<Channel[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [loading, setLoading] = useState({
    inputUsers: false,
    inputChannels: false,
  });

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUsername('');
    setChannelId('');
    setSubmittedUsername('');
    setSubmittedChannelId('');
  };

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

  const debouncedFetchInputUsers = useCallback(debounce(fetchInputUsers, 300), [
    fetchInputUsers,
  ]);
  const debouncedFetchInputChannels = useCallback(
    debounce(fetchInputChannels, 300),
    [fetchInputChannels]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length > 0) {
      setShowUserDropdown(true);
      debouncedFetchInputUsers(newUsername);
    } else {
      setShowUserDropdown(false);
      setSubmittedUsername('');
    }
  };

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChannelId = e.target.value;
    setChannelId(newChannelId);
    if (newChannelId.length > 0) {
      setShowChannelDropdown(true);
      debouncedFetchInputChannels(newChannelId);
    } else {
      setShowChannelDropdown(false);
      setSubmittedChannelId('');
    }
  };

  const handleUserSelect = (user: User) => {
    setUsername(user.username);
    setSubmittedUsername(user.fid.toString());
    setShowUserDropdown(false);
  };

  const handleChannelSelect = (channel: Channel) => {
    setChannelId(channel.name);
    setSubmittedChannelId(channel.id);
    setShowChannelDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
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
    <div className="w-full max-w-6xl h-full mx-auto bg-[#4C376C]">
      <div className="flex">
        <button
          className={`w-24 py-2 text-white font-jetbrains text-sm ${
            activeTab === 'casts' ? 'bg-[#333333]' : 'bg-black'
          }`}
          onClick={() => handleTabChange('casts')}
        >
          Casts
        </button>
        <button
          className={`w-24 py-2 text-white font-jetbrains text-sm border-l border-white ${
            activeTab === 'users' ? 'bg-[#333333]' : 'bg-black'
          }`}
          onClick={() => handleTabChange('users')}
        >
          Users
        </button>
      </div>

      <div className="flex flex-col sm:flex-row w-full justify-between sm:space-x-4">
        {activeTab === 'casts' && (
          <>
            <div className="relative w-full sm:w-1/2 sm:mb-0">
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSubmittedUsername(username);
                    setShowUserDropdown(false);
                  }
                }}
                placeholder="Username (optional)"
                className="w-full rounded-none bg-white text-black"
              />
              {showUserDropdown && (
                <div
                  ref={userDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none"
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
            <div className="relative w-full sm:w-1/2">
              <Input
                type="text"
                value={channelId}
                onChange={handleChannelIdChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSubmittedChannelId(channelId);
                    setShowChannelDropdown(false);
                  }
                }}
                placeholder="Channel ID (optional)"
                className="w-full rounded-none bg-white text-black"
              />
              {showChannelDropdown && (
                <div
                  ref={channelDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none"
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
          </>
        )}
      </div>

      {activeTab === 'casts' ? (
        <CastSearch
          searchQuery={searchQuery}
          username={submittedUsername}
          channelId={submittedChannelId}
        />
      ) : (
        <UserSearch searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default SearchComponent;
