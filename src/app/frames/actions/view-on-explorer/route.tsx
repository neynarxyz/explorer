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

export const POST = frames(async (ctx: any) => {
  const hash = ctx.message?.castId?.hash;

  return {
    image: seo.ogImage,
    buttons: [
      <Button action="link" target={`${seo.url}/${hash}`}>
        View on Neynar Explorer
      </Button>,
    ],
  };
});
