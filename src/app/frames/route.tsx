/* eslint-disable react/jsx-key */
import { Button } from 'frames.js/next';
import { frames } from './frames';
import { seo } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';

function constructCastActionUrl(params: { url: string }): string {
  const baseUrl = 'https://warpcast.com/~/add-cast-action';
  const urlParams = new URLSearchParams({
    url: params.url,
  });

  return `${baseUrl}?${urlParams.toString()}`;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const installFrameActionUrl = constructCastActionUrl({
    url: `${seo.url}/frames/actions/view-on-explorer`,
  });

  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Neynar Explorer Frame</title>
        <meta property="og:title" content="Neynar Explorer Frame" />
        <meta property="og:image" content="${seo.ogImage}" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="${seo.ogImage}" />
        <meta name="fc:frame:button:1" content="View Explorer" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="${seo.url}" />
        <meta name="fc:frame:button:2" content="Install Cast Action" />
        <meta name="fc:frame:button:2:action" content="link" />
        <meta name="fc:frame:button:2:target" content="${installFrameActionUrl}" />
      </head>
      <body>
        <p>This is a Farcaster Frame for the Neynar Explorer.</p>
      </body>
    </html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}
