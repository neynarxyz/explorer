# tsconfig.json

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

# tailwind.config.ts

```ts
import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      fontFamily: {
        pixelify: ['Pixelify Sans', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
```

# postcss.config.mjs

```mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
```

# package.json

```json
{
  "name": "farcaster-explorer",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prettier": "prettier . --check",
    "prepare": "husky"
  },
  "dependencies": {
    "@amplitude/analytics-browser": "^2.9.3",
    "@farcaster/hub-nodejs": "^0.12.2",
    "@neynar/nodejs-sdk": "^1.27.0",
    "@neynar/react": "^0.9.2",
    "@pigment-css/react": "^0.0.9",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.1.0",
    "axios": "^1.6.8",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "frames.js": "^0.17.0",
    "hls.js": "^1.5.13",
    "lucide-react": "^0.378.0",
    "next": "14.2.3",
    "next13-progressbar": "^1.2.1",
    "nprogress": "^0.2.0",
    "react": "^18.3.1",
    "react-code-blocks": "^0.1.6",
    "react-dom": "^18.3.1",
    "react-farcaster-embed": "^1.5.0",
    "react-icons": "^5.2.1",
    "react-loading-skeleton": "^3.4.0",
    "swr": "^2.2.5",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@types/lodash": "^4.17.7",
    "@types/node": "^20",
    "@types/nprogress": "^0.2.3",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^10.0.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.3",
    "eslint-config-prettier": "^9.1.0",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.10",
    "postcss": "^8",
    "prettier": "3.3.3",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.4.5"
  },
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write --ignore-unknown"
    ],
    "!**/*.{js,jsx,ts,tsx}": "prettier --write --ignore-unknown"
  }
}
```

# next.config.mjs

```mjs
/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;
```

# next-env.d.ts

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

# components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

# README.md

```md
## What is Explorer?

This is a simple website to track event propagation across Farcaster. In some cases, a cast or user event that occurred on a hub can take up to 4 hours to propagate across the network. This site lets you see where in a network a given user or cast has been propagated.

## Getting Started

1. First, get you `NEYNAR_API_KEY` from the [Neynar dev portal](https://dev.neynar.com)
2. Copy `.env.example` to a new `.env.local` file and add your Neynar API key
3. Install local dependencies with `npm i`
4. Run the app locally with `npm run dev`

## Contributing

You can contribute in many ways:

- reporting a bug in [Issues](https://github.com/neynarxyz/explorer/issues)
- submitting a [pull request](https://github.com/neynarxyz/explorer/pulls)
```

# .prettierrc

```
{
  "singleQuote": true,
  "trailingComma": "es5"
}

```

# .prettierignore

```
.next

```

# .gitignore

```
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# ide files
.idea/

```

# .eslintrc.json

