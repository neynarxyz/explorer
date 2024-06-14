import axios from 'axios';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { hubs, tokenBearer } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HubType {
  shortname: string;
  url: string;
}

const fetchHubData = async (fid: number | null, hash: string | null, isCast = true) => {
  const promises = hubs.map(async hub => {
    const authorData = await fetchFidFromHub(fid, hub,isCast);
    const castData = await fetchCastFromHub(hash, fid, hub, isCast);
    return { name: hub.shortname, author: authorData, cast: castData };
  });

  return Promise.all(promises);
};

interface ApiResponse {
  warpcast: {
    author: any;
    cast: any;
    name: string;
  };
  neynar: {
    author: any;
    cast: any;
    name: string;
  };
  error?: any;
}

const fetchApiData = async (fid: number | null, identifier: string | null): Promise<ApiResponse> => {
  let neynarAuthor: any = null;
  let neynarCast: any = null;
  let warpcastAuthor: any = null;
  let warpcastCast: any = null;
  let authorFid = fid;
  const isWarpcastURL = isValidWarpcastUrl(identifier);
  let hash = identifier
  let warpcastCastResponseStart = null;
  
  try {
    if (identifier && (!isWarpcastURL || identifier.split("/").length >= 5)) {
      try {
       neynarCast = await fetchCastFromNeynarAPI(identifier, isWarpcastURL);
       if (neynarCast && neynarCast.cast.hash) {
        authorFid = authorFid || neynarCast?.author?.fid || null;
        hash = neynarCast?.cast?.hash || hash;
       }
      } catch (error) {
        neynarCast = formatError(error);
      }

      try {
        warpcastCastResponseStart = performance.now();
        
        warpcastCast = await fetchWarpcastCast(hash, isWarpcastURL, identifier);
        if (warpcastCast && warpcastCast.hash) {
          authorFid = authorFid || warpcastCast?.author?.fid || null;
          hash = warpcastCast?.hash || hash;
        }
      } catch (error) {
        warpcastCast = formatError(error);
      }
    }

    if (fid || (isWarpcastURL && identifier && identifier.split("/").length === 4)) {
      try {
        neynarAuthor = await fetchAuthorFromNeynarAPI(authorFid?.toString() ?? identifier as any);
      } catch (error) {
        neynarAuthor = formatError(error);
      }

      const warpcastAuthorApiStart = performance.now();
      try {

        warpcastAuthor = await fetchWarpcastAuthor(authorFid?.toString() ?? identifier as any);
      } catch (error) {
        warpcastAuthor = formatError(error);
      }

      return formatResponse(warpcastAuthor, warpcastCast, neynarAuthor, neynarCast, warpcastAuthorApiStart, warpcastCastResponseStart ?? 0);
    }

    return formatEmptyResponse(warpcastCast, neynarCast);

  } catch (error) {
    console.error("Error in fetchApiData", error);
    return formatErrorResponse(error, warpcastCast, neynarCast);
  }
};

const fetchWarpcastCast = async (hash: string | null, isWarpcastURL: boolean, identifier: string | null) => {
  
  let cast = null;
  try {

  
  if (!isWarpcastURL) {
    const response = await axios.get(`https://api.warpcast.com/v2/thread-casts?castHash=${hash}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    cast = response.data?.result?.casts.find((cast: any) => cast.hash.startsWith(hash)) || null as any;
  } else if (identifier && identifier.split("/").length > 3) {
    const username = identifier.split("/")[3];
    const hashPrefix = identifier.split("/")[4];
    const response = await axios.get(`https://api.warpcast.com/v2/user-thread-casts?castHashPrefix=${hashPrefix}&username=${username}&limit=15`, {
      headers: { 'Content-Type': 'application/json' }
    });
    cast = response.data?.result?.casts.find((cast: any) => cast.hash.startsWith(hashPrefix)) || null as any;
  }
  return { ...cast, error: null };
}
catch(error) {
  return {error}
}
};

const fetchWarpcastAuthor = async (identifier: string | null) => {
  //its a fid
try {


  const isWarpcastURL = isValidWarpcastUrl(identifier);

  if (!isWarpcastURL) {
    const response = await axios.get(`https://api.warpcast.com/v2/user?fid=${identifier}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data?.result?.user || null
  } else if (identifier && identifier.split("/").length >= 3){
    const username = identifier?.split("/")[3];
    const response = await axios.get(`https://api.warpcast.com/v2/user-by-username?username=${username}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data?.result?.user || null
  }
  return null;
}
catch(error) {
  return {error}
}
};

const formatResponse = (warpcastAuthor: any, warpcastCast: any, neynarAuthor: any, neynarCast: any, warpcastAuthorApiStart: number, warpcastCastResponseStart: number) => ({
  warpcast: {
    author: { ...warpcastAuthor },
    cast: warpcastCast && Object.keys(warpcastCast).length > 0 ? { ...warpcastCast } : null,
    name: "Warpcast API"
  },
  neynar: {
    author: neynarAuthor,
    cast: neynarCast && Object.keys(neynarCast).length > 0 ? neynarCast : null,
    name: "Neynar API"
  },
});

const formatEmptyResponse = (warpcastCast: any, neynarCast: any) => ({
  warpcast: {
    cast: warpcastCast,
    name: "Warpcast API",
    author: null
  },
  neynar: {
    cast: neynarCast,
    name: "Neynar API",
    author: null
  },
});

const formatErrorResponse = (error: any, warpcastCast: any = null, neynarCast: any = null) => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    stack: error.stack,
    response: error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    } : null
  };

  return {
    warpcast: {
      cast: warpcastCast,
      name: "Warpcast API",
      author: null
    },
    neynar: {
      cast: neynarCast,
      name: "Neynar API",
      author: null
    },
    error: errorInfo
  };
};

