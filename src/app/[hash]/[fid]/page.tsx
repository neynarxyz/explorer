import { fetchCastAndFidData } from "@/lib/utils";



interface ResponseProps {
    params: { hash: string; fid: string};
}

export default async function Response({ params }: ResponseProps) {
const hash = params.hash;
const fid = Number(params.fid) || null;
const data = await fetchCastAndFidData(hash, fid)
if (!data) return null;
const APIResponse = data.apiData;
const {author, cast} = APIResponse || {} as any
// const hubResponses = data.hubData;
return (
    <div className="flex flex-col items-center justify-center space-y-4 p-2">
      <div className="w-full flex flex-col md:flex-row justify-center items-start p-2 space-x-0 md:space-x-8 space-y-4 md:space-y-0">
        {author && (
             <div>
            <h3>
            FID Response: {author?.error ? '❌' : '✅'} ({author?.durationInMs?.toFixed(2)} ms)
          </h3>
 <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
            {JSON.stringify(author, null, 2)}
          </pre>
          </div>
        )}
        {cast && (
          <div>
            <h3>
              Cast Response: {cast?.error ? '❌' : '✅'} ({cast?.durationInMs?.toFixed(2)} ms)
            </h3>
            <pre className="bg-gray-800 text-white p-2 rounded w-full md:w-auto font-mono text-sm max-w-lg max-h-72 overflow-y-scroll overflow-x-scroll">
              {JSON.stringify(cast, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
  

}