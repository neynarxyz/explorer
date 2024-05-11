'use client'
import { Input} from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import useFetchHubData from "@/hooks/fetchHubData";
import { useEffect, useState } from "react";
import { defaultHash } from "@/constants";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";

export default function Home() {
  const [fid, setFid] = useState<number | null>(null);
  const [hash, setHash] = useState<string>("");
  const { fetchData, hubResponses, apiResponse,castPreview } = useFetchHubData();

  const fetchCast = async () => {
    await fetchData(hash, fid);
  };

  useEffect(() => {
fetchData(defaultHash, fid);
  }, []);

  const displayResponseStatus = (response: any) => {
    const status = response?.error ? '❌' : '✅';
    const duration = response?.durationInMs ? ` (${response.durationInMs.toFixed(2)} ms)` : '';
    return `${status}${duration}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <Input
        className="w-64 h-10"
        placeholder={defaultHash}
        value={hash}
        onChange={(e: any) => {
          setHash(e.target.value)}}
      />
      <Input
        className="w-64 h-10"
        placeholder="FID (optional unless API fails)"
        type="number"
        value={fid ?? ''}
        onChange={(e: any) => setFid(Number(e.target.value) || null)}
      />
      <Button onClick={fetchCast}>Submit</Button>
      <div className="flex flex-col items-center justify-center space-y-4 p-2 w-full">
     {castPreview ? <><p>Result for {castPreview.hash}</p><FarcasterEmbed username={castPreview.author.username} hash={castPreview.hash.slice(0, 10)} /></> : null}
        </div>


      <div>
        <div>Neynar API: {displayResponseStatus(apiResponse)}</div>
        <div>
          {hubResponses?.map((hub, index) => (
            <div key={index}>
              {hub.hub === "neynar" ? "Neynar Hub": hub.hub}: {displayResponseStatus(hub)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