```json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

# src/middleware.ts

```ts
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const env = process.env.VERCEL_ENV ?? 'development';
  if (env === 'development') {
    return NextResponse.next();
  }

  //check if url has Authentication header passed in
  if (!req.headers.get('Authorization')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  //get authorization header
  const authHeader = req.headers.get('Authorization');
  //Add better token flow
  if (authHeader !== process.env.NEXT_PUBLIC_TOKEN_SECRET) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

# src/constants.ts

```ts
export const seo = {
  title: 'Farcaster Explorer',
  description: 'Explore event propogation on farcaster.',
  ogImage: '/neynarplanet.png',
  url: 'https://explorer.neynar.com',
};

export const hubs = [
  {
    shortname: 'Warpcast hub (Lamia)',
    url: 'https://lamia.farcaster.xyz:2281',
  },
  { shortname: 'Neynar hub', url: 'https://hub-api.neynar.com' },
  { shortname: 'Warpcast hub (Hoyt)', url: 'https://hoyt.farcaster.xyz:2281' },
];

export const neynarHub = {
  shortname: 'Neynar hub',
  url: 'https://hub-api.neynar.com',
};
export const defaultHash = '0x3e7326f8da760ed926c1fe82e1444cd528fe6c78';
export const tokenBearer = `${process.env.NEXT_PUBLIC_TOKEN_SECRET}`;
export const defaultFID = 242661;
export const exampleCast = {
  object: 'cast',
  hash: '0xc5af16a18f1ec1ae101635f12cdad4b4a64d9107',
  thread_hash: '0xc5af16a18f1ec1ae101635f12cdad4b4a64d9107',
  parent_hash: null,
  parent_url:
    'chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61',
  root_parent_url:
    'chain://eip155:1/erc721:0xfd8427165df67df6d7fd689ae67c8ebf56d9ca61',
  parent_author: {
    fid: null,
  },
  author: {
    object: 'user',
    fid: 194,
    custody_address: '0xb95dc10483be18f7c69ddf78d4baafecc01c5530',
    username: 'rish',
    display_name: 'rish',
    pfp_url: 'https://i.imgur.com/naZWL9n.gif',
    profile: {
      bio: {
        text: 'building /neynar 🪐 | neynar.com | /rish ',
      },
    },
    follower_count: 155933,
    following_count: 698,
    verifications: [
      '0x5a927ac639636e534b678e81768ca19e2c6280b7',
      '0xe9e261852ea62150eee685807df8fe3f211310a0',
    ],
    verified_addresses: {
      eth_addresses: [
        '0x5a927ac639636e534b678e81768ca19e2c6280b7',
        '0xe9e261852ea62150eee685807df8fe3f211310a0',
      ],
      sol_addresses: [],
    },
    active_status: 'inactive',
    power_badge: true,
  },
  text: 'when @automod likes your cast',
  timestamp: '2024-05-26T14:13:03.000Z',
  embeds: [
    {
      url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/963666e6-e986-4f80-aada-db3ef9b48800/original',
    },
    {
      url: 'https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/720ba645-7be4-4dfb-5990-77354fc4f400/original',
    },
  ],
  reactions: {
    likes_count: 301,
    recasts_count: 45,
    likes: [
      {
        fid: 284408,
        fname: 'spaceman-spiff',
      },
      {
        fid: 584770,
        fname: 'sempas2024',
      },
      {
        fid: 546979,
        fname: 'anchor06',
      },
      {
        fid: 585945,
        fname: 'layk',
      },
      {
        fid: 549906,
        fname: 'trouble25.eth',
      },
    ],
    recasts: [
      {
        fid: 580720,
        fname: 'anri',
      },
      {
        fid: 581042,
        fname: 'sheeesh',
      },
      {
        fid: 576074,
        fname: 'nikalaygogol',
      },
      {
        fid: 566243,
        fname: 'tagaria',
      },
      {
        fid: 574864,
        fname: 'fpw',
      },
    ],
  },
  replies: {
    count: 32,
  },
  mentioned_profiles: [
    {
      object: 'user',
      fid: 368422,
      custody_address: '0x16d25ca06a054fc7752e1ae63ca8b23ce6fa2da4',
      username: 'automod',
      display_name: 'automod',
      pfp_url: 'https://i.imgur.com/K1SLPRA.jpg',
      profile: {
        bio: {
          text: 'automod.sh - automate channel norms',
          mentioned_profiles: [],
        },
      },
      follower_count: 3230,
      following_count: 65,
      verifications: [],
      verified_addresses: {
        eth_addresses: [],
        sol_addresses: [],
      },
      active_status: 'inactive',
      power_badge: false,
    },
  ],
};

export const FIDPFP =
  'https://res.cloudinary.com/merkle-manufactory/image/fetch/c_fill,f_png,w_256/https://lh3.googleusercontent.com/MyUBL0xHzMeBu7DXQAqv0bM9y6s4i4qjnhcXz5fxZKS3gwWgtamxxmxzCJX7m2cuYeGalyseCA2Y6OBKDMR06TWg2uwknnhdkDA1AA';
export const warpcastURLProfile = 'https://warpcast.com/dylsteck.eth';
export const warpcastURLPFP = 'https://i.imgur.com/2UTZYvn.png';
export const warpcastURLCastURL =
  'https://warpcast.com/kevinoconnell/0x6afc370b';
export const warpcastURLCast = {
  object: 'cast',
  hash: '0x6afc370bab152b23bdedc73d16a5296a0b708762',
  thread_hash: '0x6afc370bab152b23bdedc73d16a5296a0b708762',
  parent_hash: null,
  parent_url: 'https://warpcast.com/~/channel/kevinoconnell',
  root_parent_url: 'https://warpcast.com/~/channel/kevinoconnell',
  parent_author: {
    fid: null,
  },
  author: {
    object: 'user',
    fid: 4564,
    custody_address: '0x4622146b77ecefe4ca7552a81949d54eac991512',
    username: 'kevinoconnell',
    display_name: 'kevin',
    pfp_url: 'https://i.imgur.com/hKWxU5e.jpg',
    profile: {
      bio: {
        text: 'I like building things and exploring new places. MrKevinOConnell.github\n\nDoing work at @neynar',
      },
    },
    follower_count: 30869,
    following_count: 2269,
    verifications: [
      '0xedd3783e8c7c52b80cfbd026a63c207edc9cbee7',
      '0x69689f02c4154b049fb42761ef8fa00808f1b7ea',
    ],
    verified_addresses: {
      eth_addresses: [
        '0xedd3783e8c7c52b80cfbd026a63c207edc9cbee7',
        '0x69689f02c4154b049fb42761ef8fa00808f1b7ea',
      ],
      sol_addresses: [],
    },
    active_status: 'inactive',
    power_badge: true,
  },
  text: 'Mint Stinson beach :)',
  timestamp: '2024-05-25T20:48:50.000Z',
  embeds: [
    {
      url: 'https://zora.co/collect/base:0x9a73abb628a9177768c387ce56d152c4b696dc7f/2?referrer=0xEdd3783e8c7c52b80cfBD026a63C207Edc9CbeE7',
    },
  ],
  frames: [
    {
      version: 'vNext',
      title: 'Stinson beach',
      image:
        'https://zora.co/api/thumbnail/fc/8453/0x9a73abb628a9177768c387ce56d152c4b696dc7f/2',
      image_aspect_ratio: '1:1',
      buttons: [
        {
          index: 1,
          title: 'Mint',
          action_type: 'mint',
          target: 'eip155:8453:0x9a73abb628a9177768c387ce56d152c4b696dc7f:2',
        },
      ],
      input: {},
      state: {},
      frames_url:
        'https://zora.co/collect/base:0x9a73abb628a9177768c387ce56d152c4b696dc7f/2?referrer=0xEdd3783e8c7c52b80cfBD026a63C207Edc9CbeE7',
    },
  ],
  reactions: {
    likes_count: 28,
    recasts_count: 2,
    likes: [
      {
        fid: 581042,
        fname: 'sheeesh',
      },
      {
        fid: 558760,
        fname: 'haliava',
      },
      {
        fid: 563661,
        fname: 'airdr0phunter',
      },
      {
        fid: 579082,
        fname: 'enerdgiua',
      },
      {
        fid: 528664,
        fname: 'merish',
      },
    ],
    recasts: [
      {
        fid: 581042,
        fname: 'sheeesh',
      },
      {
        fid: 302652,
        fname: 'thisgal',
      },
    ],
  },
  replies: {
    count: 6,
  },
  mentioned_profiles: [],
};
```

# public/searchbackground.png

This is a binary file of the type: Image

# public/placeholder-avatar.jpg

This is a binary file of the type: Image

# public/neynarplanet.png

This is a binary file of the type: Image

# public/neynarexplorer.png

This is a binary file of the type: Image

# public/neynar.png

This is a binary file of the type: Image

# public/next.svg

This is a file of the type: SVG Image

# public/homebackground.png

This is a binary file of the type: Image

# public/eyecross.png

This is a binary file of the type: Image

# public/eye.png

This is a binary file of the type: Image

# public/explorer.png

This is a binary file of the type: Image

# public/cross.png

This is a binary file of the type: Image

# public/check.png

This is a binary file of the type: Image

# public/background-vertical.svg

This is a file of the type: SVG Image

# public/background-horizontal.svg

This is a file of the type: SVG Image

# public/arrowright.png

This is a binary file of the type: Image

# .github/dependabot.yml

```yml
# To get started with Dependabot version updates, you'll need to specify which
# package ecosystems to update and where the package manifests are located.
# Please see the documentation for all configuration options:
# https://docs.github.com/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file

version: 2
updates:
  - package-ecosystem: 'npm' # See documentation for possible values
    directory: '/' # Location of package manifests
    schedule:
      interval: 'weekly'
```

# .husky/pre-commit

```
npx lint-staged

```

# src/lib/utils.ts

```ts
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
```

# src/lib/helpers.ts

```ts
export function capitalizeNickname(nickname: string) {
  if (!nickname) return '';
  return nickname.charAt(0).toUpperCase() + nickname.slice(1);
}

export const calculatePercentageDifference = (
  current: number,
  median: number
) => {
  if (median === 0) return 0;
  return ((current - median) / median) * 100;
};

export const isNumeric = (str: string): boolean => {
  return !isNaN(Number(str)) && !isNaN(parseFloat(str)) && !/^0x/.test(str);
};

export const isFollowSyntax = (identifier: string | null): any => {
  if (!identifier) return null;
  // Check if the identifier matches the format x<>y
  const regex = /^(\d+)<>(\d+)$/;
  const match = identifier.match(regex);
  return match ?? null;
};
```

# src/hooks/useSearchParamsWithoutSuspense.ts

```ts
import { useEffect, useState } from 'react';

const useSearchParamsWithoutSuspense = () => {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);

  return params;
};

export default useSearchParamsWithoutSuspense;
```

# src/hooks/useClipboard.ts

```ts
import { useState, useRef } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);
  const ref = useRef();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (ref.current) {
        clearTimeout(ref.current);
      }

      setTimeout(() => setCopied(false), 1_000);
    } catch (err) {
      // cool
    }
  };

  return { copy, copied };
}
```

# src/hooks/fetchEmbedData.ts

```ts
'use client';
//NOTE: Not using this hook in the project, but it is a good example of how to render embeds from a cast.
import { useCallback, useEffect, useState } from 'react';
import { getEmbedType } from '@/lib/utils';

// Assuming onSubmit should be a function provided by the component that will trigger data fetching
const useFetchEmbedData = (embeds: any[]) => {
  const [embed, setEmbed] = useState<any | null>(null);

  const fetchEmbedData = useCallback(async () => {
    if (!embeds) {
      return;
    }
    // First, attempt to fetch data from the API.
    const embedData = await Promise.all(
      embeds.map(async (embed) => {
        return await getEmbedType(embed.url);
      })
    );
    const firstValidEmbedData = embedData.find((embed: any) => embed !== null);
    setEmbed(firstValidEmbedData);
  }, [embeds]);

  useEffect(() => {
    fetchEmbedData();
  }, [fetchEmbedData]);

  return { embed };
};

export default useFetchEmbedData;
```

# src/app/providers.tsx

```tsx
'use client';
import React from 'react';
import { Next13ProgressBar } from 'next13-progressbar';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const neynarPurple = '#9B59B6';
  return (
    <>
      {children}
      <Next13ProgressBar
        height="2px"
        color={neynarPurple}
        options={{ showSpinner: true }}
        showOnShallow
      />
    </>
  );
};

export default Providers;
```

# src/app/page.tsx

```tsx
import Home from '@/components/home';
import { seo } from '@/constants';
import { fetchMetadata } from 'frames.js/next';
import { Metadata } from 'next';

export async function generateMetadata() {
  return {
    metadataBase: new URL(seo.url),
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`,
    },
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
      url: seo.url,
      siteName: seo.title,
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      ...(await fetchMetadata(
        new URL(
          '/frames',
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000'
        )
      )),
    },
  } as Metadata;
}

