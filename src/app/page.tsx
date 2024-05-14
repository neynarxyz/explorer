'use client'
// Importing necessary components and hooks
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useFetchHubData from "@/hooks/fetchHubData";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import { CodeBlock, dracula } from 'react-code-blocks';
import { defaultFID, defaultHash } from "@/constants";

// Main component definition
export default function Home() {
  // State hooks for managing data and UI
  const [fid, setFid] = useState<number | null>(null);
  const [hash, setHash] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState('api'); // Default to 'api', could be 'hub-0', 'hub-1', etc.
  const [fidResponse, setFidResponse] = useState<any | null>(null);
  const [castResponse, setCastResponse] = useState<any | null>(null);

  const {
    isLoading,
    fetchData,
    data,
    castPreview
  } = useFetchHubData();

  useEffect(() => {
    fetchData(defaultHash, defaultFID);
  }, []);

  useEffect(() => {
    if (selectedSource === 'api') {
      setFidResponse(data.apiData?.author);
      setCastResponse(data.apiData?.cast);
    } else if (selectedSource.startsWith('hub')) {
      const hubIndex = parseInt(selectedSource.split('-')[1], 10);
      setFidResponse(data.hubData[hubIndex]?.author);
      setCastResponse(data.hubData[hubIndex]?.cast);
    }
  }, [data, selectedSource]);

  const displayResponseStatus = (response: any) => {
   
    return `${response.name}`
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <Input
        className="w-64 h-10"
        placeholder={`Enter hash... (${defaultHash.slice(0,5)}...)`}
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <Input
        className="w-64 h-10"
        placeholder="Enter FID (optional unless API fails)"
        type="number"
        value={fid ?? ''}
        onChange={(e) => setFid(Number(e.target.value) || null)}
      />
      <Button onClick={async () => await fetchData(hash, fid)} disabled={isLoading}>Fetch Data</Button>
      {data && data.apiData && !isLoading ?
      <select
  className="w-64 h-10"
  value={selectedSource}
  onChange={(e) => setSelectedSource(e.target.value)}
>
<option key={'api'} value={`api`}>{displayResponseStatus(data.apiData)}</option>
  {data.hubData.map((hub: any, index: number) => (
    <option key={index} value={`hub-${index}`}>{displayResponseStatus(data.hubData[index])}</option>
  ))}
</select>
: null
}
{castPreview && (
        <div className='max-w-md'>
          <p>Result for {castPreview.hash}</p>
          <FarcasterEmbed username={castPreview.author.username} hash={castPreview.hash.slice(0, 10)} />
        </div>
      )}
<div className="flex flex-row justify-center items-start space-x-4 w-full">
      {fidResponse &&
        <div className="flex-1">
          <h3>FID Response: {fidResponse?.error ? '❌' : '✅'} ({fidResponse?.durationInMs?.toFixed(2)} ms)</h3>
          <CodeBlock
            text={JSON.stringify(fidResponse, null, 2)}
            theme={dracula}
            customStyle={{
              height: '300px',
              overflowY: 'scroll',
              margin: '0px 0.75rem',
              borderRadius: '5px',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.35)',
              fontSize: '0.75rem',
              maxWidth: '550px',
              minWidth: '300px',
            }}
          />
        </div>
      }
      {castResponse &&
        <div className="flex-1">
          <h3>Cast Response: {castResponse?.error ? '❌' : '✅'} ({castResponse?.durationInMs?.toFixed(2)} ms)</h3>
          <CodeBlock
            text={JSON.stringify(castResponse, null, 2)}
            theme={dracula}
            customStyle={{
              height: '300px',
              overflowY: 'scroll',
              margin: '0px 0.75rem',
              borderRadius: '5px',
              boxShadow: '1px 2px 3px rgba(0,0,0,0.35)',
              fontSize: '0.75rem',
              maxWidth: '550px',
              minWidth: '300px',
            }}
          />
        </div>
      }
      </div>
    </div>
  );
}
