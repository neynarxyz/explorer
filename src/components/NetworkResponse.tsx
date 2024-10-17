import { hubs } from '@/constants';
import { isNumeric, capitalizeNickname, isFollowSyntax } from '@/lib/helpers';
import {
  extractIdentifierFromUrl,
  fetchCastAndFidData,
  extractUsernameFromUrl,
  isValidWarpcastUrl,
  emptyFrame,
} from '@/lib/utils';
import { NeynarCastCard, NeynarProfileCard } from '@neynar/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next13-progressbar';
import { useState, useEffect } from 'react';
import ActionButtons from './ActionButtons';
import Modal from './modal-component';
import SkeletonHeader from './skeleton-header';
import * as amplitude from '@amplitude/analytics-browser';
import Search from './search';

const NetworkResponse = ({ identifier }: any) => {
  const router = useRouter();
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
        className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-[11.5rem]"
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
        <div className="flex flex-col space-y-0">
          <div className="bg-black flex flex-col">
            <div className="items-center flex flex-col px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-0">
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
                      'Neynar hub-api',
                      neynarHubAuthor,
                      neynarAuthorHubMissing
                    )}
                    {renderHeader(
                      'Neynar hub-api',
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
                      <>
                        {data?.hubData
                          .slice(2)
                          .map((hub: any, index: number) => {
                            const hubData = hub;
                            const hubAuthor = hubData?.author;
                            const hubCast = hubData?.cast;
                            const missingObjectsAuthor =
                              checkWarning(hubAuthor);
                            const missingObjectsCast: any[] = [];
                            return (
                              <div key={index}>
                                {renderHeader(
                                  `${capitalizeNickname(hub.name)}`,
                                  hubAuthor,
                                  missingObjectsAuthor
                                )}
                                {renderHeader(
                                  `${capitalizeNickname(hub.name)}`,
                                  hubCast,
                                  missingObjectsCast
                                )}
                              </div>
                            );
                          })}
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="hidden md:block mt-3">
                {hash && isFollowSyntax(hash) ? null : hash &&
                  !extractUsernameFromUrl(hash) ? (
                  <NeynarCastCard
                    renderEmbeds={true}
                    renderFrames={true}
                    onFrameBtnPress={emptyFrame}
                    type={isValidWarpcastUrl(identifier) ? 'url' : 'hash'}
                    identifier={identifier}
                    allowReactions={true}
                    containerStyles={{
                      color: 'white',
                      maxWidth: '100%',
                      minWidth: '400px',
                      maxHeight: '1000px',
                      overflowX: 'hidden',
                      overflowY: 'auto',
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
                ) : authorFid ? (
                  <NeynarProfileCard
                    fid={authorFid}
                    containerStyles={{
                      color: 'white',
                      maxWidth: '100%',
                      minWidth: '400px',
                      overflowX: 'hidden',
                      display: 'flex',
                      flexDirection: 'row',
                      border: 'none',
                      alignItems: 'center',
                      background: '#333333',
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
};

export default NetworkResponse;
