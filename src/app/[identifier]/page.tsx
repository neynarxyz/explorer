'use client';
import Modal from '@/components/modal-component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { hubs } from '@/constants';
import { useClipboard } from '@/hooks/useClipboard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  extractIdentifierFromUrl,
  extractUsernameFromUrl,
  fetchCastAndFidData,
  isValidWarpcastUrl,
} from '@/lib/utils';
import { NeynarProfileCard, NeynarCastCard } from '@neynar/react';
import { capitalizeNickname, isFollowSyntax, isNumeric } from '@/lib/helpers';
import { CopyCheckIcon, CopyIcon, UserIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from 'react';
import SkeletonHeader from '@/components/skeleton-header';
import { Input } from '@/components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import ActionButtons from '@/components/ActionButtons';
import Search from '@/components/search';

interface ResponseProps {
  params: { identifier: string };
}

export default function Page({ params }: ResponseProps) {
  const router = useRouter();
  let identifier = decodeURIComponent(params.identifier);
  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  let hash = fid ? null : identifier;

  if (identifier.includes('https://www.supercast.xyz/c/')) {
    const extractedIdentifier = extractIdentifierFromUrl(identifier);
    if (extractedIdentifier) {
      identifier = extractedIdentifier;
      hash = extractedIdentifier;
    } else {
      console.error('Invalid URL identifier');
    }
  }
  const [data, setData] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtherHubs, setShowOtherHubs] = useState(false);
  const [clickedHeader, setClickedHeader] = useState<string | null>(null);

  const checkWarning = (message: any) => {
    if (!message) return [];

    const missingObjects = [];
    let expectedUserTypes = [
      'USER_DATA_TYPE_PFP',
      'USER_DATA_TYPE_DISPLAY',
      'USER_DATA_TYPE_BIO',
      'USER_DATA_TYPE_USERNAME',
    ];
    if (message?.followedBy && message?.follow) {
      if (
        !message?.followedBy.type ||
        message?.followedBy.type !== 'MESSAGE_TYPE_LINK_ADD'
      ) {
        missingObjects.push('Followed By');
      }
      if (
        !message?.follow.type ||
        message?.follow.type !== 'MESSAGE_TYPE_LINK_ADD'
      ) {
        missingObjects.push('Following');
      }
      return missingObjects;
    }

    if (message?.messages) {
      const foundTypes = new Set();
      message.messages.forEach((msg: any) => {
        if (msg.data?.userDataBody?.type) {
          foundTypes.add(msg.data.userDataBody.type);
        }
      });

      return expectedUserTypes.filter((type) => !foundTypes.has(type));
    }

    const following = message?.following;
    const followedBy = message?.followed_by;

    if (following !== undefined && following === false)
      missingObjects.push('Following');
    if (followedBy !== undefined && followedBy === false)
      missingObjects.push('Followed By');
    if (followedBy !== undefined && following !== undefined) {
      return missingObjects;
    }

    const authorFid = message?.fid;
    const expectedUsername = `!${authorFid}`;
    const username = message?.username;
    const pfp = message?.pfp?.url || message?.pfp_url;
    const displayName = message?.display_name || message?.displayName;
    const bio = message?.profile?.bio?.text;

    if (!pfp) missingObjects.push('PFP');
    if (!displayName) missingObjects.push('Display Name');
    if (!bio) missingObjects.push('Bio');
    if (!username || username === expectedUsername)
      missingObjects.push('Username');

    return missingObjects;
  };

  const fetchData = async () => {
    setLoading(true);
    const data = (await fetchCastAndFidData(hash, fid)) as any;
    const warpcastAuthorMissing = checkWarning(data.apiData.warpcast?.author);
    const neynarAuthorMissing = checkWarning(
      data.apiData.neynar?.author?.author
    );
    const warpcastAuthorHubMissing = checkWarning(data.hubData?.[0]?.author);
    const neynarAuthorHubMissing = checkWarning(data.hubData?.[1]?.author);
    const warpcastCastMissing = [] as any;
    const neynarCastMissing = [] as any;

    setData({
      ...data,
      warpcastAuthorMissing,
      neynarAuthorMissing,
      warpcastAuthorHubMissing,
      neynarAuthorHubMissing,
      warpcastCastMissing,
      neynarCastMissing,
      warpcastCastHubMissing: [],
      neynarCastHubMissing: [],
    });

    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
  }, [hash, fid]);

  const openModal = (
    title: string,
    response: any,
    missingObjects: string[]
  ) => {
    setModalTitle(title);
    setModalData({ ...response, missingObjects });
    setIsModalOpen(true);
    setClickedHeader(title); // Set the clicked header
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setClickedHeader(null); // Reset the clicked header
  };

  const { warpcast, neynar } = data?.apiData ?? {};
  const {
    warpcastAuthorMissing,
    neynarAuthorMissing,
    warpcastAuthorHubMissing,
    neynarAuthorHubMissing,
    warpcastCastMissing,
    neynarCastMissing,
    warpcastCastHubMissing,
    neynarCastHubMissing,
  } = data ?? {};

  const hubsData = data?.hubData ?? [];
  const hoyt = hubsData[0] ?? {};
  const neynarHub = hubsData[1] ?? {};
  const { author: hoytAuthor, cast: hoytCast } = hoyt || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};

  const authorFid =
    warpcastCast?.author?.fid ||
    neynarCast?.cast?.author?.fid ||
    neynarAuthor?.author?.fid ||
    warpcastAuthor?.author?.fid;

  const username =
    warpcastAuthor?.username ??
    neynarAuthor?.author?.username ??
    neynarCast?.cast?.author?.username ??
    warpcastCast?.cast?.author?.username ??
    null;
  const castHash = neynar?.cast?.cast?.hash ?? warpcast?.cast?.hash ?? null;

  const renderHeader = (label: string, data: any, missingObjects: any[]) => {
    if (!data) {
      return null;
    }

    let icon = '✅';
    let backgroundColor = '#03A800';
    let hoverColor = '#028700'; // Adjust hover color

    if (data?.is_server_dead) {
      icon = '❓';
      backgroundColor = '#FFA500';
      hoverColor = '#CC8400'; // Adjust hover color
    } else if (data?.error) {
      icon = '❌';
      backgroundColor = '#C67A7D';
      hoverColor = '#A66060'; // Adjust hover color
    } else if (missingObjects.length > 0) {
      icon = '⚠️';
      backgroundColor = '#FFD700';
      hoverColor = '#CCB300'; // Adjust hover color
    }

    const isClicked = clickedHeader === label;
    const activeColor = isClicked ? '#03039A' : backgroundColor;

    return (
      <button
        style={{ backgroundColor: activeColor }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = isClicked
            ? '#03039A'
            : hoverColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = isClicked
            ? '#03039A'
            : backgroundColor)
        }
        className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-52"
        onClick={() => openModal(label, data, missingObjects)}
      >
        <p className="text-center text-sm font-jetbrains">
          {label} {icon}
        </p>
      </button>
    );
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        toggleModal={closeModal}
        response={modalData}
        title={modalTitle}
      />
      <div className="w-full flex-1 items-center flex flex-row justify-center">
        <div className="flex flex-col max-w-2xl space-y-0">
          <div className="bg-black flex flex-col">
            <div className="p-1 text-center border border-white w-[40%]">
              <p className="text-white text-[15px] font-jetbrains">
                showing results for:
              </p>
            </div>
            <div className="flex bg-black pb-4">
              <Search />
            </div>
            <div className="items-center flex flex-col px-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0">
                {loading ? (
                  <>
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                  </>
                ) : (
                  <>
                    {renderHeader(
                      'Warpcast API',
                      warpcastAuthor,
                      warpcastAuthorMissing
                    )}
                    {renderHeader(
                      'Warpcast API',
                      warpcastCast,
                      warpcastCastMissing
                    )}
                    {renderHeader(
                      capitalizeNickname(hoyt.name),
                      hoytAuthor,
                      warpcastAuthorHubMissing
                    )}
                    {renderHeader(
                      capitalizeNickname(hoyt.name),
                      hoytCast,
                      warpcastCastHubMissing
                    )}
                    {renderHeader(
                      'Neynar hub',
                      neynarHubAuthor,
                      neynarAuthorHubMissing
                    )}
                    {renderHeader(
                      'Neynar hub',
                      neynarHubCast,
                      neynarCastHubMissing
                    )}
                    {renderHeader(
                      'Neynar API',
                      neynarAuthor,
                      neynarAuthorMissing
                    )}
                    {renderHeader('Neynar API', neynarCast, neynarCastMissing)}
                    {!showOtherHubs ? (
                      <button
                        className="bg-[#4C376C] text-sm px-1 border border-white h-6 text-white hover:bg-purple-800 font-jetbrains"
                        onClick={() => {
                          amplitude.track('See more hubs', { identifier });
                          setShowOtherHubs(true);
                        }}
                      >
                        <div className="flex flex-row items-center">
                          Show other hubs{' '}
                          <img src="/eye.png" className="ml-1" />
                        </div>
                      </button>
                    ) : (
                      <button
                        className="bg-white text-black px-1 text-sm h-6 border border-white hover:bg-purple-800 font-jetbrains"
                        onClick={() => {
                          amplitude.track('Hide other hubs', { identifier });
                          setShowOtherHubs(false);
                        }}
                      >
                        <div className="flex flex-row items-center">
                          Hide other hubs{' '}
                          <img src="/eyecross.png" className="ml-1" />
                        </div>
                      </button>
                    )}
                    {showOtherHubs && (
                      <div>
                        {hubs.slice(2).map((hub, index) => {
                          const hubData = data?.hubData?.[index + 2];
                          const missingObjects = checkWarning(hubData?.author);
                          return (
                            <div key={index}>
                              {renderHeader(
                                `${capitalizeNickname(hub.shortname)}`,
                                hubData,
                                missingObjects
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="hidden md:block">
                {hash && isFollowSyntax(hash) ? null : hash &&
                  !extractUsernameFromUrl(hash) ? (
                  <NeynarCastCard
                    type={isValidWarpcastUrl(identifier) ? 'url' : 'hash'}
                    identifier={identifier}
                    allowReactions={true}
                    customStyles={{
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: '#333333',
                      border: '0.915556px solid #FFFFFF',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  />
                ) : authorFid ? (
                  <NeynarProfileCard
                    fid={authorFid}
                    customStyles={{
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: '#333333',
                      border: '0.915556px solid #FFFFFF',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end gap-0 w-full">
              {loading ? null : castHash || username ? (
                <div className="flex flex-col justify-end">
                  {loading ? null : castHash || username ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {' '}
                        <Button className="font-jetbrains bg-white text-black hover:bg-gray-200 text-md p-1 px-3 rounded-none ">
                          open
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white rounded-none">
                        <DropdownMenuItem
                          className="font-jetbrains bg-white"
                          onClick={(e) => {
                            router.push(
                              castHash
                                ? `https://warpcast.com/${username}/${castHash.slice(0, 10)}`
                                : `https://warpcast.com/${username}`
                            );
                          }}
                        >
                          in Warpcast
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-jetbrains"
                          onClick={(e) => {
                            router.push(
                              castHash
                                ? `https://www.supercast.xyz/c/${castHash}`
                                : `https://www.supercast.xyz/${username}`
                            );
                          }}
                        >
                          in Supercast
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-row justify-end">
            <ActionButtons fid={fid} hash={castHash} identifier={identifier} />
          </div>
        </div>
      </div>
    </>
  );
}
