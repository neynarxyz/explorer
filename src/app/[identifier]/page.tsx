import { fetchCastAndFidData } from "@/lib/utils";

interface ResponseProps {
  params: { identifier: string };
}

const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
}

export default async function Page({ params }: ResponseProps) {
  const identifier = decodeURIComponent(params.identifier);

  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  const hash = fid ? null : identifier;
  const data = await fetchCastAndFidData(hash, fid) as any;

  if (!data) return null;

  const { warpcast, neynar } = data.apiData;
  const hubs = data.hubData ?? [];
  const nemes = hubs[0] ?? {};
  const neynarHub = hubs[1] ?? {};
  const { author: nemesAuthor, cast: nemesCast } = nemes || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};



  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">     
      <div className="w-full flex flex-col md:flex-row justify-center items-start p-2 space-x-0 md:space-x-8 space-y-4 md:space-y-0">
        {warpcastAuthor && (
          <div>
            <h3>
              Warpcast API FID Response: {warpcastAuthor?.error ? '❌' : '✅'} ({warpcastAuthor?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(warpcastAuthor, null, 2)}
            </pre>
          </div>
        )}
        {warpcastCast && (
          <div>
            <h3>
              Warpcast API Cast Response: {warpcastCast?.error ? '❌' : '✅'} ({warpcastCast?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(warpcastCast, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-start p-2 space-x-0 md:space-x-8 space-y-4 md:space-y-0">
        {nemesAuthor && (
          <div>
            <h3>
              Warpcast Hub FID Response: {nemesAuthor?.error ? '❌' : '✅'} ({nemesAuthor?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(nemesAuthor, null, 2)}
            </pre>
          </div>
        )}
        {nemesCast && (
          <div>
            <h3>
              Warpcast Hub Cast Response: {nemesCast?.error ? '❌' : '✅'} ({nemesCast?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(nemesCast, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-start p-2 space-x-0 md:space-x-8 space-y-4 md:space-y-0">
        {neynarHubAuthor && (
          <div>
            <h3>
              Neynar Hub FID Response: {neynarHubAuthor?.error ? '❌' : '✅'} ({neynarHubAuthor?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(neynarHubAuthor, null, 2)}
            </pre>
          </div>
        )}
        {neynarHubCast && (
          <div>
            <h3>
              Neynar Hub Cast Response: {neynarHubCast?.error ? '❌' : '✅'} ({neynarHubCast?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(neynarHubCast, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col md:flex-row justify-center items-start p-2 space-x-0 md:space-x-8 space-y-4 md:space-y-0">
        {neynarAuthor && (
          <div>
            <h3>
              Neynar API FID Response: {neynarAuthor?.error ? '❌' : '✅'} ({neynarAuthor?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(neynarAuthor, null, 2)}
            </pre>
          </div>
        )}
        {neynarCast && (
          <div>
            <h3>
              Neynar API Cast Response: {neynarCast?.error ? '❌' : '✅'} ({neynarCast?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(neynarCast, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
