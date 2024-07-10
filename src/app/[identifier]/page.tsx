'use client';
import Modal from '@/components/modal-component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { hubs } from '@/constants';
import { useClipboard } from '@/hooks/useClipboard';
import { fetchCastAndFidData, isValidWarpcastUrl } from '@/lib/utils';
import {
  NeynarProfileCard,
  useNeynarContext,
  NeynarCastCard,
} from '@neynar/react';
import { capitalizeNickname } from '@/lib/helpers';
import { CopyCheckIcon, CopyIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';
import * as amplitude from '@amplitude/analytics-browser';
import { useEffect, useState } from 'react';

interface ResponseProps {
  params: { identifier: string };
}

const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
};

const renderSkeletonHeader = () => (
  <Card className="rounded-lg relative border-black flex flex-col items-center justify-center">
    <div className="w-full flex flex-col items-center animate-pulse">
      <CardHeader className="text-center relative md:text-lg text-sm w-full">
        <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
      </CardHeader>
      <hr className="w-full border-t border-gray-300 my-2" />
      <CardContent className="flex items-center justify-center text-6xl w-full">
        <div className="h-12 bg-gray-300 rounded-full w-12"></div>
      </CardContent>
    </div>
  </Card>
);

export default function Page({ params }: ResponseProps) {
  const identifier = decodeURIComponent(params.identifier);
  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  const hash = fid ? null : identifier;

  const { copied, copy } = useClipboard();
  const [data, setData] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtherHubs, setShowOtherHubs] = useState(false);

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
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
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

  const renderHeader = (
    label: string,
    data: any | null,
    missingObjects: string[]
  ) => {
    if (!data) {
      return null;
    }

    let icon = '✅';
    console.log(data);
    if (data?.is_server_dead) {
      icon = '❓';
    } else if (data?.error) {
      icon = '❌';
    } else if (missingObjects.length > 0) {
      icon = '⚠️';
    }

    return (
      <button onClick={() => openModal(label, data, missingObjects)}>
        <Card className="min-w-36 hover:bg-slate-100 rounded-lg relative border-black flex flex-col items-center justify-center">
          <CardHeader className="text-center relative w-full">
            {label}
          </CardHeader>
          <hr className="w-full border-t border-black my-2" />
          <CardContent className="flex items-center justify-center w-full text-4xl">
            {icon}
          </CardContent>
        </Card>
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
      <div className="flex flex-col items-center space-y-5">
        <div className="gap-5 flex">
          {fid || hash ? (
            <Button
              className="mb-10 min-h-10 px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
              onClick={() => {
                amplitude.track('Click on identifier', {
                  identifier,
                });
                copy(fid ? fid.toString() : hash || '');
              }}
            >
              {copied ? (
                <>
                  <CopyCheckIcon className="w-4 h-4 mr-2" /> Copied
                </>
              ) : (
                <>
                  <CopyIcon className="w-4 h-4 mr-2" /> Copy{' '}
                  {fid ? 'User FID' : 'Cast Hash'}
                </>
              )}
            </Button>
          ) : null}

          {authorFidCast ? (
            <Button
              asChild
              className="mb-10 min-h-10 px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
            >
              <Link href={`/${authorFidCast}`}>
                <UserIcon className="w-4 h-4 mr-1" /> View Author Profile
              </Link>
            </Button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
            </>
          ) : (
            <>
              {renderHeader(
                'Warpcast API',
                warpcastAuthor,
                warpcastAuthorMissing
              )}
              {renderHeader('Warpcast API', warpcastCast, warpcastCastMissing)}
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
              {renderHeader('Neynar Hub', neynarHubCast, neynarCastHubMissing)}
              {renderHeader('Neynar API', neynarAuthor, neynarAuthorMissing)}
              {renderHeader('Neynar API', neynarCast, neynarCastMissing)}
            </>
          )}
        </div>
        <div className="hidden md:block">
          {hash &&
          (!isValidWarpcastUrl(hash) || hash.split('/').length >= 5) ? (
            <NeynarCastCard
              type={isValidWarpcastUrl(identifier) ? 'url' : 'hash'}
              identifier={identifier}
            />
          ) : authorFid ? (
            <NeynarProfileCard fid={authorFid} />
          ) : null}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 mt-10">
          {!showOtherHubs ? (
            <Button
              className="min-h-10 px-4 py-2 bg-purple-400 text-white hover:bg-purple-800 rounded-lg"
              onClick={() => {
                amplitude.track('See more hubs', {
                  identifier,
                });
                setShowOtherHubs(true);
              }}
            >
              Check other hubs
            </Button>
          ) : (
            <Button
              className="min-h-10 px-4 py-2 bg-purple-400 text-white hover:bg-purple-800 rounded-lg"
              onClick={() => {
                amplitude.track('Hide other hubs', {
                  identifier,
                });
                setShowOtherHubs(false);
              }}
            >
              Hide other hubs
            </Button>
          )}
          {loading ? null : castHash || username ? (
            <>
              <Button
                asChild
                className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
              >
                <Link
                  href={
                    authorFidCast
                      ? `https://warpcast.com/${username}/${castHash.slice(0, 10)}`
                      : `https://warpcast.com/${username}`
                  }
                >
                  View on Warpcast
                </Link>
              </Button>
              <Button
                asChild
                className="px-4 py-2 bg-black text-white hover:bg-gray-700 rounded-lg"
              >
                <Link
                  href={
                    authorFidCast
                      ? `https://www.supercast.xyz/c/${castHash}`
                      : `https://www.supercast.xyz/${username}`
                  }
                >
                  View on Supercast
                </Link>
              </Button>
            </>
          ) : null}
        </div>

        {showOtherHubs && (
          <div className="flex md:flex-row flex-col items-center my-5">
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
      </div>
    </>
  );
}
