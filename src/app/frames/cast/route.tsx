import { NextRequest } from "next/server";
import { frames } from "../frames";
import { ActionMetadata } from "frames.js";
import { Button } from "frames.js/next";
import { seo } from "@/constants";

export const GET = frames(async (ctx) => {
    const hash = ctx.searchParams.hash;
    return {
      image: `https://client.warpcast.com/v2/cast-image?castHash=${hash}`,
      imageOptions: {
        aspectRatio: '1:1'
      },
      buttons: [
        <Button key={"view"} action="link" target={`${seo.url}/${hash}`}>
          View on Neynar Explorer
        </Button>,
        <Button key="install" action="link" target={`https://warpcast.com/~/add-cast-action?url=${seo.url}/frames/actions/view-on-explorer`}>
        Install Cast Action
      </Button>
      ],
    };
  })