export default function Page() {
  return <Home />;
}
```

# src/app/layout.tsx

```tsx
/* eslint-disable @next/next/no-img-element */

'use client';
import '@neynar/react/dist/style.css';
import './globals.css';
import Link from 'next/link';
import Providers from './providers';
import { useEffect } from 'react';
import { seo } from '@/constants';
import { Button } from '@/components/ui/button';
import { Grid2X2 } from 'lucide-react';
import { NeynarContextProvider, Theme } from '@neynar/react';
import * as amplitude from '@amplitude/analytics-browser';
import { v4 as uuidv4 } from 'uuid';
import { usePathname } from 'next/navigation';
import HubsDataComponent from '@/components/hubs-data';
import AuthButton from '@/components/AuthButton';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useEffect(() => {
    let userId = localStorage.getItem('user_uuid');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('user_uuid', userId);
    }
    amplitude.init(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY as string, userId);
  }, []);

  const getBackgroundImage = () => {
    if (pathname === '/') {
      return 'url(/background-horizontal.svg)';
    }
    return 'url(/background-vertical.svg)';
  };

  return (
    <html lang="en">
      <NeynarContextProvider
        settings={{
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID as string,
          defaultTheme: Theme.Dark,
        }}
      >
        <head>
          <meta property="og:title" content={seo.title} />
          <meta property="og:description" content={seo.description} />
          <meta property="og:image" content={seo.ogImage} />
          <meta property="og:url" content={seo.url} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.title} />
          <meta name="twitter:description" content={seo.description} />
          <meta name="twitter:image" content={seo.ogImage} />
        </head>
        <body
          className="relative h-screen min-h-screen"
          style={{
            backgroundImage: getBackgroundImage(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex flex-col min-h-screen">
            <Providers>
              <div className="sticky top-0 z-10 w-full flex justify-between px-0 pl-0">
                <div className="flex items-center space-x-4 h-full">
                  <Link href={'/'} className="h-full">
                    <div className="flex items-center bg-[#4C376C] border border-white h-full">
                      <div className="w-20 h-full flex-shrink-0 bg-white flex items-center justify-center">
                        <img
                          className="w-full h-auto object-contain"
                          src={'/neynarplanet.png'}
                          alt="Neynar logo"
                        />
                      </div>
                      <div className="flex-grow h-full flex items-center justify-center px-4">
                        <p className="font-pixelify text-white text-xl text-center">
                          explorer
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="flex items-center space-x-1 bg-white py-1 pl-1 pr-0.5">
                  <Link
                    className="font-jetbrains text-white text-md bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'/'}
                  >
                    home
                  </Link>
                  <Link
                    target="_blank"
                    className="font-jetbrains text-white text-md bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://blog.neynar.com/'}
                  >
                    blog
                  </Link>
                  <Link
                    target="_blank"
                    className="font-jetbrains text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://github.com/neynarxyz/explorer'}
                  >
                    github
                  </Link>
                  <Link
                    target="_blank"
                    className="font-jetbrains text-md text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-3 rounded"
                    href={'https://docs.neynar.com/'}
                  >
                    docs
                  </Link>
                  <AuthButton />
                </div>
              </div>
              <div className="w-full min-h-screen flex-1">{children}</div>
              <div className="sticky bottom-0 flex items-center justify-between">
                <HubsDataComponent />
                <div className="p-0">
                  <Button className="bg-black w-full flex flex-row rounded-none">
                    <Link
                      target="_blank"
                      className="text-sm md:text-md"
                      href="https://warpcast.com/~/add-cast-action?url=https://explorer.neynar.com/frames/actions/view-on-explorer"
                    >
                      <div className="flex flex-row items-center">
                        <Grid2X2 className="w-4 h-4 mr-2 hidden md:block" />
                        <p>Install Cast Action</p>
                      </div>
                    </Link>
                  </Button>
                </div>
              </div>
            </Providers>
          </div>
        </body>
      </NeynarContextProvider>
    </html>
  );
}
```

# src/app/icon.ico

This is a binary file of the type: Binary

# src/app/globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Pixelify+Sans:wght@400..700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;

    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* globals.css */
/* Customize nprogress */
#nprogress {
  pointer-events: none;
}

#nprogress .bar {
  background: #29d;
  position: fixed;
  z-index: 1031;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
}

.farcaster-embed-container {
  max-height: 320px;
}

.farcaster-embed-container img {
  max-height: 75px; /* This makes the image's max height equal to the container's max height */
}
```

# src/components/skeleton-header.tsx

```tsx
'use client';
import { Card, CardContent, CardHeader } from './ui/card';

export default function SkeletonHeader() {
  return (
    <div className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-40">
      <div className="h-8 w-3/5 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
}
```

# src/components/search.tsx

```tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next13-progressbar';
import { usePathname } from 'next/navigation';
import { SearchIcon, X } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';
import useSearchParamsWithoutSuspense from '@/hooks/useSearchParamsWithoutSuspense';

export default function Search() {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParamsWithoutSuspense();
  const [identifier, setIdentifier] = useState<string>('');

  useEffect(() => {
    const identifier = decodeURIComponent(path.slice(1));
    setIdentifier(identifier);
  }, [path]);

  const handleClearInput = () => {
    setIdentifier('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams) {
      const newParams = new URLSearchParams();
      const authorFid = searchParams.get('authorFid') || '';
      const channelId = searchParams.get('channelId') || '';
      if (authorFid) newParams.append('authorFid', authorFid);
      if (channelId) newParams.append('channelId', channelId);

      amplitude.track('Search made', {
        identifier,
        ...Object.fromEntries(newParams.entries()),
      });

      router.push(`/${encodeURIComponent(identifier)}?${newParams.toString()}`);
    }
  };

  return (
    <form
      className="flex flex-row items-start p-0 w-full h-[35px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-row items-center pl-[7.5px] w-full h-[35px] bg-white border border-white relative">
        <input
          type="text"
          className="w-full font-jetbrains focus:outline-none text-[15px] text-black"
          placeholder="Enter FID, hash, warpcast url, or supercast url..."
          value={identifier}
          onChange={(e) => setIdentifier(e.currentTarget.value)}
        />
        {identifier && (
          <button
            type="button"
            onClick={handleClearInput}
            className="flex flex-row justify-center h-[35px] bg-[#333333] items-center w-[40px] hover:bg-gray-600 border border-white"
          >
            <X className="w-16 h-7 text-white p-1 font-bold" />
          </button>
        )}
      </div>
      <button className="flex flex-row justify-center items-center w-[42px] h-[35px] bg-[#5F3AB8] border border-white">
        <SearchIcon className="w-5 h-5 text-white" />
      </button>
    </form>
  );
}
```

# src/components/profile-component.tsx

```tsx
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.
import Link from 'next/link';

export function ProfileComponent({ pfp, url }: any) {
  if (!pfp) return null;
  return (
    <Link href={`/${encodeURIComponent(url)}`}>
      <Card className="w-full hover:bg-slate-100 rounded-lg sm:max-w-md h-[150px] aspect-square flex items-center justify-center">
        <CardContent className="p-4 w-full flex flex-col justify-center items-center space-y-10">
          <Avatar>
            <AvatarImage alt={`${url} PFP`} src={pfp} />
          </Avatar>
        </CardContent>
      </Card>
    </Link>
  );
}
```

# src/components/modal-component.tsx

```tsx
import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  response: any;
  title: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  toggleModal,
  response,
  title,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        toggleModal();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, toggleModal]);

  if (!isOpen) return null;

  const { missingObjects, ...restResponse } = response;
  const linkify = (text: any) => {
    const urlPattern = /https?:\/\/[^\s/$.?#].[^\s]*/g;
    const fidPattern = /"fid":\s?(\d+)/g;
    const hashPatterns = [
      /"hash":\s?"([^"]+)"/g,
      /"parentHash":\s?"([^"]+)"/g,
      /"parent_hash":\s?"([^"]+)"/g,
      /"threadHash":\s?"([^"]+)"/g,
      /"thread_hash":\s?"([^"]+)"/g,
    ];

    const shouldLinkifyHashes = !(
      text.includes('MESSAGE_TYPE_USER_DATA') ||
      text.includes('MESSAGE_TYPE_VERIFICATION') ||
      text.includes('MESSAGE_TYPE_LINK_ADD')
    );

    let linkedText = text.replace(
      urlPattern,
      (url: any) =>
        `<a href="${url}" target="_blank" class="text-blue-500">${url}</a>`
    );

    linkedText = linkedText.replace(
      fidPattern,
      (match: any, fid: any) =>
        `"fid": <a href="/${fid}" class="text-blue-500">${fid}</a>`
    );

    if (shouldLinkifyHashes) {
      hashPatterns.forEach((pattern) => {
        linkedText = linkedText.replace(pattern, (match: any, hash: any) => {
          const key = match.split(':')[0].replace(/"/g, '');
          return `"${key}": "<a href="/${hash}" class="text-blue-500">${hash}</a>"`;
        });
      });
    }

    return linkedText;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div
        ref={modalRef}
        className="p-6 rounded shadow-lg relative z-50 max-w-lg md:max-w-4xl w-full mx-auto"
      >
        {missingObjects && missingObjects.length > 0 && (
          <div className="text-red-500 font-jetbrains mb-4">
            <strong>Missing:</strong> {missingObjects.join(', ')}
          </div>
        )}
        <div className="bg-[#0000A8] text-white p-4 rounded  overflow-y-auto max-h-64 md:max-h-[27rem] md:max-w-6xl max-w-lg">
          <pre
            className="font-jetbrains text-xs"
            dangerouslySetInnerHTML={{
              __html: linkify(JSON.stringify(restResponse, null, 2)),
            }}
          ></pre>
        </div>
      </div>
    </div>
  );
};

export default Modal;
```

# src/components/hubs-data.tsx

```tsx
'use client';
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  calculatePercentageDifference,
  capitalizeNickname,
} from '@/lib/helpers';
import { getHubsInfo } from '@/lib/utils';
import { hubs } from '@/constants';

const HubsDataComponent = () => {
  const [hubsData, setHubsData] = useState<any>([]);
  const [medianMessages, setMedianMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getHubsInfo();
        setHubsData(data as any);
        const neynarHub = data.find((hub: any) => hub?.nickname === 'Neynar');
        const neynarMessageCount = neynarHub?.dbStats?.numMessages || 1; // Default to 1 to avoid division by zero
        setMedianMessages(neynarMessageCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-row md:w-full h-full">
      <div className="flex flex-row items-center bg-white space-x-1 p-0.5">
        {loading
          ? // Skeleton loaders for loading state
            hubs.slice(0, 3).map((item) => (
              <div className="space-y-2 bg-gray-200 p-2" key={item.shortname}>
                <p className="text-center">
                  <Skeleton width={100} />
                </p>
                <div>
                  <p className="text-center font-bold text-md">
                    <Skeleton width={50} />
                  </p>
                </div>
              </div>
            ))
          : hubsData.map((hub: any, index: number) => {
              const percentageDifference: any = calculatePercentageDifference(
                hub?.dbStats?.numMessages,
                medianMessages
              ).toFixed(2);

              return (
                <div
                  style={{
                    backgroundColor:
                      percentageDifference == 0
                        ? '#5D5670'
                        : percentageDifference > 0
                          ? '#355E2B'
                          : '#C67A7D',
                  }}
                  className="space-y-2 min-h-14 flex items-center justify-center p-2"
                  key={index}
                >
                  <div className="w-full">
                    {hub.dbStats.numMessages !== null ? (
                      <p className="text-center font-bold text-xs md:text-sm font-jetbrains">
                        {capitalizeNickname(hub?.nickname)}&nbsp;
                        <span className="text-sm">
                          ({percentageDifference > 0 ? '+' : ''}
                          {percentageDifference}%)
                        </span>
                      </p>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default HubsDataComponent;
```

# src/components/home.tsx

```tsx
'use client';
import { CastComponent } from '@/components/cast-component';
import {
  FIDPFP,
  exampleCast,
  warpcastURLCast,
  warpcastURLCastURL,
  warpcastURLPFP,
  warpcastURLProfile,
} from '@/constants';
import Link from 'next/link';
import HubsDataComponent from './hubs-data';
import { NeynarProfileCard } from '@neynar/react';
import Search from './search';

export default function Home() {
  return (
    <div className="w-full flex flex-col flex-1 justify-center items-center min-h-screen">
      <div className="md:w-1/3 w-1/2 h-full flex flex-row justify-center mb-32">
        <Search />
      </div>
    </div>
  );
}
```

# src/components/collapsible-code.tsx

```tsx
'use client';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useState } from 'react';

interface CollapsibleCodeComponentProps {
  triggerContent: React.ReactNode;
  children: React.ReactNode;
}

export function CollapsibleCodeComponent({
  triggerContent,
  children,
}: CollapsibleCodeComponentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Collapsible onOpenChange={handleOpenChange}>
      <div className="flex flex-row w-full items-center justify-center">
        <CollapsibleTrigger>
          <div className="flex items-center">
            {triggerContent}
            <span className="ml-2">
              {isOpen ? '▼' : '▶'} {/* Indicator: ▼ for open, ▶ for closed */}
            </span>
          </div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}
```

# src/components/cast-component.tsx

```tsx
import { NeynarCastCard } from '@neynar/react';
//note: not using this in favor of https://github.com/pugson/react-farcaster-embed, but this is a good example of how to render a cast.
import Link from 'next/link';

export function CastComponent({ cast, warpcastUrl }: any) {
  if (!cast) return null;
  return (
    <Link
      href={`/${warpcastUrl ? encodeURIComponent(warpcastUrl) : cast.hash}`}
    >
      <NeynarCastCard
        type={warpcastUrl ? 'url' : 'hash'}
        identifier={warpcastUrl ? warpcastUrl : cast.hash}
        allowReactions={true}
      />
    </Link>
  );
}
```

# src/components/UserSearch.tsx

```tsx
// UserSearch.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NeynarProfileCard } from '@neynar/react';
import { Loader2 } from 'lucide-react';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

const UserSearch = ({ searchQuery }: { searchQuery: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchUsers();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchUsers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const userUrl = new URL(
        'https://api.neynar.com/v2/farcaster/user/search'
      );
      userUrl.searchParams.append('q', searchQuery);
      userUrl.searchParams.append('limit', '10');
      if (cursor) {
        userUrl.searchParams.append('cursor', cursor);
      }

      const userResponse = await fetch(userUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!userResponse.ok)
        throw new Error('User search network response was not ok');
      const userData = await userResponse.json();
      const newUsers = userData.result.users;
      const newCursor = userData.result.next?.cursor || null;

      setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      setCursor(newCursor);
      setHasMore(!!newCursor);
    } catch (error) {
      console.error('Error fetching search users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setUsers([]);
    setCursor(null);
    setHasMore(true);
    fetchUsers();
  }, [searchQuery]);

  const handleShowMore = (identifier: string) => {
    window.open(`/${identifier}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      {users.map((user, index) => (
        <div
          key={user.fid}
          ref={index === users.length - 1 ? lastUserElementRef : null}
          className="border border-gray-200 rounded-none bg-[#333333]"
        >
          <NeynarProfileCard
            customStyles={{
              color: 'white',
              maxWidth: '100%',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              background: '#333333',
              border: 'none',
            }}
            fid={user.fid}
          />
          <div className="p-2">
            <button
              className="w-full py-1 bg-[#4C376C] text-white text-sm rounded hover:bg-purple-800 font-jetbrains"
              onClick={() => handleShowMore(user.fid.toString())}
            >
              Show Network Response
            </button>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-white font-jetbrains">
            Loading more users...
          </span>
        </div>
      )}
      {!hasMore && users.length > 0 && (
        <p className="text-center text-white font-jetbrains mt-4">
          No more users to load
        </p>
      )}
      {!loading && users.length === 0 && (
        <p className="text-center text-white font-jetbrains">No users found</p>
      )}
    </div>
  );
};

