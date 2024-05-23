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

const fetchHubData = async (fid: number | null, hash: string) => {
  const promises = hubs.map(async hub => {
      const authorData = await fetchFidFromHub(fid, hub);
      const castData = await fetchCastFromHub(hash, fid, hub);
      return { name: hub.shortname, author: authorData, cast: castData };
  });

  return Promise.all(promises);
}


const fetchApiData = async (fid: number | null, hash: string) => {
  let author = {}, cast = {} as any;
  let authorFid = fid;
  
  try {
    const warpcastCastResponseStart = performance.now();
    // Fetch data from the Warpcast API
    const warpcastCastApiResponse = await axios.get(`https://api.warpcast.com/v2/cast?hash=${hash}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const warpcastCastResponseTime = performance.now() - warpcastCastResponseStart
    if(warpcastCastApiResponse.data) {
      cast = warpcastCastApiResponse.data.result.cast
    }
    const warpcastAuthorApiStart = performance.now();
    const warpcastAuthorApiResponse = await axios.get(`https://api.warpcast.com/v2/user?fid=${authorFid}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    const warpcastAuthorResponseTime = performance.now() - warpcastAuthorApiStart;
    if(warpcastAuthorApiResponse.data) {
    author = warpcastAuthorApiResponse.data.result.user
    }


    // Fetch data from the Neynar API
    const protocol = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "development" ? "https://" : "http://";
    const url = process.env.VERCEL_URL ?? "localhost:3000";
    const baseURL = `${protocol}${url}`;
    
    const neynarCastApiResponse = await axios.get(`${baseURL}/api/get_api_cast/${hash}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
    });
    const neynarAuthorApiResponse = await axios.get(`${baseURL}/api/get_api_author/${authorFid}`, {
      headers: { 'Content-Type': 'application/json', 'Authorization': tokenBearer }
    });


    return {
      warpcast: {
        author: { ...author, durationInMs: warpcastAuthorResponseTime },
        cast: { ...cast, durationInMs: warpcastCastResponseTime },
        name: "Warpcast api"
      },
      neynar: {
        author: neynarAuthorApiResponse.data,
        cast: neynarCastApiResponse.data,
        name: "Neynar api"
      },
    };
  } catch (error) {
    console.log("error in fetchApiData", error);
    return { author, cast, name: "Neynar api" };
  }
};


export async function fetchCastAndFidData(hash: string, fid: number | null) {
if(!hash) return { apiData: null, hubData: null };
const apiData = await fetchApiData(fid, hash);
console.log("apiData", apiData)
const hubData = await fetchHubData(fid, hash);
 return { apiData, hubData }
}

export async function fetchCastFromHub(hash: string, fid: number | null, hub: HubType,callAPIForNeynar: boolean = true) {
  if(!fid) return { data: null, durationInMs: 0, error: "No fid provided" };
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

export async function fetchCastFromNeynarHub(hash: string,fid: number) {
  const start = performance.now(); 
  const protocol = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "development" ? "https://" : "http://";
  const url = process.env.VERCEL_URL ?? "localhost:3000";
  const baseURL = `${protocol}${url}`
  try {
    const hubCastInfo = await axios.get(`${baseURL}/api/get_hub_cast/${hash}/${fid}`, { headers: { "Content-Type": "application-json","Authorization": tokenBearer } })
return hubCastInfo.data;
  } catch (e) {
    const durationInMs = performance.now() - start; 
      return {durationInMs, error: e,cast: null}; 
  }
}

export async function fetchCastFromNeynarAPI(hash: string) {

  const start = performance.now(); // Start timing before the request
  try {
      const cast = await axios.get(`https://api.neynar.com/v2/farcaster/cast?identifier=${hash}&type=hash`,{
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
  const url = process.env.VERCEL_URL ?? "localhost:3000";
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

export async function fetchAuthorFromNeynarAPI(fid: number) {
  try {
      const authorData = await axios.get(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,{
        headers: {
          "Content-Type": "application-json",
          "api_key": `${process.env.NEYNAR_API_KEY}`
        }
      });
      const author = authorData.data.users[0]
      return { author,error: null }; // Return cast and duration
  } catch (e) {
      return { error: e,author: null }; // Return error and duration
  }
}
