import axios from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { hubs, tokenBearer } from '@/constants';
import { isFollowSyntax, isNumeric } from './helpers';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export interface HubType {
  shortname: string;
  url: string;
}
const fetchHubData = async (
  fid: number | null,
  hash: string | null,
  isCast = true,
  followRelationship: null | string = null
) => {
  const promises = hubs.map(async (hub) => {
    const authorData = await fetchFidFromHub(
      fid,
      hub,
      isCast,
      followRelationship
    );
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

export const extractIdentifierFromUrl = (url: string): string | null => {
  const match = url.match(/0x[a-fA-F0-9]{40}/);
  return match && match[0].length === 42 ? match[0] : null;
};

export const extractUsernameFromUrl = (url: string): string | null => {
  const match = url.match(
    /https:\/\/(?:www\.supercast\.xyz|warpcast\.com)\/([a-zA-Z0-9.]+)(?:\/([^\/]+))?/
  );

  if (match && !match[2]) {
    return match[1];
  }

  return null;
};

const fetchApiData = async (
  fid: number | null,
  identifier: string | null
): Promise<ApiResponse> => {
  let neynarAuthor: any = null;
  let neynarCast: any = null;
  let warpcastAuthor: any = null;
  let warpcastCast: any = null;
  let authorFid = fid;
  let hash = identifier;

  const isWarpcastURL = isValidWarpcastUrl(identifier);
  let warpcastCastResponseStart = null;
  let isUsername = false;

  try {
    // Extract hash from URL if in the supercast cast format
    if (identifier && identifier.includes('https://www.supercast.xyz/c/')) {
      const extractedIdentifier = extractIdentifierFromUrl(identifier);
      if (extractedIdentifier) {
        hash = extractedIdentifier;
        isUsername = false;
      } else {
        isUsername = true;
      }
    }

    // Extract username from URL if in that format
    if (
      identifier &&
      (identifier.includes('https://www.supercast.xyz/') ||
        identifier.includes('https://warpcast.com/'))
    ) {
      const extractedUsername = extractUsernameFromUrl(identifier);
      if (extractedUsername) {
        identifier = extractedUsername;
        isUsername = true;
        hash = null;
      }
    }
    if (
      identifier &&
      !isValidWarpcastUrl(identifier) &&
      !identifier.includes('0x') &&
      !identifier.match(/^[a-zA-Z0-9.]+$/) &&
      !isFollowSyntax(identifier)
    ) {
      throw new Error('Invalid identifier');
    }
    // Only make author calls if there is a fid or the identifier is a username
    if (
      identifier?.match(/^(\d+)<>(\d+)$/) ||
      ((isUsername || authorFid) &&
        !hash &&
        (authorFid || (identifier && identifier.match(/^[a-zA-Z0-9.]+$/))))
    ) {
      try {
        warpcastAuthor = await fetchWarpcastAuthor(
          authorFid?.toString() ?? (identifier as any)
        );
      } catch (error) {
        warpcastAuthor = formatError(
          authorFid?.toString() ?? (identifier as any),
          false
        );
      }
      try {
        neynarAuthor = await fetchAuthorFromNeynarAPI(
          authorFid?.toString() ?? (identifier as any)
        );
      } catch (error) {}

      return formatResponse(
        warpcastAuthor,
        warpcastCast,
        neynarAuthor,
        neynarCast
      );
    }

    // Only make cast calls if there is a hash or the identifier is a URL that you can extract a post from
    if (
      (!isFollowSyntax(identifier) && !isUsername && hash) ||
      (identifier && isWarpcastURL && identifier.split('/').length >= 4)
    ) {
      try {
        warpcastCastResponseStart = performance.now();
        warpcastCast = await fetchWarpcastCast(hash, isWarpcastURL, identifier);
        if (warpcastCast && warpcastCast.hash) {
          authorFid = authorFid || warpcastCast?.author?.fid || null;
          hash = warpcastCast?.hash || hash;
        }
      } catch (error) {
        warpcastCast = formatError(hash ?? identifier, false);
      }
      try {
        neynarCast = await fetchCastFromNeynarAPI(
          identifier as string,
          isWarpcastURL
        );
        if (neynarCast && neynarCast.cast.hash) {
          authorFid = authorFid || neynarCast?.author?.fid || null;
          hash = neynarCast?.cast?.hash || hash;
        }
      } catch (error) {}
      warpcastAuthor = null;
      neynarAuthor = null;
      return formatResponse(
        warpcastAuthor,
        warpcastCast,
        neynarAuthor,
        neynarCast
      );
    }

    return formatEmptyResponse(warpcastCast, neynarCast);
  } catch (error) {
    console.error('Error in fetchApiData', error);
    return formatErrorResponse(error, warpcastCast, neynarCast);
  }
};

const fetchWarpcastCast = async (
  hash: string | null,
  isWarpcastURL: boolean,
  identifier: string | null
) => {
  let cast = null;
  try {
    if (!isWarpcastURL) {
      const response = await axios.get(
        `https://api.warpcast.com/v2/thread-casts?castHash=${hash}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      cast =
        response.data?.result?.casts.find((cast: any) =>
          cast.hash.startsWith(hash)
        ) || (null as any);
    } else if (identifier && identifier.split('/').length > 3) {
      const username = identifier.split('/')[3];
      const hashPrefix = identifier.split('/')[4];
      const response = await axios.get(
        `https://api.warpcast.com/v2/user-thread-casts?castHashPrefix=${hashPrefix}&username=${username}&limit=15`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      cast =
        response.data?.result?.casts.find((cast: any) =>
          cast.hash.startsWith(hashPrefix)
        ) || null;
    }
    if (!cast) {
      return { error: 'Cast not found' };
    }
    return { ...cast, error: null };
  } catch (error) {
    return `Couldn't find the info for identifier ${identifier}.`;
  }
};

const formatResponse = (
  warpcastAuthor: any,
  warpcastCast: any,
  neynarAuthor: any,
  neynarCast: any
) => ({
  warpcast: {
    author:
      warpcastAuthor && Object.keys(warpcastAuthor).length > 0
        ? { ...warpcastAuthor }
        : null,
    cast:
      warpcastCast && Object.keys(warpcastCast).length > 0
        ? { ...warpcastCast }
        : null,
    name: 'Warpcast API',
  },
  neynar: {
    author:
      neynarAuthor && Object.keys(neynarAuthor).length > 0
        ? neynarAuthor
        : null,
    cast: neynarCast && Object.keys(neynarCast).length > 0 ? neynarCast : null,
    name: 'Neynar API',
  },
});
const formatEmptyResponse = (warpcastCast: any, neynarCast: any) => ({
  warpcast: {
    cast: warpcastCast,
    name: 'Warpcast API',
    author: null,
  },
  neynar: {
    cast: neynarCast,
    name: 'Neynar API',
    author: null,
  },
});
const formatErrorResponse = (
  error: any,
  warpcastCast: any = null,
  neynarCast: any = null
) => {
  const errorInfo = {
    message: error.message,
    name: error.name,
    response: error.response
      ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        }
      : null,
  };
  return {
    warpcast: {
      cast: { ...warpcastCast, error: errorInfo },
      name: 'Warpcast API',
      author: null,
    },
    neynar: {
      cast: { ...neynarCast, error: errorInfo },
      name: 'Neynar API',
      author: null,
    },
    error: errorInfo,
  };
};
const formatError = (identifier: string | null, is_server_dead: boolean) =>
  is_server_dead
    ? `The server failed to respond when looking for ${identifier}, please try again.`
    : `Couldn't find the info for identifier ${identifier}.`;

export function isValidSuperCastUrl(url: string) {
  return url && url.includes('https://www.supercast.xyz');
}

export async function fetchCastAndFidData(
  hash: string | null,
  fid: number | null
) {
  if (!hash && !fid) return { apiData: null, hubData: null };
  //if the hash doesnt have 0x return an error
  const apiData = await fetchApiData(fid, hash);
  if (apiData.error || (!apiData.neynar && !apiData.warpcast))
    return { apiData, hubData: null };
  const processedFid =
    apiData.neynar?.cast?.cast?.author?.fid ??
    apiData.warpcast?.cast?.author?.fid ??
    apiData.warpcast?.author?.fid ??
    apiData.neynar?.author?.fid ??
    fid;
  let processedHash =
    apiData.neynar?.cast?.cast?.hash ?? apiData.warpcast?.cast?.hash ?? hash;
  const followRelationship = isFollowSyntax(hash) ? hash : null;
  if (isValidWarpcastUrl(processedHash) || isValidSuperCastUrl(processedHash)) {
    processedHash = null;
  }
  if (!processedFid && !processedHash) return { apiData, hubData: null };
  const hubData = await fetchHubData(
    processedFid,
    processedHash,
    apiData.neynar?.cast || apiData.warpcast?.cast,
    followRelationship
  );
  return { apiData, hubData };
}

export async function fetchCastFromHub(
  hash: string | null,
  fid: number | null,
  hub: HubType,
  isCast = true
) {
  if (!fid || !hash || !isCast) return null;
  try {
    let headers: {
      'Content-Type': string;
      api_key?: string;
      'x-airstack-hubs'?: string;
    } = { 'Content-Type': 'application/json' };
    if (hub.shortname === 'Neynar hub') {
      headers.api_key = `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;
    }
    const response = await axios.get(
      `${hub.url}/v1/castById?fid=${fid}&hash=${hash}`,
      { headers, timeout: 7000 }
    );
    return { data: response?.data };
  } catch (e: any) {
    let is_server_dead = false;
    if (e.code === 'ECONNABORTED') {
      is_server_dead = true;
    }
    if (e.response) {
      if (e.response.status >= 500) {
        is_server_dead = true;
      }
    } else if (e.request) {
      is_server_dead = true;
    }
    return { error: formatError(hash, is_server_dead) };
  }
}
export async function fetchCastFromNeynarAPI(
  identifier: string,
  isURL: boolean = false
) {
  try {
    const cast = await axios.get(
      `https://api.neynar.com/v2/farcaster/cast?identifier=${identifier}&type=${isURL ? 'url' : 'hash'}`,
      {
        headers: {
          'Content-Type': 'application-json',
          api_key: `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`,
        },
      }
    );
    return { cast: cast.data.cast };
  } catch (e) {
    return { error: formatError(identifier, false) };
  }
}

async function fetchLink(hub: HubType, fid: string, target_fid: string) {
  let headers: {
    'Content-Type': string;
    api_key?: string;
  } = { 'Content-Type': 'application/json' };
  if (hub.shortname === 'Neynar hub') {
    headers.api_key = `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;
  }
  try {
    const response = await axios.get(
      `${hub.url}/v1/linkById?fid=${fid}&target_fid=${target_fid}&link_type=follow`,
      {
        headers,
        timeout: 7000,
      }
    );

    //if status isn't in 200's return error
    if (response.status < 200 || response.status > 299) {
      return { error: response.data };
    }
    return { ...response.data, error: null };
  } catch (e: any) {
    let is_server_dead = false;
    let error;
    if (e.code === 'ECONNABORTED') {
      is_server_dead = true;
    }
    if (e.response) {
      if (e.response.status >= 500) {
        is_server_dead = true;
      }
    } else if (e.request) {
      is_server_dead = true;
    }
    return { error: formatError(`${fid}<>${target_fid}`, is_server_dead) };
  }
}

export async function fetchFidFromHub(
  fid: number | null,
  hub: HubType,
  isCast = true,
  followRelationship: null | string = null
) {
  if ((!fid || isCast) && !followRelationship) return null;
  try {
    let headers: {
      'Content-Type': string;
      api_key?: string;
      'x-airstack-hubs'?: string;
    } = { 'Content-Type': 'application/json' };
    if (hub.shortname === 'Neynar hub') {
      headers.api_key = `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;
    }
    if (followRelationship) {
      const follow = followRelationship.split('<>');
      const fid = follow[0];
      const target_fid = follow[1];
      const [followResponse, followedByResponse] = await Promise.all([
        fetchLink(hub, fid, target_fid),
        fetchLink(hub, target_fid, fid),
      ]);

      return {
        follow: followResponse?.data ? { ...followResponse.data } : undefined,
        followedBy: followedByResponse?.data
          ? { ...followedByResponse.data }
          : undefined,
        is_server_dead:
          followResponse?.data || followedByResponse?.data
            ? followResponse.is_server_dead || followedByResponse.is_server_dead
              ? true
              : false
            : undefined,
        error:
          followResponse?.error && followedByResponse?.error
            ? 'No link relationship exists'
            : null,
      };
    }

    const response = await axios.get(`${hub.url}/v1/userDataByFid?fid=${fid}`, {
      headers,
      timeout: 7000,
    });
    const verificationsResponse = await axios.get(
      `${hub.url}/v1/verificationsByFid?fid=${fid}`,
      { headers, timeout: 7000 }
    );
    return response?.data && response?.data?.messages?.length
      ? {
          ...response.data,
          verifications: verificationsResponse.data,
          error: null,
          is_server_dead: false,
        }
      : { error: `fid ${fid} not found` };
  } catch (e: any) {
    let is_server_dead = false;
    if (e.code === 'ECONNABORTED') {
      is_server_dead = true;
    }
    if (e.response) {
      if (e.response.status >= 500) {
        is_server_dead = true;
      }
    } else if (e.request) {
      is_server_dead = true;
    }
    return { error: formatError(e, is_server_dead) };
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
  if (isImage) return { type: 'image', url };
  const isVideo = isEmbedVideoValid(url);
  if (isVideo) return { type: 'video', url };
  return null;
}

export async function fetchAuthorFromNeynarAPI(identifier: string) {
  let isUsername = false;
  try {
    let url, params;

    const match = isFollowSyntax(identifier);

    if (match) {
      const x = match[1];
      const y = match[2];

      const authorData = await axios.get(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${y}&viewer_fid=${x}`,
        {
          headers: {
            'Content-Type': 'application/json',
            api_key: `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`,
          },
        }
      );

      const author = authorData.data.users[0];
      //extract viewer_context
      const viewer_context = author?.viewer_context;

      if (!viewer_context.following && !viewer_context.followed_by) {
        return { error: 'No link relationship exists', author: null };
      }

      return { author: viewer_context, error: null };
    } else if (!Number(identifier)) {
      isUsername = true;
      url = 'https://api.neynar.com/v1/farcaster/user-by-username';
      params = { username: identifier };
    } else {
      const authorData = await axios.get(
        `https://api.neynar.com/v2/farcaster/user/bulk?fids=${identifier}`,
        {
          headers: {
            'Content-Type': 'application/json',
            api_key: `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`,
          },
        }
      );

      const author = authorData.data.users[0];
      return { author, error: null };
    }

    const authorData = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        api_key: `${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`,
      },
      params,
    });

    const author = authorData.data.result.user;
    return { author, error: null };
  } catch (e) {
    return { error: formatError(identifier, false) };
  }
}

