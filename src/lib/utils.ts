import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { hubs, tokenBearer } from "@/constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface HubType {
  shortname: string;
  url: string;
}

const fetchHubData = async (fid: number | null, hash: string | null) => {
  const promises = hubs.map(async hub => {
      const authorData = await fetchFidFromHub(fid, hub);
      const castData = await fetchCastFromHub(hash, fid, hub);
      return { name: hub.shortname, author: authorData, cast: castData };
  });

  return Promise.all(promises);
}


const fetchApiData = async (fid: number | null, identifier: string | null) => {
  let neynarAuthor = {}, neynarCast = {} as any;
  let warpcastAuthor = {}, warpcastCast = {} as any;
  let authorFid = fid;
  let hash = identifier;

  try {
    const protocol = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "development" ? "https://" : "http://";
    const url = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
    const baseURL = `${protocol}${url}`;
    let warpcastCastResponseTime = 0

    if (identifier) {
      const neynarCastApiResponse = await axios.get(`${baseURL}/api/get_api_cast/${encodeURIComponent(identifier)}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
      });
      neynarCast = neynarCastApiResponse.data;
      if (!authorFid && neynarCast && neynarCast.author && neynarCast.author.fid) {
        authorFid = neynarCast.author.fid; // Extract the fid from the cast data
      }
      if (isValidWarpcastUrl(identifier)) {
        hash = neynarCast.cast.hash;
      }
      const warpcastCastResponseStart = performance.now();
      // Fetch data from the Warpcast API
      try {
      const warpcastCastApiResponse = await axios.get(`https://api.warpcast.com/v2/cast?hash=${hash}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      warpcastCastResponseTime = performance.now() - warpcastCastResponseStart;
      if (warpcastCastApiResponse.data && warpcastCastApiResponse.data.result && warpcastCastApiResponse.data.result.cast) {
        warpcastCast = warpcastCastApiResponse.data.result.cast;
        if (!authorFid && warpcastCast.author && warpcastCast.author.fid) {
          authorFid = warpcastCast.author.fid;
        }
      }
    }
    catch (e) {
      //retrieve the error
      warpcastCast = { error: e };
    }
  }

    if (authorFid || isValidWarpcastUrl(identifier)) {
      const neynarAuthorApiResponse = await axios.get(`${baseURL}/api/get_api_author/${authorFid ? authorFid : encodeURIComponent(identifier as any)}`, {
        headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
      });
      neynarAuthor = neynarAuthorApiResponse.data;

      const warpcastAuthorApiStart = performance.now();
      let warpcastAuthorResponseTime = 0;
      try {
      const warpcastAuthorApiResponse = await axios.get(`https://api.warpcast.com/v2/user?fid=${authorFid}`, {
        headers: { 'Content-Type': 'application/json' }
      });
      warpcastAuthorResponseTime = performance.now() - warpcastAuthorApiStart;
      if (warpcastAuthorApiResponse.data) {
        warpcastAuthor = warpcastAuthorApiResponse.data.result.user;
      }
    } catch (e) {
      //retrieve the error
      warpcastAuthor = { error: e };
    }

      return {
        warpcast: {
          author: { ...warpcastAuthor, durationInMs: warpcastAuthorResponseTime },
          cast: warpcastCast && Object.keys(warpcastCast).length > 0 ? { ...warpcastCast,  durationInMs: warpcastCastResponseTime ?? 0  } : null,
          name: "Warpcast api"
        },
        neynar: {
          author: neynarAuthor,
          cast: neynarCast && Object.keys(neynarCast).length > 0 ? neynarCast : null,
          name: "Neynar api"
        },
      };
    }

    return {
      warpcast: {
        cast: { ...warpcastCast },
        name: "Warpcast api",
        author: null
      },
      neynar: {
        cast: neynarCast,
        name: "Neynar api",
        author: null
      },
    };

  } catch (error) {
    console.log("error in fetchApiData", error);
    return { error };
  }
};





export async function fetchCastAndFidData(hash: string | null, fid: number | null) {
if(!hash && !fid) return { apiData: null, hubData: null };
const apiData = await fetchApiData(fid, hash);
//check if apiData has a valid fid and hash, if not, return null

if(apiData.error ||(!apiData.neynar && !apiData.warpcast)) return { apiData, hubData: null };
//check if apiData has a valid fid and hash, if not, return null
const processedFid = apiData.neynar?.cast?.fid ?? apiData.warpcast?.cast?.author?.fid ?? fid;
const processedHash = apiData.neynar?.cast?.hash ?? apiData.warpcast?.cast?.hash ?? hash;
if(!processedFid && !processedHash) return { apiData, hubData: null };
const hubData = await fetchHubData(processedFid, processedHash);
 return { apiData, hubData }
}

