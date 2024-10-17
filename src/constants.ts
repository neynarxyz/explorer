export const seo = {
  title: 'Farcaster Explorer',
  description: 'Explore event propogation on farcaster.',
  ogImage: 'https://explorer.neynar.com/neynarplanet.png',
  url: 'https://explorer.neynar.com',
};

const additionalHubs =
  process.env.ADDITIONAL_HUBS?.split(',').map((hub) => hub.trim()) || [];

const extractFirstLetter = (hubUrl: string) => {
  const hubName = hubUrl.match(/https?:\/\/([^.]+)\.hubs\.neynar\.com/);
  return hubName ? hubName[1].charAt(0).toUpperCase() : 'Unknown';
};

const defaultHubs = [
  {
    shortname: 'Warpcast hub (Lamia)',
    url: 'https://lamia.farcaster.xyz:2281',
  },
  { shortname: 'Neynar hub', url: 'https://hub-api.neynar.com' },
  { shortname: 'Warpcast hub (Hoyt)', url: 'https://hoyt.farcaster.xyz:2281' },
];

export const hubs = [
  ...defaultHubs,
  ...additionalHubs.map((hubUrl) => {
    const firstLetter = extractFirstLetter(hubUrl);
    return {
      shortname: `Neynar hub ${firstLetter}`,
      url: hubUrl,
    };
  }),
];

export const neynarHub = {
  shortname: 'Neynar hub-api',
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