export const fetchWarpcastAuthor = async (identifier: string | null) => {
  let isUsername = false;
  try {
    let url, params;

    if (isFollowSyntax(identifier)) {
      return null;
    }

    if (identifier && isNumeric(identifier)) {
      const response = await axios.get(
        `https://api.warpcast.com/v2/user?fid=${identifier}`,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data?.result?.user || null;
    }

    // Extract username if identifier is a URL
    if (identifier && identifier.includes('https://www.supercast.xyz/')) {
      isUsername = true;
      const username = identifier.split('/').pop();
      url = 'https://api.warpcast.com/v2/user-by-username';
      params = { username };
    } else {
      url = 'https://api.warpcast.com/v2/user-by-username';
      params = { username: identifier };
    }

    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
      params,
    });

    return response.data?.result?.user || null;
  } catch (error) {
    return { error: `Couldn't find the info for identifier ${identifier}.` };
  }
};

async function getNeynarHubInfo() {
  const url = `https://hub-api.neynar.com/v1/info?dbstats=1&api_key=${process.env.NEXT_PUBLIC_NEYNAR_API_KEY}`;

  try {
    const response = await axios.get(url);
    return { ...response.data, nickname: 'Neynar' };
  } catch (error) {
    console.error('Error fetching API info:', error);
    return {
      dbStats: {
        numMessages: 0,
      },
      nickname: 'Neynar',
    };
  }
}

export async function getHubsInfo() {
  const promises = hubs.slice(0, 3).map(async (hub: any) => {
    if (hub.shortname === 'Neynar hub') return await getNeynarHubInfo();
    const url = `${hub.url}/v1/info?dbstats=1`;

    try {
      let response = await axios.get(url);
      // Set the nickname to the shortname
      return { ...response.data, nickname: hub.shortname };
    } catch (error) {
      console.error('Error fetching API info:', error);
      return {
        dbStats: {
          numMessages: 0,
        },
        nickname: hub.shortname,
      };
    }
  });
  return Promise.all(promises);
}

export const isValidWarpcastUrl = (url: string | null) => {
  if (!url) return false;
  return url.includes('https://warpcast.com');
};
