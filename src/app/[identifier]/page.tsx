'use client'
import Modal from "@/components/modal-component";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { fetchCastAndFidData } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ResponseProps {
  params: { identifier: string };
}

const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
}

const renderSkeletonHeader = () => (
  <Card className="rounded-lg relative border-black md:p-8 text-xl min-w-40 flex flex-col items-center justify-center">
    <div className="w-full flex flex-col items-center animate-pulse">
      <CardHeader className="text-center relative z-10 md:text-lg text-sm w-full">
        <div className="h-6 bg-gray-300 rounded w-24 mb-2"></div>
      </CardHeader>
      <hr className="w-full border-t border-gray-300 my-2" />
      <CardContent className="flex items-center justify-center text-6xl w-full">
        <div className="h-12 bg-gray-300 rounded-full w-12"></div>
      </CardContent>
    </div>
  </Card>
);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
  }).catch(err => {
  });
};

export default function Page({ params }: ResponseProps) {
  const identifier = decodeURIComponent(params.identifier);
  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  const hash = fid ? null : identifier;
  const [data, setData] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchCastAndFidData(hash, fid) as any;

    const checkWarning = (message: any) => {
      const expectedTypes = [
        "USER_DATA_TYPE_PFP",
        "USER_DATA_TYPE_DISPLAY",
        "USER_DATA_TYPE_BIO",
        "USER_DATA_TYPE_USERNAME"
      ];

      if (message?.messages) {
        const foundTypes = new Set();
        message.messages.forEach((msg: any) => {
          if (msg.data?.userDataBody?.type) {
            foundTypes.add(msg.data.userDataBody.type);
          }
        });

        const missingTypes = expectedTypes.filter(type => !foundTypes.has(type));
        return missingTypes;
      }

      const missingObjects = [];
      const authorFid = message?.fid;
      const expectedUsername = `!${authorFid}`;
      const username = message?.username;
      const pfp = message?.pfp?.url || message?.pfp_url;
      const displayName = message?.display_name || message?.displayName;
      const bio = message?.profile?.bio?.text;

      if (!pfp) missingObjects.push("PFP");
      if (!displayName) missingObjects.push("Display Name");
      if (!bio) missingObjects.push("Bio");
      if (!username || username === expectedUsername) missingObjects.push("Username");

      return missingObjects;
    }

    const warpcastAuthorMissing = checkWarning(data.apiData.warpcast?.author);
    const neynarAuthorMissing = checkWarning(data.apiData.neynar?.author?.author);
    const warpcastAuthorHubMissing = checkWarning(data.hubData?.[0]?.author);
    const neynarAuthorHubMissing = checkWarning(data.hubData?.[1]?.author);
    const warpcastCastMissing = checkWarning(data.apiData.warpcast?.cast?.author);
    const neynarCastMissing = checkWarning(data.apiData.neynar?.cast?.cast?.author);

    setData({
      ...data,
      warpcastAuthorMissing,
      neynarAuthorMissing,
      warpcastAuthorHubMissing,
      neynarAuthorHubMissing,
      warpcastCastMissing,
      neynarCastMissing,
      warpcastCastHubMissing: [],
      neynarCastHubMissing: []
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [hash, fid]);

  const openModal = (title: string, response: any, missingObjects: string[]) => {
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
    warpcastAuthorMissing, neynarAuthorMissing,
    warpcastAuthorHubMissing, neynarAuthorHubMissing,
    warpcastCastMissing, neynarCastMissing,
    warpcastCastHubMissing, neynarCastHubMissing
  } = data ?? {};

  const hubs = data?.hubData ?? [];
  const nemes = hubs[0] ?? {};
  const neynarHub = hubs[1] ?? {};
  const { author: nemesAuthor, cast: nemesCast } = nemes || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};

  const renderHeader = (label: string, data: any, missingObjects: string[]) => {
    let icon = '✅';

    if (data?.error) {
      icon = '❌';
    } else if (missingObjects.length > 0) {
      icon = '⚠️';
    }

    return (
      <button onClick={() => openModal(label, data, missingObjects)}>
        <Card className="hover:bg-slate-100 rounded-lg relative border-black md:p-8 md:text-xl max-h-32 md:max-h-64 min-w-36 md:min-w-40 flex flex-col items-center justify-center">
          <CardHeader className="text-center relative z-10 md:text-lg text-sm w-full">
            {label}
          </CardHeader>
          <hr className="w-full border-t border-black my-2" />
          <CardContent className="flex items-center justify-center md:text-6xl w-full text-4xl">
            {icon}
          </CardContent>
        </Card>
      </button>
    );
  };

  const handleCopyClick = () => {
    copyToClipboard(fid ? fid.toString() as any : hash);
    setButtonClicked(true);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} toggleModal={closeModal} response={modalData} title={modalTitle} />
      <div className="flex flex-col w-full h-full items-center">

{ fid || hash ? (
          <button
            className="mb-10 px-4 py-2 bg-purple-500 text-white hover:bg-purple-700 rounded-lg"
            onClick={handleCopyClick}
          >
            {buttonClicked ? '✔️' : `Copy ${fid ? 'user FID' : 'cast hash'}`}
          </button>
        ) : null
}
        
        <div className="w-full flex md:flex-row flex-col justify-center items-center md:space-x-0 ">
          {loading ? (
            <>
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
            </>
          ) : (
            <>
              {warpcastAuthor && renderHeader('Warpcast API', warpcastAuthor, warpcastAuthorMissing)}
              {warpcastCast && renderHeader('Warpcast API', warpcastCast, warpcastCastMissing)}
              {nemesAuthor && renderHeader('Warpcast Hub', nemesAuthor, warpcastAuthorHubMissing)}
              {nemesCast && renderHeader('Warpcast Hub', nemesCast, warpcastCastHubMissing)}
              {neynarHubAuthor && renderHeader('Neynar Hub', neynarHubAuthor, neynarAuthorHubMissing)}
              {neynarHubCast && renderHeader('Neynar Hub', neynarHubCast, neynarCastHubMissing)}
              {neynarAuthor && renderHeader('Neynar API', neynarAuthor, neynarAuthorMissing)}
              {neynarCast && renderHeader('Neynar API', neynarCast, neynarCastMissing)}
            </>
          )}
        </div>
      </div>
    </>
  );
}

