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

export default function Page({ params }: ResponseProps) {
  const identifier = decodeURIComponent(params.identifier);
  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  const hash = fid ? null : identifier;
  const [data, setData] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const data = await fetchCastAndFidData(hash, fid) as any;
    
  
    const checkWarning = (message: any) => {
      //check if author has messages, if so its a hub
  // Define expected USER_DATA_TYPE values
  const expectedTypes = [
    "USER_DATA_TYPE_PFP",
    "USER_DATA_TYPE_DISPLAY",
    "USER_DATA_TYPE_BIO",
    "USER_DATA_TYPE_USERNAME"
  ];

  // Check if message has messages, indicating it's from a hub
  if (message?.messages) {
    const foundTypes = new Set();
    message.messages.forEach((msg: any) => {
      if (msg.data?.userDataBody?.type) {
        foundTypes.add(msg.data.userDataBody.type);
      }
    });

    const missingTypes = expectedTypes.filter(type => !foundTypes.has(type));
    return missingTypes.length > 0;
  }
  const authorFid = message?.fid;
  const expectedUsername = `!${authorFid}`
  const username = message?.username;
  const pfp = message?.pfp?.url || message?.pfp_url
  const displayName = message?.display_name || message?.displayName
  const bio = message?.profile.bio?.text
// Check if any of pfp, displayName, or bio or username are not present
return(!pfp || !displayName || !bio ||(!username || username === expectedUsername))
  }
    const showWarpcastAuthorWarning = checkWarning(data.apiData.warpcast?.author);
    const showNeynarAuthorWarning = checkWarning(data.apiData.neynar?.author?.author);
    const showWarpcastAuthorHubWarning = checkWarning(data.hubData?.[0]?.author);
    const showNeynarAuthorHubWarning = checkWarning(data.hubData?.[1]?.author);
    const showWarpcastCastWarning = checkWarning(data.apiData.warpcast?.cast?.author);
    const showNeynarCastWarning = checkWarning(data.apiData.neynar?.cast?.cast.author);
    // const showWarpcastCastHubWarning = checkWarning(data.hubData?.[0]?.cast);
    // const showNeynarCastHubWarning = checkWarning(data.hubData?.[1]?.cast);
    setData({ ...data, showWarpcastAuthorWarning, showNeynarAuthorWarning, showWarpcastAuthorHubWarning, showNeynarAuthorHubWarning, showWarpcastCastWarning, showNeynarCastWarning, showWarpcastCastHubWarning: false, showNeynarCastHubWarning: false});
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData();
  }, [hash, fid]);
  
  const openModal = (title: string, response: any) => {
    setModalTitle(title);
    setModalData(response);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };
  
  const { warpcast, neynar } = data?.apiData ?? {};
  const {  showWarpcastAuthorWarning, showNeynarAuthorWarning, showWarpcastAuthorHubWarning, showNeynarAuthorHubWarning, showWarpcastCastWarning, showNeynarCastWarning, showWarpcastCastHubWarning, showNeynarCastHubWarning} = data ?? {};
  const hubs = data?.hubData ?? [];
  const nemes = hubs[0] ?? {};
  const neynarHub = hubs[1] ?? {};
  const { author: nemesAuthor, cast: nemesCast } = nemes || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};
  
  const renderHeader = (label: string, data: any, showWarning: boolean) => {
    let icon = '✅';
    if (data?.error) {
      icon = '❌';
    } else if (showWarning) {
      icon = '⚠️';
    }

    return (
      <button onClick={() => openModal(label, data)}>
        <Card className="hover:bg-slate-100 rounded-lg relative border-black md:p-8 text-xl min-w-40 flex flex-col items-center justify-center">
          <CardHeader className="text-center relative z-10 md:text-lg text-sm w-full">
            {label}
          </CardHeader>
          <hr className="w-full border-t border-black my-2" />
          <CardContent className="flex items-center justify-center text-6xl w-full">
            {icon}
          </CardContent>
        </Card>
      </button>
    );
  };
  
  return (
    <>
      <Modal isOpen={isModalOpen} toggleModal={closeModal} response={modalData} title={modalTitle} />
      <div className="flex flex-col w-full items-center justify-center">
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
              {warpcastAuthor && renderHeader('Warpcast API', warpcastAuthor, showWarpcastAuthorWarning)}
              {warpcastCast && renderHeader('Warpcast API', warpcastCast, showWarpcastCastWarning)}
              {nemesAuthor && renderHeader('Warpcast Hub', nemesAuthor, showWarpcastAuthorHubWarning)}
              {nemesCast && renderHeader('Warpcast Hub', nemesCast, showWarpcastCastHubWarning)}
              {neynarHubAuthor && renderHeader('Neynar Hub', neynarHubAuthor, showNeynarAuthorHubWarning)}
              {neynarHubCast && renderHeader('Neynar Hub', neynarHubCast, showNeynarCastHubWarning)}
              {neynarAuthor && renderHeader('Neynar API', neynarAuthor, showNeynarAuthorWarning)}
              {neynarCast && renderHeader('Neynar API', neynarCast, showNeynarCastWarning)}
            </>
          )}
        </div>
      </div>
    </>
  );
}