export default UserSearch;
```

# src/components/SearchComponent.tsx

```tsx
// Search.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import UserSearch from './UserSearch';
import CastSearch from './CastSearch';
import { debounce } from 'lodash';

interface User {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

const SearchComponent = ({ initialQuery }: { initialQuery: string }) => {
  const [activeTab, setActiveTab] = useState('casts');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [username, setUsername] = useState('');
  const [channelId, setChannelId] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [submittedChannelId, setSubmittedChannelId] = useState('');
  const [inputUsers, setInputUsers] = useState<User[]>([]);
  const [inputChannels, setInputChannels] = useState<Channel[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const [loading, setLoading] = useState({
    inputUsers: false,
    inputChannels: false,
  });

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const channelDropdownRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setUsername('');
    setChannelId('');
    setSubmittedUsername('');
    setSubmittedChannelId('');
  };

  const fetchInputUsers = useCallback(async (inputUsername: string) => {
    if (loading.inputUsers || inputUsername.length < 1) return;

    setLoading((prev) => ({ ...prev, inputUsers: true }));
    try {
      const userUrl = new URL(
        'https://api.neynar.com/v2/farcaster/user/search'
      );
      userUrl.searchParams.append('q', inputUsername);
      userUrl.searchParams.append('limit', '5');

      const userResponse = await fetch(userUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!userResponse.ok)
        throw new Error('User search network response was not ok');
      const userData = await userResponse.json();
      setInputUsers(userData.result.users);
    } catch (error) {
      console.error('Error fetching input users:', error);
    } finally {
      setLoading((prev) => ({ ...prev, inputUsers: false }));
    }
  }, []);

  const fetchInputChannels = useCallback(async (inputChannelId: string) => {
    if (loading.inputChannels || inputChannelId.length < 1) return;

    setLoading((prev) => ({ ...prev, inputChannels: true }));
    try {
      const channelUrl = new URL(
        'https://api.neynar.com/v2/farcaster/channel/search'
      );
      channelUrl.searchParams.append('q', inputChannelId);
      channelUrl.searchParams.append('limit', '5');

      const channelResponse = await fetch(channelUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!channelResponse.ok)
        throw new Error('Channel search network response was not ok');
      const channelData = await channelResponse.json();
      setInputChannels(channelData.channels);
    } catch (error) {
      console.error('Error fetching input channels:', error);
    } finally {
      setLoading((prev) => ({ ...prev, inputChannels: false }));
    }
  }, []);

  const debouncedFetchInputUsers = useCallback(debounce(fetchInputUsers, 300), [
    fetchInputUsers,
  ]);
  const debouncedFetchInputChannels = useCallback(
    debounce(fetchInputChannels, 300),
    [fetchInputChannels]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length > 0) {
      setShowUserDropdown(true);
      debouncedFetchInputUsers(newUsername);
    } else {
      setShowUserDropdown(false);
      setSubmittedUsername('');
    }
  };

