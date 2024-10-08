/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next';
import { seo } from '@/constants';
import { frames } from '../../frames';

function constructCastActionUrl(params: { url: string }): string {
  const baseUrl = 'https://warpcast.com/~/add-cast-action';
  const urlParams = new URLSearchParams({
    url: params.url,
  });

  return `${baseUrl}?${urlParams.toString()}`;
}

export const GET = frames(async (ctx: any) => {
  const actionMetadata = {
    action: {
      type: 'post',
    },
    icon: 'info',
    name: 'View on Neynar Explorer',
    aboutUrl: `${seo.url}`,
    description: 'View the details of a cast on Neynar Explorer',
  };
  return Response.json(actionMetadata);
});

export const POST = frames(async (ctx) => {
  const hash = ctx.message?.castId?.hash;
  return Response.json({
    message: `View on Neynar Explorer`,
    link: `${seo.url}/${hash}`,
    type: 'message',
  });
});