const formatError = (error: any) => ({
  error: {
    message: error.message,
    name: error.name,
    stack: error.stack,
    response: error.response ? {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
    } : null
  }
});

export async function fetchCastAndFidData(hash: string | null, fid: number | null) {
  if (!hash && !fid) return { apiData: null, hubData: null };
  const apiData = await fetchApiData(fid, hash);
  if (apiData.error || (!apiData.neynar && !apiData.warpcast)) return { apiData, hubData: null };
  const processedFid = apiData.neynar?.cast?.cast?.author?.fid ?? apiData.warpcast?.cast?.author?.fid ?? apiData.warpcast?.author?.fid ?? apiData.neynar?.author?.fid ?? fid;
  let processedHash = apiData.neynar?.cast?.cast?.hash ?? apiData.warpcast?.cast?.hash ?? hash;

if(isValidWarpcastUrl(processedHash)) {
  processedHash = null
}
  if (!processedFid && !processedHash) return { apiData, hubData: null };
  const hubData = await fetchHubData(processedFid, processedHash,apiData.neynar?.cast || apiData.warpcast?.cast);
  return { apiData, hubData };
}

export async function fetchCastFromHub(hash: string | null, fid: number | null, hub: HubType, isCast = true) {
  if (!fid || !hash || !isCast) return null;
  const start = performance.now();
  try {
    let headers: { "Content-Type": string, api_key?: string, "x-airstack-hubs"?: string } = { "Content-Type": "application/json" };
    if (hub.shortname === "Neynar hub") {
      headers.api_key = `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;
    }
    const response = await axios.get(`${hub.url}/v1/castById?fid=${fid}&hash=${hash}`, { headers });
    return { data: response.data , error: null };
  } catch (e) {
    
    return { error: formatError(e), data: null };
  }
}

export async function fetchCastFromNeynarAPI(identifier: string, isURL: boolean = false) {
  const start = performance.now();
  try {
    const cast = await axios.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${identifier}&type=${isURL ? 'url' : 'hash'}`, {
      headers: {
        "Content-Type": "application-json",
        "api_key": `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`
      }
    });
    
    return { cast: cast.data.cast,  error: null };
  } catch (e) {
    
    return {  error: formatError(e), cast: null };
  }
}

export async function fetchFidFromHub(fid: number | null, hub: HubType,isCast = true) {
  if (!fid || isCast) return null
  const start = performance.now();
  try {
    let headers: { "Content-Type": string, api_key?: string, "x-airstack-hubs"?: string } = { "Content-Type": "application/json" };
    if (hub.shortname === "Neynar hub") {
      headers.api_key = `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;
    }
    const response = await axios.get(`${hub.url}/v1/userDataByFid?fid=${fid}`, { headers });
    
    const verificationsResponse = await axios.get(`${hub.url}/v1/verificationsByFid?fid=2?fid=${fid}`, { headers });
    
    return {...response.data,verifications: verificationsResponse.data, error: null };
  } catch (e) {
    
    return { error: formatError(e), data: null };
  }
}

async function isEmbedImageValid(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function isEmbedVideoValid(url: string): boolean {
  return /\.(mp4|webm|ogg)$/.test(url);
}

export async function getEmbedType(url: string) {
  const isImage = await isEmbedImageValid(url);
  if (isImage) return { type: "image", url };

  const isVideo = isEmbedVideoValid(url);
  if (isVideo) return { type: "video", url };

  return null;
}

export async function fetchAuthorFromNeynarAPI(identifier: string) {
  try {
    const isURL = isValidWarpcastUrl(identifier);
    const start = performance.now();
    if (!isURL) {
      const authorData = await axios.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${identifier}`, {
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`
        }
      });
      const author = authorData.data.users[0];

      return { author,  error: null };
    } else {
      const username = identifier.split("/")[3];
      const authorData = await axios.get(`https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`, {
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`
        }
      });
      return { author: authorData.data.result.user,  error: null };
    }
  } catch (e) {
    return { error: formatError(e), author: null };
  }
}

export const isValidWarpcastUrl = (url: string | null) => {
  if (!url) return false;
  return url.includes('https://warpcast.com');
};