  const handleChannelIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChannelId = e.target.value;
    setChannelId(newChannelId);
    if (newChannelId.length > 0) {
      setShowChannelDropdown(true);
      debouncedFetchInputChannels(newChannelId);
    } else {
      setShowChannelDropdown(false);
      setSubmittedChannelId('');
    }
  };

  const handleUserSelect = (user: User) => {
    setUsername(user.username);
    setSubmittedUsername(user.fid.toString());
    setShowUserDropdown(false);
  };

  const handleChannelSelect = (channel: Channel) => {
    setChannelId(channel.name);
    setSubmittedChannelId(channel.id);
    setShowChannelDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowChannelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl h-full mx-auto bg-[#4C376C]">
      <div className="flex">
        <button
          className={`w-24 py-2 text-white font-jetbrains text-sm ${
            activeTab === 'casts' ? 'bg-[#333333]' : 'bg-black'
          }`}
          onClick={() => handleTabChange('casts')}
        >
          Casts
        </button>
        <button
          className={`w-24 py-2 text-white font-jetbrains text-sm border-l border-white ${
            activeTab === 'users' ? 'bg-[#333333]' : 'bg-black'
          }`}
          onClick={() => handleTabChange('users')}
        >
          Users
        </button>
      </div>

      <div className="flex flex-col sm:flex-row w-full justify-between sm:space-x-4">
        {activeTab === 'casts' && (
          <>
            <div className="relative w-full sm:w-1/2 sm:mb-0">
              <Input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSubmittedUsername(username);
                    setShowUserDropdown(false);
                  }
                }}
                placeholder="Username (optional)"
                className="w-full rounded-none bg-white text-black"
              />
              {showUserDropdown && (
                <div
                  ref={userDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none"
                >
                  <ul className="max-h-[300px] overflow-auto">
                    {inputUsers.map((user) => (
                      <li
                        key={user.fid}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleUserSelect(user)}
                      >
                        <img
                          src={user.pfp_url}
                          alt={user.display_name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="truncate">
                          {user.display_name} (@{user.username})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="relative w-full sm:w-1/2">
              <Input
                type="text"
                value={channelId}
                onChange={handleChannelIdChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSubmittedChannelId(channelId);
                    setShowChannelDropdown(false);
                  }
                }}
                placeholder="Channel ID (optional)"
                className="w-full rounded-none bg-white text-black"
              />
              {showChannelDropdown && (
                <div
                  ref={channelDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-none"
                >
                  <ul className="max-h-[300px] overflow-auto">
                    {inputChannels.map((channel) => (
                      <li
                        key={channel.id}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => handleChannelSelect(channel)}
                      >
                        <img
                          src={channel.image_url}
                          alt={channel.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="truncate">{channel.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {activeTab === 'casts' ? (
        <CastSearch
          searchQuery={searchQuery}
          username={submittedUsername}
          channelId={submittedChannelId}
        />
      ) : (
        <UserSearch searchQuery={searchQuery} />
      )}
    </div>
  );
};

export default SearchComponent;
```

# src/components/NetworkResponse.tsx

```tsx
import { hubs } from '@/constants';
import { isNumeric, capitalizeNickname, isFollowSyntax } from '@/lib/helpers';
import {
  extractIdentifierFromUrl,
  fetchCastAndFidData,
  extractUsernameFromUrl,
  isValidWarpcastUrl,
} from '@/lib/utils';
import { NeynarCastCard, NeynarProfileCard } from '@neynar/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next13-progressbar';
import { useState, useEffect } from 'react';
import ActionButtons from './ActionButtons';
import Modal from './modal-component';
import SkeletonHeader from './skeleton-header';
import * as amplitude from '@amplitude/analytics-browser';
import Search from './search';

const NetworkResponse = ({ identifier }: any) => {
  const router = useRouter();
  const fid: number | null = isNumeric(identifier) ? Number(identifier) : null;
  let hash = fid ? null : identifier;

  if (identifier.includes('https://www.supercast.xyz/c/')) {
    const extractedIdentifier = extractIdentifierFromUrl(identifier);
    if (extractedIdentifier) {
      identifier = extractedIdentifier;
      hash = extractedIdentifier;
    } else {
      console.error('Invalid URL identifier');
    }
  }
  const [data, setData] = useState<any>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOtherHubs, setShowOtherHubs] = useState(false);
  const [clickedHeader, setClickedHeader] = useState<string | null>(null);

  const checkWarning = (message: any) => {
    if (!message) return [];

    const missingObjects = [];
    let expectedUserTypes = [
      'USER_DATA_TYPE_PFP',
      'USER_DATA_TYPE_DISPLAY',
      'USER_DATA_TYPE_BIO',
      'USER_DATA_TYPE_USERNAME',
    ];
    if (message?.followedBy && message?.follow) {
      if (
        !message?.followedBy.type ||
        message?.followedBy.type !== 'MESSAGE_TYPE_LINK_ADD'
      ) {
        missingObjects.push('Followed By');
      }
      if (
        !message?.follow.type ||
        message?.follow.type !== 'MESSAGE_TYPE_LINK_ADD'
      ) {
        missingObjects.push('Following');
      }
      return missingObjects;
    }

    if (message?.messages) {
      const foundTypes = new Set();
      message.messages.forEach((msg: any) => {
        if (msg.data?.userDataBody?.type) {
          foundTypes.add(msg.data.userDataBody.type);
        }
      });

      return expectedUserTypes.filter((type) => !foundTypes.has(type));
    }

    const following = message?.following;
    const followedBy = message?.followed_by;

    if (following !== undefined && following === false)
      missingObjects.push('Following');
    if (followedBy !== undefined && followedBy === false)
      missingObjects.push('Followed By');
    if (followedBy !== undefined && following !== undefined) {
      return missingObjects;
    }

    const authorFid = message?.fid;
    const expectedUsername = `!${authorFid}`;
    const username = message?.username;
    const pfp = message?.pfp?.url || message?.pfp_url;
    const displayName = message?.display_name || message?.displayName;
    const bio = message?.profile?.bio?.text;

    if (!pfp) missingObjects.push('PFP');
    if (!displayName) missingObjects.push('Display Name');
    if (!bio) missingObjects.push('Bio');
    if (!username || username === expectedUsername)
      missingObjects.push('Username');

    return missingObjects;
  };

  const fetchData = async () => {
    setLoading(true);
    const data = (await fetchCastAndFidData(hash, fid)) as any;
    const warpcastAuthorMissing = checkWarning(data.apiData.warpcast?.author);
    const neynarAuthorMissing = checkWarning(
      data.apiData.neynar?.author?.author
    );
    const warpcastAuthorHubMissing = checkWarning(data.hubData?.[0]?.author);
    const neynarAuthorHubMissing = checkWarning(data.hubData?.[1]?.author);
    const warpcastCastMissing = [] as any;
    const neynarCastMissing = [] as any;

    setData({
      ...data,
      warpcastAuthorMissing,
      neynarAuthorMissing,
      warpcastAuthorHubMissing,
      neynarAuthorHubMissing,
      warpcastCastMissing,
      neynarCastMissing,
      warpcastCastHubMissing: [],
      neynarCastHubMissing: [],
    });

    setLoading(false);
  };

  useEffect(() => {
    void fetchData();
  }, [hash, fid]);

  const openModal = (
    title: string,
    response: any,
    missingObjects: string[]
  ) => {
    setModalTitle(title);
    setModalData({ ...response, missingObjects });
    setIsModalOpen(true);
    setClickedHeader(title); // Set the clicked header
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setClickedHeader(null); // Reset the clicked header
  };

  const { warpcast, neynar } = data?.apiData ?? {};
  const {
    warpcastAuthorMissing,
    neynarAuthorMissing,
    warpcastAuthorHubMissing,
    neynarAuthorHubMissing,
    warpcastCastMissing,
    neynarCastMissing,
    warpcastCastHubMissing,
    neynarCastHubMissing,
  } = data ?? {};

  const hubsData = data?.hubData ?? [];
  console.log(hubsData);
  const hoyt = hubsData[0] ?? {};
  const neynarHub = hubsData[1] ?? {};
  const { author: hoytAuthor, cast: hoytCast } = hoyt || {};
  const { author: neynarHubAuthor, cast: neynarHubCast } = neynarHub || {};
  const { author: warpcastAuthor, cast: warpcastCast } = warpcast || {};
  const { author: neynarAuthor, cast: neynarCast } = neynar || {};

  const authorFid =
    warpcastCast?.author?.fid ||
    neynarCast?.cast?.author?.fid ||
    neynarAuthor?.author?.fid ||
    warpcastAuthor?.author?.fid;

  const username =
    warpcastAuthor?.username ??
    neynarAuthor?.author?.username ??
    neynarCast?.cast?.author?.username ??
    warpcastCast?.cast?.author?.username ??
    null;
  const castHash = neynar?.cast?.cast?.hash ?? warpcast?.cast?.hash ?? null;

  const renderHeader = (label: string, data: any, missingObjects: any[]) => {
    if (!data) {
      return null;
    }

    let icon = '✅';
    let backgroundColor = '#03A800';
    let hoverColor = '#028700'; // Adjust hover color

    if (data?.is_server_dead) {
      icon = '❓';
      backgroundColor = '#FFA500';
      hoverColor = '#CC8400'; // Adjust hover color
    } else if (data?.error) {
      icon = '❌';
      backgroundColor = '#C67A7D';
      hoverColor = '#A66060'; // Adjust hover color
    } else if (missingObjects.length > 0) {
      icon = '⚠️';
      backgroundColor = '#FFD700';
      hoverColor = '#CCB300'; // Adjust hover color
    }

    const isClicked = clickedHeader === label;
    const activeColor = isClicked ? '#03039A' : backgroundColor;

    return (
      <button
        style={{ backgroundColor: activeColor }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = isClicked
            ? '#03039A'
            : hoverColor)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = isClicked
            ? '#03039A'
            : backgroundColor)
        }
        className="relative border border-white flex flex-col items-center justify-center min-h-6 min-w-[11.5rem]"
        onClick={() => openModal(label, data, missingObjects)}
      >
        <p className="text-center text-sm font-jetbrains">
          {label} {icon}
        </p>
      </button>
    );
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        toggleModal={closeModal}
        response={modalData}
        title={modalTitle}
      />
      <div className="w-full flex-1 items-center flex flex-row justify-center">
        <div className="flex flex-col space-y-0">
          <div className="bg-black flex flex-col">
            <div className="items-center flex flex-col px-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-0">
                {loading ? (
                  <>
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                    {<SkeletonHeader />}
                  </>
                ) : (
                  <>
                    {renderHeader(
                      'Warpcast API',
                      warpcastAuthor,
                      warpcastAuthorMissing
                    )}
                    {renderHeader(
                      'Warpcast API',
                      warpcastCast,
                      warpcastCastMissing
                    )}
                    {renderHeader(
                      capitalizeNickname(hoyt.name),
                      hoytAuthor,
                      warpcastAuthorHubMissing
                    )}
                    {renderHeader(
                      capitalizeNickname(hoyt.name),
                      hoytCast,
                      warpcastCastHubMissing
                    )}
                    {renderHeader(
                      'Neynar hub',
                      neynarHubAuthor,
                      neynarAuthorHubMissing
                    )}
                    {renderHeader(
                      'Neynar hub',
                      neynarHubCast,
                      neynarCastHubMissing
                    )}
                    {renderHeader(
                      'Neynar API',
                      neynarAuthor,
                      neynarAuthorMissing
                    )}
                    {renderHeader('Neynar API', neynarCast, neynarCastMissing)}
                    {!showOtherHubs ? (
                      <button
                        className="bg-[#4C376C] text-sm px-1 border border-white h-6 text-white hover:bg-purple-800 font-jetbrains"
                        onClick={() => {
                          amplitude.track('See more hubs', { identifier });
                          setShowOtherHubs(true);
                        }}
                      >
                        <div className="flex flex-row items-center">
                          Show other hubs{' '}
                          <img src="/eye.png" className="ml-1" />
                        </div>
                      </button>
                    ) : (
                      <button
                        className="bg-white text-black px-1 text-sm h-6 border border-white hover:bg-purple-800 font-jetbrains"
                        onClick={() => {
                          amplitude.track('Hide other hubs', { identifier });
                          setShowOtherHubs(false);
                        }}
                      >
                        <div className="flex flex-row items-center">
                          Hide other hubs{' '}
                          <img src="/eyecross.png" className="ml-1" />
                        </div>
                      </button>
                    )}
                    {showOtherHubs && (
                      <div>
                        {hubs.slice(2).map((hub, index) => {
                          const hubData = data?.hubData?.[index + 2];
                          const hubAuthor = hubData?.author;
                          const hubCast = hubData?.cast;
                          const missingObjectsAuthor = checkWarning(hubAuthor);
                          const missingObjectsCast: any[] = [];
                          return (
                            <div key={index}>
                              {renderHeader(
                                `${capitalizeNickname(hub.shortname)}`,
                                hubAuthor,
                                missingObjectsAuthor
                              )}
                              {renderHeader(
                                `${capitalizeNickname(hub.shortname)}`,
                                hubCast,
                                missingObjectsCast
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="hidden md:block">
                {hash && isFollowSyntax(hash) ? null : hash &&
                  !extractUsernameFromUrl(hash) ? (
                  <NeynarCastCard
                    type={isValidWarpcastUrl(identifier) ? 'url' : 'hash'}
                    identifier={identifier}
                    allowReactions={true}
                    customStyles={{
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: '#333333',
                      border: '0.915556px solid #FFFFFF',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  />
                ) : authorFid ? (
                  <NeynarProfileCard
                    fid={authorFid}
                    customStyles={{
                      color: 'white',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      background: '#333333',
                      border: '0.915556px solid #FFFFFF',
                      boxSizing: 'border-box',
                      borderRadius: '0px',
                    }}
                  />
                ) : null}
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-end gap-0 w-full">
              {loading ? null : castHash || username ? (
                <div className="flex flex-col justify-end">
                  {loading ? null : castHash || username ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        {' '}
                        <Button className="font-jetbrains bg-white text-black hover:bg-gray-200 text-md p-1 px-3 rounded-none ">
                          open
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white rounded-none">
                        <DropdownMenuItem
                          className="font-jetbrains bg-white"
                          onClick={(e) => {
                            router.push(
                              castHash
                                ? `https://warpcast.com/${username}/${castHash.slice(0, 10)}`
                                : `https://warpcast.com/${username}`
                            );
                          }}
                        >
                          in Warpcast
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="font-jetbrains"
                          onClick={(e) => {
                            router.push(
                              castHash
                                ? `https://www.supercast.xyz/c/${castHash}`
                                : `https://www.supercast.xyz/${username}`
                            );
                          }}
                        >
                          in Supercast
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-row justify-end">
            <ActionButtons fid={fid} hash={castHash} identifier={identifier} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkResponse;
```

# src/components/CastSearch.tsx

```tsx
// CastSearch.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NeynarCastCard } from '@neynar/react';
import { Loader2 } from 'lucide-react';

interface Cast {
  hash: string;
  text: string;
  author: {
    username: string;
    display_name: string;
    pfp_url: string;
  };
}

const CastSearch = ({
  searchQuery,
  username,
  channelId,
}: {
  searchQuery: string;
  username: string;
  channelId: string;
}) => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchCasts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchCasts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const castUrl = new URL(
        'https://api.neynar.com/v2/farcaster/cast/search'
      );
      castUrl.searchParams.append('q', searchQuery);
      castUrl.searchParams.append('limit', '20');

      if (cursor) {
        castUrl.searchParams.append('cursor', cursor);
      }

      if (username) {
        castUrl.searchParams.append('author_fid', username);
      }

      if (channelId) {
        castUrl.searchParams.append('channel_id', channelId);
      }

      const castResponse = await fetch(castUrl, {
        headers: {
          Accept: 'application/json',
          api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || '',
        },
      });

      if (!castResponse.ok)
        throw new Error('Cast search network response was not ok');
      const castData = await castResponse.json();
      const newCasts = castData.result.casts;

      setCasts((prevCasts) => [...prevCasts, ...newCasts]);
      setCursor(castData.result.next?.cursor || null);
      setHasMore(!!castData.result.next?.cursor);
    } catch (error) {
      console.error('Error fetching casts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('username:', username);
    console.log('channelId:', channelId);
    setCasts([]);
    setCursor(null);
    setHasMore(true);
    fetchCasts();
  }, [searchQuery, username, channelId]);

  const handleShowMore = (identifier: string) => {
    window.open(`/${identifier}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-0">
      {casts.map((cast, index) => (
        <div
          key={`${cast.hash}-${index}`}
          ref={index === casts.length - 1 ? lastCastElementRef : null}
          className="border border-gray-200 rounded-none  w-full h-full"
        >
          <NeynarCastCard
            customStyles={{
              color: 'white',
              maxWidth: '100%',
              minWidth: '400px',
              minHeight: '400px',
              maxHeight: '100%',
              overflowX: 'hidden',
              display: 'flex',
              flexDirection: 'row',
              border: 'none',
              alignItems: 'center',
              background: '#333333',
            }}
            type="hash"
            identifier={cast.hash}
          />
          <div className="p-2">
            <button
              className="w-full py-1 bg-[#4C376C] text-white text-sm rounded hover:bg-purple-800 font-jetbrains"
              onClick={() => handleShowMore(cast.hash)}
            >
              Show Network Response
            </button>
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-white font-jetbrains">
            Loading more casts...
          </span>
        </div>
      )}

      {!loading && casts.length === 0 && (
        <p className="text-center text-white font-jetbrains">No casts found</p>
      )}
    </div>
  );
};

export default CastSearch;
```

# src/components/AuthButton.tsx

```tsx
'use client';
import { NeynarAuthButton, useNeynarContext } from '@neynar/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AuthButton = () => {
  const { isAuthenticated } = useNeynarContext();
  return (
    <Dialog>
      <DialogTrigger className="font-jetbrains   md:w-full w-16 h-9 md:h-full text text-white bg-gray-700 hover:bg-gray-600  p-1.5 px-2 rounded">
        <p className="text-sm md:text-md">
          {!isAuthenticated ? 'sign in' : 'sign out'}
        </p>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isAuthenticated ? 'Sign out' : 'Sign in'}</DialogTitle>
          <DialogDescription className="flex items-center justify-center">
            <NeynarAuthButton />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AuthButton;
```

# src/components/ActionButtons.tsx

```tsx
import React, { useState } from 'react';
import Link from 'next/link'; // Assuming you're using Next.js for routing
import { CopyCheckIcon, CopyIcon, UserIcon, SearchIcon } from 'lucide-react';
import * as amplitude from '@amplitude/analytics-browser';
import { useClipboard } from '@/hooks/useClipboard';

const ActionButtons = ({ fid, hash, identifier }: any) => {
  const { copied, copy } = useClipboard();
  return (
    <div className="gap-0 flex justify-end">
      {fid || hash ? (
        <button
          className="font-jetbrains bg-white text-black    border border-white hover:bg-gray-200 font-jetbrains"
          onClick={() => {
            amplitude.track('Click on identifier', {
              identifier,
            });
            copy(fid ? fid.toString() : hash || '');
          }}
        >
          <div className="font-jetbrains flex flex-row px-1 h-6 items-center">
            {copied ? (
              <>
                <p className="text-md">copied&nbsp;</p>{' '}
                <CopyCheckIcon className="w-4 h-4 mr-1" />
              </>
            ) : (
              <>
                <p className="text-md">
                  copy {fid ? ' user fid' : ' cast hash'}
                </p>{' '}
                <CopyIcon className="w-3 h-3 ml-1" />
              </>
            )}
          </div>
        </button>
      ) : null}
    </div>
  );
};

export default ActionButtons;
```

# .github/workflows/ci.yml

```yml
name: ci

on:
  push:
    branches: ['main']
  pull_request:
    types: [opened, synchronize]

jobs:
  check:
    name: Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm install
        env:
          HUSKY: 0
      - run: npm run lint
      - run: npm run prettier
```

# .husky/\_/prepare-commit-msg

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/pre-rebase

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/pre-push

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/pre-commit

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/pre-auto-gc

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/pre-applypatch

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/post-rewrite

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/post-merge

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/post-commit

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/post-checkout

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/post-applypatch

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/husky.sh

```sh

```

# .husky/\_/h

```
#!/usr/bin/env sh
[ "$HUSKY" = "2" ] && set -x
h="${0##*/}"
s="${0%/*/*}/$h"

[ ! -f "$s" ] && exit 0

for f in "${XDG_CONFIG_HOME:-$HOME/.config}/husky/init.sh" "$HOME/.huskyrc"; do
	# shellcheck disable=SC1090
	[ -f "$f" ] && . "$f"
done

[ "${HUSKY-}" = "0" ] && exit 0

sh -e "$s" "$@"
c=$?

[ $c != 0 ] && echo "husky - $h script failed (code $c)"
[ $c = 127 ] && echo "husky - command not found in PATH=$PATH"
exit $c
```

# .husky/\_/commit-msg

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/applypatch-msg

```
#!/usr/bin/env sh
. "${0%/*}/h"
```

# .husky/\_/.gitignore

```
*
```

# src/app/[identifier]/page.tsx

```tsx
'use client';
import CastSearch from '@/components/CastSearch';
import NetworkResponse from '@/components/NetworkResponse';
import Search from '@/components/search';
import SearchComponent from '@/components/SearchComponent';

interface ResponseProps {
  params: { identifier: string };
}

const isNetworkResponse = (identifier: string): boolean => {
  const patterns = [
    /^https:\/\/www\.supercast\.xyz\/[^/]+$/,
    /^https:\/\/www\.supercast\.xyz\/c\/[^/]+$/,
    /^https:\/\/warpcast\.com\/[^/]+$/,
    /^https:\/\/warpcast\.com\/[^/]+\/[^/]+$/,
    /^0x[a-fA-F0-9]{40}$/,
    /^\d+$/, // This pattern matches any string consisting only of digits
  ];

  return patterns.some((pattern) => pattern.test(identifier));
};

export default function Page({ params }: ResponseProps) {
  let identifier = decodeURIComponent(params.identifier);

  const isSearch = !isNetworkResponse(identifier);

  return (
    <div className="w-full flex-1 items-center flex flex-row justify-center">
      <div className="flex flex-col max-w-3xl space-y-0">
        <div className="">
          <div className="p-1 text-center bg-black border border-white w-[40%]">
            <p className="text-white  text-[15px] font-jetbrains">
              showing results for:
            </p>
          </div>
        </div>

        <div className="flex ">
          <Search />
        </div>
        {isSearch ? (
          <SearchComponent initialQuery={encodeURIComponent(identifier)} />
        ) : (
          <NetworkResponse identifier={identifier} />
        )}
      </div>
    </div>
  );
}
```

# src/app/frames/route.tsx

```tsx
/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next';
import { frames } from './frames';
import { seo } from '@/constants';

function constructCastActionUrl(params: { url: string }): string {
  const baseUrl = 'https://warpcast.com/~/add-cast-action';
  const urlParams = new URLSearchParams({
    url: params.url,
  });

  return `${baseUrl}?${urlParams.toString()}`;
}

export const GET = frames(async (ctx) => {
  const installFrameActionUrl = constructCastActionUrl({
    url: `${seo.url}/frames/actions/view-on-explorer`,
  });
  return {
    image: seo.ogImage,
    buttons: [
      <Button action="link" target={seo.url}>
        View Explorer
      </Button>,
      <Button action="link" target={installFrameActionUrl}>
        Install Cast Action
      </Button>,
    ],
  };
});
```

# src/app/frames/frames.ts

```ts
import { createFrames } from 'frames.js/next';

export type State = {
  count: number;
};

export const frames = createFrames<State>({
  initialState: {
    count: 0,
  },
  basePath: '/frames',
});
```

# src/components/ui/tabs.tsx

```tsx
'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
```

# src/components/ui/select.tsx

```tsx
'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
```

# src/components/ui/popover.tsx

```tsx
'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
```

# src/components/ui/input.tsx

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
```

# src/components/ui/dropdown-menu.tsx

```tsx
'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSub = DropdownMenuPrimitive.Sub;

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      'px-2 py-1.5 text-sm font-semibold',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest opacity-60', className)}
      {...props}
    />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
```

# src/components/ui/dialog.tsx

```tsx
'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
```

# src/components/ui/collapsible.tsx

```tsx
'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
```

# src/components/ui/card.tsx

```tsx
import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

# src/components/ui/button.tsx

```tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

# src/components/ui/avatar.tsx

```tsx
'use client';

import * as React from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

import { cn } from '@/lib/utils';

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
```

# src/app/frames/actions/view-on-explorer/route.tsx

```tsx
import { NextRequest } from 'next/server';
import { frames } from '../../frames';
import { ActionMetadata } from 'frames.js';
import { seo } from '@/constants';

export const GET = async (req: NextRequest) => {
  const actionMetadata: ActionMetadata = {
    action: {
      type: 'post',
    },
    icon: 'info',
    name: 'View on Neynar Explorer',
    aboutUrl: `${seo.url}`,
    description: 'View the details of a cast on Neynar Explorer',
  };

  return Response.json(actionMetadata);
};

export const POST = frames(async (ctx) => {
  const hash = ctx.message?.castId?.hash;
  return Response.json({
    message: `View on Neynar Explorer`,
    link: `${seo.url}/${hash}`,
    type: 'message',
  });
});
```