export async function fetchCastFromHub(hash: string | null, fid: number | null, hub: HubType,callAPIForNeynar: boolean = true) {
  if(!fid || !hash) return null
  const start = performance.now(); 
  try {
    let headers: { "Content-Type": string, api_key?: string,"x-airstack-hubs"?: string } = {"Content-Type": "application/json"};
    if(hub.shortname === "Neynar hub" && callAPIForNeynar) {
     return await fetchCastFromNeynarHub(hash,fid);
    }
    else if(hub.shortname === "Neynar hub" && !callAPIForNeynar) {
headers.api_key = `${process.env.NEYNAR_API_KEY}`;
    }
    else if(hub.shortname === "airstack") {
      headers = { "Content-Type": "application/json", "x-airstack-hubs": process.env.NEXT_PUBLIC_AIRSTACK_API_KEY }
    }
      const response = await axios.get(`${hub.url}/v1/castById?fid=${fid}&hash=${hash}`, { headers });
      const durationInMs = performance.now() - start;
      return { data: response.data, durationInMs, error: null};
  } catch (e) {
    const durationInMs = performance.now() - start;
      return { durationInMs, error: e, data: null };
  }
}

export async function fetchCastFromNeynarHub(hash: string | null,fid: number) {
  const start = performance.now(); 
  const protocol = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "development" ? "https://" : "http://";
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const baseURL = `${protocol}${url}`
  try {
    const hubCastInfo = await axios.get(`${baseURL}/api/get_hub_cast/${hash}/${fid}`, { headers: { "Content-Type": "application-json", "Authorization": tokenBearer } })
return hubCastInfo.data;
  } catch (e) {
    const durationInMs = performance.now() - start; 
      return {durationInMs, error: e,cast: null}; 
  }
}

export async function fetchCastFromNeynarAPI(identifier: string, isURL: boolean = false) {
  //check if the identifier is a hash or a warpcast url

  const start = performance.now(); // Start timing before the request
  try {
      const cast = await axios.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${identifier}&type=${isURL ? 'url' : 'hash'}`,{
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEYNAR_API_KEY}`
        }
      });
      const durationInMs = performance.now() - start; // Calculate duration after the request
      return { cast: cast.data.cast, durationInMs ,error: null }; // Return cast and duration
  } catch (e) {
    const durationInMs = performance.now() - start; // Calculate duration after the request
      return {durationInMs, error: e,cast: null}; // Return error and duration
  }
}

export async function fetchFidFromHub(fid: number | null, hub: HubType,callAPIForNeynar: boolean = true) {
  if(!fid) return { data: null, durationInMs: 0, error: "No fid provided" };
  const start = performance.now(); 
  try {
    let headers: { "Content-Type": string, api_key?: string, "x-airstack-hubs"?: string } = {"Content-Type": "application/json"};
    if(hub.shortname === "Neynar hub" && callAPIForNeynar) {
     return await fetchFidFromNeynarHub(fid);
    }
    else if(hub.shortname === "Neynar hub" && !callAPIForNeynar) {
headers.api_key = `${process.env.NEYNAR_API_KEY}`;
    }
    else if(hub.shortname === "airstack") {
      headers = { "Content-Type": "application/json", "x-airstack-hubs": process.env.NEXT_PUBLIC_AIRSTACK_API_KEY }
    }
      const response = await axios.get(`${hub.url}/v1/userDataByFid?fid=${fid}`, { headers });
      const durationInMs = performance.now() - start;
      return { data: response.data, durationInMs, error: null};
  } catch (e) {
    const durationInMs = performance.now() - start;
      return { durationInMs, error: e, data: null };
  }
}

export async function fetchFidFromNeynarHub(fid: number) {
  const start = performance.now(); 
  const protocol = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "development" ? "https://" : "http://";
  const url = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const baseURL = `${protocol}${url}`
  try {
    const hubCastInfo = await axios.get(`${baseURL}/api/get_hub_fid/${fid}`, { headers: { "Content-Type": "application-json","Authorization": tokenBearer } })
return hubCastInfo.data;
  } catch (e) {
    const durationInMs = performance.now() - start; 
      return {durationInMs, error: e,cast: null}; 
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
  if(isImage) return {type: "image", url};

  const isVideo = isEmbedVideoValid(url);
  if(isVideo) return {type: "video", url};

  return null;
}

export async function fetchAuthorFromNeynarAPI(identifier: string) {
  let durationInMs = 0
  try {

    //check if a warpcast url
    const isURL = isValidWarpcastUrl(identifier);
    //check if a number
    const start = performance.now(); // Start timing before the request
    if(!isURL) {
      const authorData = await axios.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${identifier}`,{
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEYNAR_API_KEY}`
        }
      });
      const author = authorData.data.users[0]
      durationInMs = performance.now() - start; // Calculate duration after the request
      return { author, durationInMs, error: null }; // Return cast and duration
    }
    else {
      //extract user
      const username = identifier.split("/")[3];
        const start = performance.now(); // Start timing before the request
      const authorData = await axios.get(`https://api.neynar.com/v1/farcaster/user-by-username?username=${username}`,{
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEYNAR_API_KEY}`
        }
      });
      durationInMs = performance.now() - start; // Calculate duration after the request
      return { author: authorData,durationInMs, error: null }; // Return cast and duration
    }
  } catch (e) {
      return { error: e, durationInMs,author: null }; // Return error and duration
  }
}

export const isValidWarpcastUrl = (url: string | null) => {
  if(!url) return false;
  const warpcastUrlPattern = /^https:\/\/warpcast\.com\/[a-zA-Z0-9_-]+\/0x[0-9a-fA-F]{8}$/;
  return warpcastUrlPattern.test(url);
};
