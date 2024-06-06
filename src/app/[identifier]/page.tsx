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
    setData(data);
    setLoading(false);
  }

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
  const hubs = data?.hubData ?? [];
  const nemes = hubs[0] ?? {};
  const neynarHub = hubs[1] ?? {};
  const { author: nemesAuthor, cast: nemesCast } = nemes || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};

  const renderHeader = (label: string, data: any) => (
    <button onClick={() => openModal(label, data)}>
    <Card className="hover:bg-slate-100 rounded-lg relative border-black md:p-8 text-xl min-w-40 flex flex-col items-center justify-center">

        <CardHeader className="text-center relative z-10 md:text-lg text-sm w-full">
          {label}
        </CardHeader>
        <hr className="w-full border-t border-black my-2" />
        <CardContent className="flex items-center justify-center text-6xl w-full mt-1.5">
          {data?.error ? '❌' : '✅'}
        </CardContent>
    </Card>
    </button>
  );

  return (
    <>
      <Modal isOpen={isModalOpen} toggleModal={closeModal} response={modalData} title={modalTitle} />
      <div className="flex flex-col w-full items-center justify-center mt-[25%] md:mt-[12.5%] lg:mt-[15%]">
        <div className="w-full flex md:flex-row gap-4 flex-col justify-center items-center md:space-x-0 ">
          {loading ? (
            <>
              {/* {renderSkeletonHeader()} */}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
              {renderSkeletonHeader()}
            </>
          ) : (
            <>
              {/* {warpcastAuthor && renderHeader('Warpcast API', warpcastAuthor)}
              {warpcastCast && renderHeader('Warpcast API', warpcastCast)} */}
              {nemesAuthor && renderHeader('Warpcast Hub', nemesAuthor)}
              {nemesCast && renderHeader('Warpcast Hub', nemesCast)}
              {neynarHubAuthor && renderHeader('Neynar Hub', neynarHubAuthor)}
              {neynarHubCast && renderHeader('Neynar Hub', neynarHubCast)}
              {neynarAuthor && renderHeader('Neynar API', neynarAuthor)}
              {neynarCast && renderHeader('Neynar API', neynarCast)}
            </>
          )}
        </div>
      </div>
    </>
  );
}
