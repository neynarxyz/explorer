'use client';
import Modal from '@/components/modal-component';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useClipboard } from '@/hooks/useClipboard';
import { capitalizeNickname } from '@/lib/helpers';
import { fetchCastAndFidData } from '@/lib/utils';
import { CopyCheckIcon, CopyIcon, UserIcon } from 'lucide-react';
import Link from 'next/link';

import { useEffect, useState } from 'react';

interface ResponseProps {
  params: { identifier: string };
}

const hubs = [
  { shortname: 'hoyt', url: 'https://hoyt.farcaster.xyz:2281' },
  { shortname: 'Neynar hub', url: 'https://hub-api.neynar.com' },
  { shortname: 'lamia', url: 'https://lamia.farcaster.xyz:2281' },
];

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

  const fetchData = async () => {
    setLoading(true);
    const data = (await fetchCastAndFidData(hash, fid)) as any;

    const checkWarning = (message: any) => {
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

  const authorFid = warpcastCast?.author?.fid || neynarCast?.cast?.author?.fid;

  const renderHeader = (
    label: string,
    data: any | null,
    missingObjects: string[]
  ) => {
    if (!data) {
      return null;
    }

    let icon = '✅';

    if (data?.error) {
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
      <div className="flex flex-col items-center">
        <div className="gap-5 flex">
          {fid || hash ? (
            <Button
              className="mb-10 min-h-10 px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
              onClick={() => copy(fid ? fid.toString() : hash || '')}
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

          {authorFid ? (
            <Button
              asChild
              className="mb-10 min-h-10 px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
            >
              <Link href={`/${authorFid}`}>
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

        {!showOtherHubs && (
          <Button
            className="mt-10 min-h-10 px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded-lg"
            onClick={() => setShowOtherHubs(true)}
          >
            Check other hubs
          </Button>
        )}

        {showOtherHubs && (
          <div className="flex md:flex-row flex-col items-center my-5">
            {hubs.slice(2).map((hub, index) => (
              <div key={index}>
                {renderHeader(
                  `${capitalizeNickname(hub.shortname)}`,
                  data?.hubData?.[index + 2],
                  []
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
