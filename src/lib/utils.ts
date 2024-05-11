import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios";
import { tokenBearer } from "@/constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface HubType {
  shortname: string;
  url: string;
}



export async function fetchCastFromHub(hash: string, fid: number, hub: HubType,callAPIForNeynar: boolean = true) {
  const start = performance.now(); 
  try {
    let headers: { "Content-Type": string, api_key?: string } = {"Content-Type": "application/json"};
    if(hub.shortname === "neynar" && callAPIForNeynar) {
     return await fetchCastFromNeynarHub(hash,fid);
    }
    else if(hub.shortname === "neynar" && !callAPIForNeynar) {
headers.api_key = `${process.env.NEYNAR_API_KEY}`;
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
  try {
    const hubCastInfo = await axios.get(`/api/get_hub_cast/${hash}/${fid}`, { headers: { "Content-Type": "application-json","Authorization": tokenBearer } })
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
