'use client';
import Modal from '@/components/modal-component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { hubs } from '@/constants';
import { useClipboard } from '@/hooks/useClipboard';
import {
  extractIdentifierFromUrl,
  extractUsernameFromUrl,
  fetchCastAndFidData,
  isValidWarpcastUrl,
} from '@/lib/utils';
import { NeynarProfileCard, NeynarCastCard } from '@neynar/react';
import { capitalizeNickname } from '@/lib/helpers';
import { CopyCheckIcon, CopyIcon, UserIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from 'react';
import SkeletonHeader from '@/components/skeleton-header';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import ActionButtons from '@/components/ActionButtons';
import Search from '@/components/search';

interface ResponseProps {
  params: { identifier: string };
}

const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
};

export default function Page({ params }: ResponseProps) {
  const router = useRouter();
  const path = usePathname();
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
    const expectedTypes = [
      'USER_DATA_TYPE_PFP',
      'USER_DATA_TYPE_DISPLAY',
      'USER_DATA_TYPE_BIO',
      'USER_DATA_TYPE_USERNAME',
    ];

    if (message?.messages) {
      const foundTypes = new Set();
      message.messages.forEach((msg: any) => {
        if (msg.data?.userDataBody?.type) {
          foundTypes.add(msg.data.userDataBody.type);
        }
      });

      return expectedTypes.filter((type) => !foundTypes.has(type));
    }

    const missingObjects = [];
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

  const authorFidCast =
    warpcastCast?.author?.fid || neynarCast?.cast?.author?.fid;
  const authorFid =
    warpcastCast?.author?.fid ||
    neynarCast?.cast?.author?.fid ||
    neynarAuthor?.author?.fid ||
    warpcastAuthor?.author?.fid;

  const username =
    warpcast?.author?.username ??
    neynar?.author?.author?.username ??
    neynar?.cast?.cast?.author?.username ??
    warpcast?.cast?.author?.username ??
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
        className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-40"
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
                      'Neynar Hub',
                      neynarHubAuthor,
                      neynarAuthorHubMissing
                    )}
                    {renderHeader(
                      'Neynar Hub',
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
                {hash && !extractUsernameFromUrl(hash) ? (
                  <NeynarCastCard
                    type={isValidWarpcastUrl(identifier) ? 'url' : 'hash'}
                    identifier={identifier}
                    allowReactions={true}
                    customStyles={{
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      maxWidth: '480px',
                      minHeight: '439.25px',
                      background: '#333333',
                      border: '0.915556px solid #FFFFFF',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  />
                ) : authorFid ? (
                  <NeynarProfileCard fid={authorFid} />
                ) : null}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end gap-0 w-full">
              {loading ? null : castHash || username ? (
                <div className="flex flex-col justify-end px-4">
                  <div className="flex flex-row items-center">
                    <p className="text-white font-jetbrains mr-4 text-sm">
                      View
                    </p>
                    <button className="bg-[#333333] text-white px-1 text-sm h-8 border border-white hover:bg-purple-800 font-jetbrains">
                      <Link
                        href={
                          authorFidCast
                            ? `https://warpcast.com/${username}/${castHash.slice(0, 10)}`
                            : `https://warpcast.com/${username}`
                        }
                      >
                        <div className="flex flex-row space-x-1">
                          <p> on Warpcast </p>{' '}
                          <img src="/arrowright.png" alt="arrow right" />
                        </div>
                      </Link>
                    </button>
                    <button className="bg-[#333333] text-white px-1 text-sm h-8 border border-white hover:bg-purple-800 font-jetbrains">
                      <Link
                        href={
                          authorFidCast
                            ? `https://www.supercast.xyz/c/${castHash}`
                            : `https://www.supercast.xyz/${username}`
                        }
                      >
                        <div className="flex flex-row space-x-1">
                          <p> on Supercast </p>{' '}
                          <img src="/arrowright.png" alt="arrow right" />
                        </div>
                      </Link>
                    </button>
                  </div>

                  {authorFidCast ? (
                    <div className="flex flex-row justify-end">
                      <button className="bg-purple-800 text-black px-4 text-sm h-8 border border-white hover:bg-purple-900 font-jetbrains">
                        <Link href={`/${authorFidCast}`}>
                          <div className="font-jetbrains flex flex-row items-center space-x-1">
                            <p>Profile</p> <UserIcon className="w-4 h-4" />
                          </div>
                        </Link>
                      </button>
                    </div>
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
